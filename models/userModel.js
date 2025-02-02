const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM("admin_central", "branch_manager", "branch_employee"), 
    allowNull: false 
  },
  branch_id: { type: DataTypes.INTEGER, allowNull: true },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW, 
    allowNull: false 
  }
}, { 
  timestamps: false,
  tableName: 'users' 
});

module.exports = User;
