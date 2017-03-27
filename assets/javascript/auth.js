
$('#login').click(signInWithEmailAndPassword);
$('#register').on("click", createAccaunt);

function createAccaunt(){
	console.log("creating user");
	var userName = $('#userName').val();
	var email = $('#email').val();
	var password = $('#password').val();

	firebase.auth().createUserWithEmailAndPAssword(email,password)
		.catch(function(error){
			console.log('register error', error);
		})
		.then(function(user){
			user.updateProfile({userName:userName});
		});
}

function signInWithEmailAndPassword(){
	var email = $('#email').val();
	var password = $('#password').val();

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
	}else{
		//not login
	}
}