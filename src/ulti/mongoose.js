module.exports = {

   fuseSearchToPlainObject(fuseResults) {
        return fuseResults.map(item => {
          if (item && typeof item === 'object' && item.item) {
            return item.item;
          } else if (item && typeof item === 'object') {
            return item;
          }
          return null;
        }).filter(item => item !== null);
      }
,
    mutiMongooseToObject: function (mongooseArray) {
        if (Array.isArray(mongooseArray)) {
            return mongooseArray.map(item => {
              if (item && typeof item.toObject === 'function') {
                return item.toObject();
              }
              return item;
            });
          } else if (mongooseArray && typeof mongooseArray.toObject === 'function') {
            return mongooseArray.toObject();
          } else {
            return mongooseArray;
          }
    },
    
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }


}