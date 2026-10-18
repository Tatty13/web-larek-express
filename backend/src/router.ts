import { Router } from 'express';

import routerNotFound from './components/notFound/router';
import routerProduct from './components/product/router';
import orderRouter from './components/order/router';
import routerAuth from './components/auth/router';
import routerUpload from './components/upload/router';

const router = Router();

router.use('/auth', routerAuth);
router.use('/order', orderRouter);
router.use('/product', routerProduct);
router.use('/upload', routerUpload);
router.use(routerNotFound);

export default router;
