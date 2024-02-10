import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details')}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginStack', { screen: 'Login' })}
                style={{ 
                    backgroundColor: 'lightblue',
                    position: 'absolute',
                    top: 0,
                    left: 20,
                    padding: 10, borderRadius: 5, marginTop: 20 }}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;