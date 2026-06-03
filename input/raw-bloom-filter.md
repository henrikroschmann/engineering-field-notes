🔧 Bloom Filters: The Probabilistic Data Structure That Saves Memory

The abstraction:
A set membership test — "Is this item in the collection?" — that returns either "definitely not" or "probably yes."

What happens underneath:
A Bloom filter is a bit array of m bits, all initially zero, plus k independent hash functions. When you insert an element:
1. Hash it with each of the k functions
2. Set the corresponding k bits to 1 in the array

To query membership:
1. Hash the element the same way
2. If all k bits are 1 → "probably in set"
3. If any bit is 0 → "definitely not in set"

The magic: multiple elements can hash to overlapping positions, causing false positives when unrelated items happen to set all the same bits. But false negatives are impossible — if an element was inserted, its bits must be set.

Why this matters:
Bloom filters trade a controllable error rate for dramatic space savings. A filter with 10% false positive rate uses roughly 9.6 bits per element — compared to storing actual strings (hundreds of bits) or even hashes (32-64 bits). This makes them ideal for:
- Browser history checks before disk lookup
- Database query optimization (avoid expensive lookups)
- Distributed cache key existence checks
- Network intrusion detection

Tiny example:
Python

# A filter with 1000 bits, 3 hash functions
# After inserting "alice", "bob", "charlie"
# Querying "dave" might return True (false positive)
# if dave's hashes all land on bits set by alice/bob/charlie

# The false positive rate formula:
# P ≈ (1 - e^(-kn/m))^k
# where n = elements, m = bits, k = hash functions

One sharp takeaway:
Bloom filters let you say "definitely not" with zero memory overhead per element — perfect for filtering out the impossible before expensive lookups.

Rabbit hole:
Counting Bloom filters extend this to support deletions by replacing bits with counters, enabling dynamic sets at the cost of more memory.
