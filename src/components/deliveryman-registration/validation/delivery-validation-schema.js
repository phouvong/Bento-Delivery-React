import * as Yup from "yup";

const PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const IDENTITY_IMAGE_TYPES =  ["image/jpeg", "image/png", "image/webp", "image/gif"];

const getFile = (value) => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (Array.isArray(value)) return value[0] || null;
  if (value?.length) return value[0] || null;
  return null;
};

const deliveryManValidationSchema = () => {
  return Yup.object().shape({
    f_name: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name can't exceed 50 characters"),

    l_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name can't exceed 50 characters"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    phone: Yup.string().required("Phone number is required"),

    password: Yup.string()
      .required("Password is required")
      .test(
        "password-requirements",
        "Password requirements not met",
        function (value) {
          if (!value) return true;

          const errors = [];

          if (value.length < 8) {
            errors.push("Password is too short - should be 8 characters minimum.");
          }
          if (!/[0-9]/.test(value)) {
            errors.push("Password must contain at least one number.");
          }
          if (!/[A-Z]/.test(value)) {
            errors.push("Password must contain at least one uppercase letter.");
          }
          if (!/[a-z]/.test(value)) {
            errors.push("Password must contain at least one lowercase letter.");
          }
          if (!/[!@#$%^&*(),.?":{}|<>+_=]/.test(value)) {
            errors.push("Password must contain at least one special character.");
          }

          if (errors.length > 0) {
            return this.createError({ message: errors.join(" ") });
          }

          return true;
        }
      ),

    confirm_password: Yup.string()
      .required("Confirm Password required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),

    earning: Yup.number()
      .typeError("Earning must be a number")
      .required("Earning is required"),

    zone_id: Yup.string().required("Zone selection is required"),

    vehicle_id: Yup.string().required("Vehicle selection is required"),

    identity_type: Yup.string()
      .required("Identity type is required")
      .oneOf(["passport", "driving_license", "nid"], "Invalid identity type"),

    identity_number: Yup.string().required("Identity number is required"),

    image: Yup.mixed()
      .required("Profile image is required")
      .test("fileType", "Only JPG, JPEG, PNG, and WEBP images are allowed", (value) => {
        const file = getFile(value);
        if (!file) return false;
        return PROFILE_IMAGE_TYPES.includes(file.type);
      })
      .test("fileSize", "Profile image must be less than 1MB", (value) => {
        const file = getFile(value);
        if (!file) return false;
        return file.size <= 1024 * 1024;
      }),

    identity_image: Yup.mixed()
      .required("Identity image is required")
      .test("fileType", "Only JPG, JPEG, and PNG images are allowed", (value) => {
        const file = getFile(value);
        if (!file) return false;
        return IDENTITY_IMAGE_TYPES.includes(file.type);
      })
      .test("fileSize", "Identity image must be less than 1MB", (value) => {
        const file = getFile(value);
        if (!file) return false;
        return file.size <= 1024 * 1024;
      }),
  });
};

export default deliveryManValidationSchema;