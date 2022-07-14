import { DataTypes } from "sequelize";
import { sequelize } from "../config/config";
import Categoria from "../models/Categoria"
import Autor from "../models/Autor"

const Livro = sequelize.define(
  'livros',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    sinopse: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    emprestado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Livro.belongsTo(Categoria, 
  { foreignKey: 'id_categoria' }  
);
Livro.belongsTo(Autor, 
  { foreignKey: 'id_autor'}  
);

export default Livro;
