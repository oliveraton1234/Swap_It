const { Schema, model } = require("mongoose");

const publicacionSchema = new Schema(
  {
    tipo: { type: String },
    titulo: { type: String },
    contenido: { type: String },
    foto: { type: String },
    categoria: { type: String },
    precio: { type: Schema.Types.Array },
    autor: { type: Schema.Types.ObjectId, ref: "Usuario" },
    comentarios: { type: Schema.Types.Array },
    reportes: [
      {
        publicacionId: { type: Schema.Types.ObjectId, ref: "Publicacion" },
        reportadoPor: { type: Schema.Types.ObjectId, ref: "Usuario" },
        fecha: { type: Date },
      },
    ],
    visitas: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Publicacion", publicacionSchema);
