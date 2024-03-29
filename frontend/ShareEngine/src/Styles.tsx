import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    loginInput: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderRadius: 9,
        borderWidth: 1,
        backgroundColor: "white",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    button: {
        width: "100%",
        height: 40,
        backgroundColor: "lightblue",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    cardText: {
        fontSize: 21,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
    },
    paragraph: {
        fontSize: 16,
    },
    cardContainer: {
        width: "30%",
        height: 150,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 5,
        margin: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: "100%",
        height: "80%",
        resizeMode: "cover",
    },
    price: {
        fontSize: 16,
        color: "green",
    },
    description: {
        fontSize: 14,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        position: 'relative',
    },
    gradientBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.8,
    },
});

export default styles;
