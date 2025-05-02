const comentarioCtrl = {};

const Usuario = require("../Models/usuario.model");
const Publicacion = require("../Models/publicacion.model");
const Comentario = require("../Models/comentario.model");

/* 
Modelo de susuario
const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    telefono: Number,
    email: String,
    direccion: String,
    contacto: String,
    foto: String,
    calificacion: Number,
    reportes: Number, //reportes = reportes + 1
    estatus: Number, // 0: Admin, 1: Activo, 2: Vendedor 3: Inactivo
},
{
    timestamps: true,
});

Modelo de publicacion
const publicacionSchema = new Schema({
    tipo: { type: String, },
    titulo: { type: String, },
    contenido: { type: String },
    foto: { type: String },
    categoria: { type: String },
    reportes: { type: Number, },
    precio: { type: Schema.Types.Array, },
    autor: { type: Schema.Types.ObjectId, ref: 'Usuario', },
    comentarios: { type: Schema.Types.Array, },
},
{
    timestamps: true
});

modelo de comentario
const comentarioSchema = new Schema({
    publicacion: { type: Schema.Types.ObjectId, ref: 'Publicacion' },
    contenido: String,
    autor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    reportes: { type: Number, },
},
{
    timestamps: true
});

*/

// ========= CRUD =========
comentarioCtrl.getComent = async (req, res) => {
  const comentarios = await Comentario.find();
  res.json(comentarios);
};

comentarioCtrl.getComentario = async (req, res) => {
  const comentario = await Comentario.findById(req.params.id);
  res.json(comentario);
};

// Crear comentario a partir del modelo
comentarioCtrl.createComent = async (req, res) => {
  const { contenido, publicacion, autor, reportes } = req.body;
  const newComentario = new Comentario({
    contenido,
    publicacion,
    autor,
    reportes,
  });
  await newComentario.save();
  res.json({ message: "Comentario creado", newComentario });
};

comentarioCtrl.deleteComent = async (req, res) => {
  await Comentario.findByIdAndDelete(req.params.id);
  res.json({ message: "Comentario eliminado" });
};

comentarioCtrl.updateComent = async (req, res) => {
  const { contenido } = req.body;
  await Comentario.findByIdAndUpdate(req.params.id, {
    contenido,
  });
  res.json({ message: "Comentario actualizado" });
};

// ========= REPORTES =========

comentarioCtrl.postReporteyValidacion = async (req, res) => {
  try {
    const { comentarioId, userId } = req.body;

    const comentario = await Comentario.findById(comentarioId);

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    const comentariosReportados = await Comentario.find({ 'reportes.reportadoPor': userId });

    const reportes24Horas = comentariosReportados.reduce((reportes, comentario) => {
      return reportes.concat(comentario.reportes.filter((reporte) => {
        const diff = Math.abs(new Date() - reporte.fecha);
        const horas = diff / (1000 * 60 * 60);
        return String(reporte.reportadoPor) === String(userId) && horas <= 24;
      }));
    }, []);

    if (reportes24Horas.length >= 3) {
      return res.status(400).json({ message: 'Solo puedes reportar 3 comentarios en 24 horas.' });
    }

    const reporteExistente = comentario.reportes.find(
      (reporte) => String(reporte.reportadoPor) === String(userId)
    );

    if (reporteExistente) {
      return res.status(400).json({ message: 'Ya has reportado este comentario en las últimas 24 horas.' });
    }

    const nuevoReporte = {
      comentarioId,
      reportadoPor: userId,
      fecha: new Date(),
    };

    await Comentario.updateOne(
      { _id: comentarioId },
      { $push: { reportes: nuevoReporte } }
    );

    res.status(201).json(nuevoReporte);
  } catch (error) {
    res.status(500).json({ message: 'Error al reportar comentario.' + error });
  }
};


module.exports = comentarioCtrl;
