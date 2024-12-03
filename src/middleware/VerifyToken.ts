import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction} from 'express';

interface RequestWithUser extends Request {
    username: string;
}
const VerifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers["authorization"];

    const token = authHeader?.split(" ")[1];
    
    if (token == null) return res.sendStatus(401);
    const secretTokenKey = process.env.SECRET_TOKEN_KEY
    if (secretTokenKey == null) return res.sendStatus(401);
    jwt.verify(token, secretTokenKey, (error: VerifyErrors | null, decoded: unknown) =>{
        if (error){
            res.sendStatus(403)
            return ;
        } 
        const jwtPayload = decoded as JwtPayload;
        req.username = jwtPayload?.username;
        next();
    })
}

module.exports = VerifyToken;