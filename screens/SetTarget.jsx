import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { getLocation } from "../lib/features";
import { submitForm } from "../lib/helper";
import { setShowPopupDialog, toggleUpdate } from "../redux/slices/misc";
import { setUserLocation } from "../redux/slices/user";
const SetTarget = () => {
    const {user,location} = useSelector((state) => state.user);
    const {showPopupDialog} = useSelector((state) => state.misc);
    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const {navigate} = useNavigation();
    const [changed , setChanged] = useState(false);
    const inputRefs = useRef({});

    const dataTemplate = {
      bookingTarget:'',
      followUpTarget:'',
      SMFollowUpTarget:'',
      corporateTarget:'',
      homeVisitTarget:'',
      siteVisitTarget:'',
      admissionTarget:'',
      ipPatientTarget:'',
    }

    const [formData, setFormData] = useState({
        name: user.user.first_name,
        month:new Date().getMonth(),
        year:new Date().getFullYear(),
        bookingTarget:'',
        followUpTarget:'',
        SMFollowUpTarget:'',
        corporateTarget:'',
        homeVisitTarget:'',
        siteVisitTarget:'',
        admissionTarget:'',
        ipPatientTarget:'',
      });
      
      
    
      const handleInputChange = (name, value , type) => {
        if(type === 'numeric' && isNaN(value)) return;
        setFormData({ ...formData, [name]: value });
      };
    
    
    
    
      const handleSubmit = async () => {
        const emptyField = Object.keys(formData).find(key => {
          if(formData[key] === '') return key;
          if(formData[key] >= 0) return false;
          return key;
        });
        
        let alertFieldName = "";

  switch (emptyField) {
    case "bookingTarget":
      alertFieldName = "Booking Target";
      break;
    case "followUpTarget":
      alertFieldName = "Follow-Up Target";
      break;
    case "SMFollowUpTarget":
      alertFieldName = "SM Follow-Up Target";
      break;
    case "corporateTarget":
      alertFieldName = "Corporate Target";
      break;
    case "homeVisitTarget":
      alertFieldName = "Home Visit Target";
      break;
    case "siteVisitTarget":
      alertFieldName = "Site Visit Target";
      break;
    case "admissionTarget":
      alertFieldName = "Admission Target";
      break;
    case "ipPatientTarget":
      alertFieldName = "IP Patient Target";
      break;
    default:
      alertFieldName = false;
  }

        if (emptyField && alertFieldName) {
          Alert.alert(
            "🔴 OOPS!",
            `Please provide ${alertFieldName}.`,
            [
              { 
                text: "OK",
                onPress: () => inputRefs?.current[emptyField]?.focus()
              },
            ],
            { cancelable: false }
          );
        } else {

          const getMonth = ()=> {
            switch(formData.month){
              case 0:
                return 'January';
                break;
              case 1:
                return 'February';
                break;
              case 2:
                return 'March';
                break;
              case 3:
                return 'April';
                break;
              case 4:
                return 'May';
                break;
              case 5:
                return 'June';
                break;
              case 6:
                return 'July';
                break;
              case 7:
                return 'August';
                break;
              case 8:
                return 'September';
                break;
              case 9:
                return 'October';
                break;
              case 10:
                return 'November';
                break;
              case 11:
                return 'December';
                break;
            }
          }
          if(isNaN(formData.month)) return Alert.alert("Validation Error", "Please Select Month", [{ text: "OK" }]);
          try{

            setLoading(true);
            const data = {
              month:getMonth(formData.month),
              year:formData.year,
              booking:formData.bookingTarget,
              followup:formData.followUpTarget,
              corporate_visit:formData.corporateTarget,
              home_visit:formData.homeVisitTarget,
              sm_followup:formData.SMFollowUpTarget,
              site_visit:formData.siteVisitTarget,
              admission:formData.admissionTarget,
              ip:formData.ipPatientTarget,
              location: location
            }
            await submitForm(`Set-Target/${user.user.first_name}`, data , user , setShowPopupDialog , setLoading , dispatch);
           
          }catch(err){
            setLoading(false);
            if(err?.message === 'Location request failed due to unsatisfied device settings'){
              dispatch(setShowPopupDialog({title: "Location Access Denied", message: "Please allow the location access for the application" , workDone: false}));
                
                  return;
              }
            console.log({err});
            dispatch(setShowPopupDialog({title: "Error", message: "Something went wrong", workDone: false}));
          }
        }
        dispatch(toggleUpdate());
        setChanged(!changed);
      };

      useFocusEffect(
        useCallback(() => {
          const getData = async () => {
            console.log('');
            try{
                const res = await axios.get(`http://182.70.253.15:8000/api/Get-Target/${user.user.first_name}` ,{
                  withCredentials: true,
                  headers:{
                    'Authorization': `Bearer ${user.access}`
                  }
                })
                // console.log({'f':res.data});
                if(!res?.data) return;
                res?.data?.forEach((target) => {
                  switch(target.Target_id){
                    case 1 :
                        dataTemplate.bookingTarget = target.target;
                        break;
                    case 3 :
                        dataTemplate.followUpTarget = target.target;
                        break;
                    case 2 :
                        dataTemplate.corporateTarget = target.target;
                        break;
                    case 4 :
                        dataTemplate.homeVisitTarget = target.target;
                        break;
                    case 5 :
                        dataTemplate.SMFollowUpTarget = target.target;
                        break;
                    case 6 :
                        dataTemplate.siteVisitTarget = target.target;
                        break;
                    case 7 :
                        dataTemplate.admissionTarget = target.target;
                        break;
                    case 8 :
                        dataTemplate.ipPatientTarget = target.target;
                        break;
                    default:
                        break;  
                   }
                })
                
               setFormData(prev => ({ name: user.user.first_name,
                month:new Date().getMonth(),
                year:new Date().getFullYear(),...dataTemplate}));

            }
            catch(err){
              console.log({err})
            }
          }
          getData();
        },[changed])
      )
    
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
              <Text style={styles.title}>Set Monthly Target</Text>
              <View style={styles.separator}></View>
              {/* <Text style={styles.caption}>Feed Your Monthly Target.</Text> */}
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  editable={false}
                  value={formData.name}
                  onChangeText={value => useChangeData('name', value , true , setFormData)}
                  placeholder="Enter Your Name"
                  style={styles.inputText}
                  ref={(ref) => inputRefs.current['name'] = ref}
                />
              </View>

              <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Month</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.month}
                onValueChange={(itemValue) => useChangeData('month', itemValue , true , setFormData)}
                style={styles.picker}
              >
                <Picker.Item label='January' value={0} />
                <Picker.Item label='February' value={1} />
                <Picker.Item label='March' value={2} />
                <Picker.Item label='April' value={3} />
                <Picker.Item label='May' value={4} />
                <Picker.Item label='June' value={5} />
                <Picker.Item label='July' value={6} />
                <Picker.Item label='August' value={7} />
                <Picker.Item label='September' value={8} />
                <Picker.Item label='October' value={9} />
                <Picker.Item label='November' value={10} />
                <Picker.Item label='December' value={11} />
              </Picker>
            </View>
          </View> 


            <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.year}
                onValueChange={(itemValue) => useChangeData('year', itemValue , true , setFormData)}
                style={styles.picker}
              >
                <Picker.Item label={formData.year} value={formData.year} />
              </Picker>
            </View>
          </View> 
    
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Booking</Text>
                
                <TextInput
                  value={formData.bookingTarget.toString()}
                  onChangeText={value => useChangeData('bookingTarget', value , true , setFormData)}
                  placeholder="Enter Booking Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={(ref) => inputRefs.current['bookingTarget'] = ref}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Follow Up</Text>
                <TextInput
                  value={formData.followUpTarget.toString()}
                  onChangeText={value => useChangeData('followUpTarget', value , true , setFormData)}
                  placeholder="Enter Follow Up Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={(ref) => inputRefs.current['followUpTarget'] = ref}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sage Mitra F/W</Text>
                <TextInput
                  value={formData.SMFollowUpTarget.toString()}
                  onChangeText={value => useChangeData('SMFollowUpTarget', value , true , setFormData)}
                  placeholder="Enter Sage Mitra F/W Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={(ref) => inputRefs.current['SMFollowUpTarget'] = ref}
                />
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Corporate</Text>
                <TextInput
                  value={formData.corporateTarget.toString()}
                  onChangeText={value => useChangeData('corporateTarget', value , true , setFormData)}
                  placeholder="Enter Coporate Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={(ref) => inputRefs.current['corporateTarget'] = ref}
                />
              </View>
    
              

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Home Visit</Text>
                <TextInput
                  value={formData.homeVisitTarget.toString()}
                  onChangeText={value => useChangeData('homeVisitTarget', value , true , setFormData)}
                  placeholder="Enter Home Visit Target"
                  style={styles.inputText}
                  ref={(ref) => inputRefs.current['homeVisitTarget'] = ref}
                  keyboardType="numeric"
                />
              </View>
    
             
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Site Visit</Text>
                <TextInput
                  value={formData.siteVisitTarget.toString()}
                  onChangeText={value => useChangeData('siteVisitTarget', value ,true , setFormData)}
                  placeholder="Enter Site Visit Target"
                  ref={(ref) => inputRefs.current['siteVisitTarget'] = ref}
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Admission</Text>
                <TextInput
                  value={formData.admissionTarget.toString()}
                  onChangeText={value => useChangeData('admissionTarget', value , true , setFormData)}
                  placeholder="Enter Admission Target"
                  style={styles.inputText}
                  ref={(ref) => inputRefs.current['admissionTarget'] = ref}
                  keyboardType="numeric"
                />
            </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>IP Patient</Text>
                <TextInput
                  value={formData.ipPatientTarget.toString()}
                  onChangeText={value => useChangeData('ipPatientTarget', value , true , setFormData)}
                  placeholder="Enter IP Patient Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={(ref) => inputRefs.current['ipPatientTarget'] = ref}
                />
              </View>
    
    
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", height: 100, backgroundColor: '#F6F5F5', }}></View>
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
        width: 120,
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


export default SetTarget