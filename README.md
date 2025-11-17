# 💰 Tracky - Finance Tracker Desktop App

A local-first personal finance tracker that runs as a Windows desktop application with 100% offline functionality.

## 🚀 Quick Start

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm run dev
   ```
   
   This will:
   - Start the backend server on `http://localhost:3000`
   - Start the frontend development server
   - Open your browser automatically

### Build Windows EXE

1. **Build the desktop app:**
   ```bash
   npm run build:electron
   ```

2. **Find your EXE on Desktop:**
   - Location: `C:\Users\LouaySassi\Desktop\Tracky-Build\Tracky-Setup-1.0.0.exe`
   - Double-click to install
   - Desktop shortcut will be created automatically

## 💾 Data Storage

- All data stored in SQLite database
- Location: `%APPDATA%/Tracky/tracky.db`
- Persists forever unless manually deleted
- No internet required

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + SQLite (better-sqlite3)
- **Desktop:** Electron 32
- **UI:** Tailwind CSS + Lucide Icons

## 📝 Available Scripts

- `npm run dev` - Run in development mode
- `npm run build:electron` - Build Windows EXE (output to Desktop)
- `npm run dev:backend` - Run backend only
- `npm run dev:frontend` - Run frontend only
- `npm start` - Run Electron app

## ✨ Features

- ✅ 100% offline - no internet required
- ✅ Local SQLite database
- ✅ Auto-opens in browser
- ✅ Clean light-mode UI
- ✅ Monthly budget tracking
- ✅ Goals & savings
- ✅ Transaction history
- ✅ Analytics dashboard

## 📍 Build Output Location

The EXE will be created at:
```
C:\Users\LouaySassi\Desktop\Tracky-Build\Tracky-Setup-1.0.0.exe
```

## 🔧 Troubleshooting

### If npm install fails on better-sqlite3:

```bash
# Install Visual Studio Build Tools
npm install --global windows-build-tools

# Then retry
npm install
```

### To reset all data:

Delete this folder:
```
%APPDATA%/Tracky
```

---

Built with ❤️ by LouaySassi