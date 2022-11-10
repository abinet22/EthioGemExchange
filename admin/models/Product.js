module.exports = (sequelize, DataTypes) => {
   
    const Product = sequelize.define("product", {
        proid: {
            type: DataTypes.STRING,
        },
        catid: {
            type: DataTypes.STRING,
        },
        subcatid: {
            type: DataTypes.STRING,
        },
        productoverview:{
          type: DataTypes.STRING,
        },
        productdescription: {
            type: DataTypes.STRING,
          },
          
          productdetailinfo: {
            type: DataTypes.STRING,
          },
          sizemax: {
            type: DataTypes.STRING,
          },
          
          sizemin: {
            type: DataTypes.STRING,
          },
          weight: {
            type: DataTypes.STRING,
          },
          
          price: {
            type: DataTypes.STRING,
          },
          productimage1: {
            type: DataTypes.BLOB("long"),
          },
          productimage2: {
            type: DataTypes.BLOB("long"),
          },
          productimage3: {
            type: DataTypes.BLOB("long"),
          },
          productimage4: {
            type: DataTypes.BLOB("long"),
          },
          productimage5: {
            type: DataTypes.BLOB("long"),
          },
          productimagen1: {
            type: DataTypes.STRING,
          },
          productimagen5: {
            type: DataTypes.STRING,
          },
          productimagen2: {
            type: DataTypes.STRING,
          },
          productimagen3: {
            type: DataTypes.STRING,
          },
          productimagen3: {
            type: DataTypes.STRING,
          },
          dealerid: {
            type: DataTypes.STRING,
          },
          issold: {
            type: DataTypes.STRING,
          },
          
          isactive: {
            type: DataTypes.STRING,
          }
    });

  
    return Product;
}