import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { loginValidator } from "../routes";
import { sessionStorage } from "./session.server";

export const authenticator = new Authenticator<Boolean>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const result = await loginValidator.validate(form);

    if (result.error) {
      throw Error("User not found");
    }

    const { password } = result.data;

    const validAuthentication =
      password && password === process.env.ADMIN_PASSWORD;

    if (validAuthentication) {
      return true;
    }

    throw Error("Authentication failed, invalid password.");
  }),
  "form"
);
