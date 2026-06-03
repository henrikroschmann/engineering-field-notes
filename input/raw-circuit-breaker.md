
🔧 Circuit Breaker Failure Recovery

The abstraction:
Developers wrap flaky dependencies with a circuit breaker library and set failureThreshold: 5 and timeout: 30s. When failures hit the threshold, calls fail fast. After the timeout, the circuit "recloses" and traffic resumes.

What happens underneath:
The circuit breaker isn't a simple timer—it's a state machine with three states and a critical half-open phase most implementations handle poorly.

When failures exceed the threshold, the circuit opens and immediately rejects all requests (failing fast). But the recovery is where it gets interesting: after the timeout expires, the circuit transitions to half-open, not closed. In this state, only a single probe request is allowed through. If that probe succeeds, the circuit closes and normal traffic resumes. If it fails, the circuit reopens and the timer restarts.

The subtle bug: naive implementations allow all requests through once half-open is reached, causing a thundering herd that overwhelms the recovering service. Proper implementations use a semaphore or atomic counter to ensure exactly one probe passes.

Additionally, smart circuit breakers use exponential backoff on the timeout itself. First failure: 30s timeout. Second trip: 60s. Third: 120s. This prevents rapid cycling when a service is genuinely struggling to recover.

Why this matters:
A poorly implemented half-open state can cause more damage than no circuit breaker at all. The probe request that's supposed to test recovery becomes an attack vector—your own application hammering the dying dependency with every circuit timeout cycle. This creates oscillation: service recovers slightly → circuit opens → probe floods it → service crashes → repeat.

Tiny example:
Python

# Naive (wrong) - allows all requests in half-open
if time_since_open > timeout:
    state = HALF_OPEN
    return allow_request()  # Everyone gets through!

# Correct - single probe via atomic check
if time_since_open > timeout:
    if atomic_compare_and_swap(state, OPEN, HALF_OPEN):
        return allow_request()  # Only winner proceeds
    return reject_request()

One sharp takeaway:
The half-open state is a controlled probe, not a gradual reopening—exactly one request tests recovery, and exponential backoff prevents cycling on genuinely broken services.

Rabbit hole:
Bulkhead pattern—partitioning resources so one failing dependency doesn't exhaust all threads/connections, giving circuit breakers room to work without cascading failures.
