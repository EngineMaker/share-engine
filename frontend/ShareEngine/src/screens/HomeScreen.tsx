import React from "react";
import { View, Text, Button, Touchable, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Item, ItemProps, ItemStatus } from "../components/Item";

const handlePress = () => {
    console.log("Pressed");
}

const handleLongPress = () => {
    console.log("Long Pressed");
}

const handleEdit = () => {
    console.log("Edit");
}

const handleDelete = () => {
    console.log("Delete");
}

const dummyItems: ItemProps[] = [
    {
        name: "Item 1",
        status: "Available",
        price: 100,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 2",
        status: "Sold",
        price: 200,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 3",
        status: "Rented",
        price: 300,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 4",
        status: "Available",
        price: 400,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 5",
        status: "Sold",
        price: 500,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 6",
        status: "Rented",
        price: 600,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 7",
        status: "Available",
        price: 700,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 8",
        status: "Sold",
        price: 800,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 9",
        status: "Rented",
        price: 900,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
    {
        name: "Item 10",
        status: "Available",
        price: 1000,
        onPress: handlePress,
        onLongPress: handleLongPress,
        onEdit: handleEdit,
        onDelete: handleDelete,
    },
];

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const renderItem = ({ item }: { item: ItemProps }) => <Item {...item} />;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <FlatList
                data={dummyItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                contentContainerStyle={{
                    justifyContent: 'space-between',
                }}
                style={{ width: "95%" }}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginStack', { screen: 'Login' })}
                style={{ 
                    backgroundColor: 'lightblue',
                    position: 'absolute',
                    top: 0,
                    left: 20,
                    padding: 10, borderRadius: 5, marginTop: 20 }}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;