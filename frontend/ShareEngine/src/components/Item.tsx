import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle, Image, GestureResponderEvent, Dimensions } from "react-native";
import styles from "../Styles";

const placeholder = "../images/Placeholder3.png";
const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const totalPadding = 40; // total padding in a row
const itemWidth = (screenWidth - totalPadding) / numColumns;

export type ItemStatus = "Available" | "Sold" | "Rented";


export interface ItemProps {
    name: string;
    status: ItemStatus;
    id?: string;
    price?: number;
    photo?: string;
}

export interface ItemCardProps {
    name: string;
    status: ItemStatus;
    id?: string;
    price?: number;
    photo?: string;
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
    photo,
    onPress,
    onLongPress,
    onEdit,
    onDelete,
}: ItemCardProps) => {
    return (
        <TouchableOpacity
            onPress={() => onPress({ name, status, price, id, photo } as ItemProps)}
            onLongPress={onLongPress}
            style={{ 
                width: itemWidth,
                height: itemWidth * 1.5,
                padding: 10,
                backgroundColor: 'lightgray',
                margin: 5,
                borderRadius: 10,
            }}
        >
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{status}</Text>
            <Image
                style={styles.image}
                source={photo ? { uri: photo } : require(placeholder)}
            />
            {price && <Text style={styles.subtitle}>{price} ¥</Text>}
            <View style={{ flexDirection : "row", justifyContent: "space-between" }}>
                <Button title="Edit" onPress={onEdit} />
                <Button title="Delete" onPress={onDelete} />
            </View>
        </TouchableOpacity>
    );
}
