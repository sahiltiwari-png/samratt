import API from "./auth";

export const getRoles = async () => {
  const res = await API.get("/roles");
  return res.data.roles || [];
};
