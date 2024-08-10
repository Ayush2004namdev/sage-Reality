import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Platform, Alert, Image, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from 'react-native-paper';
import { SafeAreaView } from "react-navigation";
import * as ImagePicker from 'expo-image-picker';
import { blue, yellow } from "../constants";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from "react-redux";

const CorpVisit = () => {
  

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlannedDatePicker, setShowPlannedDatePicker] = useState(false);
  const [showReasonTextInput, setShowReasonTextInput] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const {corporate_list , corporate_type} = useSelector(state => state.misc)
  const {user} = useSelector(state => state.user)

  const [formData, setFormData] = useState({
    name: user.user.first_name,
    location: "",
    branch: "",
    keyPerson: "",
    mobileNumber: "",
    corporateType: "select",
    corporate: "select",
    firstGroupValue: null,
    secondGroupValue: null,
    date: new Date(),
    plannedDate: new Date(),
    image: null,
    reason: "",
    noOfPeopleMet: "",
    DataCollected: "",
    teamMembers: [],
  });

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, date: currentDate });
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const onPlannedDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.plannedDate;
    setShowPlannedDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, plannedDate: currentDate });
  };

  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ""] });
  };

  const removeTeamMember = (index) => {
    const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = formData.teamMembers.map((member, i) => (i === index ? value : member));
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleSubmit = () => {
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
      console.log(formData);
      Alert.alert("Success", "All fields are filled.", [{ text: "OK" }]);
    }
  };

  const takeImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0] });
    }
    console.log(result);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Corporate Visit</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Your Corporate Visit Details.</Text>
          <Text style={styles.caption}>Fill all the Details.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={formData.name}
              editable={false}
              onChangeText={value => handleInputChange('name', value)}
              placeholder="Enter Your Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Visit</Text>
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
            <Text style={styles.label}>Select Corporate Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.corporateType}
                onValueChange={(itemValue) => handleInputChange('corporateType', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {corporate_type.map((item , index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Corporate</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.corporate}
                onValueChange={(itemValue) => handleInputChange('corporate', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {corporate_list.map((item , index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={value => handleInputChange('location', value)}
              placeholder="Enter Location/Branch"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Key Person</Text>
            <TextInput
              value={formData.keyPerson}
              onChangeText={value => handleInputChange('keyPerson', value)}
              placeholder="Enter Key Person"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
            keyboardType="numeric"
              value={formData.mobileNumber}
              onChangeText={value => handleInputChange('mobileNumber', value)}
              placeholder="Enter Mobile Number of Key Person"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>No of People Met</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.noOfPeopleMet}
              onChangeText={value => handleInputChange('noOfPeopleMet', value)}
              placeholder="Enter No of People Met..."
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Collected</Text>
            <TextInput
            keyboardType="numeric"
              value={formData.DataCollected}
              onChangeText={value => handleInputChange('dataCollected', value)}
              placeholder="Enter Data Collected"
              style={styles.inputText}
            />
          </View>

         

         

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Presentation</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => {
                  handleInputChange('firstGroupValue', value);
                  if (value === "Planned") {
                    setShowPlannedDatePicker(true);
                    setShowReasonTextInput(false);
                  } else if (value === "NotPlanned") {
                    setShowReasonTextInput(true);
                    setShowPlannedDatePicker(false);
                  } else {
                    setShowPlannedDatePicker(false);
                    setShowReasonTextInput(false);
                  }
                }}
                value={formData.firstGroupValue}
              >
                <View style={styles.radioButton}>
                  <RadioButton value="Done" />
                  <Text style={styles.radioLabel}>Done</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="Planned" />
                  <Text style={styles.radioLabel}>Planned</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="NotPlanned" />
                  <Text style={styles.radioLabel}>Not Planned</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>

          {showPlannedDatePicker && (
            <View style={[styles.inputGroup,{marginTop:-20 , marginBottom:30}]}>
              <Text style={styles.label}>Planned Date</Text>
              <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
                <TextInput
                  style={{ flexGrow: 1, paddingHorizontal: 10 }}
                  value={formData.date.toLocaleDateString()}
                  placeholder="Select Date"
                  editable={true}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateIcon}>
                  <Icon name="date-range" size={24} color="black" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="date"
                    display="default"
                    onChange={onPlannedDateChange}
                  />
              )}
              </View>
            </View>
          )}

          {showReasonTextInput && (
            <View style={[styles.inputGroup,{marginTop:-20 , marginBottom:30}]}>
              <Text style={styles.label}>Reason</Text>
              <TextInput
                
                value={formData.reason}
                onChangeText={value => handleInputChange('reason', value)}
                placeholder="Enter Reason"
                style={styles.inputText}
              />
            </View>
          )}

          <Pressable onPress={takeImage}  style={[{marginTop:6 , width:130 , paddingHorizontal:10 , paddingVertical:5 , borderWidth:1 , borderRadius:5 , backgroundColor:blue  , display:'flex' , flexDirection:'row' , gap:5 , alignItems:'start'}]}>
            <Text style={{color:'white'}}>Take Image</Text>
            <TouchableOpacity style={styles.imagePicker}>
              <Icon name="camera-alt" size={24} color="white" />
            </TouchableOpacity>
            {console.log({formData})}
          </Pressable>
            {formData.image && <Image source={{ uri: formData.image.uri }} style={styles.image} />}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visit Type</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => {
                  handleInputChange('secondGroupValue', value);
                  if (value === "TeamVisit") {
                    setShowTeamSelect(true);
                  } else {
                    setShowTeamSelect(false);
                  }
                }}
                value={formData.secondGroupValue}
              >
                <View style={styles.radioButton}>
                  <RadioButton value="SoloVisit" />
                  <Text style={styles.radioLabel}>Solo Visit</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="TeamVisit" />
                  <Text  style={styles.radioLabel}>Team Visit</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>

          {showTeamSelect && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team Members</Text>
              {formData.teamMembers.map((member, index) => (
                <View key={index} style={styles.teamMemberContainer}>
                   
                  <TextInput
                    value={member}
                    onChangeText={(value) => handleTeamMemberChange(index, value)}
                    placeholder={`Member ${index + 1}`}
                    style={styles.inputText}
                  />
                  <TouchableOpacity onPress={() => removeTeamMember(index)} style={styles.removeButton}>
                    <Icon name="remove-circle-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={addTeamMember} style={styles.addButton}>
                <Icon name="add-circle-outline" size={24} color="green" />
                <Text style={styles.addButtonText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%", height: 100, backgroundColor: "white" }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    width: 72,
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
    borderRadius: 10,
    marginVertical: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
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

export default CorpVisit;
