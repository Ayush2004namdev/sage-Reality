import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
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
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { formatDate, getLocation } from "../lib/features";
import { submitForm, takeImage } from "../lib/helper";
import { setShowPopupDialog } from "../redux/slices/misc";
import { setUserLocation } from "../redux/slices/user";

const HomeVisit = () => {
  const { navigate } = useNavigation();
  const { user, location } = useSelector((state) => state.user);
  const {members , showPopupDialog} = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user.user.first_name,
    customerName: "",
    customerContact: "",
    remark: "",
    location: "",
    date: new Date(),
    image: null,
    teamMembers: [],
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


  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ""] });
  };
  
  const removeTeamMember = (index) => {
    formData.teamMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers:formData.teamMembers});
  };
  
  const handleTeamMemberChange = (index, value) => {
    if(value === 'select') return;
    if(formData.teamMembers.includes(value)) return;
    const updatedMembers = formData.teamMembers.map((member, i) =>
      i === index ? value : member
    );
    setFormData({ ...formData, teamMembers: updatedMembers });
  };


  const handleSubmit = async () => {
    
    const emptyField = Object.keys(formData).find((key) => {
      if (
        key === "teamMembers" &&
        (formData[key].length <= 0 || formData[key][0] === "")
      ) {
        if (formData["visit_type"] === "TeamVisit") return "Team Members";
        return false;
      }
      if(key === 'customerContact'){
        if(formData[key].length !== 10) return 'customerContact';
        if(formData[key][0] >= 6 && formData[key][0] <= 9) return false;
        return true;
      }
      return !formData[key];
    });

    if (emptyField) {
      if(emptyField === 'customerContact') return Alert.alert("Validation Error", `Please enter a valid Mobile Number.`, [{ text: "OK" }]);
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
      setIsLoading(false);
      return;
    }
    try {

      if(!location) {
        const userLocation = await getLocation();
        dispatch(setUserLocation(userLocation));
      }

    setIsLoading(true);
      const teamMembers = formData.teamMembers.filter((member) => member !== "")
      setFormData({...formData , teamMembers});
      const data = {
        username: formData.name,
        customer_name : formData.customerName,
        customer_contact : formData.customerContact,
        date : formatDate(formData.date),
        visit_details : formData.remark,
        site_visit_name : formData.location,
        visit_type : formData.visit_type,
        image : formData.image,
        co_name : formData.teamMembers,
        location: location
      }
      await submitForm('Home-Visit' , data , user , setShowPopupDialog , setIsLoading , dispatch);
      setFormData({
        name: user.user.first_name,
        customerName: "",
        customerContact: "",
        remark: "",
        location: "",
        date: new Date(),
        image: null,
        teamMembers: [],
        visit_type: "",
      })
      // navigate('Dashboard');
    } catch (err) {
      // Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
      setIsLoading(false);
      dispatch(setShowPopupDialog({title: "Error", message: "Something went wrong" , workDone: false}));
      console.log({ err });
    }
  };

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
          <Text style={styles.title}>Home Visit Form</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Your Home Visit Details..</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              editable={false}
              value={formData.name}
              onChangeText={(value) => useChangeData("name", value , false , setFormData)}
              placeholder="Enter Your Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}> Customer Name</Text>
            <TextInput
              value={formData.customerName}
              onChangeText={(value) => useChangeData("customerName", value , false , setFormData)}
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
                useChangeData("customerContact", value , true , setFormData)
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
                onPress={() => setShowDatePicker(false)}
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
              onChangeText={(value) => useChangeData("remark", value , false , setFormData)}
              placeholder="Remark"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={(value) => useChangeData("location", value , false , setFormData)}
              placeholder="Enter Location"
              style={styles.inputText}
            />
          </View>

          <Pressable
            onPress={() => takeImage(setFormData)}
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
                  useChangeData("visit_type", value , false , setFormData);
                  if (value === "team") {
                    setShowTeamSelect(true);
                  } else {
                    // setFormData({ ...formData, teamMembers: [] });
                    setShowTeamSelect(false);
                    setFormData({ ...formData, teamMembers: []  , visit_type: value});
                  }
                }}
                value={formData.visit_type}
              >
                
                <View style={styles.radioButton}>
                  <RadioButton value="solo" />
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
              <Text style={styles.label}>Add Cofellow</Text>
              {formData.teamMembers.map((member, index) => (
                <View key={index} style={styles.teamMemberContainer}>
                  <View style={styles.pickerContainer}>

                  <Picker
                selectedValue={formData.teamMembers[index]}
                onValueChange={(itemValue) => handleTeamMemberChange(index,itemValue)}
                style={styles.picker}
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

          <TouchableOpacity disabled={loading} onPress={handleSubmit} style={[styles.submitButton]}>
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
