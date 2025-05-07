# OutLands


This is an outsourcing platform that allows people to showcase their work, which others can purchase. The platform also includes a forum where users can ask for help from one another or simply exchange experiences on various topics.




## Project Setup Guide

Follow these steps to set up the development environment for the **OutLands** project.

---

## 1. Install Node.js

Download and install **Node.js v22 or higher** from [nodejs.org](https://nodejs.org/en/download).

To verify the installation, open **cmd** and run:

```bash
node -v  # Should show v22.x or higher
```

---

## 2. Set Up XAMPP/WAMP

### Installation

Download and install:

- [XAMPP](https://www.apachefriends.org/index.html)
- OR
- [WAMP](https://www.wampserver.com/en/)

### Launch Services

1. Open the **XAMPP Control Panel** or **WAMP system tray icon**.
2. Start the following services:
   - **Apache** → click `Start`  
     _Wait for the status to turn green_
   - **MySQL** → click `Start`  
     _Wait for the status to turn green_

---

## 3. Environment Setup

If you're starting the project locally:

1. Go to the `backend` directory.
2. Create a `.env` file.
3. Fill it based on the `.envexample` file:

```env
PORT=your-port-for-backend
DB_HOST=your-db-host (e.g. localhost)
DB_USER=your-db-username
DB_PASS=your-db-password
DB_NAME=your-db-name
DB_DIALECT=your-db-dialect (e.g. mysql)
secret=your-secret-key
EMAIL=your-email-for-node-mailer
PASSWORD=your-application-password-for-node-mailer
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

---

## 4. Creating a Database in phpMyAdmin

Before running `createTables.js`, you need to manually create your database:

1. Open [phpMyAdmin](http://localhost/phpmyadmin) in your browser.
2. Log in with:
   - Username: `root`
   - Password: (leave empty or use your MySQL password)
3. Create a new database:
   - Go to the **Databases** tab
   - Under "Create database", enter your database name (must match `DB_NAME` in your `.env` file)
   - Select `utf8_general_ci` as collation
   - Click **Create**
4. Verify the database:
   - The new database should appear in the left sidebar
   - It should be empty (no tables yet)

---

## 5. Running the Application

### Backend

1. Open terminal in the `backend` folder:
   - **In VS Code:**
     - Right-click the `backend` folder in Explorer
     - Select "Open in Integrated Terminal"
   - **In System Terminal:**

```bash
cd path/to/your/project/backend
```

2. Install required packages:

```bash
npm install
```

### Frontend

3. Open terminal in the `frontend` folder:
   - **In VS Code:**
     - Right-click the `frontend` folder in Explorer
     - Select "Open in Integrated Terminal"
   - **In System Terminal:**

```bash
cd path/to/your/project/frontend
```

4. Install required packages:

```bash
npm install
```

### Create Tables and Run Backend

5. In your backend terminal, run:

```bash
node config/createTables.js
```

This will:

- Create all database tables
- Populate them with initial test data
- Output success messages when complete

6. Make sure you're in the `backend` directory and run:

```bash
node index.js
```

You should see:

```
Server running on port [YOUR_PORT]
Database connection established
```

7. In the frontend terminal, run:

```bash
npm start
```

---

## Email Setup for Nodemailer (Gmail)

To enable email functionality (e.g., for account verification or notifications), you'll need to configure Nodemailer using a Gmail account.

### 1. Create or Use a Gmail Account

Set up a dedicated Gmail account to be used exclusively for sending emails via Nodemailer.

### 2. Enable Gmail Access for Nodemailer

#### Use an App Password (if 2-Step Verification is enabled)

1. Go to your [Google Account Security Settings](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to the **App Passwords** section
4. Select:
   - App: **Mail**
   - Device: **Other (Custom Name)** – name it e.g., "Nodemailer"
5. Click **Generate**. Google will provide you with a 16-character app password.
6. Use this password in your `.env` file instead of your regular Gmail password.

#### Alternative: Allow Less Secure Apps (Deprecated and Not Recommended)

1. Visit [https://myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps)
2. Turn on access for less secure apps

> Note: Google recommends using App Passwords. The "less secure apps" option is deprecated and may not be available in your account.

---

## Main Features

| Feature             | Description                                                         |
|---------------------|---------------------------------------------------------------------|
| User Authentication | Register/Login to access your personal account                      |
| Balance Management  | Add funds to your account's wallet                                  |
| Marketplace         | Browse, publish, and purchase products                              |
| Community Forum     | Engage in discussions, ask questions, and share knowledge           |

---

## Diagram

Placeholder for diagram...
