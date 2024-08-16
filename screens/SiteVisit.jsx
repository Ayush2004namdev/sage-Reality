import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import DialogComponent from "../components/DialogComponent";
import Loading from "../components/Loading";
import { blue } from '../constants';
import useChangeData from "../hooks/useChangeData";
import { useSelector } from 'react-redux';
import AddClientSiteVisitDetails from './AddClientSiteDetails';
import UpdateClientSiteVisitDetails from './UpdateClientSiteVisitDetails';
import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const SiteVisit = () => {

    const [showPopUp , setShowPopup] = useState(true);
    const [addClientSiteVisit , setAddClientSiteVisit] = useState(false);
    const [updateClientSiteVisit , setUpdateClientSiteVisit] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setShowPopup(true);
            setAddClientSiteVisit(false);
            setUpdateClientSiteVisit(false);
            return () => {
                setShowPopup(true);
                setAddClientSiteVisit(false);
                setUpdateClientSiteVisit(false);
            }
        },[])
    )
    useEffect(() => {
        console.log('');

        return () => {
            setShowPopup(true);
            setAddClientSiteVisit(false);
            setUpdateClientSiteVisit(false);
        }
    },[])

    const handleOnPress = (val) => {
        setShowPopup(false);
        if(val === 'add'){
            setAddClientSiteVisit(true);
        }
        else{
            setUpdateClientSiteVisit(true);
        }

    }

  return (
    <View >
        {showPopUp && (
            <View style={{
                width: width,
                height: height,
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 9999,
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor:'white',
                    width: '80%',
                    padding: 20,
                    borderRadius: 10,
                    height: 'auto',
                    
                }}>
                    <Text style={{textAlign:'center' , fontSize:15 , marginBottom:20}}>Site Visit Form</Text>
                    <View style={{width:'100%' , display:'flex' , alignItems:'center' , justifyContent:'space-between' , gap:20}}>
                        <Button title='Add Client Site Visit' style={{
                            color:'white',
                            backgroundColor:blue,
                        }} onPress={() => handleOnPress('add')}/>
                        <Button title='Update Client Site Visit' style={{
                            color:'white',
                            backgroundColor:blue,
                        }} onPress={() => handleOnPress('update')}/>
                    </View> 
                </View>
            </View>
        )}

        {addClientSiteVisit && <AddClientSiteVisitDetails />}
        {updateClientSiteVisit && <UpdateClientSiteVisitDetails />}


    </View>
  )
}

const styles = StyleSheet.create({
    
})

export default SiteVisit




