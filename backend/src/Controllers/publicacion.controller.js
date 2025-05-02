const publicacionCtrl = {};

const Usuario = require("../Models/usuario.model");
const Publicacion = require("../Models/publicacion.model");
const Comentario = require("../Models/comentario.model");

//////////////////////////{ CRUD Publicaciones }//////////////////////////

// Extraer todas las publicaciones
publicacionCtrl.getPost = async (req, res) => {
  const publicaciones = await Publicacion.find();
  res.json(publicaciones);
};

// Crear una publicacion
publicacionCtrl.createPost = async (req, res) => {
  const { tipo, titulo, contenido, foto, categoria, precio, autor } = req.body;
  const newPublicacion = new Publicacion({
    tipo: tipo,
    titulo: titulo,
    contenido: contenido,
    foto: foto,
    categoria: categoria,
    precio: precio,
    autor: autor,
  });
  await newPublicacion.save();
  res.status(200).json({ message: "Publicacion creada" });
};

// Extraer una publicacion
publicacionCtrl.getPublicacion = async (req, res) => {
  const publicacion = await Publicacion.findById(req.params.id);
  res.json(publicacion);
};

// Eliminar una publicacion
publicacionCtrl.deletePost = async (req, res) => {
  await Publicacion.findByIdAndDelete(req.params.id);
  res.json({ message: "Publicacion eliminada" });
};

// Actualizar una publicacion
publicacionCtrl.updatePost = async (req, res) => {
  const { tipo, titulo, contenido, foto, categoria, precio, autor } = req.body;
  await Publicacion.findOneAndUpdate(
    { _id: req.params.id },
    {
      tipo: tipo,
      titulo: titulo,
      contenido: contenido,
      foto: foto,
      categoria: categoria,
      precio: precio,
      autor: autor,
    }
  );
  res.json({ message: "Publicacion actualizada" });
};

//////////////////////////{ Comentarios }//////////////////////////

//Buscar publicaciones por id de autor
publicacionCtrl.getPublicacionesPorAutor = async (req, res) => {
  const autor = req.params.id; // obtener el autor de los parámetros de la solicitud
  const publicaciones = await Publicacion.find({ autor: autor }); // buscar las publicaciones que corresponden al autor
  res.json(publicaciones);
};

publicacionCtrl.getPublicacionesPorTipo = async (req, res) => {
  const tipo = req.params.tipo; // obtener la tipo de los parámetros de la solicitud

  let publicaciones;
  if (tipo === "Todo") {
    publicaciones = await Publicacion.find(); // buscar todas las publicaciones
  } else {
    publicaciones = await Publicacion.find({ tipo: tipo }); // buscar las publicaciones que corresponden a la tipo
  }

  res.json(publicaciones);
};

//Buscar las publicaciones más populares
publicacionCtrl.getPublicacionesPopulares = async (req, res) => {
  const publicaciones = await Publicacion.find()
    .sort({ visitas: -1 }) // Ordenar publicaciones según las visitas en orden descendente
    .limit(6); // Limitar a los 6 primeros resultados
  
  res.json(publicaciones);
};

//Buscar los productos más populares
publicacionCtrl.getProductosPopulares = async (req, res) => {
  const publicaciones = await Publicacion.find({ tipo: "Producto" })
    .sort({ visitas: -1 }) // Ordenar publicaciones según las visitas en orden descendente
    .limit(6); // Limitar a los 6 primeros resultados
  
  res.json(publicaciones);
};

//Buscar los servicios más populares
publicacionCtrl.getServiciosPopulares = async (req, res) => {
  const publicaciones = await Publicacion.find({ tipo: "Servicio" })
    .sort({ visitas: -1 }) // Ordenar publicaciones según las visitas en orden descendente
    .limit(6); // Limitar a los 6 primeros resultados

  res.json(publicaciones);
};

//Buscar publicaciones por categoria
publicacionCtrl.getPublicacionesPorCategoria = async (req, res) => {
  const categoria = req.params.categoria; // obtener la categoría de los parámetros de la solicitud

  let publicaciones;
  if (req.params.categoria === "Todo") {
    // Si se especifica "todo", buscar todas las publicaciones de tipo "producto"
    publicaciones = await Publicacion.find({ tipo: "Producto" });
  } else {
    // De lo contrario, buscar las publicaciones de la categoría especificada que sean de tipo "producto"
    publicaciones = await Publicacion.find({
      categoria: categoria,
      tipo: "Producto",
    });
  }

  res.json(publicaciones);
};

