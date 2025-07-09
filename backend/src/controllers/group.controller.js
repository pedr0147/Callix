import { Group } from "../models/group.model.js";

export const createGroup = async (req, res) => {
    const { name, members } = req.body;
    const group = await Group.create({ name, members: [...members, req.user._id] });
    res.status(201).json(group);
};

export const getMyGroups = async (req, res) => {
    const groups = await Group.find({ members: req.user._id });
    res.status(200).json(groups);
};
