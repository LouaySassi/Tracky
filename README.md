# 💰 Tracky - Personal Finance Tracker

A local-first personal finance tracker that runs entirely on your computer. No internet required, no cloud services, just a simple desktop app that opens in your browser.

![Tracky Banner](public/icon.png)

## ✨ Features

- 💾 **100% Local** - All data stored on your computer
- 🔒 **Private** - No internet required, your data never leaves your machine
- 📊 **Budget Tracking** - Monthly bills, expenses, and remaining funds
- 🎯 **Goals** - Set and track financial goals
- 💰 **Savings** - Track total savings over time
- 📈 **Analytics** - View spending trends and insights
- 🌐 **Browser-Based** - Opens in your default browser (Chrome, Firefox, Opera GX, etc.)
- 🎨 **Clean UI** - Simple, calm light-mode interface

---

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Windows 10/11** (tested on Windows)

### **Installation**

1. **Download or Clone this repository:**
   ```bash
   git clone https://github.com/LouaySassi/Personal-Finance-Tracker.git
   cd Personal-Finance-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the frontend:**
   ```bash
   npm run build
   ```

4. **Create desktop shortcut:**
   ```powershell
   .\create-desktop-shortcut.bat
   ```

5. **Done!** Double-click the **Tracky** icon on your Desktop to launch! 🎉

---

## 📖 Detailed Setup Guide

### **Step 1: Install Node.js**

1. Download Node.js from: https://nodejs.org/
2. Run the installer (use recommended version)
3. Verify installation:
   ```bash
   node --version
   # Should show: v20.x.x or higher
   ```

### **Step 2: Install Project Dependencies**

Open PowerShell or Command Prompt in the project folder and run:

```bash
npm install
```

This installs:
- React & React Router (frontend)
- Express.js (backend server)
- Better-SQLite3 (local database)
- Tailwind CSS (styling)
- And other dependencies

**Expected output:**
```
added 500+ packages in 30s
```

**If you get errors:**
```bash
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

### **Step 3: Build the Frontend**

```bash
npm run build
```

This compiles your React app into static files in the `dist/` folder.

**Expected output:**
```
✓ built in 5.2s
dist/index.html                   0.48 kB
dist/assets/index-[hash].css     18.01 kB
dist/assets/index-[hash].js     634.76 kB
```

### **Step 4: Create Desktop Shortcut**

Run the batch file:

```batch
.\create-desktop-shortcut.bat
```

Or create manually:
1. Right-click Desktop → New → Shortcut
2. Browse to: `launch-tracky.bat` in your project folder
3. Name it: `Tracky`
4. Right-click shortcut → Properties → Change Icon
5. Browse to: `public/icon.ico`

---

## 🎯 How to Use

### **Starting Tracky**

1. **Double-click** the **Tracky** icon on your Desktop
2. A command window opens showing server status:
   ```
   ============================================
      TRACKY - Finance Tracker
   ============================================
   
   Starting server...
   
   💰 Tracky Server Running!
   📊 Dashboard: http://localhost:3000
   💾 Database: C:\Users\[YourName]\AppData\Roaming\Tracky\tracky.db
   
   ✅ Browser opened!
   
   💡 Keep this window open while using Tracky
   ⚠️  Close this window to stop the server
   ```
3. Your browser opens automatically at `http://localhost:3000`
4. Start tracking your finances!

### **Stopping Tracky**

Simply **close the command window** - the server will stop and your data is saved.

### **Accessing Your Data**

Your database is stored at:
```
%APPDATA%\Tracky\tracky.db
```

Full path example:
```
C:\Users\LouaySassi\AppData\Roaming\Tracky\tracky.db
```

---

## 🛠️ Development

### **Run in Development Mode**

```bash
# Terminal 1: Start backend server
npm run dev:backend

# Terminal 2: Start frontend dev server
npm run dev:frontend

# Or run both at once:
npm run dev
```

Frontend dev server: `http://localhost:5173`  
Backend API server: `http://localhost:3000`

### **Project Structure**

