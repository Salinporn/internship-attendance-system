export function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return null;
  }
  return children;
}

export function RequireAuthAdmin({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!(token && role === "admin")) {
    window.location.href = "/";
    return null;
  }
  return children;
}

export function RequireAuthMentor({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!(token && role === "mentor")) {
    window.location.href = "/";
    return null;
  }
  return children;
}

export function RequireAuthTrainee({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!(token && role === "trainee")) {
    window.location.href = "/";
    return null;
  }
  return children;
}