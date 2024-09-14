import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Pressable,ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Loader from '../components/Loading';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { blue } from '../constants';
import TabSelection from '../components/TabSelection'
import { useFocusEffect } from '@react-navigation/native';


const HomeVisitDetails = ({ route }) => {
    const { data } = route.params;
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [todaysDone,setTodaysDone] = useState(0);
    const [selection , setSelection] = useState('today');
    const [showMoreMap, setShowMoreMap] = useState({}); // State to store visibility for each item
    const [filledData, setFilledData] = useState([]);

      useFocusEffect(useCallback(() => {
        let url = `http://182.70.253.15:8000/api/Forms-Data/${user.user.first_name}/home`;
        try{
            axios.get(url).then((res) => setTodaysDone(res?.data?.count)).catch(err => console.log(err));
        }catch(err){
            setFilledData([]);
            console.log({err});
            Alert.alert('🔴OOPS' , 'Something Went Wrong', [{text:'Ok'}])
        }
        setSelection('today');
        setShowMoreMap({});
      },[data]))

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let url = `http://182.70.253.15:8000/api/Forms-Data/${user.user.first_name}/home`;
                if(selection === 'all'){
                    url+=`?date=${selection}`
                }
                const res = await axios.get(url);
                setFilledData(res.data.data);
                console.log('====hiihihihihiihihihih====',res.data);
            } catch (err) {
                setFilledData([]);
                console.log({err});
                Alert.alert('🔴OOPS' , 'Something Went Wrong', [{text:'Ok'}])
            } finally {
                setTimeout(() => {
                    setLoading(false);
                    setShowMoreMap({});
                },500)
            }
        };

        fetchData();
    }, [data,selection]);

    // Function to toggle the visibility of each item
    const toggleShowMore = (id) => {
        setShowMoreMap((prevMap) => ({
            ...prevMap,
            [id]: !prevMap[id]
        }));
    };

    // console.log(filledData)

    return loading ? <Loader/> : (
        <ScrollView style={{
            paddingBottom:20,
            marginBottom:30,
            backgroundColor: '#F6F5F5',
        }} nestedScrollEnabled={true}>
            <Text style={{
                width:'100%',
                textAlign:'center',
                paddingVertical:5,
                fontSize:20,
                marginTop:10
            }}>{data?.text}'s Details</Text>
        <Pressable style={styles.container}>
            <TabSelection selection={selection} handleSetSelection={setSelection} todayCount={todaysDone} totalCount={data?.number} />
            {filledData && filledData.map((item) => {
                const isExpanded = showMoreMap[item.C_ph];
                // console.log(item.)
                return (
                    <Pressable key={item.C_ph} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.C_name}</Text>
                            <Text style={styles.textStyle}>{item.date}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.C_ph}</Text>
                        </View>
                       {(item?.record[0] && item?.record[0]?.Visit_location) && <Text style={[styles.textStyle , styles.textHeadings]}>Address: {item?.record[0]?.Visit_location}</Text>} 
                       
                        {/* {item?.record?.map((rec,index) => {
                            return (
                                <View key={index} style={styles.moreContent}>
                                <Text style={[styles.textStyle , styles.textHeadings , {marginBottom:0}]}>Remark</Text>
                                <Text style={[styles.textStyle , {marginTop:0}]}>{rec.detail}</Text>
                                <Text style={[styles.textStyle]}>Visit Type: {rec.visit_type}</Text>
                                {rec.co_fellow && <Text style={[styles.textStyle]}>Team Members: {rec.co_fellow}</Text>}
                            </View>
                            )
                        })} */}
                        
                        {isExpanded && (
                            <>
                                {item?.record?.map((rec,index) => {
                                    // console.log(index);
                            return (
                                <View key={index} style={styles.moreContent}>
                                    <View style={styles.header}>
                                        <Text style={[styles.textStyle , styles.textHeadings]}>Conversation {item?.record?.length - index}</Text>
                                        <Text style={styles.textStyle}>({rec.date})</Text>
                                    </View>
                                <Text style={[styles.textStyle , {marginTop:0}]}>{rec.detail}</Text>
                                <Text style={[styles.textStyle]}>Visit Type: {rec.visit_type}</Text>
                                {rec.co_fellow && <Text style={[styles.textStyle]}>Team Members: {rec.co_fellow}</Text>}
                            </View>
                            )
                        })}
                            </>
                        )}

                        <Pressable style={styles.toggleButton} onPress={() => toggleShowMore(item.C_ph)}>
                            <Text style={styles.toggleText}>{isExpanded ? 'Less' : 'More'}</Text>
                            <Ionicons 
                                name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} 
                                size={20} 
                                color="black" 
                                />
                        </Pressable>
                    </Pressable>
                );
            })}
        </Pressable>
    </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#F6F5F5',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    textHeadings:{
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    moreContent: {
        flexDirection:'column',
        gap:5,
        marginTop: 10,
    },
    email:{
        fontSize: 0,
        fontWeight: '400',
        color: '#333',
    },
    textStyle: {
        fontSize: 12,
        fontWeight: '400',
        color: '#333',
        textTransform: 'capitalize',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '500',
        marginRight: 0,
        color: '#007BFF',
    },
});

export default HomeVisitDetails;