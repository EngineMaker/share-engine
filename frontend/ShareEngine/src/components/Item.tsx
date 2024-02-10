import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle, Image } from "react-native";
import styles from "../Styles";

export type ItemStatus = "Available" | "Sold" | "Rented";

export interface ItemProps {
    name: string;
    status: ItemStatus;
    price?: number;
    onPress: () => void;
    onLongPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
}
export const Item = ({
    name,
    status,
    price,
    onPress,
    onLongPress,
    onEdit,
    onDelete,
}: ItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.cardContainer}
        >
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{status}</Text>
            <Image
                style={styles.image}
                source={require('../images/Placeholder.png')}
            />
            {price && <Text style={styles.subtitle}>${price}</Text>}
            <View style={{ flexDirection : "row", justifyContent: "space-between" }}>
                <Button title="Edit" onPress={onEdit} />
                <Button title="Delete" onPress={onDelete} />
            </View>
        </TouchableOpacity>
    );
}
