import { useEffect, useState } from "react";
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

export const getUserID = async () => {
    const userID = await getSecureItem('user_id');
    return userID;
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
    );
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
    console.log('existsSecureItem called with key:', key);
    try {
        const result = await RNSecureStorage.exist(key);
        console.log('RNSecureStorage.exist result:', result);
        return result;
    } catch (error) {
        console.error('Error in RNSecureStorage.exist:', error);
        return false;
    }
}

export const otherFetch = async () => {
    const url = 'http://34.71.228.117/api/v1/users/1';
    const method = 'GET';
    const response = await fetcher(url, method);
    console.log('Fetched user with fetcher:', response);
}

export const fetchUser = async () => {
    try {
        console.log('Fetching user');
        const response = await fetch('http://34.71.228.117/api/v1/users/1');
        console.log('Status code:', response.status);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

const itemsUrl = 'http://localhost:8000/api/v1/items/'
// const itemsUrl = 'http://34.71.228.117/api/v1/items/'
const itemDetailsUrl = 'http://localhost:8000/api/v1/items/'

export const fetchItemDetailsRequest = async (itemID: string) => {
    try {
        console.log('Fetching item details');
        const response = await fetch(itemsUrl + itemID); // for example, http://localhost:8000/api/v1/items/1
        console.log('Status code:', response.status);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export const fetchItemsRequest = async () => {
    try {
        console.log('Fetching items');
        const response = await fetch(itemsUrl);
        console.log('Status code:', response.status);
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
    const response = await fetcher(itemsUrl + 'rent', method, body);
    console.log('Response:', response);
    return response;
}

export const returnItemRequest = async (itemID: string) => {
    const body = {
        "item_id": itemID,
    };
    const method = 'POST';
    const response = await fetcher(itemsUrl + 'return', method, body);
    console.log('Response:', response);
    return response;
}

export const postNewItemRequest = async (item: any) => {
    const body = item;
    console.log('Posting new item:', body);
    const method = 'POST';
    const response = await fetcher(itemsUrl, method, body);
    console.log('Response:', response);
    return response;
}

export const loginRequest = async (username: string, password: string) => {
    const body = {
        "username": username,
        "password": password,
    };
    const method = 'POST';
    const response = await fetcher('http://localhost:8000/api/v1/login', method, body);
    console.log('Response:', response);
    return response;
}


export const fetcher = async (url: string, method: string, body?: any) => {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    console.log('Status code:', response.status);
    return response;
}