publicacionCtrl.getPublicacionesPorCategoriaServ = async (req, res) => {
  const categoria = req.params.categoria; // obtener la categoría de los parámetros de la solicitud

  let publicaciones;
  if (req.params.categoria === "Todo") {
    // Si se especifica "todo", buscar todas las publicaciones de tipo "producto"
    publicaciones = await Publicacion.find({ tipo: "Servicio" });
  } else {
    // De lo contrario, buscar las publicaciones de la categoría especificada que sean de tipo "producto"
    publicaciones = await Publicacion.find({
      categoria: categoria,
      tipo: "Servicio",
    });
  }

  res.json(publicaciones);
};

//Buscar comentarios por publicacion
publicacionCtrl.getComentariosPorPublicacion = async (req, res) => {
  const publicacion = req.params.publicacion; // obtener la publicacion de los parámetros de la solicitud
  const comentarios = await Comentario.find({ publicacion: publicacion }); // buscar los comentarios que corresponden a la publicacion
  res.json(comentarios);
};

//Buscar autores de comentarios de la publicacion
publicacionCtrl.getAutoresComentariosPorPublicacion = async (req, res) => {
  const publicacion = req.params.publicacion; // obtener la publicacion de los parámetros de la solicitud
  const comentarios = await Comentario.find({ publicacion: publicacion }); // buscar los comentarios que corresponden a la publicacion
  const autores = comentarios.map((comentario) => comentario.autor); // obtener los autores de los comentarios
  res.json(autores);
};

//Reportar una publicacion
publicacionCtrl.postReporteyValidacion = async (req, res) => {
  try {
    const { publicacionId, userId } = req.body;

    const publicacion = await Publicacion.findById(publicacionId);

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    const publicacionesReportadas = await Publicacion.find({
      "reportes.reportadoPor": userId,
    });

    const reportes24Horas = publicacionesReportadas.reduce(
      (reportes, publicacion) => {
        return reportes.concat(
          publicacion.reportes.filter((reporte) => {
            const diff = Math.abs(new Date() - reporte.fecha);
            const horas = diff / (1000 * 60 * 60);
            return (
              String(reporte.reportadoPor) === String(userId) && horas <= 24
            );
          })
        );
      },
      []
    );

    if (reportes24Horas.length >= 3) {
      return res
        .status(400)
        .json({ message: "Solo puedes reportar 3 veces en 24 horas." });
    }

    const reporteExistente = publicacion.reportes.find((reporte) => {
      const diff = Math.abs(new Date() - reporte.fecha);
      const horas = diff / (1000 * 60 * 60);
      return String(reporte.reportadoPor) === String(userId) && horas <= 24;
    });

    if (reporteExistente) {
      return res.status(400).json({
        message: "Ya has reportado esta publicación en las últimas 24 horas.",
      });
    }

    const nuevoReporte = {
      publicacionId,
      reportadoPor: userId,
      fecha: new Date(),
    };

    await Publicacion.updateOne(
      { _id: publicacionId },
      { $push: { reportes: nuevoReporte } }
    );

    res.status(201).json(nuevoReporte);
  } catch (error) {
    res.status(500).json({ message: "Error al reportar publicación." + error });
  }
};

// Obtener todos los datos de la publicacion (incluyendo autor, comentarios y autores de comentarios)
publicacionCtrl.getPublicacionCompleta = async (req, res) => {
  const publicacion = await Publicacion.findById(req.params.id);
  const autor = await Usuario.findById(publicacion.autor);
  const comentarios = await Comentario.find({
    publicacion: publicacion._id,
  }).populate("autor");

  // Incrementar contador de visitas
  publicacion.visitas += 1;
  await publicacion.save();

  res.json({ publicacion, autor, comentarios });
};

publicacionCtrl.getPublicacionCompletaN = async (req, res) => {
  const publicacion = await Publicacion.findById(req.params.id);
  const autor = await Usuario.findById(publicacion.autor);

  await publicacion.save();

  res.json({ publicacion, autor });
};

publicacionCtrl.searchPublicaciones = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const regex = new RegExp(searchTerm, "i"); 

    const publicaciones = await Publicacion.find({ titulo: { $regex: regex }, tipo: 'Producto' })
      .exec();

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar publicaciones" });
  }
};

publicacionCtrl.searchPublicacionesServicio = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const regex = new RegExp(searchTerm, "i"); 

    const publicaciones = await Publicacion.find({ titulo: { $regex: regex }, tipo: 'Servicio' })
      .exec();

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar publicaciones" });
  }
};

publicacionCtrl.updatePublicacion = async (req, res) => {
  const { tipo, categoria, titulo, contenido, foto, precio } = req.body;
  const publicacionActualizada = await Publicacion.findByIdAndUpdate(
    req.params.id,
    { tipo, categoria, titulo, contenido, foto, precio },
    { new: true }
  );
  if(!publicacionActualizada) {
    return res.status(404).json({ message: 'Publicación no encontrada' });
  }
  res.json(publicacionActualizada);
};


module.exports = publicacionCtrl;
