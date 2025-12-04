import api from "@/lib/axios.js";

export async function createSociete(data) {
  const response = await api.post("/societes", data);
  return response.data;
}

export async function updateSociete(id, data) {
  const response = await api.put(`/societes/${id}`, data);
  return response.data;
}

export async function deleteSociete(id) {
  const response = await api.delete(`/societes/${id}`);
  return response.data;
}
