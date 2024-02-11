import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import Styles from '../Styles';
import { CustomButton } from '../components/SmallComponents';
import { existsSecureItem, setSecureItem, removeSecureItem, getSecureItem, loginRequest, getUserID } from '../Utils';
// import { getSecureItem, setSecureItem, existsSecureItem } from '../Utils';

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [userID, setUserID] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState('no token');

    useEffect(() => {
        const checkLogin = async () => {
            console.log('Checking login');
            const loggedIn = await existsSecureItem('user');
            const isToken = await existsSecureItem('token');
            setLoggedIn(loggedIn || false);
            setUser(await getSecureItem('user'));
            setToken(isToken ? await getSecureItem('token') : 'no token');
            setUserID(await getSecureItem('userid'));
        };
        checkLogin();
    }, []);

    // useEffect(() => {
    //     const checkLogin = async () => {
    //         console.log('Checking login');
    //         const loggedIn = await existsSecureItem('user');
    //         console.log('Logged in:', loggedIn);
    //         if (loggedIn) {
    //             // navigation.navigate('HomeStack', { screen: 'Home' });
    //         }
    //     };
    //     checkLogin();
    // }, []);

    const handleLogin = async () => {
        console.log(username, password);
        // TODO: Call API to authenticate user
        if (username !== '' && password !== '') {
            console.log('Logging in');
            await loginRequest (username, password).then((res) => {
                console.log('Logged in:', res);
                if (res.ok) {
                    res.json().then((data) => {
                        console.log('Logged in:', data);
                        setSecureItem('user', username).then(() => {
                            setUser(username);
                        });
                        setSecureItem('token', data.access_token).then(() => {
                            setToken(data.access_token);
                        });
                        setSecureItem('userid', data.user_id).then(() => {
                            setUserID(data.user_id.toString());
                        });
                        setLoggedIn(true);
                        navigation.navigate('HomeTab', { screen: 'Home' });
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

    const handleLogout = async () => {
        console.log('Logging out');
        setLoggedIn(false);
        setUser('');
        setToken('');
        await removeSecureItem('userid');
        await removeSecureItem('token');
        console.log('User logged out');
    }

    return (
        <View
            style={Styles.container}
        >
            <Text style = {[Styles.title, { margin: 20}]}>
                Login Screen
            </Text>
            <TextInput
                style={Styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder={'Username'}
                autoCapitalize={'none'}
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

            <View>
                <Text>
                    {loggedIn ? 'Logged in as ' + user + ' with token ' + token + ' and user ID ' + userID : 'Not logged in'}
                </Text>
            </View>
            <CustomButton
                style={[Styles.button, { position: 'absolute', bottom: 100}]}
                title={'To Register'}
                onPress={() => navigation.navigate('Register')}
            />

            <CustomButton
                style={[Styles.button, { position: 'absolute', bottom: 20, backgroundColor: 'darkviolet' }]}
                title={'Logout'}
                onPress={handleLogout}
            />
        </View>
    );
};

export default LoginScreen;