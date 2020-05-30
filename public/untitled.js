//Get Likes

//Call the API
function callApi(endpoint, callback) {
	//make request
		//success


		.success(function(stuff) {
			callback(stuff);
		})

		//fail
}

function loadImagesFromLikes( likesData ) {
	var images = [];

	for (var i = 0; i < likesData.data.length; ++i) {
	    images[i] = document.createElement("IMG");
	    images[i].src = response.data.images[i].low_resolution.url;
	}

	addImagesToPage(images);
}


function addImagesToPage(imgArray) {
	for(var i = 0; i<imgArray.length; i++) {
	    document.getElementById("img").appendChild(imgArray[i]);
	}
}


var myEndpoint = 'http://somepath.com';


callApi(myEndpoint, loadImagesFromLikes);




	//if success
		//Load images from likes


	//if failure
		//log error