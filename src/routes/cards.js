import ApiError from "../error/ApiError";
import * as Cards from "../services/iyzico/methods/card"
import Users from "../db/users";
import nanoid from "../utils/nanoid";
import Session from "../middlewares/Session";

export default (router) => {

    router.post("/cards", Session, async(req,res) => {
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
                user.cardUserKey = result.cardUserKey;
                await user.save();
            }
        }

        res.json(result);
    })

    router.get("/cards", Session, async(req,res)=> {
        if (!req.user?.cardUserKey) {
            throw new ApiError("User has no credit card !",403,"userHasNoCreditCard");
        }

        let cards = await Cards.getUserCards({
            locale: req.user.locale,
            conversationId: nanoid(),
            cardUserKey:req.user?.cardUserKey
        })

        res.status(200).json(cards);
    })
    // card delete with card token 
    router.delete("/cards/delete-by-token", Session, async(req,res)=> {
        let {cardToken} = req.body;
        if (!cardToken) {
            throw new  ApiError("Card token is required",400,"cardtokenrequired");
        }
        let deleteResult = await Cards.deleteUserCard({
            locale:req.user?.locale,
            conversationId:nanoid(),
            cardUserKey:req.user?.cardUserKey,
            cardToken:cardToken
        })

        res.json(deleteResult).status(200);


    })

    // card delete with card index 
    // /cards/:0/delete-by-index  => cardIndex queystring as a querystring get a integer value .

    router.delete("/cards/:cardIndex/delete-by-index",Session,async(req,res)=>{

        if (!req.params?.cardIndex) {
            throw new ApiError("CardIndex is required",400,"cardIndexRequired");
        }
        let cards = await Cards.getUserCards({
            locale:req.user.locale,
            conversationId:nanoid(),
            cardUserKey:req.user?.cardUserKey
        })

        const index = parseInt(req.params?.cardIndex);
        if (index >= cards?.cardDetails.length) {
            throw new ApiError("Card not exist",400,"cardnotfound")
        }

        const cardToken = cards?.cardDetails[index];

        let deleteResult = await Cards.deleteUserCard({
            locale:req.user?.locale,
            conversationId:nanoid(),
            cardUserKey:req.user?.cardUserKey,
            cardToken:cardToken
        })

        res.json(deleteResult).status(200);
    })
}