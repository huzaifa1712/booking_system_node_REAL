//assigns the table cells that have bookings the click events needed to
//cancel/delete the booking. Inside this click event, ajax request made
//with the bookingId for that cell, which will go to a route that deletes the booking
//and sends the e-mail.
function cancelBooking(){
  $("#bookings-table td:not(:first-child)").each(function(){
    if($(this).hasClass("booked") == true){
      $(this).attr("data-toggle","modal");
      $(this).attr("data-target","#cancel-modal");

      $(this).click(function(){
        console.log("ID: " + $(this).data("bookingId"));

        $.ajax({
          
        });
      });
    }
  });
}

$(document).ready(function(){
  //because in populate this button clears any booked cells, so they don't have the click
  //event assigned.
  $("#next-week").click(function(){
    cancelBooking();
  });

  //because in populate this button clears any booked cells, so they don't have the click
  //event assigned.
  $("#prev-week").click(function(){
    cancelBooking();
  });

//when changing spaces, the entire table is destroyed so a new table can be made,
//so all the tds need to be assigned their click events again
  $(".dropdown-menu li a").click(function(){
    cancelBooking();
  });

  cancelBooking()
});
