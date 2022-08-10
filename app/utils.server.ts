import path from "path";

export const getApiResource = (resource: string): string => {
  return new URL(path.join("mgmt", resource), process.env.GIT_LFS_SERVER_URL)
    .href;
};

export const getAuthorizationHeader = () => {
  return `Bearer ${process.env.GIT_LFS_SERVER_TOKEN}`;
};
