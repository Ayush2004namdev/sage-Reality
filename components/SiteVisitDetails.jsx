import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Loader from "../components/Loading";
import { Ionicons } from "@expo/vector-icons"; // or 'react-native-vector-icons/Ionicons'
import { blue } from "../constants";
import TabSelection from "../components/TabSelection";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("screen");

const SiteVisitDetails = ({ route }) => {
  const { data } = route.params;
  const { user } = useSelector((state) => state.user);
    const [todaysDone,setTodaysDone] = useState(0);
    const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState("today");
  const [showMoreMap, setShowMoreMap] = useState({}); // State to store visibility for each item
  const [filledData, setFilledData] = useState([]);

  useFocusEffect(useCallback(() => {
    let url = `http://182.70.253.15:8000/api/Forms-Data/${user.user.first_name}/site`;
    try{
        axios.get(url).then((res) => setTodaysDone(res?.data?.count)).catch(err => console.log(err));
    }catch(err){
        console.log(err);
    }
    setSelection('today');
    setShowMoreMap({});
  },[data]))


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `http://182.70.253.15:8000/api/Forms-Data/${user.user.first_name}/site`;
        if (selection === "all") {
          url += `?date=${selection}`;
        }
        const res = await axios.get(url);
        // const data = JSON.parse(res.data);
        setFilledData(res.data.data);
        // console.log("========", res.data);
        // setFilledData(res.data);
      } catch (err) {
        Alert.alert('🔴OOPS' , 'Something Went Wrong', [{text:'Ok'}])
        console.log(err);
        setFilledData([]);
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
      [id]: !prevMap[id],
    }));
  };

  const handleSetSelection = (event) => {
    setSelection(event);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
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
      {filledData &&
        filledData.map((item) => {
            const isExpanded = showMoreMap[item.id];
            return (
                <Pressable key={item.id} style={styles.card}>
              <View style={styles.header}>
                <Text style={[styles.textStyle, styles.textHeadings]}>
                  {item.Customer_name}
                </Text>
                <Text style={styles.textStyle}>{item.Visit_Date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.textStyle, styles.textHeadings]}>
                  {item.Customer_Contact_number}
                </Text>
              </View>

              <Text style={[styles.textStyle]}>
                    {item.Email_id}
              </Text>

              {(isExpanded && item.occupation_type) && <Text style={[styles.textStyle, styles.textHeadings]}>
              Occupation Type: {item.occupation_type}
              </Text>}

              <Text style={[styles.textStyle, styles.textHeadings]}>
                Address: {item.Address}
              </Text>

              {isExpanded && (
                  <View style={styles.moreContent}>
                  <Text
                    style={[
                        styles.textStyle,
                        styles.textHeadings,
                        { marginBottom: 0 },
                    ]}
                    >
                    Remark
                  </Text>
                  <Text style={[styles.textStyle, { marginTop: 0,marginLeft:0}]}>
                    {item.Remark}
                  </Text>
                  {item?.visit_type && <Text style={[styles.textStyle]}>
                    Visit Type: {item.visit_type}
                  </Text>}
                  <Text style={[styles.textStyle]}>
                    Source: {item.source_type}
                  </Text>
                  {item?.source && <Text style={[styles.textStyle]}>
                    Source: {item.source}
                  </Text>}
                
                {item?.reference &&  <Text style={[styles.textStyle]}>
                    Reference : {item.reference}
                  </Text>
                }
                {item?.Budget &&  <Text style={[styles.textStyle]}>
                    Budget : {item.Budget}
                  </Text>
                }
                {item?.Expected_possession &&  <Text style={[styles.textStyle]}>
                    {item.Expected_possession}
                  </Text>
                }
                {item?.accommodation &&  <Text style={[styles.textStyle]}>
                   Type of Accomodation: {item.accommodation}
                  </Text>
                }
                {item?.Interest &&  <Text style={[styles.textStyle]}>
                    Interseted Locations: {item.Interest}
                  </Text>
                }

                </View>
              )}

              <Pressable
                style={styles.toggleButton}
                onPress={() => toggleShowMore(item.id)}
                >
                <Text style={styles.toggleText}>
                  {isExpanded ? "Less" : "More"}
                </Text>
                <Ionicons
                  name={
                      isExpanded ? "chevron-up-outline" : "chevron-down-outline"
                    }
                    size={20}
                    color="black"
                    />
              </Pressable>
            </Pressable>
          );
        })}
    </View>
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
    width: "100%",
    // minHeight: height,
    backgroundColor: "#F6F5F5",
    padding: 20,
    marginBottom:10
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  textHeadings: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  moreContent: {
    flexDirection: "column",
    gap: 5,
    marginTop: 2,
  },
  email: {
    fontSize: 0,
    fontWeight: "400",
    color: "#333",
  },
  textStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#333",
    textTransform: "capitalize",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 0,
    color: "#007BFF",
  },
});

export default SiteVisitDetails;
