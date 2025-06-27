//create an interceptor to add the token to the request

import { AuthStore } from "../../stores/AuthStore";

export async function authInterceptor(config) {
    try {
        const authStore = new AuthStore();
        const auth = await authStore.get();

        if (auth) {
            config.headers.Authorization = `Bearer ${auth.token}`;
        }

        return config;
    } catch (error) {
        throw error;
    }
}
