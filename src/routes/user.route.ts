import { Router } from 'express';
import UserController from '../controllers/user.controller';


const router = Router();

router.post('/', UserController.postUser);
router.get('/:email', UserController.getUser);
router.delete('/:email', UserController.deleteUser);

export default router;
