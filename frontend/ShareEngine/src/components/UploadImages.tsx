import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker';

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
  setImageFiles,
}: {
  images: string[] | null;
  setImages: React.Dispatch<React.SetStateAction<string[] | null>>;
  setImageFiles: React.Dispatch<React.SetStateAction<FormDataValue[] | null>>;
}) => {
  const options = ['写真を撮る', 'フォトライブラリから選択', 'キャンセル'];

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

    let result: ImagePickerResponse | undefined;

    const buttonIndex = await new Promise<number>(resolve => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
          cancelButtonTintColor: 'red',
        },
        (buttonIndex: number) => {
          resolve(buttonIndex);
        },
      );
    });

    if (buttonIndex === 0) {
      result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
        quality: 1,
        cameraType: 'front',
      });
    } else if (buttonIndex === 1) {
      result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 3,
      });
    }

    if (result === undefined) {
      return;
    }

    if (result.assets) {
      const newUris = result.assets.map(asset => asset.uri);
      const newFiles = result.assets.map<Promise<FormDataValue>>(async asset => {
        console.log('asset.uri: ', asset.uri);
        return {
          name: asset.fileName!,
          type: asset.type!,
          uri: asset.uri!,
        };
      });

      const resolvedFiles = await Promise.all(newFiles);
      setImageFiles(resolvedFiles);
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
