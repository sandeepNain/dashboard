const dbURL = `mongodb://localhost:27017/loadCheck`

var querryPrefix = "SELECT DISTINCT SJ.Name AS JobName, SJH.step_name AS StepName, " +
"msdb.dbo.agent_datetime(SJH.run_date, SJH.run_time) AS LastRunDate,  SJH.run_date, SJH.run_time, " +
"CASE SJH.run_status " +
"WHEN 0 THEN 'Failed' " +
"WHEN 1 THEN 'Successful' " +
"WHEN 3 THEN 'Cancelled' " +
"WHEN 4 THEN 'In Progress' " +
"END AS LastRunStatus, " +
"SJH.message AS Message " +
"FROM msdb.dbo.sysjobhistory SJH join  msdb.dbo.sysjobs SJ on SJH.job_id = SJ.job_id " +
"join ( " +
    "SELECT SJH1.job_id ,MAX(msdb.dbo.agent_datetime(SJH1.run_date, SJH1.run_time)) LastRunDate     " +
    "FROM msdb.dbo.sysjobhistory SJH1 " +
	"where SJH1.step_name != '(Job outcome)' " +
	"group by SJH1.job_id) as SJH1 " +
 "on SJH.job_id = SJH1.job_id and SJH1.LastRunDate = msdb.dbo.agent_datetime(SJH.run_date, SJH.run_time) ";
 
var querrySuffix = "where SJH.step_name != '(Job outcome)' "+
"ORDER BY JobName, LastRunDate desc; ";


exclusionQuerryPrefix = "SELECT DISTINCT SJ.Name AS JobName, SJH.step_name AS StepName, SJH.instance_id AS job_id, " +
"msdb.dbo.agent_datetime(SJH.run_date, SJH.run_time) AS LastRunDate,  SJH.run_date, SJH.run_time, " +
"CASE SJH.run_status " +
"WHEN 0 THEN 'Failed' " +
"WHEN 1 THEN 'Successful' " +
"WHEN 3 THEN 'Cancelled' " +
"WHEN 4 THEN 'In Progress' " +
"END AS LastRunStatus, " +
"SJH.message AS Message " +
"FROM msdb.dbo.sysjobhistory SJH join  msdb.dbo.sysjobs SJ on SJH.job_id = SJ.job_id " +
"join ( " +
    "SELECT SJH1.job_id ,MAX(msdb.dbo.agent_datetime(SJH1.run_date, SJH1.run_time)) LastRunDate     " +
    "FROM msdb.dbo.sysjobhistory SJH1 " +
	"where SJH1.step_name != '(Job outcome)' " +
	"group by SJH1.job_id) as SJH1 " +
 "on SJH.job_id = SJH1.job_id and SJH1.LastRunDate = msdb.dbo.agent_datetime(SJH.run_date, SJH.run_time) ";

const sendCount = 12;

module.exports = {
    querryPrefix, querrySuffix, dbURL,
    exclusionQuerryPrefix, sendCount,
}