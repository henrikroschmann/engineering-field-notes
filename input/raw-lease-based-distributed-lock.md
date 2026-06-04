
🔧 Lease-Based Distributed Locks: Why Time Beats Voting

The abstraction:
A distributed lock — you acquire it, do your critical work, release it. In code, it looks like a simple with client.lock("resource"): ... block. You assume mutual exclusion: only one process holds the lock at any time.

What happens underneath:
Unlike consensus-based locks (Paxos/Raft) that require majority agreement before granting, lease-based locks use a single coordinator that grants a time-bound permission slip. The coordinator writes a key-value entry like lock:resource → holder=worker-3, expires=1717468800 and returns immediately — no quorum, no round-trip voting.

The magic is in the expiration. The holder must periodically renew the lease before it expires (typically every ⅓ of the TTL). Renewal is a simple compare-and-swap: "if the current holder is still me, extend the expiry." If the holder crashes without releasing, the lease simply expires on its own — no explicit unlock needed.

The coordinator runs a background sweeper that checks expired leases and marks them available. This is usually an O(n) scan over active leases, but in practice, libraries like etcd or ZooKeeper use sorted expiration heaps to make it O(log n).

Why this matters:
Lease-based locks are dramatically faster than consensus locks because they avoid the 2-3 round trips of leader election and commit phases. A lease grant is a single write to one node — sub-millisecond in LAN environments. But speed comes with tradeoffs: if the coordinator itself crashes, the lock becomes unavailable until failover completes. Also, clock skew between holder and coordinator can cause premature expiration or late detection of dead holders.

In practice, this means lease locks excel for short-lived operations (cache invalidation, leader election in stateless services) but are risky for long-running transactions where a holder might legitimately need more time than the lease allows.

Tiny example:
Python

import redis

r = redis.Redis()
lock_key = "order:process:1234"
lease_ttl = 30  # seconds

# Acquire: SET with NX (only if not exists) and EX (expire)
acquired = r.set(lock_key, "worker-7", nx=True, ex=lease_ttl)

if acquired:
    try:
        # Renew lease every 10 seconds during long work
        while processing_order():
            r.expire(lock_key, lease_ttl)
            time.sleep(10)
        # Do the actual work
        process_order(1234)
    finally:
        # Release: delete only if still ours (Lua for atomicity)
        release_script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        end
        return 0
        """
        r.eval(release_script, 1, lock_key, "worker-7")

The Lua script is critical — without it, there's a race condition where another worker could acquire the lock between your get and delete checks.

One sharp takeaway:
A lease isn't a lock — it's a permission that expires, and that expiration is both its greatest strength (automatic recovery from crashes) and its most subtle weakness (timing-dependent correctness).

Rabbit hole:
Look into lease revocation in distributed filesystems like CephFS or Google's GFS, where the coordinator can actively revoke a lease mid-operation to rebalance load — turning a passive timeout mechanism into an active control knob.
