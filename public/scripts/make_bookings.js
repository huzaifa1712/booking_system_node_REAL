$(document).ready(function(){
  //$(this).data('attr') == 'filled') - to identify elements with bookings
  $('td').each(function(){
    if($(this).hasClass("booked") == false){
      //add a click event if it is NOT filled
      $(this).click(function(){
        //sends booking through AJAX
        var day =  $(this).closest('table').find('th').eq(this.cellIndex).text().replace(/\s+/g, '');
        var time =  $(this).parent().find("td").first().text().replace(/\s+/g, '');
        //var name = $(this).text().replace(/\s+/g, '');

        //getting the user object so we can make a booking
        $.ajax({
          type:'GET',
          url:'/get_user',
          success:function(response){
            //response object is the user object
            $.ajax({
              type: 'POST',
              url:'/make_booking',
              data: {
                day: day,
                time:time,
                userName:response.name,
                userEmail:response.email
                
              },
              success:function(response){
                //do nothing
                console.log(response);
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
