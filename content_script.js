(function (window, document){
	// "«»".split('').map(function(p){
	// var n = p.charCodeAt(0); 
	// return new Number(n).toString(16);})
	var wrWindow = (function(){

		var open;
		if(window.location.protocol.indexOf("https") == -1){
			var iFrame = document.createElement('iframe');
			iFrame.setAttribute('width','350');
			iFrame.setAttribute('height','350');
			iFrame.setAttribute('style','position:fixed;right:0px;bottom:0px');
			iFrame.src="about:blank";
			document.body.appendChild(iFrame);
			open = function(url){
				iFrame.src = url;
			};
		}else{
			open = function(url){
				window.open(url);
			};
		}

		return {
			open:open
		};
	})();
	(function(){
		var style = document.createElement('style');
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		style.sheet.insertRule(".lookupable:hover{border-bottom:1pt solid #bbb;'}");
	})();
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
	var replaceNodeText = function(node, url){
		var children = Array.prototype.slice.apply(node.childNodes);
		var newElements = [];
		for(var i=0;i<children.length;i++){
			if(children[i].nodeName == "#text"){
				newElements = newElements.concat(makeSpans(children[i].data, url));
			}else{
				replaceNodeText(children[i], url);
				newElements.push(children[i]);
			}
			node.removeChild(children[i]);
		}
		newElements.map(function(e){
			node.appendChild(e);
		});
	};
	var makeSpans = function(text, url){
		var words = text.match(allRegex);
		var spans = [];
		if(words != null){
			spans = words.map(function(m){
				var span = document.createElement('span');
				span.appendChild(document.createTextNode(m));
				if(m.match(justWordRegex)){
					span.setAttribute('class','lookupable');
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
	window.makeSpans = function(lang){
		while(node = it.nextNode()){
			toDo.add((function(n){
				return function(){
					replaceNodeText(n, url[lang]);
				};
			})(node));
		}
		toDo();
	};

})(window, document);