
module.exports = (sequelize,DataTypes) => {
    const Customer = sequelize.define('Customer',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profileImg:{
            type: DataTypes.BLOB('medium'),
            allowNull:true
        },
        note:{
            type:DataTypes.TEXT,
            allowNull:true
        },
            favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        ,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW')
        }
    })
    return Customer
}