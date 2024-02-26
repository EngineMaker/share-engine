import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
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
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (isLoading) {
            console.log('Loading:', isLoading);
        }
    }, [isLoading]);

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
        // loadingのアニメーションを表示


        console.log(username, password);
        // TODO: Call API to authenticate user
        if (username !== '' && password !== '') {
            console.log('Logging in');
            setIsLoading(true);
            await loginRequest (username, password).then((res) => {
                console.log('Logged in:', res);
                if (res.ok) {
                    res.json().then((data) => {
                        console.log('Logged in?:', data);
                        setSecureItem('user', username).then(() => {
                            setUser(username);
                        });
                        setSecureItem('token', data.access_token).then(() => {
                            setToken(data.access_token);
                        });
                        setSecureItem('userid', `${data.user_id}`).then(() => {
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
            }).finally(() => {
                setIsLoading(false);
            }
            );
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
        <View style={{flex: 1}}>
            <View style={Styles.container}>
                <View
                    style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 400 }}
                />
                <View
                    style={{ width: '80%', alignItems: 'center', justifyContent: 'center', marginTop: 0 }}
                >
                    <TextInput
                        style={Styles.loginInput}
                        value={username}
                        onChangeText={setUsername}
                        placeholder={'Username'}
                        autoCapitalize={'none'}
                    />
                    <TextInput
                        style={Styles.loginInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder={'Password'}
                        secureTextEntry={true}
                    />
                </View>
            <CustomButton
                style={{ width: 98, minHeight:30, marginTop: 10, backgroundColor: '#D7D7D7', borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}
                title={'Login'}
                textStyle={{ 
                    color: 'black',
                    fontSize: 20,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    textAlignVertical: 'center',
                    fontWeight: 'bold'
                }}
                onPress={handleLogin}
            />

            {/* <View>
                <Text>
                    {loggedIn ? 'Logged in as ' + user + ' with token ' + token + ' and user ID ' + userID : 'Not logged in'}
                </Text>
            </View> */}
            <View
                style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
            >
                <Text
                    style={{ color: 'white', fontSize: 20, fontStyle: 'italic', textAlign: 'center', textAlignVertical: 'center' }}
                >
                    Not registered? Click to register.
                </Text>
                <CustomButton
                    style={{ width: 98, minHeight:30, marginTop: 5, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}
                    title={'Sign up'}
                    textStyle={{ 
                        color: 'blue',
                        fontSize: 20,
                        textAlign: 'center',
                        fontStyle: 'italic',
                        textAlignVertical: 'center',
                    }}
                    onPress={() => navigation.navigate('Register')}
                />
            </View>


            {/* <CustomButton
                style={[Styles.button, { position: 'absolute', bottom: 20, backgroundColor: 'darkviolet' }]}
                title={'Logout'}
                onPress={handleLogout}
            /> */}
            </View>
            <Image
                source={require('../images/login_screen_image_bg.png')}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -5,
                    resizeMode: 'stretch'
                }}
            />
            <Image
                source={require('../images/login_screen_image_pentagon.png')}
                style={{
                    width: '60%',
                    height: '60%',
                    position: 'absolute',
                    alignSelf: 'center',
                    top: 100,
                    zIndex: -1,
                    resizeMode: 'contain'
                }}
            />
            <Image
                source={require('../images/Share_Engine.png')}
                style={{
                    width: '80%',
                    height: '50%',
                    position: 'absolute',
                    alignSelf: 'center',
                    top: -100,
                    zIndex: -1,
                    resizeMode: 'contain'
                }}
            />
            <Image
                source={require('../images/Sharing_is_Connecting.png')}
                style={{
                    width: '70%',
                    height: '50%',
                    position: 'absolute',
                    alignSelf: 'center',
                    top: -50,
                    zIndex: -1,
                    resizeMode: 'contain'
                }}
            />
            {isLoading && <View
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 5,
                }}
            >
                <ActivityIndicator
                    size="large"
                    color="white"
                    animating={true}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                />
            </View>}
        </View>
    );
};

export default LoginScreen;