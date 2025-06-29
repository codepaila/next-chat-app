
# 💬 CodePaila Chat App

![CodePaila Chat App](https://via.placeholder.com/1200x600.png?text=CodePaila+Chat+App+Demo)

A real-time chat application built with **Next.js 15 (App Router)**, **Socket.io**,  and **NextAuth.js**. This app supports guest and authenticated login, message seen/delivered status.

---

## 🧩 Features

- ✅ Real-time private & group chat (Socket.IO)
- 👤 Google & guest login (NextAuth.js)
- ✍️ Typing indicators
- 🔒 Secure sessions with JWT
- 🎨 Framer Motion animations
- 📱 Fully responsive UI

---

## 📦 Tech Stack

| Tech             | Description                      |
|------------------|----------------------------------|
| **Next.js 15**   | App Router for frontend and APIs |
| **NextAuth.js**  | Authentication                   |
| **Socket.IO**    | Real-time messaging              |
| **Framer Motion**| UI animations                    |
| **Tailwind CSS** | Styling                          |

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/codepaila/next-chat-app.git
cd next-chat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Google Auth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/codepaila?retryWrites=true&w=majority

# Socket
SOCKET_URL=http://localhost:3000
```

---

### 4. Run the app

```bash
npm run dev
```

App will be available at `http://localhost:3000`


---

## 🔄 Deployment Guide

### Option 1: Deploy frontend to **Vercel**

- Vercel doesn’t support persistent WebSockets.
- You must deploy your own Socket.IO backend (Render/Heroku).
- Use `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/socket/:path*",
      "destination": "https://your-socket-server.onrender.com/api/socket/:path*"
    }
  ]
}
```

---

### Option 2: Fullstack deploy (Render/Heroku)

1. Add a `server.js` that creates an HTTP server and attaches `io`.
2. In `package.json`:

```json
"scripts": {
   "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
}
```

3. Deploy using Heroku/Render with MongoDB and secrets.

---

## 🧪 Demo Instructions

- ✅ Open two tabs/browsers and login (Google or Guest)
- 💬 Join the same room and chat in real-time
- ✍️ See typing indicators

---

## 🔐 Authentication

- NextAuth uses JWT for sessions.
- Guest login uses a custom credential provider.
- Google OAuth available via Developer Console.


---

## ✨ Future Improvements

- 📞 Audio/video calling
- 🗑️ Chat delete/edit options
- 📸 File/image sharing
- 🔔 Push notifications

---

## 🧑‍💻 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

Then open a pull request on GitHub!

---

## 🔗 Connect with CodePaila

- 📺 YouTube: [CodePaila](https://youtube.com/@CodePaila)
