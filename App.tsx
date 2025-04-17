/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Alert, View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';

const App = () => {
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
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


    fetch('http://192.168.100.10:3000/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'  },
      body: formBody
    }).catch(err => console.log("Failed to send location", err));
  };

  const startTracking = () => {
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
  };

  useEffect(() => {
    requestPermission().then(granted => {
      if (granted) {
        startTracking();
      } else {
        Alert.alert('Permission denied');
      }
    });

    return () => BackgroundTimer.stopBackgroundTimer();
  }, []);
  return (
    <View>
      <Text>Latitude: {latitud}</Text>
      <Text>Longitude: {longitud}</Text>
    </View>
  );
  //return null; 
};
export default App;
