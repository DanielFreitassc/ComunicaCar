import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import colors from "../../globals/theme/colors";
import Button from "../../components/Button";
import { Feather } from '@expo/vector-icons';
import { api } from "../../infra/apis/api";
import { useAuth } from '../../hooks/authHook';
import { AuthStore } from '../../infra/stores/AuthStore';
import { Alert } from "react-native";

export function Login() {
    const { setToken } = useAuth();
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const authStore = new AuthStore();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        try {
            const response = await api.post('/auth/login', { username, password });
            await authStore.set(response.data.token);
            setToken(response.data.token);
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha inválidos');
        }
    }

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
                    value={username}
                    onChangeText={setEmail}
                    placeholder="Nome de usuário"
                    placeholderTextColor={colors.gray}
                    style={styles.input}
                />
            </View>

            <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color={colors.gray} style={styles.icon} />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
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

            <Button title="Entrar" style={styles.loginButton} onPress={handleLogin} />

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
