import React, { useEffect } from "react";
import { View, Text, Button, Touchable, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from "react-native";
import { ItemCard, ItemCardProps, ItemProps, ItemStatus } from "../components/Item";
import { dummyItems } from "../dummyItems";


const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [items, setItems] = React.useState<ItemProps[]>(dummyItems);
    const numColumns = 2;

    useEffect(() => {
        setItems(dummyItems);
    }, [dummyItems]);

    const renderItem = ({ item }: { item: ItemProps }) => (
        <ItemCard
            name={item.name}
            status={item.status}
            price={item.price}
            id={item.id}
            photos={item.photos}
            owner={item.owner}
            // onPress={(itemID: string) => handlePress(itemID)}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            onEdit={() => handleEdit(item.id ?? '')}
            onDelete={() => handleDelete(item.id ?? '')}         />
    );
    const handlePress = (item : ItemProps) => {
        console.log('Pressed item with ID:', item.id);
        console.log('Item:', item);
        navigation.navigate('Details', { itemObject: item });
        // navigation.navigate('Details', { itemObject: JSON.stringify(item) });
    };

    const handleLongPress = (item : ItemProps) => {
        console.log('Long pressed item with ID:', item);
    };

    const handleEdit = (itemID: string) => {
        console.log('Editing item with ID:', itemID);
    };

    const handleDelete = (itemID: string) => {
        console.log('Deleting item with ID:', itemID);
    };

    return (
        <SafeAreaView 
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <FlatList
                data={items}
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
                    top: 30,
                    left: 15,
                    padding: 5, borderRadius: 5,}}
            >
                <Text>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default HomeScreen;