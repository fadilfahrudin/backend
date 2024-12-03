import { Sequelize } from 'sequelize';
import { Request, Response, NextFunction } from "express";
import { login } from "../controllers/userController";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from '../models/userModal';


jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/userModal.ts");
import "dotenv/config";

describe('Login Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize(process.env.DB_NAME ?? 'db_name', process.env.DB_USER ?? 'username', process.env.DB_PASSWORD ?? 'password', {
            host: process.env.DB_HOST ?? 'localhost',
            dialect: 'postgres',
            logging: false,
        });

        await sequelize.sync({ force: true }); // Menghapus dan membuat ulang tabel
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(() => {
        mockRequest = {
            body: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    it("should return 401 if the username is not found", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        mockRequest.body = { username: "nonexistent", password: "password123" };
        await login(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Invalid username" });
    });

    it("should return 400 if the password is invalid", async () => {
        const mockUser = { id: 1, username: "admin", password: "hashedpassword" };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        mockRequest.body = { username: "admin", password: "wrongpassword" };
        await login(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Invalid password" });
    });

    it("should return 200 and access token on successful login", async () => {
        const mockUser = { id: 1, username: "admin", password: "admin" };
        const mockAccessToken = "access-token";
        const mockRefreshToken = "refresh-token";

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock)
            .mockReturnValueOnce(mockAccessToken) // for access token
            .mockReturnValueOnce(mockRefreshToken); // for refresh token

        mockRequest.body = { username: "admin", password: "admin" };
        await login(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(User.update).toHaveBeenCalledWith(
            { refreshToken: mockRefreshToken },
            { where: { id: mockUser.id } }
        );
        expect(mockResponse.cookie).toHaveBeenCalledWith(
            "refreshToken",
            mockRefreshToken,
            expect.objectContaining({
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            })
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: mockAccessToken });
    });

    it("should call next with an error if an exception is thrown", async () => {
        const mockError = new Error("Database error");
        (User.findOne as jest.Mock).mockRejectedValue(mockError);

        await login(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(mockError);
    });

})