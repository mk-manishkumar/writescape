# 📝 Writescape – Blogging Platform

A modern AI feature integrated, full stack Blogging Platform built with **React** (Vite), **Express.js**, **MongoDB**, and **Node.js**. Comes packed with features including admin accounts, rich blog editor, comments, likes, profile management, and secure authentication.

***

`Deployed Link` - [Click here](https://writescape-mk.vercel.app)

***


## 📁 Folder Structure

### Monorepo Structure

```
writescape/
├── client/      # Frontend (React, Vite)
├── server/      # Backend (Express, MongoDB)
```

### Main Directories

#### Frontend (`client/`)
- `public/` – public assets
- `src/`
  - `assets/`      – images, category arrays, etc.
  - `components/`  – shared and feature UI (Navbar, Footer, Admin pages)
  - `context/`     – React context/Provider (AppContext) for auth and global state
  - `pages/`       – Client pages
  - `App.jsx`      – App root
  - `main.jsx`     – Entry point
  - Static files: `.env`, `index.html`, `vite.config.js`  
- Config files: ESLint, Vercel, etc.

#### Backend (`server/`)
- `configs/`      – DB and external services setup (e.g., MongoDB, ImageKit)
- `controllers/`  – Route handler logic (blog, admin, auth, comments)
- `middleware/`   – Authentication, multer, etc.
- `models/`       – Mongoose schemas
- `routes/`       – Route definitions
- Static files: `.env`, `server.js`

***

## 🚀 Features

- **Admin Authentication:** Register and login with hashed passwords.
- **Blog CRUD:** Create, edit, delete, and publish/unpublish your own blogs (rich text with image support).
- **Dashboard:** Overview cards (blogs, drafts, comments, latest blogs) scoped per admin.
- **Profile Management:** Update profile, photo, password; delete account.
- **Comments:** Blog readers can leave comments (pending approval), with profile picture display if commenter is admin.
- **Likes:** Only registered admins can like each other's blogs (one like per blog per admin). Anonymous users see a custom error toast.
- **Newsletter Placeholder:** Newsletter section (frontend UI) ready for integration.
- **Secure:** All protected routes require JWT-authenticated admins.
- **Responsive UI:** Built with modern CSS (Tailwind, custom styles), mobile-ready.

***

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB database (local or Atlas)
- (Optional) ImageKit account for profile/blog images

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/writescape.git
cd writescape
```

### 2. Install dependencies

- **Frontend**
  ```bash
  cd client
  npm install
  ```

- **Backend**
  ```bash
  cd ../server
  npm install
  ```

### 3. Environment Variables

- Copy `.env.sample` to `.env` in both `client/` and `server/`, and fill in:
  - MongoDB URI
  - JWT secret
  - ImageKit credentials
  - Frontend `.env` for VITE_BASE_URL.

### 4. Run in development

Run backend and frontend in separate terminals:

- **Backend**
  ```bash
  cd server
  npm run dev  # or nodemon server.js
  ```

- **Frontend**
  ```bash
  cd client
  npm run dev
  ```

Visit the app at [http://localhost:3000](http://localhost:5173)

***

## 🛡 Admin Features & Permissions

- **Admins** can:
  - Manage (only) their own blogs, dashboard, stats, drafts
  - Approve/delete comments on their blogs
  - Like other admins' blogs only (one like per blog per admin)
  - Edit and manage their own profile
- **Anonymous** users:
  - Can read blogs and comment
  - See like counts, but cannot like

***

## 🧩 Project Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, React Context API, Toast, Moment.js
- **Backend:** Express.js, Mongoose (MongoDB), JWT Auth, Multer (file uploads), ImageKit, Bcrypt, etc.
- **Deployment:** Deployed on Vercel (see `vercel.json`)

***

Here’s the corrected version with grammar fixes:

## 🌟 Customization & Extensions

* Replace the newsletter UI with your mailing service when ready.
* Add analytics for views on each blog.
* Add sharing options for each blog.
* Add a trending section on the homepage for the most viewed blogs.
 

***

## 🤝 Contributing

PRs welcome! For major changes, please open an issue for discussion.  

***

## 📝 License

[MIT](LICENSE) — see LICENSE in the repo.

***

## 👤 Author

Manish Kumar

**Feel free to contact me on [Twitter/X](https://x.com/_manishmk) for feature requests or issues!**



