import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-navigation";
import * as ImagePicker from "expo-image-picker";
import { blue, yellow } from "../constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatDate } from "../lib/features";
import { useNavigation } from "@react-navigation/native";
import useChangeData from "../hooks/useChangeData";

const CorpVisit = () => {
  const {navigate} = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlannedDatePicker, setShowPlannedDatePicker] = useState(false);
  const [showReasonTextInput, setShowReasonTextInput] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const { corporate_list, corporate_type, members } = useSelector((state) => state.misc);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user.user.first_name,
    location: "",
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

  const onPlannedDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.plannedDate;
    setShowPlannedDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, plannedDate: currentDate });
  };

  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ""] });
  };

  const removeTeamMember = (index) => {
    formData.teamMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers: formData.teamMembers });
  };

  const handleTeamMemberChange = (index, value) => {
    if(formData.teamMembers.includes(value)) return;
    const updatedMembers = formData.teamMembers.map((member, i) =>
      i === index ? value : member
    );
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleSubmit = async () => {
    const emptyField = Object.keys(formData).find((key) => {
      if (key === "reason" ) {
        if (formData['firstGroupValue'] === "NotPlanned" && formData["reason"] === "") {
          return true;
        }
        return false;
      }
      if(key === 'mobileNumber'){
        if(formData[key].length !== 10) return 'Mobile Number';
        if(formData[key][0] >= 6 && formData[key][0] <= 9) return false;
        return true;
      }
     
      return !formData[key];
    });

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
      setLoading(true);
      const res = await axios.post(
        "http://10.22.130.15:8000/api/Coporate-Visit-Form",
        {
          name : formData.name,
          date : formatDate(formData.date),
          corp_type : formData.corporateType,
          corp_name : formData.corporate,
          location : formData.location,
          key_person : formData.keyPerson,
          key_person_contact : formData.mobileNumber,
          meet_person : formData.noOfPeopleMet,
          image : formData.image,
          data_collect : formData.DataCollected,
          presentation : formData.firstGroupValue,
          nxt_date : formatDate(formData.plannedDate),
          reason : formData.reason,
          visit_type : formData.secondGroupValue,
          co_names : formData.teamMembers,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );
      if(res.data.error) return Alert.alert('Error', res.data.error , [{text:'OK'}]);
      Alert.alert("Success", "Form Filled SuccessFully.", [{ text: "OK" }]);
      setFormData({
        name: user.user.first_name,
        location: "",
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
      })
      navigate('Dashboard');
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
    }finally{
      setLoading(false);
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
      base64: true,
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
              onChangeText={(value) => useChangeData("name", value , false , setFormData)}
              placeholder="Enter Your Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
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
                onPress={() => setShowDatePicker(false)}
                style={styles.dateIcon}
              >
                <Icon name="date-range" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Corporate Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.corporateType}
                onValueChange={(itemValue) =>
                  useChangeData("corporateType", itemValue , false , setFormData)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {corporate_type.map((item, index) => (
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
                onValueChange={(itemValue) =>
                  useChangeData("corporate", itemValue , false , setFormData)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {corporate_list.map((item, index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={(value) => useChangeData("location", value , false , setFormData)}
              placeholder="Enter Location/Branch"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Key Person</Text>
            <TextInput
              value={formData.keyPerson}
              onChangeText={(value) => useChangeData("keyPerson", value , false , setFormData)}
              placeholder="Enter Key Person"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.mobileNumber}
              onChangeText={(value) => useChangeData("mobileNumber", value , true , setFormData)}
              placeholder="Enter Mobile Number of Key Person"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>No of People Met</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.noOfPeopleMet}
              onChangeText={(value) =>
                useChangeData("noOfPeopleMet", value , true , setFormData)
              }
              placeholder="Enter No of People Met..."
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Collected</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.DataCollected}
              onChangeText={(value) =>
                useChangeData("DataCollected", value , false , setFormData)
              }
              placeholder="Enter Data Collected"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Presentation</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => {
                  useChangeData("firstGroupValue", value , false , setFormData);
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
            <View
              style={[styles.inputGroup, { marginTop: -20, marginBottom: 30 }]}
            >
              <Text style={styles.label}>Planned Date</Text>
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
                  editable={true}
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
                    onChange={onPlannedDateChange}
                  />
                )}
              </View>
            </View>
          )}

          {showReasonTextInput && (
            <View
              style={[styles.inputGroup, { marginTop: -20, marginBottom: 30 }]}
            >
              <Text style={styles.label}>Reason</Text>
              <TextInput
                value={formData.reason}
                onChangeText={(value) => useChangeData("reason", value , false , setFormData)}
                placeholder="Enter Reason"
                style={styles.inputText}
              />
            </View>
          )}

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
                  useChangeData("secondGroupValue", value , false , setFormData);
                  if (value === "TeamVisit") {
                    setShowTeamSelect(true);
                  } else {
                    setShowTeamSelect(false);
                    setFormData({ ...formData, teamMembers: []  , secondGroupValue: value});
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
                  <View style={[styles.pickerContainer,{width:"90%"}]}>
                    <Picker
                      selectedValue={formData.teamMembers[index]}
                      onValueChange={(itemValue) =>
                        handleTeamMemberChange(index, itemValue)
                      }
                      style={[styles.picker]}
                    >
                      <Picker.Item label="Select" value="select" />
                      {members.map((item) => (
                        <Picker.Item key={item} label={item} value={item} />
                      ))}
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
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: 5,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "white",
                    width: 50,
                    marginVertical: 5,
                    backgroundColor: blue,
                  }}
                >
                  Add
                </Text>
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
  teamMemberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    gap: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingBottom: 5,
    width: "100%",
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: "100%",
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

export default CorpVisit;
