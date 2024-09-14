import * as ImagePicker from "expo-image-picker";
const takeImage = async (setterFucntion) => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      aspect: [4,3],
      allowsEditing: true,
      base64: true,
      quality: 0,
    });

    if (!result.canceled) {
      setterFucntion(prev => ({ ...prev, image: result.assets[0] }));
    }
  };

  export default takeImage;