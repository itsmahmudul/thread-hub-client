# 🔗 ConnectForum - A MERN Stack Discussion Platform

Welcome to **ConnectForum**, a modern online discussion forum built using the **MERN stack** (MongoDB, Express, React, Node.js) with Firebase authentication and payment integration. This platform allows users to post content, engage in discussions, and gain reputation through upvotes, comments, and memberships — all in a sleek, responsive UI.

---

## 🚀 Live Site

🌐 [Visit ConnectForum Live](https://your-live-site-link.com)

---

## 📌 Purpose

The goal of this project is to demonstrate advanced full-stack development skills by building a scalable and interactive forum platform focused on user experience, secure data handling, and dynamic admin/user management features.

---

## 🔑 Key Features

### 👥 Authentication
- Firebase Email/Password Login & Social Login
- JWT-based authentication (Token stored in localStorage)
- Role-based routes (User/Admin)

### 🏠 Homepage
- Responsive search by tags (Backend powered)
- Recent popular search suggestions
- Dynamic tag cloud
- Post sorting by popularity
- Pagination (5 posts per page)

### 📝 Post Features
- Create, read, vote, comment, and share posts
- Limit of 5 posts for normal users
- Post visibility toggle (Optional Feature)
- Post details page with upvote/downvote logic
- Comment system with report & feedback feature
- Social sharing (react-share)

### 💬 Comments & Reports
- Add multiple comments per post
- Report system with feedback selector
- Comment truncation with "Read More" modal
- Comment table with dynamic status handling

### 💎 Membership System
- Stripe/SSLCommerz payment for membership
- Gold Badge for members
- Bronze Badge for registered users
- Members can post unlimited content

### 🧑 User Dashboard
- My Profile (with About Me edit)
- My Posts (manage, delete, report, comment)
- Add Post (with React Select tag picker)
- Badge display based on status

### 🛡️ Admin Dashboard
- Admin profile with pie chart stats
- Manage Users (role assign, membership status)
- Manage Reported Comments (take action)
- Make Announcements
- Add Tags for post system

---

## 🖼️ Admin Features (Bonus Tasks)
- Add & manage tags via dashboard
- Pie chart showing users/posts/comments
- Report handling like a Facebook group admin
- Axios Interceptor for token handling

---

## 📱 Responsive Design

The UI is fully responsive for **Mobile**, **Tablet**, and **Desktop** using Tailwind CSS. The color palette and spacing ensure a clean, eye-pleasing layout that impresses recruiters and users alike.

---

## 🔒 Security & Best Practices

- Firebase keys secured via `.env` variables
- MongoDB credentials stored in `.env`
- Protected routes with JWT token
- Deployment CORS/Reload issues handled
- Domain authorized in Firebase Auth

---

## 📦 NPM Packages Used

### 🔧 Client Side
- `react-router-dom`
- `react-hook-form`
- `firebase`
- `axios`
- `@tanstack/react-query`
- `react-select`
- `react-awesome-button`
- `react-share`
- `react-icons`
- `recharts` (for admin pie chart)
- `jwt-decode`

### 🛠 Server Side
- `express`
- `cors`
- `mongodb`
- `jsonwebtoken`
- `dotenv`
- `stripe` (or your payment library)

---

## 📁 Folder Structure (Overview)

