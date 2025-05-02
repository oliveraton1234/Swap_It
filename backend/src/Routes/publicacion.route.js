const { Router } = require("express");
const router = Router();

const {
  getPost,
  createPost,
  getPublicacion,
  deletePost,
  updatePost,
  getPublicacionesPorAutor,
  getPublicacionesPorTipo,
  getComentariosPorPublicacion,
  getAutoresComentariosPorPublicacion,
  getPublicacionesPorCategoria,
  getPublicacionCompleta,
  postReporteyValidacion,
  getPublicacionesPopulares,
  getProductosPopulares,
  getServiciosPopulares,
  searchPublicaciones,
  searchPublicacionesServicio,
  getPublicacionesPorCategoriaServ,
  getPublicacionCompletaN,
  updatePublicacion
} = require("../Controllers/publicacion.controller");

router
  .route("/") //http://localhost:4000/api/publicaciones
  .get(getPost)
  .post(createPost);

router
  .route("/:id") //http://localhost:4000/api/publicaciones/:id
  .get(getPublicacion)
  .delete(deletePost)
  .put(updatePost);

router
  .route("/usuario/:id") //http://localhost:4000/api/publicaciones/usuario/:id
  .get(getPublicacionesPorAutor);

router
  .route("/tipo/:tipo") //http://localhost:4000/api/publicaciones/tipo/:categoria
  .get(getPublicacionesPorTipo);

router
  .route("/categoria/:categoria") //http://localhost:4000/api/publicaciones/categoria/:categoria
  .get(getPublicacionesPorCategoria);

  router
  .route("/categoria/servicio/:categoria") //http://localhost:4000/api/publicaciones/categoria/:categoria
  .get(getPublicacionesPorCategoriaServ);

router
  .route("/comentarios/:id") //http://localhost:4000/api/publicaciones/comentarios/:id
  .get(getComentariosPorPublicacion);

router
  .route("/autores/:id") //http://localhost:4000/api/publicaciones/autores/:id
  .get(getAutoresComentariosPorPublicacion);

router
  .route("/reportPost") //http://localhost:4000/api/publicaciones/reportes/:id
  .post(postReporteyValidacion);

router
  .route("/info/:id") //http://localhost:4000/api/publicaciones/info/:id
  .get(getPublicacionCompleta);

router
  .route("/destacados/ver") //http://localhost:4000/api/publicaciones/populares/:tipo
  .get(getPublicacionesPopulares);

router
  .route("/destacados/productos") //http://localhost:4000/api/publicaciones/populares/:tipo
  .get(getProductosPopulares);

router
  .route("/destacados/servicios") //http://localhost:4000/api/publicaciones/populares/:tipo
  .get(getServiciosPopulares);

router
  .route("/buscar/:searchTerm") 
  .get(searchPublicaciones);
  
router
  .route("/buscar/servicio/:searchTerm") 
  .get(searchPublicacionesServicio);

router 
  .route("/edit/info/:id")
  .get(getPublicacionCompletaN)
  .put(updatePublicacion)
  ;

module.exports = router;
