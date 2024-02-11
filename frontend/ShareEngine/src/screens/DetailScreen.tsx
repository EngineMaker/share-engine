import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Image, Dimensions, Animated, Modal, TouchableWithoutFeedback } from "react-native";
import { ItemDetailedProps, ItemProps } from "../components/Item";
import { CustomButton } from "../components/SmallComponents";
import styles from "../Styles";
import Carousel from "react-native-reanimated-carousel";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { fetchItemDetailsRequest, getUserID, rentItemRequest, returnItemRequest } from "../Utils";

export function DetailsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { itemObject } = route.params;
    console.log('r:', route.params);
    console.log('Item:', itemObject);
    const [rentalItem, setRentalItem] = React.useState<ItemDetailedProps>(itemObject ? itemObject : {
        id: 0,
        name: 'Loading...',
        price: 0,
        description: 'Loading...',
        precaution: 'Loading...',
        owner_id: 0,
        renter_id: 0,
        available: false,
        photos: [],
        days: 1,
    });
    const screenWidth = Dimensions.get('window').width;
    const [isRentOverlayVisible, setIsRentOverlayVisible] = React.useState(false);
    const overlayY = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;
    const overlayOpacity = React.useRef(new Animated.Value(0)).current;
    const daysArray = Array.from({length: 30}, (_, i) => i + 1);
    const photos = rentalItem ? rentalItem.photos ? rentalItem.photos : [rentalItem.image_url1, rentalItem.image_url2, rentalItem.image_url3, rentalItem.image_url4].filter(Boolean) : [];
    const days = rentalItem ? rentalItem.days ? rentalItem.days : 1 : 1;
    const [isRenter, setIsRenter] = React.useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const userID = await getUserID();
            const newIsRenter = rentalItem.renter_id == userID;
            setIsRenter(newIsRenter);
            console.log('Renter:', rentalItem.renter_id, 'User:', userID, 'isRenter:', newIsRenter);
        };
        fetchData();
    }, [rentalItem]);

    useEffect(() => {
        // console.log('useEFFECT:', rentalItem);
        const fetchData = async () => {
            console.log('FFFFetching item details:', itemObject.id);
                if (itemObject.id !== undefined) {
                console.log('FEeEEEetching item details:', itemObject.id);
                try {
                    const itemDetails = await fetchItemDetailsRequest(itemObject.id);
                    console.log('Fetched item details:', itemDetails);
                    setRentalItem(itemDetails);
                } catch (error) {
                    console.error('Error fetching item details:', error);
                }
            }
        };
        fetchData();
    }, []);
    
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

    useEffect(() => {
        if (photos) {
            console.log('photos set:', photos);
        }
    }, [photos]);

    // useEffect(() => {
    //     if (itemObject && !rentalItem.id) {
    //         setRentalItem(itemObject);
    //         console.log('Item set:', rentalItem);
    //     }
    // }, [itemObject]);

    const rentItem = async () => {
        console.log('Renting:', rentalItem);
        await rentItemRequest(rentalItem.id)
        .then((res) => {
            if (res.status === 200) {
                console.log('Rented!:', rentalItem.name);
                setRentalItem({ ...rentalItem, available: false });
                setIsRenter(true);
            }
            else if (res.status === 400) {
                console.log('Item already rented:', rentalItem.name);
                setRentalItem({ ...rentalItem, available: false });
            }
        })
        .catch((error) => {
            console.error('Error renting:', error);
        });
    }

    const returnItem = async () => {
        console.log('Renting:', rentalItem);
        await returnItemRequest(rentalItem.id)
        .then((res) => {
            console.log('Return status:', res);
            if (res.id) {
                console.log('Returned!:', rentalItem.name);
                setRentalItem({ ...rentalItem, available: true });
                setIsRenter(false);
                navigation.goBack();
            }
            else {
                console.log('Item already returned ?:', rentalItem.name);
                navigation.goBack();
                // setRentalItem({ ...rentalItem, available: true });
            }
        })
        .catch((error) => {
            console.error('Error renting:', error);
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, 
            flexDirection: 'column',
            justifyContent: 'flex-start' }}>
            <ScrollView>
                <Carousel
                    loop={false}
                    width={screenWidth}
                    height={screenWidth * 0.75}
                    data={photos ? photos : ['https://via.placeholder.com/150']}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item! }}
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
                    <Text style={[styles.cardText, {marginVertical: 3}]}
                        >{rentalItem ? rentalItem.name : 'Loading...'}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.cardText,{ marginVertical: 1 }]}>{ rentalItem ? rentalItem.price !== undefined ? rentalItem.price > 0 ? '¥' + rentalItem.price + "/日" : 'Free' : 'Price not set' : 'Loading...'}</Text>
                        <Text style={[styles.cardText,{ marginVertical: 1 }]}>👤{rentalItem ? rentalItem.owner_id : "Loading..."}</Text>
                    </View>
                    <Text style={[styles.paragraph, { marginVertical: 5 }]}>
                        {rentalItem ? rentalItem.description ? rentalItem.description.replace(/\\n/g, '\n') : 'Loading...' : 'Loading...'}
                    </Text>
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
                            <Text>{rentalItem ? rentalItem.precaution ? rentalItem.precaution.replace(/\\n/g, '\n') : '特にない' : '特にない'}</Text>
                        </View>
                    </View>
                    {rentalItem && <CustomButton
                        title={rentalItem.available ? '借りる詳細を決定する' : isRenter ? '返却する' : '現在貸出中です'}
                        style={[
                            styles.button,
                            {
                                backgroundColor: rentalItem.available ? '#70B2FF' : isRenter ? '#FF7070' : '#CDCDCD',
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
                            console.log('Pressing rent button:', rentalItem);
                            if (rentalItem.available) {
                                setIsRentOverlayVisible(true);
                            }
                            else if (isRenter) {
                                returnItem();
                            }
                        }}
                    />}
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
                                <Text style={[styles.cardText, {marginVertical: 3, fontWeight: 'bold', alignSelf: 'center'}]}>
                                    {rentalItem.name}
                                </Text>
                                <View style={{ borderBottomColor: '#CDCDCD', borderBottomWidth: 2, alignSelf: 'stretch', marginVertical: 5 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , padding: 10, paddingHorizontal: 30,}}>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>借りる相手</Text>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>{rentalItem.owner_id}</Text>
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
                                        defaultIndex={days ? days - 1 : 0}
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
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>{days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString() : '未設定'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , padding: 20, paddingHorizontal: 30, alignContent: 'center', alignItems: 'center',}}>
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>合計</Text>
                                    {rentalItem.price ? rentalItem.price > 0 &&
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Text style={[styles.cardText,{ marginVertical: 1, fontWeight: 'bold', fontSize: 33
                                         }]}>¥{days ? days * (rentalItem.price ?? 0) : 0}</Text>
                                        <Text style={[styles.cardText,{ marginVertical: 1 }]}>¥{rentalItem.price ?? 0}/日</Text>
                                    </View>
                                    :
                                    <Text style={[styles.cardText,{ marginVertical: 1 }]}>無料</Text>
                                    }
                                </View>
                                <View style={{ borderBottomColor: '#CDCDCD', borderBottomWidth: 2, alignSelf: 'stretch', marginVertical: 5 }} />
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
                                        rentItem();
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