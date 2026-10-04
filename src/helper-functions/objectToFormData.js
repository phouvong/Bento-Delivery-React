export const objectToFormData = (values) => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (key !== "confirm_password") {
      formData.append(key, value);
    }
    if (key === "identity_image") {
      value?.forEach((prescriptionImages) => {
        formData.append("identity_image[]", prescriptionImages);
      });
    }
  });

  return formData;
};
