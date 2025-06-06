import { Text } from "react-native";
import { Container } from "../../../components/Container";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

export function Service() {
    const [service, setService] = useState()
    const route = useRoute();

    useEffect(() => {
        if (route.params?.service) {
            setService(route.params.service);
        }
    }, [route.params]);

    return (
        <Container>
            <Text>{service.title}</Text>
        </Container>
    )
}