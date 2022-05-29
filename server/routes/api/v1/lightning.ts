import express, { Router } from 'express';
import { addInvoice, listInvoices } from '../../../controllers/lightning';
import { createInvoice } from '../../../helpers/validators/lightning';
import { authUser } from '../../../helpers/auth';

const router: Router = express.Router();

router.post('/invoice', createInvoice, authUser, addInvoice);

router.get('/transactions', authUser, listInvoices);

export default router;

