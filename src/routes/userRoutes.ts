import { Router } from 'express';
import { register, loginUser, allUsers } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', loginUser);
router.get('/users', allUsers)

export default router;
