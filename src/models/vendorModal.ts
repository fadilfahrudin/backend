import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
class Vendor extends Model {
  public id!: number;
  public vendor!: string;
  public address!: string;
}

Vendor.init(
  {
      vendor: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false},
  },
  { sequelize, modelName: 'Vendor' }
);

export default Vendor;
