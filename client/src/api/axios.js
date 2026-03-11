import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api || https://tomoshelf.onrender.com"
});

export default API;