import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import nanoid from "../utils/nanoid";


const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const randomColorGenerator = () => {
    return Math.floor(Math.random() * 16777215).toString(16);
}


const userSchema = new Schema({
    test:{
        type: String,
        default: "Test",
        unique: true,
        required: true
    }
})