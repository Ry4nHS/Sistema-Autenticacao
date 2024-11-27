import axios from "axios";

const HTTP_STATUS_CODE_OK = 200;
const API_URL = "http://localhost:3001";
const API_URL_SUPABASE = "https://wbgctstptayrxskwaqld.supabase.co";
const API_KEY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2N0c3RwdGF5cnhza3dhcWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5NTM5NzgsImV4cCI6MjA0NDUyOTk3OH0.6qOP2ANbwnxHosWnupL8Wbdhl7AtpZNAOrcBZ91Hzzk";
const AUTHORIZATION_AUTH = localStorage.getItem("access_token");

export const api = {
    getHeaders(){
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",        
            "apikey": API_KEY_TOKEN,
            "Authorization":"Bearer " + AUTHORIZATION_AUTH
        };
    },
    // Systems
    async getSystems() {        
        const route = 'rest/v1/sistema?select=*';
        const response = await axios.get(`${API_URL_SUPABASE}/${route}`, {
            headers: this.getHeaders()
        });
        
        console.log("Dados da api:" + JSON.stringify(response.data));

        return response.data;
    },
    async createSystem(system) {
        let ativo = 0;
        if(system.sisativo){
            ativo = 1
        }

        const data = {
            sisnome:system.sisnome,
            sisativo:ativo,
        }
    
        const route = 'rest/v1/sistema';
        const response = await axios.post(`${API_URL_SUPABASE}/${route}`, data, {
            headers: this.getHeaders()
        });

        console.log("Response: " + JSON.stringify(response.data));

        if(response.status == HTTP_STATUS_CODE_OK){
            return true;
        }

        alert("Usuário ou senha invalido!");

        return false;
    },
    async deleteSystem(id) {
        const route = `rest/v1/sistema?id=eq.${id}`;
        await axios.delete(`${API_URL_SUPABASE}/${route}`, {headers: this.getHeaders()});
    },

    // Users
    async getUsers() {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    },
    async createUser(user) {
        const response = await axios.post(`${API_URL}/users`, user);
        return response.data;
    },
    async deleteUser(id) {
        const route = `rest/v1/usuario?id=eq.${id}`;
        await axios.delete(`${API_URL_SUPABASE}/${route}`, {headers: this.getHeaders()});

    },
    async login(username, password) {
        const data = {
            "email":username,
            "password":password
        };

        const route = 'auth/v1/token?grant_type=password';
        const response = await axios.post(`${API_URL_SUPABASE}/${route}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "apikey": API_KEY_TOKEN
            }
        });

        const access_token = response.data.access_token;

        localStorage.setItem("access_token", access_token);

        if(response.status == HTTP_STATUS_CODE_OK){
            return true;
        }

        alert("Usuário ou senha invalido!");

        return false;
    },

    // Profiles
    async getProfiles() {
        const response = await axios.get(`${API_URL}/profiles`);
        return response.data;
    },
    async createProfile(profile) {
        const response = await axios.post(`${API_URL}/profiles`, profile);
        return response.data;
    },
    async deleteProfile(id) {
        await axios.delete(`${API_URL}/profiles/${id}`);
    }
};
