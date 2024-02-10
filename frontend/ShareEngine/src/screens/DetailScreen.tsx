import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Image, Dimensions, Animated, Modal, TouchableWithoutFeedback } from "react-native";
import { ItemProps } from "../components/Item";
import { CustomButton } from "../components/SmallComponents";
import styles from "../Styles";
import Carousel from "react-native-reanimated-carousel";
import { ScrollView, TextInput } from "react-native-gesture-handler";

export function DetailsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { itemObject } = route.params;
    const [rentalItem, setRentalItem] = React.useState<ItemProps>(itemObject ? itemObject : {});
    const screenWidth = Dimensions.get('window').width;
    const [isRentOverlayVisible, setIsRentOverlayVisible] = React.useState(false);
    const overlayY = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;
    const overlayOpacity = React.useRef(new Animated.Value(0)).current;
    const daysArray = Array.from({length: 30}, (_, i) => i + 1);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(overlayY, {
                toValue: isRentOverlayVisible ? 0 : Dimensions.get('window').height,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(overlayOpacity, {
                toValue: isRentOverlayVisible ? 1 : 0,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
    }, [isRentOverlayVisible]);

    console.log('ItemPropsObject:', itemObject);
    useEffect(() => {
        if (itemObject && !rentalItem.id) {
            setRentalItem(itemObject);
            console.log('Item set:', rentalItem);
        }
    }, [itemObject]);

    return (
        <SafeAreaView style={{ flex: 1, 
            flexDirection: 'column',
            justifyContent: 'flex-start' }}>
            <ScrollView>
                <Carousel
                    loop={false}
                    width={screenWidth}
                    height={screenWidth * 0.75}
                    // autoPlay={true}
                    data={rentalItem.photos ? rentalItem.photos : ['https://via.placeholder.com/150']}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={{ width: "100%", height: "100%", resizeMode: 'cover' }}
                        />
                    )}
                />
                <View
                    style={{ 
                        flex: 1, 
                        padding: 20,
                    }}
                >
                    {/* <CustomButton
                        title={item.status ? 
                            '利用可能です' :
                            '現在借りています'}
                        style={{ 
                            width: 178,
                            height: 40,
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
                    /> */}
                    <Text style={[styles.cardText, {marginVertical: 3}]}
                        >{rentalItem.name}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.cardText,{ marginVertical: 1 }]}>{ rentalItem.price !== undefined ? rentalItem.price > 0 ? '¥' + rentalItem.price + "/日" : 'Free' : 'Price not set' }</Text>
                        <Text style={[styles.cardText,{ marginVertical: 1 }]}>👤{rentalItem.owner}</Text>
                    </View>
                    <Text
                        style={[styles.paragraph, { marginVertical: 5 }]}
                        >{rentalItem.description}</Text>
                    <View>
                        <Text
                            style={[styles.title, { marginVertical: 5, fontSize: 20 }]}
                            >注意事項</Text>
                        <View
                            style={{ 
                                padding: 10,
                                backgroundColor: 'lightgray',
                                borderRadius: 8,
                                marginVertical: 5,
                            }}
                        >
                            <Text>{rentalItem.precaution}</Text>
                        </View>
                    </View>
                    <CustomButton
                        title={rentalItem.status ? '借りる詳細を決定する' : '現在貸出中です'}
                        style={[
                            styles.button,
                            {
                                backgroundColor: rentalItem.status ? '#70B2FF' : '#909090',
                                padding: 10,
                                borderRadius: 15,
                                marginTop: 20,
                                width: 214,
                                alignSelf: 'center',
                                height: 54,
                            }
                        ]}
                        textStyle={{
                            color: '#FFFFFF',
                            fontSize: 19,
                            fontWeight: 'bold',
                            shadowColor: 'black',
                            shadowOffset: { width: 2, height: 2 },
                            shadowOpacity: 0.5,
                        }}
                        onPress={() => {
                            if (rentalItem.status) {
                                setIsRentOverlayVisible(!isRentOverlayVisible);
                            }
                        }}
                    />
                </View>
                <CustomButton
                    title="<"
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', top: 20, left: 20 }}
                    textStyle={{ fontSize: 40, color: '#FFFFFF', fontWeight: 'bold', shadowColor: 'black', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5 }}
                />
                {/* <CustomButton
                    title="Debug"
                    onPress={() => console.log('Item:', rentalItem)}
                    style={{ position: 'absolute', top: 20, right: 20 }}
                    textStyle={{ fontSize: 20, color: '#FFFFFF', fontWeight: 'bold', shadowColor: 'black', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5 }}
                /> */}
            </ScrollView>
            <Modal
                animationType="none"
                transparent={true}
                visible={isRentOverlayVisible}
                onRequestClose={() => {
                    setIsRentOverlayVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setIsRentOverlayVisible(false)}>
                    <Animated.View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // This is the semi-transparent background
                        justifyContent: 'flex-end',
                        opacity: overlayOpacity,
                    }}>
                        <TouchableWithoutFeedback>
                            <Animated.View style={{ 
                                transform: [{ translateY: overlayY }],
                                height: '50%', 
                                backgroundColor: 'white',
                                borderTopStartRadius: 25,
                                borderTopEndRadius: 25,
                                padding: 20,
                                paddingHorizontal: 30,
                            }}>
                                <Text style={[styles.cardText, {marginVertical: 3, fontWeight: 'bold', alignSelf: 'center'}]}
                                    >{rentalItem.name}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , padding: 10, paddingHorizontal: 30,}}>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>借りる相手</Text>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>{rentalItem.owner}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , padding: 10, paddingHorizontal: 30, alignItems: 'center',}}>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>借りる日数</Text>
                                    <Carousel
                                        loop={false}
                                        width={100}
                                        height={50}
                                        snapEnabled={true}
                                        vertical={true}
                                        style={{ backgroundColor: 'white', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black' }}
                                        data={daysArray}
                                        defaultIndex={rentalItem.days ? rentalItem.days - 1 : 0}
                                        onSnapToItem={(index) => setRentalItem({ ...rentalItem, days: index + 1 })}
                                        scrollAnimationDuration={200}
                                        renderItem={({ item }) => (
                                            <Text
                                                style={[styles.cardText,{ marginVertical: 1, textAlign: 'center', paddingTop: 9, paddingHorizontal: 10,textAlignVertical: 'center', alignSelf: 'center',}]}
                                                selectable={false}
                                            >
                                                {item}日
                                            </Text>
                                        )}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , padding: 10, paddingHorizontal: 30,}}>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>返却日</Text>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>{rentalItem.days ? new Date(Date.now() + rentalItem.days * 24 * 60 * 60 * 1000).toLocaleDateString() : '未設定'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , padding: 10, paddingHorizontal: 30, alignContent: 'center', alignItems: 'center',}}>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>合計</Text>
                                    {rentalItem.price ? rentalItem.price > 0 &&
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Text style={[styles.cardText,{ marginVertical: 1, fontWeight: 'bold', fontSize: 33
                                         }]}>¥{rentalItem.days ? rentalItem.days * (rentalItem.price ?? 0) : 0}</Text>
                                        <Text style={[styles.cardText,{ marginVertical: 1 }]}>¥{rentalItem.price ?? 0}/日</Text>
                                    </View>
                                    :
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>無料</Text>
                                    }
                                </View>
                                <CustomButton
                                    title="借りる"
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: '#70B2FF',
                                            padding: 10,
                                            borderRadius: 15,
                                            marginTop: 20,
                                            width: 214,
                                            alignSelf: 'center',
                                            height: 54,
                                        }
                                    ]}
                                    textStyle={{
                                        color: '#FFFFFF',
                                        fontSize: 19,
                                        fontWeight: 'bold',
                                        shadowColor: 'black',
                                        shadowOffset: { width: 2, height: 2 },
                                        shadowOpacity: 0.5,
                                    }}
                                    onPress={() => {
                                        console.log('Renting:', rentalItem);
                                        setIsRentOverlayVisible(false);
                                    }}
                                />
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}