import axios from "axios"

export const axiosInstance = axios.create({
    baseURL : import.meta.env.MODE == "development" ? "http://localhost:5000/api": "/api", //rendiamo dinamico l'endpoint in base alla modalità di running dell'app
    withCredentials:true,
})