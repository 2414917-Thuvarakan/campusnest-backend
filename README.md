# CampusNest Backend — Step 2: Data Models

Step 1 got the server talking to MongoDB. Now we've added the four
Mongoose models (schemas) that define what our data looks like:

- **User** — name, email, password, college
- **Room** — title, rent, location, sharing type, who posted it
- **Offer** — shop name, discount, category, valid till date
- **Job** — title, description, pay rate, job type

Each model file (in `models/`) has comments explaining every field.

## Try it out

1. Make sure your server is running: `npm run dev`
2. Visit `http://localhost:5000/api/models-check` in your browser
3. You should see all four model names listed - this confirms the
   schemas load correctly and MongoDB understands them.

(This `/api/models-check` route is just for testing - we'll remove it
once we build the real API routes in the next steps.)

## How to run this

1. Install Node.js (v18 or above) if you don't have it: https://nodejs.org

2. Open a terminal in this folder and install dependencies:
   ```
   npm install
   ```

3. Create a free MongoDB Atlas account and cluster: https://www.mongodb.com/cloud/atlas
   - Create a database user (username + password)
   - Allow access from anywhere (0.0.0.0/0) for now, under Network Access
   - Copy your connection string

4. Copy `.env.example` to a new file called `.env`, and paste in your
   MongoDB connection string and a random JWT secret:
   ```
   cp .env.example .env
   ```

5. Start the server:
   ```
   npm run dev
   ```

6. Open your browser to `http://localhost:5000/api/health` — you should
   see `{"status":"ok","message":"CampusNest API is running"}`

If you see "MongoDB connected: ..." in your terminal, the database is
working.

## What's next (Step 3)

We'll build authentication - signup and login routes, with passwords
hashed using bcrypt and login sessions handled with JWT tokens.

## Folder structure

```
campusnest-backend/
├── config/
│   └── db.js            # MongoDB connection logic
├── models/
│   ├── User.js          # student accounts
│   ├── Room.js          # room/PG listings
│   ├── Offer.js         # student discounts
│   └── Job.js           # part-time job postings
├── routes/               # (empty for now) will hold API route definitions
├── controllers/          # (empty for now) will hold route handler logic
├── server.js              # main entry point
├── .env.example           # template for your environment variables
└── package.json
```
