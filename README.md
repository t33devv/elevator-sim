# elevator simulator

basically, everyone in the world shares these 2 elevators

🔗 **[Live Demo](https://elevator-sim-liart.vercel.app/)**

---

## 🎮 How to Use

1. Click **"Make a Request"** button
2. Select your current floor
3. Choose direction (Up/Down)
4. Select your destination floor
5. Submit and watch the elevator come to you

---

## Tech stack:
**Frontend:**
- React.js 19.2.0
- Vite 7.2.4
- Tailwind CSS 3.4.18
- Socket.IO Client 4.8.1
- Vercel for Deployment

**Backend:**
[Link to Github repo](https://github.com/t33devv/elevator-sim-backend)
- Node.js
- Express 5.1.0
- Socket.IO 4.8.1
- Nodemon 3.1.11
- Render for Deployment

---

### Elevator Algorithm
The system uses a smart scheduling algorithm that:
- Assigns requests to the nearest idle elevator
- Maintains pickup → destination order
- Optimizes based on current direction and queue length
- Prevents starvation with FIFO queue for unassigned requests

---

## Websocket requests:
- **elevatorRequest** - Client -> Server (new elevator request)
- **elevatorStateUpdate** - Server -> Client (elevator position/status updates)
- **requestReceived** - Server -> Client (request confirmation notification)
- **requestFulfilled** - Server -> Client (completed request notification)

---

### System Design

┌─────────────┐     WebSocket     ┌─────────────┐
│ Frontend │  ◄─────────────────► │ Backend │
│ (React) │ elevatorRequest │ (Express) │
│ │ stateUpdate │ │
└─────────────┘    notifications    └─────────────┘
│
▼
┌───────────────┐
│ Elevator │
│ Controller │
└───────────────┘
│
┌───────┴───────┐
▼ ▼
┌──────────┐ ┌──────────┐
│Elevator 1│ │Elevator 2│
└──────────┘ └──────────┘

---

### Project Structure

elevator-sim/
├── elevator-sim-frontend/
│   ├── src/
│   │   ├── App.jsx              # Main UI component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── elevator-sim-backend/
    ├── src/
    │   ├── models/
    │   │   └── Elevator.js              # Elevator logic
    │   ├── controllers/
    │   │   └── ElevatorController.js    # Multi-elevator management
    │   ├── services/
    │   │   ├── BotService.js            # Automated requests
    │   │   └── KeepAliveService.js      # Server keep-alive
    │   ├── utils/
    │   │   └── constants.js             # Configuration
    │   └── app.js                       # WebSocket handlers
    ├── server.js                        # Express server
    └── package.json

---

# ⭐ Star this repo if you found it interesting!
