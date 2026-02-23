export async function loginUser(username, password) {
  const response = await fetch(
    "http://localhost:5000/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Login failed");
  }

  return result.data;
}
