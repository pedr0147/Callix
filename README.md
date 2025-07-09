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

adicionar estrutura


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
- **Push Notifications & User Presence**
- **Offline Messaging Support**
- **Call Statistics and Quality Monitoring**
- **Production Deployment**
