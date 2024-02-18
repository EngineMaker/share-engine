import { useEffect, useState } from "react";
import Config from "react-native-config";
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

const apiBase = Config.API_BASE;

export const handleLogout = async (navigation: any) => {
    console.log('Logging out');
    if (await existsSecureItem('user')) {
        await removeSecureItem('user');
    }
    if (await existsSecureItem('token')) {
        await removeSecureItem('token');
    }
    if (await existsSecureItem('userid')) {
        await removeSecureItem('userid');
    }
    console.log(navigation);
    navigation.navigation.navigate('LoginStack', { screen: 'Login' });
}

export const setSecureItem = async (key: string, value: string) => {
    console.log('Setting secure item: ' + key + ' ' + value);
    return await RNSecureStorage.setItem(key, value, {accessible: ACCESSIBLE.WHEN_UNLOCKED})
        .catch((error: any) => {
            console.log(error);
            return error;
        }
    );
}

export const getSecureItem = async (key: string) => {
    const result = await RNSecureStorage.getItem(key)
        .catch((error: any) => {
            console.log(error);
            return error;
        }
    )
    console.log('RNSecureStorage.getItem ' + key + ':', result);
    return result;
}

export const removeSecureItem = async (key: string) => {
    return await RNSecureStorage.removeItem(key)
        .catch((error: any) => {
            console.log(error);
            return error;
        }
    );
}

export const existsSecureItem = async (key: string) => {
    try {
        const result = await RNSecureStorage.exist(key);
        console.log('RNSecureStorage.exist ' + key + ':', result);
        return result;
    } catch (error) {
        console.error('Error in RNSecureStorage.exist:', error);
        return false;
    }
}

export const getUserID = async () => {
    const response = await fetcher('me', 'GET');
    const data = await response.json();
    console.log('User ID fe:', data.user_id);
    return data.user_id;
}

export const fetchUserDetailsRequest = async (user_id: string) => {
    try {
        const url = 'users/' + user_id;
        const response = await fetcher(url, 'GET');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

export const fetchUsersRequest = async () => {
    try {
        console.log('Fetching users');
        const response = await fetcher('users', 'GET');
        console.log('Status code:', response.status);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export const fetchItemDetailsRequest = async (itemID: string) => {
    try {
        console.log('Fetching item details with ID:', itemID);
        const method = 'GET';
        const response = await fetcher('items/' + itemID, method);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export const fetchItemsRequest = async () => {
    try {
        console.log('Fetching items');
        const method = 'GET';
        const response = await fetcher('items/', method);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export const rentItemRequest = async (itemID: string) => {
    const body = {
        "item_id": itemID,
    };
    const method = 'POST';
    const response = await fetcher('items/rent', method, body);
    console.log('Response:', response);
    return response;
}

export const returnItemRequest = async (itemID: string) => {
    const body = {
        "item_id": itemID,
    };
    const method = 'POST';
    const response = await fetcher('items/return', method, body);
    const data = await response.json();
    console.log('returnItemRequest Data:', data);
    return data;
}

export const postNewItemRequest = async (item: any) => {
    const body = item;
    console.log('Posting new item:', body);
    const method = 'POST';
    const response = await fetcher('items/', method, body);
    console.log('Response:', response);
    return response;
}

export const loginRequest = async (username: string, password: string) => {
    const body = {
        "username": username,
        "password": password,
    };
    console.log('Logging in with:', body);
    const method = 'POST';
    const response = await fetcher('login/', method, body);
    console.log('Response:', response);
    return response;
}

export const registerRequest = async (username: string, password: string) => {
    const body = {
        "name": username,
        "password": password,
    };
    const method = 'POST';
    const response = await fetcher('users/', method, body);
    console.log('Response:', response);
    return response;
}


export const fetcher = async (url: string, method: string, body?: any, customHeaders?: any) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + await getSecureItem('token'),
    };
    const response = await fetch(`${apiBase}/` + url, {
        method: method,
        headers: customHeaders ? customHeaders : headers,
        body: JSON.stringify(body),
    });
    console.log('Status code:', response.status);
    if (response.ok) {
        return response;
    } else {
        console.log('Error:', response.status);
        const data = await response.json();
        console.error('Error:', data);
        return response;
    }
}