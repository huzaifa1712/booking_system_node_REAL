//get ARRAY of spaces through AJAX request.
function getSpaces(){
  var spaces = [];
  $.ajax({
    url:'/get_spaces',
    type:'GET',
    async:false,
    success:function(response){
      spaces = response;
    }
  });
  //possible because async is false.
  return spaces;
}

//get just one space and return it. Used to populate modal.
function getSpace(id){
  var space = {};
  $.ajax({
    url:'/get_space/' + id,
    type:'GET',
    async:false,
    success:function(response){
      space = response;
    }
  });
  //possible because async is false.
  return space;
}

//populates the spaces table with names of spaces, and assigns the space ID as data.
function populateSpacesTable(){
  var tBody = $('tbody');
  var spaces = getSpaces();

  for(var i = 0; i < spaces.length; i++){
    var tr = $("<tr>");

    var tdSpace = $("<td>" + spaces[i].name + "</td>");
    tdSpace.data("spaceId", spaces[i]._id);
    tdSpace.appendTo(tr);

    tr.appendTo(tBody);
  }
}

//populates the modal with times and days selections.
function populateModal(id){
  var space = getSpace(id);
  //make a new array with the result of the 24 hour time version of the
  //times in the space object.
  var times = space.times.map(function(time){
    return moment(time,"hh:mma").format("kk:mm");
  });
  //days array
  var days = space.days;

  var daysDiv = $("#days");

  //unchecks all checkboxes before checking those necessary.
  $("#days input").each(function(){
    $(this).prop("checked",false);
  });

  //goes through the array of days, then inside is another loop that loops through
  //the checkboxes. If the day of the id corresponding to the box(#monday gives 'monday')
  //is equal to the day, check the box.
  days.forEach(function(day){
    var idText = day.toLowerCase();
    console.log("idText: " + idText);

    $("#days input").each(function(){
      var inputId = $(this).attr('id');
      console.log("Input id:" + inputId);

      if(inputId == idText){
        $(this).prop("checked",true);
      }
    });
  });

  var modalBody = $("#modal-body");

  //removes all the time-group elements before populating with new ones.
  $(".time-group").each(function(){
    $(this).remove();
  });

  //populates the time elements. e.g 12:45 to 1:45, which is why the for loop
  //goes from 0 to length-1, and uses i and i+1th elements of the array.
  for(var i = 0; i < times.length - 1; i++){
    var div = $('<div class = "row time-group">');
    $('<input type = "time" value = "' + times[i] + '">').appendTo(div);
    $('<span class = "middle"> to </span>').appendTo(div);
    $('<input type = "time" value = "' + times[i + 1] + '">').appendTo(div);
    div.appendTo(modalBody);
  }
  /*
  for(var i = 0; i < times.length; i++){
    $('<input type = "time" value = "' + times[i] + '">').appendTo(modalBody);
  }*/
}
//goes through the table cells and assigns them a click event that opens the modal.
function openModal(){
  $("#spaces-table td").each(function(){
    $(this).attr("data-toggle","modal");
    $(this).attr("data-target","#edit-space-modal");

    $(this).click(function(){
      $("#spaceName").text($(this).text());
      //setting the modal data to the spaceId
      var spaceId = $(this).data("spaceId");

      $("#edit-space-modal").data("spaceId", spaceId);
      populateModal(spaceId);
    });
  });
}

$(document).ready(function(){
  populateSpacesTable();
  openModal();
  $("#saveBtn").click(function(){
    //console.log(moment(document.getElementById("time").valueAsDate).zone("+00:00").format("hh:mma"));
    //var date = moment(document.getElementById("time").valueAsDate).zone("+00:00");
    //console.log(document.getElementById("time").valueAsDate);
    //console.log(date.format("hh:mma"));

  });
});
