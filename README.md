# Callix
Callix is a real-time messaging and calling application with support for group chats, authentication, video calls, and more.  
Built with React on the frontend and Node.js on the backend.

![Callix Logo](/frontend/my-project/public/callix-logo.ico)



## 🚀 Technologies Used

### **Frontend**
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Zustand (state management)
- WebRTC (real-time communication)
- PeerJS

### **Backend**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- MongoDB (via Mongoose)
- Cloudinary (for image uploads)
- reCAPTCHA
- WebSocket (via Socket.io)


## 📁 **Project Structure**

```bash
Callix/
├── backend/                  # Node.js + Express backend
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── cert.pem / key.pem    # SSL certificates (dev)
│   └── src/
│       ├── index.js          # Entry point
│       ├── controllers/      # Route controllers (auth, group, message)
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API route definitions
│       ├── middleware/       # Auth and validation middleware
│       └── lib/              # Utilities (DB, socket, cloudinary, etc.)

├── frontend/
│   └── my-project/           # React + Vite frontend
│       ├── .env
│       ├── package.json
│       ├── index.html
│       ├── public/           # Static assets (icons, sounds)
│       ├── src/
│       │   ├── main.jsx      # Entry point
│       │   ├── App.jsx
│       │   ├── index.css
│       │   ├── constants/    # App constants
│       │   ├── components/   # UI components (chat, call, modals, etc.)
│       │   ├── pages/        # Page views (Login, Signup, Profile, etc.)
│       │   ├── store/        # Zustand stores
│       │   └── lib/          # Axios, socket, utils
│       ├── tailwind.config.js
│       └── vite.config.js

```
## ⚙️ **Getting Started**

### **Clone the repository**
```bash
git clone https://github.com/pedr0147/Callix.git
cd Callix

##Backend
cd backend
npm install
npm run dev
⚠️ Make sure to create a .env file with the required environment variables.

##Frontend
cd frontend/my-project
npm install
npm run dev
```
📦 **Environment Variables**

Create a .env file in both backend/ and frontend/my-project/.
```bash
##Example .env for Backend

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_api_key
RECAPTCHA_SECRET=your_recaptcha_secret

--------------------------------------------

##Example .env for Frontend

VITE_API_URL=http://localhost:5000
VITE_RECAPTCHA_SITE_KEY=your_site_key
```
## **✅ Features**

- **User Registration & Authentication**
  - Secure JWT-based login system
  - Session management with cookies

- **Account Management**
  - Change password
  - Upload and update profile photo
  - Account deletion with confirmation

- **Real-Time Communication**
  - One-to-one and group chat in real time
  - WebSocket-based message delivery
  - Online user detection

- **Security**
  - reCAPTCHA integration (partially implemented)
  - Input validation and authentication middleware


## 🧪 **Future Improvements**

- **Conference Call Support (multi-user)**
  - Implement Mesh or SFU (MediaSoup, Janus)
  - Create virtual rooms for multiple participants

- **Push Notifications & User Presence**
  - Web Push API + fallback (email/SMS)
  - Typing indicator and online/offline presence

- **Offline Messaging Support**
  - Queue messages when recipient is offline
  - Use IndexedDB for local storage
  - Visual badge for unread messages

- **Call Statistics and Quality Monitoring**
  - Show real-time RTT, bitrate, packet loss, etc.
  - Post-call reports with user rating and tech data

- **Production Deployment**
  - Domain with SSL via Let’s Encrypt
  - GitHub Actions + Docker + No-IP for deploy
  - Redis for caching and multi-instance sync
  - Full reCAPTCHA integration
