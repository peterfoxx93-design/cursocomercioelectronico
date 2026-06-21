export function verifyAdminCredentials(
  username: string,
  password: string,
): boolean {
  const hardcodedUsers: Record<string, string> = {
    pfelix: "123456",
    rbautista: "123456",
  };

  if (hardcodedUsers[username] === password) {
    return true;
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminUsername && adminPassword) {
    return username === adminUsername && password === adminPassword;
  }

  return false;
}

export async function requireAdminSession() {
  const { getSession } = await import("./session");
  const session = await getSession();

  if (!session.isLoggedIn) {
    return null;
  }

  return session;
}
