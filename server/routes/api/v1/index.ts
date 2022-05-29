import express, {Router} from 'express';
import wallet from './wallet';
import user from './user';
import lightning from './lightning';

const router: Router = express.Router();

router.use('/lightning', lightning);

router.use('/user', user);

router.use('/wallet', wallet);

export default router;