import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useServices } from "../hooks/useServices";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { formatDuration, formatPrice } from "@/shared/lib/utils";

export function ServicesPage() {
  const {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refetch,
  } = useServices();

  // Fetch services on mount
  useEffect(() => {
    const abortController = new AbortController();

    refetch(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [refetch]);

  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Le nom est requis";
    const duration = parseInt(formData.duration);
    if (!formData.duration || isNaN(duration) || duration < 1) {
      errors.duration = "Durée minimum: 1 minute";
    }
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 1) {
      errors.price = "Prix minimum: 1€";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
      isActive: true,
    });
    setFormErrors({});
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      duration: service.duration || "",
      price: service.price || "",
      isActive: service.isActive ?? true,
    });
    setFormErrors({});
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (serviceId) => {
    if (!confirm("Supprimer ce service ?")) return;
    const result = await deleteService(serviceId);
    if (result.success) {
      toast.success("Service supprimé");
    } else {
      toast.error(result.error);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (serviceId, currentStatus) => {
    const result = await toggleServiceStatus(serviceId, currentStatus);
    if (result.success) {
      toast.success(currentStatus ? "Service désactivé" : "Service activé");
    } else {
      toast.error(result.error);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      isActive: formData.isActive,
    };

    let result;
    if (editingService) {
      result = await updateService(editingService.id, serviceData);
      if (result.success) toast.success("Service mis à jour");
    } else {
      result = await createService(serviceData);
      if (result.success) toast.success("Service créé");
    }

    if (!result.success) {
      toast.error(result.error);
    } else {
      setShowForm(false);
    }

    setSubmitting(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
      isActive: true,
    });
    setFormErrors({});
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Services</h1>
        <Button onClick={handleAddNew}>Ajouter un service</Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">
            {editingService ? "Modifier le service" : "Nouveau service"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du service *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="ex: Coupe Homme"
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="ex: Coupe classique pour homme"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durée (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="30"
                />
                {formErrors.duration && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.duration}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Prix (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="25.00"
                />
                {formErrors.price && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-center text-gray-500">Chargement...</p>}

      {/* Error */}
      {error && <p className="text-center text-red-600">Erreur: {error}</p>}

      {/* Services List */}
      {!loading && services.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Aucun service. Cliquez sur "Ajouter un service" pour commencer.
        </p>
      )}

      {!loading && services.length > 0 && (
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-4 border rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{service.name}</h3>
                  {!service.isActive && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Inactif
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                )}
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>{formatDuration(service.duration)}</span>
                  <span className="font-semibold">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleToggleStatus(service.id, service.isActive)
                  }
                >
                  {service.isActive ? "Désactiver" : "Activer"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(service)}
                >
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(service.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
