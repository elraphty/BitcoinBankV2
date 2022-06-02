import express, { Router } from 'express';
import { registerUser, userAddress, userBalance, userLogin, userTransactionsCount } from '../../../controllers/user';
import { createUser } from '../../../helpers/validators/user';
import { authUser } from '../../../helpers/auth';

const router: Router = express.Router();

router.post('/register', createUser, registerUser);

router.post('/login', createUser, userLogin);

router.get('/balance', authUser, userBalance);

router.get('/address', authUser, userAddress);

router.get('/transactions/count', authUser, userTransactionsCount);

export default router;