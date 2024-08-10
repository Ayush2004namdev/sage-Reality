import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-navigation";
import { blue } from "../constants";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
const SetTarget = () => {
    const {user} = useSelector((state) => state.user);
    const [changed , setChanged] = useState(false);
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
      
      
    
      const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
      };
    
    
    
    
      const handleSubmit = async () => {
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
        } else {
          try{
            const res = await axios.post(`http://10.22.130.15:8000/api/Set-Target/${user.user.first_name}`,{
              month:formData.month,
              year:formData.year,
              booking:formData.bookingTarget,
              followup:formData.followUpTarget,
              corporate_visit:formData.corporateTarget,
              home_visit:formData.homeVisitTarget,
              sm_followup:formData.SMFollowUpTarget,
              site_visit:formData.siteVisitTarget,
              admission:formData.admissionTarget,
              ip:formData.ipPatientTarget
            } , {
              withCredentials: true,
              headers:{
                Authorization: `Bearer ${user.access}`
              }
            })
            console.log(res.data);
          }catch(err){
            console.log({err});
          }
            
          Alert.alert("Success", "Saved Successfully", [{ text: "OK" }]);
        }
        setChanged(!changed);
      };

      useFocusEffect(
        useCallback(() => {
          const getData = async () => {
            try{
                const res = await axios.get(`http://10.22.130.15:8000/api/Get-Target/${user.user.first_name}` ,{
                  withCredentials: true,
                  headers:{
                    'Authorization': `Bearer ${user.access}`
                  }
                })
                console.log(res.data);
                res?.data?.forEach((target) => {
                  switch(target.id){
                    case 1 :
                        dataTemplate.bookingTarget = target.target;
                        break;
                    case 2 :
                        dataTemplate.followUpTarget = target.target;
                        break;
                    case 3 :
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
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.title}>Set Monthly Target</Text>
              <View style={styles.separator}></View>
              <Text style={styles.caption}>Feed Your Monthly Target.</Text>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  editable={false}
                  value={formData.name}
                  onChangeText={value => handleInputChange('name', value)}
                  placeholder="Enter Your Name"
                  style={styles.inputText}
                />
              </View>

              <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Month</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.month}
                onValueChange={(itemValue) => handleInputChange('month', itemValue)}
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
                onValueChange={(itemValue) => handleInputChange('year', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label={formData.year} value={formData.year} />
              </Picker>
            </View>
          </View> 
    
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Booking Target {formData.bookingTarget}</Text>
                
                <TextInput
                  value={formData.bookingTarget.toString()}
                  onChangeText={value => handleInputChange('bookingTarget', value)}
                  placeholder="Enter Booking Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Corporate Target</Text>
                <TextInput
                  value={formData.corporateTarget.toString()}
                  onChangeText={value => handleInputChange('corporateTarget', value)}
                  placeholder="Enter Coporate Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Follow Up Target</Text>
                <TextInput
                  value={formData.followUpTarget.toString()}
                  onChangeText={value => handleInputChange('followUpTarget', value)}
                  placeholder="Enter Follow Up Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Home Visit Target</Text>
                <TextInput
                  value={formData.homeVisitTarget.toString()}
                  onChangeText={value => handleInputChange('homeVisitTarget', value)}
                  placeholder="Enter Home Visit Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sage Mitra F/W Target</Text>
                <TextInput
                  value={formData.SMFollowUpTarget.toString()}
                  onChangeText={value => handleInputChange('SMFollowUpTarget', value)}
                  placeholder="Enter Sage Mitra F/W Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>
    
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Site Visit Target</Text>
                <TextInput
                  value={formData.siteVisitTarget.toString()}
                  onChangeText={value => handleInputChange('siteVisitTarget', value)}
                  placeholder="Enter Site Visit Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Admission Target</Text>
                <TextInput
                  value={formData.admissionTarget.toString()}
                  onChangeText={value => handleInputChange('admissionTarget', value)}
                  placeholder="Enter Admission Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>IP Patient Target</Text>
                <TextInput
                  value={formData.ipPatientTarget.toString()}
                  onChangeText={value => handleInputChange('ipPatientTarget', value)}
                  placeholder="Enter IP Patient Target"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>
    
    
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", height: 100, backgroundColor: "white" }}></View>
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