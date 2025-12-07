import { useState, useEffect } from "react";

export function ServiceForm({ service, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing existing service
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        duration: service.duration || "",
        price: service.price || "",
        isActive: service.isActive ?? true,
      });
    }
  }, [service]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Le nom du service est requis";
    }

    const duration = parseInt(formData.duration);
    if (!formData.duration || isNaN(duration) || duration < 1) {
      newErrors.duration = "La durée doit être d'au moins 1 minute";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 1) {
      newErrors.price = "Le prix doit être d'au moins 1€";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      isActive: formData.isActive,
    };

    const result = await onSubmit(serviceData);

    setSubmitting(false);

    if (result?.success) {
      // Reset form after successful create
      if (!service) {
        setFormData({
          name: "",
          description: "",
          duration: "",
          price: "",
          isActive: true,
        });
      }
    }
  };

  return {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    isEditing: !!service,
  };
}
