import { Navigate } from "react-router-dom";
import { useMainContext, MainContext } from "../store/contexts";
const axios = require('axios');
const apiConfig = { headers: {
    "Content-Type": "application/json"
}}

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

const syncData = (userId, token) => {
    return axiosWrapper("get", {userId, token}, apiConfig, `${process.env.REACT_APP_API_URL}/users/datas`);
}

function updateRemoteLimit (limit, token) {
    return axiosWrapper("post", {limit, token}, apiConfig, `${process.env.REACT_APP_API_URL}/users/limit`);

}

function addRemoteExpense (expense, token) {
    return axiosWrapper("post", {...expense, token}, apiConfig, `${process.env.REACT_APP_API_URL}/users/expenses`);

}

function removeRemoteExpense (expenseId, token) {
    return axiosWrapper("delete", {...expenseId, token}, apiConfig, `${process.env.REACT_APP_API_URL}/users/expenses`);

}

export {
    register, 
    login,
    syncData,
    updateRemoteLimit,
    addRemoteExpense,
    removeRemoteExpense
}
