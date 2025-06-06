import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import colors from "../../../globals/theme/colors";
import Button from "../../../components/Button";
import { Linking } from "react-native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container } from "../../../components/Container";

export function Welcome() {
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
        <Container style={styles.container}>
            <Text style={styles.text}>
                <Text style={styles.TextFirstLine}>Bem-vindo ao futuro:{" "}</Text>
                seu carro{" "}
                <Text style={styles.TextSecondLine}>
                    bem cuidado,{" "}
                </Text>
                sem surpresas.
            </Text>

            <Image style={styles.CarImage} source={require("../../../../assets/Car.png")} />

            <View style={styles.ButtonContainer}>
                <Button
                    onPress={login}
                    title="Entrar"
                    style={styles.button}
                />
                <Button
                    onPress={createAccount}
                    title="Criar uma conta"
                    variant="outlined"
                    style={styles.button}
                />
            </View>
        </Container>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
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
        alignSelf: "center",
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
        gap: 10,
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 0, 
    },
    button: {
        flex: 1, 
        minWidth: 0,
    },
})