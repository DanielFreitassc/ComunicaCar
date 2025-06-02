import { View,Text, StyleSheet, Image } from "react-native";
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
            <Button/>
 
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.white,
        paddingHorizontal: 60,
        paddingVertical: 150
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
    }
})