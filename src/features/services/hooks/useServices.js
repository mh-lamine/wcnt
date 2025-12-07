import { useAtom } from "jotai";
import { pb } from "@/shared/config/pocketbase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  servicesAtom,
  servicesLoadingAtom,
  servicesErrorAtom,
} from "@/shared/store/atoms";

export function useServices() {
  const [services, setServices] = useAtom(servicesAtom);
  const [loading, setLoading] = useAtom(servicesLoadingAtom);
  const [error, setError] = useAtom(servicesErrorAtom);
  const { auth } = useAuth();

  const fetchServices = async (signal) => {
    if (!auth?.id) {
      setServices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const records = await pb.collection("salon_services").getFullList({
        filter: `salon = "${auth.id}"`,
        sort: "-created",
      });

      // Only update state if not aborted
      if (!signal?.aborted) {
        setServices(records);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err.message);
        console.error("Error fetching services:", err);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const createService = async (serviceData) => {
    try {
      setError(null);

      const newService = await pb.collection("salon_services").create({
        salon: auth.id,
        ...serviceData,
        isActive: serviceData.isActive ?? true,
      });

      setServices((prev) => [newService, ...prev]);
      return { success: true, data: newService };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      setError(null);

      const updatedService = await pb.collection("salon_services").update(id, serviceData);

      setServices((prev) =>
        prev.map((service) => (service.id === id ? updatedService : service))
      );

      return { success: true, data: updatedService };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteService = async (id) => {
    try {
      setError(null);

      await pb.collection("salon_services").delete(id);

      setServices((prev) => prev.filter((service) => service.id !== id));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const toggleServiceStatus = async (id, currentStatus) => {
    return updateService(id, { isActive: !currentStatus });
  };

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refetch: fetchServices,
  };
}
