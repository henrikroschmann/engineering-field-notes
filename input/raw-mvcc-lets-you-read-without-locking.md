🔧 How MVCC Lets You Read Without Locking

The abstraction:
When you run SELECT * FROM users WHERE id = 1, you expect to get the current data without blocking writers or being blocked by them. Most developers assume databases just read whatever's in memory.

What happens underneath:
Modern databases like PostgreSQL and MySQL InnoDB use Multi-Version Concurrency Control (MVCC). Every row stores not just data, but transaction metadata: a xmin (creating transaction ID) and xmax (deleting transaction ID), plus a freeze bit.

When your SELECT starts, the database captures a snapshot — essentially "transaction X is visible to me." The visibility rules are brutal but elegant:
- A row is visible if xmin <= snapshot AND (xmax > snapshot OR xmax = 0)
- If xmin > snapshot, the row didn't exist yet when you started reading
- If xmax <= snapshot, the row was already deleted when you started reading

The database maintains a "committed transaction map" in shared memory. When checking visibility, it doesn't need to lock anything — it just compares integers.

Why this matters:
Readers never block writers, and writers never block readers. A long-running analytical query won't stall your checkout page. This is why PostgreSQL can handle thousands of concurrent connections without the read/write contention that plagues lock-based systems.

Tiny example:
SQL

-- Transaction A starts (snapshot = 100)
-- Transaction B inserts row with xmin=101, commits
-- Transaction A SELECTs → row NOT visible (101 > 100)
-- Transaction A sees a consistent view of the past

One sharp takeaway:
MVCC trades storage for concurrency — you keep old versions around so readers can see consistent snapshots without blocking anyone.

Rabbit hole:
Vacuuming — how databases reclaim space from dead tuple versions without breaking active transactions' visibility windows.
