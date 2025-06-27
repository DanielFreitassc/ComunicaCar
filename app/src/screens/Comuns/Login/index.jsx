import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert
} from "react-native";
import { useState } from "react";
import colors from "../../../globals/theme/colors";
import Button from "../../../components/Button";
import { Feather } from '@expo/vector-icons';
import { api } from "../../../infra/apis/api";
import { useAuth } from '../../../hooks/authHook';
import { AuthStore } from '../../../infra/stores/AuthStore';
import { Container } from "../../../components/Container";

export function Login() {
    const { setToken, setIsAtendente } = useAuth();

    const [isLogging, setIsLogging] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('mecanico');
    const [password, setPassword] = useState('admin');

    const authStore = new AuthStore();

    const handleLogin = async () => {
        setIsLogging(true);
        try {
            if (!username || !password) {
                Alert.alert('Erro', 'Preencha todos os campos');
                setIsLogging(false);
                return;
            }

            const response = await api.post('/auth/login', { username, password });
            console.log(response.data);
            setToken(response.data.token);
            setIsAtendente(response.data.role !== "EMPLOYEE_MECHANIC");
            await authStore.set(response.data);

        } catch (error) {
            if (error.response && (error.response.status === 404 || error.response.status === 401)) {
                await authStore.remove();
                setToken(null);
                setIsAtendente(false); 
                console.log("Token antigo removido devido a falha no login.");
            }

            Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
        } finally {
            setIsLogging(false);
        }
    }

    return (
        <Container style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require("../../../../assets/MiniCar.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>
                        <Text style={styles.bold}>Bem-vindo</Text> de volta!
                    </Text>

                    <View style={styles.inputContainer}>
                        <Feather name="user" size={18} color={colors.gray} style={styles.icon} />
                        <TextInput
                            value={username}
                            onChangeText={setUsername} 
                            placeholder="Nome de usuário"
                            placeholderTextColor={colors.gray}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
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
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            style={styles.eyeIcon}
                        >
                            <Feather
                                name={passwordVisible ? "eye-off" : "eye"}
                                size={18}
                                color={colors.gray}
                            />
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Entrar"
                        style={styles.loginButton}
                        isLoading={isLogging}
                        onPress={handleLogin}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexGrow: 1,
        justifyContent: 'center',
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
        textAlign: 'center',
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
        paddingVertical: 0,
    },
    icon: {
        marginRight: 8,
    },
    eyeIcon: {
        padding: 8,
    },
    loginButton: {
        marginTop: 20,
        width: "100%",
    },
    forgotPasswordButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    forgotPasswordText: {
        color: colors.secondary,
        fontSize: 14,
        fontFamily: "Cairo_600SemiBold",
    },
});
