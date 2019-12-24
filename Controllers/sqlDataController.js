const sql = require('mssql');
var bodyParser = require('body-parser');
var sqlConnector = new sql.Request();

let Services = require('./../Services');

let constant = require('../constant.js');

var lastOneHourJobs = (req, callback) =>{
    if( !(req && callback && typeof callback == 'function') ){
        callback({'error': 'Parameters are not complete'});
        return;
    }

    let querry = constant.querryPrefix;

        var date = new Date();

        var currentHour = "";
        var pastHour = "";
        currentHour = JSON.stringify(date.getHours());
        currentHour += date.getMinutes();
        currentHour += date.getSeconds();
        currentHour = parseInt(currentHour);

        pastHour = JSON.stringify(date.getHours() - 1);
        pastHour += date.getMinutes();
        pastHour += date.getSeconds();
        pastHour = parseInt(pastHour);
        
        var queryDate = "";
        queryDate = JSON.stringify(date.getFullYear());
        queryDate += date.getMonth();
        queryDate += date.getDate();
        date.getSeconds
        queryDate = parseInt(queryDate);

        // querry += "AND SJH.run_date BETWEEN " + queryDate + ' AND ' + queryDate + " "
        // querry += "And SJH.run_time BETWEEN " + pastHour + ' AND ' + currentHour + " "

        Services.exclusionServices.getList({}, {}, {}, (error, data)=>{
            if(error){
                console.log("Error in getting data for mongodb");
                callback({'error':'Error while getting data form the mongo database.'});
                return;
            }

            data.map( (item)=>{
                querry += "AND SJH.instance_id != '" + item.job_id+ "' "
            });
            
            querry +=   "AND SJH.step_name != '(Job outcome)' " +
                "ORDER BY LastRunDate desc;"

            Services.sqlDataServices.fetchSQLData(querry, (err, result)=>{
                if(err){
                    callback({"error":"Error while fetching last one hour jobs data for the databse."});
                    return;
                }
                let sendResult = [];
                let sendCount = result.rowsAffected[0] < constant.sendCount ? result.rowsAffected[0] : constant.sendCount;
                for(let index = 0; index < sendCount; index++){
                    sendResult.push(result.recordset[index]);
                }
                // total: result.rowsAffected[0]
                callback(null, {result: sendResult, total: sendCount});
                return;
            });
        });
    

}

var nextJobs = (req, callback) => {
    if( !(req && callback && typeof callback == 'function') ){
        callback({'error': 'Parameters are not complete'});
        return;
    }

    let querry = constant.querryPrefix;

    Services.exclusionServices.getList({}, {}, {}, (error, data)=>{
        if(error){
            console.log("Error in getting data for mongodb");
            callback({'error':'Error while getting data form the mongo database.'});
            return;
        }
        
        data.map( (item)=>{
            querry += "AND SJH.instance_id != '" + item.job_id+ "' "
        });

        querry += " AND SJH.run_status = 4 "
        querry += constant.querrySuffix;
        
        Services.sqlDataServices.fetchSQLData(querry, (err, result)=>{
            // ... error checks
            if(err){
                callback({"error":"Error while fetching next jobs data for the databse."});
                return;
            }
    
            callback(null, {result: result.recordset, total: result.rowsAffected[0]});
            return;
        });
    });

}

var totalJobs = async (req, callback) => {
    if( !(req && callback && typeof callback == 'function') ){
        callback({'error': 'Parameters are not complete'});
        return;
    }

    let querry = constant.querryPrefix;
    Services.exclusionServices.getList({}, {}, {}, (error, data)=>{
        if(error){
            console.log("Error in getting data for mongodb");
            callback({'error':'Error while getting data form the mongo database.'});
            return;
        }
        
        data.map( (item)=>{
            querry += "AND SJH.instance_id != '" + item.job_id+ "' "
        });
        // querry += constant.querrySuffix;
        querry +=   "AND SJH.step_name != '(Job outcome)' " +
        "ORDER BY LastRunDate desc;"
        // console.log(querry);
    
        Services.sqlDataServices.fetchSQLData(querry, (err, result)=>{
            // ... error checks
            if(err){
                callback({"error":"Error while fetching total jobs data for the databse."});
                return;
            }

            callback(null, {result: result.recordset, total: result.rowsAffected[0]});
            return;
        });
    });

}

var failedJobs = (req, callback) => {
    if( !(req && callback && typeof callback == 'function') ){
        callback({'error': 'Parameters are not complete'});
        return;
    }

    let querry = constant.querryPrefix;
    Services.exclusionServices.getList({}, {}, {}, (error, data)=>{
        if(error){
            console.log("Error in getting data for mongodb");
            callback({'error':'Error while getting data form the mongo database.'});
            return;
        }
        
        data.map( (item)=>{
            querry += "AND SJH.instance_id != '" + item.job_id+ "' "
        });
        querry += " AND SJH.run_status = 0 ";
        querry +=   "AND SJH.step_name != '(Job outcome)' " +
                "ORDER BY LastRunDate desc;"
        
        Services.sqlDataServices.fetchSQLData(querry, (err, result)=>{
            // ... error checks
            if(err){
                callback({"error":"Error while fetching failed jobs data for the databse."});
                return;
            }

            callback(null, {result: result.recordset, total: result.rowsAffected[0]});
            return;
        });
    });
}

