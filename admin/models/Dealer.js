module.exports = (sequelize, DataTypes) => {
   
    const Dealer = sequelize.define("dealer", {
        userid: {
            type: DataTypes.STRING,
        },
        phonenumber: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        subscriptiontype: {
            type: DataTypes.STRING,
        },
        isactive: {
            type: DataTypes.STRING,
        },
        fullname: {
            type: DataTypes.STRING,
        }

    });

  
    return Dealer;
}