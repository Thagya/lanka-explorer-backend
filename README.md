# Lanka Explorer Backend

Express.js + MongoDB REST API

## Setup

1. Install MongoDB locally (or use Atlas)
2. `npm install`
3. Copy `.env` and update values if needed
4. `npm run seed` — populates DB with attractions, listings, users, demo bookings
5. `npm run dev` — starts server on http://localhost:5000

## Credentials (after seed)

- Admin: admin@lankaexplorer.lk / admin123
- Demo user: nimal@example.com / demo1234

## Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | - | Register user |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | JWT | Current user |
| GET | /api/listings | - | Public listings |
| GET | /api/listings/all | Admin | All listings |
| POST | /api/listings | Admin | Create listing |
| PUT | /api/listings/:id | Admin | Update listing |
| DELETE | /api/listings/:id | Admin | Delete listing |
| GET | /api/attractions | - | Public attractions |
| POST | /api/attractions | Admin | Create attraction |
| GET | /api/bookings/my | JWT | My bookings |
| GET | /api/bookings | Admin | All bookings |
| POST | /api/bookings | JWT | Create booking |
| PATCH | /api/bookings/:id | JWT | Transition status |
| GET | /api/users | Admin | All users |
| PATCH | /api/users/:id/toggle | Admin | Toggle active |
| DELETE | /api/users/:id | Admin | Delete user |
