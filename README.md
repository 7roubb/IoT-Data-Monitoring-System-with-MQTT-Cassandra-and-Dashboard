# **IoT Data Monitoring System**
![image](https://github.com/user-attachments/assets/7b6435ad-d2a3-46c1-bc76-7eba5189b0c7)

## **Overview**
The IoT Data Monitoring System is designed for collecting, storing, and visualizing sensor data from ESP32 devices in real time. It leverages MQTT for communication, Cassandra for storage, and a user-friendly dashboard for data visualization. The system is scalable, allowing dynamic addition of devices, and is ideal for monitoring environmental conditions like temperature and humidity.

---

## **Key Features**
- **Real-Time Data Collection**: 
  Receives sensor data (temperature and humidity) from ESP32 devices via MQTT topics.
  
- **Dynamic Device Management**:
  Easily add new devices and their MQTT topics through an API.

- **Scalable Storage**:
  Uses Cassandra for high-performance storage of time-series data.

- **Interactive Dashboard**:
  Visualize data trends for specific devices using a web-based interface.

---

## **How It Works**
1. **ESP32 Devices**: 
   Collect temperature and humidity data using sensors and publish it to MQTT topics.

2. **MQTT Broker**:
   Acts as a central hub, ensuring the messages from devices reach the backend system.

3. **Backend**:
   A Flask-based service that listens to MQTT topics, stores incoming data in Cassandra, and provides APIs for managing devices and querying data.

4. **Dashboard**:
   Built with Dash and Plotly, it displays device-specific data in interactive line charts.

---

## **Use Cases**
- Environmental monitoring in smart homes or offices.
- Industrial IoT systems tracking environmental parameters.
- Academic projects focusing on IoT and data visualization.

---

## **Requirements**
1. **Software**:
   - Cassandra for database storage.
   - MQTT broker (e.g., HiveMQ Cloud).

2. **Hardware**:
   - ESP32 microcontroller.
   - DHT11/DHT22 sensor for temperature and humidity.

3. **Networking**:
   - ESP32 devices must be connected to the internet to publish data to the MQTT broker.

---

## **Project Highlights**
- **IoT Integration**: 
  Seamless connectivity with ESP32 devices and real-time MQTT communication.
  
- **Data Persistence**: 
  Uses Cassandra for efficient storage and querying of large datasets.
  
- **User-Friendly Interface**: 
  The dashboard provides clear insights into device performance and environmental trends.

---

## **Potential Enhancements**
- Add support for more sensor types.
- Implement alerting for specific conditions (e.g., high temperature).
- Add user authentication for enhanced security.
- Deploy the system to a cloud environment for wider accessibility.

---

## **Authors**
This project was developed as part of an IoT-based initiative connecting hardware and software for real-time data monitoring.
