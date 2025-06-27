import React, { useState } from 'react';
import { 
    SafeAreaView, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    ScrollView 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { api } from '../../../../infra/apis/api';
import { Container } from '../../../../components/Container'; 

export function EditService() {
    const navigation = useNavigation();
    const route = useRoute();
    const { service } = route.params;

    const [title, setTitle] = useState(service.title || '');
    const [description, setDescription] = useState(service.description || '');
    const [vehicle, setVehicle] = useState(service.vehicle || '');
    const [contactNumber, setContactNumber] = useState(service.contactNumber || '');
    const [conclusionDate, setConclusionDate] = useState(service.conclusionDate || '');
    const [isLoading, setIsLoading] = useState(false);
    
    async function handleSaveChanges() {
        if (!title || !vehicle) {
            Alert.alert("Atenção", "Os campos Título e Veículo são obrigatórios.");
            return;
        }
        setIsLoading(true);

        const payload = {
            title,
            description,
            vehicle,
            contactNumber,
            conclusionDate,
            mechanicId: service.mechanicId?.id,
            status: service.status,
        };

        try {
            await api.put(`/services/${service.id}`, payload);
            Alert.alert("Sucesso", "Atendimento atualizado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.error("API RESPONDEU COM ERRO:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível salvar as alterações. Verifique o terminal para detalhes.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Editar Atendimento</Text>
                    <Text style={styles.ticket}>Ticket: {service.ticketNumber}</Text>
                    <Text style={styles.label}>Título do Serviço</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                    <Text style={styles.label}>Veículo</Text>
                    <TextInput style={styles.input} value={vehicle} onChangeText={setVehicle} />
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline />
                    <Text style={styles.label}>Número de Contato</Text>
                    <TextInput style={styles.input} value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
                    <Text style={styles.label}>Data de Previsão</Text>
                    <TextInput style={styles.input} value={conclusionDate} onChangeText={setConclusionDate} placeholder="DD/MM/AAAA" />
                    <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSaveChanges} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? "Salvando..." : "Salvar Alterações"}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </Container>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    container: { 
        padding: 20, 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#E91E63', 
        marginBottom: 5,
    },
    ticket: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 10,
    },
    input: { 
        backgroundColor: '#FFF', 
        width: '100%', 
        padding: 15, 
        borderRadius: 8, 
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#DDD'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#E91E63',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonDisabled: {
        backgroundColor: '#F7A8C4'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});