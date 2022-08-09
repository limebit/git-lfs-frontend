import React from "react";
import { z } from "zod";
import { ValidatedFormInput } from "./input";

// userFieldValidation is the global validator for all user fields. The fields
// can be constructed to a schema using zfd.formData like this:
// const schema = zfd.formData({
//   username: userFieldValidation.username,
//   email: userFieldValidation.email,
//   role: userFieldValidation.role,
// });

// Create a validator and use the validation:
// const validator = withZod(schema);
// const result = await validator.validate(formData);

// Infer the type of the schema
// type User = z.infer<typeof schema>;

// the validator, result and type are meant to be used in form components.

export const userFieldValidation = {
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .trim()
    .min(1),
  // @TODO: define password rules
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .trim()
    .min(8),
};

export const UsernameFormField = () => {
  return (
    <ValidatedFormInput
      id="username"
      name="username"
      type="text"
      autoComplete="off"
      required={true}
    />
  );
};

export const PasswordFormField = () => {
  return (
    <ValidatedFormInput
      id="password"
      name="password"
      type="password"
      autoComplete="off"
      required={true}
    />
  );
};
