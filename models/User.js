import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true,unique:true},
    password: { type: String, required: true},
    phone: { type: String, required: true,unique:true },
    address: { type: String }
})

const Users = mongoose.model("Users", UserSchema);
export default Users;