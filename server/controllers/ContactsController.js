import User from "../models/UserModel.js";

export const getAllContacts = async (request, response, next) => {
    try {
        const { userId } = request;
        const { searchTerm = "" } = request.body;

        let searchQuery = {};
        if (searchTerm) {
            searchQuery = {
                $and: [
                    { _id: { $ne: userId } },
                    {
                        $or: [
                            { firstName: { $regex: searchTerm, $options: "i" } },
                            { lastName: { $regex: searchTerm, $options: "i" } },
                            { email: { $regex: searchTerm, $options: "i" } }
                        ]
                    }
                ]
            };
        } else {
            searchQuery = { _id: { $ne: userId } };
        }

        const contacts = await User.find(searchQuery, "firstName lastName email _id");

        return response.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};