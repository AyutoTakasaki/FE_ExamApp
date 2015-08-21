var JDB = (function(document){
	var that = {};
	
	var Ajax = function(){
		var that;
		
		var getXMLHTTP = function(){
			var http;
			try{
				http = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e){
				if (XMLHttpRequest) http = new XMLHttpRequest();
			}
			return http;
		}
		
		var communicate = function(method, url, func, data, rand){
			data = data || null;
			
			var xmlhttp = getXMLHTTP();

			if (rand){
				if (url.match(/\?(.*?)$/)){
					if (url.match(/&$/)){
						url += Math.random();
					} else {
						url += "&rand=" + Math.random();
					}
				} else {
					url += "?rand=" + Math.random();
				}
			}

			try{
				xmlhttp.open(method, url, true);
				xmlhttp.onreadystatechange = function(){
					if (xmlhttp.readyState == 4){
						//200はリクエスト成功、0はオフラインファイル・キャッシュファイルへのアクセス成功
						if (xmlhttp.status == 200 || xmlhttp.status == 0){
							func(xmlhttp.responseText);
						}
					}
				}
				xmlhttp.send(data);
			} catch(e) {
				return false;
			}
		}
		
		that = communicate;
		return that;
	}
	Ajax = Ajax();
	that.Ajax = Ajax;
	
	var Cookie = function(){
		var that = {};
		
		var getItem = function(_key){
			var plain,i,plainSpl,eachSpl;
			plain = document.cookie;
			plainSpl = plain.split(";");
			for(i=0;i<plainSpl.length;i++){
				plainSpl[i] = plainSpl[i].replace(/^ /,"");
				eachSpl = plainSpl[i].split("=");
				if (encodeURIComponent(eachSpl[0]) == _key){
					return encodeURIComponent(eachSpl[1]);
				}
			}
		}
		that.getItem = getItem;
		
		var removeItem = function(_key){
			var newCookieStr;
			newCookieStr = encodeURIComponent(_key) + "=" + "remove" + "; expires=" + new Date((new Date().getFullYear()) - 10,0).toUTCString() ;
			document.cookie = newCookieStr;
		}
		that.removeItem = removeItem;
		
		var setItem = function(_key,_value){
			var newCookieStr;
			newCookieStr = encodeURIComponent(_key) + "=" + encodeURIComponent(_value) + "; expires=" + new Date((new Date().getFullYear()) + 10,0).toUTCString() ;
			document.cookie = newCookieStr;
		}
		that.setItem = setItem;
		
		return that;
	};Cookie = Cookie();
	that.Cookie = Cookie;
	
	var Store = function(){
		var that = {};
		
		var obj = {};
		if (window.localStorage){
			var id = "____keyset_test____" + Math.round(Math.random() * 100000);
			var value = Math.round(Math.random() * 100000);
			window.localStorage.setItem(id, value);
			if (window.localStorage.getItem(id) == value){
				obj = window.localStorage;
			} else {
				obj = Cookie;
			}
		} else {
			obj = Cookie;
		}
		
		var getItem = function(_key){
			return obj.getItem(_key);
		}
		that.getItem = getItem;
		
		var removeItem = function(_key){
			return obj.removeItem(_key);
		}
		that.removeItem = removeItem;
		
		var setItem = function(_key,_value){
			return obj.setItem(_key, _value);
		}
		that.setItem = setItem;
		
		return that;
	};Store = Store();
	that.Store = Store;
	
	return that;
})(document);

