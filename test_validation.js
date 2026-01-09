
const Yup = require("yup");

const schema = Yup.object({
    password: Yup.string()
        .required("No password provided.")
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
                    return this.createError({ message: errors.join("\n") });
                }
                return true;
            }
        ),
});

async function run() {
    try {
        await schema.validate({ password: "abc" }, { abortEarly: false });
        console.log("Validation passed");
    } catch (err) {
        console.log("Validation failed:");
        console.log(JSON.stringify(err.errors, null, 2));
        console.log("Error message:", err.message);
        if (err.inner) {
            err.inner.forEach(e => {
                console.log("Field:", e.path);
                console.log("Message:", e.message);
            });
        }
    }
}

run();
