import api from "@/lib/axios.js";

export async function uploadDocument(
  societeId,
  file,
  type = "autre",
  nom = ""
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("nom", nom || file.name);

  const response = await api.post(`/documents/societe/${societeId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function downloadDocument(documentId, nomOriginal) {
  const response = await api.get(`/documents/${documentId}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nomOriginal);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function deleteDocument(documentId) {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
}
