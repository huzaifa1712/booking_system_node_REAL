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

//getting the array of response, the bookings array
//FOR THE BELOW TO WORK THE BOOKINGS ARRAY NEEDS TO LOOK LIKE THIS:
/* var bookings = [
  {
    name:'Jeff',
    time: '12:45-1:15',
    day:'Wednesday'
  },
  {
    name:'Carl',
    time: '2:15-2:45',
    day:'Tuesday'
  }
];
*/

//this function populates the bookings based on the isoWeekNumber passed in
//uses this weeknum to request bookings that are in that week.


function remove2AllBookings(){
  $('td').each(function(){
    $(this).text('3r4 ');
    if($(this).hasClass('booked')){
      $(this).removeClass('booked');
      $(this).click(function(){
        $(this).attr("data-toggle","modal");
        $(this).attr("data-target","#booking-modal");
      });

    }
  });
}

function clickBooking(){
  $(this).attr("data-toggle","modal");
  $(this).attr("data-target","#booking-modal");  //sets it so that it opens a modal when clicked

  var day =  $(this).closest('table').find('th').eq(this.cellIndex).text().replace(/\s+/g, '');
  console.log("Day: " + day);
  var time =  $(this).parent().find("td").first().text().replace(/\s+/g, '');
  console.log("Time: " + time);

  var times = time.split("-");
  console.log("Times array: " + times);
  var isoWeek = $("#bookings-table").data("weekNumber");
  console.log("Week num: " + isoWeek);
  console.log("is weeknum an int: " + Number.isInteger(isoWeek));

  var year = $("#bookings-table").data("year");
  console.log("Year: " + year);
  console.log("is year an int: " + Number.isInteger(year));
  console.log('startTime: ' + Time.startAndEndTimes(day,times,isoWeek,year).startDate);
  console.log('endTime: ' + Time.startAndEndTimes(day,times,isoWeek,year).endDate);

  //var name = $(this).text().replace(/\s+/g, '');
  console.log("Date string to format: " + day + "-" + times[0] + "-" + isoWeek + "-" + year);
  var startTime = Time.startAndEndTimes(day,times,isoWeek,year).startDate;
  var endTime = Time.startAndEndTimes(day,times,isoWeek,year).endDate;
  console.log("Created time variables");
  console.log(startTime);
  console.log(endTime);

  //only submit and make booking if Submit button is clicked
  $("#submitBtn").click(function(){
    //if none of the buttons in the group are checked, alert to pick one
    if(!$("input[name='reminder']:checked").val()){
      alert("Please pick one of the reminder options!");
    }

    else{
      var reminderValue = $("input[name='reminder']:checked").val();
      console.log(reminderValue);
      $.ajax({
        type:'GET',
        url:'/get_user',         //getting the user object so we can make a booking
        success:function(response){
          //response object is the user object
          //Use moment to construct the date.
          console.log("user: ");
          console.log(response);
          $.ajax({
            type: 'POST',
            url:'/make_booking',
            data: {
              id:response._id,
              name:response.name,
              email:response.email,
              timeString:time,
              startTime: startTime,
              endTime: endTime,
              reminder:reminderValue

            },
            success:function(response){
              //do nothing
              alert("Booking saved!");

              console.log(response);
            }
          });
          alert("Booking saved!");
          window.location.reload();
        }
      });
    }
  });
}
function populateBookings(isoWeekNum){
  console.log("isoWeek from populate: " + isoWeekNum);
  $.ajax({
    type:'GET',
    async:false,
    url:'/bookings/' + isoWeekNum,
    //success function : receives a response string consisting of an array
    //of booking objects. We will have to convert the JSOn string into
    //valid JSON first
    success:function(response){
      var responseArr = JSON.parse(response);
      console.log(responseArr);

      if(Array.isArray(responseArr) && responseArr.length > 0){
        //Loop through all the table cells(td)
        $('td').each(function(){
          var dayFromTable = $(this).closest('table').find('th').eq(this.cellIndex).text(); //finds the td's header(day)
          dayFromTable = dayFromTable.replace(/\s+/g, ''); //takes out any spaces

          var timeFromTable = $(this).parent().find("td").first().text(); //finds the td's time(first td of its row)
          timeFromTable = timeFromTable.replace(/\s+/g, ''); //takes out any spaces

          //loop through the bookings array sent as response
          for(var i = 0; i < responseArr.length; i++){
            console.log("loop is running");
            var dayFromBooking = moment(responseArr[i].date.startTime).format("dddd");
          //  console.log(dayFromBooking);
            dayFromBooking = dayFromBooking.replace(/\s+/g, '');

            var timeFromBooking = responseArr[i].time;
            timeFromBooking = timeFromBooking.replace(/\s+/g, '');
            //console.log(responseArr[i].email);
            var name = responseArr[i].user.name.split(" ")[0];
            name = name.replace(/\s+/g, '');

            var bookingIsoWeekNumber = moment(responseArr[i].date.startTime).isoWeek();
            //console.log(bookingIsoWeekNumber);

            //if day and time of the object match day and time of the cell, print the name in the cell
            if(dayFromTable == dayFromBooking && timeFromBooking == timeFromTable && bookingIsoWeekNumber == isoWeekNum){
              $(this).text(name);
              //$(this).css({'background-color':'#B6282D', 'color':'white'});
              //fills the html with an attribute we can look at later to determine if its booked
              $(this).addClass('booked');
            }
            /*
            else{
                $(this).text('');
                if($(this).hasClass('booked')){
                  $(this).removeClass('booked');
                }
            }*/
          }
        });
      }


    }
  });
}
function removeAllBookings(){
  console.log("Columns: " +$("table > tbody > tr:first > td").length);
  var noOfColumns = $("table > tbody > tr:first > td").length;

  for(var i = 2; i <= noOfColumns; i++ ){
    if($('#bookings-table td:nth-child(' + i + ')').hasClass('booked')){
      $('#bookings-table td:nth-child(' + i + ')').removeClass('booked');
      //console.log(removed);
    }
    $('#bookings-table td:nth-child(' + i + ')').html(' ');
  }

  };




