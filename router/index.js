var express = require('express');
var router = express.Router();
const sql = require('mssql');
var bodyParser = require('body-parser');
var sqlConnector = new sql.Request();

let controller = require('./../Controllers');

// Home page route.
router.get('/', function (req, res) {
    console.log("at the first route of the file.");
    res.redirect('/crownJob');
});

router.get('/crownJob', (req, res)=>{
    console.log("at the crown job called");
    let qury = "SELECT DISTINCT SJ.Name AS JobName, SJH.step_name AS StepName, " +
        "msdb.dbo.agent_datetime(SJH.run_date, SJH.run_time) AS LastRunDate, " +
        "CASE SJH.run_status " +
        "WHEN 0 THEN 'Failed' " +
        "WHEN 1 THEN 'Successful' " +
        "WHEN 3 THEN 'Cancelled' " +
        "WHEN 4 THEN 'In Progress' " +
        "END AS LastRunStatus, " +
        "SJH.message AS Message " +
        "FROM msdb.dbo.sysjobhistory SJH, msdb.dbo.sysjobs SJ " +
        "WHERE SJH.job_id = SJ.job_id and SJH.run_date = " +
        "(SELECT MAX(SJH1.run_date) FROM msdb.dbo.sysjobhistory SJH1 WHERE SJH.job_id = SJH1.job_id) " +
        // "AND SJH.run_status = 3 " +
        "AND SJH.step_name != '(Job outcome)' " +
        "ORDER BY JobName, LastRunDate desc;";
        
    sqlConnector.query(qury, (err, result) => {
        // ... error checks
        if(err){
            console.log("Error occure while fetching the data from database.", err);
            res.send({"error":"Error while fetching data for the databse."});
            return;
        }
 
        // console.log(result);
        res.json({result: result.recordset, total: result.rowsAffected[0]});
        return;
    });
    // res.json({ result: [
    //     {
    //         JobName: "This is job First This is job First This is job First",
    //         StepName: "Biometric done",
    //         LastRunDate: "12/04/2015",
    //         LastRunStatus: "Failed",
    //         Message: 'A message for the job first and status is failed'
    //     }, {
    //         JobName: "This is job second",
    //         StepName: "graphic done",
    //         LastRunDate: "12/04/2015",
    //         LastRunStatus: "Successful",
    //         Message: 'A message for the job first and status is Successful'
    //     }, {
    //         JobName: "This is job second for biometeric",
    //         StepName: "Biometric done",
    //         LastRunDate: "12/04/2015",
    //         LastRunStatus: "Failed",
    //         Message: 'A message for the job first and status is failed'
    //     }, {
    //         JobName: "This is job for the biometric",
    //         StepName: "Biometric done",
    //         LastRunDate: "12/12/2015",
    //         LastRunStatus: "Successful",
    //         Message: 'A message for the job first and status is Successful'
    //     }, {
    //         JobName: "This is job last",
    //         StepName: "Materics",
    //         LastRunDate: "12/05/2019",
    //         LastRunStatus: "Cancelled",
    //         Message: 'A message for the job first and status is Cancelled'
    //     }
    // ], total: 5})
});

router.post('/lastHourJob', (req, res)=>{
    controller.sqlDataController.lastOneHourJobs( req, (err, result)=>{
        if(err){
            console.log("Error is ", err);
            res.send({"error":"Error while fetching data for the databse."});
            return;
        }
        res.send(result);
    })
});

router.post('/nextJobs', (req, res)=>{
    controller.sqlDataController.nextJobs( req, (err, result)=>{
        if(err){
            console.log("Error is ", err);
            res.send({"error":"Error while fetching data for the databse."});
            return;
        }
    //     res.json({ result: [
    //     {
    //         JobName: "This is job First This is job First This is job First",
    //         StepName: "Biometric done",
    //         LastRunDate: "12/04/2015",
    //         LastRunStatus: "Failed",
    //         Message: 'A message for the job first and status is failed'
    //     }, {
    //         JobName: "This is job second",
    //         StepName: "graphic done",
    //         LastRunDate: "12/04/2015",
    //         LastRunStatus: "Successful",
    //         Message: 'A message for the job first and status is Successful'
    //     }, {
    //         JobName: "This is job second for biometeric",
    //         StepName: "Biometric done",
    //         LastRunDate: "12/04/2015",
    //         LastRunStatus: "Failed",
    //         Message: 'A message for the job first and status is failed'
    //     }, {
    //         JobName: "This is job for the biometric",
    //         StepName: "Biometric done",
    //         LastRunDate: "12/12/2015",
    //         LastRunStatus: "Successful",
    //         Message: 'A message for the job first and status is Successful'
    //     }, {
    //         JobName: "This is job last",
    //         StepName: "Materics",
    //         LastRunDate: "12/05/2019",
    //         LastRunStatus: "Cancelled",
    //         Message: 'A message for the job first and status is Cancelled'
    //     }
    // ], total: 5})
        res.send(result);
    })
});

router.post('/totalJobs', (req, res)=>{
    controller.sqlDataController.totalJobs( req, (err, result)=>{
        if(err){
            console.log("Error is ", err);
            res.send({"error":"Error while fetching data for the databse."});
            return;
        }
        res.send(result);
    })
});

router.post('/failedJobs', (req, res)=>{
    controller.sqlDataController.failedJobs( req, (err, result)=>{
        if(err){
            console.log("Error is ", err);
            res.send({"error":"Error while fetching data for the databse."});
            return;
        }
        res.send(result);
    })
});

router.post('/otherJobs', (req, res)=>{
    controller.sqlDataController.otherJobs( req, (err, result)=>{
        if(err){
            console.log("Error is ", err);
            res.send({"error":"Error while fetching data for the databse."});
            return;
        }
        res.send(result);
    })
});

router.get('/exclusionList', (req, res)=>{
    controller.sqlDataController.exclusionList( req, (err, result)=>{
        if(err){
            console.log("Error is ", err);
            res.send({"error":"Error while fetching exclusion list."});
            return;
        }
        res.send(result);
    })
});

router.post('/addToExclusion', (req, res)=>{
    controller.sqlDataController.addExclusion(req, (err, result)=>{
        if(err){
            console.log("Error in adding data exclusion list.");
            res.send({"error":"Error in adding in list."});
            return;
        }
        res.send(result);
    });
});

router.post('/addOneInList', (req, res)=>{
    controller.sqlDataController.addOneInList(req, (err, result)=>{
        if(err){
            console.log("Error in adding data exclusion list.");
            res.send({"error":"Error in adding in list."});
            return;
        }
        res.send(result);
    });
});

router.post('/removeOneToList', (req, res)=>{
    controller.sqlDataController.removeOneToList(req, (err, result)=>{
        if(err){
            console.log("Error in adding data exclusion list.");
            res.send({"error":"Error in adding in list."});
            return;
        }
        res.send(result);
    });
});

module.exports = router;