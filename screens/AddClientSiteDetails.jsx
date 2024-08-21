import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { LocationData } from "../lib/constants";
import { formatDate, getLocation } from "../lib/features";
import { submitForm } from "../lib/helper";
import { setShowPopupDialog } from "../redux/slices/misc";
import { setUserLocation } from "../redux/slices/user";

const AddClientSiteVisitDetails = () => {
  const { user,location } = useSelector((state) => state.user);
  const { showPopupDialog, members } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const [interestedLocation , setIntersetedLocation] = useState([]);
  const [changed, setChanged] = useState(false);

  const [formData, setFormData] = useState({
    visit_type: "direct",
    name: user.user.first_name,
    source: "",
    costumer_name: "",
    member:'',
    visit_date: new Date(),
    address: "",
    monthly_rent: "",
    costumer_contact: "",
    costumer_whatsapp: "",
    instagram_id: "",
    email_id: "",
    facebook_id: "",
    company: "",
    gross_annual_income: "",
    department: "",
    designation: "",
    birth_date: new Date(),
    marrige_anniversary: new Date(),
    budget: "",
    official_email_id: "",
    interest: "",
    possesion_date: 'select',
    remark: "",
    city: "Select",
    state: "Select",
    interested_location:[''],
    source_type: ''
  });

  // Separate state for each date picker visibility
  const [showVisitDatePicker, setShowVisitDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showMarriageDatePicker, setShowMarriageDatePicker] = useState(false);
  const [showPossesionDatePicker, setShowPossesionDatePicker] = useState(false);
  const [showMemberBox, setShowMemberBox] = useState(false);
  const [showenList, setShowenList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [sameWhatsappNumber, setSameWhatsappNumber] = useState(false);
  const [showSource , setShowSource] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.visit_date;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 2);
    // console.log(currentDate < yesterday || currentDate > today);
    if (currentDate < yesterday || currentDate > today) {
    setShowVisitDatePicker(false);
    return Alert.alert(
      "Validation Error",
      "Please add a valid date (today or one day before)",
      [{ text: "OK" }]
    );
  }
  
  setShowVisitDatePicker(false);
    setFormData({ ...formData, visit_date: currentDate });
  };

  const onBirthDateChange = (event, selectedDate) => {
    console.log({ selectedDate });
    const currentDate = selectedDate || formData.birth_date;
    setShowBirthDatePicker(false);
    setFormData({ ...formData, birth_date: currentDate });
  };

  const onMarriageDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.marrige_anniversary;
    setShowMarriageDatePicker(false);
    setFormData({ ...formData, marrige_anniversary: currentDate });
  };


  const onSourceChange = (value) => {
    if(value === 'select') return;
    setFormData({ ...formData, source_type: value });
    if(value === 'SocialMedia') setShowSource(['Instagram' , 'Facebook' , 'Twitter' , 'LinkedIn' , 'Other']);
    if(value === 'NewsPaper') setShowSource(['Dainik Bhaskar' , 'Patrika' , 'Times of India' , 'Sandhya Prakash' , 'Other']);
    if(value === 'Hoardings') setShowSource(['Hoardings' , 'Pamphlets' , 'Other']);
    if(value === 'PropertyPortals') setShowSource(['99Acers' , 'MagicBricks' , 'Homeonline' , 'tumeera' , 'OLX' , 'Houseing.com' , 'Other']);
    if(value === 'select') setShowSource([]);
    if(value === 'Walkin' || value === 'Google') setShowSource(false);

    // setShowSource(true);
  }


  const removeInterestedLocation = (value , index) => {
    if(formData.interested_location.length === 1) return;
    const updatedLocations = formData.interested_location.filter((location, i) => i !== index);
    setFormData({...formData , interested_location: updatedLocations});
  }

  const handleInterstLocationChange = (index,value) => {
    if(value === 'select') return;
    if(formData.interested_location.includes(value)) return;
    const updatedLocations = formData.interested_location.map((location, i) =>
      i === index ? value : location
    );
    setFormData({...formData , interested_location: updatedLocations});
  }

  const handleSubmit = async () => {
    const emptyField = Object.keys(formData).find((key) => {
      
      if(key === 'costumer_whatsapp' && sameWhatsappNumber) return false;
      if(key === 'costumer_whatsapp' && !sameWhatsappNumber){
        if(formData[key].length !== 10) return true;
        if(formData[key].length === 10 && isNaN(formData[key])) return true;
        if(formData[key][0] >=6 && formData[key][0] <=9) return false;
        return true; 
      }

      if(key === 'costumer_contact'){
        if(formData[key].length !== 10) return true;
        if(isNaN(formData[key])) return true;
        if(formData[key][0] >=6 && formData[key][0] <=9) return false;
        return true; 
      }

      if(key === 'email_id'){
        if(formData[key].includes('@') && formData[key].includes('.')) return false;
        return true;
      }

      if(key === 'interested_location') return formData[key].length < 1;

      if(key === 'source' && formData.visit_type === 'indirect') return false;

      if(key === 'member' && formData.visit_type === 'direct') return false;

      return !formData[key]
    });

    if (emptyField) {
      Alert.alert(
        "Validation Error",
        `Enter Valid ${emptyField}.`,
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
    if (isNaN(formData.visit_date))
      return Alert.alert("Validation Error", "Please Add Valid Date", [
        { text: "OK" },
      ]);
    console.log(formData);

    if(!location) {
      const userLocation = await getLocation();
      dispatch(setUserLocation(userLocation));
    }

    setLoading(true);

    const data = {
      username: formData.name,
      member: formData.member,
      customer_id: formData.customer_id,
      customer_name: formData.costumer_name,
      date: formatDate(formData.visit_date),
      monthly_rent: formData.monthly_rent,
      address: formData.address,
      customer_contact: formData.costumer_contact,
      customer_whatsapp: sameWhatsappNumber
        ? formData.costumer_contact
        : formData.costumer_whatsapp,
      instagram: formData.instagram_id,
      email: formData.email_id,
      facebook: formData.facebook_id,
      company: formData.company,
      annual_income: formData.gross_annual_income,
      department: formData.department,
      designation: formData.designation,
      DOB: formatDate(formData.birth_date),
      marriage_anniversary: formatDate(formData.marrige_anniversary),
      accommodation: formData.interest,
      Budget: formData.budget,
      expected_possession: formData.possesion_date,
      Remark: formData.remark,
      official_email: formData.official_email_id,
      visit_type: formData.visit_type,
      sourceType: formData.source_type,
      city: formData.city,
      state: formData.state,
      interested_location:formData.interested_location,
      source: formData.source,
      location:location
    };

    // console.log('state',data.state);
    // console.log( 'city',data.city);
    // console.log( 'source type',data.sourceType);
    // console.log('accomodation',data.accommodation);
    // console.log('data source',data.source);

    try {
      await submitForm(
        "Site-Visit",
        data,
        user,
        setShowPopupDialog,
        setLoading,
        dispatch
      );
      setLoading(false);
    } catch (e) {
      dispatch(
        setShowPopupDialog({
          title: "Error",
          message: e?.response?.data?.error || "Something went wrong",
          workDone: false,
        })
      );
      setLoading(false);
      console.log(e);
      //   setFormData({
      //     visit_type: "direct_visit",
      //     name: user.user.first_name,
      //     costumer_name: "",
      //     visit_date: new Date(),
      //     monthly_rent: "",
      //     address: "",
      //     costumer_contact: "",
      //     costumer_whatsapp: "",
      //     instagram_id: "",
      //     email_id: "",
      //     facebook_id: "",
      //     company: "",
      //     gross_annual_income: "",
      //     department: "",
      //     designation: "",
      //     birth_date: new Date(),
      //     marrige_anniversary: new Date(),
      //     budget: "",
      //     official_email_id:'',
      //     interest:'',
      //     possesion_date: new Date(),
      //     remark: "",
      // })
      // setSearchVal('');
    }
  };

  const handleInputChange = (key, value) => {
    if (key === "search") {
      setSearchVal(value);
      const searchTerm = value.toLowerCase();
      const filteredList = members.filter((item) => {
        return item && item.toLowerCase().includes(searchTerm);
      });

      setShowenList(filteredList);
      // console.log(members);
      return;
    }

    if (key === "member") {
      setSearchVal(value);
      // setShowMemberBox(false);
      setShowenList([]);
      return setFormData({ ...formData, [key]: value });
    }
    setFormData({ ...formData, [key]: value });
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
          <Text style={styles.title}>Site Form Visit</Text>
          <View style={styles.separator}></View>
          <Text style={styles.caption}>Feed Client Site Visit Details.</Text>

          {/* General Feild starts */}
          <View style={styles.sectionStyle}>
            <Text
              style={{
                fontSize: 20,
                paddingBottom:8,
                borderBottomWidth: 0.2,
              }}
            >
              General
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                editable={false}
                value={formData.name}
                onChangeText={(value) =>
                  useChangeData("name", value, false, setFormData)
                }
                placeholder="Enter Your Name"
                style={styles.inputText}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 0, paddingTop: 0 }]}>
              <Text style={styles.label}>Visit Type</Text>
              <View style={styles.radioGroup}>
                <RadioButton.Group
                  onValueChange={(value) => {
                    useChangeData("visit_type", value, false, setFormData);
                    if (value === "indirect") {
                      setShowMemberBox(true);
                    } else {
                      setShowMemberBox(false);
                      setSearchVal("");
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
                <View style={styles.inputGroup}>
                  <TextInput
                    placeholder="Enter Lead Owner"
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
                        {showenList &&
                          showenList.map((item) => (
                            <TouchableOpacity
                              onPress={() => handleInputChange("member", item)}
                              key={item}
                              style={{
                                padding: 10,
                                borderWidth: 1,
                                borderTopWidth: 0,
                                borderBottomColor: "black",
                              }}
                            >
                              <Text>{item}</Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    </>
                  )}
                </View>
              )}
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
                  value={formData.visit_date.toLocaleDateString()}
                  placeholder="Select Date"
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => setShowVisitDatePicker(true)}
                  style={styles.dateIcon}
                >
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
            <Text style={styles.label}>Source Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.source_type}
                onValueChange={(itemValue) =>
                  onSourceChange(itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                <Picker.Item label="NewsPaper" value="NewsPaper" />
                <Picker.Item label="Social Media" value="SocialMedia" />
                <Picker.Item label="Hoardings" value="Hoardings" />
                <Picker.Item label="Google" value="Google" />
                <Picker.Item label="Walk In" value="Walkin" />
                <Picker.Item label="Property Portals" value="PropertyPortals" />
                <Picker.Item label="Walk In" value="Walkin" />
              </Picker>
            </View>
          </View>

          {showSource && (
              <View style={styles.inputGroup}>
              <Text style={styles.label}>Source</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.source}
                  onValueChange={(itemValue) =>
                    useChangeData("source", itemValue, false, setFormData)

                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select" value="select" />
                  {showSource.map((item) => {
                    return <Picker.Item key={item} label={item} value={item} />;
                  })}
                </Picker>
              </View>
            </View>
          )}

          </View>
          {/* General Feild Ends */}

          {/* Costumer Details Feild starts */}
          <View style={styles.sectionStyle}>
            <Text
              style={{
                fontSize: 20,
                paddingBottom:8,
                borderBottomWidth: 0.2,
              }}
            >
              Costumer Details
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Costumer Name</Text>
              <TextInput
                editable
                value={formData.costumer_name.toUpperCase()}
                onChangeText={(value) =>
                  useChangeData(
                    "costumer_name",
                    value.toUpperCase(),
                    false,
                    setFormData
                  )
                }
                placeholder="Enter Costumer Name"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                editable
                value={formData.address}
                onChangeText={(value) =>
                  useChangeData("address", value, false, setFormData)
                }
                placeholder="Enter Address"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.state}
                onValueChange={(itemValue) =>
                  useChangeData("state", itemValue, false, setFormData)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                {LocationData && Object.keys(LocationData).map((item) => {
                  return <Picker.Item key={item} label={item} value={item} />;
                })
                }
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.city}
                onValueChange={(itemValue) =>
                  useChangeData("city", itemValue, false, setFormData)
                }
                style={styles.picker}
              >

                <Picker.Item label="Select" value="select" />
                {LocationData && LocationData[formData.state] && LocationData[formData.state].map((item) => {
                  return <Picker.Item key={item} label={item} value={item} />;
                })
                }
                {/* <Picker.Item label="2 BHK" value="2bhk" />
                <Picker.Item label="5 BHK" value="5bhk" /> */}
                {/* <Picker.Item label="Hoardings" value="Hoardings" /> */}
              </Picker>
            </View>
          </View>

          

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number Of Costumer</Text>
              <TextInput
                editable={true}
                value={formData.costumer_contact}
                onChangeText={(value) =>
                  useChangeData("costumer_contact", value, true, setFormData)
                }
                placeholder="Enter Costumer Contact Number"
                style={styles.inputText}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Same Whatsapp Number</Text>
              <View style={styles.radioGroup}>
                <RadioButton.Group
                  onValueChange={(value) => {
                    // console.log(sameWhatsappNumber);
                    if (value === "yes") {
                      setSameWhatsappNumber(true);
                    } else {
                      setSameWhatsappNumber(false);
                    }
                  }}
                  value={sameWhatsappNumber ? "yes" : "no"}
                >
                  <View style={styles.radioButton}>
                    <RadioButton value="yes" />
                    <Text style={styles.radioLabel}>Yes</Text>
                  </View>
                  <View style={styles.radioButton}>
                    <RadioButton value="no" />
                    <Text style={styles.radioLabel}>No</Text>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            {!sameWhatsappNumber && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Costumer Whatsapp Number</Text>
                <TextInput
                  editable={true}
                  value={formData.costumer_whatsapp}
                  onChangeText={(value) => {
                    console.log(value);

                    useChangeData(
                      "costumer_whatsapp",
                      value,
                      true,
                      setFormData
                    );
                  }}
                  placeholder="Enter Costumer Whatsapp Number"
                  style={styles.inputText}
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Id</Text>
              <TextInput
                editable
                value={formData.email_id}
                onChangeText={(value) =>
                  useChangeData("email_id", value, false, setFormData)
                }
                placeholder="Enter Email Id"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birth Date</Text>
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
                  value={formData.birth_date.toLocaleDateString()}
                  placeholder="Select Date"
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => setShowBirthDatePicker(true)}
                  style={styles.dateIcon}
                >
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
                  value={formData.marrige_anniversary.toLocaleDateString()}
                  placeholder="Select Date"
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => setShowMarriageDatePicker(true)}
                  style={styles.dateIcon}
                >
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
            <Text style={styles.label}>Interested Locations</Text>

            {formData.interested_location.map((item , index) => (
              
                 <View key={item} style={{
                  flexDirection: "row",
                  // flexWrap: "wrap",
                  width:'100%',
                  gap:4,
                  alignItems:'center',
                  // backgroundColor:'red',
                }}>
                {/* {console.log({item})} */}
                <View style={[styles.pickerContainer , {width:'90%' , height:'80%'}]}>
                  <Picker
                    selectedValue={item}
                    onValueChange={(itemValue) =>{
                      handleInterstLocationChange(index,itemValue);
                      // useChangeData("interest", itemValue, false, setFormData)
                    }
                    }
                    style={styles.picker}
                    >
                    <Picker.Item label="Select" value="select" />
                    <Picker.Item label="2 BHK" value="2bhk" />
                    <Picker.Item label="5 BHK" value="5bhk" />
                    <Picker.Item label="4 BHK" value="4bhk" />
                    {/* <Picker.Item label="Hoardings" value="Hoardings" /> */}
                  </Picker>
                </View>

                {formData.interested_location.includes(item) && index === formData.interested_location.length - 1 && (
                  <TouchableOpacity style={{
                    backgroundColor:  'blue',
                    width:40,
                    height:40,
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    borderRadius:20
                      }}
                       onPress={() => {formData.interested_location.includes('') ? '' : setFormData({...formData , interested_location: [...formData.interested_location  , '']})}}>
                        
                    <Icon name="add" size={24} color="white" />
                  </TouchableOpacity>
                )}
                {formData.interested_location.includes(item) && index !== formData.interested_location.length - 1 && (
                  <TouchableOpacity style={{
                    backgroundColor:  'red',
                    width:40,
                    height:40,
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    borderRadius:20
                      }}
                       onPress={() => removeInterestedLocation(item, index)}>
                        
                    <Icon name="remove" size={24} color="white" />
                  </TouchableOpacity>
                )}
                    
                </View>
            ))}
           
          </View>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Rent</Text>
              <TextInput
                editable={true}
                value={formData.monthly_rent}
                onChangeText={(value) =>
                  useChangeData("monthly_rent", value, true, setFormData)
                }
                placeholder="Enter Monthly Rent"
                style={styles.inputText}
                keyboardType="numeric"
              />
            </View>

            {/* Costumer Details Feild Ends */}
          </View>


           {/* Professional Detials Feilds Starts */}
           <View style={styles.sectionStyle}>
            <Text
              style={{
                fontSize: 20,
                paddingBottom:8,
                borderBottomWidth: 0.2,
              }}
            >
              Professional Details
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                editable
                value={formData.company.toUpperCase()}
                onChangeText={(value) =>
                  useChangeData(
                    "company",
                    value.toUpperCase(),
                    false,
                    setFormData
                  )
                }
                placeholder="Enter Company Name"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                editable
                value={formData.department}
                onChangeText={(value) =>
                  useChangeData("department", value, false, setFormData)
                }
                placeholder="Enter Department"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                editable
                value={formData.designation.toUpperCase()}
                onChangeText={(value) =>
                  useChangeData(
                    "designation",
                    value.toUpperCase(),
                    false,
                    setFormData
                  )
                }
                placeholder="Enter Designation"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gross Annual Income</Text>
              <TextInput
                editable
                value={formData.gross_annual_income}
                onChangeText={(value) =>
                  useChangeData("gross_annual_income", value, true, setFormData)
                }
                placeholder="Enter Gross Annual Income"
                style={styles.inputText}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Official Email Id</Text>
              <TextInput
                editable
                value={formData.official_email_id}
                onChangeText={(value) =>
                  useChangeData("official_email_id", value, false, setFormData)
                }
                placeholder="Enter Official Email Id"
                style={styles.inputText}
              />
            </View>



            {/* Professional Details Feilds ends */}
          </View>

          {/* Requirements Feilds Starts */}
          <View style={styles.sectionStyle}>
            <Text
              style={{
                fontSize: 20,
                paddingBottom:8,
                borderBottomWidth: 0.2,
              }}
            >
              Requirements
            </Text>

              
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Possesion</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.possesion_date}
                onValueChange={(itemValue) =>
                  useChangeData("possesion_date", itemValue, false, setFormData)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                <Picker.Item label="Ready To Move" value="readytomove" />
                <Picker.Item label="Within 6 Months" value="within6months" />
                <Picker.Item label="Can Wait" value="canwait" />
              </Picker>
            </View>
          </View>


          <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget</Text>
              <TextInput
                editable={true}
                value={formData.budget}
                onChangeText={(value) =>
                  useChangeData("budget", value, true, setFormData)
                }
                placeholder="Enter Budget"
                style={styles.inputText}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Interested Accommodation</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.interest}
                onValueChange={(itemValue) =>
                  useChangeData("interest", itemValue, false, setFormData)
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                <Picker.Item label="Appartment" value="Appartment" />
                <Picker.Item label="Bunglow" value="Bunglow" />
                <Picker.Item label="Commercial" value="Commercial" />
                <Picker.Item label="Flat" value="Flat" />
                <Picker.Item label="Plot" value="Plot" />
                {/* <Picker.Item label="Hoardings" value="Hoardings" /> */}
              </Picker>
            </View>
          </View>


          <View style={[styles.inputGroup , {marginTop:0}]}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              editable
              value={formData.remark}
              onChangeText={(value) =>
                useChangeData("remark", value, false, setFormData)
              }
              placeholder="Enter Remarks"
              style={styles.inputText}
            />
          </View>
            

            {/* Requirements Feilds ends */}
            </View>

          {/* Socials Feilds Starts */}
          <View style={styles.sectionStyle}>
            <Text
              style={{
                fontSize: 20,
                paddingBottom:8,
                borderBottomWidth: 0.2,
              }}
            >
              Socials
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram ID</Text>
              <TextInput
                editable
                value={formData.instagram_id}
                onChangeText={(value) =>
                  useChangeData("instagram_id", value, false, setFormData)
                }
                placeholder="Enter Instagram Id"
                style={styles.inputText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Facebook Id</Text>
              <TextInput
                editable
                value={formData.facebook_id}
                onChangeText={(value) =>
                  useChangeData("facebook_id", value, false, setFormData)
                }
                placeholder="Enter Facebook Id"
                style={styles.inputText}
              />
            </View>

            

            {/* Socials Feilds Ends */}
          </View>


          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <View
            style={{
              width: "100%",
              height: 100,
              backgroundColor: "white",
            }}
          ></View>
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
  sectionStyle: {
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
    // backgroundColor: "#d3d3d3",
    // paddingHorizontal: 10,
    // paddingVertical:10,
    // borderWidth:0.2,
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

export default AddClientSiteVisitDetails;
