import express, { Router } from 'express';
import { addInvoice, listInvoices, lookupInvoice , payUserInvoice} from '../../../controllers/lightning';
import { create, lookup } from '../../../helpers/validators/lightning';
import { authUser } from '../../../helpers/auth';

const router: Router = express.Router();

router.post('/invoice', create, authUser, addInvoice);

router.get('/payments', authUser, listInvoices);

router.post('/lookup', lookup, authUser, lookupInvoice);

router.post('/pay', lookup, authUser, payUserInvoice);

export default router;

