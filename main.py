import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt
from cassandra.cluster import Cluster
import pandas as pd
import plotly.express as px
import dash
from dash import dcc, html
from dash.dependencies import Input, Output

app = Flask(__name__)
CORS(app)

cassandra_host = ['127.0.0.1']
cassandra_keyspace = 'mqtt_data'
table_name = 'sensor_data'
devices_table = 'devices'

cluster = Cluster(cassandra_host)
session = cluster.connect()
session.set_keyspace(cassandra_keyspace)

insert_query = f"INSERT INTO {table_name} (id, timestamp, temperature, humidity, device_id) VALUES (%s, %s, %s, %s, %s)"
insert_device_query = f"INSERT INTO {devices_table} (device_name, topic) VALUES (%s, %s)"

mqtt_broker = "ad99e78ecbdb40199abf8d9c0b18a3de.s1.eu.hivemq.cloud"
mqtt_port = 8883
mqtt_user = "mhmdfanoun"
mqtt_password = "fanoun@@12A"
mqtt_topics = {}

devices = {}

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
        subscribe_to_all_devices()
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        device_id = msg.topic.split('/')[-1]
        temperature = payload.get("temperature")
        humidity = payload.get("humidity")

        if temperature is not None and humidity is not None:
            print(f"Received -> Device: {device_id}, Temperature: {temperature}, Humidity: {humidity}")
            session.execute(
                insert_query,
                (uuid.uuid4(), datetime.now(), float(temperature), float(humidity), device_id)
            )
            print("Data stored in Cassandra")
    except Exception as e:
        print(f"Error processing message: {e}")

mqtt_client = mqtt.Client()
mqtt_client.username_pw_set(mqtt_user, mqtt_password)
mqtt_client.tls_set()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

mqtt_client.connect(mqtt_broker, mqtt_port)
mqtt_client.loop_start()

def subscribe_to_all_devices():
    query = f"SELECT * FROM {devices_table}"
    rows = session.execute(query)
    for row in rows:
        topic = row.topic
        mqtt_client.subscribe(topic)
        print(f"Subscribed to topic: {topic}")


@app.route('/devices', methods=['GET'])
def get_devices():
    query = f"SELECT * FROM {devices_table}"
    rows = session.execute(query)
    device_list = [{"device_name": row.device_name, "topic": row.topic} for row in rows]
    return jsonify(device_list)

@app.route('/device/<device_id>', methods=['GET'])
def get_device_data(device_id):
    query = f"SELECT * FROM {table_name} WHERE device_id = %s"
    rows = session.execute(query, [device_id])
    data = [{'timestamp': row.timestamp, 'temperature': row.temperature, 'humidity': row.humidity} for row in rows]
    return jsonify(data)

@app.route('/device', methods=['POST'])
def add_device():
    device_name = request.json.get('name')
    
    topic = f"sensors/{device_name}"
    query = f"SELECT * FROM {devices_table} WHERE device_name = %s"
    rows = session.execute(query, [device_name])
    if rows:
        return jsonify({"error": "Device already exists in the database"}), 400
    try:
        session.execute(insert_device_query, (device_name, topic))
        mqtt_topics[device_name] = topic
        mqtt_client.subscribe(topic)
        print(f"Subscribed to topic: {topic}")
        
        return jsonify({"message": "Device added", "device_name": device_name, "topic": topic}), 201
    except Exception as e:
        print(f"Error adding device: {e}")
        return jsonify({"error": "Error adding device"}), 500
dash_app = dash.Dash(__name__, server=app, url_base_pathname='/dashboard/')

dash_app.layout = html.Div([
    html.H1("Device Data Dashboard"),
    
    dcc.Dropdown(
        id='device-dropdown',
        options=[],  
        placeholder="Select a device"
    ),
    
    dcc.Graph(id='device-data-graph')
])

@dash_app.callback(
    Output('device-dropdown', 'options'),
    Input('device-dropdown', 'value')
)
def update_device_dropdown(selected_device):
    query = f"SELECT * FROM {devices_table}"
    rows = session.execute(query)
    options = [{'label': row.device_name, 'value': row.device_name} for row in rows]
    return options

@dash_app.callback(
    Output('device-data-graph', 'figure'),
    Input('device-dropdown', 'value')
)
def update_device_data_graph(device_name):
    if not device_name:
        return {}
    
    query = f"SELECT * FROM {table_name} WHERE device_id = %s"
    rows = session.execute(query, [device_name])
    data = [{'timestamp': row.timestamp, 'temperature': row.temperature, 'humidity': row.humidity} for row in rows]
    
    df = pd.DataFrame(data)
    
    if df.empty:
        return {}
    
    fig = px.line(df, x='timestamp', y=['temperature', 'humidity'], title=f"Device Data for {device_name}")
    fig.update_layout(xaxis_title="Timestamp", yaxis_title="Value")
    
    return fig

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
