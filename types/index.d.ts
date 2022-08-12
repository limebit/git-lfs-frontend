/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

export type AnyType = {
  test: string;
};

export type UserResponse = {
  id: string;
  username: string;
  sshKeys: string[];
}[];
