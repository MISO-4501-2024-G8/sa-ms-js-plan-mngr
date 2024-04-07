//models.js

const {DataTypes} = require('sequelize');

class Models{
    constructor(sequelize){
        this.sequelize = sequelize;
    }

    definePlan(){
        return this.sequelize.define('plan', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            typePlan: {
                type: DataTypes.STRING,
                allowNull: false
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            value: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        });
    }

    defineDescriptionFeatures(){
        return this.sequelize.define('description_Feature', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            tipoPlan: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
    }

    definePlanIntermedio(){
        return this.sequelize.define('plan_intermedio', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            monitoreoTiempoReal: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            alertasRiesgo: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            comunicacionEntrenador: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        });
    }

    definePlanPremium(){
        return this.sequelize.define('plan_premium', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sesionesVirtuales: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            masajes: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            cuidadoPosEjercicio: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        });
    }
}

module.exports = Models;

