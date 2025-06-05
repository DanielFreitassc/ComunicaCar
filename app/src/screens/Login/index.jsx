import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import colors from "../../globals/theme/colors";
import Button from "../../components/Button";
import { Feather } from '@expo/vector-icons';

export function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Image
                source={require("../../../assets/MiniCar.png")}
                style={styles.logo}
            />
            <Text style={styles.title}>
                <Text style={styles.bold}>Bem-vindo</Text> de volta!
            </Text>

            <View style={styles.inputContainer}>
                <Feather name="user" size={18} color={colors.gray} style={styles.icon} />
                <TextInput
                    placeholder="Nome de usuário"
                    placeholderTextColor={colors.gray}
                    style={styles.input}
                />
            </View>

            <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color={colors.gray} style={styles.icon} />
                <TextInput
                    placeholder="Senha"
                    placeholderTextColor={colors.gray}
                    secureTextEntry={!passwordVisible}
                    style={styles.input}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Feather
                        name={passwordVisible ? "eye-off" : "eye"}
                        size={18}
                        color={colors.gray}
                        style={styles.iconRight}
                    />
                </TouchableOpacity>
            </View>

            <Button title="Entrar" style={styles.loginButton} />

            <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: "center",
        backgroundColor: colors.white,
    },
    logo: {
        width: 70,
        height: 34.16,
        alignSelf: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: "Cairo_500Medium",
        color: colors.grayDark,
        marginBottom: 25,
    },
    bold: {
        fontFamily: "Cairo_700Bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: colors.grayLight,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 50,
        fontFamily: "Cairo_500Medium",
        color: colors.grayDark,
    },
    icon: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    loginButton: {
        marginTop: 10,
        width: "100%",
    },
    forgotPassword: {
        color: colors.secondary,
        fontSize: 14,
        fontFamily: "Cairo_600SemiBold",
        textAlign: "center",
        marginTop: 10,
    },
});
