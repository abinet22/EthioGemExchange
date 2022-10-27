module.exports = (sequelize, DataTypes) => {
   
    const GemSubCategory = sequelize.define("gemsubcategory", {
        subcatid: {
            type: DataTypes.STRING,
        },
        subcatname: {
            type: DataTypes.STRING,
        },
        catid: {
            type: DataTypes.STRING,
        },
        
     

    });

  
    return GemSubCategory;
}