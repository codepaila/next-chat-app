// src/types/environment.d.ts
namespace NodeJS {
    interface ProcessEnv {
      // Authentication (Auth.js)
      AUTH_SECRET: string;          // Secret for signing JWTs in Auth.js
      AUTH_URL: string;             // Base URL for authentication redirects
      AUTH_GOOGLE_CLIENT_ID: string; // Google OAuth Client ID
      AUTH_GOOGLE_CLIENT_SECRET: string; // Google OAuth Client Secret
  
      // Database
      DATABASE_URL: string;         // MongoDB connection URL
  
      // Encryption
      AES_SECRET: string;           // Secret for AES encryption of passwords
  
      // Public URLs
      NEXT_PUBLIC_API: string;      // Public API URL (optional, if used)
      NEXT_PUBLIC_URL: string;      // Public app URL (e.g., http://localhost:3000)
  
      // Email Sending (Nodemailer)
      EMAIL_HOST: string;           // SMTP host (e.g., smtp.gmail.com)
      EMAIL_PORT: string;           // SMTP port (e.g., 587)
      EMAIL_USER: string;           // Email username (e.g., Gmail address)
      EMAIL_PASS: string;           // Email password (e.g., Gmail App Password)
  
      // Optional/Redundant (included for flexibility)
      JWT_SECRET?: string;          // Optional custom JWT secret (if not using AUTH_SECRET)
      GOOGLE_AUTH_EMAIL?: string;   // Alias for EMAIL_USER (optional)
      GOOGLE_AUTH_PASS?: string;    // Alias for EMAIL_PASS (optional)
    }
  }