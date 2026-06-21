export function verifyAdminCredentials(
  username: string,
  password: string,
): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error(
      "Faltan variables de entorno ADMIN_USERNAME y ADMIN_PASSWORD",
    );
  }

  return username === adminUsername && password === adminPassword;
}

export async function requireAdminSession() {
  const { getSession } = await import("./session");
  const session = await getSession();

  if (!session.isLoggedIn) {
    return null;
  }

  return session;
}
