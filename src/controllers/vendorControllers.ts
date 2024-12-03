import { NextFunction, Request, Response } from 'express';
import Vendor from '../models/vendorModal';
import { deleteVendorById, findVendorById, getVendors } from '../services/vendorService';

export const createVendor = async (req: Request, res: Response) => {
    try {
        await Vendor.create(req.body);
        res.status(201).json({ message: 'Vendor created successfully', status: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message, status: false });
    }
};

export const getVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await findVendorById(req.params.id);
        res.status(200).json(vendor);
    } catch (error) {
        next(error)
    }
};
export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const offset = (page - 1) * limit;
    const keywords = req.query.keywords as string || '';
    try {
        const { count, rows, totalPages } = await getVendors(limit, offset, keywords);
        res.status(200).json({
            limit,
            count,
            status: true,
            message: 'Vendors fetched successfully',
            totalPages,
            page,
            rows
        });
    } catch (error: any) {
        next(error)
    }
};

export const updateVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await findVendorById(req.params.id);
        await Vendor.update(req.body, { where: { id: req.params.id } });
        res.status(200).json({ message: 'Vendor updated successfully'});
    } catch (error: any) {
        next(error)
    }
};

export const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteVendorById(req.params.id);
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error: any) {
        next(error)
    }
};
