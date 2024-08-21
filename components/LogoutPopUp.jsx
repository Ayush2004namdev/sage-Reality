import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { blue } from '../constants';
import { setIsMenuOpen, setLogoutPopup, toggleAdd } from '../redux/slices/misc';
import { logout } from '../redux/slices/user';

const { width, height } = Dimensions.get('window');

const LogoutPopUp = ({navigate}) => {

    const dispatch = useDispatch();

    const onCancel = () => {
        dispatch(setLogoutPopup(false));
    }

    const onConfirm = () => {
        dispatch(setLogoutPopup(false));
        dispatch(logout());
        dispatch(setIsMenuOpen(false));
        dispatch(toggleAdd(false));
        navigate('Dashboard');
    // navigation.navigate('Dashboard');
    }

  return (
    <View style={styles.overlay}>
      <View style={styles.popupContainer}>
        <Text style={styles.message}>Are you sure you want to logout?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Yes</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: blue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: '45%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderColor: blue,
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: blue,
  },
  cancelButtonText: {
    color: blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogoutPopUp;
