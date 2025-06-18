import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/db';

class Contact extends Model {
  public id!: number;
  public phoneNumber!: string | null;
  public email!: string | null;
  public linkedId!: number | null;
  public linkPrecedence!: 'primary' | 'secondary';
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  static associate(models: any) {
    // Define associations here if needed
  }
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Contacts',
        key: 'id',
      },
    },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'Contacts',
    paranoid: true,
  }
);

export default Contact;