var otherJobs = (req, callback) => {
    if( !(req && callback && typeof callback == 'function') ){
        callback({'error': 'Parameters are not complete'});
        return;
    }

    let querry = constant.querryPrefix;
    Services.exclusionServices.getList({}, {}, {}, (error, data)=>{
        if(error){
            console.log("Error in getting data for mongodb");
            callback({'error':'Error while getting data form the mongo database.'});
            return;
        }
        
        data.map( (item)=>{
            querry += "AND SJH.instance_id != '" + item.job_id+ "' "
        });

        querry += " AND ( SJH.run_status = 3 OR  SJH.run_status = 1) "
        querry += constant.querrySuffix;
        
        Services.sqlDataServices.fetchSQLData(querry, (err, result)=>{
            // ... error checks
            if(err){
                callback({"error":"Error while fetching other jobs data for the databse."});
                return;
            }

            callback(null, {result: result.recordset, total: result.rowsAffected[0]});
            return;
        });
    });
    
}

var exclusionList = (req, callback) => {
    if( !(req && callback && typeof callback == 'function') ){
        callback({'error': 'Parameters are not complete'});
        return;
    }
    Services.exclusionServices.getList({}, {}, {}, (error, data)=>{
        if(error){
            console.log("Error in getting data for mongodb");
            callback({'error':'Error while getting data form the mongo database.'});
            return;
        }
        let querry = constant.exclusionQuerryPrefix;

        data.map( (item)=>{
            querry += "AND SJH.instance_id != '" + item.job_id+ "' "
        });

        querry += constant.querrySuffix;

        Services.sqlDataServices.fetchSQLData(querry, (err, result)=>{
            // ... error checks
            if(err){
                callback({"error":"Error while fetching other jobs data for the databse."});
                return;
            }
    
            callback(null, {result: result.recordset, total: result.rowsAffected[0], exclusionList: data});
            return;
        });

    });
}

var updateExclusion = (req, callback) => {

}

var addExclusion = (req, callback) => {
    if( !(req && req.body && callback && typeof callback == 'function') ) {
        callback({'error': "parameters are not complete."});
        return;
    }

    Services.exclusionServices.getList({}, {job_id : '1'}, {}, (err, data)=>{
        if(err){
            console.log("Error in getting already add data from exclusion list.", err);
            callback({'error': "Error in getting already add data from exclusion list."});
            return;
        }
        let alreadyIds = []
        data.map( (item)=>{
            alreadyIds.push(item.job_id);
        })
        let addArray = []
        if(req.body.exclusionList){
            req.body.exclusionList.map( (listItem) => {
                if(alreadyIds.indexOf(listItem.job_id.toString()) == -1) {
                    let obj = {}
                    obj.JobName = listItem.JobName;
                    obj.StepName = listItem.StepName;
                    obj.LastRunDate = listItem.LastRunDate;
                    obj.LastRunStatus = listItem.LastRunStatus;
                    obj.Message = listItem.Message;
                    obj.job_id = listItem.job_id;
                    addArray.push(obj);
                }
            });
        }
        if(req.body.unExclusionList){
            let deleteArray = []
            req.body.unExclusionList.map( (item) => {
                if(item && item.job_id){
                    deleteArray.push(item.job_id);
                }
            });
            Services.exclusionServices.delteMany({ 'job_id': { $in: deleteArray } }, {}, (error, result)=>{
                if(error){
                    console.log("Error in deleting records");
                }
            });
        }
        Services.exclusionServices.insertMany(addArray, {}, (error, result)=>{
            if(error){
                console.log("Error in inserting data in exclusion list. ", error);
                callback({'error':'Error in inserting data in exclusion list.'});
                return;
            }
            callback(null, result);
        })
    });

}

var addOneInList = (req, callback) => {
    if( !(req && req.body && callback && typeof callback == 'function') ) {
        callback({'error': "parameters are not complete."});
        return;
    }
    let addArray = []
    let bodyObj = req.body.addObj;
    let obj = {}
    obj.JobName = bodyObj.JobName;
    obj.StepName = bodyObj.StepName;
    obj.LastRunDate = bodyObj.LastRunDate;
    obj.LastRunStatus = bodyObj.LastRunStatus;
    obj.Message = bodyObj.Message;
    obj.job_id = bodyObj.job_id;
    addArray.push(obj);

    Services.exclusionServices.insertMany(addArray, {}, (error, result)=>{
        if(error){
            console.log("Error in inserting data in exclusion list. ", error);
            callback({'error':'Error in inserting data in exclusion list.'});
            return;
        }
        callback(null, result);
    })
    
}

var removeOneToList = (req, callback) => {
    if( !(req && req.body && callback && typeof callback == 'function') ) {
        callback({'error': "parameters are not complete."});
        return;
    }
    var criteria = {}
    criteria.job_id = req.body.removeObj.job_id;
    Services.exclusionServices.deleteOne(criteria, {}, (error, result)=>{
        if(error){
            console.log("Error in inserting data in exclusion list. ", error);
            callback({'error':'Error in inserting data in exclusion list.'});
            return;
        }
        callback(null, result);
    })
}

module.exports = {
    lastOneHourJobs, nextJobs, totalJobs,
    failedJobs, otherJobs, exclusionList,
    updateExclusion, addExclusion, addOneInList,
    removeOneToList,
}