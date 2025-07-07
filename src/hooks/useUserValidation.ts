import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  name?: string;
  email?: string;
  // Diğer kullanıcı özellikleri buraya eklenebilir
}

interface UseUserValidationResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  userExists: boolean;
}

export const useUserValidation = (
  userId: string | undefined
): UseUserValidationResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userExists, setUserExists] = useState<boolean>(false);

  useEffect(() => {
    const validateUser = async () => {
      if (!userId) {
        setLoading(false);
        setUserExists(false);
        setError("Kullanıcı ID bulunamadı");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/User/${userId}`);
        console.log(response);
        if (response.status === 200 && response.data) {
          setUser(response.data);
          setUserExists(true);
        } else {
          setUserExists(false);
          setError("Kullanıcı bulunamadı");
        }
      } catch (err: unknown) {
        console.error("Kullanıcı doğrulama hatası:", err);

        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setUserExists(false);
          setError("Kullanıcı bulunamadı");
        } else {
          setUserExists(false);
          setError("Kullanıcı bilgileri alınırken bir hata oluştu");
        }
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, [userId]);

  return { user, loading, error, userExists };
};
