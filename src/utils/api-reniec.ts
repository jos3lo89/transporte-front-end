import axios from "@/api/axios";

export const traerUsuario = async (dni: string) => {
  return await axios.get(`/reniec/${dni}`);
};
