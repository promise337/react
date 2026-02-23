export function saveAuthData(data) {
  if (!data?.token) {
    throw new Error("No token received from backend");
  }

  // Save only the JWT token
  localStorage.setItem("token", data.token);

  // Save user info separately (exclude token)
  const { token, ...userData } = data;
  localStorage.setItem("user", JSON.stringify(userData));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.clear();
}
