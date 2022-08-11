import React from "react";
import { withZod } from "@remix-validated-form/with-zod";

import { ActionFunction, LoaderFunction, useLoaderData } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import {
  PasswordFormField,
  SshFormField,
  userFieldValidation,
  UsernameFormField,
} from "~/components/form-components/user-form";
import { getApiResource, getAuthorizationHeader } from "~/utils.server";
import type { UserResponse } from "~/types";

export const loader: LoaderFunction = async (): Promise<UserResponse> => {
  const apiUrl = getApiResource("users");
  // const apiUrl = "http://localhost:3000/api/users";
  const res = await (
    await fetch(apiUrl, {
      headers: {
        Authorization: getAuthorizationHeader(),
      },
    })
  ).json();

  return res.users;
};

const sshValidator = z.string().transform((val) => {
  // split ssh keys by newline and filter empty lines
  const sshKeys = val.split("\n").filter(Boolean);
  return sshKeys;
});

const createSchema = zfd.formData({
  username: userFieldValidation.username,
  password: userFieldValidation.password,
  sshKeys: sshValidator,
  _method: z.enum(["post"]),
});
const createValidator = withZod(createSchema);

const updateSchema = zfd.formData({
  id: userFieldValidation.id,
  username: userFieldValidation.username,
  password: userFieldValidation.password.or(z.string().max(0)),
  sshKeys: sshValidator,
  _method: z.enum(["put"]),
});
const updateValidator = withZod(updateSchema);

const deleteSchema = zfd.formData({
  id: userFieldValidation.id,
  _method: z.enum(["delete"]),
});
const deleteValidator = withZod(deleteSchema);

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _method = formData.get("_method");

  if (_method === "post") {
    const result = await createValidator.validate(formData);
    if (result.error) {
      return validationError(result.error, result.submittedData);
    }
    const apiUrl = getApiResource("users");
    const postData = {
      username: result.data.username,
      password: result.data.password,
      sshKeys: result.data.sshKeys,
    };
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
  }

  // Update User
  if (_method === "put") {
    const result = await updateValidator.validate(formData);
    if (result.error) {
      return validationError(result.error, result.submittedData);
    }

    const apiUrl = getApiResource("users", result.data.id);
    const putData = {
      id: result.data.id,
      username: result.data.username,
      password: result.data.password || undefined,
      sshKeys: result.data.sshKeys,
    };
    await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    });
  }

  // Delete User
  if (_method === "delete") {
    const result = await deleteValidator.validate(formData);
    if (result.error) {
      return validationError(result.error, result.submittedData);
    }
    const apiUrl = getApiResource("users", result.data.id);
    await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
    });
  }

  return null;
};

export default function Page() {
  const data = useLoaderData<UserResponse>();
  return (
    <div className="px-4 tablet:px-6 laptop:px-8">
      <div className="tablet:flex tablet:items-center">
        <div className="tablet:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto tablet:-mx-6 laptop:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle tablet:px-6 laptop:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 tablet:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 tablet:pl-6"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Password
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 tablet:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <tr
                        className={index % 2 === 0 ? undefined : "bg-gray-50"}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 tablet:pl-6">
                          <UsernameFormField
                            id={`user-username-${user.id}`}
                            form={`user-${user.id}`}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <PasswordFormField
                            id={`user-password-${user.id}`}
                            form={`user-${user.id}`}
                          />
                        </td>
                        <td className="relative flex justify-end whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium tablet:pr-6">
                          <ValidatedForm
                            id={`delete-${user.id}`}
                            validator={deleteValidator}
                            method="post"
                            replace={true}
                          >
                            <input
                              type="hidden"
                              name="_method"
                              value="delete"
                            />
                            <input type="hidden" name="id" value={user.id} />
                            <button
                              type="submit"
                              className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Löschen
                            </button>
                          </ValidatedForm>
                          <ValidatedForm
                            id={`user-${user.id}`}
                            validator={updateValidator}
                            method="post"
                            resetAfterSubmit={true}
                            defaultValues={{
                              username: user.username,
                              // @ts-expect-error textarea field requires a string to display ssh keys separated by newline
                              sshKeys: user.sshKeys.join("\n"),
                            }}
                            replace={true}
                            noValidate={true}
                          >
                            <input type="hidden" name="_method" value="put" />
                            <input type="hidden" name="id" value={user.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 tablet:w-auto"
                            >
                              Save
                            </button>
                          </ValidatedForm>
                        </td>
                      </tr>
                      <tr
                        className={index % 2 === 0 ? undefined : "bg-gray-50"}
                      >
                        <td
                          className="whitespace-nowrap pb-4 pl-4 pr-3 text-sm font-medium text-gray-900 tablet:pl-6"
                          colSpan={2}
                        >
                          <label
                            htmlFor="sshKeys"
                            className="block text-sm font-medium text-gray-700"
                          >
                            SSH Keys
                          </label>
                          <div className="mt-1">
                            <SshFormField
                              className="sm:text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              id={`user-sshKeys-${user.username}`}
                              form={`user-${user.id}`}
                              rows={4}
                            />
                          </div>
                        </td>
                        <td
                          className={index % 2 === 0 ? undefined : "bg-gray-50"}
                        />
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="border-t-2 border-t-gray-300 bg-gray-200">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 pt-10 text-sm font-medium text-gray-900 tablet:pl-6">
                      <UsernameFormField form="new-user" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 pt-10 text-sm text-gray-500">
                      <PasswordFormField form="new-user" />
                    </td>

                    <td className="relative flex justify-end whitespace-nowrap py-4 pl-3 pr-4 pt-10 text-right text-sm font-medium tablet:pr-6">
                      <ValidatedForm
                        id="new-user"
                        validator={createValidator}
                        method="post"
                        replace={true}
                        noValidate={true}
                        resetAfterSubmit={true}
                      >
                        <input
                          form="new-user"
                          type="hidden"
                          name="_method"
                          value="post"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 tablet:w-auto"
                        >
                          Add User
                        </button>
                      </ValidatedForm>
                    </td>
                  </tr>
                  <tr className="bg-gray-200">
                    <td
                      className="whitespace-nowrap pb-4 pl-4 pr-3 text-sm font-medium text-gray-900 tablet:pl-6"
                      colSpan={2}
                    >
                      <label
                        htmlFor="sshKeys"
                        className="block text-sm font-medium text-gray-700"
                      >
                        SSH Keys
                      </label>
                      <div className="mt-1">
                        <SshFormField
                          className="sm:text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          id="new-user-ssh-keys"
                          form="new-user"
                          rows={4}
                        />
                      </div>
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
