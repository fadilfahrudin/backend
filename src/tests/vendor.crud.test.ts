import { Sequelize } from 'sequelize';
import "dotenv/config";
import Vendor from '../models/vendorModal'; // Pastikan path model sesuai dengan proyek Anda

describe('User Model CRUD Operations', () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize(process.env.DB_NAME ?? 'db_name', process.env.DB_USER ?? 'username', process.env.DB_PASSWORD ?? 'password', {
            host: process.env.DB_HOST ?? 'localhost',
            dialect: 'postgres',
            logging: false,
        });

        await sequelize.sync({ force: true }); // Menghapus dan membuat ulang tabel
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('Create New Vendor', () => {
        it('should create a new user', async () => {
            const vendorData = {
                vendor: 'Vendor 1',
                address: 'Jakarta Selatan',
            };

            const vendor = await Vendor.create(vendorData);

            expect(vendor).toHaveProperty('id');
            expect(vendor.vendor).toBe(vendorData.vendor);
            expect(vendor.address).toBe(vendorData.address);
        });
    });

    describe('Read Vendor', () => {
        it('should retrieve a vendor by id', async () => {
            const vendor = await Vendor.create({
                vendor: 'Vendor 1',
                address: 'Jakarta Selatan',
            });

            const foundVendor = await Vendor.findByPk(vendor.id);

            expect(foundVendor).not.toBeNull();
            expect(foundVendor?.id).toBe(vendor.id);
            expect(foundVendor?.vendor).toBe(vendor.vendor);
        });

        it('should retrieve all vendors', async () => {
            await Vendor.create({ vendor: 'Vendor 1', address: 'Jakarta Pusat' });
            await Vendor.create({ vendor: 'Vendor 2', address: 'Tangerang' });

            const vendors = await Vendor.findAll();

            expect(vendors.length).toBeGreaterThan(1);
        });
    });

    describe('Update Vendor', () => {
        it('should update a vendor\'s information', async () => {
            const vendor = await Vendor.create({
                vendor: 'Vendor 3',
                address: 'Jakarta Selatan',
            });

            const [updatedCount] = await Vendor.update(
                {
                    vendor: 'Vendor Updated',
                    address: 'Jakarta Utara',
                },
                {
                    where: { id: vendor.id },
                }
            );
            expect(updatedCount).toBe(1);
            const updatedVendor = await Vendor.findByPk(vendor.id);
            expect(updatedVendor).not.toBeNull();
            expect(updatedVendor?.vendor).toBe('Vendor Updated');
            expect(updatedVendor?.address).toBe('Jakarta Utara');
        });
    });

    describe('Delete Vendor', () => {
        it('should delete a vendor by id', async () => {
            const vendor = await Vendor.create({
                vendor: 'Delete Vendor 1',
                address: 'Delete Jakarta Selatan',
            });

            const deleteCount = await Vendor.destroy({
                where: { id: vendor.id },
            });

            expect(deleteCount).toBe(1);
            const deletedVendor = await Vendor.findByPk(vendor.id);
            expect(deletedVendor).toBeNull();
        });
    });
});
