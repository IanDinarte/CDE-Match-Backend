import mongoose, { Schema } from "mongoose";

const SuggestionSchema = new Schema(
  {
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true,
    },
    suggestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Member", "Admin"],
    },
    suggestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    state: {
      type: String,
      enum: ["Enviado", "Visualizado", "Rejeitado"],
      default: "Enviado",
    },
  },
  { timestamps: true },
);

SuggestionSchema.index({ suggestedTo: 1 });
SuggestionSchema.index({ deal: 1 });

export const Suggestion = mongoose.model("Suggestion", SuggestionSchema);
