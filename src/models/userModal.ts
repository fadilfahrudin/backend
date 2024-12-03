import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
    public id!: number;
    public name!: string;
    public username!: string;
    public password!: string;
    public refreshToken?: string;
}

User.init(
    {
        name: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        refreshToken: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, modelName: 'User' }
);

export default User;
