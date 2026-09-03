# Plagiarism Checker

A simple web-based plagiarism detection system developed during an internship project.

The application allows users to check text similarity from **direct text input, uploaded files, or URLs**, then displays the detected plagiarism score and sentence-level results.

## Features

- 🔎 Check plagiarism from text input
- 📄 Upload and analyze document files
- 🌐 Check content from a URL
- 📊 Display plagiarism score and detection results
- ✂️ Text preprocessing for better comparison
- 🔐 User authentication support
- 💾 MySQL database integration
- ⚡ REST API with Express.js

## Tech Stack

### Frontend
- Vue.js
- Bootstrap
- JavaScript

### Backend
- Node.js
- Express.js
- Puppeteer
- Natural
- PDF Parse
- Multer

### Database
- MySQL

## Project Structure

```text
Plagiarism_Checker/
├── backend/        # REST API and plagiarism processing
├── frontend/       # Vue.js web interface
└── README.md
```

## How It Works

```text
User Input
   │
   ├── Text
   ├── File
   └── URL
        │
        ▼
   Text Extraction
        │
        ▼
   Preprocessing
        │
        ▼
   Similarity Checking
        │
        ▼
   Plagiarism Score
        │
        ▼
   Result Display
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/FirstyatamaAuzan/Plagiarism_Checker.git
cd Plagiarism_Checker
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file and configure your environment variables, such as database and API configuration.

Then run:

```bash
npm start
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=plagiarism_checker

API_URL=
SECRET_CODE=
```

Adjust the values according to your local configuration.

## Use Cases

This project can be used as a foundation for:

- Academic plagiarism checking
- Document similarity analysis
- Research and educational applications
- Web content comparison

## Project Purpose

This project was developed as part of an **internship project** to implement a web-based plagiarism checking system and explore text processing, similarity analysis, backend API development, and database integration.

## Author

**Firstyatama Auzan Farhadi**

Informatics Student | Software & Web Development

---

⭐ Feel free to explore, use, and improve this project.
