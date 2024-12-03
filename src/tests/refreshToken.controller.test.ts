import { Request, Response, NextFunction } from "express";
import { RefreshToken } from "../controllers/RefreshTokenController";
import jwt from "jsonwebtoken";
import User from '../models/userModal';

jest.mock("jsonwebtoken");
jest.mock("../models/userModal.ts");

describe("RefreshToken Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            cookies: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    it("should return a message if refresh token is not provided", async () => {
        mockRequest.cookies = {};
        await RefreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Unauthorized! Please login first!!!' });
    });

    it("should return 403 if refresh token is not found in the database", async () => {
        mockRequest.cookies = { refreshToken: "mockRefreshToken" };
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await RefreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should return 403 if the refresh token is invalid", async () => {
        mockRequest.cookies = { refreshToken: "mockRefreshToken" };
        const mockUser = { username: "admin", refreshToken: "mockRefreshToken" };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (jwt.verify as jest.Mock).mockImplementation((_token, _key, callback) => {
            callback(new Error("Invalid token"), null);
        });

        await RefreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });

    it("should return access token if refresh token is valid", async () => {
        mockRequest.cookies = { refreshToken: "mockRefreshToken" };
        const mockUser = { username: "testuser", refreshToken: "mockRefreshToken" };
        const mockAccessToken = "mockAccessToken";

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (jwt.verify as jest.Mock).mockImplementation((_token, _key, callback) => {
            callback(null, { username: "testuser" });
        });
        (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);

        await RefreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockResponse.json).toHaveBeenCalledWith({ accessToken: mockAccessToken });
    });

    it("should call next with an error if an exception is thrown", async () => {
        const mockError = new Error("Database error");
        // Mock Users.findOne untuk melempar error
        
        jest.spyOn(User, 'findOne').mockRejectedValue(mockError);
        (User.findOne as jest.Mock).mockRejectedValue(mockError);
        mockRequest.cookies = { refreshToken: 'some-invalid-token' };

        await RefreshToken(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        // Verifikasi bahwa next dipanggil dengan error
        expect(mockNext).toHaveBeenCalledWith(mockError);
    });
})