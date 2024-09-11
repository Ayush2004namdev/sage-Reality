import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import Loader from '../components/Loading';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { blue } from '../constants';
import TabSelection from '../components/TabSelection'

const { height } = Dimensions.get('window');

const HomeVisitDetails = ({ route }) => {
    const { data } = route.params;
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [selection , setSelection] = useState('today');
    const [showMoreMap, setShowMoreMap] = useState({}); // State to store visibility for each item
    const [filledData, setFilledData] = useState([
        {
          C_name: "Ayush",
          C_ph: "9718153660",
          Visit_location: "Tesy",
          co_fellow: null,
          date: "2024-09-10",
          detail: "Hsjsjs dkdvs kdvd di dncod choc cbckc c kvhx xkbx dkcux dkuf dbdnxj xnvkvm ck bc ckxjc xnic cjcicb cnv",
          id: 314,
          images: "HomeVisit/test_class_datetime.date_tesy_14-22-08.jpeg",
          lat_long: "[23.2270133, 77.4367576]",
          name: "test",
          revisit: "1",
          visit_type: "solo"
        },
        {
          C_name: "Ayush",
          C_ph: "9718153660",
          Visit_location: "Tesy",
          co_fellow: "Ashish Patil,Devendra Joshi,Faizal Ahmad",
          date: "2024-09-10",
          detail: "Tejsid xmxjbdncnx c j bx xnchx cbuxvs sjvs dnchxus dbjvdnf ncjcbc ckx x ncjxbc bch xb dud dbjd dndb dn",
          id: 317,
          images: "HomeVisit/test_class_datetime.date_tesy_14-37-13.jpeg",
          lat_long: "[23.2270217, 77.4367627]",
          name: "test",
          revisit: "2",
          visit_type: "team"
        }
      ]);

    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true);
            try {
                let url = `http://10.22.130.15:8000/api/Forms-Data/${user.user.first_name}/home`;
                if(selection === 'all'){
                    url+=`?date=${selection}`
                }
                const res = await axios.get(url);
                // setFilledData(res.data.data);
                console.log('========',res.data);
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

    return loading ? <Loader/> : (
        <View style={styles.container}>
            <TabSelection selection={selection} handleSetSelection={setSelection}/>
            {filledData && filledData.map((item) => {
                const isExpanded = showMoreMap[item.id];
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.C_name}</Text>
                            <Text style={styles.textStyle}>{item.date}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={[styles.textStyle , styles.textHeadings]}>{item.C_ph}</Text>
                        </View>
                        <Text style={[styles.textStyle , styles.textHeadings]}>Location: {item.Visit_location}</Text>

                        {isExpanded && (
                            <View style={styles.moreContent}>
                                <Text style={[styles.textStyle , styles.textHeadings , {marginBottom:0}]}>Remark</Text>
                                <Text style={[styles.textStyle , {marginTop:0}]}>{item.detail}</Text>
                                <Text style={[styles.textStyle]}>Visit Type: {item.visit_type}</Text>
                                {item.co_fellow && <Text style={[styles.textStyle]}>Team Members: {item.co_fellow}</Text>}
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
    );
};


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