import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export async function login(username, password) {
  // On vérifie que les champs sont fournis
  if (!username || !password) {
    throw new Error("Identifiant et mot de passe requis ");
  }

  // On trouve l'utilisateur
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new Error("Identifiant ou mot de passe incorrect");
  }

  // On vérifie le mot de passe lié au user
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Identifiant ou mot de passe incorrect");
  }

  // On vérifie que le compte est actif
  if (!user.actif) {
    throw new Error("compte désactivé");
  }

  // On génère le Token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    },
  };
}

export async function createUser(data, creatorRole) {
  // Dans le cas où on crée une page register, il faudra le rôle admin pour créer des utilisateurs
  if (creatorRole !== "admin") {
    throw new Error("Seul un administrateur peut créer des utilisateurs");
  }

  // On vérifie si le username existe déjà
  const existingUser = await User.findOne({ username: data.username });
  if (existingUser) {
    throw new Error("ce nom d'utilisateur est déjà utilisé");
  }

  const user = new User(data);
  await user.save();

  return {
    id: user._id,
    username: user.username,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role,
  };
}

export async function getAllUsers() {
  return await User.find().select("-password").sort({ createdAt: -1 });
}

export async function getUserById(id) {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }
  return user;
}

export async function updateUser(id, data) {
  // On ne permet pas la modification du mot de passe, on veut suelement le username
  delete data.password;

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }
  return user;
}

export async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }
  return user;
}

export async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new Error("Ancien mot de passe incorrect");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Mot de passe modifié avec succès" };
}
