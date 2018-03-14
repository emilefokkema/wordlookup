(function (window, document){
	var getWrWindow = function(){
		var iFrame = null;
		var openedWindow = null;
		var makeIframe = function(){
			var iFrame = document.createElement('iframe');
			iFrame.setAttribute('width','350');
			iFrame.setAttribute('height','350');
			iFrame.setAttribute('style','position:fixed;right:0px;bottom:0px');
			iFrame.src="about:blank";
			document.body.appendChild(iFrame);
			return iFrame;
		};
		var iFrameIsLoadable = function(url, onYes, onNo){
			var req = new XMLHttpRequest();
			req.open("GET", url);
			req.onerror = function(e){
				onNo();
			};
			req.onload = function(){
				onYes();
			};
			req.send();
		};
		
		var open = function(url){
			if(iFrame == null && openedWindow == null){
				iFrameIsLoadable(
					url,
					function(){
						console.log("iframe is loadable");
						iFrame = makeIframe();
						iFrame.src = url;
					},
					function(){
						console.log("iframe is not loadable");
						openedWindow = window.open(url);
					}
					);
				return;
			}
			if(iFrame != null){
				iFrame.src = url;
				return;
			}
			openedWindow = window.open(url);
		};
		
		return {
			open:open
		};
	};

	var insertStyleSheet = function(){
		var style = document.createElement('style');
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		style.sheet.insertRule(".lookupable-word:hover{border-bottom:1pt solid #bbb;'}", 0);
	};
	var wordPattern = "0-9a-zñáéíóúü\\u00e7\\u00e0\\u00e8\\u00f9\\u00ec\\u00f2";
	var allRegex = new RegExp("["+wordPattern+"]+|[^"+wordPattern+"]+","ig");
	var justWordRegex = new RegExp("["+wordPattern+"]+","i");
	var url = {
		es: function(word){return "http://www.wordreference.com/es/en/translation.asp?spen="+word.toLowerCase();},
		it: function(word){return "http://www.wordreference.com/iten/"+word.toLowerCase();},
		fr: function(word){return "http://www.wordreference.com/fren/"+word.toLowerCase();}
	};
	var containsOnlyText = function(node, level){
		return Array.prototype.every.apply(node.childNodes, [function(n){return n.nodeName == "#text" || (level > 0 && containsOnlyText(n, level - 1));}]);
	};
	var it = document.createNodeIterator(
		document.body,
		NodeFilter.SHOW_ELEMENT,
		{
			acceptNode: function(node){
				var name = node.nodeName.toLowerCase();
				if(name != "script" && name != "noscript" && name != "style" && containsOnlyText(node,3) && !containsOnlyText(node.parentNode, 3)){
					return NodeFilter.FILTER_ACCEPT;
				}
				
			}
		});
	var node;
	var replaceNodeText = function(node, url, wrWindow){
		var children = Array.prototype.slice.apply(node.childNodes);
		var newElements = [];
		for(var i=0;i<children.length;i++){
			if(children[i].nodeName == "#text"){
				newElements = newElements.concat(makeSpans(children[i].data, url, wrWindow));
			}else{
				replaceNodeText(children[i], url, wrWindow);
				newElements.push(children[i]);
			}
			node.removeChild(children[i]);
		}
		newElements.map(function(e){
			node.appendChild(e);
		});
	};
	var makeSpans = function(text, url, wrWindow){
		var words = text.match(allRegex);
		var spans = [];
		if(words != null){
			spans = words.map(function(m){
				var span = document.createElement('lookupable');
				span.appendChild(document.createTextNode(m));
				if(m.match(justWordRegex)){
					span.setAttribute('class','lookupable-word');
					span.addEventListener('contextmenu',function(e){
						e.preventDefault();
						wrWindow.open(url(m));
						return false;
					});
				}
				return span;
			});
		}
		return spans;
	};
	var toDo = (function(){
		var all = [];
		var f = function(){
			all.map(function(g){g();});
		};
		f.add = function(g){all.push(g);}
		return f;
	})();
	var makeLookupable = function(lang){
		var wrWindow = getWrWindow();
		insertStyleSheet();
		while(node = it.nextNode()){
			toDo.add((function(n){
				return function(){
					replaceNodeText(n, url[lang], wrWindow);
				};
			})(node));
		}
		toDo();
	};
	window.makeLookupable = (!window.makeLookupable && makeLookupable) || function(){};

})(window, document);