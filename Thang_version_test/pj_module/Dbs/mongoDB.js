
const Mongo = require('mongodb');
MongoClient = Mongo.MongoClient
ObjectId = Mongo.ObjectId
const uri = "mongodb+srv://builong99:buiphilong@testcluster-rzfqa.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri,{ useUnifiedTopology: true, useNewUrlParser: true })
mongodb = {
    client: client,
    ObjectId: ObjectId
}
module.exports = mongodb