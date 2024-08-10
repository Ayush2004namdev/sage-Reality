import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { blue, yellow } from '../constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/user';

const Login = ({setUserLoggedIn,user,dispatch}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setLoading(true);
   try{ 
    const res = await axios.post('http://10.22.130.15:8000/api/Login', {username , password})
    if(res?.data?.access){
        dispatch(login(res.data));
        setUserLoggedIn(true);
    }
    else{
        Alert.alert('Invalid Credentials');
    }
    console.log(res.data);
}catch(err){
    console.log(err);
}finally{
  setLoading(false);
}
  };

 const handleForgotPasswordPress = () => {
    Alert.alert('isse kuch nhi hota');
 }

  return (
    <LinearGradient
      
      colors={[yellow, blue]}
      style={styles.container}
    >
      <View style={styles.loginBox}>
        <Text style={styles.title}>Sage Anandam!</Text>

        <TextInput
          style={styles.input}
          placeholder='Username'
          placeholderTextColor='#aaa'
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor='#aaa'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.button}>
          <Text style={loading ? {color:'gray'} : styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPasswordPress} style={{ width:'100%'}}><Text style={{textAlign:'right'}}>Forgot Password</Text></TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#002f6c',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffc107',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#002f6c',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
