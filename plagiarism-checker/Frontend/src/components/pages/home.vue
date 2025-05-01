<template>
  <div class="home-container">
    <div class="container">
      <Header
        :is-navbar-open="isNavbarOpen"
        :is-authenticated="isAuthenticated"
        :user="user"
        @toggle-navbar="toggleNavbar"
        @close-navbar="closeNavbar"
        @logout="logout"
      />

      <div class="main-content" id="plagiarism-checker">
        <h1>Plagiarism Checker</h1>
        <div class="container-option mt-4 text-center">
          <ul
            class="nav nav-pills d-inline-flex align-items-center justify-content-center mb-3 gap-2"
          >
            <li class="nav-item">
              <button
                class="nav-link tab-button"
                :class="{ active: activeTab === 'text' }"
                @click="activeTab = 'text'"
              >
                Text
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link tab-button"
                :class="{ active: activeTab === 'file' }"
                @click="activeTab = 'file'"
              >
                File
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link tab-button"
                :class="{ active: activeTab === 'url' }"
                @click="activeTab = 'url'"
              >
                URL
              </button>
            </li>
          </ul>

          <div class="input-container d-flex flex-column align-items-center">
            <!-- Dynamic Input -->
            <div v-if="activeTab === 'text'" class="input-box input-text">
              <textarea
                v-model="textInput"
                class="form-control input-field"
                rows="6"
                placeholder="Enter your text here..."
              ></textarea>
              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              <button
                class="btn btn-check mt-2"
                @click="submitPlagiarismCheck"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else>Check Plagiarism</span>
              </button>
            </div>

            <div v-else-if="activeTab === 'file'" class="input-box input-file">
              <input
                type="file"
                @change="handleFileUpload"
                class="form-control input-field"
                accept=".pdf"
                ref="fileInput"
              />
              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              <button
                class="btn btn-check mt-2"
                @click="submitPlagiarismCheck"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else>Check Plagiarism</span>
              </button>
            </div>

            <div v-else-if="activeTab === 'url'" class="input-box input-url">
              <input
                v-model="urlInput"
                type="url"
                class="form-control input-field"
                style="text-align: center"
                placeholder="Enter your URL here..."
              />
              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              <button
                class="btn btn-check mt-2"
                @click="submitPlagiarismCheck"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else>Check Plagiarism</span>
              </button>
            </div>
          </div>

          <div v-if="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Checking for plagiarism...</p>
          </div>

          <div
            v-if="showOutput && resultTab === activeTab"
            class="output-container"
          >
            <h2>Result</h2>
            <div class="original-text-section mb-4">
              <h4>Teks yang Diinputkan</h4>
              <div class="original-text-content">
                <template v-if="processedText">
                  <pre>{{ processedText }}</pre>
                </template>
                <template v-else>
                  <div v-if="activeTab === 'text'" class="text-muted">
                    {{ textInput || "Tidak ada teks yang diinputkan" }}
                  </div>
                  <div v-else-if="activeTab === 'file'" class="text-muted">
                    {{ fileOutput || "Konten file tidak tersedia" }}
                  </div>
                  <div v-else class="text-muted">
                    {{ urlOutput || "Konten URL tidak tersedia" }}
                  </div>
                </template>
              </div>
            </div>

            <div class="sources-section mb-4">
              <h4>Hasil Deteksi Plagiasi</h4>
              <div v-if="sources.length > 0" class="sources-list">
                <div
                  v-for="(source, index) in sources"
                  :key="index"
                  class="source-item card mb-3"
                >
                  <div class="card-body">
                    <div class="source-header d-flex align-items-center mb-2">
                      <span class="source-index bg-light me-2">{{
                        index + 1
                      }}</span>
                      <a
                        :href="source.url"
                        target="_blank"
                        class="source-url flex-grow-1"
                        >{{ source.url.length > 70 ? source.url.substring(0,70) + '\n' + source.url.substring(70) : source.url }}
                        </a>
                      <span
                        class="source-percentage badge"
                        :class="{
                          bg: source.plagiarismScore >= 70,
                          bg:
                            source.plagiarismScore >= 30 &&
                            source.plagiarismScore < 70,
                          bg: source.plagiarismScore < 30,
                        }"
                      >
                        Similarity:
                        {{ (source.details.avgSimilarity * 100).toFixed(1) }}%
                        <br />
                        Plagiarized: {{ source.details.plagiarizedFraction }}
                      </span>
                    </div>

                    <div class="sentences-detail">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="detail-item">
                            <span class="detail-label fw-medium"
                              >Kalimat Input:</span
                            >
                            <div class="detail-value">
                              {{ source.details.totalInputSentences }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="detail-item">
                            <span class="detail-label fw-medium"
                              >Kalimat Terdeteksi:</span
                            >
                            <div class="detail-value text-danger">
                              {{ source.details.plagiarizedCount }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="similarity-progress mt-2 fw-semibold">
                        skor overall:
                        <div class="progress gap-2 position-relative">
                          <div
                            class="progress-bar"
                            role="progressbar"
                            :style="{ width: source.plagiarismScore + '%' }"
                            :aria-valuenow="source.plagiarismScore"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            <span
                              v-if="source.plagiarismScore > 60"
                              class="position-absolute start-50 translate-x text-white"
                            >
                              {{ source.plagiarismScore }}% Skor Plagiasi
                            </span>
                          </div>

                          <div v-if="source.plagiarismScore <= 60" class="bar">
                            {{ source.plagiarismScore }}% Skor Plagiasi
                          </div>
                        </div>

                        <div
                          v-if="source.plagiarismScore > 60"
                          class="text-center text-white mt-1"
                        >
                          Skor Plagiasi
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="alert alert-info mt-3">
                <i class="fas fa-check-circle me-2"></i>
                Tidak terdeteksi plagiasi. Dokumen ini original!
              </div>
            </div>

            <div class="keywords-section card">
              <div class="card-body">
                <h4 class="card-title">5 Keyword Utama</h4>
                <div class="keywords-list d-flex justify-content-around">
                  <div
                    v-for="(keyword, index) in topKeywords"
                    :key="index"
                    class="keyword-item text-center p-2"
                  >
                    <div class="keyword-badge badge bg-primary rounded-pill">
                      {{ keyword.keyword }}
                    </div>
                    <div class="keyword-percentage small text-muted mt-1">
                      {{ toInt(keyword.percentage) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HowToUse :is-visible="isVisible" />
          <ContactUs :is-visible="isVisible" />
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import axios from "../lib/axios.js";
import Header from "../header.vue";
import Footer from "../footer.vue";
import HowToUse from "../howToUse.vue";
import ContactUs from "../contactUs.vue";

export default {
  name: "Home",
  components: {
    Header,
    Footer,
    HowToUse,
    ContactUs,
  },

  data() {
    return {
      isNavbarOpen: false,
      isLoading: false,
      activeTab: "text",
      resultTab: null,
      textInput: "",
      fileInput: null,
      urlInput: "",
      showOutput: false,
      errorMessage: "",
      processedText: "",
      sources: [],
      topKeywords: [],
      isVisible: true,
    };
  },

  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token");
    },

    user() {
      try {
        return (
          JSON.parse(localStorage.getItem("user")) || {
            username: "",
            avatar: "",
          }
        );
      } catch (e) {
        return { username: "", avatar: "" };
      }
    },
  },

  methods: {
    toInt(val) {
      return parseInt(val, 10);
    },

    checkAction() {
      this.showOutput = true;
    },

    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },

    closeNavbar() {
      this.isNavbarOpen = false;
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/auth");
    },

    validateInput() {
      if (this.activeTab === "text" && this.textInput.trim().length < 10) {
        this.errorMessage = "Konten harus lebih dari 10 karakter!";
        return false;
      }
      if (
        this.activeTab === "url" &&
        !this.urlInput.match(/^https?:\/\/[^\s$.?#].[^\s]*$/)
      ) {
        this.errorMessage = "URL tidak valid!";
        return false;
      }
      if (this.activeTab === "file" && !this.fileInput) {
        this.errorMessage = "Silakan unggah file!";
        return false;
      }
      this.errorMessage = "";
      return true;
    },

    async submitPlagiarismCheck() {
      if (!this.validateInput()) return;
      this.isLoading = true;

      let endpoint = "";
      let payload;
      try {
        if (this.activeTab === "text") {
          endpoint = "check/check-text";
          payload = { text: this.textInput };
        } else if (this.activeTab === "url") {
          endpoint = "check/check-url";
          payload = { url: this.urlInput };
        } else if (this.activeTab === "file") {
          endpoint = "check/check-file";
          const formData = new FormData();
          formData.append("file", this.fileInput);
          payload = formData;
        }

        const config =
          this.activeTab === "file"
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : { headers: { "Content-Type": "application/json" } };

        const response = await axios.post(endpoint, payload, config);
        const data = response.data;

        this.processedText = data.originalText;
        this.topKeywords = data.topKeywords;
        this.sources = data.results.map((result) => ({
          url: result.url,
          plagiarismScore: result.plagiarismScore,
          details: {
            totalInputSentences: result.details.totalInputSentences,
            plagiarizedCount: result.details.plagiarizedCount,
            avgSimilarity: parseFloat(result.details.avgSimilarity),
            plagiarizedFraction: result.details.plagiarizedFraction,
          },
        }));

        this.similarityScore =
          this.sources.length > 0
            ? Math.max(...this.sources.map((s) => s.plagiarismScore))
            : 0;

        this.sentenceCount =
          this.sources.length > 0
            ? this.sources[0].details.totalInputSentences
            : 0;
        this.detectedCount =
          this.sources.length > 0
            ? this.sources[0].details.plagiarizedCount
            : 0;

        this.resultTab = this.activeTab;
        this.showOutput = true;
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error ||
          "Terjadi kesalahan saat memproses permintaan.";
      } finally {
        this.isLoading = false;
      }
    },

    handleFileUpload(event) {
      this.fileInput = event.target.files[0];
    },

    sendMessage() {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3;
        if (isSuccess) {
          this.showNotification("Message sent successfully!", "success");
          this.resetForm();
        } else {
          this.showNotification(
            "Failed to send message. Please try again.",
            "error"
          );
        }
      }, 1000);
    },

    showNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = { message: "", type: "" };
      }, 2000);
    },
  },

  watch: {
    activeTab(newTab, oldTab) {
      switch (oldTab) {
        case "text":
          this.textInput = "";
          break;
        case "file":
          this.fileInput = null;
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = "";
          }
          break;
        case "url":
          this.urlInput = "";
          break;
      }

      this.processedText = "";
      this.sources = [];
      this.topKeywords = [];
      this.showOutput = false;
    },
  },
};
</script>
