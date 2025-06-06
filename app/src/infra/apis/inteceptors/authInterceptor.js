//create an interceptor to add the token to the request

import { AuthStore } from "../../stores/AuthStore";

export async function authInterceptor(config) {
    try {
        const authStore = new AuthStore();
        const token = await authStore.get();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    } catch (error) {
        throw error;
    }
}
