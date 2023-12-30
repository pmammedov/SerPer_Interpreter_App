import { api } from "../api";

export const getComments = async (search = "") => {
  const url = `/comments/?${search ? `&search=${search}` : ""}`;
  return await api.get(url);
};

export const addComment = async (dataComment) => {
  return await api.post("/comments/", dataComment);
};
