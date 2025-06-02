import { View,Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function WelcomeScreen() {
    return(
        <View style={styles.container}>
            <Text>Bem vindo</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.white
    }
})