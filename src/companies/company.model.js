import { Schema, model } from "mongoose";

const CompanySchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: [true, "Company already exists."]
        },
        impact:{
            type: String,
            required: [true, "Impact required"],
        },
        years:{
            type: Number,
            required: [true, "Years required"],
            maxLength:4 
        },
        category:{
            type: String,
            required: [true, "Category required"],
            enum: ["MICROENTERPRISE","SMALL_COMPANY","MIDDLE_COMPANY","GRAND_COMPANY"]
        },
        state:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Company', CompanySchema);