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

  const trimFeilds = (formState , setFormState) => {
    const newState = {...formState};
    for(const key in newState){
      if(typeof newState[key] === 'string'){
        newState[key] = newState[key].trim();
      }
    }
    setFormState(newState);
    // return newState;
  }


  export { formatDate ,getLocation , trimFeilds}