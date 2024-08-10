import React, { useEffect } from "react";
import Screen from "./Screen";
import { useNavigation } from "@react-navigation/native";

export const Dasboard = () => <Screen/>;
export const Menu = () => <Screen/>;
export const Add = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.navigate('Home')
    })
    return (
        <View>
        <Text>Add</Text>
        </View>
    );
}