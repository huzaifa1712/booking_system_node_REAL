var parseXlsx = require('excel');
var path = require('path');

parseXlsx(path.join(__dirname, 'uploads/excelFIle.xlsx'),function(err,data){
  if(err){
    throw err;
  }

  console.log(data)
});
