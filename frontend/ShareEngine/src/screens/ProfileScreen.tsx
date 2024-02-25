import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {HorizontalList} from '../components/HorizontalScrollList';
import {dummyItems} from '../dummyItems';
import { ItemDetailedProps, ItemProps } from '../components/Item';
import { fetchUserDetailsRequest, getUserID, handleLogout, removeSecureItem } from '../Utils';
import { CustomButton } from '../components/SmallComponents';
import { useFocusEffect } from '@react-navigation/native';

const ellipseImage = require('../images/ellipse.png');

interface User {
  name: string;
  own_items: ItemDetailedProps[];
  rent_items: ItemDetailedProps[];
  // history: ItemProps[];
}

const ProfileScreen = (navigation: any) => {
  const tmpDummyItems = dummyItems;
  const dummyUser = {
    name: 'ヤマザキ',
    borrowing: tmpDummyItems.slice(0, 5),
    lending: tmpDummyItems.slice(3, 7),
    history: [] as ItemProps[],
  };
  const [user, setUser] = React.useState<User>({
    name: 'Loading...',
    own_items: [],
    rent_items: [],
    // history: [],
  });
  const name = user.name;

  useFocusEffect(
    React.useCallback(() => {
      handleGetUser();
      return () => {};
    }, [])
  );

  const handleGetUser = async () => {
    console.log('Fetching user');
    const user_id = await tryGetUserID();
    // const user_id = "1";
    console.log('Fetching user with ID:', user_id);
    // if (user_id === '') {
    //   console.log('User ID not found');
    //   // handleLogout(navigation);
    //   return;
    // }
    await fetchUserDetailsRequest(user_id).then((res) => {
      console.log('Fetched user:', res);
      setUser({
        name: res.name,
        own_items: res.own_items,
        rent_items: res.rent_items,
        // history: [] as ItemProps[],
      });
    }
    ).catch((error) => {
      console.error('Error fetching user:', error);
    });
  }
  const tryGetUserID = async () => {
    try {
      const user_id = await getUserID();
      return user_id;
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  }
  
  const handleLogout = async () => {
    console.log('Logging out');
    await removeSecureItem('userid');
    await removeSecureItem('token');
    await removeSecureItem('user');
    navigation.navigation.navigate('LoginStack', { screen: 'Login' });
    console.log('User logged out');
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundImageContainer}>
        <Image
          source={ellipseImage}
          resizeMode="stretch"
          style={{
            width: '100%',
            height: 190,
            position: 'absolute',
            top: 0,
          }}
        />
      </View>
      <ScrollView style={styles.container}
        scrollEnabled={false}
      >
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={{marginBottom: 4, color: 'white'}}>
              Own Items: {user.own_items.length}
            </Text>
            <Text style={{color: 'white'}}>
              借りているアイテム数: {user.rent_items.length}
            </Text>
          </View>
          {/* <Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={styles.profilePic}
          /> */}
        </View>

        <Text style={styles.sectionTitle}>My Items</Text>
        <HorizontalList itemList={user.own_items} navigation={navigation} />

        <Text style={styles.sectionTitle}>借りているアイテム</Text>
        <HorizontalList itemList={user.rent_items} navigation={navigation} />

        {/* <Text style={styles.sectionTitle}>履歴</Text>
        <HorizontalList itemList={user.history} /> */}
      </ScrollView>
      {/* <CustomButton
        style={{
          position: 'absolute',
          bottom: 20,
          backgroundColor: 'darkviolet',
          width: '100%',
        }}
        title={'ユーザ情報を取得'}
        onPress={tryGetUserID}
      /> */}
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={{ 
                backgroundColor: 'lightgreen',
                position: 'absolute',
                top: 40,
                right: 15,
                padding: 5, borderRadius: 5,}}
          >
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}
            >Logout</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImageContainer: {
    position: 'absolute',
    width: '100%',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  container: {
    padding: 30,
  },
  userInfoSection: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 14,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});

export default ProfileScreen;
