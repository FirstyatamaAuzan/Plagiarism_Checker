import { defineStore } from "pinia";
import axios from "../components/lib/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || "",
  }),
  

  actions: {
    setUser(user) {
      this.user = user; 
    },

    async login(email, password) {
      try {
        const { data } = await axios.post("/auth/login", { email, password });

        console.log("Login response:", data);

        // Validasi respons
        if (!data.token || !data.user) {
          throw new Error("Invalid response structure");
        }

        this.user = data.user;
        this.token = data.token;

        // Simpan ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Ini yang bikin username muncul

        return true;
      } catch (error) {
        console.error("Login error details:", {
          message: error.message,
          response: error.response?.data,
        });

        throw error;
      }
    },

    async register(name, email, password) {
      await axios.post("/auth/register", { name, email, password });
    },

    async loginWithGoogle() {
      const user = await signInWithGoogle();
      if (user) {
        this.user = { name: user.displayName, email: user.email };
        this.token = token;
      
        // Simpan ke localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(this.user)); 
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
