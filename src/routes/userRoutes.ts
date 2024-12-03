import { Router } from 'express';
import {  login, logout, register } from '../controllers/userController';
import { RefreshToken } from '../controllers/RefreshTokenController';

const router = Router();

router.post('/', login);
router.delete('/logout', logout);
router.post('/register', register);
router.get('/refresh-token', RefreshToken);

export default router;
