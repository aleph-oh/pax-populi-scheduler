var mongoose = require("mongoose");
var validators = require("mongoose-validators");
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require("../models/user.js"); 
var utils = require("../javascripts/utils.js");


//TODO need validators

//TODO check isTutor for tutor/student objects

var scheduleSchema = mongoose.Schema({
    student: {type: ObjectId, ref:"User", required:true},
    tutor: {type: ObjectId, ref:"User", required:true},
    studentClassSchedule: {type: [String], required:true},
    tutorClassSchedule: {type: [String], required:true},
    UTCClassSchedule: {type: [String], required:true},
    adminApproved: {type: Boolean, required: true, default: false},
    tutorApproved: {type: Boolean, required: true, default: false},
    studentApproved: {type: Boolean, required: true, default: false},
    firstDay: {type: String, required:true}, 
    lastDay: {type: String, required: true},
});


scheduleSchema.statics.getSchedules = function (user, callback) {
    if (utils.notAdmin(user)) {
        // get personal scheudles
        Schedule.find( {$or: [{student: user._id}, {tutor: user._id}]}, function (err, schedules) {
            if (err) {
                callback({success: false, message: err.message});
            } else {
                callback(null, schedules);
            }
        });
    } else {
        // get schedules for that school/country/region
        User.getUser(user.username, function (err, user) {
            if (err) {
                callback({success: false, message: err.message});
            } else {
                Schedule.find( {$or: [{country: user.country}, {region: user.region}, {school: user.school}]}, function (err, schedules) {
                    if (err) {
                        callback({success: false, message: err.message});
                    } else {
                        callback(null, schedules);
                    }
                });
            }
        })
    }
    
}

//how to run processes in the background like once a day at some time


//keep at bottom of file
var Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;