//File that populates the your_bookings page. Might define click events
//to allow user to sort the bookings later.

//returns user bookings as an array, using the GET route defined in app.js
function getUserBookings(){
  var bookings = [];

  $.ajax({
    url:'/user_bookings',
    type:'GET',
    async:false,
    success:function(response){
      bookings = response;
    }
  });

  return bookings;
}


//returns booking details for each booking that we want to show. If we need more/less
//details, we can change this method to accomodate that. If no bookings are found,
//it simply sets it to "No booking found" for the display fields, so that will be
//displayed to user instead of just an empty table.
function returnBookingDetails(){
  var bookings = getUserBookings();
  var bookingDetails = [];

  //if there are any bookings run this:
  if(bookings.length){
    for(var i = 0; i < bookings.length; i++){
      var startTime = moment(bookings[i].date.startTime);

      //controls formatting for date
      var id = bookings[i]._id;
      var date = startTime.format("MMMM D YYYY, ") + bookings[i].time;
      //space Name
      var space = bookings[i].spaceNameWithSpaces;

      //the final booking object to push into the array
      var booking = {
        id:id,
        date:date,
        space:space
      }

      bookingDetails.push(booking);
    }
  }

  //if no bookings found this is run instead
  else{
    var booking = {
      date:"No bookings found",
      space:"No bookings found"
    }

    bookingDetails.push(booking);
  }

  return bookingDetails;
}

//populates the table with all the booking details, using the methods above.
function populateTable(){
  var table = $("#your-bookings");
  var bookingDetails = returnBookingDetails();

  var tBody = $('tbody');

  for(var i = 0; i < bookingDetails.length; i++){
    var tr = $("<tr>");

    var tdDate = $('<td class = "date" title = "Cancel this booking">' + bookingDetails[i].date + '</td>');
    tdDate.data("bookingId",bookingDetails[i].id);
    console.log("ID: " + tdDate.data("bookingId"));
    tdDate.appendTo(tr);
    $('<td>' + bookingDetails[i].space + '</td>').appendTo(tr);

    tr.appendTo(tBody);
  }


  $("#your-bookings td:first-child").each(function(){
    $(this).click(function(){
      $(this).attr("data-toggle","modal");
      $(this).attr("data-target","#cancel-modal");

      $("#cancel-modal").data("bookingId", $(this).data("bookingId"));
      //console.log("ID booking: " + $(this).data("bookingId"));
      //console.log(typeof $(this).data("bookingId"));

    });
  });
}

$(document).ready(function(){
  populateTable();

  $("#cancelBtn").click(function(){
    var bookingId = $("#cancel-modal").data("bookingId");
    console.log("bookingID: " + bookingId);

    $.ajax({
      url:'/delete_booking/' + bookingId,
      type:'GET',
      async:false,
      success:function(response){
        if(response.deleted == true){
          alert("Booking deleted!");
          window.location.reload();
        }
      }
    });


  });


});
