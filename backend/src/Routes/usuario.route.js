const { Router } = require('express');
const router = Router();

const { 
  getUser, 
  createUser, 
  getUsuarioById,
  getUsuario, 
  deleteUser, 
  updateUser,
  getUsuarioPublicaciones, 
  getUsuarioComentarios,
  addReporte,
  deleteFoto,
  updateFoto,
  updateProfile,
} = require('../Controllers/usuario.controller');

router.route('/') //http://localhost:4000/api/usuarios
  .get(getUser)
  .post(createUser)

router.route('/:id') //http://localhost:4000/api/usuarios/:id
  .put(updateUser)
  .delete(deleteUser)
  .get(getUsuarioById)

router.route('/get/:email') //http://localhost:4000/api/usuarios/get/:email
.get(getUsuario)

router.route('/:idUsuario/publicaciones') //http://localhost:4000/api/usuarios/:idUsuario/publicaciones
  .get(getUsuarioPublicaciones)

router.route('/:idUsuario/comentarios') //http://localhost:4000/api/usuarios/:idUsuario/comentarios
  .get(getUsuarioComentarios)

router.route('/reportes/:id') 
  .post(addReporte);

  router.route('/updateProfile/:id') 
  .put(updateProfile);



module.exports = router;