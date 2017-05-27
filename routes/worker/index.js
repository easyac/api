const queue = require('../../config/queue');
const WorkerSaveClasses = require('./save-classes');
const WorkerSaveCookie = require('./save-cookie');
const WorkerLoginFail = require('./login-fail');
const WorkerSyncUsers = require('./sync-users');

queue.process('api:save-cookie', WorkerSaveCookie);
queue.process('api:save-classes', WorkerSaveClasses);
queue.process('api:login-error', WorkerLoginFail);
queue.process('api:sync-users', WorkerSyncUsers);
