const { Schema, model } = require('mongoose');

const comentarioSchema = new Schema({
    publicacion: { type: Schema.Types.ObjectId, ref: 'Publicacion' },
    contenido: String,
    autor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    reportes: [
        {
          comentarioId: { type: Schema.Types.ObjectId, ref: "Comentario" },
          reportadoPor: { type: Schema.Types.ObjectId, ref: "Usuario" },
          fecha: { type: Date },
        },
    ],
},
{
    timestamps: true
});

module.exports = model('Comentario', comentarioSchema); 