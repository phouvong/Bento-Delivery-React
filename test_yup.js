const Yup = require('yup');

const t = (key) => key;

const schema = Yup.object({
    restaurant_address: Yup.mixed()
        .nullable()
        .test(
            "required",
            t("Restaurant address required"),
            (value) =>
                value &&
                Object.values(value).some((val) => val && val.trim().length > 0)
        ),
});

console.log("Testing with null...");
schema.validate({ restaurant_address: null })
    .then(() => console.log('Success: null is accepted (but might fail custom test)'))
    .catch(err => console.log('Error:', err.errors));

console.log("Testing with empty object...");
schema.validate({ restaurant_address: {} })
    .then(() => console.log('Success: {} is accepted'))
    .catch(err => console.log('Error:', err.errors));
