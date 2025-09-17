# 📧 Email Manager

A full-stack web application to fetch, categorize, and manage emails.  
Built with **React (Frontend)**, **Node.js + Express (Backend)**, and **MongoDB (Database)**.  
Deployed on **Render**.

---

## 🚀 Live Demo

- 🌐 **Frontend:** [https://email-manager-frontend.onrender.com](https://email-manager-frontend.onrender.com)  
- ⚙️ **Backend API:** [https://email-manager-backend-aq68.onrender.com](https://email-manager-backend-aq68.onrender.com)

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Deployment:** Render
- **Email Use As BCC:** sales.finigenie@gmail.com  

---

## 📂 Project Structure

```
project-root/
│── frontend/       # React frontend
│── backend/        # Node.js + Express + MongoDB backend
│── README.md
```

---

## 🖥️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/arjun5354/Email-Manager.git
cd Email-Manager
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside **backend/** with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run the backend:
```bash
npm run dev   # for development (nodemon)
npm start     # for production
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌍 Deployment

- **Backend:** Render → set **Root Directory** = `backend`, Build Command = `npm install`, Start Command = `npm start`.  
- **Frontend:** Render (Static Site) → set **Root Directory** = `frontend`, Build Command = `npm install && npm run build`, Publish Directory = `dist`.

---

## ✨ Features

- Fetches emails from Gmail using IMAP.  
- Categorizes emails automatically (Business Lead, Report, General).  
- Stores emails in MongoDB.  
- Dashboard to view and filter emails.  
