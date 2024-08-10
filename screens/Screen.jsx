import React from 'react'
import {View , StatusBar, SafeAreaView} from 'react-native'

const Screen = () => {
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex: 1  , backgroundColor:'white'}}>
            <StatusBar barStyle='light-content' style="auto" />
        </View>
    </SafeAreaView>
  )
}

export default Screen