import { api } from "../api";

export const getLanguages = async (search = "") => {
  const url = `/languages/?${search ? `&search=${search}` : ""}`;
  return await api.get(url);
};
