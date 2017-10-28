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

  console.log(space.times);
  var timesFromSpace = space.times;
  var times24h = [];
  /*
  var times = space.times.map(function(time){
    //return moment(time,"hh:mma").format("kk:mm");
    return {moment(time.start,"hh:mma").format("kk:mm"),moment(time.end,"hh:mma").format("kk:mm")};
  });*/

  //make a new array with the result of the 24 hour time version of the
  //times in the space object.
  for(var i = 0; i < timesFromSpace.length; i++){
    var timeObj = {
      start:moment(timesFromSpace[i].start,"hh:mma").format("kk:mm"),
      end:moment(timesFromSpace[i].end,"hh:mma").format("kk:mm")
    }

    times24h.push(timeObj);
  }

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
    var dayFromSpace = day;
    console.log("dayFromSpace: " + day);

    $("#days input").each(function(){
      var inputId = $(this).attr('id');
      console.log("Input id:" + inputId);

      if(inputId == day){
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
  for(var i = 0; i < times24h.length; i++){
    var div = $('<div class = "row time-group">');
    $('<input id = "start" type = "time" value = "' + times24h[i].start + '">').appendTo(div);
    $('<span class = "middle"> to </span>').appendTo(div);
    $('<input id = "end" type = "time" value = "' + times24h[i].end + '">').appendTo(div);
    div.appendTo(modalBody);
  }
  /*
  for(var i = 0; i < times.length; i++){
    $('<input type = "time" value = "' + times[i] + '">').appendTo(modalBody);
  }*/
}

//populate for add space modal.
function populateAddSpace(){

  //unchecks all checkboxes.
  $("#days input").each(function(){
    $(this).prop("checked",false);
  });


  var modalBody = $("#modal-body");

  //removes all the time-group elements before populating with new ones.
  $(".time-group").each(function(){
    $(this).remove();
  });

  //populates the time elements. Puts 4 in there for a start.
  for(var i = 0; i < 3; i++){
    var div = $('<div class = "row time-group">');
    $('<input id = "start" type = "time" value = "">').appendTo(div);
    $('<span class = "middle"> to </span>').appendTo(div);
    $('<input id = "end" type = "time" value = "">').appendTo(div);
    div.appendTo(modalBody);
  }

}
//goes through the table cells and assigns them a click event that opens the modal.
//Also sets spaceName.
function openModal(){
  $("#spaces-table td").each(function(){
    $(this).attr("data-toggle","modal");
    $(this).attr("data-target","#edit-space-modal");

    $(this).click(function(){
      //set the header to the name, and the text area to the name.
      $("#spaceName").text($(this).text());
      $("#editName").val($(this).text());

      //setting the modal data to the spaceId
      var spaceId = $(this).data("spaceId");

      $("#edit-space-modal").data("spaceId", spaceId);
      populateModal(spaceId);
    });
  });
}

//Validate settings input.
//1. Check that at least one day is checked.
//2. Check that none of the time fields are blank.
//If none are blank:
//3. Check that the 2nd time in each time-group is a moment of time ahead of the first.
//4. Check that each consecutive time group's starting time is ahead or equal of/to the previous time-group's
//end time.
//Returns: Error message if any, boolean indicating if there is an error message or not.
function validateSettingsInput(){
  //Initialise error msg string and boolean indicating error or not.
  var errorMsg = "ERROR: Please make sure the following are done:\n\n";
  var isErr = false; //innocent until proven guilty

  //1. Check that at least one day is checked.
  if(!$("input[name='day']:checked").val()){
    isErr = true;
    errorMsg = errorMsg + "At least one day is selected.\n\n";
  }

  //Check the name field isn't blank
  if(!$("#editName").val()){
    isErr = true;
    errorMsg = errorMsg + "The name field should not be left blank.\n\n";
  }

  //2. Check that none of the time fields are blank. This gets triggered
  //when meridien isn't set for something as well.
  var fieldBlank = false;
  $("div.time-group input").each(function(){
    if(!$(this).val()){
      fieldBlank = true;
    }
  });

  //set error message for if fields are blank.
  if(fieldBlank == true){
    isErr = true;
    errorMsg = errorMsg + "No time fields are left blank.\n\n"
  }

  //if none are blank:
  else if(fieldBlank == false){
    //3. Check that the 2nd time in each time-group is a moment of time ahead of the first.
    var momentIsAfter = false; //variable that will be set to true if there is any incidence of ^.
    $("div.time-group").each(function(){
      //get the first time in that div, and convert to moment.
      var firstTime = $(this).find("#start").val();
      firstTime = moment(firstTime,"kk:mm");
      console.log("firstTime: " + firstTime.format());

      //get the second time in that div, and convert to moment.
      var secondTime = $(this).find("#end").val();
      secondTime = moment(secondTime, "kk:mm");
      console.log("secondTime: " + secondTime.format());

      console.log("isAfter: + " + secondTime.isAfter(firstTime,"minute"));
      //if secondTime is after firstTime, set the var to true.
      if(!secondTime.isAfter(firstTime,"minute")){
        momentIsAfter = true;
      }
    });

    //3. set the error message.
    if(momentIsAfter){
      isErr = true;
      errorMsg = errorMsg + "Within a duration, the first time set is before the second one.\n\n"
    }

    //using elif because if the above isn't set properly, it can affect this one too.
    //4. Check that each consecutive time group's starting time is ahead of the previous time-group's
    //end time.
     else if(!momentIsAfter){
      //get the number of time-groups
      var numTimeGroups = $(".time-group").length;
      var endAheadOfStart = false;
      //if there is at least one:
      if(numTimeGroups){
        //loop through the time groups. if i + 1 th startTime is NOT after or same as
        //i th endTime, set flag to true and do error.
        for(var i = 0; i < numTimeGroups-1; i++){
          var thisTimeGroup = $(".time-group:eq(" + i + ")");
          var nextTimeGroup = $(".time-group:eq(" + (i + 1) + ")");

          var thisEndTime = moment(thisTimeGroup.find("#end").val(),"kk:mm");
          var nextStartTime = moment(nextTimeGroup.find("#start").val(),"kk:mm");

          if(!nextStartTime.isSameOrAfter(thisEndTime,"minute")){
            endAheadOfStart = true;
          }
        }
      }

      if(endAheadOfStart){
        isErr = true;
        errorMsg = errorMsg + "The start time of each consecutive duration is ahead of the end time of its previous duration."
      }
    }
  }

  return{
    isErr:isErr,
    errorMsg:errorMsg
  }

}
//returns the selected settings for the space, as well as spaceId. Used for
//saving settings after save button is clicked.
function getSelectedSettings(){
  var selectedDays = [];
  //go through the inputs and push the days selected into an array.
  $("#days input:checked").each(function(){
    selectedDays.push($(this).attr('id'));
  });

  console.log(selectedDays);

  var selectedTimes = []; //24 HOUR TIME.
  //go through the divs with the times, and select the value of the time value in the
  //div. Includes duplicates. GETS THE 24 HOUR TIME VALUES.
  $("div.time-group").each(function(){
    var start = $(this).find("#start").val();
    var end = $(this).find("#end").val();
    console.log(start);
    console.log(end);
    var timeObj = {
      start:start,
      end:end
    }
    console.log(timeObj);
    selectedTimes.push(timeObj);
  });

  console.log(selectedTimes);
  //this returns an array with the 12 hour time values + meridien(am/pm). This is the
  //final version we need to set the Space settings.
  /*
   selectedTimes = selectedTimes.map(function(time){
    return moment(time,"kk:mm").format("h:mma");
  });*/

  //convert the 24 hour times obtained into 24 hour.
  var finalTimes = [];

  for(var i = 0; i < selectedTimes.length; i++){
    var timeObj = {
      start:moment(selectedTimes[i].start,"kk:mm").format("h:mma"),
      end:moment(selectedTimes[i].end,"kk:mm").format("h:mma")
    }

    console.log(timeObj);

    finalTimes.push(timeObj);
  }

  console.log(selectedTimes);
  //Get the id of the space being edited.
  if($("#edit-space-modal").data("spaceId")){
    var spaceId = $("#edit-space-modal").data("spaceId");

  }
  console.log(spaceId);

  console.log("Finaltimes:");
  console.log(finalTimes);

  //get the space name from the text box.
  var spaceName = $("#editName").val();
  console.log(spaceName);

  var spaceUpdate = {
    id:spaceId,
    days:selectedDays,
    times:finalTimes,
    name:spaceName
  };

  return spaceUpdate;
}

$(document).ready(function(){
  populateSpacesTable();
  openModal();
  $("#saveBtn").click(function(){

    var validateSettings = validateSettingsInput();

    if(validateSettings.isErr){
      alert(validateSettings.errorMsg);
    }

    else{
      var selectedSpaceSettings = getSelectedSettings();

      if(selectedSpaceSettings.id){
        selectedSpaceSettings = JSON.stringify(selectedSpaceSettings);
        $.ajax({
          type:'POST',
          url:'/update_space',
          data:{"data":selectedSpaceSettings},
          //contentType:'application/json;charset=utf-8',
          dataType:"json",
          async:false,
          success:function(response){

          }
        });
      }

      else{
        selectedSpaceSettings = JSON.stringify(selectedSpaceSettings);

        $.ajax({
          type:'POST',
          url:'/create_space',
          data:{"data":selectedSpaceSettings},
          //contentType:'application/json;charset=utf-8',
          dataType:"json",
          async:false,
          success:function(response){

          }
        });
      }


      alert('Space setting saved!');
      window.location.reload();


    }
  });

  $("#addDuration").click(function(){
    var modalBody = $("#modal-body");

    var div = $('<div class = "row time-group">');
    $('<input id = "start" type = "time">').appendTo(div);
    $('<span class = "middle"> to </span>').appendTo(div);
    $('<input id = "end" type = "time">').appendTo(div);

    div.appendTo(modalBody);
  });

  $("#deleteDuration").click(function(){
    $("#modal-body div.time-group").last().remove();
  });

  $("#addSpace").click(function(){
    //First make it so it can open the modal
    $(this).attr("data-toggle","modal");
    $(this).attr("data-target","#edit-space-modal");

    //populate the modal with empty time elements, unchecked boxes.
    $(".modal-title").text("Create settings for this space");
    populateAddSpace();


  });

  //confirm prompt.
  $("#deleteSpace").click(function(){
    var confirm = window.confirm("Are you sure you want to delete this space?");
    //if yes, send id to delete route.
    var spaceId = $("#edit-space-modal").data("spaceId");

    if(confirm){
      $.ajax({
        type:'GET',
        url:'/delete_space/' + spaceId,
        async:false,
        success:function(response){

        }
      });

      alert('Space deleted!');
      window.location.reload();
    }

  });
});
