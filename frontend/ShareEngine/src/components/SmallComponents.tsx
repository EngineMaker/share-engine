import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle } from "react-native";

export const CustomButton = ({ 
    title, 
    style,
    textStyle,
    onPress,
 }: { title: string, 
    style?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,
    onPress: () => void }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={style || { 
                backgroundColor: 'lightblue',
                padding: 10, borderRadius: 5, marginTop: 20 }}
        >
            <Text
            style={textStyle || { fontSize: 20, color: "black" }}
            >{title}</Text>
        </TouchableOpacity>
    );
}