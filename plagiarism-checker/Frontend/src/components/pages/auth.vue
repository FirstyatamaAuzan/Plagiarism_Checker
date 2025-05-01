<template>
  <div class="auth-container">
    <div class="body">
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="goToPlagiarismChecker"
      ></button>

      <div class="container" :class="{ active: isActive }">
        <!-- Komponen Login dan Register -->
        <login-form
          v-if="!isActive"
          @toggle-form="toggleForm"
          @google-login="loginWithGoogle"
          @notify="handleNotification"
        />
        <register-form
          v-if="isActive"
          @toggle-form="toggleForm"
          @google-login="loginWithGoogle"
          @notify="handleNotification"
        />

        <!-- Toggle Panel Animasi -->
        <div class="toggle-box">
          <div class="toggle-panel toggle-left">
            <h1><strong>Hello, Welcome!</strong></h1>
            <p>Don't have an account?</p>
            <button class="btn register-btn" @click="toggleForm">
              Register
            </button>
          </div>
          <div class="toggle-panel toggle-right">
            <h1><strong>Welcome Back!</strong></h1>
            <p>Already have an account?</p>
            <button class="btn login-btn" @click="toggleForm">Login</button>
          </div>
        </div>
      </div>

      <!-- Notifikasi -->
      <div
        v-if="showNotification"
        class="notification"
        :class="{ success: successMessage, error: errorMessage }"
      >
        {{ successMessage || errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "../login.vue";
import RegisterForm from "../register.vue";
import axios from "../lib/axios.js";
import { auth, googleProvider } from "../lib/firebase.js";
import { signInWithPopup } from "firebase/auth";

export default {
  components: { LoginForm, RegisterForm },
  data() {
    return {
      isActive: false,
      successMessage: "",
      errorMessage: "",
      showNotification: false,
    };
  },

  methods: {
    goToPlagiarismChecker() {
      this.$router.push("/plagiarism-checker");
    },

    toggleForm() {
      this.isActive = !this.isActive;
    },

    handleNotification({ message, type }) {
      if (type === "success") {
        this.successMessage = message;
        this.errorMessage = "";
      } else {
        this.errorMessage = message;
        this.successMessage = "";
      }
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },

    async loginWithGoogle() {
      try {
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userData = {
          username: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          password: "google_auth",
        };

        try {
          await axios.post("/auth/register", userData);
          this.handleNotification({
            message: "Registrasi berhasil!",
            type: "success",
          });
        } catch (error) {
          if (error.response?.status === 409) {
            this.handleNotification({
              message: "Pengguna sudah terdaftar, lanjut login!",
              type: "success",
            });
          }
        }

        const loginResponse = await axios.post("/auth/login", {
          email: user.email,
          password: "google_auth",
        });

        localStorage.setItem("token", loginResponse.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.displayName,
            avatar: user.photoURL,
          })
        );

        this.handleNotification({
          message: "Login dengan Google berhasil!",
          type: "success",
        });

        this.$router.push("/");
      } catch (error) {
        this.handleNotification({
          message: "Login dengan Google gagal.",
          type: "error",
        });
      }
    },
  },
};
</script>
