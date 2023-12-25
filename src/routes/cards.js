import ApiError from "../error/ApiError";
import * as Cards from "../services/iyzico/methods/card"
import Users from "../db/users";
import nanoid from "../utils/nanoid";
import Session from "../middlewares/Session";

export default (router) => {

    router.post("/cards",Session, async(req,res) => {
        const {card} = req.body;
        let result = await Cards.createUserCard({
            locale: req.user.locale,
            conversationId: nanoid(),
            email: req.user.email,
            externalId: nanoid(),
            ...req.user?.cardUserKey && {
                cardUserKey : req.user.cardUserKey
            },
            card: card
        })

        if (!req.user.cardUserKey) {
            if (result?.status === "success" && result?.cardUserKey){
                const user = await Users.findOne({
                    _id: req.user?._id
                });
                user.cardUserKey = req.user.cardUserKey;
                await user.save();
            }
        }

        res.json(result);
    })
}