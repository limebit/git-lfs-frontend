import path from "path";

export const getApiResource = (...paths: string[]): string => {
  return new URL(path.join("mgmt", ...paths), process.env.GIT_LFS_SERVER_URL)
    .href;
};

export const getAuthorizationHeader = () => {
  return `Bearer ${process.env.GIT_LFS_SERVER_TOKEN}`;
};
