---
title: "How API Gateways Enforce Rate Limits Without Becoming the Bottleneck"
description: "Rate limiting sounds like a simple counter, but production gateways use token buckets and sliding windows to handle thousands of concurrent clients under distributed conditions."
date: "2026-06-05"
category: "networking"
tags: [rate-limiting, api-gateway, token-bucket, distributed-systems, redis]
level: "intermediate"
---

<TopicLayout
  title="How API Gateways Enforce Rate Limits Without Becoming the Bottleneck"
  subtitle="Rate limiting sounds like a simple counter, but production gateways use token buckets and sliding windows to handle thousands of concurrent clients under distributed conditions."
  category="Networking"
  level="Intermediate"
  :tags="[&quot;rate-limiting&quot;, &quot;api-gateway&quot;, &quot;token-bucket&quot;, &quot;distributed-systems&quot;, &quot;redis&quot;]"
  takeaway="Rate limiting isn't about counting — it's about making a fast, fair decision with incomplete information under distributed conditions."
>

## The False Abstraction

You set rate_limit: 100 requests/minute in your gateway config, and it just works — excess requests get a 429 Too Many Requests. Simple counter, right?

## What Actually Happens Underneath

A naive per-client counter sounds trivial but breaks under real load. The gateway has to track state for thousands of concurrent clients, survive restarts without losing counts, and make decisions in microseconds — all while being the single point of failure for every request.

Most production gateways use one of two algorithms:

Token Bucket: Each client gets a bucket that fills at a steady rate (e.g., 1 token/sec). Every request consumes a token. If the bucket is empty, reject. This allows short bursts — a client can spend up to bucket_size tokens instantly, then must wait for refills. Implementation-wise, the gateway stores (last_refill_time, current_tokens) per client in a fast in-memory store (Redis or shared memory). On each request, it calculates elapsed time, adds elapsed × refill_rate tokens (capped at max), subtracts one, and proceeds or rejects.

Sliding Window Log: Instead of a bucket, the gateway keeps a timestamped log of recent requests per client. To check the limit, it counts entries within the last N seconds. This is more accurate but memory-heavy — for 10K clients at 100 req/min, that's potentially millions of timestamps in memory. Production systems use a sliding window counter approximation instead: maintain two counters (current window + previous window) and weight them by how far into the current window you are.

The real engineering challenge is distributed enforcement. If your gateway runs behind a load balancer with multiple instances, each node sees only a fraction of a client's traffic. Solutions include:
- Centralized rate limit store (Redis Lua scripts for atomic check-and-decrement)
- Consistent hashing of client IDs to a specific gateway node
- Allowance-based pre-fetching where nodes borrow tokens from a shared pool

## Minimal Example

```python
# Token bucket — what the gateway does per request
def check_rate_limit(client_id, max_tokens=100, refill_per_sec=2):
    state = redis.hget(f"ratelimit:{client_id}")
    last_time, tokens = json.loads(state)

    now = time.time()
    elapsed = now - last_time
    tokens = min(max_tokens, tokens + elapsed * refill_per_sec)

    if tokens >= 1:
        redis.hset(f"ratelimit:{client_id}",
                   json.dumps((now, tokens - 1)))
        return True  # allow
    return False  # 429
```

## Why This Matters

Rate limiting is your first line of defense against abuse, but poorly implemented limits create false positives (legitimate users blocked during traffic spikes) or false negatives (attackers slipping through because counts are fragmented across nodes). The algorithm choice directly affects burst tolerance and memory footprint.

## Failure Modes

- **False positives**: Legitimate users blocked during legitimate traffic spikes because the algorithm doesn't account for burst patterns.
- **False negatives**: Attackers slip through because rate limit counts are fragmented across multiple gateway nodes.
- **Single point of failure**: The centralized Redis store becomes a bottleneck or fails, leaving no rate limiting in place.

## Sharp Takeaway

Rate limiting isn't about counting — it's about making a fast, fair decision with incomplete information under distributed conditions.

## Rabbit Holes

Adaptive rate limiting — systems that adjust limits based on downstream service health (slowing clients when the backend is struggling, not just enforcing static caps). Look into how Netflix's Zuul and AWS API Gateway implement dynamic throttling tied to circuit breaker states.

<MiniQuiz
  question="What does the token bucket algorithm allow that a simple fixed counter does not?"
  :options="[&quot;Infinite requests per client&quot;, &quot;Short bursts of requests up to bucket capacity&quot;, &quot;Automatic client blocking&quot;, &quot;Distributed enforcement without Redis&quot;]"
  :answer=1
  explanation="The token bucket fills at a steady rate but allows clients to spend accumulated tokens instantly (up to bucket_size), enabling short bursts. A simple fixed counter would reject any request over the limit regardless of recent usage patterns."
/>

</TopicLayout>
