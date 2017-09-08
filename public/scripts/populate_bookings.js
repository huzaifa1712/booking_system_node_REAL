$(document).ready(function(){

  $.ajax({
    type:'GET',
    url:'/bookings',
    //success function : receives a response string consisting of an array
    //of booking objects. We will have to convert the JSOn string into
    //valid JSON first
    success:function(response){
      /* We are trying to look through our bookings, and see if
      their day and time correspond to any of the values in the table.
      If yes, we will print their name in the corresponding cell.

      day and time of the booking object
      search through tds
        search through booking objects
          if its header corresponds to the day
            if the first td of its row corresponds to the time
              print the name
      */


      //getting the array of response
      var array = [];
      var responseArr = JSON.parse(response);


      $('td').each(function(){
        var thText = $(this).closest('table').find('th').eq(this.cellIndex).text();
        if(thText == 'Tuesday'){
          $(this).text(responseArr[0].name);
        }
      });




/*
      //search through tds
      $('td').each((i,obj)=>{
        var $td = $(this);
        //find its corresponding table header and get the text
        var $thText = $td.closest('table').find('th').eq(this.cellIndex).text();
        console.log('This is thText' + $thText.toString());

        //search through booking objects
        for(var i = 0; i < responseArr.length; i++){
          console.log('Day we are trying to match: ',responseArr[i].day);

          if($thText == responseArr[i].day){
            var $time = $td.closest('tr').find('td:first').text();
            console.log('Day match passed, time from table: ', $time);

            if($time == responseArr[i].time){
              $td.innerHTML = responseArr[i].name;
              console.log('Time match passed, name passed in:', responseArr[i].name);
            }
          }
        }
      });*/
    }
  });
});


/*$(document).ready(function(){
  var array = [];
  $('td').each((i,obj)=>{
    var $td = $('td');
    var $th = $td.closest('table').find('th').text();
    array.push($th + ' ');

  });
});*/
/*
$(document).ready(function(){
  $.ajax({
    type:'GET',
    url:'/bookings',
    success:function(response){
      $('td').each((i,obj)=>{
        var $td = $('td');
        var $th = $td.closest('table').find('th').text();

        for(var key in response){
          if(response.hasOwnProperty(key)){
            console.log(response[key].name);
          }
        }
        });
      });

    }
  });*/
