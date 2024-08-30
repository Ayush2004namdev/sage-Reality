import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { formatDate, getLocation } from "../lib/features";
import { submitForm } from "../lib/helper";
import { setShowPopupDialog } from "../redux/slices/misc";
import { setUserLocation } from "../redux/slices/user";

const SageMitraFollowUp = () => {
  const { navigate } = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showenList, setShowenList] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [showAddSageMitra, setShowAddSageMitra] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const inputRefs = useRef({});

  const { sage_mitra_list, showPopupDialog } = useSelector(
    (state) => state.misc
  );
  const { user, location } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, date: currentDate });
  };

  const [formData, setFormData] = useState({
    new_sm_name: "",
    new_sm_contact: "",
    name: user.user.first_name,
    date: new Date(),
    mobileNumber: "",
    noOfLeads: "",
    leadDetails: "",
    sageMitra: "",
   
  });

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      console.log("");
      setFormData({
        new_sm_name: "",
        new_sm_contact: "",
        name: user.user.first_name,
        date: new Date(),
        mobileNumber: "",
        noOfLeads: "",
        leadDetails: "",
        sageMitra: "",
      });
      setSearchVal("");
      setMobileNumber("");
      setLoading(false);
      return () => {
        setFormData({
          new_sm_name: "",
          new_sm_contact: "",
          name: user.user.first_name,
          date: new Date(),
          mobileNumber: "",
          noOfLeads: "",
          leadDetails: "",
          sageMitra: "",
        });
        setSearchVal("");
        setMobileNumber("");
      };
    }, [])
  );

  const handleInputChange = (name, value) => {
    if (name === "search") {
      setSearchVal(value);
      const searchTerm = value.toLowerCase();
      setMobileNumber('');
      // console.log(sage_mitra_list);
      const filteredList = sage_mitra_list.filter((item) => {
        return item[0] && item[0].toLowerCase().includes(searchTerm);
      });

      setShowenList([...filteredList]);
      return;
    }


    if (name === "sageMitra") {
      if (value === "Others") {
        setShowAddSageMitra(true);
        setSearchVal(value);
        setShowenList(false);
        setFormData({ ...formData, sageMitra: 'Others' });
        return;
      } else {
        setMobileNumber(Number(value[1]));
        // useChangeData("mobileNumber", Number(value[1]), true, setFormData);
        setShowAddSageMitra(false);
        setMobileNumber(value[1]);
      }
      setSearchVal(value[0]);
      setShowenList(false);
      setFormData({ ...formData, sageMitra: value[0] });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // console.log({'smmitra':formData.sageMitra});

  const handleSubmit = async () => {
    // console.log('working');
    const emptyField = Object.keys(formData).find((key) => 
      {

        console.log(key , formData[key]);

      if (key === "new_sm_contact" || key === "new_sm_name") {
        if (formData.sageMitra === "Others") {
          console.log(key,formData[key]); 

          if(key === 'new_sm_contact'){
            const mob = formData[key].toString();
            if(mob.length !== 10 || mob[0]<6) return key;
          } 
          if(key === 'new_sm_name' && formData[key].length < 3) return key;

          return false;
        }
        return false;
      }

      if(key === 'sageMitra' && formData[key] === 'Others') return false;

      if(key === 'mobileNumber') return false;

      if(key === 'leadDetails' && formData[key].length < 150) return key;

      return !formData[key];
    });

    if(setShowAddSageMitra === false && (mobileNumber.length !== 10 || mobileNumber[0]<6) ) return Alert.alert('Validation Error', 'Please Enter Valid Mobile Number' , [{text:'OK'}]);

    let alertFieldName = "";

  switch (emptyField) {
    case "mobileNumber":
      alertFieldName = "Mobile Number";
      break;
    case "noOfLeads":
      alertFieldName = "Number of Leads";
      break;
    case "leadDetails":
      alertFieldName = "Lead Details";
      break;
    case "sageMitra":
      alertFieldName = "Sage Mitra";
      break;
    case "new_sm_name":
      alertFieldName = "New Sage Mitra Name";
      break;
    case "new_sm_contact":
      alertFieldName = "New Sage Mitra Contact";
      break;
    default:
      alertFieldName = false;
  }


    if (emptyField && alertFieldName) {

      if(emptyField === 'leadDetails'){
        return Alert.alert(
          "🔴 OOPS!",
          `Please Provide atleast 150 characters.`,
          [
            {
              text: "OK",
              onPress: () => inputRefs?.current[emptyField]?.focus(),
            }
          ]
        );

        }

        Alert.alert(
          "🔴 OOPS!",
          `Please Provide valid ${alertFieldName}.`,
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
      setLoading(true);
      const data = {
        username: formData.name,
        sm_name: formData.sageMitra[0],
        followup_date: formatDate(formData.date),
        no_leads: formData.noOfLeads,
        lead_Detail: formData.leadDetails,
        sm_contact: mobileNumber,
        new_sm_name:
          formData.sageMitra === "Others" ? formData.new_sm_name : "",
        new_sm_contact:
          formData.sageMitra === "Others" ? formData.new_sm_contact : "",
        lat_long: location,
      };

      await submitForm(
        "Sage-Mitra-Form",
        data,
        user,
        setShowPopupDialog,
        setLoading,
        dispatch,true
      ); 
      // setLoading(false);
      // alert('Form Submitted Successfully');
    } catch (err) {
      setLoading(false);
      if(err?.message === 'Location request failed due to unsatisfied device settings'){
        dispatch(setShowPopupDialog({title: "Location Access Denied", message: "Please allow the location access for the application" , workDone: false}));
            return;
        }

      dispatch(
        setShowPopupDialog({
          title: "Error",
          message: "Something went wrong",
          workDone: false,
          to: "SageMitraFollowUp",
        })
      );

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
          <Text style={styles.title}>Sage Mitra Follow Up</Text>
          <View style={styles.separator}></View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Sage Mitra</Text>
            <TextInput
              placeholder="Enter SAGE Mitra Name"
              style={styles.inputText}
              value={searchVal}
              onChangeText={(val) => handleInputChange("search", val)}
              ref={(ref) => (inputRefs.current["sageMitra"] = ref)}
            />
            {searchVal && (
              <>
                <ScrollView
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                >
                  {showenList && (
                    <>
                      {showenList.map((item) => (
                        <TouchableOpacity
                          onPress={() => handleInputChange("sageMitra", item)}
                          key={item}
                          style={{
                            padding: 10,
                            borderWidth: 1,
                            borderTopWidth: 0,
                            borderBottomColor: "black",
                          }}
                        >
                          <Text>{item[0]}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        onPress={() => handleInputChange("sageMitra", "Others")}
                        // key={item}
                        style={{
                          padding: 10,
                          borderWidth: 1,
                          borderTopWidth: 0,
                          borderBottomColor: "black",
                        }}
                      >
                        <Text>Others</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              </>
            )}
          </View>

          {showAddSageMitra && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Sage Mitra</Text>
                <TextInput
                  value={formData.new_sm_name}
                  onChangeText={(value) =>
                    useChangeData("new_sm_name", value, false, setFormData)
                  }
                  placeholder="Enter new Sage Mitra Name"
                  style={styles.inputText}
                  ref={(ref) => (inputRefs.current["new_sm_name"] = ref)}
                  // keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sage Mitra Mobile Number</Text>
                <TextInput
                  value={formData.new_sm_contact}
                  onChangeText={(value) =>
                    useChangeData("new_sm_contact", value, true, setFormData)
                  }
                  placeholder="Enter New Sage Mitra Mobile Number"
                  style={styles.inputText}
                  keyboardType="numeric"
                  ref={(ref) => (inputRefs.current["new_sm_contact"] = ref)}
                />
              </View>
            </>
          )}
          {!showAddSageMitra && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                value={mobileNumber} 
                onChangeText={(value) =>{
                  if(isNaN(value) || value.toString().includes('.')) return;
                  setMobileNumber(value);
                  // useChangeData("mobileNumber", value, true, setFormData);
                }
                }
                placeholder="Enter Mobile Number"
                style={styles.inputText}
                keyboardType="numeric"
                ref={(ref) => (inputRefs.current["mobileNumber"] = ref)}
              />
            </View>
          )}


          <View style={styles.inputGroup}>
            <Text style={styles.label}>No Of leads</Text>
            <TextInput
              value={formData.noOfLeads}
              onChangeText={(value) =>
                useChangeData("noOfLeads", value, true, setFormData)
              }
              placeholder="No of leads shared in this follow up"
              style={styles.inputText}
              keyboardType="numeric"
              ref={(ref) => (inputRefs.current["noOfLeads"] = ref)}
            />
          </View>

          <View style={styles.inputGroup}>
          <View style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
              }}>
                 <Text style={styles.label}>Lead Details</Text>
                <Text style={{
                  color: formData.leadDetails.length > 150 ? 'green' : 'red'
                }}>{formData.leadDetails.length}/150</Text>
                </View>
           
            <TextInput
              value={formData.leadDetails}
              onChangeText={(value) =>
                useChangeData("leadDetails", value, false, setFormData)
              }
              placeholder="Enter Lead Details/Description"
              style={[styles.inputText , {height: 100 , textAlignVertical: 'top' }]}
              ref={(ref) => (inputRefs.current["leadDetails"] = ref)}
              multiline={true}
            />
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
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

export default SageMitraFollowUp;
