import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';

export const CustomButton = ({
  title,
  style,
  textStyle,
  onPress,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        style || {
          backgroundColor: 'lightblue',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }
      }
      activeOpacity={0.7}>
      <Text style={textStyle || {fontSize: 20, color: 'black'}}>{title}</Text>
    </TouchableOpacity>
  );
};

// 数字だけの入力を受け付けるTextInput
export const NumberInput = ({
  value,
  onChangeText,
  placeholder,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const onChange = (text: string) => {
    // 円マークをテキストの先頭に付ける
    if (text.includes('¥')) {
      onChangeText(text);
    } else {
      onChangeText('¥' + text);
    }
  };

  return (
    <TextInput
      style={
        style || {
          height: 40,
          width: '90%',
          margin: 12,
          borderWidth: 1,
          padding: 10,
        }
      }
      value={value}
      onChangeText={text => onChange(text)}
      placeholder={placeholder}
      keyboardType="numeric"
    />
  );
};
