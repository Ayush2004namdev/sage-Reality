import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DialogComponent from '../components/DialogComponent';
import Loader from '../components/Loading';
import LogoutPopUp from '../components/LogoutPopUp';
import { blue } from '../constants';
import { setAllDropdownData, setShowPopupDialog } from '../redux/slices/misc';
import { logout, setUserLocation } from '../redux/slices/user';
import { getLocation } from '../lib/features';
// import Test from '../components/TestTemplate';



const Dashboard = ({setUserLoggedIn}) => {
  
  const {update , showPopupDialog , logoutPopUp} = useSelector((state) => state.misc);
  const {user} = useSelector((state) => state.user);
  const {navigate} = useNavigation();
  const [loading ,setLoading] = useState(true);
  const [showLocationError , setShowLocationError] = useState(false);
  const cardTemplate = [
    // { id: 0, text_id: 'total_panding_FW', text: "Today's Pending Follow Up", number: 0, backgroundColor: '#FFD166', icon: 'people-outline' },
    // { id: 1, text_id: 'total_leads', text: 'Leads', number: 0,  backgroundColor: '#06D6A0' , icon:require('../assets/Leads.png')},
    { id: 3, text_id: 'total_followUP', text: 'Follow Up', number: 0,  backgroundColor: '#073B4C' , icon:require('../assets/FollowU.png') },
    { id: 5, text_id: 'total_SM_FW', text: 'Sage Mitra Follow Up', number: 0,  backgroundColor: '#F4A261' , icon:require('../assets/SAGEMF.png'),to:'SageMitraFollowUpDetails'},
    { id: 2, text_id: 'total_corp_visit', text: 'Corporate Visit', number: 10,  backgroundColor: '#118AB2' ,icon:require('../assets/CorpVisit.png') , to:'CorporateVisitDetails'},
    { id: 4, text_id: 'total_home_visit', text: 'Home Visit', number: 0,  backgroundColor: '#A7C957' , icon:require('../assets/HomeVisit.png') , to:"HomeVisitDetails"},
    { id: 6, text_id: 'total_site_visit', text: 'Site Visit', number: 0,  backgroundColor: '#2A9D8F' , icon:require('../assets/SiteVisit.png'), to:"SiteVisitDetails"},
    { id: null, text_id: 'total_event', text: 'Event', number: 0, backgroundColor: '#EF476F',icon:require('../assets/Events.png'), to:"EventsDetails" },
    { id: 7, text_id: 'total_admission', text: 'Admission', number: 0,  backgroundColor: '#E76F51' , icon:require('../assets/Admission.png') , to:"AdmissionDetails"},
    { id: 8, text_id: 'total_ip', text: 'IP', number: 0,  backgroundColor: '#E9C46A' ,icon:require('../assets/IP.png') , to:"IpDetails"},
  ];


  const [cardData, setCardData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // setLoading(false);
    const getData = async () => {
      try{
        // const res = await axios.get('http://182.70.253.15:8000/api/Get-Data' , {
          // const res = await axios.get('http://182.70.253.15:8000/api/Get-Data' , {
          const res = await axios.get(
            'http://182.70.253.15:8000/api/Get-Data'
            // 'http://10.22.130.15:8000/api/Get-Data'
             , {
          withCredentials: true,
          headers:{
            Authorization: `Bearer ${user.access}`
          }
        })
        // console.log(res.data.source);
        // console.log(res.data.interested_localities)c;
        dispatch(setAllDropdownData(res.data))
        const loc = await getLocation();
        if(loc){
          dispatch(setUserLocation(loc));
        }
      }
      catch(err){
        if(err?.message === 'Location request failed due to unsatisfied device settings'){
          setShowLocationError({title: "Location Access Denied", message: "Please allow the location access for the application" , workDone: false});
          return;
          }
        console.log(err);
      }
    }

    getData();
  } , [])

  useFocusEffect(
    useCallback(() => {
      // dispatch(setUserLocation(false));
      setCardData([]);
      // console.log('===============');
      axios.get(
        `http://182.70.253.15:8000/api/Dashboard/${user.user.first_name}` ,{
        // `http://10.22.130.15:8000/api/Dashboard/${user.user.first_name}` ,{
        withCredentials: true,
        headers:{
          'Authorization': `Bearer ${user.access}`
        }
      }).then((res) => {
      
        // console.log({'full data':res.data});
        // console.log({'targets' : res.data.targets})
        // console.log({'total' : res.data.total})
        res?.data?.targets.forEach((target) => {
          const card = cardTemplate.find((card) => card.id === target.Target_id);
          if(card){     
            card.targetNo = target.target;  
          }
        })
        
        Object.entries(res?.data?.total).forEach(([key, value]) => {
          const card = cardTemplate.find((card) => card.text_id.toString() === key.toString());
          if(card){
            card.number = value;
          }
        });
      
        setCardData(cardTemplate);
        setLoading(false);
      }).catch((err) => {
        console.log(err);
        Alert.alert("🔴OOPS" , "Session Expression. Please Login Again" , [{text:"OK", 
          onPress : () => {dispatch(logout())}
        }] )
      });
    },[user , update])
  )

  return loading ? <Loader back={true}/> : (
    <SafeAreaView style={{ flex: 1 }}>
    {showLocationError && (
        <DialogComponent
          setShowLocationError={setShowLocationError}
          title={showLocationError.title}
          message={showLocationError.message}
          workDone={showLocationError.workDone}
          cancel={false}
          navigate={navigate}
          to={showLocationError.to}
        />
      )}
      <View style={styles.container}>
        {showPopupDialog && <DialogComponent
          title="Form Submitted"
          message="Your form has been submitted successfully."
          navigation={navigate}
        />}
        {logoutPopUp && <LogoutPopUp navigate={navigate}/>}
        <ScrollView style={styles.scroller}>
          <View style={styles.devider}>
    
          {cardData?.length>0  && cardData.map((card) => (
            <Pressable key={card.id} className='topContainer' style={[styles.innerContainer , {backgroundColor:'white' , flexDirection:'column' , height:150}]} onPress={() => card.to ? navigate(card.to, {data:card}) :''}>
            <View style={{
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'space-between',
              height:'40%',
              width:'100%',
            }}>
              <Image source={card.icon} style={(card.id === 3 || card.id === 5) ? {width:58 , height:58 } : {width:70 , height:70}} />
              <Text style={{
                fontSize:14,
                textAlign:'center',
                // fontFamily:'sans-serif',
                fontWeight:'bold',
                marginTop:-4,
                paddingHorizontal:10,
                width:'100%',
                color:blue,
              }}>{card.text}</Text>
            </View>
              <View style={{

                width:'100%',
                height:'55%',
                marginTop: 20,
                paddingTop:18,
                paddingBottom:10                    
              }}>
                <View style={{
                  display:'flex',
                  flexDirection:'row',
                    fontWeight:'bold',
                  justifyContent:'space-between',
                  paddingTop:5
                }}>
                  <Text style={{
                    fontSize:16,
                    fontWeight:'bold',
                  }}>{card.targetNo}</Text>
                  <Text style={{
                    fontSize:16,
                    flexGrow:1,
                    fontWeight:'bold',
                    textAlign:'right'
                  }}>{card.number}</Text>
                </View>

                <View style={{
                  display:'flex',
                  flexDirection:'row',
                  justifyContent:'space-between',
                }}>
                  
                   {card?.targetNo !== undefined && <Text style={{
                        fontSize:10
                      }}>Target</Text> }
                        
                  <Text style={{
                    fontSize:10,
                     flexGrow:1,
                    textAlign:'right'
                  }}>Achieved</Text>
                </View>
              </View> 
           </Pressable>
          ))}
          </View>
          {/* <Test/> */}
          <View style={styles.dummy}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    backgroundColor: '#F6F5F5',
    // paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dialogNumber: {
    color: 'black', 
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  dialogText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 13,
  },
  textContainer:{
    display:'flex',
    width:'100%',
    flexDirection:'column',
    justifyContent:'space-between',
  },
  innerContainer:{
    flexDirection: 'row',
    backgroundColor:'white',
    // backgroundColor:'#FFF8F3',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transition: 'all 0.2s ease',
    width:'48%',
    height:120,
    padding:10,
  },
  devider:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    flexWrap:'wrap',
    paddingBottom:30,
  },
  scroller: {
    flex: 1,
    // backgroundColor: 'white',
    paddingTop: 20,
    backgroundColor: '#F6F5F5',
    paddingBottom: 20,
  },
  dummy: {
    height: 150,
    width: '100%',
    // backgroundColor: 'white',
    backgroundColor: '#F6F5F5',
  },
});
