import * as ImagePicker from "expo-image-picker";
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

  export default takeImage;