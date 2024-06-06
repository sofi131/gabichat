const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define(
  "Group",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "group",
    timestamps: false,
  }
);

module.exports = Group;
