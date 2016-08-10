(function (window, document){
	(function(it){
		var node;
		var replaceNodeText = function(node){
			var words = node.innerText.match(/[0-9a-zñáéíóúü]+|[\s,:;?!]+/ig);
			if(words != null){
				var spans = words.map(function(m){
					var span = document.createElement('span');
					span.appendChild(document.createTextNode(m));
					span.addEventListener('contextmenu',function(e){
						e.preventDefault();
						window.open('http://www.wordreference.com/es/en/translation.asp?spen='+m.toLowerCase());
						return false;
					})
					return span;
				});
				node.innerHTML = '';
				spans.map(function(s){node.appendChild(s);});
			}
			
		};
		var toDo = (function(){
			var all = [];
			var f = function(){
				all.map(function(g){g();});
			};
			f.add = function(g){all.push(g);}
			return f;
		})();
		while(node = it.nextNode()){
			toDo.add((function(n){
				return function(){
					replaceNodeText(n);
				};
			})(node));
		}
		toDo();
	})(document.createNodeIterator(
		document.body,
		NodeFilter.SHOW_ELEMENT,
		{
			acceptNode: function(node){
				var name = node.tagName.toLowerCase();
				if(name != "script" && name != "noscript" && name != "style" && node.childElementCount == 0){
					return NodeFilter.FILTER_ACCEPT;
				}
				
			}
		}));
})(window, document);