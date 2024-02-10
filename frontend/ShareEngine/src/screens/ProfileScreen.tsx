import React from 'react';
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

const ellipseImage = require('../images/ellipse.png');

const ProfileScreen = ({}) => {
  const tmpDummyItems = dummyItems;
  const user = {
    name: 'あんどれー',
    bollowing: tmpDummyItems.slice(0, 5),
    lending: tmpDummyItems.slice(3, 7),
    history: undefined,
  };

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
      <ScrollView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={{marginBottom: 4, color: 'white'}}>
              貸しているアイテム数: {user.bollowing.length}
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
        <HorizontalList itemList={user.bollowing} />

        <Text style={styles.sectionTitle}>貸しているアイテム</Text>
        <HorizontalList itemList={user.lending} />

        <Text style={styles.sectionTitle}>履歴</Text>
        <HorizontalList itemList={user.history} />
      </ScrollView>
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
