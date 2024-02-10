import React from 'react';
import { View, Text, Button } from 'react-native';


const PublishScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Publish Screen</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
};


export default PublishScreen;