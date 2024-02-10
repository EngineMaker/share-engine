import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import Styles from '../Styles';
import { CustomButton } from '../components/SmallComponents';
// import { getSecureItem, setSecureItem, existsSecureItem } from '../Utils';

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkLogin = async () => {
            console.log('Checking login');
            // const loggedIn = await existsSecureItem('user');
            // if (loggedIn) {
            //     navigation.navigate('HomeStack', { screen: 'Home' });
            // }
        };
        checkLogin();
    }, []);

    const handleLogin = async () => {
        console.log(username, password);
        // TODO: Call API to authenticate user
        if (username !== '' && password !== '') {
            try {
                console.log('Setting user');
                // await setSecureItem('user', username);
                console.log('User logged in');
                navigation.navigate('HomeStack', { screen: 'Home' });
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log('Invalid username or password');
        }
    };

    return (
        <View
            style={Styles.container}
        >
            <Text style = {Styles.title}>
                Login Screen
            </Text>
            <TextInput
                style={Styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder={'Username'}
            />
            <TextInput
                style={Styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={'Password'}
                secureTextEntry={true}
            />
            <CustomButton
                style={Styles.button}
                title={'Login'}
                onPress={handleLogin}
            />
        </View>
    );
};

export default LoginScreen;