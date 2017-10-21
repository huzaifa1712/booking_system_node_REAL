
$(document).ready(function(){
  console.log("Make bookings.js")
  console.log($("#bookings-table").data("weekNumber"))
  console.log($("#bookings-table").data("year"));
  //$(this).data('attr') == 'filled') - to identify elements with bookings
  $('td').each(function(){
    if($(this).hasClass("booked") == false){
      //add a click event if it is NOT filled
      $(this).click(function(){
        //sends booking through AJAX

        //Modal trigger
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

/*
        $.ajax({
          type:'POST',
          url:'/make_booking',
          data: {
            day: day,
            time:time,
            name:name
          },

          success:function(response){
            //do nothing
          }
        })*/

      });
    }
  });


});
