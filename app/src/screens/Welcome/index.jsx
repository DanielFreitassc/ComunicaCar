import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import colors from "../../globals/theme/colors";
import Button from "../../components/Button";
import { Linking } from "react-native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
    const navigation = useNavigation();

    function createAccount() {
        Alert.alert("Atenção", "Entre em contato com um administrador para se cadastrar na plataforma!", [
            {
                text: "Entra em contato",
                onPress: () => Linking.openURL('https://wa.me/48988060117') // colocar o número do administrador
            }
        ], {
            cancelable: true,
        })
    }

    function login() {
        navigation.navigate("Login")
    }
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("../../../assets/MiniCar.png")}
                style={styles.logo}
            />
            <Text style={styles.text}>
                <Text style={styles.TextFirstLine}>Bem-vindo ao futuro:{" "}</Text>
                seu carro{" "}
                <Text style={styles.TextSecondLine}>
                    bem cuidado,{" "}
                </Text>
                sem surpresas.
            </Text>

            <Image style={styles.CarImage} source={require("../../../assets/Car.png")} />

            <View style={styles.ButtonContainer}>
                <Button onPress={login} title="Entrar" style={{ width: "50%" }} />
                <Button onPress={createAccount} title="Criar uma conta" variant="outlined" style={{ width: "50%" }} />
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 40,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 70,
        height: 34.16,
        marginBottom: 25
    },
    text: {
        fontSize: 28,
        fontFamily: "Cairo_500Medium",
        color: colors.grayDark
    },
    TextFirstLine: {
        fontSize: 28,
        color: colors.secondary,
        fontFamily: "Cairo_700Bold"
    },
    TextSecondLine: {
        fontSize: 28,
        color: colors.grayDark,
        fontFamily: "Cairo_700Bold"
    },
    CarImage: {
        alignSelf: "center"
    },
    SubText: {
        fontSize: 16,
        marginVertical: 5,
        fontFamily: "Cairo_500Medium",
        color: colors.grayDark
    },
    SubTextBold: {
        fontSize: 16,
        marginVertical: 5,
        fontFamily: "Cairo_700Bold"
    },
    ButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 10,
    }
})