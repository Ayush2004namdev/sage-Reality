import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { formatDate, getLocation } from "../lib/features";
import { submitForm } from "../lib/helper";
import { setShowPopupDialog } from "../redux/slices/misc";
import { setUserLocation } from "../redux/slices/user";
const IPDone = () => {
    const {navigate} = useNavigation();
    const {user,location} = useSelector((state) => state.user);
    const [loading , setLoading] = useState(false);
    const {showPopupDialog} = useSelector((state) => state.misc);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: user.user.first_name,
        date: new Date(),
        patientName: "",
        keyPersonName: "",
       
      });
    
      const [showDatePicker, setShowDatePicker] = useState(false);
      const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.date;
        setShowDatePicker(Platform.OS === 'ios');
        setFormData({ ...formData, date: currentDate });
      };
 
      const handleSubmit = async() => {
        const emptyField = Object.keys(formData).find(key => !formData[key]);
    
        if (emptyField) {
          Alert.alert(
            "Validation Error",
            `Please fill out the ${emptyField} field.`,
            [
              { text: "OK", onPress: () => console.log(`Focus on ${emptyField} field`) },
            ],
            { cancelable: false }
          );
          if(!formatDate(formData.date)) return Alert.alert("Validation Error", "Please Enter Valid Date", [{ text: "OK" }]);
          return;
        } 

        try{

          // if(!location) {
          //   const userLocation = await getLocation();
          //   dispatch(setUserLocation(userLocation));
          // }

          setLoading(true);
          const data = {
            username: formData.name,
              date: formatDate(formData.date),
              p_name: formData.patientName,
              key_person: formData.keyPersonName,
              location: location
          }
          // console.log('working');
          await submitForm('Ip-Form' , data , user , setShowPopupDialog , setLoading , dispatch , location);
          // console.log('working');
          // const res = await axios.post(`http://182.70.253.15:8000/api/Ip-Form`, {
          //     username: formData.name,
          //     date: formatDate(formData.date),
          //     p_name: formData.patientName,
          //     key_person: formData.keyPersonName,
          // },{
          //   headers:{
          //     Authorization: `Bearer ${user.access}`,
          //     withCredentials: true,
          //   }
          // });
          // console.log({data:res.data});
          // setLoading(false);
          // if(res.data.error){
          //   throw new Error(res.data.error);
          //   return;
          // }
          // Alert.alert('Success' , 'Form Submitted Successfully' , [{text: 'OK'}]);
          // dispatch(setShowPopupDialog({workDone: true , to: 'Dashboard' , title: 'Success' , message: 'Form Submitted Successfully'}));
          setFormData({
            name: user.user.first_name,
            date: new Date(),
            patientName: "",
            keyPersonName: "",
          })
          // navigate('Dashboard');
        }catch(err){
          setLoading(false);
      if(err?.message === 'Location request failed due to unsatisfied device settings'){
        dispatch(setShowPopupDialog({title: "Location Access Denied", message: "Please allow the location access for the application" , workDone: false}));
            return;
        }
          dispatch(setShowPopupDialog({ workDone: false , to: 'IpDone' , title: 'Error' , message: 'Something went wrong'}));
          // Alert.alert('Alert' , 'Something went wrong' , [{text: 'OK'}]);
        }
      };
    
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const oneDayAfter = new Date(currentDate);
      oneDayAfter.setDate(currentDate.getDate());
      // const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    
      return (
        <SafeAreaView>
          {showPopupDialog && (
            <DialogComponent
              title={showPopupDialog.title}
              message={showPopupDialog.message}
              workDone={showPopupDialog.workDone}
              cancel={false}
              navigate={navigate}
              to={showPopupDialog.to}
            />
          )}
          {loading && <Loading/>}
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.title}>Ip Patient</Text>
              <View style={styles.separator}></View>
              {/* <Text style={styles.caption}>Feed Your IP Patient Details.</Text> */}
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  editable={false}
                  value={formData.name}
                  onChangeText={value => useChangeData('name', value , false , setFormData)}
                  placeholder="Enter Your Name"
                  style={styles.inputText}
                />
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>IP Date</Text>
                <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
                  <TextInput
                    style={{ flexGrow: 1, paddingHorizontal: 10 }}
                    value={formData.date.toLocaleDateString()}
                    placeholder="Select Date"
                    editable={false}
                  />
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateIcon}>
                    <Icon name="date-range" size={24} color="black" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={formData.date}
                      minimumDate={firstDayOfMonth}
                      maximumDate={oneDayAfter}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>
              </View>
    
              
    
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Patient Name</Text>
                <TextInput
                  value={formData.patientName}
                  onChangeText={value => useChangeData('patientName', value , false , setFormData)}
                  placeholder="Enter Patient Name"
                  style={styles.inputText}
                />
              </View>
    
    
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Key Person Name</Text>
                <TextInput
                  value={formData.keyPersonName}
                  onChangeText={value => useChangeData('keyPersonName', value , false , setFormData)}
                  placeholder="Enter Key Person Name"
                  style={styles.inputText}
                />
              </View>
    
    
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", height: 150, backgroundColor: "white" }}></View>
          </ScrollView>
        </SafeAreaView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 24,
        paddingVertical: 10,
      },
      title: {
        fontSize: 24,
      },
      separator: {
        borderBottomWidth: 1,
        borderBottomColor: blue,
        width: 70,
        marginVertical: 5,
      },
      caption: {
        color: "#000",
        fontSize: 12,
        marginTop: 1,
      },
      inputGroup: {
        marginVertical: 10,
      },
      label: {
        color: "#000",
        fontSize: 14,
        marginTop: 10,
      },
      inputText: {
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
      },
      pickerContainer: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        paddingBottom: 5,
        marginVertical: 5,
      },
      picker: {
        height: 50,
        width: '100%',
      },
      datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      dateIcon: {
        position: 'absolute',
        zIndex: 1,
        right: 10,
        top: 10,
      },
      radioGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 5,
      },
      radioButton: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        marginRight: 10,
      },
      radioLabel: {
        marginLeft: 5,
      },
      submitButton: {
        backgroundColor: blue,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 20,
      },
      submitButtonText: {
        color: "white",
        fontSize: 16,
      },
      image : {
        width: 200,
        height: 200,
        borderRadius: 5,
        marginVertical: 5,
      }
    
    });


export default IPDone