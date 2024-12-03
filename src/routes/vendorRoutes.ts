import { Router } from 'express';
import { createVendor, getAllVendors, updateVendors, deleteVendor, getVendor } from '../controllers/vendorControllers';

const router = Router();

router.post('/', createVendor );
router.get('/', getAllVendors);
router.get('/:id', getVendor);
router.put('/:id', updateVendors);
router.delete('/:id', deleteVendor);

export default router;
