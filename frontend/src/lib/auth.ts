import { TOKEN_KEY, login } from "./api";

export const auth = {
  login,
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuthed() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
