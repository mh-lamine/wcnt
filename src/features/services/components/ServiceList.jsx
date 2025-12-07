import { useState } from "react";

export function ServiceList({
  services,
  loading,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleDelete = async (serviceId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    setDeletingId(serviceId);
    const result = await onDelete(serviceId);
    setDeletingId(null);

    return result;
  };

  const handleToggleStatus = async (serviceId, currentStatus) => {
    setTogglingId(serviceId);
    const result = await onToggleStatus(serviceId, currentStatus);
    setTogglingId(null);

    return result;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getServiceStats = () => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
    const inactive = total - active;

    return { total, active, inactive };
  };

  const groupedServices = () => {
    return {
      active: services.filter((s) => s.isActive),
      inactive: services.filter((s) => !s.isActive),
    };
  };

  return {
    deletingId,
    togglingId,
    handleDelete,
    handleToggleStatus,
    formatDuration,
    formatPrice,
    getServiceStats,
    groupedServices,
    isEmpty: services.length === 0,
    isLoading: loading,
  };
}
