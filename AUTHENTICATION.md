# Browser account authentication

Accounts are stored in IndexedDB database `gameArenaAccounts`, object store `accounts` (key path `id`). Unique indexes enforce the lowercase `usernameNormalized` and `emailNormalized` values. Account records also include a stable ID, generated player ID, username, email, bio, creation/update timestamps, and active flag. Profile changes update the same record by ID; password changes replace only the stored PBKDF2-SHA-256 hash and random salt. Plaintext passwords are never persisted. The current tab's account ID is kept in `sessionStorage` under `gameArena.authUserId` and is checked against IndexedDB when the app starts.

Passwords use Web Crypto PBKDF2 with SHA-256, 600,000 iterations, and a 256-bit result. The verifier compares derived bytes without an early exit.

This is a frontend prototype, not a production authentication boundary. Browser storage and JavaScript running on the same origin are accessible to the user and potentially to injected scripts; users can edit or clear IndexedDB and sessionStorage. Client-side password hashing cannot provide the protections of server-side authentication, server-enforced account status, rate limiting, recovery, or trusted authorization. Do not use real or reused passwords with this demo.
