# SneakerDrop Backend API

This is the Node.js/Express backend for the SneakerDrop high-concurrency reservation platform. It utilizes PostgreSQL, Prisma ORM, and Socket.io to provide a fail-safe, real-time inventory system designed specifically for "Limited Edition Drop" scenarios.

## 1. How to run the app (including SQL schema setup)

**Prerequisites:** Node.js (v18+) and Docker Desktop.

1. **Start the Database:**
   Ensure Docker is running, then from the root of the project (or inside `backend`), start the PostgreSQL container:
   ```bash
   docker compose up -d
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Database Schema Setup:**
   Push the Prisma schema to the database and apply constraints:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the Database:**
   Generate demo users, drops, and initial inventory. *(Note: If you encounter an ES Module error on newer Node versions, run the compilation step manually):*
   ```bash
   npx tsc prisma/seed.ts
   node prisma/seed.js
   ```

5. **Start the Server:**
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:3001`.

---

## 2. Architecture Choice: How did you handle the 60-second expiration logic?

Handling time-based expiration in a distributed system is tricky. If we relied purely on `setTimeout` in Node.js, the timers would be lost if the server crashed or restarted. 

**The Solution: Database-Driven Cron Jobs with `SKIP LOCKED`**
1. **State:** When a user reserves an item, the database record is created with `status = 'PENDING'` and an exact `expiresAt` timestamp (Current Time + 60s).
2. **The Worker:** A background Cron Job (`backend/src/jobs/expiry.job.ts`) runs every 10 seconds.
3. **Concurrency Safety:** The worker executes a raw SQL query: 
   `SELECT id FROM reservations WHERE status = 'PENDING' AND expiresAt <= NOW() FOR UPDATE SKIP LOCKED;`
   
**Why `SKIP LOCKED`?** If this app scales to 5 backend servers, all 5 servers might run the Cron Job simultaneously. `SKIP LOCKED` ensures that if Server A grabs a batch of expired reservations to process, Server B will instantly skip those locked rows and grab the *next* batch. This prevents race conditions and double-processing without needing an external queueing service like Redis or RabbitMQ.

---

## 3. Concurrency: How did you prevent multiple users from claiming the same last item?

When hundreds of users click "Reserve" at the exact same millisecond for an item with 1 stock remaining, checking stock in memory causes massive race conditions (overselling). 

**The Solution: PostgreSQL Pessimistic Locking (`NOWAIT`)**
We pushed the concurrency control entirely to the database layer. 

1. When a request hits the reservation endpoint, Prisma opens an interactive transaction.
2. We execute a raw query: `SELECT * FROM inventory WHERE dropId = $1 FOR UPDATE NOWAIT;`
3. **The Result:** The very first transaction to reach the database acquires a write-lock on that specific shoe's inventory row. 
4. **Failing Fast:** For the other 99 users arriving milliseconds later, the `NOWAIT` clause instructs PostgreSQL to immediately reject their queries with a Lock Unavailable error, rather than queueing them up. The backend instantly returns a 503 or 409 HTTP status to the frontend.

This prevents database connection exhaustion ("retry storms") and mathematically guarantees that stock is only evaluated and decremented exactly one at a time. Finally, a hardcoded database `CHECK` constraint (`reservedStock + soldStock <= totalStock`) acts as the ultimate safety net.
