import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        // Referência ao utilizador que envia a mensagem
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Referência ao utilizador que recebe a mensagem
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Conteúdo textual da mensagem
        text: {
            type: String,
        },
        // URL ou caminho da imagem enviada
        image: {
            type: String,
        },
    },
    {
        // Adiciona automaticamente os campos createdAt e updatedAt
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
