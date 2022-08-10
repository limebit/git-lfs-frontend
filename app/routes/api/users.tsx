import { ActionFunction, json, LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ request }) => {
  return json({
    users: [
      {
        userId: "test",
        username: "test",
        password: "test",
      },
      {
        userId: "test2",
        username: "test2",
        password: "test",
      },
    ],
  });
};
export const action: ActionFunction = async ({ request }) => {
  return null;
};
