import Societe from "../models/Societe.js";

export async function create(data) {
  const societe = new Societe(data);
  return await societe.save();
}

export async function findAll(search = "") {
  let query = {};

  if (search) {
    query = {
      $or: [
        { nom: { $regex: search, $options: "i" } },
        { raisonSociale: { $regex: search, $options: "i" } },
        { "contact.nom": { $regex: search, $options: "i" } },
        { "contact.prenom": { $regex: search, $options: "i" } },
      ],
    };
  }
  return await Societe.find(query).sort({ createdAt: -1 });
}

export async function findById(id) {
  const societe = await Societe.findById(id);
  if (!societe) {
    throw new Error("Société non trouvée");
  }
  return societe;
}

export async function update(id, data) {
  const societe = await Societe.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!societe) {
    throw new Error("Société non trouvée");
  }
  return societe;
}

export async function remove(id) {
  const societe = await Societe.findByIdAndDelete(id);
  if (!societe) {
    throw new Error("Société non trouvée");
  }
  return societe;
}
