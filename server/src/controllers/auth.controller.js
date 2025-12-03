import * as authService from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({
      id: req.user_id,
      username: req.user.username,
      nom: req.user.nom,
      prenom: req.user.prenom,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await authService.createUser(req.body, req.user.role);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await authService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await authService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await authService.deleteUser(req.params.id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user._id,
      oldPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
