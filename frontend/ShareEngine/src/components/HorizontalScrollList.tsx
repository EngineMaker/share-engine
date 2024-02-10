import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {ItemProps} from '../components/Item';

export const HorizontalList = ({
  itemList,
}: {
  itemList: ItemProps[] | undefined;
}) => {
  return (
    <View style={styles.background}>
      {!itemList || itemList.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={styles.centeredText}>アイテムがありません</Text>
        </View>
      ) : (
        <ScrollView horizontal={true} contentContainerStyle={styles.itemList}>
          {itemList.map((item, index) => {
            return (
              <View key={index}>
                <Image
                  source={{
                    uri:
                      item.photos && item.photos.length > 0
                        ? item.photos[0]
                        : 'https://placehold.jp/bdc1ff/ffffff/150x150.png',
                  }}
                  style={styles.itemImage}
                />
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContent: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    fontSize: 20,
    textAlign: 'center',
  },

  background: {
    backgroundColor: '#cccccc',
    paddingVertical: 10,
    marginHorizontal: -30,
    // iOS用の影設定
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#333',
    shadowRadius: 4,
    shadowOpacity: 0.8,
    // Android用の影設定
    elevation: 5,
  },
  itemList: {
    marginHorizontal: 20,
  },

  itemImage: {
    width: 100,
    height: 100,
    marginRight: 20,
    resizeMode: 'cover',
  },
});
