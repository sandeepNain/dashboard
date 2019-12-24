const sql = require('mssql');
var sqlConnector = new sql.Request();

let constant = require('../constant.js');

var fetchSQLData = (querry, callback) => {
    if( !(querry) ){
        console.log("No querry is defined");
        callback({"error":"No querry is defined"});
        return;
    }
    sqlConnector.query(querry, (err, result) => {
        // ... error checks
        if(err){
            console.log("Error in fetching data from database.");
            callback({"error":"Error while fetching last one hour jobs data for the databse."});
            return;
        }
        callback(null, result );
        return;
    });
}

module.exports = {
    fetchSQLData,
}