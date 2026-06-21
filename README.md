# Lanka Explorer — Backend API

REST API server for the Lanka Explorer travel platform.  
**University of Kelaniya — SENG 41293**

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | JavaScript runtime |
| Express.js | v5 | HTTP server & routing |
| MongoDB Atlas | Cloud | Database |
| Mongoose | v9 | Schema modeling & ODM |
| JSON Web Token | v9 | Authentication tokens |
| bcryptjs | v3 | Password hashing |
| Multer | v2 | Image file uploads |
| dotenv | v17 | Environment variables |
| CORS | v2 | Cross-origin request handling |
| Nodemon | v3 | Dev auto-restart |

---

## Project Structure

```
lanka-explorer-backend/
├── src/
│   ├── server.js                   # App entry point
│   ├── seed.js                     # Database seeder
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── models/
│   │   ├── User.js                 # Admin & customer accounts
│   │   ├── Attraction.js           # Tourist destinations
│   │   ├── Listing.js              # Hotels, tours, vehicles
│   │   ├── Booking.js              # Booking records
│   │   └── Review.js               # Listing reviews
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── attraction.controller.js
│   │   ├── listing.controller.js
│   │   ├── booking.controller.js
│   │   ├── review.controller.js
│   │   ├── favourites.controller.js
│   │   └── user.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── attraction.routes.js
│   │   ├── listing.routes.js
│   │   ├── booking.routes.js
│   │   ├── review.routes.js
│   │   ├── favourites.routes.js
│   │   ├── upload.routes.js
│   │   └── user.routes.js
│   └── middleware/
│       └── auth.middleware.js      # JWT protect & adminOnly guards
├── uploads/                        # Uploaded images (auto-created)
├── .env                            # Environment variables (not committed)
└── package.json
```

---

## Prerequisites

- Node.js v18 or higher — https://nodejs.org
- MongoDB Atlas account — https://www.mongodb.com/atlas

---

## Setup & Installation

### 1. Install dependencies

```bash
cd lanka-explorer-backend
npm install
```

### 2. Create the `.env` file

Create a file named `.env` in the `lanka-explorer-backend/` root folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=lanka_explorer_jwt_secret_2026
ADMIN_EMAIL=admin@lankaexplorer.lk
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

> Replace `MONGO_URI` with your actual MongoDB Atlas connection string from the Atlas dashboard.

### 3. Seed the database

Run this once to populate the database with sample data:

```bash
node --env-file=.env src/seed.js
```

This creates:
- 8 tourist attractions (Sigiriya, Yala, Galle Fort, etc.)
- 6 listings (3 hotels, 2 tours, 1 vehicle)
- 1 admin user
- 1 demo customer
- 2 demo bookings

**Login credentials after seeding:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@lankaexplorer.lk | admin123 |
| Customer | nimal@example.com | demo1234 |

### 4. Start the server

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start
```

Server runs at: **http://localhost:5000**

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new customer |
| POST | `/api/auth/login` | Public | Login, returns JWT token |
| GET | `/api/auth/me` | JWT | Get current logged-in user |

### Attractions — `/api/attractions`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/attractions` | Public | List all attractions |
| GET | `/api/attractions/:id` | Public | Get single attraction |
| POST | `/api/attractions` | Admin | Create attraction |
| PUT | `/api/attractions/:id` | Admin | Update attraction |
| DELETE | `/api/attractions/:id` | Admin | Delete attraction |

Query params for GET list: `?category=Historical&region=Kandy&search=sigiriya`

### Listings — `/api/listings`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/listings` | Public | List active listings |
| GET | `/api/listings/all` | Admin | List all listings (incl. inactive) |
| GET | `/api/listings/:id` | Public | Get single listing |
| POST | `/api/listings` | Admin | Create listing |
| PUT | `/api/listings/:id` | Admin | Update listing |
| DELETE | `/api/listings/:id` | Admin | Delete listing |

Query params for GET list: `?type=hotel&region=Kandy`

### Bookings — `/api/bookings`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/bookings` | Admin | Get all bookings |
| GET | `/api/bookings/my` | JWT | Get my bookings |
| GET | `/api/bookings/:id` | JWT | Get single booking |
| POST | `/api/bookings` | JWT | Create booking |
| PATCH | `/api/bookings/:id` | JWT | Transition booking status |
| DELETE | `/api/bookings/:id` | Admin | Delete booking |

### Reviews — `/api/listings/:listingId/reviews`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/listings/:listingId/reviews` | Public | Get reviews for a listing |
| POST | `/api/listings/:listingId/reviews` | JWT | Submit a review |
| DELETE | `/api/listings/:listingId/reviews/:id` | JWT | Delete own review |

### Favourites — `/api/favourites`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/favourites` | JWT | Get my saved favourites |
| POST | `/api/favourites` | JWT | Add item to favourites |
| DELETE | `/api/favourites/:itemId` | JWT | Remove from favourites |

### Image Upload — `/api/upload`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Admin | Upload image file (max 5 MB) |

Uploaded images are served at: `http://localhost:5000/uploads/<filename>`

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get single user |
| PATCH | `/api/users/:id/toggle` | Admin | Enable / disable user account |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## Authentication

All protected routes require a Bearer token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned from `/api/auth/login` and expire after **7 days**.

---

## Booking Status Flow

```
pending_payment → under_review → confirmed → completed
                               ↘ payment_rejected → under_review
                ↘ cancelled (any stage)
```
