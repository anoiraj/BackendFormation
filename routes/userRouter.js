var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')     
const uploadfile = require('../middlewares/uploadFile')


/* GET home page. */
router.get('/getAllUsers',userController.getAllUsers )
router.get('/getUserById/:id',userController.getUserById )
router.post('/addClient',userController.addClient )
router.post('/addMatchOrganizer',userController.addMatchOrganizer )
router.delete('/DeleteUserById/:id',userController.DeleteUserById )
router.get('/getOrderUsersByAge',userController.getOrderUsersByAge )
router.get('/getUserByAge/:age',userController.getUserByAge )
router.get('/getUserByAgeBetweenXAndY',userController.getUserByAgeBetweenXAndY )
router.get('/searchUsersByUsername',userController.searchUsersByUsername )
router.post('/addClientWithFile',uploadfile.single("image_User"),userController.addClientWithFile )
router.put('/updatePassword/:id', userController.updatePassword)
router.put('/updateRole/:id', userController.updateRole)
router.put('/updateRoleByAdminToMatchOrganizer/:id', userController.updateRoleByAdminToMatchOrganizer )



module.exports = router;