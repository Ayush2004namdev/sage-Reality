import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Loader from '../components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { blue } from '../constants';
import TabSelection from './TabSelection';
import { useFocusEffect } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const EventDetails = ({ route }) => {
    const { data } = route.params;
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [todaysDone,setTodaysDone] = useState(0);
    const [selection , setSelection] = useState('today');
    const [showMoreMap, setShowMoreMap] = useState({}); // State to store visibility for each item
    const [filledData, setFilledData] = useState([]);

    useFocusEffect(useCallback(() => {
        let url = `http://182.70.253.15:8000/api/Forms-Data/${user.user.first_name}/event`;
        try{
            axios.get(url).then((res) => setTodaysDone(res?.data?.count)).catch(err => console.log(err));
        }catch(err){
            console.log(err);
            setFilledData([]);
            Alert.alert('🔴OOPS' , 'Something Went Wrong', [{text:'Ok'}])
        }
        setSelection('today');
        setShowMoreMap({});
      },[data]))

    useEffect(() => {
        setFilledData([]);
        const fetchData = async () => {
          setLoading(true);
          try {
            let url = `http://182.70.253.15:8000/api/Forms-Data/${user.user.first_name}/event`;
            if (selection === "all") {
              url += `?date=${selection}`;
            }
            const res = await axios.get(url);
            // const data = JSON.parse(res.data);
            setFilledData(res.data.data);
            console.log("========", res.data);
            // setFilledData(res.data);
          } catch (err) {
            console.log(err);
          } finally {
            setTimeout(() => {
                setLoading(false);
                setShowMoreMap({})
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
        <View style={styles.container}>
        <TabSelection selection={selection} handleSetSelection={setSelection} todayCount={todaysDone} totalCount={data?.number} />
        {loading && <Loader />}
            {filledData && filledData.map((item) => {
                const isExpanded = showMoreMap[item.id];
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.Event_name}</Text>
                            {/* <Text style={styles.textStyle}>{item.followUp_date}</Text> */}
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.start_date} to {item.end_date}</Text>
                        </View>
                        {/* <Text style={[styles.textStyle , styles.textHeadings]}>Corporate Details</Text> */}
                        <Text style={[styles.textStyle]}>Number of leads: {item.num_lead}</Text>
                        <Text style={styles.textStyle}>Number of Attendees: {item.num_attendees}</Text>

                        {isExpanded && (
                            <View style={styles.moreContent}>
                                <Text style={styles.textStyle}>Event Type: {item.type}</Text>
                                <Text style={styles.textStyle}>Event Details: {item.event_details}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.toggleButton} onPress={() => toggleShowMore(item.id)}>
                            <Text style={styles.toggleText}>{isExpanded ? 'Less' : 'More'}</Text>
                            <Ionicons 
                                name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} 
                                size={20} 
                                color="black" 
                            />
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    </ScrollView>
    );
};

export default EventDetails;

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
        marginTop: 2,
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
