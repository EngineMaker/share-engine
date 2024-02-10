import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import { ItemProps } from "../components/Item";
import { CustomButton } from "../components/SmallComponents";

export function DetailsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { itemObject } = route.params;
    const [item, setItem] = React.useState<ItemProps>(itemObject ? itemObject : {});

    console.log('ItemPropsObject:', itemObject);
    useEffect(() => {
        if (itemObject && !item.id) {
            // setItem(JSON.parse(itemObject));
            setItem(itemObject);
            console.log('Item set:', item);
        }
    }, [itemObject]);

    return (
        <SafeAreaView style={{ flex: 1, 
            flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'flex-start' }}>
            <Image
                source={{ uri: item.photo || 'https://reactnative.dev/img/tiny_logo.png' }}
                style={{ width: "100%", height: "60%", resizeMode: 'contain' }}
            />
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
            <Text>{item.status}</Text>
            <CustomButton
                title="<"
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', top: 50, left: 20 }}
                textStyle={{ fontSize: 40, color: '#FFFFFF', fontWeight: 'bold', shadowColor: 'black', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5 }}
            />
            <CustomButton
                title="Debug"
                onPress={() => console.log('Item:', item)}
                style={{ position: 'absolute', top: 50, right: 20 }}
                textStyle={{ fontSize: 20, color: '#FFFFFF', fontWeight: 'bold', shadowColor: 'black', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5 }}
            />
        </SafeAreaView>
    );
}