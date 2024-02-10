import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {HorizontalList} from '../components/HorizontalScrollList';
import {dummyItems} from '../dummyItems';
import { ItemProps } from '../components/Item';
import { fetchUserRequest, getUserID, handleLogout } from '../Utils';
import { CustomButton } from '../components/SmallComponents';

const ellipseImage = require('../images/ellipse.png');

interface User {
  name: string;
  borrowing: ItemProps[];
  lending: ItemProps[];
  history: ItemProps[];
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
    name: '',
    borrowing: [],
    lending: [],
    history: [],
  });
  const name = user.name;

  useEffect(() => {
    if (user.name === '') {
      handleGetUser();
    }
  }, []);

  const handleGetUser = async () => {
    // TODO: Get user ID from endpoint
    // const user_id = await getUserID();
    const user_id = "3";
    console.log('Fetching user with ID:', user_id);
    // if (user_id === '') {
    //   console.log('User ID not found');
    //   // handleLogout(navigation);
    //   return;
    // }
    await fetchUserRequest(user_id).then((res) => {
      console.log('Fetched user:', res);
      setUser({
        name: res.name,
        borrowing: res.own_items,
        lending: res.rent_items,
        history: [] as ItemProps[],
      });
    }
    ).catch((error) => {
      console.error('Error fetching user:', error);
    });
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
              貸しているアイテム数: {user.borrowing.length}
            </Text>
            <Text style={{color: 'white'}}>
              借りているアイテム数: {user.lending.length}
            </Text>
          </View>
          <Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={styles.profilePic}
          />
        </View>

        <Text style={styles.sectionTitle}>借りているアイテム</Text>
        <HorizontalList itemList={user.borrowing} />

        <Text style={styles.sectionTitle}>貸しているアイテム</Text>
        <HorizontalList itemList={user.lending} />

        <Text style={styles.sectionTitle}>履歴</Text>
        <HorizontalList itemList={user.history} />
      </ScrollView>
      {/* <CustomButton
        style={{
          position: 'absolute',
          bottom: 20,
          backgroundColor: 'darkviolet',
          width: '100%',
        }}
        title={'ユーザ情報を取得'}
        onPress={handleGetUser}
      /> */}
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
