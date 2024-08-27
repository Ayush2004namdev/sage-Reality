import * as Location from 'expo-location';
import { Alert } from 'react-native';

const formatDate = (timestamp)  =>{
    const date = new Date(timestamp);
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
  
    return `${year}-${month}-${day}`;
  }


  const getLocation = async() => {
    
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('reached here');
        Alert.alert('Permission Denied' , 'Please enable location permission to use this feature' , [{text:'OK'}]);
        throw new Error('Permission to access location was denied');
        return;
      }
      console.log('reached here 2');

      let location = await Location.getCurrentPositionAsync({});
      return location;
  }

  export { formatDate ,getLocation}