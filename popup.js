(function(){
	var buttons, hasExistingStatus = false;
	var getCurrentTab = function(callback){
		chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
			var currTab = tabs[0];
			callback(currTab);
		});
	};
	var setDone = function(lang){
		document.body.setAttribute("class","");
		for(var i=0;i<buttons.length;i++){
			var button = buttons[i];
			if(button.lang == lang){
				button.setActive();
			}else{
				button.setInactive();
			}
		}
	};
	var doIt = function(lang){
		if(hasExistingStatus){
			return;
		}
		getCurrentTab(function(currTab){
			chrome.tabs.executeScript(currTab.id, {
				file:'content_script.js'
			},function(){
				chrome.tabs.executeScript(currTab.id, {
					code:'window.makeLookupable("'+lang+'")'
				});
			});
		});
		
	};
	var makeButton = function(lang){
		var el = document.getElementById(lang);
		el.addEventListener("click", function(){doIt(lang);});
		return {
			lang:lang,
			setActive:function(){el.setAttribute("class","active")},
			setInactive:function(){el.setAttribute("class","inactive")}
		};
	};
	var languages = ["es","it", "fr", "de"];
	buttons = languages.map(makeButton);
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.status == "done"){
			setDone(request.lang);
		}
	});
	getCurrentTab(function(currTab){
		chrome.tabs.sendMessage(currTab.id, {popupOpened:true}, function(response){
			if(response){
				hasExistingStatus = true;
				setDone(response.lang);
			}
		});
	});
})();