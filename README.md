# OutLands
## Instruction
1. Install Node.js, version 22 or higher, from https://nodejs.org/en/download;
2. Install xampp or wamp, u can download it here: https://www.apachefriends.org/index.html (for xampp) or https://www.wampserver.com/en/ (for wamp);
4. If you are planning to start the project locally, create an .env file in backend directory and fill like shown in .envexample file;
5. Before launching the project, open terminal in backend directory (if you are using VS code, click on backend folder with right mouse button and press "Open in integrated terminal". In case you are using something else, you can open it in your terminal maually with ```cd 'your_path_to_backend_directory' ```) and run ```npm install``` comand. Do the same for frontend directory.
6. Run ```node config/createTables.js``` command in backend directory to create tables with test data in your database;
7. In backend directory terminal start backend server with ```node index.js``` command;
7 .In frontend directory terminal start frontend server with ```npm start``` command;
   
## 📧 Email Setup for Nodemailer (Gmail)

To enable email functionality (e.g., for account verification or notifications), you'll need to configure Nodemailer using a Gmail account.

### 1. Create or Use a Gmail Account
Set up a dedicated Gmail account to be used exclusively for sending emails via Nodemailer.

### 2. Enable Gmail Access for Nodemailer

#### Use an App Password (if 2-Step Verification is enabled)
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Enable **2-Step Verification**.
3. After enabling it, go to the **App Passwords** section.
4. Select:
   - App: **Mail**
   - Device: **Other (Custom Name)** – you can name it e.g., "Nodemailer"
5. Click **Generate**. Google will provide you with a 16-character app password.
6. Use this password in your `.env` file in place of your regular Gmail password.

#### ❌ Alternative: Allow Less Secure Apps *(Deprecated and not recommended)*
1. Visit [https://myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps)
2. Turn on access for less secure apps (this option may be disabled or removed by Google at any time).

> ⚠️ Google recommends using App Passwords. The "less secure apps" option is deprecated and may not be available in your account.


## Main Functions
🔐 User Authentication Registration/Login to access your personal account.

💳 Balance Management Adding funds to your account's wallet.

🛍️ Marketplace Browse, publish, and purchase products.

💬 Community Forum Engage in discussions, ask questions, and share knowledge with others on forum.

## Diagramm
Place for diagramm ...
