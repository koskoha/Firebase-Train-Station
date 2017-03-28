 // Initialize Firebase
	  var config = {
	     apiKey: "AIzaSyCZfgOkn4kSmfntCHqGRloEV1sHhrdsxEo",
    authDomain: "train-manegement-system.firebaseapp.com",
    databaseURL: "https://train-manegement-system.firebaseio.com",
    storageBucket: "train-manegement-system.appspot.com",
    messagingSenderId: "468919680376"
	  };
	  firebase.initializeApp(config);

$('#login').click(signInWithEmailAndPassword);
$('#register').on("click", createAccaunt);

function createAccaunt(event){
	event.preventDefault();
	var displayName = $('#userName').val();
	var email = $('#emailR').val();
	var password = $('#pwdR').val();
	$("#displayUser").html("Hello, "+displayName)

	firebase.auth().createUserWithEmailAndPassword(email,password)
		.then(function(user){
			user.updateProfile({displayName:displayName});
		})
		.catch(function(error){
			console.log('register error', error);
		})
}

function signInWithEmailAndPassword(event){
	event.preventDefault();
	var email = $('#email').val();
	var password = $('#pwd').val();

	firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error) {
  		console.log('sign in error', error);
	});

}

firebase.auth().onAuthStateChanged(authStateChangeListener);

function authStateChangeListener(user){
	//signin
	if (user) {
		//login
		showDataTable();
		$("#loginLink").addClass('hide');
		$("#logOutLink").removeClass('hide');
		$("#displayUser").html("Hello, "+user.displayName)
		$("#table").removeClass('hide');
		$("#addForm").removeClass('hide');
		$("#tableToAdd").empty();

	}else{
		//not login
		$("#loginLink").removeClass('hide');
		$("#logOutLink").addClass('hide');
		$("#table").addClass('hide');
		$("#addForm").addClass('hide');
		$("#displayUser").empty();
	}
}

$("#logOutLink").on("click", function(){
	firebase.auth().signOut()
		.catch(function (err) {
		   console.log("log Out error", err);
		});
})