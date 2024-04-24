module.exports = {
  multipleMongooseToObject: (mongooses) => {
    return mongooses.map((mongooses) => mongooses.toObject());
  },
  MongooseToObject: (mongoose) => {
    return mongoose ? mongoose.toObject() : mongoose;
  },
  multipleMongooseToObjectPage: (mongooses, currentPage) => {
    return mongooses.map((mongoose) => ({
      ...mongoose,
      currentPage,
    }));
  },
};
