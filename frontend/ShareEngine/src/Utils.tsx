import {useEffect, useState} from 'react';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

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
  navigation.navigation.navigate('LoginStack', {screen: 'Login'});
};

export const getUserID = async () => {
  if (await existsSecureItem('token')) {
    const token = await getSecureItem('token');
    const response = await fetch('https://share-engine.click/api/v1/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('User ID fe:', data.user_id);
      return data.user_id;
    } else {
      console.log('Invalid token');
      return '';
    }
  } else {
    console.log('No token found');
    return '';
  }
};

export const setSecureItem = async (key: string, value: string) => {
  console.log('Setting secure item: ' + key + ' ' + value);
  return await RNSecureStorage.setItem(key, value, {
    accessible: ACCESSIBLE.WHEN_UNLOCKED,
  }).catch((error: any) => {
    console.log(error);
    return error;
  });
};

export const getSecureItem = async (key: string) => {
  const result = await RNSecureStorage.getItem(key).catch((error: any) => {
    console.log(error);
    return error;
  });
  console.log('RNSecureStorage.getItem ' + key + ':', result);
  return result;
};

export const removeSecureItem = async (key: string) => {
  return await RNSecureStorage.removeItem(key).catch((error: any) => {
    console.log(error);
    return error;
  });
};

export const existsSecureItem = async (key: string) => {
  try {
    const result = await RNSecureStorage.exist(key);
    console.log('RNSecureStorage.exist ' + key + ':', result);
    return result;
  } catch (error) {
    console.error('Error in RNSecureStorage.exist:', error);
    return false;
  }
};

export const fetchUserRequest = async (user_id: string) => {
  try {
    const url = 'https://share-engine.click/api/v1/users/' + user_id;
    const response = await fetch(url);
    console.log('Status code:', response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const itemsUrl = 'https://share-engine.click/api/v1/items/';
// const itemsUrl = 'http://34.71.228.117/api/v1/items/'
// const itemDetailsUrl = 'http://localhost:8000/api/v1/items/'

export const fetchItemDetailsRequest = async (itemID: string) => {
  try {
    console.log('Fetching item details with ID:', itemID);
    const method = 'GET';
    const response = await fetcher(itemsUrl + itemID, method);
    console.log('Status code fetch item details:', response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

export const fetchItemsRequest = async () => {
  try {
    console.log('Fetching items');
    const method = 'GET';
    const response = await fetcher(itemsUrl, method);
    console.log('Status code:', response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

export const rentItemRequest = async (itemID: string) => {
  const body = {
    item_id: itemID,
  };
  const method = 'POST';
  const response = await fetcher(itemsUrl + 'rent', method, body);
  console.log('Response:', response);
  return response;
};

export const returnItemRequest = async (itemID: string) => {
  const body = {
    item_id: itemID,
  };
  const method = 'POST';
  const response = await fetcher(itemsUrl + 'return', method, body);
  const data = await response.json();
  console.log('returnItemRequest Data:', data);
  return data;
};

export const postNewItemRequest = async (item: any) => {
  const body = item;
  console.log('Posting new item:', body);
  const method = 'POST';
  const response = await fetcher(itemsUrl, method, body);
  console.log('Response:', response);
  return response;
};

export const loginRequest = async (username: string, password: string) => {
  const body = {
    username: username,
    password: password,
  };
  const method = 'POST';
  const response = await fetch('https://share-engine.click/api/v1/login', {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  console.log('Response:', response);
  return response;
};

export const registerRequest = async (username: string, password: string) => {
  const body = {
    name: username,
    password: password,
  };
  const method = 'POST';
  const response = await fetch('https://share-engine.click/api/v1/users/', {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  console.log('Response:', response);
  return response;
};

interface UploadFileProps {
  file: File;
  filename: string;
  // headers: any;
}

export const postImagesRequest = async (files: File[]) => {
  console.log('files:', files);

  let formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    Authorization: 'Bearer ' + (await getSecureItem('token')),
  };

  const response = await fetch(
    'http://localhost:8000/api/v1/uploadfiles/',
    options,
  );
  console.log('response: ', response);

  return response;
};

export const fetcher = async (url: string, method: string, body?: any) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await getSecureItem('token')),
    },
    body: JSON.stringify(body),
  });
  console.log('Status code:', response.status);
  return response;
};
