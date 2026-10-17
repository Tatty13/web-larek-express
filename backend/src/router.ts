import { Router } from 'express';

import routerNotFound from './components/notFound/router';
import orderRouter from './components/order/router';

const router = Router();

router.use('/order', orderRouter);
router.use(routerNotFound);

export default router;
