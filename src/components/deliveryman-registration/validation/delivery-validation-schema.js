import * as Yup from "yup";

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
          if (!value) return true; // Handled by required()

          const errors = [];
          if (value.length < 8) {
            errors.push(
              "Password is too short - should be 8 characters minimum."
            );
          }
          if (!/[0-9]/.test(value)) {
            errors.push("one number.");
          }
          if (!/[A-Z]/.test(value)) {
            errors.push("one uppercase letter.");
          }
          if (!/[a-z]/.test(value)) {
            errors.push("one lowercase letter.");
          }
          if (!/[!@#$%^&*(),.?":{}|<>+_=]/.test(value)) {
            errors.push("one special character.");
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
      .test("fileType", "Only images are allowed", (value) =>
        value
          ? ["image/jpeg", "image/png", "image/jpg" ,"image/webp"].includes(value.type)
          : false
      ),

    // identity_image: Yup.mixed()
    //   .required("Identity image is required")
    //   .test("fileType", "Only images are allowed", (value) =>
    //     value
    //       ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    //       : false
    //   ),
  });
};

export default deliveryManValidationSchema;
