import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { blue, yellow } from '../constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/user';
import { StatusBar } from 'expo-status-bar';

const Login = ({user}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
   try{ 
    const res = await axios.post('http://182.70.253.15:8000/api/Login', {username , password})
    if(res?.data?.access){
        dispatch(login(res.data));
    }
    else{
        Alert.alert('Invalid Credentials');
    }
    console.log(res.data);
}catch(err){
  Alert.alert('Something went wrong');
  // Alert.alert(err);
  console.log(err);
}finally{
  setLoading(false);
}
};

 const handleForgotPasswordPress = () => {
    Alert.alert('In progress');
 }
 const image = {uri: 'https://img.freepik.com/free-vector/gradient-gray-futuristic-digital-bokeh-background_53876-116445.jpg?t=st=1723283687~exp=1723287287~hmac=ac01ce3d08970b64de07e7f8c13830f95cd5cf30da2bd556e8cfef411de33e25&w=740'};

  return (
    <>
    <StatusBar style="auto"/>
    <View style={styles.container}>
      <ImageBackground source={image} style={{
        flex: 1,
        justifyContent: 'center',
      }} resizeMode='cover'>

      <View style={{
        alignItems: 'center',
        paddingHorizontal:40,
        width: '100%',
        marginTop:100,
      }}>
      <Image source={require('../assets/logo.png')} style={{
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
      }}/>
      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        color: blue,
      }}>Sage Anandam!</Text>
      <View style={styles.loginBox}>

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
          <Text style={[loading && {color:'gray'},  styles.buttonText]}>{loading ? 'Loading...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPasswordPress} style={{ width:'100%'}}><Text style={{textAlign:'right'}}>Forgot Password</Text></TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
    </View>
</>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    flexDirection:"row",
    },
    loginBox:{
        width:'100%',
        alignItems:'center',
        // backgroundColor:'red',
       paddingHorizontal:0,
       paddingVertical:20,
        borderRadius:10,
        // elevation:10,
    },
    input:{
        width:'100%',
        backgroundColor:'#fff',
        padding:10,
        borderRadius:5,
        marginVertical:10,
        borderWidth:1,
        borderColor:'black',
    },
    button:{
      marginVertical:10,
      width:'70%',
      textAlign:'center',
      backgroundColor:blue,
      borderRadius:30
    },
    buttonText:{
      color:'white',
      paddingVertical:15,
      padding:10,
      textAlign:'center',
    }
});

export default Login;
