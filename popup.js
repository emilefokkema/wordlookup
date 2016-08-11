(function(){
	var doIt = function(lang){
		console.log("hoi");
		chrome.tabs.executeScript(null, {
			file:'content_script.js'
		});
		chrome.tabs.executeScript(null, {
			file:lang+'.js'
		});
	};
	document.getElementById("es").addEventListener("click",function(){doIt("es");});
	document.getElementById("it").addEventListener("click",function(){doIt("it");});
})();