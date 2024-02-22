import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import Styles from '../Styles';
import { CustomButton } from '../components/SmallComponents';
import { registerRequest } from '../Utils';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleRegister = async () => {
        console.log(username, password);
        if (username !== '' && password !== '') {
            console.log('Registering');
            await registerRequest (username, password).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        console.log('Registered:', data);
                        navigation.navigate('Login');
                    });
                } else {
                    console.log('Invalid username or password');
                }
            }).catch((error) => {
                console.error('Error logging in:', error);
            });
        }
        else {
            console.log('Invalid username or password');
        }
    };

    return (
        <View
            style={Styles.container}
        >
            <Text style = {[Styles.title, { margin: 20}]}>
                Register Screen
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
                title={'Register'}
                onPress={handleRegister}
            />

            <CustomButton
                style={[Styles.button, { position: 'absolute', bottom: 20, backgroundColor: 'darkviolet' }]}
                title={'to Login'}
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
};

export default RegisterScreen;
