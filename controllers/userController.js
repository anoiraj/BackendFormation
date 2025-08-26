const userModel = require("../models/userModel");

module.exports.esmFocntion = async (req, res) => {
  try {
    //logique
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    //logique
    const UserList = await userModel.find()

    res.status(200).json({UserList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    //logique
    //const id = req.body
    const id = req.params.id
    //const id = req.query
    const User = await userModel.findById(id)

    res.status(200).json({User});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addClient = async (req, res) => {
  try {
    //logique
    const {username , email, password , age}=req.body
    console.log("req.body",req.body)
    const role = 'client'
    const client = new userModel({username , email, password , age , role})
    //const client = new userModel(req.body) tzid m3aha role
    const addedUser = await client.save()
    res.status(200).json(addedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addMatchOrganizer = async (req, res) => {
  try {
    //logique
    const {username , email, password , age}=req.body
    console.log("req.body",req.body)
    const role = 'matchOrganizer'
    const client = new userModel({username , email, password , age, role})
    //const client = new userModel(req.body)
    const addedUser = await client.save()
    res.status(200).json(addedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.DeleteUserById = async (req, res) => {
  try {
    //logique
    //const id = req.body
    const id = req.params.id
    const checkIfUserExists = await userModel.findById(id);
    if(!checkIfUserExists){
      throw new Error("User not Found !");
    }
    //const id = req.query
    await userModel.findByIdAndDelete(id)

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getOrderUsersByAge = async (req, res) => {
  try {
    //logique
    const UserList = await userModel.find().sort({age: 1}).limit(3) //-1 descendent / countdocuments() tehseb 9adech men users

    res.status(200).json({UserList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserByAge = async (req, res) => {
  try {
    //logique
    const age = req.params.age
    const UserList = await userModel.find({age : age})

    if(UserList.length == 0){
      throw new Error("User not Found !");
    }

    res.status(200).json({UserList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserByAgeBetweenXAndY = async (req, res) => {
  try {
    //logique
    const {minAge,maxAge} = req.body //men body parametre
    console.log(req.body)
    if(isNaN(minAge)||isNaN(maxAge)){
        throw new Error("Not Null !");
    }
        if(minAge > maxAge){
        throw new Error("minAge < maxAge !");
    }
    const UserList = await userModel.find({age : {$gte : minAge , $lte : maxAge}}).sort({age : 1})

    if(UserList.length == 0){
      throw new Error("User not Found !");
    }

    res.status(200).json({UserList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.searchUsersByUsername = async (req, res) => {
  // ?name=John
  try {
    const { username } = req.body;

    if (!username) {
      throw new Error("Please select a name");
    }

    const userList = await userModel.find({
      username: { $regex: username, $options: "i" }, // Debut
      //firstName: {$regex : `${name}$` , $options: "i" } Fin
    });

    if (userList.length === 0) {
      throw new Error("Aucune Utilisateur trouve pour ce nom");
    }

    res.status(200).json({ userList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//3malneha bch tetfasakh l file ki maysirech ajout

// controller/user.controller.js
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const User = require("../models/userModel");

// petit helper de nettoyage
async function cleanupUploadedFile(file) {
  try {
    if (!file) return;
    // multer.diskStorage donne généralement destination + filename
    const fullPath = file.path || path.join(file.destination, file.filename);
    await fsp.unlink(fullPath);
    console.log('[CLEANUP] Fichier supprimé :', fullPath);
  } catch (e) {
    // ignore si déjà supprimé
    if (e.code !== 'ENOENT') {
      console.error('[CLEANUP] Échec suppression fichier :', e.message);
    }
  }
}

module.exports.addClientWithFile = async (req, res) => {
  try {
    const userData = { ...req.body };

    if (req.file) {
      const { filename } = req.file;
      userData.image_User = filename;
      userData.role = 'client';
    }

    // (optionnel) validation business avant sauvegarde DB
    // si tu détectes un conflit, pense à nettoyer puis répondre
    // if (await userModel.exists({ email: userData.email })) {
    //   await cleanupUploadedFile(req.file);
    //   return res.status(409).json({ message: 'Email déjà utilisé' });
    // }

    const client = new userModel(userData);
    const addedUser = await client.save();
    return res.status(201).json(addedUser);
  } catch (error) {
    // IMPORTANT : nettoyer le fichier si uploadé
    await cleanupUploadedFile(req.file);
    return res.status(500).json({ message: error.message });
  }
};  

module.exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "user not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//❌❌(update email /role ) / nasnaahom fonctions 3adyin 5ir w ba3d fel front n7ot kol fonction el interface mte3ha ❌❌

const bcrypt = require("bcrypt");

module.exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params; // récupérer l'id du user depuis l'URL
    const { oldPassword, newPassword } = req.body;

    // Vérifier si les champs sont fournis
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Veuillez fournir l'ancien et le nouveau mot de passe" });
    }

    // Récupérer le user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);

    // Sauvegarder
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//bch ne7iha
module.exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params; // id du user dans l'URL
    const { role } = req.body; // nouveau rôle à attribuer

    // Vérifier si un rôle a été fourni
    if (!role) {
      return res.status(400).json({ message: "Veuillez fournir un rôle" });
    }

    // Vérifier si le rôle est valide
    const allowedRoles = ['client', 'admin', 'matchOrganizer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Rôle invalide. Rôles possibles : client, admin, matchOrganizer" });
    }

    // Mise à jour
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json({ message: "Rôle mis à jour avec succès", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE ROLE par un admin -> vers "matchOrganizer"
module.exports.updateRoleByAdminToMatchOrganizer = async (req, res) => {
  try {
    const { id } = req.params; // id du user dont on change le rôle
    const { adminId } = req.body; // id de l'admin qui fait la demande

    // Vérifier si l'adminId est fourni
    if (!adminId) {
      return res.status(400).json({ message: "Veuillez fournir l'adminId" });
    }

    // Vérifier si l'admin existe et a bien le rôle admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : seul un admin peut changer les rôles" });
    }

    // Mettre à jour le rôle du user ciblé
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: "matchOrganizer" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json({
      message: "Le rôle a été changé en matchOrganizer avec succès",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
