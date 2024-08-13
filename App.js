import React from 'react'
import Main from './MainComponent'
import { Provider } from 'react-redux'
import store from './redux/store'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native'

const App = () => {
  return (
    <Provider store={store}>
      {/* <SafeAreaView style={{flex: 1}}/> */}
      <StatusBar style='auto'/>
      <Main/>
    </Provider>
  )
}

export default App