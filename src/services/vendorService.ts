import { Op } from 'sequelize';
import Vendor from '../models/vendorModal';

export const getVendors = async (limit: number, offset: number, keywords?: string) => {
    try {
        const { count, rows } = await Vendor.findAndCountAll({
            where: keywords
                ? {
                    [Op.or]: [
                        { vendor: { [Op.iLike]: `%${keywords}%` } },
                        { address: { [Op.iLike]: `%${keywords}%` } },
                    ],
                }
                : undefined,
            limit,
            offset,
            order: [["id", "DESC"]],
        });
        return {
            count,
            rows,
            totalPages: Math.ceil(count / limit)
        };
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while fetching vendors');
    }
};
export const findVendorById = async (id: string) => {
    const vendor = await Vendor.findOne({ where: { id } });
    if (!vendor) {
        const error = new Error('Vendor not found');
        (error as any).status = 404;
        throw error;
    }
    return vendor;
};

export const deleteVendorById = async (id: string) => {
    const deleted = await Vendor.destroy({ where: { id } });
    if (deleted === 0) {
        const error = new Error('Vendor not found');
        (error as any).status = 404;
        throw error;
    }
    return true;
};
