module.exports = (sequelize, DataTypes) => {
   
    const GemCategory = sequelize.define("gemcategory", {
        catid: {
            type: DataTypes.STRING,
        },
        catname: {
            type: DataTypes.STRING,
        },
        catoverview:{
          type: DataTypes.STRING,
        },
        bimagetype: {
            type: DataTypes.STRING,
          },
          
          bimagename: {
            type: DataTypes.STRING,
          },
          bimagedata: {
            type: DataTypes.BLOB("long"),
          },
     

    });

  
    return GemCategory;
}