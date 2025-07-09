// Importação dos modelos e bibliotecas necessárias
import { User } from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

// Obtém a lista de utilizadores para a sidebar, excluindo o utilizador autenticado
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v -createdAt -updatedAt");

        res.status(200).json({
            users: filteredUsers,
        });
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error);
        res.status(500).json({
            message: "Internal server error",
        });

    }
}

// Obtém as mensagens trocadas entre o utilizador autenticado e outro utilizador
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1})

        res.status(200).json({
            messages
        })
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({
            message: "Internal server error",
        });

    }
}

// Envia uma mensagem individual, com suporte para imagem e notificação em tempo real via socket.io
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // Notifica o recetor em tempo real se estiver online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json({ message: newMessage });

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
    }
}

// Envia uma mensagem para um grupo, com suporte para imagem e notificação em tempo real
export const sendMessageGroup = async (req, res) => {
    const { text, image } = req.body;
    const { groupId } = req.params;
    const senderId = req.user._id;

    const newMessage = await Message.create({
        senderId,
        groupId,
        text,
        image,
    });

    io.to(groupId).emit("newGroupMessage", newMessage);
    res.status(201).json({ message: newMessage });
}
