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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 8,
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
        width: "60%",
        height: "60%",
        resizeMode: "cover",
        borderRadius: 4,
    },
    price: {
        fontSize: 16,
        color: "green",
    },
    description: {
        fontSize: 14,
    },
});

export default styles;
