import mongoose, {Schema} from "mongoose";

const OfferSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        confidential: {
            type: Boolean,
            required: true
        },
        ownerId: { //owner of the offer
            type: String,
            required: true
        }
    }
)

export const Offer = mongoose.model("OfferSchema")