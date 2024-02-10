import { useEffect, useState } from "react";
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

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

// export const removeSecureItem = async (key: string) => {
//     return await RNSecureStorage.removeItem(key)
//         .catch((error: any) => {
//             console.log(error);
//             return error;
//         }
//     );
// }

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

export const fetcher = async (url: string, method: string, body?: any) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
