# AquaVision India 🌊

A production-ready **MERN Stack** web application for groundwater resource evaluation. This Digital Twin platform simulates spatiotemporal groundwater fluctuations across Indian states using real CGWB data.

![AquaVision India](https://img.shields.io/badge/status-active-success.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

## ✨ Features

- **Interactive Leaflet Maps** - Color-coded markers showing groundwater depth status
- **Time Simulation** - Timeline scrubber with play/pause to see seasonal fluctuations
- **Linear Interpolation Engine** - Calculate depths for any date between readings
- **Analytics Dashboard** - Hydrographs, borehole visualizations, and district statistics
- **Email Export** - Securely request CSV exports via email
- **Database-Driven** - Add new states without code changes, just database updates
- **Responsive Design** - Works on desktop and tablet devices

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Leaflet, Recharts, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Deployment | Vercel (Frontend), Render (Backend) |
| Tools | json2csv, Axios, Nodemailer |

## 📁 Project Structure

```
main/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Navbar, Footer, LoadingSpinner
│   │   │   ├── dashboard/     # MapView, Timeline, Analytics
│   │   │   └── landing/       # Hero, StateSelector
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   └── context/           # Context providers
│   └── ...
│
├── server/                    # Express Backend
│   ├── config/                # Database connection
│   ├── models/                # Mongoose schemas
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   └── scripts/               # Data seeder
│
└── data/
    └── seed-data.json         # Sample state/well data
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB (local or Atlas connection)
- npm or yarn

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
DATA_FILE_PATH=../../data/seed-data.json
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BASE_URL=http://localhost:5000
```

**Client** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🌐 Deployment

### Frontend (Vercel)
The frontend is optimized for Vercel. Ensure you set the `VITE_API_BASE_URL` environment variable in your Vercel project settings to point to your deployed backend.

### Backend (Render)
The backend is ready for Render. Set the following environment variables:
- `MONGODB_URI`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `BASE_URL` (Your deployed backend URL)

## 📡 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | List all states |
| GET | `/api/states/:stateCode` | Get state config with districts |
| GET | `/api/simulation/:stateCode?date=YYYY-MM-DD` | Get interpolated well data |
| GET | `/api/simulation/:stateCode/daterange` | Get min/max dates |
| POST | `/api/export/request` | Request CSV export via email |

## 📊 Adding New States

The system is designed to be **database-driven**. To add a new state:

1. Create a JSON file with the state config and wells data following `seed-data.json` schema
2. Run the seeder with your data file:

```bash
DATA_FILE_PATH=/path/to/your-data.json npm run seed
```

3. Refresh the frontend - the new state will appear automatically!

### Data Schema

```json
{
  "states": [
    {
      "stateCode": "IN-RJ",
      "name": "Rajasthan",
      "mapCenter": { "lat": 27.0238, "lng": 74.2179 },
      "zoomLevel": 7,
      "geology": {
        "dominantSoil": "Arid Sandy",
        "description": "Desert region with limited groundwater"
      }
    }
  ],
  "wells": [
    {
      "wellId": "RJ-JPR-001",
      "stateCode": "IN-RJ",
      "district": "Jaipur",
      "block": "Jaipur City",
      "coordinates": { "lat": 26.9124, "lng": 75.7873 },
      "soilProfile": ["Topsoil", "Sand", "Rock"],
      "criticalDepth": 35,
      "readings": [
        { "date": "2023-06-01", "depth": 20 },
        { "date": "2023-12-01", "depth": 28 }
      ]
    }
  ]
}
```

## 🧪 Linear Interpolation Algorithm

The simulation engine calculates groundwater depth for any date using linear interpolation:

```javascript
// Given readings: Aug 1 (30m), Nov 1 (45m)
// Target date: Sept 15

const ratio = (targetDate - beforeDate) / (afterDate - beforeDate);
const depth = beforeDepth + ratio * (afterDepth - beforeDepth);
// Sept 15 depth ≈ 37.5m
```

This allows smooth timeline scrubbing between actual measurement dates.

## 🎨 Color Scale

| Depth Range | Color | Status |
|-------------|-------|--------|
| < 10m | 🔵 Blue | Safe |
| 10-20m | 🟡 Yellow | Moderate |
| 20-40m | 🟠 Amber | High |
| > 40m | 🔴 Red | Critical |

## 👥 Team

This project was developed as part of INT222+INT252 coursework at Lovely Professional University.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Central Ground Water Board (CGWB)** - Primary data source
- **Ministry of Jal Shakti** - Policy and framework
- **India-WRIS** - Water resources data
