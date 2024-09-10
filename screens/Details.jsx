import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import Loader from '../components/Loading';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { blue } from '../constants';

const { height } = Dimensions.get('window');

const Details = ({ route }) => {
    const { data } = route.params;
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [selection , setSelection] = useState('today');
    const [showMoreMap, setShowMoreMap] = useState({}); // State to store visibility for each item
    const [filledData, setFilledData] = useState([{
        "cofel_name": null, 
        "corp_name": "108 EMERGENCY SERVICES", 
        "corp_type": "Political Organization", 
        "data_collect": "0", 
        "id": 431, 
        "images": "CorpoVisit/anjali-saxena_2024-09-09_108-emergency-services_17-22-58.jpg", 
        "key_person": "Hm", 
        "key_person2": "", 
        "key_person_contact": "6261590239", 
        "key_person_contact2": "", 
        "lat_long": null, 
        "location": "Hm", 
        "meet_person": 0, 
        "name": "Anjali Saxena", 
        "num_attend": null, 
        "nxt_pre_date": null, 
        "presentation": "done", 
        "reason": "", 
        "visit_date": "2024-09-09", 
        "visit_type": "solo"
    },{
        "cofel_name": null, 
        "corp_name": "108 EMERGENCY SERVICES", 
        "corp_type": "Political Organization", 
        "data_collect": "0", 
        "id": 432, 
        "images": "CorpoVisit/anjali-saxena_2024-09-09_108-emergency-services_17-22-58.jpg", 
        "key_person": "Hm", 
        "key_person2": "", 
        "key_person_contact": "6261590239", 
        "key_person_contact2": "", 
        "lat_long": null, 
        "location": "Hm", 
        "meet_person": 0, 
        "name": "Anjali Saxena", 
        "num_attend": null, 
        "nxt_pre_date": null, 
        "presentation": "done", 
        "reason": "", 
        "visit_date": "2024-09-09", 
        "visit_type": "solo"
    },{
        "cofel_name": null, 
        "corp_name": "108 EMERGENCY SERVICES", 
        "corp_type": "Political Organization", 
        "data_collect": "0", 
        "id": 433, 
        "images": "CorpoVisit/anjali-saxena_2024-09-09_108-emergency-services_17-22-58.jpg", 
        "key_person": "Hm", 
        "key_person2": "", 
        "key_person_contact": "6261590239", 
        "key_person_contact2": "", 
        "lat_long": null, 
        "location": "Hm", 
        "meet_person": 0, 
        "name": "Anjali Saxena", 
        "num_attend": null, 
        "nxt_pre_date": null, 
        "presentation": "done", 
        "reason": "", 
        "visit_date": "2024-09-09", 
        "visit_type": "solo"
    }]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log(user.access);
            try {
                const res = await axios.get(`http://10.22.130.15:8000/api/Forms-Data/${user.user.first_name}/corporate`);
                // setFilledData(res.data.data);
                // console.log(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [data]);

    // Function to toggle the visibility of each item
    const toggleShowMore = (id) => {
        setShowMoreMap((prevMap) => ({
            ...prevMap,
            [id]: !prevMap[id]
        }));
    };

    const handleSetSelection = (event) => {
        setSelection(event);
    }

    return (
        <View style={styles.container}>
            <View style={{
                width:'100%',
                height:50,
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-around',
            }}>
                <Pressable style={{
                    backgroundColor:'white',
                    paddingHorizontal:10,
                    paddingVertical:5,
                    borderRadius:5,
                    borderColor: selection === 'today' ? 'blue' : 'black',
                    borderWidth: 1 ,
                }} onPress={() => handleSetSelection('today')}>
                    <Text>Today</Text>
                </Pressable>
                <Pressable style={{
                    backgroundColor:'white',
                    paddingHorizontal:10,
                    paddingVertical:5,
                    borderRadius:5,
                    borderColor:selection === 'all' ? 'blue' : 'black',
                    borderWidth:2,
                }} onPress={() => handleSetSelection('all')}>
                    <Text>All</Text>
                </Pressable>
            </View>
            {loading && <Loader />}
            {filledData && filledData.map((item) => {
                const isExpanded = showMoreMap[item.id];
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.key_person}</Text>
                            <Text style={styles.textStyle}>{item.visit_date}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.textStyle}>{item.key_person_contact}</Text>
                        </View>
                        <Text style={styles.textStyle}>{item.corp_name}</Text>

                        {/* Collapsible Content */}
                        {isExpanded && (
                            <View style={styles.moreContent}>
                                <Text style={styles.textStyle}>Corporation Type: {item.corp_type}</Text>
                                <Text style={styles.textStyle}>Presentation: {item.presentation}</Text>
                                {/* Add more fields if necessary */}
                            </View>
                        )}

                        {/* Toggle Button */}
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
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height,
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
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
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