```
Personal-Finance-Tracker/
├── server/                    # Backend Express server
│   ├── index.js              # Main server file
│   ├── database.js           # SQLite database setup
│   └── routes/               # API endpoints
│       ├── data.js           # Financial data CRUD
│       └── settings.js       # Settings CRUD
├── src/                      # React frontend
│   ├── api/
│   │   └── client.ts         # API client
│   ├── components/           # UI components
│   ├── pages/                # Dashboard & Analytics
│   ├── types.ts              # TypeScript types
│   └── App.tsx               # Main app component
├── public/
│   ├── icon.ico              # App icon (Windows)
│   └── icon.png              # App icon (PNG)
├── dist/                     # Built frontend (after npm run build)
├── launch-tracky.bat         # Launcher script
└── package.json              # Dependencies & scripts
```

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend in dev mode |
| `npm run dev:frontend` | Run frontend dev server only |
| `npm run dev:backend` | Run backend server only |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |

---

## 🗄️ Database Schema

Tracky uses SQLite with the following tables:

### **settings**
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  default_salary REAL NOT NULL DEFAULT 1300,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### **monthly_data**
```sql
CREATE TABLE monthly_data (
  month_key TEXT PRIMARY KEY,        -- Format: YYYY-MM
  data TEXT NOT NULL,                -- JSON string of all month data
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

All your financial data (bills, expenses, goals, transactions) is stored as JSON in the `data` column.

---

## 🔧 Troubleshooting

### **"Cannot find module 'express'" Error**

**Solution:**
```bash
npm install
```

### **"Port 3000 is already in use"**

**Solution 1:** Close other apps using port 3000

**Solution 2:** Change the port in `server/index.js`:
```javascript
const PORT = 3001; // Change to any free port
```

Also update `src/api/client.ts`:
```typescript
const API_BASE = 'http://localhost:3001/api';
```

### **Browser doesn't open automatically**

**Solution:** Manually open your browser and go to:
```
http://localhost:3000
```

### **"Cannot load because running scripts is disabled"**

**Solution:** Use the `.bat` file instead of `.ps1` file, or run:
```powershell
powershell -ExecutionPolicy Bypass -File .\create-desktop-shortcut.ps1
```

### **Reset all data**

Delete the database folder:
```
%APPDATA%\Tracky
```

Or via PowerShell:
```powershell
Remove-Item -Recurse -Force "$env:APPDATA\Tracky"
```

---

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + Node.js
- **Database:** SQLite3 (better-sqlite3)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts

---

## 🎨 Customization

### **Change Default Salary**

Edit in the app: Dashboard → Click salary amount → Enter new default

Or directly in database:
```sql
UPDATE settings SET default_salary = 2000 WHERE id = 1;
```

### **Change App Icon**

Replace these files:
- `public/icon.ico` (Windows icon)
- `public/icon.png` (PNG version)

Then recreate the desktop shortcut.

### **Change App Colors**

Edit `tailwind.config.js`:
```javascript
colors: {
  sage: '#8B9D83',      // Main accent color
  'dark-bg': '#1a1a1a', // Background
  // ... add your colors
}
```

---

## 📝 Data Backup

Your data is automatically saved to:
```
%APPDATA%\Tracky\tracky.db
```

**To backup:**
1. Close Tracky
2. Copy `tracky.db` to a safe location
3. To restore: Replace the file with your backup

**Automatic backup script:**
```powershell
# backup-tracky.ps1
$source = "$env:APPDATA\Tracky\tracky.db"
$backup = "$env:USERPROFILE\Desktop\tracky-backup-$(Get-Date -Format 'yyyy-MM-dd').db"
Copy-Item $source $backup
Write-Host "Backup created: $backup"
```

---

## 🔐 Security & Privacy

- ✅ **No internet connection required**
- ✅ **No data sent to any server**
- ✅ **No tracking or analytics**
- ✅ **No account registration**
- ✅ **All data stored locally on your computer**
- ✅ **Open source - audit the code yourself**

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

MIT License - feel free to use this project however you like!

---

## 👤 Author

**Louay Sassi**
- GitHub: [@LouaySassi](https://github.com/LouaySassi)

---

## 🙏 Acknowledgments

- Inspired by Jupyter Notebook's browser-based approach
- Built with modern web technologies
- Designed for simplicity and privacy

---

## 📞 Support

Having issues? 

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Make sure you're running Node.js v18+

---

## 🎉 Quick Reference

```bash
# First time setup
npm install
npm run build
.\create-desktop-shortcut.bat

# Daily use
# Just double-click "Tracky" on Desktop!

# Update after code changes
npm run build

# Development mode
npm run dev
```

---

**Enjoy tracking your finances with Tracky! 💰**