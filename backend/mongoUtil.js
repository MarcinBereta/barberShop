var MongoClient = require( 'mongodb' ).MongoClient;
var _db;
module.exports = {
  connectToServer: function( callback ) {
    console.log("CONNECTING TO MONGODB")
    MongoClient.connect( "mongodb+srv://Mardorus:PokerAGH@poker.gmn3mgg.mongodb.net/?retryWrites=true&w=majority", function( err, client ) {
      _db = client.db("test");
      console.log("Connected to MongoDB");
      return callback( err );
    } );
  },
  getDb: function() {
    return _db;
  }
};