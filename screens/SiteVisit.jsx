import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { blue } from '../constants';
import AddClientSiteVisitDetails from './AddClientSiteDetails';
import UpdateClientSiteVisitDetails from './UpdateClientSiteVisitDetails';
import { useSelector } from 'react-redux';
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
                backgroundColor: 'rgba(0,0,0,0.01)',
                zIndex: 9999,
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    backgroundColor:'white',
                    minWidth :'60%',
                    padding: 20,
                    borderRadius: 10,
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Text style={{textAlign:'center' , fontSize:15 , marginBottom:20}}>Site Visit</Text>
                    <View style={{ display:'flex', alignItems:'center', flexDirection:'row', justifyContent:'space-between' }}>
                        <TouchableOpacity style={{
                            color:'white',
                            backgroundColor:'#007FFF',
                            paddingHorizontal: 20,
                            paddingVertical:10,
                            borderRadius: 10,
                            marginRight: 30,
                        }} onPress={() => handleOnPress('add')}>
                            <Text style={{color:'white' , fontWeight:700}}>ADD</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            color:'white',
                            backgroundColor:'#007FFF',
                            paddingHorizontal: 20,
                            paddingVertical:10,
                            borderRadius: 10,
                        }} onPress={() => handleOnPress('update')}>
                            <Text style={{color:'white' , fontWeight:700}}>UPDATE</Text>
                        </TouchableOpacity>
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




