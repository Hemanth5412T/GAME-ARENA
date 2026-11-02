# Browser account authentication

Accounts are stored in IndexedDB database `gameArenaAccounts`, object store `accounts` (key path `id`). Unique indexes enforce the lowercase `usernameNormalized` and `emailNormalized` values. Account records also include a stable ID, generated player ID, username, email, bio, creation/update timestamps, and active flag. Profile changes update the same record by ID; password changes replace only the stored PBKDF2-SHA-256 hash and random salt. Plaintext passwords are never persisted. The current tab's account ID is kept in `sessionStorage` under `gameArena.authUserId` and is checked against IndexedDB when the app starts.

The version 2 upgrade adds `role`, `status`, and status metadata to existing account records without deleting profile or credential data. It also adds `managedTournaments`, `promotionRequests`, and `adminAudit` object stores. Interface mode is stored per tab in `sessionStorage` as `gameArena.interfaceMode`; an account's role is rechecked before granting Admin Mode.

On first launch the app seeds one demo Master Admin through `src/data/adminSeed.js` (username `Master@5412T`, email `master007@gmail.com`, password `Master5412T`). An existing first-run demo account from the prior seed is migrated to these credentials. These credentials are public demo credentials; change/remove the seed before deploying a real service. This frontend-only app cannot securely provision or protect privileged roles from a browser owner.

Passwords use Web Crypto PBKDF2 with SHA-256, 600,000 iterations, and a 256-bit result. The verifier compares derived bytes without an early exit.

This is a frontend prototype, not a production authentication boundary. Browser storage and JavaScript running on the same origin are accessible to the user and potentially to injected scripts; users can edit or clear IndexedDB and sessionStorage. Client-side password hashing cannot provide the protections of server-side authentication, server-enforced account status, rate limiting, recovery, or trusted authorization. Do not use real or reused passwords with this demo.
