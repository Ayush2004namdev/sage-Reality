import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Image,
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
import {
  setIsMenuOpen,
  setLogoutPopup,
  setShowPopupDialog,
  toggleAdd,
} from "../redux/slices/misc";
import { logout, setUserLocation } from "../redux/slices/user";

const HomeVisit = () => {
  const { navigate } = useNavigation();
  const { user, location } = useSelector((state) => state.user);
  const { members, showPopupDialog } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user.user.first_name,
    customerName: "",
    customerContact: "",
    remark: "",
    location: "",
    date: new Date(),
    image: null,
    visit_type: "",
    teamMembers: [],
  });

  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const inputRefs = useRef({});


  useFocusEffect(
    useCallback(() => {
      setFormData({
        name: user.user.first_name,
        customerName: "",
        customerContact: "",
        remark: "",
        location: "",
        date: new Date(),
        image: null,
        visit_type: "",
        teamMembers: [],
      })
    },[])
  )


  const handleSearchUserData = async (value) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://182.70.253.15:8000/api/Get-Site-Visit-Data",
        { home_contact: value },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );
      console.log(res.data.data);
      if (res?.data?.data) {

        const teamMembers =  res?.data?.data?.co_fellow?.split(",");
        const dataTemplate = {
          name: res.data.data.name,
          customerName: res.data.data.C_name,
          customerContact: res.data.data.C_ph,
          remark: res.data.data.detail,
          location: res.data.data.Visit_location,
          date: new Date(res.data.data.date),
          image:null,
          teamMembers: teamMembers?.length > 0 ? [...teamMembers] : [],
          visit_type: res.data.data.visit_type,
        }
        if(teamMembers?.length>0) setShowTeamSelect(true);
        setFormData(dataTemplate);
        // console.log(res.data);
      }
      else{
        Alert.alert("Alert" , "No Previous Home Visit Found" , [{text: "OK"}]);
      }
      setIsLoading(false)
    } catch (err) {
      if(err.message === 'Network Error'){
        Alert.alert("🔴 OOPS" , "Something went Wrong" , [{text: "OK"}]);
      }
      console.log(err);
      setIsLoading(false);
    }
  };

  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ""] });
  };

  const removeTeamMember = (index) => {
    formData.teamMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers: formData.teamMembers });
  };

  const handleTeamMemberChange = (index, value) => {
    if (value === "select") return;
    if (formData.teamMembers.includes(value)) return;
    const updatedMembers = formData.teamMembers.map((member, i) =>
      i === index ? value : member
    );
    setFormData({ ...formData, teamMembers: updatedMembers });
  };


  console.log(formData.teamMembers);

  const handleSubmit = async () => {
    const emptyField = Object.keys(formData).find((key) => {

      // if(typeof formData[key] === 'string'){
      //   if(formData[key].trim().length >= 4){
      //     return key;
      //   }
      // }

      if (key === "teamMembers") {
        const fileterd = formData[key].filter((member) => member !== "");
        if(fileterd.length > 0 && formData["visit_type"] === 'team') return false;
        if (formData["visit_type"] === "solo") return false;
        return true;
      }

      
      if (key === "customerContact") {
        const mob = formData[key].toString();
        if (mob.length !== 10) return "customerContact";
        if (mob[0] >= 6 && mob[0] <= 9) return false;
        return true;
      }


      // console.log(key,formData[key]);
      if(typeof key === 'string'){
        console.log(key);
        if(key === 'date') return false;
        if(key === 'image') return !formData[key];
        // if(key === 'teamMembers') return formData[key].length <= 0 || formData[key][0] === "";
        if(formData[key]?.trim()?.length < 4) return true;
      }

      

      if(key === "remark"){
        if(formData[key].length < 100) return key;
      }

      return !formData[key];
    });

    let alertFieldName = "";

  switch (emptyField) {
    case "customerName":
      alertFieldName = "Customer Name";
      break;
    case "customerContact":
      alertFieldName = "Customer Contact";
      break;
    case "remark":
      alertFieldName = "Remark";
      break;
    case "location":
      alertFieldName = "Location";
      break;
    case "date":
      alertFieldName = "Date";
      break;
    case "image":
      alertFieldName = "Home Visit Pic";
      break;
    case "teamMembers":
      alertFieldName = "Team Members";
      break;
    case "visit_type":
      alertFieldName = "Visit Type";
      break;
    default:
      alertFieldName = false;
  }

    if (emptyField && alertFieldName) {


      if (emptyField === "customerContact")
        return Alert.alert(
          "🔴 OOPS!",
          `Please enter a valid Mobile Number.`,
          [
            {
              text: "OK",
              onPress: () => inputRefs?.current["customerContact"]?.focus(),
            },
          ]
        );

        if (emptyField === "remark")
          return Alert.alert(
            "🔴 OOPS!",
            `Please enter atleast 100 characters.`,
            [
              {
                text: "OK",
                onPress: () => inputRefs?.current["remark"]?.focus(),
              },
            ]
          );

          if (emptyField === "image")
            return Alert.alert(
              "🔴 OOPS!",
              "Please provide a Home Visit Pic.",
              [
                {
                text: "OK",
                onPress: () => console.log(`Focus on ${emptyField} field`),
              }
            ]
            );          

        
     Alert.alert(
        "🔴 OOPS!",
        `Please Provide ${alertFieldName}.`,
        [
          {
            text: "OK",
            onPress: () => inputRefs?.current[emptyField]?.focus(),
          },
        ],
        { cancelable: false }
      );
      setIsLoading(false);
      return;
    }

    try {
      if (!location) {
        const userLocation = await getLocation();
        console.log({ userLocation });
        if (!userLocation) {
          dispatch(logout());
          dispatch(setIsMenuOpen(false));
          dispatch(toggleAdd(false));
          navigate("Dashboard");
          return;
        }
        dispatch(setUserLocation(userLocation));
        return;
      }

      const lat_long = [
        location?.coords?.latitude,
        location?.coords?.longitude,
      ];
      setIsLoading(true);
      const teamMembers = formData.teamMembers.filter(
        (member) => member !== ""
      );
      setFormData({ ...formData, teamMembers });
      const data = {
        username: formData.name,
        customer_name: formData.customerName,
        customer_contact: formData.customerContact,
        date: formatDate(formData.date),
        visit_details: formData.remark,
        Visit_location: formData.location,
        visit_type: formData.visit_type,
        image: formData.image,
        co_name: formData.teamMembers,
        lat_long: lat_long,
      };
      await submitForm(
        "Home-Visit",
        data,
        user,
        setShowPopupDialog,
        setIsLoading,
        dispatch
      );
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
      });
      setIsLoading(false);
      // navigate('Dashboard');
    } catch (err) {
      // Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
      setIsLoading(false);
      if (
        err?.message ===
        "Location request failed due to unsatisfied device settings"
      ) {
        dispatch(
          setShowPopupDialog({
            title: "Location Access Denied",
            message: "Please allow the location access for the application",
            workDone: false,
          })
        );
        dispatch(setIsMenuOpen(false));
        dispatch(toggleAdd(false));
        return;
      }
      dispatch(
        setShowPopupDialog({
          title: "Error",
          message: "Something went wrong",
          workDone: false,
        })
      );
      console.log({ er: err.message });
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
      {loading && <Loading />}
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Home Visit Form</Text>
          <View style={styles.separator}></View>
          {/* <Text style={styles.caption}>Feed Your Home Visit Details</Text> */}

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              editable={false}
              value={formData.name}
              onChangeText={(value) => useChangeData("name", value , false , setFormData)}
              placeholder="Enter Your Name"
              style={styles.inputText}
            />
          </View> */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}> Customer Name</Text>
            <TextInput
              value={formData.customerName}
              onChangeText={(value) =>
                useChangeData("customerName", value, false, setFormData)
              }
              placeholder="Enter Customer Name"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["customerName"] = ref)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Contact Number</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.customerContact}
              onChangeText={(value) => {
                if (value.length == 10) {
                  handleSearchUserData(value);
                }
                useChangeData("customerContact", value, true, setFormData);
              }}
              placeholder="Enter Customer Contact Number"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["customerContact"] = ref)}
            />
          </View>


          <View style={styles.inputGroup}>
          <View style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
              }}>
                <Text style={styles.label}>Remark</Text>
                <Text style={{
                  color: formData.remark.length > 100 ? 'green' : 'red'
                }}>{formData.remark.length}/100</Text>
                </View>
           
            <TextInput
              value={formData.remark}
              onChangeText={(value) =>
                useChangeData("remark", value, false, setFormData)
              }
              placeholder="Remark"
              style={[styles.inputText , {minHeight: 100 , maxHeight:150, textAlignVertical: 'top'}]}
              multiline={true}
              ref={(ref) => (inputRefs.current["remark"] = ref)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address/Locality</Text>
            <TextInput
              value={formData.location}
              onChangeText={(value) =>
                useChangeData("location", value, false, setFormData)
              }
              placeholder="Enter Location"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["location"] = ref)}
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
                  useChangeData("visit_type", value, false, setFormData);
                  if (value === "team") {
                    setShowTeamSelect(true);
                  } else {
                    // setFormData({ ...formData, teamMembers: [] });
                    setShowTeamSelect(false);
                    setFormData({
                      ...formData,
                      teamMembers: [],
                      visit_type: value,
                    });
                  }
                }}
                value={formData.visit_type}
              >
                <View style={{
                  // backgroundColor: 'red',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                }}>


                <View style={styles.radioButton}>
                  <RadioButton value="solo" />
                  <Text style={styles.radioLabel}>Solo Visit</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="team" />
                  <Text style={styles.radioLabel}>Team Visit</Text>
                </View>
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
                      onValueChange={(itemValue) =>
                        handleTeamMemberChange(index, itemValue)
                      }
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

          <TouchableOpacity
            disabled={loading}
            onPress={handleSubmit}
            style={[styles.submitButton]}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ width: "100%", height: 100, backgroundColor: '#F6F5F5', }}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    width: 72,
    marginVertical: 5,
  },
  teamMemberContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: "black",
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
