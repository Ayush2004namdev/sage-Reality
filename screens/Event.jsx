import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { formatDate } from "../lib/features";
import { submitForm } from "../lib/helper";
import { setShowPopupDialog } from "../redux/slices/misc";
const Event = () => {
  const {navigate} = useNavigation();
  const {user,location} = useSelector((state) => state.user);
  const {event_type_list , showPopupDialog} = useSelector((state) => state.misc);
  const [loading , setLoading] = useState(false);
  const inputRefs = useRef({});
  const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name:user.user.first_name ,
        eventType:'select',
        eventName:'',
        startDate: new Date(),
        endDate: new Date(),
        eventDetails:'',
        numberOfAttendiees:'',
        numberOfLeads:'',
      });

      useFocusEffect(
        useCallback(() => {
          setFormData({
            name:user.user.first_name ,
            eventType:'select',
            eventName:'',
            startDate: new Date(),
            endDate: new Date(),
            eventDetails:'',
            numberOfAttendiees:'',
            numberOfLeads:'',
          })
          setLoading(false);
        },[])
      )
    
      const [showEndDatePicker, setShowEndDatePicker] = useState(false);
      const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    
      const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setFormData({ ...formData, startDate: currentDate });
      };
    
      const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.endDate;
        setShowEndDatePicker(Platform.OS === 'ios');
        setFormData({ ...formData, endDate: currentDate });
      };

      const handleSubmit = async () => {
        const emptyField = Object.keys(formData).find(key => {
          
         

          if(typeof formData[key] === 'string'){
            if(formData[key].trim().length < 4 ){
              return key;
            }
        }


        if(key === 'eventDetails'){
            if(formData[key].length <= 100){
                return key;
              }
            }

        if(key === 'eventType' && formData[key] === 'select') {return key}
        
        if(key === 'numberOfAttendiees' && isNaN(formData[key])) {
          return key;
        }
        if(key === 'numberOfAttendiees' && formData[key] < 1) {
          return key;
        }

        if(key === 'numberOfLeads' && formData[key] >=0) {
          console.log('=====' ,typeof formData[key]);
          return false;
        }

         return !formData[key]}
        );
    
        let alertFieldName = "";

        switch (emptyField) {
          case "eventType":
            alertFieldName = "Type of Event";
            break;
          case "eventName":
            alertFieldName = "Name of Event";
            break;
          case "startDate":
            alertFieldName = "Start Date";
            break;
          case "endDate":
            alertFieldName = "End Date";
            break;
          case "eventDetails":
            alertFieldName = "Event Details";
            break;
          case "numberOfAttendiees":
            alertFieldName = "Number of Attendees";
            break;
          case "numberOfLeads":
            alertFieldName = "Number of Leads";
            break;
          default:
            alertFieldName = false;
        }

        if (emptyField && alertFieldName) {
          Alert.alert(
            "🔴 OOPS!",
            `Please Provide ${alertFieldName}. `,
            [
              {
                text: "OK",
                onPress: () => inputRefs?.current[emptyField]?.focus(),
              }
            ]
          );
          return;
        }
          try{
            // if(!location) {
            //   const userLocation = await getLocation();
            //   dispatch(setUserLocation(userLocation));
            // }
            setLoading(true);
            const data  = {
              username: formData.name,
                Event_name: formData.eventName,
                start_date: formatDate(formData.startDate),
                end_date: formatDate(formData.endDate),
                Event_type:formData.eventType,
                num_leads: formData.numberOfLeads,
                event_details: formData.eventDetails,
                num_attendees: formData.numberOfAttendiees,
                location: location
            }
            await submitForm('Event-Form' , data , user , setShowPopupDialog , setLoading , dispatch);
            // const res = await axios.post(`http://182.70.253.15:8000/api/Event-Form` , {
            //   username: formData.name,
            //   Event_name: formData.eventName,
            //   start_date: formatDate(formData.startDate),
            //   end_date: formatDate(formData.endDate),
            //   Event_type:formData.eventType,
            //   num_leads: formData.numberOfLeads,
            //   event_details: formData.eventDetails,
            //   num_attendees: formData.numberOfAttendiees
            // } , {
            //   withCredentials: true,
            //   headers: {
            //     Authorization: `Bearer ${user.access}`
            //   }})
            //   setLoading(false);
            //   if(res?.data?.error) return new Error(res.data.error);
            //   dispatch(setShowPopupDialog({title: 'Success' , message: 'Form Submitted Successfully' , workDone: true , to: 'Dashboard'}));
            //   // Alert.alert('Success' , 'Form Submitted Successfully' , [{text: 'OK'}]);
              setFormData({
                name:user.user.first_name ,
                eventType:'select',
                eventName:'',
                startDate: new Date(),
                endDate: new Date(),
                eventDetails:'',
                numberOfAttendiees:'',
                numberOfLeads:'',
              })
              // console.log(res.data);
              return;
          }
          catch(err){
            setLoading(false);
      if(err?.message === 'Location request failed due to unsatisfied device settings'){
        dispatch(setShowPopupDialog({title: "Location Access Denied", message: "Please allow the location access for the application" , workDone: false}));
            return;
        }
      
            dispatch(setShowPopupDialog({title: 'Error' , message: 'Something Went Wrong' , workDone: false, to: 'Event'}));
            // Alert.alert('Error' , 'Something Went Wrong' , [{text: 'OK'}]);
            console.log(err);
          }
      };
    
      const currentDate = new Date();
      const oneDayAfter = new Date(currentDate);
      oneDayAfter.setMonth(currentDate.getMonth() + 1);
    
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
              <Text style={styles.title}>Event Form</Text>
              <View style={styles.separator}></View>
            
              <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.eventType}
                onValueChange={(itemValue) => setFormData({ ...formData, eventType: itemValue }) }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {event_type_list && event_type_list.map((item,i) => (
                  <Picker.Item key={i} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>
              
          <View style={styles.inputGroup}>
                <Text style={styles.label}>Event Name</Text>
                <TextInput
                  value={formData.eventName}
                  onChangeText={value => useChangeData('eventName', value , false , setFormData)}
                  placeholder="Enter Event Name"
                  style={styles.inputText}
                  ref={ref => inputRefs.current['eventName'] = ref}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
                  <TextInput
                    style={{ flexGrow: 1, paddingHorizontal: 10 }}
                    value={formData.startDate.toLocaleDateString()}
                    placeholder="Select Date"
                    editable={false}
                    ref={ref => inputRefs.current['startDate'] = ref}
                  />
                  <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateIcon}>
                    <Icon name="date-range" size={24} color="black" />
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={formData.startDate}
                      mode="date"
                      display="default"
                      maximumDate={oneDayAfter}
                      minimumDate={currentDate}
                      onChange={onStartDateChange}
                    />
                  )}
                </View>
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date</Text>
                <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
                  <TextInput
                    style={{ flexGrow: 1, paddingHorizontal: 10 }}
                    value={formData.endDate.toLocaleDateString()}
                    placeholder="Select Date"
                    editable={false}
                  />
                  <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateIcon}>
                    <Icon name="date-range" size={24} color="black" />
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={formData.endDate}
                      mode="date"
                      display="default"
                      minimumDate={currentDate}
                      maximumDate={oneDayAfter}
                      onChange={onEndDateChange}
                    />
                  )}
                </View>
              </View>
    
              
    
    
              <View style={styles.inputGroup}>
              <View style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
              }}>
                <Text style={styles.label}>Event Details</Text>
                <Text style={{
                  color: formData.eventDetails.length > 100 ? 'green' : 'red'
                }}>{formData.eventDetails.length}/100</Text>
                </View>
                <TextInput
                  value={formData.eventDetails}
                  onChangeText={value => useChangeData('eventDetails', value , false , setFormData)}
                  placeholder="Enter Event Details"
                  style={[styles.inputText , {minHeight: 100 , textAlignVertical:'top'}]}
                  ref={ref => inputRefs.current['eventDetails'] = ref}
                  multiline={true}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number Of Attendees</Text>
                <TextInput
                  value={formData.numberOfAttendiees}
                  onChangeText={value => useChangeData('numberOfAttendiees', value , true , setFormData)}
                  placeholder="Enter Number of Attendees"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={ref => inputRefs.current['numberOfAttendiees'] = ref}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Leads</Text>
                <TextInput
                  value={formData.numberOfLeads}
                  onChangeText={value => useChangeData('numberOfLeads', value , true , setFormData)}
                  placeholder="Enter Number of Leads"
                  style={styles.inputText}
                    keyboardType="numeric"
                    ref={ref => inputRefs.current['numberOfLeads'] = ref}
                />
              </View>
    
    
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", height: 100,backgroundColor: '#F6F5F5' }}></View>
          </ScrollView>
        </SafeAreaView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F6F5F5',
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


export default Event;