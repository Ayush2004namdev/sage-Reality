import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
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
const Admission = () => {
  const {navigate} = useNavigation();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: user.user.first_name,
    date: new Date(),
    fatherName: "",
    studentName: "",
    branch: "",
    Vertical: "select",
  });
  const {showPopupDialog} = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {location} = useSelector((state) => state.user);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === "ios");
    setFormData({ ...formData, date: currentDate });
  };

  const handleSubmit = async () => {
    const emptyField = Object.keys(formData).find((key) => {
      if(key === 'Vertical') return formData[key] === 'select';
      return !formData[key]
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
      if(!formatDate(formData.date)) return Alert.alert("Validation Error", "Please Enter Valid Date", [{ text: "OK" }]);
      return;
    }
    try {
      
      if(!location) {
        const userLocation = await getLocation();
        dispatch(setUserLocation(userLocation));
      }

      setLoading(true);
      const data = {
        username: formData.name,
          date: formatDate(formData.date),
          f_name: formData.fatherName,
          s_name: formData.studentName,
          vertical: formData.Vertical,
          branch_class: formData.branch,
          location: location
      }

      await submitForm('Admission-Form' , data , user , setShowPopupDialog , setLoading , dispatch , location);
      // const res = await axios.post(
      //   `http://182.70.253.15:8000/api/Admission-Form`,
      //   {
      //     username: formData.name,
      //     date: formatDate(formData.date),
      //     f_name: formData.fatherName,
      //     s_name: formData.studentName,
      //     vertical: formData.Vertical,
      //     branch_class: formData.branch,
      //   },
      //   {
      //     withCredentials: "true",
      //     headers: {
      //       Authorization: `Bearer ${user.access}`,
      //     },
      //   }
      // );
      // setLoading(false);
      // if(res.error || res.data.error) return new Error(res.error || res.data.error);
      // console.log(res.data);
      // dispatch(setShowPopupDialog({title: "Success", message: "Form filled Successfully.", workDone: true , to: 'Dashboard'}));
      // Alert.alert("Success", "From filled Successfully.", [{ text: "OK" }]);
      setFormData({
        name: user.user.first_name,
        date: new Date(),
        fatherName: "",
        studentName: "",
        branch: "",
        Vertical: "select",
      })
    } catch (err) {
      setLoading(false);
      dispatch(setShowPopupDialog({title: "Error", message: "Something went wrong." , workDone: false , to: 'Admission'}));
      console.log(err);
      // Alert.alert("Error", "Something went wrong.", [{ text: "OK" }]);
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
          <Text style={styles.title}>Admission</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Your Admission Done Details.</Text>

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
            <Text style={styles.label}>Admission Date</Text>
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
                  onChange={onDateChange}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={formData.fatherName}
              onChangeText={(value) => useChangeData("fatherName", value , false , setFormData)}
              placeholder="Enter Father's Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student's Name</Text>
            <TextInput
              value={formData.studentName}
              onChangeText={(value) => useChangeData("studentName", value , false , setFormData)}
              placeholder="Enter Student's Name"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Vertical Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.Vertical}
                onValueChange={(itemValue) =>
                  useChangeData("Vertical", itemValue , false , setFormData)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                <Picker.Item label="SUB" value="SUB" />
                <Picker.Item label="SUI" value="SUI" />
                <Picker.Item label="SIRT" value="SIRT" />
                <Picker.Item label="SIS-DK" value="SIS-DK" />
                <Picker.Item label="SIS-AN" value="SIS-AN" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Branch/Class</Text>
            <TextInput
              value={formData.branch}
              onChangeText={(value) => useChangeData("branch", value , false , setFormData)}
              placeholder="Enter Branch/Class "
              style={styles.inputText}
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
    width: 70,
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

export default Admission;
