🥃 After Hours Architecture — Friday Briefing

Theme of the week: AI is eating our jobs while we're busy arguing about whether it's eating our jobs.

---

1️⃣ Is AI Causing Frontend's Lost Decade?

Summary:
A developer argues that AI is repeating frontend's "lost decade" — years of framework churn, premature optimization, and solving problems that don't exist. The piece suggests we're trading one kind of chaos (React vs Vue vs Svelte) for another (which AI prompt template works).

Why it matters:
If AI becomes the new framework churn, we're about to discover that "prompt engineering" is just "JavaScript frameworks" with better marketing. The real question isn't whether AI helps — it's whether we'll spend the next five years arguing about which LLM provider has the best ecosystem while actual software rots.

Discussion starters:
- Is "AI-first" just another way of saying "we don't know what we're building yet"?
- When did optimizing for AI become more important than optimizing for humans?

Contrarian angle:
Maybe frontend's lost decade wasn't about frameworks — it was about us pretending that adding another abstraction layer solves business problems.

Practical takeaway:
Ship something that works before you optimize for AI. Humans still click buttons.

Sources:
- Is AI causing a repeat of Front end's Lost Decade?: https://mastrojs.github.io/blog/2026-05-23-is-AI-causing-a-repeat-of-frontends-lost-decade/

---

2️⃣ Real-Time LLM Inference: 3k Tokens/s on Standard GPUs

Summary:
Kog.ai demonstrates real-time LLM inference hitting 3,000 tokens per second on standard GPUs. The architecture uses speculative decoding and careful memory management to achieve near-instantaneous responses — the kind of latency that makes you forget you're talking to a machine.

Why it matters:
When LLMs respond faster than your brain processes text, the UX implications are... existential. We're approaching the point where "AI assistant" feels less like a tool and more like a roommate who reads too much. Also, if you can run this on commodity hardware, your cloud bill just got a lot more negotiable.

Discussion starters:
- At what latency does "chat with AI" become "thinking out loud"?
- Are we building for human users or for other AIs that will consume our output?

Contrarian angle:
Speed isn't the problem — it's that we're optimizing for speed when we should be optimizing for not being wrong.

Practical takeaway:
If you're paying for LLM latency, you're probably overpaying. Look at local inference before scaling up.

Sources:
- Real-time LLM Inference on Standard GPUs: 3k tokens/s per request: https://blog.kog.ai/real-time-llm-inference-on-standard-gpus-3-000-tokens-s-per-request/

---

3️⃣ Cyber Resilience: AWS's Ransomware Recovery Playbook

Summary:
AWS published a reference architecture for cyber resilience — recovering workloads after ransomware or destructive events. The pattern uses three isolated accounts: Production, Recovery (with logically air-gapped vaults), and an Isolated Recovery Environment with no trust relationship to production. The Rebuild-Restore-Rotate framework categorizes what comes from code, what comes from backup, and what gets fresh credentials.

Why it matters:
Most organizations treat backups like they're insurance — something you buy and forget until it's too late. This pattern treats recovery as a capability that must be exercised, not a feature that exists. The air-gapped vault means even a compromised admin can't delete your backups during the retention period. That's the kind of detail that matters when you're recovering from an event where "admin" is the problem.

Discussion starters:
- When was the last time you tested recovery in an environment with no trust to production?
- If your backup account shares credentials with production, do you even have backups?

Contrarian angle:
Cyber resilience isn't about preventing attacks — it's about accepting that prevention fails and designing for the aftermath.

Practical takeaway:
Create a logically air-gapped vault today. Not tomorrow. Today. Before you need it.

Sources:
- Cyber resilience on AWS: A reference approach for recovery from ransomware: https://aws.amazon.com/blogs/architecture/cyber-resilience-on-aws-a-reference-approach-for-recovery-from-ransomware-and-destructive-events/

---

4️⃣ GitHub Copilot: Chat vs Agentic Workflows

Summary:
Microsoft's .NET blog breaks down when to use Copilot chat (understand, compare, outline) versus agentic workflows (change, verify, update, deliver). The key insight: chat is for reasoning, agents are for execution. Use Visual Studio for deep solution work, VS Code for cross-repo changes, CLI for terminal-native tasks, and cloud coding agents for bounded multi-file changes.

