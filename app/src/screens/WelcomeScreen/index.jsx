import { View,Text, StyleSheet, Image, SafeAreaView } from "react-native";
import colors from "../theme/colors";
import Button from "../../components/Button";

export default function WelcomeScreen() {
    return(
        <View style={styles.container}>
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

            <Image style={styles.CarImage} source={require("../../../assets/Car.png")}/>
            <Text style={styles.SubText}>
                Aqui os mecânicos{" "}
                <Text style={styles.SubTextBold}>
                    atualizam os serviços{" "}
                </Text>
                e os donos de carro{" "}
                <Text style={styles.SubTextBold}>
                    acompanhem tudo em tempo real!{" "}
                </Text>
            </Text>
            <SafeAreaView style={{flex:1, flexDirection:"row", justifyContent: "space-around"}}>
                <Button title="Entrar" style={{ width: 142.38 }}/>
                <Button title="Criar uma conta" variant="outlined" style={{ width:142.38}}/>
            </SafeAreaView>
 
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.white,
        paddingHorizontal: 40,
        paddingVertical: 20
    },
    logo : {
        width:70,
        height: 34.16,
        marginBottom:25
    },
    text: {
        fontSize: 28,
        width: 340,
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
        width:366,
        height:366,
        alignSelf: "center"
    },
    SubText: {
        fontSize: 16,
        marginVertical: 5,
        fontFamily: "Cairo_500Medium",
        color: colors.grayDark
    },
    SubTextBold: {
        fontSize: 13,
        marginVertical: 5,
        fontFamily: "Cairo_700Bold"
    }
})