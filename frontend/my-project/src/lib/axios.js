import axios from "axios";
import { getBaseURL } from "./baseUrl";

// Instância do axios com baseURL e credenciais
export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