Why it matters:
We're past the "AI autocomplete" phase. The real value isn't inline completions — it's delegating scoped work with clear definitions of done. The prompt that works is one that sounds like a code review comment or engineering task, not "improve this code."

Discussion starters:
- Are we training developers to be prompt engineers or to think more clearly about their work?
- When does "AI assistance" become "AI doing the job"?

Contrarian angle:
The best Copilot prompts sound like instructions you'd give a junior developer. If your prompt is vague, your output will be too.

Practical takeaway:
Give tasks boundaries, name constraints explicitly, tell AI what must not change, and review results like a PR.

Sources:
- Doing More with GitHub Copilot as a .NET Developer: https://devblogs.microsoft.com/dotnet/doing-more-with-github-copilot/

---

5️⃣ Volkswagen Blocks Home Assistant via Client Assertion

Summary:
Volkswagen broke Home Assistant integration by requiring client assertion authentication — effectively locking out third-party developers who wanted to let you control your car from your smart home. The community is now fighting API restrictions that treat "I own this car" as insufficient credentials.

Why it matters:
This is the future of platform control: APIs that work until they don't, authentication schemes designed to exclude rather than include, and the assumption that users don't deserve ownership of their own data. Your car knows more about you than your therapist — and now only Volkswagen can access it.

Discussion starters:
- At what point does "security" become "vendor lock-in"?
- If you buy a product, do you own the data or just the right to use it?

Contrarian angle:
Maybe Volkswagen is right — maybe we shouldn't be able to remotely start our cars from smart home hubs. But the solution isn't broken APIs, it's better ones.

Practical takeaway:
Design APIs assuming third parties will exist. If you don't want them, say so — don't break them by accident.

Sources:
- Volkswagen blocks Home Assistant by requiring client assertion: https://github.com/robinostlund/homeassistant-volkswagencarnet/issues/967

---

6️⃣ GitHub Bans Security Researcher Over Zero-Day Disclosure

Summary:
GitHub banned a security researcher who posted zero-day Windows exploits after Microsoft allegedly "ruined their life." The researcher claims the ban is vindictive and promises further retaliation. A classic case of "we have a vulnerability disclosure policy" meeting "we don't like how you disclosed it."

Why it matters:
Security researchers operate in a gray zone between hero and villain depending on who's writing the press release. Platforms claim to value responsible disclosure while treating researchers like criminals when they don't follow the exact process. The result? More researchers go full public, less cooperation, more chaos.

- Is "responsible disclosure" just a euphemism for "do it our way or we ban you"?
- When does platform control become platform tyranny?

Contrarian angle:
GitHub's ban might be the right call — but the real problem is why researchers feel compelled to go public in the first place.

Practical takeaway:
If you build security into your platform, expect researchers to test it. If you don't like how they do it, fix your disclosure process — not their career.

Sources:
- GitHub bans security researcher who posted zero-day Windows exploits: https://www.tomshardware.com/tech-industry/cyber-security/microsofts-github-bans-security-researcher-who-posted-zero-day-windows-exploits-because-company-ruined-their-life-expert-claims-action-is-vindictive-and-promises-further-retaliation

---

🏗️ Architecture Smell of the Week: The Backup Illusion

Smell:
You have backups. You've tested them. But you've never tested recovery in an environment with no trust relationship to production, no network path back, and no assumption that credentials are valid.

Risk:
When ransomware encrypts your backups, compromises your admin accounts, and deletes your IAM roles, "we have backups" becomes "we have encrypted files we can't access."

Question:
If your recovery environment shares a trust boundary with production, do you even have recovery?

---

🥃 Whisky-Grade Take:

The best architecture decisions are the ones you make before you need them — preferably while sober, and definitely before someone's career depends on it.

---

🎯 Final Obnoxious Take:

We're not having an AI revolution — we're having a "finally admitting we should have automated this five years ago" revolution, and pretending it's new because the marketing budget says so.

---

📢 Teaser:

🥃 After Hours Architecture later today.

Topics on the table:
- Is AI causing frontend's lost decade?
- Real-time LLM inference at 3k tokens/s
- Cyber resilience and ransomware recovery patterns

Bring whisky, opinions, and one bad architecture decision you secretly still defend.
