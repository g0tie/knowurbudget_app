import { Navigate } from "react-router-dom";
import { useMainContext, MainContext } from "../store/contexts";
const axios = require('axios');

const apiConfig = { 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true,
    credentials: 'same-origin',
    mode: 'no-cors',
}
axios.defaults.withCredentials = true

/**
 * Simple wrapper for axios methods
 * @async
 * @param {String} method get | delete | post 
 * @param {Object|Array} data data element to send to server
 * @param {Object} config custom field (ex: headers) for the request
 * @param {String} url distant url resource to reach
 * @returns {AxiosResponse} return an Axios response object 
 */
async function axiosWrapper(method, data, config, url ) {
    try {
        switch (method) {
            case "get":
                return await axios.get(url,{
                    params: data
                }, 
                config
            );

            case "delete":
                return await axios.delete(url,{
                    params: data
                }, 
                config
            );
            
            case "post":
                return await axios.post(url, data, config);

            case "put":
                return await axios.put(url, data, config);
        }

    } catch (e) {
        console.error("erreur: " + e);
        return e.response;
    }
}

const register = (newUser) => {
    return axiosWrapper("post", newUser, apiConfig, `${process.env.REACT_APP_API_URL}/auth/signup`);
}

const login = (newUser) => {
    return axiosWrapper("post", newUser, apiConfig, `${process.env.REACT_APP_API_URL}/auth/signin`);

}

const logout = (csrf) => {
    return axiosWrapper("post", {csrf:csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/auth/signout`);

}

const syncData = (userId, csrf) => {
    return axiosWrapper("get", {userId, csrf:csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/users/datas`);
}

const syncDataFromLocal = (data, csrf) => {
    return axiosWrapper("post", {data, csrf:csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/users/datas`);
}

function updateRemoteLimit (limit, csrf) {
    return axiosWrapper("post", {limit, csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/users/limit`);

}

function addRemoteExpense (expense, csrf) {
    return axiosWrapper("post", {...expense, csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/users/expenses`);

}

function removeRemoteExpense (expenseId, csrf) {
    return axiosWrapper("delete", {...expenseId, csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/users/expenses`);

}

function updateRemoteExpense(expense, csrf) {
    return axiosWrapper("put", {expense, csrf}, apiConfig, `${process.env.REACT_APP_API_URL}/users/expenses`);
}

export {
    register, 
    login,
    syncData,
    updateRemoteLimit,
    addRemoteExpense,
    removeRemoteExpense,
    updateRemoteExpense,
    logout,
    syncDataFromLocal
}
