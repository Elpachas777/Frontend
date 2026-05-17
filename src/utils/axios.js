import axios from "axios";
const urlBack = import.meta.env.VITE_URL_BACKEND;

axios.defaults.baseURL = urlBack;
axios.defaults.withCredentials = true;

export default axios;
