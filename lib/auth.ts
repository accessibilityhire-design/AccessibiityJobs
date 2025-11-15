// Admin authentication using environment variables
// No database storage for admin credentials

export async function verifyAdmin(username: string, password: string) {
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return null;
    }

    // Simple string comparison - credentials are stored in env
    if (username === adminUsername && password === adminPassword) {
      return {
        username: adminUsername,
      };
    }

    return null;
  } catch (error) {
    console.error('Error verifying admin:', error);
    return null;
  }
}

