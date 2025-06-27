import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Modal,
    FlatList,
    Pressable,
} from "react-native";
import { Container } from "../../../../components/Container";
import DateTimePicker from "@react-native-community/datetimepicker";
import { api } from "../../../../infra/apis/api";

export function CreateService() {
    const navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [clientName, setClientName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [conclusionDate, setConclusionDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [mechanics, setMechanics] = useState([]);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const [showMechanicModal, setShowMechanicModal] = useState(false);

    useEffect(() => {
        loadMechanics();
    }, []);

    async function loadMechanics() {
        try {
            const { data } = await api.get("/users");
            const mechanicsOnly = data.content.filter((user) => user.role === "EMPLOYEE_MECHANIC");
            setMechanics(mechanicsOnly);
        } catch (error) {
            Alert.alert("Erro", "Erro ao buscar os mecânicos.");
        }
    }

    function formatDate(date) {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }
    
    const handleSalvarAtendimento = async () => {
        try {
            if (!clientName || !vehicle || !title || !description || !contactNumber || !conclusionDate || !selectedMechanic) {
                Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
                return;
            }

            const dto = {
                title,
                clientName,
                description,
                vehicle,
                contactNumber,
                mechanicId: selectedMechanic.id,
                conclusionDate: formatDate(conclusionDate),
            };

            await api.post('/services', dto);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Ocorreu um erro inesperado.");
        }
    };

    return (
        <Container>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Cadastrar atendimento</Text>
                    <View style={{ width: 28 }} />
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nome do proprietário</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: João da Silva"
                                value={clientName}
                                onChangeText={setClientName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Contato</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contato do cliente"
                                value={contactNumber}
                                onChangeText={setContactNumber}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Veículo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Fiat Uno 2015"
                                value={vehicle}
                                onChangeText={setVehicle}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Título</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Troca de óleo"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Descrição geral</Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                placeholder="Descreva o atendimento..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Data de conclusão</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={{ color: conclusionDate ? '#000' : '#999' }}>
                                    {conclusionDate
                                        ? conclusionDate.toLocaleDateString('pt-BR')
                                        : 'Selecionar data'}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={conclusionDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (event.type === "set" && selectedDate) {
                                            setConclusionDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Mecânico responsável</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowMechanicModal(true)}
                            >
                                <Text style={{ color: selectedMechanic ? '#000' : '#999' }}>
                                    {selectedMechanic?.name || 'Selecionar mecânico'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleSalvarAtendimento} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Salvar atendimento</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                {/* Modal de mecânicos */}
                <Modal
                    visible={showMechanicModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowMechanicModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Selecione o mecânico</Text>
                            <FlatList
                                data={mechanics}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedMechanic(item);
                                            setShowMechanicModal(false);
                                        }}
                                    >
                                        <Text>{item.name}</Text>
                                    </Pressable>
                                )}
                            />
                            <TouchableOpacity
                                onPress={() => setShowMechanicModal(false)}
                                style={styles.modalClose}
                            >
                                <Text style={{ color: '#E91E63', fontWeight: 'bold' }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        color: '#E91E63',
    },
    form: {
        padding: 16,
        paddingBottom: 32,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#E91E63',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalClose: {
        marginTop: 12,
        alignItems: 'center',
    },
});
