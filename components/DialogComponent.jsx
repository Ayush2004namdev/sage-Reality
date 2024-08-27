import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { blue } from '../constants'; // Import your color constants
import { setShowPopupDialog } from '../redux/slices/misc';

const { width, height } = Dimensions.get('window');

const DialogComponent = ({ title = '', message = '', navigate, to, cancel = false, workDone = true , setShowLocationError=false }) => {
  const dispatch = useDispatch();

  const handleOkbuttonPress = () => {
    if(setShowLocationError){
      setShowLocationError(false);
      return;
    }
    dispatch(setShowPopupDialog(false));
    if (!workDone) return;
    if (navigate && to) {
      navigate(to);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.dialogContainer}>
        <LottieView
          source={workDone ? require('../assets/success.json') : require('../assets/error.json')} // Replace with your Lottie file paths
          autoPlay
          loop={false}
          style={styles.lottie}
        />

        <Text style={styles.text}>{title}</Text>
        <Text style={{ marginBottom: 15 }}>{message}</Text>

        <View style={styles.buttonContainer}>
          <View style={{ flexGrow: 1 }}>
            {cancel && (
              <TouchableOpacity style={[styles.button, { backgroundColor: 'white', borderColor: blue }]}>
                <Text style={[styles.buttonText, { color: blue }]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleOkbuttonPress} style={[styles.button, { backgroundColor: blue }]}>
            <Text style={[styles.buttonText, { color: 'white' }]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  dialogContainer: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  lottie: {
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DialogComponent;
