import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <p>AuthContext not available</p>;
  }

  const { user, logout } = auth;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Profile</h1>

      {user ? (
        <div>
          <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.birthDate && <p><strong>Birth Date:</strong> {user.birthDate}</p>}

          <button
            onClick={logout}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading your profile...</p>
      )}
    </div>
  );
}
