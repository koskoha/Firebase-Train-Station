// Initialize Firebase
 var config = {
    apiKey: "AIzaSyCZfgOkn4kSmfntCHqGRloEV1sHhrdsxEo",
    authDomain: "train-manegement-system.firebaseapp.com",
    databaseURL: "https://train-manegement-system.firebaseio.com",
    storageBucket: "train-manegement-system.appspot.com",
    messagingSenderId: "468919680376"
  };
firebase.initializeApp(config);

var database = firebase.database();

$("button").on("click", function(event) {
	event.preventDefault();
	var $train = $('#train-name');
	var trainName = train.val();
	if(trainName === ""){
		$train.css('border-color', "red");
		return;
	}
	var destination =  $('#destination').val();
	var firstTrain = $('#first-train').val();
	var frequency=  $('#frequency').val();

	database.ref().push({
        trainName:trainName,
        destination:destination,
        firstTrain:firstTrain,
        frequency:frequency,
        dataAdded:firebase.database.ServerValue.TIMESTAMP
    });

	$train.css('border-color', "");
    $train.val("");
	 $('#destination').val("");
	 $('#first-train').val("");
	 $('#frequency').val("");
});

database.ref().on('child_changed',function(snapshot){
	var rowUpdated =$('#'+snapshot.key);
	rowUpdated.children().eq(0).text(snapshot.val().trainName);
	rowUpdated.children().eq(1).text(snapshot.val().destination);
})

database.ref().on('child_removed',function(snapshot){
	$('#'+snapshot.key).remove();
	
})

database.ref().orderByChild('dataAdded').on("child_added",function(snapshot){
	var frequency = snapshot.val().frequency;
	var nextTrain = moment(snapshot.val().firstTrain, "hh:mm");
	var currTime = moment();
	var away = nextTrain.diff(currTime, "minutes") - frequency;

	var table = $("#tableToAdd");
	var row = $('<tr id="'+snapshot.key+'"></tr>');
	row.append('<td>'+snapshot.val().trainName+"</td>");
	row.append('<td>'+snapshot.val().destination+"</td>");
	row.append('<td>'+frequency+"</td>");
	row.append('<td>'+snapshot.val().firstTrain+"</td>");
	row.append('<td>'+away+"</td>");
	var actionsButt = $('<td></td>');
	actionsButt.append('<button class ="btn btn-danger btn-sm delete"><span class="glyphicon glyphicon-remove"></button>');
	actionsButt.append('<button class ="btn btn-primary btn-sm edit"><span class="glyphicon glyphicon-pencil"></button>');
	actionsButt.append('<button class ="btn btn-success btn-sm confirm hide" ><span class="glyphicon glyphicon-ok"></button>');
	row.append(actionsButt);
	table.append(row);

	var rowEdit;
	var nameChild;
	var destinationChild;
	var arrivalChild;

	$('.edit').on('click',function(event){
		event.stopPropagation();
	    event.stopImmediatePropagation();

		rowEdit = $(this).closest("tr");
		nameChild= rowEdit.children().eq(0);
		nameChild.html('<input type="text" value = '+nameChild.text()+'>')
		destinationChild = rowEdit.children().eq(1);
		destinationChild.html('<input type="text" value = '+destinationChild.text()+'>')
		arrivalChild = rowEdit.children().eq(3);
		arrivalChild.html('<input type="time" value = '+arrivalChild.text()+'>')

		rowEdit.find(".delete").addClass('hide');
		rowEdit.find(".edit").addClass('hide');
		rowEdit.find(".confirm").removeClass('hide');
	})

	$('.delete').on('click',function(event){
		event.stopPropagation();
	    event.stopImmediatePropagation();
	    database.ref().child(snapshot.key).remove();
		// $('#'+snapshot.key).remove();
	})

	$('.confirm').click(function(){
		$(".confirm").addClass('hide');
		rowEdit.find(".delete").removeClass('hide');
		rowEdit.find(".edit").removeClass('hide');

		nameChild.text(nameChild.find('input').val());
		destinationChild.text(destinationChild.find('input').val());
		arrivalChild.text(arrivalChild.find('input').val());

		var trainRef = database.ref().child(snapshot.key);
		trainRef.once("value", function(snap){
			trainRef.update({
				trainName:rowEdit.children().eq(0).text(),
				destination:rowEdit.children().eq(1).text(),
			})
		})
	})
});


