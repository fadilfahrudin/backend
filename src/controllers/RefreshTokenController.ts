import Users from '../models/userModal';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. get refresh token from cookies
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.send({ message: 'Unauthorized! Please login first!!!' })
            return;
        }

        // 2. Matching dengan refresh token yg ada di DB
        const user = await Users.findOne({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!user) {
            res.sendStatus(403)
            return;
        }

        // 3. Verify refresh token
        if (!process.env.REFRESH_TOKEN_KEY) {
            throw new Error('REFRESH_TOKEN_KEY is not set in environment variables');
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (error: VerifyErrors | null, decoded: unknown) => {
            if (error) return res.sendStatus(403);
            if (!process.env.SECRET_TOKEN_KEY) {
                throw new Error('SECRET_TOKEN_KEY is not set in environment variables');
            }
            // 4. Declare data user
            const username = user.username;
            const accessToken = jwt.sign({ username }, process.env.SECRET_TOKEN_KEY, {
                expiresIn: '20s'
            })
            res.json({ accessToken });
        })

    } catch (error) {
        next(error)
    }
}
