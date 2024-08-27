import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
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
    name: user.user.first_name,
    date: new Date(),
    mobileNumber: "",
    noOfLeads: "",
    leadDetails: "",
    sageMitra: "",
    new_sm_name: "",
    new_sm_contact: "",
  });

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      console.log("");
      setFormData({
        name: user.user.first_name,
        date: new Date(),
        mobileNumber: "",
        noOfLeads: "",
        leadDetails: "",
        sageMitra: "",
      });
      setSearchVal("");
      setMobileNumber("");

      return () => {
        setFormData({
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
    const emptyField = Object.keys(formData).find((key) => {
      if (key === "new_sm_contact" || key === "new_sm_name") {
        if (formData.sageMitra === "Others") {
          if (!formData[key]) return key;
        }
        return false;
      }

      if(key === 'sageMitra' && formData[key] === 'Others') return false;

      if(key === 'mobileNumber') return false;

      if(key === 'leadDetails' && formData[key].length < 150) return key;

      return !formData[key];
    });

    if(setShowAddSageMitra === false && (mobileNumber.length !== 10 || mobileNumber[0]<6) ) return Alert.alert('Validation Error', 'Please Enter Valid Mobile Number' , [{text:'OK'}]);

    if (emptyField) {

      if(emptyField === 'leadDetails') return Alert.alert('Validation Error', 'Please Enter atleast 150 characters in Lead Details' , [{text:'OK'}]);

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
      // if (!location) {
      //   const userLocation = await getLocation();
      //   dispatch(setUserLocation(userLocation));
      // }

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
      // const res = await axios.post('http://182.70.253.15:8000/api/Sage-Mitra-Form', {
      //   name: formData.name,
      //   date: formData.date,
      //   mobileNumber: formData.mobileNumber,
      //   noOfLeads: formData.noOfLeads,
      //   leadDetails: formData.leadDetails,
      //   sageMitra: formData.sageMitra,
      // } , {
      //   headers:{
      //     Authorization: `Bearer ${user.access}`
      //   }
      // })
      // setLoading(false);
      // if(res.data.error) return dispatch(setShowPopupDialog({title:'Error' , message: res.data.error , workDone: false , to: 'SageMitraFollowUp'}));
      // console.log(res.data);
      // dispatch(setShowPopupDialog({title:'Success' , message: 'Sage Mitra Followup Added Successfully' , workDone: true , to: 'Dashboard'}));
      // console.log('working 3')
      // setFormData({
      //   name: user.user.first_name,
      //   date: new Date(),
      //   mobileNumber: "",
      //   noOfLeads: "",
      //   leadDetails: "",
      //   sageMitra: "",
      // });
      // setSearchVal('')
      // Alert.alert('Success', 'Sage Mitra Followup Added Successfully' , [{text:'OK'}]);
      // navigate('Dashboard');
      // setLoading(false); 
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

      // console.log(err);
      // Alert.alert('Error', 'Something went wrong' , [{text:'OK'}]);
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
          {/* <Text style={styles.caption}>
            Feed Your Sage Mitra Followup Details.
          </Text> */}
{/* 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter Your Name"
              style={styles.inputText}
              editable={false}
            />
          </View> */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Sage Mitra</Text>
            <TextInput
              placeholder="Enter SAGE Mitra Name"
              style={styles.inputText}
              value={searchVal}
              onChangeText={(val) => handleInputChange("search", val)}
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
              />
            </View>
          )}

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Follow Up Date</Text>
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
          </View> */}

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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lead Details</Text>
            <TextInput
              value={formData.leadDetails}
              onChangeText={(value) =>
                useChangeData("leadDetails", value, false, setFormData)
              }
              placeholder="Enter Lead Details/Description"
              style={[styles.inputText , {height: 100 , textAlignVertical: 'top'}]}
            />
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
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
