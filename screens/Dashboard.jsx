import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView,Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { blue, yellow } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { setAllDropdownData, setIsFormSubmitted, setShowPopupDialog } from '../redux/slices/misc';
import DialogComponent from '../components/DialogComponent';
import LogoutPopUp from '../components/LogoutPopUp';
import Loading from '../components/Loading';
// import Test from '../components/TestTemplate';



const Dashboard = ({setUserLoggedIn}) => {
  
  const {update , showPopupDialog , logoutPopUp} = useSelector((state) => state.misc);
  const {user} = useSelector((state) => state.user);
  const {navigate} = useNavigation();
  const [loading ,setLoading] = useState(true);
  const cardTemplate = [
    // { id: 0, text_id: 'total_panding_FW', text: "Today's Pending Follow Up", number: 0, backgroundColor: '#FFD166', icon: 'people-outline' },
    { id: null, text_id: 'total_event', text: 'Events Done', number: 0, backgroundColor: '#EF476F',icon:require('../assets/Events.png') },
    { id: 1, text_id: 'total_leads', text: 'Leads', number: 0,  backgroundColor: '#06D6A0' , icon:require('../assets/Leads.png')},
    { id: 2, text_id: 'total_corp_visit', text: 'Corporate Visit', number: 10,  backgroundColor: '#118AB2' ,icon:require('../assets/CorpVisit.png')},
    { id: 3, text_id: 'total_followUP', text: 'Follow Up', number: 0,  backgroundColor: '#073B4C' , icon:require('../assets/FollowU.png')},
    { id: 4, text_id: 'total_home_visit', text: 'Home Visit', number: 0,  backgroundColor: '#A7C957' , icon:require('../assets/HomeVisit.png')},
    { id: 5, text_id: 'total_SM_FW', text: 'Sage M/F', number: 0,  backgroundColor: '#F4A261' , icon:require('../assets/SAGEMF.png')},
    { id: 6, text_id: 'total_site_visit', text: 'Site Visit', number: 0,  backgroundColor: '#2A9D8F' , icon:require('../assets/SiteVisit.png')},
    { id: 7, text_id: 'total_admission', text: 'Admission', number: 0,  backgroundColor: '#E76F51' , icon:require('../assets/Admission.png')},
    { id: 8, text_id: 'total_ip', text: 'IP', number: 0,  backgroundColor: '#E9C46A' ,icon:require('../assets/IP.png')},
  ];


  const [cardData, setCardData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // setLoading(false);
    const getData = async () => {
      try{
        const res = await axios.get('http://182.70.253.15:8000/api/Get-Data' , {
          withCredentials: true,
          headers:{
            Authorization: `Bearer ${user.access}`
          }
        })
        dispatch(setAllDropdownData(res.data))
      }
      catch(err){
        console.log(err);
      }
    }

    getData();
  } , [])

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setLoading(false);
      } , 1000)
      setCardData([]);
      // console.log('===============');
      axios.get(`http://182.70.253.15:8000/api/Dashboard/${user.user.first_name}` ,{
        withCredentials: true,
        headers:{
          'Authorization': `Bearer ${user.access}`
        }
      }).then((res) => {
        // console.log(res.data);
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
        // console.log(cardTemplate);
        setCardData(cardTemplate);
      }).catch((err) => console.log({err}));
    },[user , update])
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {showPopupDialog && <DialogComponent
          title="Form Submitted"
          message="Your form has been submitted successfully."
          navigation={navigate}
        />}
        {logoutPopUp && <LogoutPopUp navigate={navigate}/>}
        <ScrollView style={styles.scroller}>
          <View style={styles.devider}>
          {/* {cardData && cardData.map((card) => (
            <View key={card.id} style={[styles.innerContainer , {backgroundColor:'white'}]}>
              <View style={styles.textContainer}>
                <View style={{display:'flex' , alignItems:'center' , justifyContent:'center', paddingVertical:10, width:'100%'}}>
                  <Image source={card.icon} style={{width:50 , height:50}} />
                  <Text style={styles.dialogText}>{card.text}</Text>
                  <Text style={styles.dialogNumber}>{card.number}{card.targetNo && `/ ${card.targetNo}`}</Text>
                </View>
                <View style={{display:'flex' , flexDirection:'row' , flexWrap:'wrap' , gap:5 , alignItems:'center'}}>
                </View>
              </View>
            
          </View>
          ))} */}
          {/* <View key={card.id} style={[styles.innerContainer , {backgroundColor:'white'}]}>
              <View style={styles.textContainer}>
                <View style={{display:'flex' , alignItems:'center' , justifyContent:'center', paddingVertical:10, width:'100%'}}>
                  <Image source={card.icon} style={{width:50 , height:50}} />
                  <Text style={styles.dialogText}>{card.text}</Text>
                  <Text style={styles.dialogNumber}>{card.number}{card.targetNo && `/ ${card.targetNo}`}</Text>
                </View>
                <View style={{display:'flex' , flexDirection:'row' , flexWrap:'wrap' , gap:5 , alignItems:'center'}}>
                </View>
              </View>
            
          </View> */}

         

          {/* {cardData && cardData.map((card) => (
               <View key={card.id} style={[styles.innerContainer , {alignItems:'center'}]}>
               <View style={{display:'flex' , flexDirection:'column' , gap:5, borderRightWidth:0.2 , alignItems:'center' , justifyContent:'center' , paddingHorizontal:5 , width:'60%' }}>
               <Image source={card.icon} style={{width:60 , height:60}} width={30} height={30}/>
               <Text style={{
                 fontSize:12,
                 color:blue,
                 fontWeight:'bold',
               }}>{card.text}</Text>
             </View>
             <View style={{
               display:'flex',
               flexDirection:'column',
               width:'40%',
               height:'100%',
               justifyContent:'center',
               alignItems:'center',
             }}>
                 <Text style={{   
                   fontSize:25,
                 }}>{card.number}</Text>
                  <Text style={{
                    fontSize:20
                  }}>{card.targetNo && `${card.targetNo}`}</Text>
             </View>
           </View>
          ))} */}

