import { NextFunction, Request, Response } from 'express';
import User from '../models/userModal';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Password does not match' })
        return;
    }

    const users = await User.findAll()
    for (const user of users) {
        if (user.username === username) {
            res.status(400).json({ message: 'Username already used' });
            return;
        }
    }

    const salt = await bcrypt.genSalt();
    const hasPassword = await bcrypt.hash(password, salt)
    try {
        await User.create({
            name: name,
            username: username,
            password: hasPassword,
        })
        res.status(200).json({ message: 'Created successfully' })
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            res.status(401).json({ msg: 'Invalid username' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ msg: 'Invalid password' });
            return;
        }
        if (!process.env.SECRET_TOKEN_KEY) {
            throw new Error('SECRET_TOKEN_KEY is not set in environment variables');
        }
        const accessToken = jwt.sign({ username }, process.env.SECRET_TOKEN_KEY, {
            expiresIn: '20s'
        })

        if (!process.env.REFRESH_TOKEN_KEY) {
            throw new Error('REFRESH_TOKEN_KEY is not set in environment variables');
        }
        const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: '1d'
        })

        await User.update({ refreshToken: refreshToken }, {
            where: {
                id: user.id,
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // max umur 24 hours
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
        })
        res.status(200).json({ accessToken });
    } catch (error: any) {
        next(error)
    }
}
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(204)
            return;
        }
        const user = await User.findOne({ where: { refreshToken: refreshToken } });
        if (!user) {
            res.sendStatus(204)
            return ;
        };

        await User.update({ refreshToken: null }, {
            where: {
                id: user.id
            }
        })
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
        });
        res.sendStatus(200);
    } catch (error) {
        next(error)
    }
}