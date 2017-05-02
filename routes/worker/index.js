const queue = require('../../config/queue');
const WorkerSaveClasses = require('./save-classes');
const WorkerSaveCookie = require('./save-cookie');

queue.process('api:save-cookie', WorkerSaveCookie);
queue.process('api:save-classes', WorkerSaveClasses);
