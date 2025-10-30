# 🧩 Multiplayer Grid Application

A real-time multiplayer web application where players interact on a **shared 10×10 grid** by placing Unicode characters.  
Built with **React, Node.js, Express, TypeScript, and Socket.io**, this project demonstrates live collaboration, synchronization, and timed user restrictions.

---

## 🚀 Features

- 🟩 **Shared 10×10 Interactive Grid** — All players see and interact with the same grid in real time.
- ⚡ **Real-time Updates via Socket.io** — Any player’s change instantly reflects on all connected clients.
- 👥 **Online Player Counter** — Displays how many users are currently connected.
- 🔤 **Unicode Character Placement** — Players can place any Unicode character into a cell.
- ⏳ **Timed Restriction (1-Minute Cooldown)** — After submitting, a player must wait 60 seconds before updating again.
- 🕒 **Historical Time Travel** — View and replay past grid states using a slider.
- 📱 **Responsive UI** — Optimized layout for desktop and mobile.

---

## 🧰 Tech Stack

| Layer                       | Technology                                   |
| --------------------------- | -------------------------------------------- |
| **Frontend**                | React.js (TypeScript)                        |
| **Backend**                 | Node.js, Express (TypeScript)                |
| **Real-Time Communication** | Socket.io                                    |
| **Styling**                 | CSS (custom design inspired by reference UI) |

---

## 🤖 AI Tools Disclosure

> This project was developed with assistance from **ChatGPT (OpenAI GPT-5)** for debugging, refactoring, and structuring code.  
> All logic and implementation were verified and tested manually by **Rishabh Mishra**.

---

## 🗂️ Project Structure

multiplayer-grid-app/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── services/ # Socket.io client service
│ │ ├── types/ # TypeScript interfaces
│ │ └── styles/ # CSS files
│ └── package.json
│
├── server/ # Node.js backend
│ ├── src/
│ │ └── index.ts # Express + Socket.io setup
│ └── package.json
│
└── README.md

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js ≥ 16
- npm or yarn installed

### 1️⃣ Backend Setup

```bash
cd server
npm install
npm run dev

Server runs at: http://localhost:3001

2️⃣ Frontend Setup
cd client
npm install
npm run dev


Frontend runs at: http://localhost:5173 (or your local React port)


🧑‍💻 How to Use


Open the app in two or more browser tabs to simulate multiple players.


Click on any empty cell in the grid.


Enter a Unicode character (e.g., “A”, “★”, “💎”) in the modal and submit.


After submission, you’ll enter a 1-minute cooldown before you can edit again.


Watch your change appear instantly on all other connected clients.


Use the history slider to view previous grid states.


Observe the player counter updating as users join or leave.



✅ Features Implemented
Core Requirements


 10×10 interactive grid


 Unicode character input modal


 Shared grid state among all players


 Real-time synchronization with Socket.io


 Online player counter


 One-time update restriction per player


Optional Enhancements


 1-Minute Cooldown after submission


 Historical Timeline Slider to view past grid states


 Grouped Updates within the same second for smoother playback



🔌 Socket Events Overview
EventDirectionDescriptionconnectionServer ↔ ClientEstablishes player connectiondisconnectServer → AllNotifies when a player leavesinitialGridServer → ClientSends current grid stateupdateCellClient → ServerPlayer updates a cellgridUpdatedServer → AllBroadcasts updated gridplayerCountServer → AllSends online player count

☁️ Deployment
You can deploy this full-stack app easily:


Frontend: Vercel or Netlify


Backend: Render, Railway, or Fly.io



Update your WebSocket URL in client/src/services/socketService.ts to match the deployed backend domain.


👤 Author
Rishabh Mishra
Backend Developer | Node.js | TypeScript | Real-Time Systems
📧 [your-rishabhm869@gmail.com]
🌐 [https://github.com/RishabhMishra7]

🪪 License
This project is licensed under the MIT License.
Feel free to use, modify, and distribute with attribution.

---


```
