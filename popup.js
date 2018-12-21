(function(){
	var doIt = function(lang){
		chrome.tabs.executeScript(null, {
			file:'content_script.js'
		},function(){
			chrome.tabs.executeScript(null, {
				code:'window.makeLookupable("'+lang+'")'
			});
		});
		
	};
	document.getElementById("es").addEventListener("click",function(){doIt("es");});
	document.getElementById("it").addEventListener("click",function(){doIt("it");});
	document.getElementById("fr").addEventListener("click",function(){doIt("fr");});
	document.getElementById("de").addEventListener("click",function(){doIt("de");});
})();