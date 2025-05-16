# OutLands


This is an outsourcing platform that allows people to showcase their work, which others can purchase. The platform also includes a forum where users can ask for help from one another or simply exchange experiences on various topics.

Project creators:
- Mark Baranjuk
- Stefan Robalko
- Nikita Tsistokletov

## Main Modules of the OutLands Project
1. Authentication and Registration Module

Files: authController.js, verifyROLE.js, verifySIGN_UP.js
Functions:
- Registering new users with data validation.
- Authenticating users with encrypted password storage.
- Logging out users (logout).
- Verifying roles (guest, user, admin) to restrict access.
- Redirecting to the appropriate page after login/registration.



2. User Management Module

Files: userController.js, user.js
Functions:
- Creating and registering new user accounts.
- Editing personal user information (name, email, password).
- Deleting user accounts (for admins).
- Viewing the list of all users (for admins).
- Managing user profiles in the personal account.



3. Marketplace Module

Files: productController.js, product.js
Functions:
- Publishing new products (design works: textures, 3D models).
- Viewing the product list with category filtering.
- Editing and deleting existing products.
- Allowing guests to view products without purchasing capability.
- Searching products by keywords.



4. Orders Module

Files: orderController.js, order.js, orderItem.js
Functions:
- Creating new purchase orders for products.
- Viewing order history in the personal account.
- Managing orders (confirmation, cancellation) by admins.
- Displaying order details (products, cost).



5. Chats and Messages Module

Files: chatController.js, messageController.js, chat.js, message.js
Functions:
- Creating new chats between users.
- Sending and receiving personal messages.
- Viewing chat message history.
- Managing the list of active chats.



6. Forum Module

Files: forumCategoryController.js, forumPostController.js, topicController.js, forumCategory.js, forumPost.js, topic.js, postVote.js
Functions:
- Creating and viewing forum topics.
- Managing forum categories (creation, editing).
- Posting and commenting in forum topics.
- Voting on posts (likes/dislikes).
- Allowing guests to view the forum without participation.



7. Categories Module

Files: categoryController.js, category.js
Functions:
- Creating new categories for products and forum.
- Editing and deleting existing categories.
- Filtering products and forum topics by categories.



8. Admin Panel Module

Files: userController.js, productController.js, orderController.js, messageController.js
Functions:
- Monitoring user activity and content.
- Moderating products, orders, and messages.
- Editing and deleting data (users, products, orders).
- Managing user roles and access.



9. Navigation Module

Files: React Router (Frontend)
Functions:
- Navigating between pages (home, profile, marketplace, forum, chats).
- Restricting page access based on user role.
- Displaying relevant navigation buttons (Profile, Purchases, Messages, Logout).



10. Balance Management Module

Files: (not explicitly specified, implemented in userController.js)
Functions:
- Adding funds to the user’s balance for purchases.
- Displaying the current balance in the personal account.
- Managing transactions related to orders.





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


## ER Diagram
![image](https://github.com/user-attachments/assets/9e39e5b6-3816-49cb-9ff5-5a27f92baea6)

