# M3 Clicker App

This is a tiny full-stack web application designed to track how many times a logged-in user clicks a specific button. It features a React frontend, Firebase Authentication for user management, Cloud Firestore for data storage, and a Node.js backend deployed on Google Cloud Run.

## Table of Contents

1.  [Features](#features)
2.  [Live URLs](#live-urls)
3.  [Tech Stack](#tech-stack)
4.  [Local Development Setup](#local-development-setup)
5.  [Environment Variables](#environment-variables)
6.  [Deployment](#deployment)
7.  [Security Notes](#security-notes)
8.  [AI Usage](#ai-usage)

## Features

*   **User Authentication:** Sign up and log in with email and password via Firebase Authentication.
*   **Click Tracking:** Records and stores a per-user click count in Cloud Firestore.
*   **Real-time Usage Display:** Logged-in users can view their personal click count, which updates in real-time.
*   **Protected API:** A minimal Node.js backend on Cloud Run to handle secure click increments.
*   **Cloud Hosting:** Frontend deployed on Firebase Hosting, backend on Google Cloud Run.

- API:
    - `/`: simply returns "Hello World"
    - `/api/increment-count`: increments the click count for a user whose authorization header is attached to the request.

## Live URLs

*   **Frontend (Firebase Hosting):** `https://m3-oa-47d22.web.app/`
*   **Backend API (Google Cloud Run):** `https://m3-api-892513899277.us-central1.run.app`
- NOTE: UI might be a bit slow because of Cloud Run's cold starts.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite, Shadcn UI
*   **Authentication:** Firebase Authentication (Email/Password)
*   **Database:** Google Cloud Firestore
*   **Backend:** Node.js, Express, TypeScript, Firebase Admin SDK
*   **Hosting:** Firebase Hosting (Frontend), Google Cloud Run (Backend)


## Local Development Setup

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm
*   Google Cloud SDK (gcloud CLI)
*   Firebase CLI
*   A Firebase Project with:
    *   Email/Password authentication enabled.
    *   Cloud Firestore enabled.
    *   Billing plan upgraded to **Blaze** (required for Cloud Run).

### 1. Firebase Project Setup (Console)

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or select an existing one).
2.  **Register a Web App:** In your project, click the `</>` icon to add a web app. Note down the `firebaseConfig` object, you'll need it for the frontend.
3.  **Enable Email/Password Auth:** In the Firebase Console, navigate to `Authentication` > `Sign-in method` tab. Enable `Email/Password`.
4.  **Enable Firestore:** In the Firebase Console, navigate to `Firestore Database`. Click `Create database` and select `Start in production mode` (you'll set up security rules later). Choose a location.
5.  **Generate Service Account Key (for backend local dev):**
    *   In the Firebase Console, go to `Project settings` (gear icon) > `Service accounts` tab.
    *   Click `Generate new private key` > `Generate key`. A JSON file will download.
    *   Rename this file (e.g., `serviceAccountKey.json`) and place it securely in your **`backend/`** directory. **DO NOT commit this file to Git!**

### 2. Frontend Setup (`frontend/` directory)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jng9230/m3-oa
    cd m3-oa/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:** See [Environment Variables](#environment-variables) for required variables.
4.  **Start development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` by default.

### 3. Backend Setup (`backend/` directory)

1.  **Navigate to the backend directory:**
    ```bash
    cd m3-oa/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:** See [Environment Variables](#environment-variables) for required variables. Place your downloaded `serviceAccountKey.json` here.
4.  **Start development server:**
    ```bash
    npm run dev
    ```
    The backend API will be available at `http://localhost:3000` by default.

## Environment Variables

### Frontend (`frontend/.env`)

Create a file named `.env` in your `frontend/` directory.

```env
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"

# API URL for local development (update with Cloud Run URL for production deployment)
VITE_API_BASE_URL="http://localhost:3000"```
*Replace `YOUR_FIREBASE_...` values with the `firebaseConfig` object you got from the Firebase Console.*
```

### Backend (`backend/.env`)

Create a file named `.env` in your `backend/` directory. **DO NOT commit this file or `serviceAccountKey.json` to Git!**

```env
NODE_ENV=development
# Path to your downloaded Firebase Admin SDK service account key file
FB_SVC_ACCOUNT_PATH="./serviceAccountKey.json" 

# Frontend origin for local CORS (your React dev server)
FRONTEND_ORIGIN="http://localhost:5173"
```

---

## Deployment

Deployment consists of deploying the frontend to Firebase Hosting and the backend to Google Cloud Run.

### Prerequisites for Deployment

*   **Firebase Project Plan:** Your Firebase project **must** be on the **Blaze** (pay-as-you-go) plan. This is required for using Google Cloud Run.
*   **Google Cloud SDK (gcloud CLI) configured:**
    ```bash
    gcloud auth login
    gcloud config set project YOUR_FIREBASE_PROJECT_ID
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com
    ```
*   **Firebase CLI installed and logged in:**
    ```bash
    npm install -g firebase-tools
    firebase login
    ```

### 1. Deploy Frontend to Firebase Hosting

1.  **Navigate to your frontend project's root:**
    ```bash
    cd frontend/
    ```
2.  **Run `firebase init hosting` (if not done, or to re-confirm project):**
    *   Select your existing Firebase project.
    *   Public directory: `dist`
    *   Configure as single-page app: `Y`
    *   Overwrite `index.html`: `N`
3.  **Build your frontend for production:**
    ```bash
    npm run build
    ```
    This creates the `dist` folder.
4.  **Deploy to Firebase Hosting:**
    ```bash
    firebase deploy --only hosting
    ```
    Note down the **Hosting URL** provided by the CLI (e.g., `https://m3-oa-47d22.web.app`). You'll need this for the backend CORS configuration.

### 2. Deploy Backend to Google Cloud Run

1.  **Navigate to your backend project's root:**
    ```bash
    cd backend/
    ```
2.  **Build your backend for production:**
    ```bash
    npm run build
    ```
    This creates the `dist` folder with compiled JavaScript.
3.  **Deploy to Cloud Run:**
    *   **IMPORTANT:** Replace `YOUR_SERVICE_NAME` with a unique name (e.g., `m3-api`).
    *   **IMPORTANT:** Replace `YOUR_FIREBASE_HOSTING_URL` with the actual URL you got from Firebase Hosting in the previous step.
    *   **IMPORTANT:** Replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID (e.g., `m3-oa-47d22`).

    ```bash
    gcloud run deploy YOUR_SERVICE_NAME \
      --source . \
      --region us-central1 \
      --platform managed \
      --allow-unauthenticated \
      --port 8080 \
      --project YOUR_FIREBASE_PROJECT_ID \
      --set-env-vars NODE_ENV=production \
      --set-env-vars FRONTEND_ORIGIN=https://YOUR_FIREBASE_HOSTING_URL.web.app
    ```
    (You might need to run this as a single continuous line in PowerShell.)

    After deployment, Cloud Run will provide a **Service URL** (e.g., `https://your-service-name-xxxxx-uc.a.run.app`). Copy this URL.

### 3. Update Frontend API URL and Redeploy

This is the final step to connect your frontend to the deployed backend.

1.  **Navigate back to your frontend project's root:**
    ```bash
    cd frontend/
    ```
2.  **Update `frontend/.env`:** Open your `frontend/.env` file and change `VITE_API_BASE_URL` to your **Cloud Run Service URL**.
    ```env
    # frontend/.env
    VITE_API_BASE_URL="https://YOUR_CLOUD_RUN_SERVICE_URL.a.run.app"
    ```
3.  **Re-build your frontend:**
    ```bash
    npm run build
    ```
4.  **Re-deploy your frontend to Firebase Hosting:**
    ```bash
    firebase deploy --only hosting
    ```

Your full-stack application should now be live and connected!


## Security Notes

*   **Firebase Authentication:**
    *   User credentials (email/password) are handled securely by Firebase Auth. Passwords are never stored in plain text but are cryptographically hashed using `scrypt`.
    *   Authentication tokens (Firebase ID Tokens) are industry-standard JWTs, signed by Google, ensuring their integrity and authenticity.

*   **Firestore Security Rules:**
    *   The below example allows authenticated users to *read* their own `users/{userId}` document.
    *   For the `clickCount`, direct client-side *writes* from the frontend are **denied** (`allow write: if false;`). This enforces that all modifications to the click count must go through the backend API.
    *   **Example Rule (`firestore.rules`):**
        ```firestore
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{userId} {
              allow read: if request.auth.uid == userId;
              // Allow writes *only* from the Admin SDK (i.e., your backend)
              // Deny direct client writes to prevent unauthorized increments
              allow write: if false; // Deny all direct client writes for this path
            }
          }
        }
        ```

*   **Backend API Authentication & Authorization (Cloud Run):**
    *   **Token Verification:** The backend `verifyFirebaseToken` middleware intercepts incoming requests, extracts the Firebase ID Token from the `Authorization: Bearer` header, and uses the **Firebase Admin SDK** (`admin.auth().verifyIdToken()`) to verify its authenticity and expiration. This confirms the request is from a legitimate, authenticated user.
    *   **User Identification:** The verified token's `uid` is then used to identify the user for specific actions (e.g., incrementing *their own* `clickCount`). This ensures a user can only affect their own data.
    *   **Admin SDK Privileges:** The Firebase Admin SDK, running on Cloud Run, has elevated privileges and can bypass Firestore Security Rules if needed. This means the backend is the trusted gatekeeper for sensitive database operations.

*   **CORS Configuration:**
    *   The backend's Express server uses the `cors` middleware, configured to only accept requests from your deployed Firebase Hosting frontend URL (`FRONTEND_ORIGIN` environment variable).
    *   This prevents other malicious websites from making cross-origin requests to your API.

*   **Environment Variable Management:**
    *   Sensitive information like Firebase API keys for the frontend (while public-facing) are managed via `.env` files and not committed to source control.
    *   The Firebase Admin SDK for the backend uses Google Cloud's default service account credentials on Cloud Run, which is a secure, managed solution. Local development uses a securely stored service account key file.


## AI Usage
- AI was used to generate small chunks of code (<10 lines at a time) and to help write this documentation.