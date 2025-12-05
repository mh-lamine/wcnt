import { useAtom } from "jotai";
import { authAtom } from "@/shared/store/atoms";
import { pb } from "@/shared/config/pocketbase";

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const login = async ({ email, password }) => {
    try {
      // Try customers first
      const authData = await pb
        .collection("customers")
        .authWithPassword(email, password);
      setAuth(authData.record);
      return { success: true, role: "customers" };
    } catch {
      // Try salons
      try {
        const authData = await pb
          .collection("salons")
          .authWithPassword(email, password);
        setAuth(authData.record);
        return { success: true, role: "salons" };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setAuth(null);
  };

  const register = async (data) => {
    try {
      await pb.collection("customers").create(data);

      // Auto-login after registration
      const authData = await pb
        .collection("customers")
        .authWithPassword(data.email, data.password);
      setAuth(authData.record);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    auth,
    login,
    logout,
    register,
    isAuthenticated: !!auth,
    role: auth?.collectionName,
  };
}
