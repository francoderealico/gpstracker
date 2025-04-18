/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import {  TextInput, Button } from 'react-native';
import { PermissionsAndroid, Platform, Alert, View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';

const App = () => {
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [apiUrl, setApiUrl] = useState('http://192.168.100.10:3000/api/location');
  const [isTracking, setIsTracking] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const sendLocation = (latitud: number, longitud: number) => {
    const body = {   lat: latitud,   lon: longitud, track: "TROLL"};
    const formBody = Object.keys(body).map(key =>      encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&');


    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'  },
      body: formBody
    }).catch(err => console.log("Failed to send location", err));
  };

  const startTracking = () => {
   // requestPermission;
    BackgroundTimer.runBackgroundTimer(() => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLatitud( latitude);
          setLongitud(longitude);
          console.log('Sending location:', latitude, longitude);
          sendLocation(latitude, longitude);
          
        },
        error => console.error(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, 30000); // every 30 sec
    setIsTracking(true);
  };

  return (
    <View style={{ padding: 20 }}>
    {!isTracking ? (
      <>
        <Text>Enter API URL:</Text>
        <TextInput
          defaultValue='http://192.168.100.10:3000/api/location'
          placeholder= 'http://192.168.100.10:3000/api/location'
          value={apiUrl}
          onChangeText={setApiUrl}
          style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        />
        <Button title="Start Tracking" onPress={startTracking} disabled={!apiUrl} />
      </>
    ) : (
      <Text>Tracking started! Sending to: {apiUrl}</Text>
    )}
   <Text>Latitud: {latitud}</Text>
   <Text>Longitud: {longitud}</Text>
  </View>


 
  );
  //return null; 
};
export default App;
