# SkinCycle

A production-ready skincare management platform that helps users build personalized skincare routines, tracks product inventory and depletion, and detects conflicting active ingredients.

## Features

- **Dashboard** — At-a-glance overview with today's routine, inventory stats, and quick actions.
- **Inventory Tracking** — Monitor product volume, depletion progress bars, status badges (In Stock / Running Low / Depleted), and estimated depletion dates.
- **Product Catalog** — Browse all skincare products with search, category filters (cleanser, serum, moisturizer, sunscreen), and one-click add-to-inventory.
- **Routine Builder** — Drag-and-drop AM/PM routine creation with automatic ingredient conflict detection and recommendations.
- **Ingredient Compatibility Engine** — Flags known conflicts between active ingredients (e.g., Retinol + AHA) and suggests fixes.
- **Profile & Skin Profile** — Manage skin type, concerns, and allergies to personalize your experience.
- **Reorder Reminders** — Cron job that checks inventory levels and sends reorder alerts when products are running low.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Redux Toolkit, React Router v7, dnd-kit, Lucide Icons |
| Backend | Node.js, Express 5, Mongoose 9, MongoDB |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Security | Helmet, CORS, express-rate-limit |
| Testing | Jest, Supertest |

## Project Structure

```
skin-cycle/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components (Navbar, AddProductModal, TodaysRoutineWidget)
│   │   ├── pages/              # Page components (Dashboard, Inventory, ProductCatalog, RoutineBuilder, Profile, Login)
│   │   ├── store/              # Redux slices (auth, inventory, product, routine, user)
│   │   ├── utils/              # Shared utilities (api.js)
│   │   ├── App.jsx             # Root component with routing
│   │   └── index.css           # Global styles & Tailwind theme
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── models/             # Mongoose schemas (User, Product, Ingredient, IngredientConflict, InventoryItem, Routine, ReorderRule)
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── routes/             # Express routers
│   │   ├── validators/         # Zod validation schemas
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── jobs/               # Cron jobs (reorder reminders)
│   │   ├── seeds/              # Seed data (products, conflicts, users)
│   │   └── utils/              # Custom error classes
│   └── .env
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd skin-cycle
   ```

2. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure environment variables**

   Create `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/skincycle
   JWT_SECRET=your_jwt_secret_here
   PORT=5050
   ```

4. **Seed the database**
   ```bash
   cd server
   node src/seeds/productSeed.js
   node src/seeds/conflictSeeds.js
   node src/seeds/userSeed.js
   ```

5. **Start the dev servers**

   In one terminal:
   ```bash
   cd server && npm run dev
   ```

   In another terminal:
   ```bash
   cd client && npm run dev
   ```

   The client runs on `http://localhost:5173` and proxies API requests to `http://localhost:5050`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/:id/profile` | Get user profile |
| PATCH | `/api/users/:id/skin-profile` | Update skin profile |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create a product |
| GET | `/api/ingredients` | List ingredients |
| GET | `/api/inventory` | Get user inventory |
| POST | `/api/inventory` | Add product to inventory |
| PATCH | `/api/inventory/:id/log-usage` | Log product usage |
| DELETE | `/api/inventory/:id` | Remove from inventory |
| GET | `/api/inventory/reminders` | Get reorder reminders |
| GET | `/api/routines` | Get user routines |
| POST | `/api/routines` | Create a routine (with conflict check) |

## Deployment on Render

This project is configured for deployment as a unified full-stack web service on [Render](https://render.com).

### Step 1: Push your code to GitHub
Ensure all changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure full-stack deployment for Render"
git push origin main
```

### Step 2: Set up MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
3. Under **Database Access**, create a database user and note the password.
4. Copy your connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.mongodb.net/skincycle?retryWrites=true&w=majority`).

### Step 3: Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com) and click **New + > Web Service** (or use the blueprint with `render.yaml`).
2. Connect your GitHub repository: `chitrakulkarni2830/skin-cycle`.
3. Fill in the settings:
   - **Name**: `skin-cycle`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: a secure secret key (e.g. `super_secret_production_key`)
5. Click **Create Web Service**.

Render will automatically run `npm run build` (installing dependencies and compiling the Vite client) and then start the Express server, serving the full-stack app on a single live URL!
