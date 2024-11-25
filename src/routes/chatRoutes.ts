import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/chatController';

const router = Router();

router.get('/messages', getMessages);
router.post('/message', sendMessage);

export default router;
