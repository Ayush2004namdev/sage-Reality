import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import { blue } from "../constants";
import { login } from "../redux/slices/user";
import { current } from "@reduxjs/toolkit";
import Loader from "../components/Loading";

const { height, width } = Dimensions.get("window");

const Login = ({ user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [access, setAccess] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://182.70.253.15:8000/api/Login", {
        username,
        password,
      });
      if (res?.data?.access) {
        dispatch(login(res.data));
      } else {
        Alert.alert("Invalid Credentials");
      }
      // console.log(res.data);
    } catch (err) {
      Alert.alert("Something went wrong");
      // Alert.alert(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordPress = () => {
    setPassword("");
    setUsername("");
    setShowForgetPassword(true);
    // Alert.alert('In progress');
  };
  const image = {
    uri: "https://img.freepik.com/free-vector/gradient-gray-futuristic-digital-bokeh-background_53876-116445.jpg?t=st=1723283687~exp=1723287287~hmac=ac01ce3d08970b64de07e7f8c13830f95cd5cf30da2bd556e8cfef411de33e25&w=740",
  };

  const handleForgotPasswordSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://182.70.253.15:8000/api/Forget-password",
        {
          username,
          current_password: password,
        }
      );
      if (res?.data.data['access']) {
        setShowForgetPassword(false);
        setShowResetPassword(true);
        setPassword("");
        setOldPassword('');
        setNewPassword('');
        setAccess(res.data.data['access']);
      }
      console.log(res.data.data['access']);
    } catch (err) {
      Alert.alert("Error", "Something went wrong", [{ text: "Ok" }]);
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try{

      const res = await axios.post(
        "http://182.70.253.15:8000/api/Reset-password",
        {
          password : oldPassword,
          confirm_password : newPassword,
          username : username,
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if(res.data['success']){
        Alert.alert("Success", "Password reset successfully", [{ text: "Ok" }]);
        setShowResetPassword(false);
        return;
      }
      else{
        Alert.alert("Error", "Something went wrong", [{ text: "Ok" }]);
      }
    // console.log(res.data['success']);
    // setShowResetPassword(false);
    // d =   [password, confirm_password, username, access token]
  }catch(err){
    Alert.alert("Error", "Something went wrong", [{ text: "Ok" }]);
    console.log(err);
  }
  finally{
    setLoading(false);
    setUsername("");
    setPassword("");
    setOldPassword("");
    setNewPassword("");
    setAccess("");
    setShowForgetPassword(false);
    // setShowResetPassword(false);
  }
  };

  return loading ? <Loader/> : (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <ImageBackground
          source={image}
          style={{
            flex: 1,
            justifyContent: "center",
          }}
          resizeMode="cover"
        >
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 40,
              width: "100%",
              marginTop: 100,
            }}
          >
            <Image
              source={require("../assets/finalFav.png")}
              style={{
                width: 180,
                height: 180,
                resizeMode: "contain",
                marginBottom: 20,
              }}
            />
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: blue,
              }}
            >
              Sage Realty
            </Text>
            <View style={styles.loginBox}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={styles.button}
              >
                <Text style={[loading && { color: "gray" }, styles.buttonText]}>
                  {loading ? "Loading..." : "Login"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleForgotPasswordPress}
                style={{ width: "100%" }}
              >
                <Text style={{ textAlign: "center" , marginTop:5 , fontWeight:'bold' , color:blue }}>Forget Password</Text>
              </TouchableOpacity>
            </View>
          </View>
          {showForgetPassword && (
            <Pressable
              onPress={() => {
                setShowForgetPassword(false);
                setPassword("");
                setUsername("");
              }}
              style={{
                width: width,
                height: height,
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 999,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: "white",
                  minWidth: width - 40,
                  // minHeight: height / 2.2,
                  marginHorizontal: 20,
                  marginVertical: height / 4,
                  borderRadius: 10,
                  padding: 20,
                  alignItems: "center",
                }}
                onPress={(e) => e.stopPropagation()}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: blue,
                    textAlign: "center",
                    marginVertical: 40,
                  }}
                >
                  Forget Password
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter Username"
                  placeholderTextColor="#aaa"
                  value={username}
                  onChangeText={(val) => setUsername(val)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={(val) => setPassword(val)}
                />

                <TouchableOpacity
                  onPress={handleForgotPasswordSubmit}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}

{showResetPassword && (
            <Pressable
              onPress={() => {
                setShowResetPassword(false);
                setPassword("");
                setUsername("");
              }}
              style={{
                width: width,
                height: height,
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 999,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: "white",
                  minWidth: width - 40,
                  // minHeight: height / 2,
                  marginHorizontal: 20,
                  marginVertical: height / 4,
                  borderRadius: 10,
                  padding: 20,
                  alignItems: "center",
                }}
                onPress={(e) => e.stopPropagation()}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: blue,
                    textAlign: "center",
                    marginVertical: 40,
                  }}
                >
                  Create New Password
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#aaa"
                  value={username}
                  editable={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={oldPassword}
                  onChangeText={(val) => setOldPassword(val)}
                />

<TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(val) => setNewPassword(val)}
                />

                <TouchableOpacity
                  onPress={handleResetPassword}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}

        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  loginBox: {
    width: "100%",
    alignItems: "center",
    // backgroundColor:'red',
    paddingHorizontal: 0,
    paddingVertical: 20,
    borderRadius: 10,
    // elevation:10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  button: {
    marginVertical: 10,
    width: "70%",
    textAlign: "center",
    backgroundColor: blue,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    paddingVertical: 15,
    padding: 10,
    textAlign: "center",
  },
});

export default Login;
