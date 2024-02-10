import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import { ItemProps } from "../components/Item";
import { CustomButton } from "../components/SmallComponents";
import styles from "../Styles";
import Carousel from "react-native-reanimated-carousel";

export function DetailsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { itemObject } = route.params;
    const [item, setItem] = React.useState<ItemProps>(itemObject ? itemObject : {});

    console.log('ItemPropsObject:', itemObject);
    useEffect(() => {
        if (itemObject && !item.id) {
            setItem(itemObject);
            console.log('Item set:', item);
        }
    }, [itemObject]);

    return (
        <SafeAreaView style={{ flex: 1, 
            flexDirection: 'column',
        // alignItems: 'center', 
        justifyContent: 'flex-start' }}>
            {/* <Image
                source={{ uri: item.photos ? item.photos[0] : 'https://via.placeholder.com/150' }}
                style={{ width: "100%", height: "60%", resizeMode: 'contain' }}
            /> */}
            <Carousel
                loop
                width={400}
                height={400 / 2}
                // autoPlay={true}
                data={item.photos ? item.photos : ['https://via.placeholder.com/150']}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={{ uri: item }}
                            style={{ width: "100%", height: "100%", resizeMode: 'contain' }}
                        />
                    </View>
                )}
            />
            <View
                style={{ 
                    flex: 1, 
                    padding: 20,
                }}
            >
                <CustomButton
                    title={item.status ? 
                        '利用可能です' :
                        '現在借りています'}
                    style={{ 
                        width: 178,
                        height: 50,
                        borderRadius: 30,
                        backgroundColor: item.status ? 'green' : 'red',
                        alignContent: 'center',
                        justifyContent: 'center',
                     }}
                    textStyle={{
                        fontSize: 20,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 2 },
                        shadowOpacity: 0.5,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }}
                    onPress={() => console.log('Renting:', item.name)}
                />
                <Text style={[styles.cardText, {margin: 10}]}
                    >{item.name}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.cardText,{ margin: 5 }]}>{ item.price !== undefined ? item.price > 0 ? '¥' + item.price : 'Free' : 'Price not set' }</Text>
                    <Text style={[styles.cardText,{ margin: 5 }]}>👤{item.owner}</Text>
                </View>
                <Text
                    style={[styles.paragraph, { margin: 10 }]}
                    >{item.description}</Text>
                <View>
                    <Text
                        style={[styles.title, { margin: 10, fontSize: 20 }]}
                        >注意事項</Text>
                    <Text>{item.precaution}</Text>
                </View>
            </View>
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