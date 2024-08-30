import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { setNewSageMitra } from '../redux/slices/misc';

// http://10.22.130.15:8000/api
const submitForm = async (url, data , user , setShowPopupDialog  , loadingFunction , dispatch,addSageMitra = false ) => {
  

    const res = await axios.post(
        `http://182.70.253.15:8000/api/${url}`,
        // `http://10.22.130.15:8000/api/${url}`,
        {
          ...data,
        },
        {
          withCredentials: true,
          headers: {
Authorization: `Bearer ${user.access}`,
          },
        }
      );
      loadingFunction(false);
      if(res?.data?.error) return dispatch(setShowPopupDialog({title: "Error", message: res.data.error || 'Something went wrong' , workDone: false}));
      // Alert.alert("Success", res.data.success , [{ text: "OK" }]);
      if(addSageMitra) dispatch(setNewSageMitra([data.new_sm_name , data.new_sm_contact]));
      loadingFunction(false);

      return dispatch(setShowPopupDialog({title: "Success", message: res.data.success || 'Form submitted successfully' , workDone: true , to: 'Dashboard'}));
      // dispatch(setShowPopupDialog({title: "Success", message: res.data.success || 'Form submitted successfully' , workDone: true , to: 'Dashboard'}));
}

const takeImage = async (setterFucntion) => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setterFucntion(prev => ({ ...prev, image: result.assets[0] }));
    }
  };


export {
  submitForm,
  takeImage
};
