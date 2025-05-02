const usuarioCtrl = {};
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

///////////////////////////////[ CRUD DE USUARIOS ]////////////////////////////////////

//Extraer todos los usuarios registrados
usuarioCtrl.getUser = async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

//Crear un usuario
usuarioCtrl.createUser = async (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    email,
    direccion,
    contacto,
    foto,
    calificacion,
    reportes,
    estatus,
  } = req.body;
  const newUser = new Usuario({
    nombre: nombre,
    apellido: apellido,
    telefono: telefono,
    email: email,
    direccion: direccion,
    contacto: contacto,
    foto: foto,
    calificacion: calificacion,
    reportes: reportes,
    estatus: estatus,
  });
  await newUser.save();
  res.json({ message: "Usuario creado", newUser });
}

//Obtener datos de un usuario por id
usuarioCtrl.getUsuarioById = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.json(usuario);
};

//Obtener datos de un usuario por email
usuarioCtrl.getUsuario = async (req, res) => {
  const usuario = await Usuario.findOne({ email: req.params.email });
  res.json(usuario);
};

//Borrar un usuario
usuarioCtrl.deleteUser = async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
};

//Actualizar un usuario
usuarioCtrl.updateUser = async (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    email,
    direccion,
    contacto,
    foto,
    calificacion,
    reportes,
    estatus,
  } = req.body;
  await Usuario.findByIdAndUpdate(req.params.id, {
    nombre: nombre,
    apellido: apellido,
    telefono: telefono,
    email: email,
    direccion: direccion,
    contacto: contacto,
    foto: foto,
    calificacion: calificacion,
    reportes: reportes,
    estatus: estatus,
  });
  res.json({ message: "Usuario actualizado" });
};

///////////////////////////////[ RELACIONES DE USUARIOS ]////////////////////////////////////

//Obtener publicaciones de un usuario
usuarioCtrl.getUsuarioPublicaciones = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    const publicaciones = await Publicacion.find({ autor: usuario._id }).populate("autor");
    res.status(200).json({ usuario, publicaciones });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Obtener comentarios de un usuariO
usuarioCtrl.getUsuarioComentarios = (req, res) => {
  Comentario.find({ autor: req.params.id })
    .populate("autor")
    .exec((err, comentarios) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(comentarios);
    });
};


// Agregar reporte a un usuario
usuarioCtrl.addReporte = async (req, res) => {
  try {
    await Usuario.updateOne({ _id: req.params.id }, { $inc: { reportes: 1 } });
      res.status(200).json({ message: "Reporte agregado al usuario" });
  } catch (error) {
      res.status(500).json({ message: "Error al agregar el reporte al usuario" });
      console.error(error);
  }
};

//Actualizar el perfil de un usuario
usuarioCtrl.updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, direccion, contacto, foto } = req.body;

    const updatedData = {
      nombre,
      apellido,
      telefono,
      email,
      direccion,
      contacto,
      foto,
    };

    const updatedUser = await Usuario.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.status(200).json({ message: "Perfil actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









module.exports = usuarioCtrl;
