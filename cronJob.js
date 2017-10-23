var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * * ', function(){
  console.log('1 second');
},null,true);
