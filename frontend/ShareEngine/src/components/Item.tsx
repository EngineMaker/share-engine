import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle, Image, GestureResponderEvent, Dimensions } from "react-native";
import styles from "../Styles";

const placeholder = "../images/Placeholder3.png";
const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const totalPadding = 40; // total padding in a row
const itemWidth = (screenWidth - totalPadding) / numColumns;

export const ItemStatus = {
    "Available": true,
    "Rented": false,
}


export interface ItemProps {
    name: string;
    status: boolean;
    id?: string;
    price?: number;
    photos?: string[];
    owner: string;
    description: string;
    precaution?: string;
    days?: number;
}

export interface ItemCardProps {
    name: string;
    status: boolean;
    id?: string;
    price?: number;
    photos?: string[];
    owner: string;
    onPress: (item: ItemProps) => void;
    onLongPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const ItemCard = ({
    name,
    status,
    price,
    id,
    photos,
    onPress,
    onLongPress,
    onEdit,
    onDelete,
}: ItemCardProps) => {
    return (
        <TouchableOpacity
            onPress={() => onPress({ name, status, price, id, photos } as ItemProps)}
            onLongPress={onLongPress}
            style={{ 
                width: itemWidth,
                height: itemWidth * 1.5,
                backgroundColor: 'lightgray',
                margin: 5,
                borderRadius: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            {/* <Text style={styles.title}>{name}</Text> */}
            <Image
                style={styles.image}
                source={photos ? { uri: photos[0] } : require(placeholder)}
            />
            <Text style={styles.subtitle}>{status ? "Available" : "Rented"}</Text>
            {price === 0 ? (
                <Text style={styles.subtitle}>Free</Text>
            ) : (
                <Text style={styles.subtitle}>{price} ¥</Text>
            )}
            {/* <View style={{ flexDirection : "row", justifyContent: "space-between" }}>
                <Button title="Edit" onPress={onEdit} />
                <Button title="Delete" onPress={onDelete} />
            </View> */}
        </TouchableOpacity>
    );
}
