import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "../components/ProfileCard";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData: User = await response.json();
        setUser(userData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout/google`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Redireccionar al home después del logout exitoso
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
          <div></div>
        </div>
      </div>

      <div className="relative flex place-content-center p-10 md:p-50">
        <ProfileCard
          onClick={handleLogout}
          key={user.id}
          name={user.name}
          email={user.email}
          picture={user.picture}
        />
      </div>

      <footer className="fixed bottom-0 left-0 w-full h-12 bg-slate-900/80 backdrop-blur-sm text-slate-400 flex items-center justify-center text-sm z-30">
        <div className="px-4">
          Created by{" "}
          <a
            className="link"
            href="https://juansecalvinio.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            @juansecalvinio
          </a>
        </div>
      </footer>
    </div>
  );
};
