import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from "../constants";
import useChangeData from "../hooks/useChangeData";
import { formatDate, getLocation } from "../lib/features";
import { submitForm } from "../lib/helper";
import {
  setCityLocation,
  setIsMenuOpen,
  setShowPopupDialog,
  toggleAdd,
} from "../redux/slices/misc";
import { logout, setUserLocation } from "../redux/slices/user";

const { height } = Dimensions.get("window");

const UpdateClientSiteVisitDetails = () => {
  const { user, location } = useSelector((state) => state.user);
  const {
    showPopupDialog,
    members,
    intereseted_localities,
    states_location,
    city_location,
  } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [stateShowenList, setStateShowenList] = useState([]);
  const [citySeach, setCitySearch] = useState('');
  const [showMeritalStatus, setShowMeritalStatus] = useState(false);
  const [showCityList, setShowCityList] = useState([]);
  const [stateSearch, setStateSearch] = useState('');
  const [showPurposeFeild , setShowPurposeFeild] = useState(false);
  const { navigate } = useNavigation();
  const [showRentStatus, setShowRentStatus] = useState(false);
  const [changed, setChanged] = useState(false);
  const { source_list } = useSelector((state) => state.misc);

  const [formData, setFormData] = useState({
    visit_type: "direct",
    name: user.user.first_name,
    member: "",
    site_location: ["select"],
    visit_date: new Date(),
    source: "",
    source_type: "",
    customer_name: "",
    address: "",
    state: "Select",
    city: "Select",
    customer_contact: "",
    customer_whatsapp: "",
    occupation: "slect",
    email_id: "",
    birth_date: new Date(),
    merital_status: 'single',
    marrige_anniversary: new Date(),
    interested_location: [""],
    residential_status: "owner",
    monthly_rent: "",
    company: "",
    department: "",
    designation: "",
    official_email_id: "",
    possesion_date: "select",
    budget: "",
    interest: "",
    purpose:'',
    remark: "",
    gross_annual_income: "",
    instagram_id: "",
    facebook_id: "",
    customer_code: "",
    business_type:"",
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
  const [showSource, setShowSource] = useState(false);
  const [showClientData, setShowClientData] = useState(false);
  const inputRefs = useRef({});
  const [customerCode, setCustomerCode] = useState("");
  const [showProfessionalDetails , setShowProfessionalDetails] = useState('');

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
    // console.log({ selectedDate });
    const currentDate = selectedDate || formData.birth_date;
    setShowBirthDatePicker(false);
    setFormData({ ...formData, birth_date: currentDate });
  };

  const onMarriageDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.marrige_anniversary;
    setShowMarriageDatePicker(false);
    setFormData({ ...formData, marrige_anniversary: currentDate });
  };

  const handleSearchClient = async () => {
    if (formData.customer_code === "")
      return Alert.alert("Validation Error", "Please Enter customer Code", [
        { text: "OK" },
      ]);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://182.70.253.15:8000/api/Get-Site-Visit-Data",
        { customer_value: customerCode },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        }
      );
      const data = res.data.data[0];
      console.log({data});
      if (!data) {
        Alert.alert("Error", "No Data Found", [{ text: "OK" }]);
        setLoading(false);
        return;o
      }

      const interestedLocations = data?.Interest;
      const validJsonString = interestedLocations?.replace(/'/g, '"');
      const loc = JSON.parse(validJsonString);

      // const test = interestedLocations?.length > 0 ? [...interestedLocations] : ["select"];
      if (data?.Customer_Contact_number) {
        const dataTemplate = {
          visit_type: data?.visit_type || "direct",
          name: user.user.first_name,
          source: data?.source || "",
          source_type: data?.source_type || "",
          member: data?.reference || "",
          visit_date : new Date(),
          customer_name: data?.Customer_name || "",
          address: data?.Address || "",
          state: data?.state || "Select",
          city: data?.city || "Select",
          monthly_rent: data?.Monthly_rent || "",
          customer_contact: data?.Customer_Contact_number || "",
          customer_whatsapp: data?.Customer_Whatspp_number || "",
          email_id: data?.Email_id || "",
          birth_date: (data?.DOB && new Date(data?.DOB)) || new Date(),
         
          merital_status: data?.marital_status || 'single',
          marrige_anniversary:
            (data?.marriage_anniversary &&
              new Date(data?.marriage_anniversary)) ||
            new Date(),
          budget: data?.Budget || "",
          company: data?.Company || "",
          designation: data?.Designation || "",
          gross_annual_income: data?.Gross_Income || "",
          interest: data?.accommodation || "",
          remark: data?.Remark || "",
          official_email_id: data?.official_mail || "",
          department: data?.Department || "",
          instagram_id: data?.Instagram || "",
          facebook_id: data?.Facebook_id || "",
          possesion_date: data?.Expected_possession || "select",
          interested_location:
            loc?.length > 0
              ? [...loc]
              : ["select"],
          customer_code:  "",
          residential_status: data?.residential_status || "owner",
          purpose: data?.purpose || "",
          site_location: data?.site_location || "select",
          occupation: data?.occupation_type || "select",
          business_type: data?.business_type || "",
        };

        if(data?.access_id){

          setCustomerCode(data?.access_id);
          dataTemplate.customer_code = Number(data?.access_id)
        }
        if(data?.customer_contact === data?.customer_whatsapp){
          setSameWhatsappNumber(true);
        }

        if(data?.residential_status === 'tenant'){
          setShowRentStatus(true);
        }
        if(data?.occupation_type !== 'select' && data?.occupation_type){
          setShowProfessionalDetails(data?.occupation_type);
        }

        if(data?.state){
          setStateSearch(data?.state);
        }
        if(data?.city){
          setCitySearch(data?.city);
        }
        if(dataTemplate?.purpose === 'commercial'){
          setShowPurposeFeild(true);
        }

        if(data?.residential_status === 'tenant'){
          setShowRentStatus(true);
        }

        if (dataTemplate?.residential_status === "tenant")
          setShowRentStatus(true);

        setFormData({ ...dataTemplate });
        setShowClientData(true);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log({ error: e });
      return Alert.alert("🔴OOPS", "Something went wrong", [
        { text: "OK" },
      ]);
    }
  };


  const onSourceChange = (value) => {
    if (value === "select") return;
    setFormData({ ...formData, source_type: value });
    if (value === "Social Media") {
      const list = source_list.filter((item) => item[2] === 2);
      const mainList = list.map((item) => item[0]);
      setShowSource([...mainList]);
    }
    if (value === "News Paper") {
      const list = source_list.filter((item) => item[2] === 1);
      const mainList = list.map((item) => item[0]);
      setShowSource([...mainList]);
    }
    if (value === "Hoardings") setShowSource(false);
    if (value === "Property Portals") {
      const list = source_list.filter((item) => item[2] === 3);
      const mainList = list.map((item) => item[0]);
      setShowSource([...mainList]);
    }
    if (value === "select") setShowSource([]);
    if (value === "Walk In" || value === "Google") setShowSource(false);
  };

  const handleInterstLocationChange = (index, value) => {
    if (value === "select") return;
    if (formData.interested_location.includes(value)) return;
    const updatedLocations = formData.interested_location.map((location, i) =>
      i === index ? value : location
    );
    setFormData({ ...formData, interested_location: updatedLocations });
  };

  const removeInterestedLocation = (value, index) => {
    if (formData.interested_location.length === 1) return;
    const updatedLocations = formData.interested_location.filter(
      (location, i) => i !== index
    );
    setFormData({ ...formData, interested_location: updatedLocations });
  };

  const onOccupationChange = (value) => {
    if(value === 'select') return;
    
    setShowProfessionalDetails(value);
  }


  const handleStateChange = async (itemValue) => {
    try{
     
      const {data} = await axios.post('http://182.70.253.15:8000/api/Get-City-Data' , {
        'stateId': itemValue[1]
      } , {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.access}`
        }
      })
      if(!data['cities']) return Alert.alert('Error' , 'Something went wrong');
      dispatch(setCityLocation(data['cities']));
    }catch(err){
      console.log(err);
    }
  }
  const handleSubmit = async () => {
    const emptyField = Object.keys(formData).find((key) => {
      if(key === 'occupation'){
        if(formData[key] === 'select' || formData[key] === 'Select'){
           return key;
          }
        return false;
      }

      if(key === 'interested_location'){
        let filter = formData[key].filter((item) => item !== 'select').filter((item) => item !== '');
        if(filter.length > 0) return false;
        return true;
      }


      if(key === 'company' || key === 'department' || key === 'designation' || key === 'gross_annual_income' || key === 'official_email_id' || key === 'instagram_id' || key === 'facebook_id' || key === 'business_type' || key === 'email_id') return false;

      if(key === 'birth_date' || key === 'marrige_anniversary' || key === 'instagram_id' || key === 'facebook_id') return false;

      if(key === 'purpose'){
        if(formData[key] === '' && showPurposeFeild) return true;
        return false;
      } 

      if(key === 'possesion_date' ){ 
        if(formData[key] === 'select')return true;
        return false;
      }
      if(key === 'customer_whatsapp' && sameWhatsappNumber) return false;
      if(key === 'customer_whatsapp' && !sameWhatsappNumber){
        if(formData[key].length !== 10) return true;          
        if(formData[key].length === 10 && isNaN(formData[key])) return true;
        if(formData[key][0] >=6 && formData[key][0] <=9) return false;
        return true; 
      }
      
      if(key === 'monthly_rent'){
        if(typeof formData[key] === 'string'){
          if(formData[key].length < 4  && showRentStatus === true) return true;
          return false;
        }
        else{
          if(Number(formData[key]) < 1 && showRentStatus === true) return true;
          return false;
        }
      }
      
      if(key === 'member' && formData.visit_type === 'direct') return false;
      
      if(key === 'source' && (formData.source === 'select' || formData.source === '')){
        if( formData.source_type === 'NewsPaper' || formData.source_type === 'Social Media' || formData.source_type === 'Property Portals'  ) return true;
        return false;
      }
      
      if(typeof formData[key] === 'string'){
        if(formData[key].trim().length < 4 ){
          return key;
        }
      }
      if(key === 'customer_contact'){
        const mob = formData[key].toString();
        if(mob.length !== 10) return true;
        // if(isNaN(formData[key])) return true;
        if(mob[0] >=6 && mob[0] <=9) return false;
        return true; 
      }
     

      if(key === 'email_id' || key === 'official_email_id'){
        if(formData[key].includes('@') && formData[key].includes('.')) return false;
        return true;
      }

      if(key === 'interested_location') {
        if(formData[key].length === 0) return true;
        let filtered = formData[key].filter((item) => item !== '' || item !== 'select');
        if(filtered.length > 0) return false;
        return true;
      }

      if(key === 'interest'){
        if(formData[key] === 'select') return true;
      }

      
      if(key === 'site_location' && formData.site_location === 'select') return true;

      if(key === 'state' ){
        if(formData.state === 'Select') return true;
        return false;
      }

      if(key === 'city' ){
        if(formData.city === 'Select') return true;
        return false;
      }
    

      return !formData[key]
    });

    let alertFieldName = "";

  switch (emptyField) {
    case "source":
      alertFieldName = "Source";
      break;
    case "customer_name":
      alertFieldName = "Customer Name";
      break;
    case "member":
      alertFieldName = "Lead Owner Name";
      break;
    case "address":
      alertFieldName = "Address";
      break;
    case "monthly_rent":
      alertFieldName = "Monthly Rent";
      break;
    case "customer_contact":
      alertFieldName = "Customer Contact";
      break;
    case "customer_whatsapp":
      alertFieldName = "Customer WhatsApp";
      break;
    case "instagram_id":
      alertFieldName = "Instagram ID";
      break;
    case "email_id":
      alertFieldName = "Email ID";
      break;
    case "facebook_id":
      alertFieldName = "Facebook ID";
      break;
    case "company":
      alertFieldName = "Company";
      break;
    case "gross_annual_income":
      alertFieldName = "Gross Annual Income";
      break;
    case "department":
      alertFieldName = "Department";
      break;
    case "designation":
      alertFieldName = "Designation";
      break;
    case "birth_date":
      alertFieldName = "Birth Date";
      break;
    case "marrige_anniversary":
      alertFieldName = "Marriage Anniversary";
      break;
    case "budget":
      alertFieldName = "Budget";
      break;
    case "official_email_id":
      alertFieldName = "Official Email ID";
      break;
    case "interest":
      alertFieldName = "Interested Accomodation";
      break;
    case "possesion_date":
      alertFieldName = "Expected Possession";
      break;
    case "remark":
      alertFieldName = "Remark";
      break;
    case "city":
      alertFieldName = "City";
      break;
    case "state":
      alertFieldName = "State";
      break;
    case "interested_location":
      alertFieldName = "Type of Interested Location";
      break;
    case "source_type":
      alertFieldName = "Source Type";
      break;
    case "site_location":
      alertFieldName = "Site Location";
      break;
    case "residential_status":
      alertFieldName = "Residential Status";
      break;
    case "purpose":
      alertFieldName = "Purpose";
      break;
    case "visit_type":
      alertFieldName = "Visit Type";
      break;
    case "merital_status":
      alertFieldName = "Marital status";
      break;
    case "occupation":
      alertFieldName = "Type of Occupation";
      break;
    default:
      alertFieldName = false;
  }

    if (emptyField && alertFieldName) {
      return Alert.alert(
        "🔴 OOPS!",
        `Please provide ${alertFieldName}.`,
        [
          {
            text: "OK",
            onPress: () => inputRefs?.current[emptyField]?.focus(),
          },
        ],
        { cancelable: false }
      );
    }
    if (isNaN(formData.visit_date))
      return Alert.alert("🔴 OOPS!", "Please Add Valid Date", [
        { text: "OK" },
      ]);
    try {
      if (!location) {
        setLoading(true);
        const userLocation = await getLocation();
        setLoading(false);
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

      setLoading(true);

      const data = {
        username: formData.name,
        member: formData.member,
        // customer_id: formData.customer_id,
        customer_name: formData.customer_name,
        date: formatDate(formData.visit_date),
        monthly_rent: formData.monthly_rent,
        address: formData.address,
        customer_contact: formData.customer_contact,
        customer_whatsapp: sameWhatsappNumber
          ? formData.customer_contact
          : formData.customer_whatsapp,
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
        interested_location: formData.interested_location,
        source: formData.source,
        lat_long: lat_long,
        siteLocation: formData.site_location,
        purpose:formData.purpose,
        residential_status: formData.residential_status,
        marital_status: formData.merital_status,
        occupation_type: formData.occupation,
        business_type: formData.business_type,
      };

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
      setLoading(false);
      if (
        e?.message ===
        "Location request failed due to unsatisfied device settings"
      ) {
        dispatch(
          setShowPopupDialog({
            title: "Location Access Denied",
            message: "Please allow the location access for the application",
            workDone: false,
          })
        );
        return;
      }
      dispatch(
        setShowPopupDialog({
          title: "Error",
          message: e?.response?.data?.error || "Something went wrong",
          workDone: false,
        })
      );
      setLoading(false);
      console.log(e);
      setFormData({
        visit_type: "direct",
        name: user.user.first_name,
        member: "",
        site_location: ["select"],
        visit_date: new Date(),
        source: "",
        source_type: "",
        customer_name: "",
        address: "",
        state: "Select",
        city: "Select",
        customer_contact: "",
        customer_whatsapp: "",
        occupation: "slect",
        email_id: "",
        birth_date: new Date(),
        merital_status: 'single',
        marrige_anniversary: new Date(),
        interested_location: [""],
        residential_status: "tenant",
        monthly_rent: "",
        company: "",
        department: "",
        designation: "",
        official_email_id: "",
        possesion_date: "select",
        budget: "",
        interest: "",
        purpose:'',
        remark: "",
        gross_annual_income: "",
        instagram_id: "",
        facebook_id: "",
        customer_code: "",
        business_type:"",
      });
      setSearchVal("");
    }
  };

  const handleInputChange = (key, value) => {

    if(key === 'citySearch'){
      setCitySearch(value);
      const searchTerm = value.toLowerCase();
      const filteredList = city_location.filter((item) => {
        return item && item.toLowerCase().includes(searchTerm);
      });
      setShowCityList(filteredList);
      return;
    }

    if(key === 'city'){
      setFormData({...formData , city: value});
      setCitySearch(value);
      setShowCityList([]);
      return
    }

    if(key === 'state'){
      setFormData({...formData , state: value[0]});
      handleStateChange(value);
      setStateSearch(value[0]);
      setStateShowenList([]);
      return;
    }

    if (key === "stateSearch") {
      setStateSearch(value);
      const searchTerm = value.toLowerCase();
      const filteredList = states_location.filter((item) => {
        return item[0] && item[0].toLowerCase().includes(searchTerm);
      });

      setStateShowenList(filteredList);

      return;
    }

    if (key === "search") {
      setSearchVal(value);
      const searchTerm = value.toLowerCase();
      const filteredList = members.filter((item) => {
        return item && item.toLowerCase().includes(searchTerm);
      });

      setShowenList(filteredList);
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

  const currentDate = new Date();

  const oneDayBefore = new Date(currentDate);
  oneDayBefore.setDate(currentDate.getDate() - 1);

  const oneDayAfter = new Date(currentDate);
  oneDayAfter.setDate(currentDate.getDate());

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
          {/* <Text style={styles.caption}>Feed Client Site Visit Details.</Text> */}

          {/* General Feild starts */}
          <View style={styles.sectionStyle}>
            <Text
              style={{
                fontSize: 20,
                paddingBottom: 8,
                borderBottomWidth: 0.2,
              }}
            >
              General
            </Text>

            <View style={[styles.inputGroup, { marginTop: 0, paddingTop: 0 }]}>
              <Text style={styles.label}>Visit Type <Text style={styles.requierdFeilds}>*</Text></Text>
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
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>

<View style={styles.radioButton}>
                    <RadioButton value="direct" />
                    <Text style={styles.radioLabel}>Direct Visit</Text>
                  </View>
                  <View style={styles.radioButton}>
                    <RadioButton value="indirect" />
                    <Text style={styles.radioLabel}>Indirect Visit</Text>
                  </View>

                  </View>
                </RadioButton.Group>
              </View>
              {showMemberBox && (
                <View style={styles.inputGroup}>
                  <TextInput
                    placeholder="Enter Lead Owner Name"
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


            {/* General Feild Ends */}
          </View>

          {!showClientData && (
            <>

<View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Code/Mobile Number <Text style={styles.requierdFeilds}>*</Text></Text>
              <TextInput
                editable
                value={customerCode}
                onChangeText={(value) => {
                  if(isNaN(value)) return;
                  setCustomerCode(value);
                  setFormData({ ...formData, customer_code: value });
                  // useChangeData("customer_code", value, true, setFormData);
                }}
                placeholder="Enter Customer Code/Mobile Number"
                style={styles.inputText}
                keyboardType="numeric"
                ref={(ref) => (inputRefs.current["customer_code"] = ref)}
              />
            </View>


                <Pressable style={{
                  padding: 10,
                  backgroundColor: blue,
                  borderRadius: 5,
                  marginTop: 10,
                }} onPress={handleSearchClient}>
                  <Text style={{
                    color: 'white',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>Search Client</Text>
                </Pressable>
              </>
          )}
          {showClientData && (
            <>

<View style={styles.inputGroup}>
              <Text style={styles.label}>Site Location <Text style={styles.requierdFeilds}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.site_location}
                  onValueChange={(itemValue) =>
                    setFormData({ ...formData, site_location: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select" value="select" />
                  <Picker.Item label="Sage Golden Spring" value="SGS" />
                  <Picker.Item label="Sage Golden Plaza" value="SGP" />
                  <Picker.Item label="Sage Sun Villa" value="SSV" />
                  <Picker.Item label="Sage Bunglow" value="SAGE Bunglow" />
                  <Picker.Item label="Sage Nirvana" value="SN" />
                  <Picker.Item label="Sage Milestone" value="SM" />
                  <Picker.Item label="Sage Skyline" value="SAGE Skyline" />
                  <Picker.Item label="Sage Prestige" value="SAGE Prestige" />
                </Picker>
              </View>
            </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Visit Date <Text style={styles.requierdFeilds}>*</Text></Text>
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
                      minimumDate={oneDayBefore}
                      maximumDate={oneDayAfter}
                    />
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Source Type <Text style={styles.requierdFeilds}>*</Text></Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.source_type}
                    onValueChange={(itemValue) => onSourceChange(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select" value="select" />
                    <Picker.Item label="News Paper" value="News Paper" />
                    <Picker.Item label="Social Media" value="Social Media" />
                    <Picker.Item label="Hoardings" value="Hoardings" />
                    <Picker.Item label="Google" value="Google" />
                    <Picker.Item label="Walk-In" value="Walk In" />
                    <Picker.Item
                      label="Property Portals"
                      value="Property Portals"
                    />
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
                      {showSource?.map((item) => {
                        return (
                          <Picker.Item key={item} label={item} value={item} />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              )}

              {/* customer Details Feild starts */}
              <View style={styles.sectionStyle}>
                <Text
                  style={{
                    fontSize: 20,
                    paddingBottom: 8,
                    borderBottomWidth: 0.2,
                  }}
                >
                  Customer Details
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Customer Name <Text style={styles.requierdFeilds}>*</Text></Text>
                  <TextInput
                    editable
                    value={formData.customer_name.toUpperCase()}
                    onChangeText={(value) =>
                      useChangeData(
                        "customer_name",
                        value.toUpperCase(),
                        false,
                        setFormData
                      )
                    }
                    placeholder="Enter customer Name"
                    style={styles.inputText}
                    ref={(ref) => (inputRefs.current["customer_name"] = ref)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address <Text style={styles.requierdFeilds}>*</Text></Text>
                  <TextInput
                    editable
                    value={formData.address}
                    onChangeText={(value) =>
                      useChangeData("address", value, false, setFormData)
                    }
                    placeholder="Enter Address"
                    style={styles.inputText}
                    ref={(ref) => (inputRefs.current["address"] = ref)}
                  />
                </View>

                <View style={styles.inputGroup}>
            <Text style={styles.label}>State <Text style={styles.requierdFeilds}>*</Text></Text>
            <TextInput
              placeholder="State"
              style={styles.inputText}
              value={stateSearch}
              onChangeText={(val) => handleInputChange("stateSearch", val)}
              ref={(ref) => (inputRefs.current["stateSearch"] = ref)}
            />
            {stateSearch && (
              <>
                <ScrollView
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                >
                  {stateShowenList && (
                    <>
                      {stateShowenList.map((item) => (
                        <TouchableOpacity
                          onPress={() => handleInputChange("state", item)}
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
                    </>
                  )}
                </ScrollView>
              </>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City <Text style={styles.requierdFeilds}>*</Text></Text>
            <TextInput
              placeholder="City"
              style={styles.inputText}
              value={citySeach}
              onChangeText={(val) => handleInputChange("citySearch", val)}
              ref={(ref) => (inputRefs.current["citySearch"] = ref)}
            />
            {citySeach && (
              <>
                <ScrollView
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                >
                  {showCityList && (
                    <>
                      {showCityList.map((item) => (
                        <TouchableOpacity
                          onPress={() => handleInputChange("city", item)}
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
                    </>
                  )}
                </ScrollView>
              </>
            )}
          </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contact Number Of Customer <Text style={styles.requierdFeilds}>*</Text></Text>
                  <TextInput
                    editable={true}
                    value={formData.customer_contact}
                    onChangeText={(value) =>
                      useChangeData(
                        "customer_contact",
                        value,
                        true,
                        setFormData
                      )
                    }
                    placeholder="Enter customer Contact Number"
                    style={styles.inputText}
                    keyboardType="numeric"
                    ref={(ref) => (inputRefs.current["customer_contact"] = ref)}
                  />
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Checkbox.Android
                    label="Same Whatsapp Number"
                    position="leading"
                    onPress={(e) => {
                      setSameWhatsappNumber(!sameWhatsappNumber);
                    }}
                    status={!sameWhatsappNumber ? "unchecked" : "checked"}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                    }}
                  >
                    Same Whatsapp Number
                  </Text>
                </View>

                {!sameWhatsappNumber && (
                  <View style={[styles.inputGroup, { marginTop: 5 }]}>
                    <Text style={styles.label}>Customer Whatsapp Number <Text style={styles.requierdFeilds}>*</Text></Text>
                    <TextInput
                      editable={true}
                      value={formData.customer_whatsapp}
                      onChangeText={(value) => {

                        useChangeData(
                          "customer_whatsapp",
                          value,
                          true,
                          setFormData
                        );
                      }}
                      placeholder="Enter customer Whatsapp Number"
                      style={styles.inputText}
                      keyboardType="numeric"
                      ref={(ref) => (inputRefs.current["customer_whatsapp"] = ref)}
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Id <Text style={styles.requierdFeilds}>*</Text></Text>
                  <TextInput
                    editable
                    value={formData.email_id}
                    onChangeText={(value) =>
                      setFormData({ ...formData, email_id: value })
                    }
                    placeholder="Enter Email Id"
                    style={styles.inputText}
                    ref={(ref) => (inputRefs.current["email_id"] = ref)}
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
                      ref={(ref) => (inputRefs.current["birth_date"] = ref)}
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
                        minimumDate={oneDayBefore}
                        maximumDate={oneDayAfter}
                      />
                    )}
                  </View>
                </View>


                <View style={styles.inputGroup}>
            <Text style={styles.label}>Marital Status <Text style={styles.requierdFeilds}>*</Text></Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.merital_status}
                onValueChange={(itemValue) =>
                {
                  useChangeData("merital_status", itemValue, false, setFormData)
                  itemValue !== 'single' ? setShowMeritalStatus(true) : setShowMeritalStatus(false);
                }
                }
                style={styles.picker}
              >
                <Picker.Item label="Single" value="single" />
                <Picker.Item label="Married" value="married" />
              </Picker>
            </View>
          </View>

                {showMeritalStatus && <View style={styles.inputGroup}>
                  <Text style={styles.label}>Marriage Anniversary </Text>
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
                      ref={(ref) => (inputRefs.current["marrige_anniversary"] = ref)}
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
                        minimumDate={oneDayBefore}
                        maximumDate={oneDayAfter}
                      />
                    )}
                  </View>
                </View>}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Interested Locations <Text style={styles.requierdFeilds}>*</Text></Text>
                  {formData.interested_location.map((item, index) => (
                    <View
                      key={item}
                      style={{
                        flexDirection: "row",
                        // flexWrap: "wrap",
                        width: "100%",
                        gap: 4,
                        alignItems: "center",
                        // backgroundColor:'red',
                      }}
                    >
                      <View
                        style={[
                          styles.pickerContainer,
                          { width: "90%", height: "80%" },
                        ]}
                      >
                        <Picker
                          selectedValue={item}
                          onValueChange={(itemValue) => {
                            handleInterstLocationChange(index, itemValue);
                            // useChangeData("interest", itemValue, false, setFormData)
                          }}
                          style={styles.picker}
                        >
                          <Picker.Item label="Select" value="select" />
                          {intereseted_localities &&
                            intereseted_localities.map((item) => {
                              return (
                                <Picker.Item
                                  key={item}
                                  label={item}
                                  value={item}
                                />
                              );
                            })}
                        </Picker>
                      </View>

                      {formData.interested_location.includes(item) &&
                        index === formData.interested_location.length - 1 && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "blue",
                              width: 40,
                              height: 40,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 20,
                            }}
                            onPress={() => {
                              formData.interested_location.includes("")
                                ? ""
                                : setFormData({
                                    ...formData,
                                    interested_location: [
                                      ...formData.interested_location,
                                      "",
                                    ],
                                  });
                            }}
                          >
                            <Icon name="add" size={24} color="white" />
                          </TouchableOpacity>
                        )}
                      {formData.interested_location.includes(item) &&
                        index !== formData.interested_location.length - 1 && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "red",
                              width: 40,
                              height: 40,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 20,
                            }}
                            onPress={() =>
                              removeInterestedLocation(item, index)
                            }
                          >
                            <Icon name="remove" size={24} color="white" />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Residential Status <Text style={styles.requierdFeilds}>*</Text></Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.residential_status}
                      onValueChange={(itemValue) => {
                        useChangeData(
                          "residential_status",
                          itemValue,
                          false,
                          setFormData
                        );
                        itemValue !== "owner"
                          ? setShowRentStatus(true)
                          : setShowRentStatus(false);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Owner" value="owner" />
                      <Picker.Item label="Tenant" value="tenant" />
                    </Picker>
                  </View>
                </View>

                {showRentStatus && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Monthly Rent <Text style={styles.requierdFeilds}>*</Text></Text>
                    <TextInput
                      editable={true}
                      value={formData.monthly_rent}
                      onChangeText={(value) =>
                        useChangeData("monthly_rent", value, true, setFormData)
                      }
                      placeholder="Enter Monthly Rent"
                      style={styles.inputText}
                      keyboardType="numeric"
                      ref={(ref) => (inputRefs.current["monthly_rent"] = ref)}
                    />
                  </View>
                )}

                {/* customer Details Feild Ends */}
              </View>

              {/* Professional Detials Feilds Starts */}
              <View style={styles.sectionStyle}>
                <Text
                  style={{
                    fontSize: 20,
                    paddingBottom: 8,
                    borderBottomWidth: 0.2,
                  }}
                >
                  Professional Details
                </Text>

                <View style={styles.inputGroup}>
            <Text style={styles.label}>Occupation Type <Text style={styles.requierdFeilds}>*</Text></Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.occupation}
                onValueChange={(itemValue) =>{
                  onOccupationChange(itemValue)
                  if(itemValue === 'select') setShowProfessionalDetails('');
                  setFormData({...formData , occupation: itemValue});
                }
                }
                style={styles.picker}
              >
                <Picker.Item label="Select" value="select" />
                <Picker.Item label="Government Sector" value="Government Sector" />
                <Picker.Item label="Private Sector" value="Private Sector" />
                <Picker.Item label="Semi-Government Sector" value="Semi-Government Sector" />
                <Picker.Item label="Business" value="Business" />
                <Picker.Item label="Self Employed" value="Self Employed" />
                <Picker.Item label="Farmer" value="Farmer" />
                <Picker.Item label="Retired" value="Retired" />
                <Picker.Item label="Home Maker" value="Home Maker" />
                <Picker.Item label="Student" value="Student" />
              </Picker>
            </View>
          </View>

            {(showProfessionalDetails === 'Government Sector' || showProfessionalDetails === 'Private Sector' || showProfessionalDetails === 'Semi-Government Sector') && (
              <View>
                  <View style={styles.inputGroup}>
              <Text style={styles.label}>{ showProfessionalDetails === 'Government Sector'? 'Department' : 'Company'}</Text>
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
                placeholder={"Enter" + showProfessionalDetails === 'Government Sector'? 'Department' : 'Company' + "Name"}
                style={styles.inputText}
                ref={(ref) => inputRefs.current["company"] = ref}
              />
            </View>

           {showProfessionalDetails  !== 'Government Sector' && <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                editable
                value={formData.department}
                onChangeText={(value) =>
                  useChangeData("department", value, false, setFormData)
                }
                placeholder="Enter Department Name"
                style={styles.inputText}
                ref={(ref) => inputRefs.current["department"] = ref}
              />
            </View>}

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
                ref={(ref) => inputRefs.current["designation"] = ref}
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
                ref={(ref) => inputRefs.current["gross_annual_income"] = ref}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Official Email Id</Text>
              <TextInput
                editable
                value={formData.official_email_id}
                onChangeText={(value) =>
                 setFormData({...formData , official_email_id: value})
                }
                placeholder="Enter Official Email Id"
                style={styles.inputText}
                ref={(ref) => inputRefs.current["official_email_id"] = ref}
              />
            </View>

              </View>
            )}


                {/* <Picker.Item label="business" value="business" />
                <Picker.Item label="Self Employed" value="Self Employed" />
                <Picker.Item label="Farmer" value="Farmer" />
                <Picker.Item label="Home Maker" value="Home Maker" /> */}


          {(showProfessionalDetails === 'Business' || showProfessionalDetails === 'Self Employed') && (
              <View>
                  
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Type</Text>
              <TextInput
                editable
                value={formData.business_type.toUpperCase()}
                onChangeText={(value) =>
                  useChangeData(
                    "buissness_type",
                    value.toUpperCase(),
                    false,
                    setFormData
                  )
                }
                placeholder="Enter Business Type"
                style={styles.inputText}
                ref={(ref) => inputRefs.current["company"] = ref}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Firm Name(If Any)</Text>
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
                placeholder="Enter Firm Name"
                style={styles.inputText}
                ref={(ref) => inputRefs.current["company"] = ref}
              />
            </View>

            {/* <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                editable
                value={formData.department}
                onChangeText={(value) =>
                  useChangeData("department", value, false, setFormData)
                }
                placeholder="Enter Department Name"
                style={styles.inputText}
                ref={(ref) => inputRefs.current["department"] = ref}
              />
            </View> */}

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
                ref={(ref) => inputRefs.current["designation"] = ref}
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
                ref={(ref) => inputRefs.current["gross_annual_income"] = ref}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Official Email Id</Text>
              <TextInput
                editable
                value={formData.official_email_id}
                onChangeText={(value) =>
                 setFormData({...formData , official_email_id: value})
                }
                placeholder="Enter Official Email Id"
                style={styles.inputText}
                ref={(ref) => inputRefs.current["official_email_id"] = ref}
              />
            </View>

              </View>
            )}


            {showProfessionalDetails === 'Farmer' && (
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
                 ref={(ref) => inputRefs.current["gross_annual_income"] = ref}
               />
             </View>
            )}


                {/* Professional Details Feilds ends */}
              </View>

              {/* Requirements Feilds Starts */}
              <View style={styles.sectionStyle}>
                <Text
                  style={{
                    fontSize: 20,
                    paddingBottom: 8,
                    borderBottomWidth: 0.2,
                  }}
                >
                  Requirements
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Expected Possesion <Text style={styles.requierdFeilds}>*</Text></Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.possesion_date}
                      onValueChange={(itemValue) =>
                        useChangeData(
                          "possesion_date",
                          itemValue,
                          false,
                          setFormData
                        )
                      }
                      style={styles.picker}
                    >
                       <Picker.Item label="Select" value="select" />
                <Picker.Item label="Ready To Move" value="ready to move" />
                <Picker.Item label="Within 6 Months" value="within 6 months" />
                <Picker.Item label="Not in Hurry" value="Not in Hurry" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Budget <Text style={styles.requierdFeilds}>*</Text></Text>
                  <TextInput
                    editable={true}
                    value={formData.budget}
                    onChangeText={(value) =>
                      useChangeData("budget", value, true, setFormData)
                    }
                    placeholder="Enter Budget"
                    style={styles.inputText}
                    keyboardType="numeric"
                    ref={(ref) => (inputRefs.current["budget"] = ref)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Interested Accommodation <Text style={styles.requierdFeilds}>*</Text></Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.interest}
                      onValueChange={(itemValue) => {
                        if(itemValue === 'commercial'){
                          setShowPurposeFeild(true);
                       }else{
                         setShowPurposeFeild(false);
                       }
                        useChangeData(
                          "interest",
                          itemValue,
                          false,
                          setFormData
                        );
                      }}
                      style={styles.picker}
                    >
                       <Picker.Item label="Select" value="select" />
                      <Picker.Item label="Appartment" value="appartment" />
                      <Picker.Item label="Bunglow" value="bunglow" />
                      <Picker.Item label="Commercial" value="commercial" />
                      <Picker.Item label="Flat" value="flat" />
                      <Picker.Item label="Plot" value="plot" />
                      {/* <Picker.Item label="Hoardings" value="Hoardings" /> */}
                    </Picker>
                  </View>
                </View>

                { showPurposeFeild && <View style={[styles.inputGroup , {marginTop:0}]}>
            <Text style={styles.label}>Purpose <Text style={styles.requierdFeilds}>*</Text></Text>
            <TextInput
              editable
              value={formData.purpose}
              onChangeText={(value) =>
                useChangeData("purpose", value, false, setFormData)
              }
              placeholder="Enter Purpose"
              style={styles.inputText}
              ref={(ref) => (inputRefs.current["purpose"] = ref)}
            />
          </View>}

                <View style={[styles.inputGroup, { marginTop: 0 }]}>
                  <Text style={styles.label}>Remark <Text style={styles.requierdFeilds}>*</Text></Text>
                  <TextInput
                    editable
                    value={formData.remark}
                    onChangeText={(value) =>
                      useChangeData("remark", value, false, setFormData)
                    }
                    placeholder="Enter Remarks"
                    style={styles.inputText}
                    ref={(ref) => (inputRefs.current["remark"] = ref)}
                  />
                </View>

                {/* Requirements Feilds ends */}
              </View>

              {/* Socials Feilds Starts */}
              <View style={styles.sectionStyle}>
                <Text
                  style={{
                    fontSize: 20,
                    paddingBottom: 8,
                    borderBottomWidth: 0.2,
                  }}
                >
                  Social Media Handles
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Instagram ID</Text>
                  <TextInput
                    editable
                    value={formData.instagram_id}
                    onChangeText={(value) =>
                      setFormData({ ...formData, instagram_id: value })
                    }
                    placeholder="Enter Instagram Id"
                    style={styles.inputText}
                    ref={(ref) => (inputRefs.current["instagram_id"] = ref)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Facebook Id</Text>
                  <TextInput
                    editable
                    value={formData.facebook_id}
                    onChangeText={(value) =>
                      setFormData({ ...formData, facebook_id: value })
                    }
                    placeholder="Enter Facebook Id"
                    style={styles.inputText}
                    ref={(ref) => (inputRefs.current["facebook_id"] = ref)}
                  />
                </View>

                {/* Socials Feilds Ends */}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <View
                style={{
                  width: "100%",
                  height: 100,
                  backgroundColor: '#F6F5F5',
                }}
              ></View>
            </>
          )}
        </View>
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
    minHeight: height,
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
  requierdFeilds: {
    color: 'red',           
    fontWeight: 'bold',     
    fontSize: 16,           
    marginLeft: 2,          
  }
});

export default UpdateClientSiteVisitDetails;
