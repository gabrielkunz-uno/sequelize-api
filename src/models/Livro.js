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
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

Livro.belongsTo(Categoria, {
  as: 'categoria',
  foreignKey: {
    name: 'idCategoria', //respeitar o padrao lowerCamelCase JS
    allowNull: false, 
    field: 'id_categoria' //nome da coluna a ser criada no banco de dados
  }
});

Livro.belongsTo(Autor, {
  as: 'autor',
  foreignKey: {
    name: 'idAutor',
    allowNull: false,
    field: 'id_autor'
  }
});

export default Livro;