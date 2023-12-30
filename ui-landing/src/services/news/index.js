import { api } from "../api";

export const getNews = async (search = "") => {
  const url = `/news/?${search ? `&search=${search}` : ""}`;
  return await api.get(url);
};