{/* <View className='topContainer' style={[styles.innerContainer , {backgroundColor:'white' , flexDirection:'column'}]}>
              <View style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-between',
                gap:8,
                height:'40%',
                width:'100%',
              }}>
                <Image source={require('../assets/SiteVisit.png')} style={{width:50 , height:50}} />
                <Text style={{
                  fontSize:13,
                  textAlign:'center',
                  fontFamily:'sans-serif',
                  fontWeight:'bold',
                  // backgroundColor:'pink',
                  width:'50%',
                  color:blue,
                }}>{card.text}</Text>
              </View>
                <View style={{
                  width:'100%',
                  height:'55%',
                  marginTop:10,
                  paddingBottom:10                    
                }}>
                  <View style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'space-between',
                  
                    paddingTop:2
                  }}>
                    <Text style={{
                      fontSize:15
                    }}>{card.targetNo}</Text>
                    <Text style={{
                      fontSize:15
                    }}>0</Text>
                  </View>

                  <View style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'space-between',
                  }}>
                    <Text style={{
                      fontSize:15
                    }}>Target</Text>
                    <Text style={{
                      fontSize:15,
                    }}>Achived</Text>
                  </View>
                </View> 
          </View> */}

          
          {cardData && cardData.map((card) => (
            <View key={card.id} className='topContainer' style={[styles.innerContainer , {backgroundColor:'white' , flexDirection:'column' , height:150}]}>
            <View style={{
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'space-between',
              height:'40%',
              width:'100%',
            }}>
              <Image source={card.icon} style={{width:60 , height:60 }} />
              <Text style={{
                fontSize:16,
                textAlign:'center',
                fontFamily:'sans-serif',
                fontWeight:'bold',
                // marginTop:-8,
                width:'100%',
                color:blue,
              }}>{card.text}</Text>
            </View>
              <View style={{

                width:'100%',
                height:'55%',
                marginTop:10,
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
                  {/* {card.id ===2 && console.log({'cd':card.number})} */}
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
                  {card.targetNo && (
                      <Text style={{
                        fontSize:10
                      }}>Target</Text>
                  )}    
                  <Text style={{
                    fontSize:10,
                     flexGrow:1,
                    textAlign:'right'
                  }}>Achieved</Text>
                </View>
              </View> 
           </View>
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
