import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log(username, password);
        // TODO: Call API to authenticate user
        navigation.navigate('HomeStack', { screen: 'Home' })
    };

    return (
        <View>
            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder={'Username'}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={'Password'}
                secureTextEntry={true}
            />
            <Button title={'Login'} onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;