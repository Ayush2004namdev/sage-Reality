import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Button,
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
import { SafeAreaView } from "react-navigation";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { formatDate, getLocation } from "../lib/features";
import { submitForm, takeImage } from "../lib/helper";
import { setIsMenuOpen, setShowPopupDialog, toggleAdd } from "../redux/slices/misc";
import { logout, setUserLocation } from "../redux/slices/user";

const CorpVisit = () => {
  const {navigate} = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlannedDatePicker, setShowPlannedDatePicker] = useState(false);
  const [showReasonTextInput, setShowReasonTextInput] = useState(false);
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const [corporateList , setCorporateList] = useState([]);
  const { corporate_list, corporate_type, members , showPopupDialog} = useSelector((state) => state.misc);
  const [loading, setLoading] = useState(false);
  const { user ,location} = useSelector((state) => state.user);
  const inputRefs = useRef({});
  const dispatch = useDispatch();
  const [showKeyPresonTwo , setShowKeyPresonTwo] = useState(false);
  const [showNumberOfAttendees , setShowNumberOfAttendees] = useState(false);
  const [formData, setFormData] = useState({  
    corporateType: "select",
    corporate: "select", 
    name: user.user.first_name,
    location: "",
    keyPerson: "",
    mobileNumber: "",
    key_person_two: "",
    key_person_contact_two: "",
    noOfPeopleMet: "",
    DataCollected: "",
    firstGroupValue: null,
    secondGroupValue: null,
    date: new Date(),
    plannedDate: new Date(),
    image: null,
    reason: "",
    number_of_attendees: "",
    teamMembers: [],
  });

  useFocusEffect(useCallback(() => {
    setFormData({
      corporateType: "select",
      corporate: "select", 
      name: user.user.first_name,
      location: "",
      keyPerson: "",
      mobileNumber: "",
      key_person_two: "",
      key_person_contact_two: "",
      noOfPeopleMet: "",
      DataCollected: "",
      firstGroupValue: null,
      secondGroupValue: null,
      date: new Date(),
      plannedDate: new Date(),
      image: null,
      reason: "",
      number_of_attendees: "",
      teamMembers: [],
    })
    setShowKeyPresonTwo(false);
    setShowReasonTextInput(false);
    setShowPlannedDatePicker(false);
    setShowDatePicker(false);
    setShowTeamSelect(false);
    setShowNumberOfAttendees(false);
    
  },[]))

  const onPlannedDateChange = (event, selectedDate) => {
    console.log(selectedDate);
    const currentDate = selectedDate || formData.plannedDate;
     console.log(currentDate);
    setShowDatePicker(Platform.OS === "ios");
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
    if(value === 'select') return;
    if(formData.teamMembers.includes(value)) return;
    const updatedMembers = formData.teamMembers.map((member, i) =>
      i === index ? value : member
    );
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleAddKeypersonPress = () => {
      setShowKeyPresonTwo(true);
  }
  
  const handleSubmit = async () => {

    console.log({formData});
    const emptyField = Object.keys(formData).find((key) => {

      if(key === 'number_of_attendees'){
        if(!showNumberOfAttendees) return false;
        if(formData.number_of_attendees.toString().trim() === "") return key;
        if(formData.number_of_attendees < 5) return key;
        return false;
      }

      if (key === "reason" ) {
        if (formData['firstGroupValue'] === "NotPlanned" && formData["reason"] === "") {
          if(formData['reason'].length < 50) return key;
          return true;
        }
        return false;
      }

     

      if(key === 'key_person_two') {
        if(showKeyPresonTwo === false) return false;
        return formData[key].trim().length >= 4 ? false : key;
      }     

      if(key === 'key_person_contact_two') {
        const mob = formData[key].toString();
        if(showKeyPresonTwo === false) return false;
        if(mob.length !== 10) return 'Mobile Number';
        if(mob[0] >= 6 && mob[0] <= 9) return false;
        return true;
      }
      
      if ( key === "teamMembers") {
        const fileterd = formData[key].filter((member) => member !== "");
        if(fileterd.length > 0 && formData["secondGroupValue"] === 'team'){
          return false;
        };
        if (formData["secondGroupValue"] === "solo") {
          return false;
        }
        return true;
      }

      // if(key === 'number_of_attendees'){
      //   console.log(formData[key]);
      //   console.log(typeof formData[key]);
      // }

      if(typeof formData[key] === 'string'){
        if(formData[key].trim() === ""){
          return key;
        }
        else if(formData[key].length < 3){
          return key;
        }
    }

    

    if(key === 'DataCollected'){
      console.log(typeof formData[key]);
      if(formData[key] >= 0) return false;
      return true;
    }
     
      if(key === 'corporate'){
        if(corporateList.length === 0) return false;
        if(formData[key] === 'select') return key;
        return false;
      }
      if(key === 'corporateType' || key === 'corporate') return formData[key] === 'select';

      if(key === 'mobileNumber'){
        const mob = formData[key].toString();
        console.log('hii 2' , mob.length , mob[0]);
        if(mob.length !== 10) return 'Mobile Number';
        if(mob[0] >= 6 && mob[0] <= 9) return false;
        console.log('hii' , mob.length , mob[0]);
        return true;
      }

     

    
      return !formData[key];
    });


    let alertFieldName = "";

    switch (emptyField) {
      case "location":
        alertFieldName = "Location";
        break;
      case "keyPerson":
        alertFieldName = "Key Person Name";
        break;
      case "mobileNumber":
        alertFieldName = "Mobile Number";
        break;
      case "corporateType":
        alertFieldName = "Type of Corporate";
        break;
      case "corporate":
        alertFieldName = "Corporate Name";
        break;
      case "firstGroupValue":
        alertFieldName = "Presentation";
        break;
      case "secondGroupValue":
        alertFieldName = "Visit Type";
        break;
      case "plannedDate":
        alertFieldName = "Planned Date";
        break;
      case "image":
        alertFieldName = "Corporate Visit Pic";
        break;
      case "reason":
        alertFieldName = "Reason";
        break;
      case "noOfPeopleMet":
        alertFieldName = "Number of People Met";
        break;
      case "DataCollected":
        alertFieldName = "Data Collected";
        break;
      case "key_person_two":
        alertFieldName = "Second Key Person";
        break;
      case "key_person_contact_two":
        alertFieldName = "Second Key Person Contact";
        break;
      case "teamMembers":
        alertFieldName = "Team Members";
        break;
      case "number_of_attendees":
        alertFieldName = "Number of Attendees";
        break;
      default:
        alertFieldName = 'All Details';
    }

    if (emptyField && alertFieldName) {

      if(emptyField === 'number_of_attendees'){
        return Alert.alert(
          "🔴 OOPS!",
          `Number of Attendees should be greater than 5.`,
          [
            {
              text: "OK",
              onPress: () => inputRefs?.current[emptyField]?.focus(),
            }
          ]
        );
      }

      if(alertFieldName === 'All Details'){
        return Alert.alert(
          "🔴 OOPS!",
          `Please Provide ${alertFieldName === 'mobileNumber' ? 'valid ' : ''}${alertFieldName}.`,
          [
            {
              text: "OK",
              // onPress: () => inputRefs?.current[emptyField]?.focus(),
            }
          ]
        );
      }
      Alert.alert(
        "🔴 OOPS!",
        `Please Provide ${alertFieldName === 'mobileNumber' ? 'valid ' : ''}${alertFieldName}.`,
        [
          {
            text: "OK",
            onPress: () => inputRefs?.current[emptyField]?.focus(),
          }
        ]
      );
      
      return;
    }
    try {

      let lat_long = [
        location?.coords?.latitude,
        location?.coords?.longitude,
      ];
  
        if (!location) {
          const userLocation = await getLocation();
          dispatch(setUserLocation(userLocation));
          lat_long = [
            userLocation?.coords?.latitude,
            userLocation?.coords?.longitude,
          ]
          // return;
        }

      setLoading(true);
      const data = {
        name : formData.name,
        date : formatDate(formData.date),
        corp_type : formData.corporateType[0],
        corp_name : formData.corporate[0],
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
        co_name : formData.teamMembers,
        lat_long: lat_long,
        num_attend: formData.number_of_attendees,
      }

      await submitForm('Coporate-Visit-Form',data , user , setShowPopupDialog , setLoading , dispatch);
    setFormData({
      corporateType: "select",
    corporate: "select", 
    name: user.user.first_name,
    location: "",
    keyPerson: "",
    mobileNumber: "",
    key_person_two: "",
    key_person_contact_two: "",
    noOfPeopleMet: "",
    DataCollected: "",
    firstGroupValue: null,
    secondGroupValue: null,
    date: new Date(),
    plannedDate: new Date(),
    image: null,
    reason: "",
    number_of_attendees: "",
    teamMembers: [],
      })
    } catch (err) {
      console.log(err);
      setLoading(false);
      if(err?.message === 'Location request failed due to unsatisfied device settings'){
        dispatch(setShowPopupDialog({title: "Location Access Denied", message: "Please allow the location access for the application" , workDone: false}));
            return;
        }
      dispatch(setShowPopupDialog({title: "Error", message: "Something went wrong" , workDone: false}));
    }finally{
      setLoading(false);
    }
  };

  const handleCorporateListChange = (itemValue) => {
    if(itemValue === 'select'){
      setFormData({...formData , corporateType: itemValue});
      setCorporateList([]);
      return;
      }
    console.log(itemValue[1]);
    // console.log(corporate_list);
    const filtered = corporate_list.filter((item) => item[1].toString() === itemValue[1].toString());
    console.log(filtered);
    setCorporateList(filtered);
  }

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
          <Text style={styles.title}>Corporate Visit</Text>
          <View style={styles.separator}></View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Corporate Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.corporateType}
                onValueChange={(itemValue) =>{
                  handleCorporateListChange(itemValue);
                  setFormData({...formData , corporateType: itemValue});
                  // useChangeData("corporateType", itemValue , false , setFormData)
                }
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {corporate_type.map((item, index) => (
                  <Picker.Item label={item[0]} value={item} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Corporate Name</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.corporate}
                onValueChange={(itemValue) => {
                  setFormData({...formData , corporate: itemValue})
                }
              }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {corporateList.map((item, index) => (
                  <Picker.Item label={item[0]} value={item} key={index} />
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
              ref={(ref) => (inputRefs.current["location"] = ref)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Key Person</Text>
            <TextInput
              value={formData.keyPerson}
              onChangeText={(value) => useChangeData("keyPerson", value , false , setFormData)}
              placeholder="Enter Key Person Name "
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["keyPerson"] = ref)}
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
              ref={(ref) => (inputRefs.current["mobileNumber"] = ref)}
            />
          </View>

          {!showKeyPresonTwo && <Pressable style={{
            padding: 10,
            backgroundColor: blue,
            borderRadius: 5,
            marginTop: 10,
          }} onPress={handleAddKeypersonPress}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
            }}>Add Key Person</Text>
          </Pressable>
          }
          {showKeyPresonTwo && (
              <>
                 <View style={styles.inputGroup}>
            <Text style={styles.label}>Second Key Person</Text>
            <View style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            gap:10,
          }}>
            <TextInput
              value={formData.key_person_two}
              onChangeText={(value) => useChangeData("key_person_two", value , false , setFormData)}
              placeholder="Enter Second Key Person Name"
              style={[styles.inputText , {width:"90%"}]}
              ref={(ref) => (inputRefs.current["key_person_two"] = ref)}
            />
            <TouchableOpacity>
                <Icon name="remove-circle-outline" size={24} color="red" onPress={() => {setShowKeyPresonTwo(false); setFormData({...formData , key_person_contact_two:'' , key_person_two:''})}}/>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.key_person_contact_two}
              onChangeText={(value) => useChangeData("key_person_contact_two", value , true , setFormData)}
              placeholder="Enter Mobile Number of Second Key Person"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["key_person_contact_two"] = ref)}
              />
          </View>
              
              </>
          )}


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of People Met</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.noOfPeopleMet}
              onChangeText={(value) =>
                useChangeData("noOfPeopleMet", value , true , setFormData)
              }
              placeholder="Enter Number of People Met"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["noOfPeopleMet"] = ref)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Collected</Text>
            <TextInput
              keyboardType="numeric"
              value={formData.DataCollected}
              onChangeText={(value) =>
                useChangeData("DataCollected", value , true , setFormData)
              }
              placeholder="Enter Data Collected"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["DataCollected"] = ref)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Presentation</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => {
                  useChangeData("firstGroupValue", value , false , setFormData);
                  if (value === "Planned") {
                    setShowNumberOfAttendees(false)
                    setShowPlannedDatePicker(true);
                    setShowReasonTextInput(false);
                  } else if (value === "NotPlanned") {
                    setShowNumberOfAttendees(false)
                    setShowReasonTextInput(true);
                    setShowPlannedDatePicker(false);
                  } else {
                    setShowNumberOfAttendees(true)
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
                  value={formData.plannedDate.toLocaleDateString()}
                  placeholder="Select Date"
                  editable={false}
                  ref={(ref) => (inputRefs.current["plannedDate"] = ref)}
                />
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateIcon}
                >
                  <Icon name="date-range" size={24} color="black" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.plannedDate}
                    mode="date"
                    maximumDate={oneDayAfter}
                    minimumDate={currentDate}
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
              <View style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
              }}>
                <Text style={styles.label}>Reason</Text>
                <Text style={{
                  color: formData.reason.length > 50 ? 'green' : 'red'
                }}>{formData.reason.length}/50</Text>
                </View>
              <TextInput
                value={formData.reason}
                onChangeText={(value) => useChangeData("reason", value , false , setFormData)}
                placeholder="Enter Reason"
                style={[styles.inputText , {height: 100 , textAlignVertical: "top" , padding: 10 }]}
                multiline={true}
                ref={(ref) => (inputRefs.current["reason"] = ref)}
              />
            </View>
          )}

          {showNumberOfAttendees && (
             <View style={styles.inputGroup}>
             <Text style={styles.label}>Number of Attendees</Text>
             <TextInput
               keyboardType="numeric"
               value={formData.number_of_attendees}
               onChangeText={(value) =>
                 useChangeData("number_of_attendees", value , true , setFormData)
               }
               placeholder="Enter Number of Attendees"
               style={styles.inputText}
               ref={(ref) => (inputRefs.current["number_of_attendees"] = ref)}
             />
           </View>
          )}

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
                  useChangeData("secondGroupValue", value , false , setFormData);
                  if (value === "team") {
                    setShowTeamSelect(true);
                  } else {
                    setShowTeamSelect(false);
                    setFormData({ ...formData, teamMembers: []  , secondGroupValue: value});
                  }
                }}
                value={formData.secondGroupValue}
              >
               <View style={{
                display:'flex',
                flexDirection:'row',
                width:'100%',
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
          style={{ width: "100%", height: 100, backgroundColor: '#F6F5F5', }}
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
    backgroundColor: '#F6F5F5',
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
