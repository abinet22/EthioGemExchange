module.exports = (sequelize, DataTypes) => {
   
    const DealerCompanyInfo = sequelize.define("dealercompanyinfo", {
        userid: {
            type: DataTypes.STRING,
        },
        compid:{
            type: DataTypes.STRING,
        },
        compname:{
            type: DataTypes.STRING,
        },
        compabout:{
            type: DataTypes.STRING,
        },
        contactfname:{
            type: DataTypes.STRING,
        },
        contactlname:{
            type: DataTypes.STRING,
        },
        contactoffice:{
            type: DataTypes.STRING,
        },
        contactphone:{
            type: DataTypes.STRING,
        },
        contactaddress:{
            type: DataTypes.STRING,
        },
        contactpobox:{
            type: DataTypes.STRING,
        },
        contactweb:{
            type: DataTypes.STRING,
        },
        contactemail:{
            type: DataTypes.STRING,
        },
        simagetype: {
            type: DataTypes.STRING,
          },
          
          simagename: {
            type: DataTypes.STRING,
          },
          simagedata: {
            type: DataTypes.BLOB("long"),
          },

    });

  
    return DealerCompanyInfo;
}