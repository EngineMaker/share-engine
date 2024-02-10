import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Item, ItemProps, ItemStatus } from "../components/Item";
import { dummyItems } from "../dummyItems";

export const handlePress = (itemID: string) => {
    console.log("Item " + itemID + " Pressed");
}

export const handleLongPress = () => {
    console.log("Long Pressed");
}

export const handleEdit = () => {
    console.log("Edit");
}

export const handleDelete = () => {
    console.log("Delete");
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const numColumns = 2;
    const renderItem = ({ item }: { item: ItemProps }) => (
        <Item
            name={item.name}
            status={item.status}
            price={item.price}
            id={item.id}
            onPress={() => item.onPress(item.id!)} // Ensure item.id is always a string
            onLongPress={item.onLongPress}
            onEdit={item.onEdit}
            onDelete={item.onDelete}
        />
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <FlatList
                data={dummyItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
                contentContainerStyle={{
                    justifyContent: 'space-between',
                }}
                style={{ width: "95%" }}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginStack', { screen: 'Login' })}
                style={{ 
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: 0,
                    left: 5,
                    padding: 5, borderRadius: 5,}}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;