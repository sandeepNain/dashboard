var mongoose = require('mongoose');

var ExclusionSchema = mongoose.Schema({
        JobName:  String,
        StepName: String,
        LastRunDate:   Date,
        LastRunStatus: String,
        Message: String,
        job_id: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('exclusion', ExclusionSchema);