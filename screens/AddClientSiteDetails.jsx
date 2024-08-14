import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { RadioButton } from "react-native-paper";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import { blue } from "../constants";
import { setShowPopupDialog, toggleUpdate } from "../redux/slices/misc";
import useChangeData from "../hooks/useChangeData";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddClientSiteVisitDetails = () => {
  const { user } = useSelector((state) => state.user);
  const { showPopupDialog } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const [changed, setChanged] = useState(false);

  const [formData, setFormData] = useState({
    visit_type: 'direct_visit',
    name: user.user.first_name,
    costumer_name: '',
    visit_date: new Date(),
    monthly_rent: '',
    address: '',
    costumer_contact: '',
    costumer_whatsapp: '',
    instagram_id: '',
    email_id: '',
    facebook_id: '',
    company: '',
    gross_annual_income: '',
    department: '',
    designation: '',
    birth_date: new Date(),
    marrige_anniversary: new Date(),
    budget: '',
    possesion_date: new Date(),
    remark: '',
  });

  // Separate state for each date picker visibility
  const [showVisitDatePicker, setShowVisitDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showMarriageDatePicker, setShowMarriageDatePicker] = useState(false);
  const [showPossesionDatePicker , setShowPossesionDatePicker] = useState(false);
  const [showMemberBox , setShowMemberBox] = useState(false);
  const [showenList , setShowenList] = useState([]);
  const [searchVal , setSearchVal] = useState('');
  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.visit_date;
    setShowVisitDatePicker(false); // Close the date picker
    setFormData({ ...formData, visit_date: currentDate });
  };

  const onBirthDateChange = (event, selectedDate) => {
    console.log({ selectedDate });
    const currentDate = selectedDate || formData.birth_date;
    setShowBirthDatePicker(false); // Close the date picker
    setFormData({ ...formData, birth_date: currentDate });
  };

  const onMarriageDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.marrige_anniversary;
    setShowMarriageDatePicker(false); // Close the date picker
    setFormData({ ...formData, marrige_anniversary: currentDate });
  };

  const onPossesionDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.possesion_date;
    setShowPossesionDatePicker(false); 
    setFormData({ ...formData, possesion_date: currentDate });
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
      return;
    } 
      if (isNaN(formData.visit_date)) return Alert.alert("Validation Error", "Please Add Valid Date", [{ text: "OK" }]);
      console.log(formData);
      // try {
      //   setLoading(true);
      //   const res = await axios.post(`http://182.70.253.15:8000/api/Set-Target/${user.user.first_name}`, {
      //     // Your API request payload
      //   }, {
      //     withCredentials: true,
      //     headers: {
      //       Authorization: `Bearer ${user.access}`
      //     }
      //   });
      //   setLoading(false);
      //   if (res?.data?.error) return dispatch(setShowPopupDialog({ title: "Error", message: res.data.error, workDone: false }));
      //   dispatch(setShowPopupDialog({ title: "Success", message: "Saved Successfully", workDone: true, to: 'Dashboard' }));
      // } catch (err) {
      //   setLoading(false);
      //   console.log({ err });
      //   dispatch(setShowPopupDialog({ title: "Error", message: "Something went wrong", workDone: false }));
      // }
    dispatch(toggleUpdate());
  };

  const handleInputChange = (key, value) => {
    if(key === 'search'){
      setSearchVal(value);
      return;
    }
    setFormData({ ...formData, [key]: value });
  }

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
          <Text style={styles.title}>Site Form Visit</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Client Site Visit Details.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visit Type</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => {
                  useChangeData("visit_type", value, false, setFormData);
                  if(value === 'indirect'){
                    setShowMemberBox(true);
                  }
                }}
                value={formData.visit_type}
              >
                <View style={styles.radioButton}>
                  <RadioButton value="direct" />
                  <Text style={styles.radioLabel}>Direct Visit</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton value="indirect" />
                  <Text style={styles.radioLabel}>Indirect Visit</Text>
                </View>
              </RadioButton.Group>
            </View>
              {showMemberBox && (
                <>
                <TextInput placeholder="Enter SAGE Member" style={styles.inputText} value={searchVal} onChangeText={(val) => handleInputChange('search' , val)} />
                <ScrollView style={{
                  width: '100%',
                  height: 'auto',
                }}>
                  {showenList && showenList.length > 0 && showenList.map((item) => (
                    <TouchableOpacity onPress={() => handleInputChange('member', item)} key={item} style={{padding:10 , borderWidth:1 ,borderTopWidth:0 , borderBottomColor:'black'}}>
                      <Text>{item[0]}</Text>
                    </TouchableOpacity>
                  ))}
                
                </ScrollView>
                
              </>
              )}
          </View>
              

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              editable={false}
              value={formData.name}
              onChangeText={value => useChangeData('name', value, false, setFormData)}
              placeholder="Enter Your Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Costumer Name</Text>
            <TextInput
              editable
              value={formData.costumer_name}
              onChangeText={value => useChangeData('costumer_name', value, false, setFormData)}
              placeholder="Enter Costumer Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visit Date</Text>
            <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
              <TextInput
                style={{ flexGrow: 1, paddingHorizontal: 10 }}
                value={formData.visit_date.toLocaleDateString()}
                placeholder="Select Date"
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowVisitDatePicker(true)} style={styles.dateIcon}>
                <Icon name="date-range" size={24} color="black" />
              </TouchableOpacity>
              {showVisitDatePicker && (
                <DateTimePicker
                  value={formData.visit_date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Rent</Text>
            <TextInput
              editable={true}
              value={formData.monthly_rent}
              onChangeText={value => useChangeData('monthly_rent', value, true, setFormData)}
              placeholder="Enter Monthly Rent"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              editable
              value={formData.address}
              onChangeText={value => useChangeData('address', value, false, setFormData)}
              placeholder="Enter Address"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number Of Costumer</Text>
            <TextInput
              editable={true}
              value={formData.costumer_contact}
              onChangeText={value => useChangeData('costumer_contact', value, true, setFormData)}
              placeholder="Enter Costumer Contact Number"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Costumer Whatsapp Number</Text>
            <TextInput
              editable={true}
              value={formData.costumer_whatsapp}
              onChangeText={value => useChangeData('costumer_whatsapp', value, true, setFormData)}
              placeholder="Enter Costumer Whatsapp Number"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instagram ID</Text>
            <TextInput
              editable
              value={formData.instagram_id}
              onChangeText={value => useChangeData('instagram_id', value, false, setFormData)}
              placeholder="Enter Instagram Id"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facebook Id</Text>
            <TextInput
              editable
              value={formData.facebook_id}
              onChangeText={value => useChangeData('facebook_id', value, false, setFormData)}
              placeholder="Enter Facebook Id"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Id</Text>
            <TextInput
              editable
              value={formData.email_id}
              onChangeText={value => useChangeData('email_id', value, false, setFormData)}
              placeholder="Enter Email Id"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              editable
              value={formData.company}
              onChangeText={value => useChangeData('company', value, false, setFormData)}
              placeholder="Enter Company Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gross Annual Income</Text>
            <TextInput
              editable
              value={formData.gross_annual_income}
              onChangeText={value => useChangeData('gross_annual_income', value, true, setFormData)}
              placeholder="Enter Gross Annual Income"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              editable
              value={formData.department}
              onChangeText={value => useChangeData('department', value, false, setFormData)}
              placeholder="Enter Department"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Designation</Text>
            <TextInput
              editable
              value={formData.designation}
              onChangeText={value => useChangeData('designation', value, false, setFormData)}
              placeholder="Enter Designation"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Date</Text>
            <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
              <TextInput
                style={{ flexGrow: 1, paddingHorizontal: 10 }}
                value={formData.birth_date.toLocaleDateString()}
                placeholder="Select Date"
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowBirthDatePicker(true)} style={styles.dateIcon}>
                <Icon name="date-range" size={24} color="black" />
              </TouchableOpacity>
              {showBirthDatePicker && (
                <DateTimePicker
                  value={formData.birth_date}
                  mode="date"
                  display="default"
                  onChange={onBirthDateChange}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marriage Anniversary</Text>
            <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
              <TextInput
                style={{ flexGrow: 1, paddingHorizontal: 10 }}
                value={formData.marrige_anniversary.toLocaleDateString()}
                placeholder="Select Date"
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowMarriageDatePicker(true)} style={styles.dateIcon}>
                <Icon name="date-range" size={24} color="black" />
              </TouchableOpacity>
              {showMarriageDatePicker && (
                <DateTimePicker
                  value={formData.marrige_anniversary}
                  mode="date"
                  display="default"
                  onChange={onMarriageDateChange}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget</Text>
            <TextInput
              editable={true}
              value={formData.budget}
              onChangeText={value => useChangeData('budget', value, true, setFormData)}
              placeholder="Enter Budget"
              style={styles.inputText}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Possesion Date</Text>
            <View style={[styles.datePickerContainer, { borderWidth: 1, borderColor: 'black', alignItems: 'center', paddingTop: 10, paddingBottom: 5, borderRadius: 5 }]}>
              <TextInput
                style={{ flexGrow: 1, paddingHorizontal: 10 }}
                value={formData.possesion_date.toLocaleDateString()}
                placeholder="Select Date"
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowPossesionDatePicker(true)} style={styles.dateIcon}>
                <Icon name="date-range" size={24} color="black" />
              </TouchableOpacity>
              {showPossesionDatePicker && (
                <DateTimePicker
                  value={formData.possesion_date}
                  mode="date"
                  display="default"
                  onChange={onPossesionDateChange}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              editable
              value={formData.remark}
              onChangeText={value => useChangeData('remark', value, false, setFormData)}
              placeholder="Enter Remarks"
              style={styles.inputText}
            />
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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


export default AddClientSiteVisitDetails