import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../db/users";
import ApiError from "../error/ApiError";

export default (router) => {
    router.post("/login", async (req, res) => {
        console.log(req.body);
        const {email, password} = req.body;
        const user = await Users.findOne({email: email});
        const passwordConfirmed = await bcryptjs.compare(password, user.password);

        if (!user.cardUserKey) {
            throw new ApiError("Kullanıcıya kart eklenmemiş.", 401, "unAuthorized");
        }
        if (!user || passwordConfirmed == false) {
            throw new ApiError("Incorrect password or email",401,"unAuthorized");
        }
        

        
        const UserJson = user.toJSON();
        const token = jwt.sign(UserJson,process.env.JWT_SECRET);
        res.json({
            token: `Bearer ${token}`,
            user: UserJson
        })
            
        
    })

}