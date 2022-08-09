import React from "react";
import { withZod } from "@remix-validated-form/with-zod";
import type { ActionFunction, LoaderFunction } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { PasswordFormField } from "../components/form-components/user-form";
import { authenticator } from "../services/auth.server";
export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/git-lfs-server",
  });
  return null;
};

const schema = zfd.formData({
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .trim()
    .min(1),
});

export const loginValidator = withZod(schema);

export const action: ActionFunction = async ({ request }) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const result = await loginValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  try {
    return await authenticator.authenticate("form", request, {
      successRedirect: "/filiale",
      throwOnError: true,
    });
  } catch (error: unknown) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) {
      return error;
    }

    return validationError(
      {
        fieldErrors: {
          password: "Logindaten stimmen nicht überein.",
        },
      },
      result.submittedData
    );
  }
};

export default function Login() {
  return (
    <div className="mx-auto flex min-h-full w-1/4 flex-col justify-center py-12 tablet:px-6 laptopL:px-8">
      <div className="tablet:mx-auto tablet:w-full tablet:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Einloggen
        </h2>
      </div>

      <div className="mt-8 tablet:mx-auto tablet:w-full tablet:max-w-md">
        <div className="bg-white py-8 px-4 shadow tablet:rounded-lg tablet:px-10">
          <ValidatedForm
            validator={loginValidator}
            method="post"
            replace={true}
            noValidate={true}
          >
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Passwort
              </label>
              <div className="mt-1">
                <PasswordFormField />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
}
