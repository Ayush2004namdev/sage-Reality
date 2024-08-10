import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-navigation";
import { blue } from "../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatDate } from "../lib/features";
import { Picker } from "@react-native-picker/picker";

const HomeVisit = () => {
  const { user } = useSelector((state) => state.user);
  const {members} = useSelector((state) => state.misc);
  const [formData, setFormData] = useState({
    name: user.user.first_name,
    customerName: "",
    customerContact: "",
    remark: "",
    location: "",
    date: new Date(),
    image: null,
    teamMembers: [],
    cofellows:{},
    visit_type: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [loading , setIsLoading] = useState(false);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, date: currentDate });
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ""] });
  };

  const removeTeamMember = (index) => {
    handleAddFellow(index+1,'select');
    const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = formData.teamMembers.map((member, i) =>
      i === index ? value : member
    );
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const emptyField = Object.keys(formData).find((key) => !formData[key]);

    if (emptyField) {
      Alert.alert(
        "Validation Error",
        `Please fill out the ${emptyField} field.`,
        [
          {
            text: "OK",
            onPress: () => console.log(`Focus on ${emptyField} field`),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    try {
      const newFormData = new FormData();
      newFormData.append("username", formData.name);
      newFormData.append("customer_name", formData.customerName);
      newFormData.append("customer_contact", formData.customerContact);
      newFormData.append("visit_details", formData.remark);
      newFormData.append("site_visit_name", formData.location);
      newFormData.append("date", formatDate(formData.date));
      newFormData.append("image", formData.image);
      newFormData.append("teamMembers", JSON.stringify(formData.teamMembers));
      newFormData.append("visit_type", formData.visit_type);
      const res = await axios.post(
        "http://10.22.130.15:8000/api/Home-Visit",
        {
          username: formData.name,
          customer_name : formData.customerName,
          customer_contact : formData.customerContact,
          date : formatDate(formData.date),
          visit_details : formData.remark,
          site_visit_name : formData.location,
          visit_type : formData.visit_type,
          image : formData.image,
          teamMembers : formData.teamMembers
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );
      if(res.data.error) return Alert.alert('Error' , res.data.error , [{text: 'OK'}]);
      Alert.alert("Success", res.data.success , [{ text: "OK" }]);
    } catch (err) {
      Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
      console.log({ err });
    }
    finally{
      setIsLoading(false);
    }
  };

  const takeImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0] });
    }
  };

  const handleAddFellow = ( index,fellow) => {
    if(fellow === 'select') return delete formData.cofellows[index];
    const cf = formData.cofellows;
    cf[index] = fellow;
    
    setFormData({ ...formData, });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Home Visit Form</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Your Home Visit Details..</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              editable={false}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter Your Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}> Customer Name</Text>
            <TextInput
              value={formData.customerName}
              onChangeText={(value) => handleInputChange("customerName", value)}
              placeholder="Enter customer Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Contact Number</Text>
            <TextInput
            keyboardType="numeric"
              value={formData.customerContact}
              onChangeText={(value) =>
                handleInputChange("customerContact", value)
              }
              placeholder="Enter Customer Contact Number"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visit Date</Text>
            <View
              style={[
                styles.datePickerContainer,
                {
                  borderWidth: 1,
                  borderColor: "black",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 5,
                  borderRadius: 5,
                },
              ]}
            >
              <TextInput
                style={{ flexGrow: 1, paddingHorizontal: 10 }}
                value={formData.date.toLocaleDateString()}
                placeholder="Select Date"
                editable={false}
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateIcon}
              >
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
            <Text style={styles.label}>Remark</Text>
            <TextInput
              value={formData.remark}
              onChangeText={(value) => handleInputChange("remark", value)}
              placeholder="Remark"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={(value) => handleInputChange("location", value)}
              placeholder="Enter Location"
              style={styles.inputText}
            />
          </View>

          <Pressable
            onPress={takeImage}
            style={[
              {
                marginTop: 6,
                width: 130,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: blue,
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "start",
              },
            ]}
          >
            <Text style={{ color: "white" }}>Take Image</Text>
            <TouchableOpacity style={styles.imagePicker}>
              <Icon name="camera-alt" size={24} color="white" />
            </TouchableOpacity>
          </Pressable>
          {formData.image && (
            <Image source={{ uri: formData.image.uri }} style={styles.image} />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visit Type</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => {
                  handleInputChange("visit_type", value);
                  if (value === "team") {
                    setShowTeamSelect(true);
                  } else {
                    setShowTeamSelect(false);
                  }
                }}
                value={formData.visit_type}
              >
                <View style={styles.radioButton}>
                  <RadioButton value="SoloVisit" />
                  <Text style={styles.radioLabel}>Solo Visit</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="team" />
                  <Text style={styles.radioLabel}>Team Visit</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>

          {showTeamSelect && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team Members</Text>
              {formData.teamMembers.map((member, index) => (
                <View key={index} style={styles.teamMemberContainer}>
                  <View style={styles.pickerContainer}>

                  <Picker
                selectedValue={formData.cofellows[index+1]}
                onValueChange={(itemValue) => handleAddFellow(index+1,itemValue)}
                style={styles.picker}
                >
                <Picker.Item label="Select" value="select" />
                {members.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                ))}
                
                <Picker.Item label='k' value='k' />
                <Picker.Item label='d' value='d' />
              </Picker>
              </View>
                  <TouchableOpacity
                    onPress={() => removeTeamMember(index)}
                    style={styles.removeButton}
                  >
                    <Icon name="remove-circle-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={addTeamMember}
                style={styles.addButton}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: 5,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: 'white',
                  width: 50,
                  marginVertical: 5,
                  backgroundColor:blue,

                }}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity disabled={loading} onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ width: "100%", height: 100, backgroundColor: "white" }}
        ></View>
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
  teamMemberContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
    gap: 5,
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
    width: "90%",
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 4,
    borderColor:'black',
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    position: "absolute",
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default HomeVisit;
