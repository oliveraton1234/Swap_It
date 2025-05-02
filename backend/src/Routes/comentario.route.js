const { Router } = require('express');
const router = Router();

const { getComent, 
  getComentario, 
  createComent, 
  deleteComent, 
  updateComent,
  postReporteyValidacion} = require('../Controllers/comentario.controller');

router.route('/') //http://localhost:4000/api/comentarios
  .get(getComent)
  .post(createComent)

router.route('/:id') //http://localhost:4000/api/comentarios/:id
  .get(getComentario)
  .delete(deleteComent)
  .put(updateComent)

router.route('/reportes')  //http://localhost:4000/api/comentarios/reportes
  .post(postReporteyValidacion)

module.exports = router;