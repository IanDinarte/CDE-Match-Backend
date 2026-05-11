import mongoose, { Schema } from "mongoose";
import { Member } from "./member.model.js";

const DealSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  confidential: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  type: {
    type: String,
    enum: ["Oferta", "Procura"],
    default: "Oferta",
  },
  area: {
    type: String,
    enum: [
      "Investimento",
      "Venda de Ativo",
      "Parceria Estratégica",
      "Compra de Negócio",
      "Financiamento",
      "Ajuda Rápida",
      "Procura de Perfis Chave",
      "Oportunidades",
      "Imobiliário",
    ],
    default: "Investimento",
  },
  interested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  state: {
    type: String,
    enum: ["Disponivel", "Fechado", "Cancelado"],
    default: "Disponivel",
  },
});

export const Deal = mongoose.model("Deal", DealSchema);
