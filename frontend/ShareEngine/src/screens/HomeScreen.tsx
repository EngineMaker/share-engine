import React, { useEffect } from "react";
import { View, Text, Button, Touchable, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from "react-native";
import { ItemCard, ItemCardProps, ItemProps } from "../components/Item";
import { dummyItems } from "../dummyItems";
import { fetchItemDetailsRequest, fetchItemsRequest, fetchUserRequest } from "../Utils";
import { CustomButton } from "../components/SmallComponents";


const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [items, setItems] = React.useState<ItemProps[]>(dummyItems);
    const [newItems, setNewItems] = React.useState<ItemProps[]>([]);
    const numColumns = 2;

    useEffect(() => {
        console.log('items:', items);
    }, [items]);

    useEffect(() => {
        if (newItems.length > 0) {
            console.log('New items:', newItems);
            // setItems([...items, ...newItems]);
            setItems([
                ...newItems.map((item: any) => ({
                    name: item.name,
                    status: item.available,
                    price: item.price,
                    id: item.id,
                    photos: [item.image_url1, item.image_url2, item.image_url3, item.image_url4].filter(Boolean),
                    owner: item.owner_id ? item.owner_id : 'unknown',
                    renter: item.renter_id ? item.renter_id : '',
                    description: item.description,
                }))
            ]);
        }
    }, [newItems]);

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
    const handlePress = async (item : ItemProps) => {
        console.log('Pressed item with ID:', item.id);
        console.log('Item:', item);
        
        if (item.id !== undefined) {
            await fetchItemDetailsRequest(item.id).then((res) => {
                console.log('Fetched item details:', res);
                return res;
            }).catch((error) => {
                console.error('Error fetching item details:', error);
            }).then((itemDetails) => {
                navigation.navigate('Details', { itemObject: itemDetails });
                // console.log('Navigating to Details');
            });
        }
            // navigation.navigate('Details', { itemObject: item });
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
                    top: 40,
                    left: 15,
                    padding: 5, borderRadius: 5,}}
            >
                <Text>Login</Text>
            </TouchableOpacity>
            <View style={{ position: 'absolute', top: 30, right: 15 }}>
            <CustomButton
                title={'debug fetch items'}
                onPress={async () => {
                    await fetchItemsRequest()
                    .catch((error) => {
                        console.error('Error fetching items:', error);
                    })
                    .then((res) => {
                        console.log('Fetched items:', res);
                        setNewItems(res);
                    });
                }}
            />
            <CustomButton
                title={'set dummy items'}
                onPress={() => {
                    setItems(dummyItems);
                }
            }
            />
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen;