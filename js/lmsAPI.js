"use strict";

const scorm = pipwerks.SCORM;
let lmsConnected;

function handleError(msg) {
  console.error(msg);
}

function initCourse() {
  lmsConnected = scorm.init();
  if (lmsConnected) {
    const completionStatus = scorm.get("cmi.completion_status");
    const successStatus = scorm.get("cmi.success_status");
    const logins = scorm.get("cmi.learner_name");

    scorm.set("cmi.score.min", "0");
    scorm.set("cmi.score.max", 100);
    scorm.set("cmi.score.scaled", 1);
    scorm.set("cmi.score.raw", 1);
    scorm.save();
  }
}

window.onload = function () {
  initCourse();
};
