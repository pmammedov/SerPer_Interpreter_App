import { api } from "../api";

export const getPortfolio = async (search = "") => {
  const url = `/portfolio/?${search ? `&search=${search}` : ""}`;
  return await api.get(url);
};
