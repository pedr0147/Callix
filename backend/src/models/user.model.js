import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { // Nome
        type: String,
        required: true,
    },
    email: { // Email único
        type: String,
        required: true,
        unique: true,
    },
    password: { // Palavra-passe
        type: String,
        required: true,
    },
    profilePic: { // Foto de perfil
        type: String,
        default: "",
    },
    createdAt: { // Data de criação
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true, // Datas automáticas
    });

const User = mongoose.model("User", userSchema);

export { User };