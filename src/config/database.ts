import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DB_NAME ?? 'db_name', process.env.DB_USER ?? 'username', process.env.DB_PASSWORD ?? 'password', {
    host: process.env.DB_HOST ?? 'localhost',
    dialect: 'postgres',
});

export default sequelize;
