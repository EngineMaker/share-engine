import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const cameraIcon = require('../images/cameraIcon.png');

const SquareImage = ({isMostLeft}: {isMostLeft: boolean}) => {
  return (
    <View style={styles.squareImage}>
      {isMostLeft && <Image source={cameraIcon} style={styles.cameraIcon} />}
    </View>
  );
};

export const UploadImages = ({
  images,
  setImages,
}: {
  images: string[] | null;
  setImages: React.Dispatch<React.SetStateAction<string[] | null>>;
}) => {
  let emptyIndex = 4;

  for (let i = 0; i < 3; i++) {
    if (images && !images[i]) {
      emptyIndex = i;
      break;
    }
  }

  if (images === null) {
    emptyIndex = 0;
  }

  const pickImage = async (index: number) => {
    if (index > emptyIndex) {
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 3,
    });

    if (result.assets) {
      const newUris = result.assets.map(asset => asset.uri);
      setImages(newUris as string[]);
    }
  };

  return (
    <View style={styles.background}>
      <TouchableOpacity
        onPress={() => {
          pickImage(0);
        }}
        style={styles.itemImage}>
        {images ? (
          images[0] ? (
            <Image style={styles.itemImage} source={{uri: images[0]}} />
          ) : (
            <SquareImage isMostLeft={emptyIndex === 0} />
          )
        ) : (
          <SquareImage isMostLeft={emptyIndex === 0} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          pickImage(1);
        }}
        style={styles.itemImage}>
        {images ? (
          images[1] ? (
            <Image style={styles.itemImage} source={{uri: images[1]}} />
          ) : (
            <SquareImage isMostLeft={emptyIndex === 1} />
          )
        ) : (
          <SquareImage isMostLeft={emptyIndex === 1} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          pickImage(2);
        }}
        style={styles.itemImage}>
        {images ? (
          images[2] ? (
            <Image style={styles.itemImage} source={{uri: images[2]}} />
          ) : (
            <SquareImage isMostLeft={emptyIndex === 2} />
          )
        ) : (
          <SquareImage isMostLeft={emptyIndex === 2} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraIcon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },

  squareImage: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
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