//TODO: later change this so it asks a route for the start and end days of the week,
//given the Space selected, so we can use that to find the following:
function setScheduleHeader(pageWeekNum){
  var startOfWeek = moment().isoWeek(pageWeekNum).weekday(1).format("MMMM D");
  var endOfWeek = moment().isoWeek(pageWeekNum).weekday(5).format("MMMM D");
  $("#startOfWeek").text(startOfWeek + " to ");
  $("#endOfWeek").text(endOfWeek);
}

//requests and gets the maxWeekNumber possible. ajax request set to async false
//because otherwise it just returns 0
function getMaxWeekNum(){
  var maxWeekNum = 0;
  $.ajax({
    type:'GET',
    url:'/maxWeekNum',
    async:false,
    success:function(response){
      console.log("max week num: " + parseInt(response));
       maxWeekNum = parseInt(response);
    }
  });

  return maxWeekNum;
}

//this function disables and enables the next and previous week buttons based on
//the page week num
function enableAndDisableButtons(pageWeekNum,maxWeekNum){
  if(pageWeekNum == moment().isoWeek()){
    //disable prevWeek button
    $("#next-week").prop("disabled",false);
    $("#prev-week").prop("disabled",true);


  }

  else if(pageWeekNum >= maxWeekNum){
    $("#next-week").prop("disabled",true);
    $("#prev-week").prop("disabled",false);

  }

  else if(pageWeekNum > moment().isoWeek()){
    //enable prev week button
    $("#next-week").prop("disabled",false);
    $("#prev-week").prop("disabled",false);


  }

}

function loadPage(pageWeekNum, maxWeekNum){
  setScheduleHeader(pageWeekNum);
  enableAndDisableButtons(pageWeekNum,maxWeekNum);
  removeAllBookings();
  populateBookings(pageWeekNum);
}

/*function weekNumButtons(pageWeekNum){
  var maxWeekNum = 0;
  $.ajax({
    type:'GET',
    url:'/maxWeekNum',

    success:function(response){
      console.log("max week num: " + parseInt(response));
       maxWeekNum = parseInt(response);
    }
  });

  if(pageWeekNum == moment().isoWeek()){
    //disable prevWeek button
    $("#prev-week").prop("disabled",true);
  }

  else if(pageWeekNum > moment().isoWeek()){
    //enable prev week button
    $("#prev-week").prop("disabled",false);
  }

  else if(pageWeekNum >= maxWeekNum){
    $("#next-week").prop("disabled",true);
    console.log("disabled next week");
  }

  $("#prev-week").click(function(){
    //if NOT(pageWeekNum equals realtime currentWeekNum), decrease
    if(!(pageWeekNum <= moment().isoWeek())){
      pageWeekNum = pageWeekNum - 1;
      $("#bookings-table").data("weekNumber", pageWeekNum);
      weekNumButtons(pageWeekNum);
      populateBookings(pageWeekNum);
    }

  });

  $("#next-week").click(function(){
    if(!(pageWeekNum >= maxWeekNum)){
      pageWeekNum = pageWeekNum + 1;
      $("#bookings-table").data("weekNumber", pageWeekNum);
      weekNumButtons(pageWeekNum);
      populateBookings(pageWeekNum);
    }
  });

  console.log("pageWeekNum: " + pageWeekNum);
  populateBookings(pageWeekNum);

}*/

$(document).ready(function(){
  //storing weekNumber and year in the bookingsTable thing so we can use it
  //later to make bookings
  if(!$("bookings-table").data("weekNumber")){
    //when page loads, if it's empty it will populate the field
    //if not empty, that means a button was clicked so it's ok
    //even if we press previous till we're down to the currentWeekNum, still ok
    $("#bookings-table").data("weekNumber", moment().isoWeek());
  }

  else{
    //do nothing
  }
  //$("#bookings-table").data("weekNumber", moment().isoWeek());
  $("#bookings-table").data("year", moment().year());

var pageWeekNum = $("#bookings-table").data("weekNumber");
//pageWeekNum = pageWeekNum + 1;
//var maxWeekNum = 0;
  //$('<div id = "schedule" class = "text-center">Schedule: June 12 to June 16</div>').insertBefore("#bookings-table");
var maxWeekNum = getMaxWeekNum();

$("#prev-week").click(function(){
  //if NOT(pageWeekNum equals realtime currentWeekNum), decrease
  if(!(pageWeekNum <= moment().isoWeek())){
    pageWeekNum = pageWeekNum - 1;
    $("#bookings-table").data("weekNumber", pageWeekNum);
    console.log("prevWeek pageWeekNum: " + pageWeekNum);
    loadPage(pageWeekNum, maxWeekNum);
    //populateBookings(pageWeekNum);

    //window.location.reload();

  }

});

$("#next-week").click(function(){
  if(!(pageWeekNum >= maxWeekNum)){
    pageWeekNum = pageWeekNum + 1;
    $("#bookings-table").data("weekNumber", pageWeekNum);
    console.log("nextWeek pageWeekNum: " + pageWeekNum);
    loadPage(pageWeekNum,maxWeekNum);
    //populateBookings(pageWeekNum);
    //window.location.reload();
  }
});


loadPage(pageWeekNum, maxWeekNum);
//populateBookings(pageWeekNum);

});
