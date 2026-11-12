export const DEMO_ADMIN_EMAIL = "admin@ncbt.demo";
export const DEMO_ADMIN_PASSWORD = "demo123";
async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
export async function verifyDemoAdmin(email: string, password: string) {
  if (email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL) return false;
  const expected =
    localStorage.getItem("ncbt-admin-password-digest") ?? (await digest(DEMO_ADMIN_PASSWORD));
  return (await digest(password)) === expected;
}
export async function setDemoPassword(password: string) {
  localStorage.setItem("ncbt-admin-password-digest", await digest(password));
}
export function signInDemoAdmin() {
  sessionStorage.setItem("ncbt-admin-auth", "1");
}
