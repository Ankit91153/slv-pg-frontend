import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  alternativeNumber: Yup.string()
    .nullable()
    .matches(/^[0-9]{10}$/, "Alternative number must be exactly 10 digits")
    .notRequired(),

  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),

  companyOrCollegeName: Yup.string()
    .trim()
    .min(2, "Company / College name must be at least 2 characters")
    .required("Company or College Name is required"),

  address: Yup.string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
