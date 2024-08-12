import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-navigation";
import { blue } from "../constants";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import useChangeData from "../hooks/useChangeData";

const SageMitraFollowUp = () => {
  
  const {navigate} = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showenList , setShowenList] = useState(false);
  const [searchVal  , setSearchVal] = useState('');
  const {sage_mitra_list} = useSelector((state) => state.misc)
  const {user} = useSelector((state) => state.user)
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, date: currentDate });
  };

  const handleInputChange = (name, value) => {
    if(name === 'search'){
      
      setSearchVal(value);
      const searchTerm = value.toLowerCase();

      const filteredList = sage_mitra_list.filter(item => {
          return item[0] && item[0].toLowerCase().includes(searchTerm);
      });

      setShowenList(filteredList);
      return;
    }

    if(name === 'sageMitra'){
      setSearchVal(value[0]);
      setShowenList(false);
    }

    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState({
    name: user.user.first_name,
    date: new Date(),
    mobileNumber: "",
    noOfLeads: "",
    leadDetails: "",
    sageMitra:'',
  });



  const handleSubmit =async () => {
    const emptyField = Object.keys(formData).find(key => {
      if(key === 'mobileNumber'){
        if(formData[key].length !== 10) return 'Mobile Number';
        if(formData[key][0] >= 6 && formData[key][0] <= 9) return false;
        return true;
      }

      return !formData[key]
    });

    if (emptyField) {
      if(emptyField === 'mobileNumber') return Alert.alert('Validation Error', 'Please enter a valid mobile number' , [{text:'OK'}]);
      Alert.alert(
        "Validation Error",
        `Please fill out the ${emptyField} field.`,
        [
          { text: "OK", onPress: () => console.log(`Focus on ${emptyField} field`) },
        ],
        { cancelable: false }
      );
      return;
    } 
    try{
      const res = await axios.post('http://10.22.130.15:8000/api/Sage-Mitra-Form', {
        name: formData.name,
        date: formData.date,
        mobileNumber: formData.mobileNumber,
        noOfLeads: formData.noOfLeads,
        leadDetails: formData.leadDetails,
        sageMitra: formData.sageMitra,
      } , {
        headers:{
          Authorization: `Bearer ${user.access}`
        }
      })
      if(res.data.error) return Alert.alert('Error', res.data.error , [{text:'OK'}]);
      Alert.alert('Success', 'Sage Mitra Followup Added Successfully' , [{text:'OK'}]);
      setFormData({
        name: user.user.first_name,
        date: new Date(),
        mobileNumber: "",
        noOfLeads: "",
        leadDetails: "",
        sageMitra:'',
      })
      navigate('Dashboard');
    }catch(err){
      console.log(err);
      Alert.alert('Error', 'Something went wrong' , [{text:'OK'}]);
    }
  };

 

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Sage Mitra Follow Up</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Your Sage Mitra Followup Details.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholder="Enter Your Name"
              editable={false}
              style={styles.inputText}
            />
          </View>

         
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Sage Mitra</Text>
              <TextInput placeholder="Enter SAGE Mitra" style={styles.inputText} value={searchVal} onChangeText={(val) => handleInputChange('search' , val)} />
              {searchVal && (
                
                <ScrollView style={{
                  width: '100%',
                  height: 'auto',
                }}>
                  {showenList && showenList.length > 0 && showenList.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleInputChange('sageMitra', item)} style={{padding:10 , borderWidth:1 ,borderTopWidth:0 , borderBottomColor:'black'}}>
                      <Text>{item[0]}</Text>
                    </TouchableOpacity>
                  ))}
                
                </ScrollView>
                
              
              )}
          </View>

<View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              value={formData.mobileNumber}
              onChangeText={value => useChangeData('mobileNumber', value , true , setFormData)}
              placeholder="Enter Mobile Number"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Follow Up Date</Text>
            <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
              <TextInput
                style={{ flexGrow: 1, paddingHorizontal: 10 }}
                value={formData.date.toLocaleDateString()}
                placeholder="Select Date"
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.dateIcon}>
                <Icon name="date-range" size={24} color="black" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>No Of leads</Text>
            <TextInput
              value={formData.noOfLeads}
              onChangeText={value => useChangeData('noOfLeads', value , true , setFormData)}
              placeholder="No of leads shared in this follow up"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lead Details</Text>
            <TextInput
              value={formData.leadDetails}
              onChangeText={value => useChangeData('leadDetails', value , false , setFormData)}
              placeholder="Enter Lead Details/Description"
              style={styles.inputText}
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
    width: 150,
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

export default SageMitraFollowUp