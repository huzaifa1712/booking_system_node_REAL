$(document).ready(function(){
  //$(this).data('attr') == 'filled') - to identify elements with bookings
  var num = 0;
  $('td').each(function(){
    if($(this).hasClass("booked") == false){
      //add a click event if it is NOT filled
      $(this).click(function(){
        //sends booking through AJAX
        var day =  $(this).closest('table').find('th').eq(this.cellIndex).text().replace(/\s+/g, '');
        var time =  $(this).parent().find("td").first().text().replace(/\s+/g, '');
        var name = $(this).text().replace(/\s+/g, '');

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
        })

      });
    }
  });


});
