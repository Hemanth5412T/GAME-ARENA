import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authenticateAccount, changeAccountPassword, clearSessionUserId, createAccount, getAccountById, readSessionUserId, saveSessionUserId, updateAccountProfile } from "../data/accountStore.js";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const authRevision = useRef(0);
  useEffect(() => {
    let active = true;
    const startRevision = authRevision.current;
    (async () => {
      const id = readSessionUserId();
      if (!id) { if (active && authRevision.current === startRevision) setStatus("unauthenticated"); return; }
      try {
        const restored = await getAccountById(id);
        if (!restored) clearSessionUserId();
        if (active && authRevision.current === startRevision) { setUser(restored); setStatus(restored ? "authenticated" : "unauthenticated"); }
      } catch { if (active && authRevision.current === startRevision) { setUser(null); setStatus("unavailable"); } }
    })();
    return () => { active = false; };
  }, []);
  const value = useMemo(() => ({
    user, status,
    async register(values) { return createAccount(values); },
    async updateProfile(values) {
      if (!user?.id) return { ok: false, message: "Log in to edit your profile." };
      const result = await updateAccountProfile(user.id, values);
      if (result.ok) { setUser(result.user); window.dispatchEvent(new CustomEvent("gamearena:user-updated")); }
      return result;
    },
    async changePassword(currentPassword, newPassword, confirmation) {
      if (!user?.id) return { ok: false, message: "Log in to change your password." };
      const result = await changeAccountPassword(user.id, currentPassword, newPassword, confirmation);
      if (result.ok) { setUser(result.user); window.dispatchEvent(new CustomEvent("gamearena:user-updated")); }
      return result;
    },
    async login(identifier, password) {
      const result = await authenticateAccount(identifier, password);
      if (!result.ok) { if (result.unavailable) setStatus("unavailable"); return result; }
      if (!saveSessionUserId(result.user.id)) return { ok: false, unavailable: true, message: "Browser session storage is unavailable. Please enable it and try again." };
      authRevision.current += 1;
      setUser(result.user); setStatus("authenticated");
      window.dispatchEvent(new CustomEvent("gamearena:user-updated"));
      return result;
    },
    logout() { authRevision.current += 1; clearSessionUserId(); setUser(null); setStatus("unauthenticated"); window.dispatchEvent(new CustomEvent("gamearena:user-updated")); },
  }), [user, status]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
