import AsyncStorage from "@react-native-async-storage/async-storage";

export class BaseStore {
    constructor(key) {
        this.key = `Comunicacar:${key}`;
    }

    async get() {
        return JSON.parse(await AsyncStorage.getItem(this.key));
    }

    async set(value) {
        await AsyncStorage.setItem(this.key, JSON.stringify(value));
    }

    async remove() {
        await AsyncStorage.removeItem(this.key);
    }
}