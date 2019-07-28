(function (global) {
	// Set up a namespace for out utility
	var ajaxUtils = {};

	// Return a HTTP request object
	function getRequestObject() {
		if (window.XMLHttpRequest) {
			return (new XMLHttpRequest());
		}
		else if (window.ActiveXObject) {
			// For very old IE browsers
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		}
		else {
			global.alert ("Ajax is not supported!");
			return (null);
		}
	}

	// Make an Ajax GET request to 'requestUrl'
	ajaxUtils.sendGetRequest = 
	function (requestUrl, responseHandler, isJsonResponse) {
		var request = getRequestObject();
		
		request.onreadystatechange = function () {
			handleResponse(request, responseHandler, isJsonResponse);
		}

		request.open("GET", requestUrl, true);
		request.send(null);	// for POST only
	};

	//	Only calls user provided 'responseHandler'
	//	function if response is ready
	//	and not an error
	function handleResponse(request, responseHandler, isJsonResponse) {
		if ((request.readyState == 4) && (request.status == 200)) {

			// Default to isJsonResponse = true
			if (isJsonResponse == undefined) {
				isJsonResponse = true;
			}

			if (isJsonResponse) {
				console.log(request.responseText);
				responseHandler(JSON.parse(request.responseText));
			}
			else {
				responseHandler(request.responseText);	
			}
			
		}
	}

	global.$ajaxUtils = ajaxUtils;
	
})(window);