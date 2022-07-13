import { DataTypes } from "sequelize";
import { sequelize } from "../config/config";
import Usuario from "./Usuario"

const Publicacao = sequelize.define(
	'publicacoes',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        }
	},
	{
		freezeTableName: true,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
);

//relacionamentos
Publicacao.belongsTo(Usuario, {
	foreignKey: 'id_usuario'
});

export default Publicacao;