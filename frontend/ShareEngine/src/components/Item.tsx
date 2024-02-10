import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle, Image, GestureResponderEvent, Dimensions } from "react-native";
import styles from "../Styles";

const placeholder = "../images/Placeholder3.png";
const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const totalPadding = 40; // total padding in a row
const itemWidth = (screenWidth - totalPadding) / numColumns;


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

export interface ItemDetailedProps {
    name: string;
    available: boolean;
    id: string;
    price: number;
    photos?: string[];
    image_url1?: string | null;
    image_url2?: string | null;
    image_url3?: string | null;
    image_url4?: string | null;
    owner_id: string;
    description: string;
    precaution?: string;
    days?: number;
    status?: boolean;
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
    owner,
    onPress,
    onLongPress,
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
            <View
                style={{
                    width: "100%",
                    height: "90%",
                    overflow: 'hidden',
                }}
            >
                <Image
                    style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                    source={photos ? { uri: photos[0] } : require(placeholder)}
                />
                <View style={{ position: 'absolute', backgroundColor: status ? 'transparent' : 'rgba(0, 0, 0, 0.5)', width: "100%", height: "100%" }} />
                {status ? null : 
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>貸出中</Text>
                    </View>
                }
                <Text style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: 15, fontWeight: 'bold', padding: 5 }}>{name}</Text>
            </View>
            <View
                style={{
                    width: "100%",
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                    paddingHorizontal: 5,
                }}
                >
                <Text style={styles.subtitle}>{owner}</Text>
                {price === 0 ? (
                    <Text style={styles.subtitle}>Free</Text>
                ) : (
                    <Text style={styles.subtitle}>¥{price}/日</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
