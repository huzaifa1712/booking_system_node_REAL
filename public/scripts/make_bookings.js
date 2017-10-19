$(document).ready(function(){
  console.log($("#bookings-table").data("weekNumber"))
  console.log($("#bookings-table").data("year"))
  //$(this).data('attr') == 'filled') - to identify elements with bookings
  $('td').each(function(){
    if($(this).hasClass("booked") == false){
      //add a click event if it is NOT filled
      $(this).click(function(){
        //sends booking through AJAX
        var day =  $(this).closest('table').find('th').eq(this.cellIndex).text().replace(/\s+/g, '');
        var time =  $(this).parent().find("td").first().text().replace(/\s+/g, '');

        var times = time.split("-");
        var isoWeek = $("#bookings-table").data("weekNumber");
        var year = $("#bookings-table").data("year");
        //var name = $(this).text().replace(/\s+/g, '');
        var startTime = moment(day + "-" + times[0] + "-" + isoWeek + "-" + year, "dddd-hh:mma-WW-YYYY").toDate();
        var endTime = moment(day + "-" + times[1] + "-" + isoWeek + "-" + year, "dddd-hh:mma-WW-YYYY").toDate();

        console.log("Created time variables");

        //getting the user object so we can make a booking
        $.ajax({
          type:'GET',
          url:'/get_user',
          success:function(response){
            //response object is the user object
            //Use moment to construct the date.
            $.ajax({
              type: 'POST',
              url:'/make_booking',
              data: {
                name:response.name,
                email:response.email,
                date:{
                  startTime: startTime,
                  endTime: endTime
                }

              },
              success:function(response){
                //do nothing
                console.log(response);
              }
            });
            window.location.reload();
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
