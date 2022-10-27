module.exports = (sequelize, DataTypes) => {
   
    const GemCategory = sequelize.define("gemcategory", {
        catid: {
            type: DataTypes.STRING,
        },
        catname: {
            type: DataTypes.STRING,
        }
        
     

    });

  
    return GemCategory;
}