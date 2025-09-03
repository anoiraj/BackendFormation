var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')     
const uploadfile = require('../middlewares/uploadFile')
const {requireAuthUser} = require("../middlewares/authMiddlewares")



router.get('/getAllUsers',requireAuthUser,userController.getAllUsers )
router.get('/getUserById/:id',requireAuthUser,userController.getUserById )
router.post('/addClient',userController.addClient )  //=sign in
router.post('/login',userController.login )
router.post('/logout',requireAuthUser,userController.logout )
router.post('/addMatchOrganizer',requireAuthUser,userController.addMatchOrganizer )
router.delete('/DeleteUserById/:id',requireAuthUser,userController.DeleteUserById )
router.get('/getOrderUsersByAge',requireAuthUser,userController.getOrderUsersByAge )
router.get('/getUserByAge/:age',requireAuthUser,userController.getUserByAge )
router.get('/getUserByAgeBetweenXAndY',requireAuthUser,userController.getUserByAgeBetweenXAndY )
router.get('/searchUsersByUsername',requireAuthUser,userController.searchUsersByUsername )
router.post('/addClientWithFile',uploadfile.single("image_User"),userController.addClientWithFile )
router.put('/updatePassword/:id',requireAuthUser, userController.updatePassword)
router.put('/updateRole/:id',requireAuthUser, userController.updateRole)
router.put('/updateRoleByAdminToMatchOrganizer/:id',requireAuthUser, userController.updateRoleByAdminToMatchOrganizer )
router.put('/blockUser/:id',requireAuthUser, userController.blockUser)
router.put('/softDeleteUser/:id',requireAuthUser, userController.softDeleteUser)
router.get('/getUsersByRole/:role',requireAuthUser, userController.getUsersByRole)


module.exports = router;