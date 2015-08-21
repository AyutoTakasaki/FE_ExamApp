var JTL = (function(){
	var that = {};
	var layouts = {};
	var onloadFunc = function(){};
	var JTLLoaded = false;
	var isAndroid2x = false;
	var isiPhone = false;
	var is3DS = false;

	var Resources = {};
	Resources.TabButtons = {
		"MENU": {
			"iconurl": "_jtl_res/icon/tabbar/menu.png",
			"title_jp": "メニュー"
		},
		"HISTORY": {
			"iconurl": "_jtl_res/icon/tabbar/history.png",
			"title_jp": "履歴"
		},
		"FAVORITE": {
			"iconurl": "_jtl_res/icon/tabbar/fav.png",
			"title_jp": "お気に入り"
		},
		"HISTORY": {
			"iconurl": "_jtl_res/icon/tabbar/history.png",
			"title_jp": "履歴"
		},
		"HELP": {
			"iconurl": "_jtl_res/icon/tabbar/help.png",
			"title_jp": "ヘルプ"
		},
		"SETTINGS": {
			"iconurl": "_jtl_res/icon/tabbar/settings.png",
			"title_jp": "設定"
		},
		"INFO": {
			"iconurl": "_jtl_res/icon/tabbar/info.png",
			"title_jp": "情報"
		},
		"RECORD": {
			"iconurl": "_jtl_res/icon/tabbar/record.png",
			"title_jp": "成績"
		}
	};
	that.Resources = Resources;
	
	var getElementsByClassName = function(className, _els){
		var els = (_els && _els.getElementsByTagName && _els.getElementsByTagName("*")) || _els;
		var reg = new RegExp("^(.*?)\s*" + className + "(.*?)\s*$");
		var res = [];
		for(i=0; i<els.length; i++){
			if (els[i].className.match(reg)){
				res.push(els[i]);
			}
		}
		return res;
	}
	
	var addEListener = function(obj, name, func){
		if (obj.addEventListener){
			obj.addEventListener(name, func, false);
		} else {
			obj.attachEvent("on" + name, func);
		}
	}
	
	var removeEListener = function(obj, name, func){
		if (obj.removeEventListener){
			obj.removeEventListener(name, func, false);
		} else {
			obj.detachEvent("on" + name, func);
		}
	}
	
	var setOnScrollEvent = function(element, func, interval){
		var timerInterval = interval || 250;
		var old = element.scrollTop;
		var timer = setInterval(function(){
			if (old != element.scrollTop){
				func(old - element.scrollTop);
			}
			old = element.scrollTop;
		}, timerInterval);
		return timer;
	}
	
	var convertNL = function(s){
		return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n/g, "<br >");
	}
	
	var Fade = function(){
		var that = {};
		
		var a = 0;
		var FPS = 20;
		var duration = 1;
		var tarElem = {};
		var count = 0;
		var totalCount = 0;
		var compFunc = {"in":function(){},"out":function(){}};
		var workingMode = "";
		var transMax = 1;
		var _t = null;
		
		var setFPS = function(_fps){
			FPS = (typeof _fps === "number") ? _fps : FPS;
		}
		that.setFPS = setFPS;
		
		var setTrasMax = function(max){
			transMax = max;
		}
		that.setTrasMax = setTrasMax;
		
		var isFading = function(){
			return (workingMode == "") ? false : true;
		}
		that.isFading = isFading;
		
		var setDuration = function(_dr){
			duration = typeof _dr == "number" ? _dr : duration;
		}
		that.setDuration = setDuration;
		
		var setElement = function(_el){
			tarElem = _el;
		}
		that.setElement = setElement;
		
		var startFade = function(type, func){
			if (!tarElem || !tarElem.style || workingMode !== ""){
				return false;
			}
			count = 0;
			workingMode = type;
			totalCount = FPS * duration;
			a = 100 / Math.pow(totalCount,2);
			if (func) setCompFunc(type, func);
			_t = setInterval(_fade, 1000/FPS);
		}
		
		var startFadeIn = function(func){
			tarElem.style.display = "block";
			tarElem.style.opacity = "0";
			startFade("in", func);
		}
		that.startFadeIn = startFadeIn;
		
		var startFadeOut = function(func){
			tarElem.style.display = "none";
			tarElem.style.opacity = transMax + "";
			startFade("out", func);
		}
		that.startFadeOut = startFadeOut;
		
		var setCompFunc = function(_type,_func){
			compFunc[_type] = _func;
		}
		that.setCompFunc = setCompFunc;
		
		var _fade = function(){
			if (count < totalCount){
				if (workingMode == "in"){
					if (typeof tarElem.style.opacity == "string"){
						tarElem.style.opacity = (transMax / 1) * a * Math.pow(count,2) + "";
					}
				} else if (workingMode == "out"){
					if (typeof tarElem.style.opacity == "string"){
						tarElem.style.opacity = (transMax / 1) * (1 - (a * Math.pow(count,2))) + "";
					}
				}
			} else {
				compFunc[workingMode](tarElem);
				workingMode = "";
				clearInterval(_t);
			}
			count++;
		}
		
		return that;
	}
	that.Fade = Fade;
	
	var Slider = function(){
		var that = {};
		var interval = 30;
		var elem = null;
		var _c = 0;
		var _slideTimer = null;
		var startPos = {"x": 0,"y": 0};
		var _length = 0;
		var mode = 0;
		var isSliding = false;
		
		that.slideFunction = function(t){
			var r = {x: 0, y: 0};
			return r;
		}
		
		that.afterSliding = function(){}
		
		var setSlideFunction = function(from, to, length){
			startPos = from || {"x": 0, "y": 0};
			var a1;
			var a2;
			if (to.x == null){
				a1 = 1;
				a2 = (to.y - from.y) / Math.pow(length, 2);
				mode = 1;
			} else if (to.y == null){
				a1 = (to.x - from.x) / Math.pow(length, 2);
				a2 = 1;
				mode = 2;
			} else {
				a1 = (to.x - from.x) / Math.pow(length, 2);
				a2 = (to.y - from.y) / Math.pow(length, 2);
				mode = 0;
			}
			
			that.slideFunction = function(c){
				var r = {
					x: a1*c*c,
					y: a2*c*c
				}
				r.x = Math.floor(r.x);
				r.y = Math.floor(r.y);
				return r;
			}
			_length = length;
			return that;
		}
		that.setSlideFunction = setSlideFunction;
		
		var setTimerInterval = function(i){
			interval = i;
			return that;
		}
		that.setTimerInterval = setTimerInterval;
		
		var setElement = function(e){
			elem = e;
			return that;
		}
		that.setElement = setElement;
		
		
		var setPosition = function(element, position){
			var xChange = function(){};
			var yChange = function(){};
			if (typeof element.style.transform != "undefined"){
				xChange = function(x){
					element.style.transform = "translateX(" + x + "px)";
				}
				yChange = function(y){
					element.style.transform = "translateY(" + y + "px)";
				}
			} else if (typeof element.style.webkitTransform != "undefined"){
				xChange = function(x){
					element.style.webkitTransform = "translateX(" + x + "px)";
				}
				yChange = function(y){
					element.style.webkitTransform = "translateY(" + y + "px)";
				}
			} else {
				xChange = function(x){
					element.style.left = x + "px";
				}
				yChange = function(y){
					element.style.top = y + "px";
				}
			}
			switch(mode){
				case 0:
					xChange(position.x);
					yChange(position.y);
					break;
				case 1:
					yChange(position.y);
					break;
				case 2:
					xChange(position.x);
					break;
			}
		}
		
		var startSlide = function(pos){
			if (isSliding) return;
			var func = function(){
				var r = that.slideFunction(_c);
				setPosition(elem, {"x": startPos.x + r.x, "y": startPos.y + r.y});
				_c++;
				if (_c > _length){
					that.afterSliding();
					clearInterval(_slideTimer);
					isSliding = false;
				}
			}
			_c = 0;
			_slideTimer = setInterval(func, interval);
			func();
			isSliding = true;
		}
		that.startSlide = startSlide;
		
		return that;
	}
	that.Slider = Slider;
	
	
	var Zoomer = function(){
		var that = {};
		var interval = 40;
		var length = 0.3;
		
		var elem = null;
		var _c = 0;
		
		var _zoomTimer = null;
		var isZooming = false;
		
		var minScale = 0.65;
		
		that.afterZooming = function(){};
		
		var setTimerInterval = function(i){
			interval = i;
			return that;
		}
		that.setTimerInterval = setTimerInterval;
		
		var setLength = function(l){
			length = l;
			return that;
		}
		that.setLength = setLength;
		
		var setElement = function(e){
			elem = e;
			return that;
		}
		that.setElement = setElement;
		
		var setMinScale = function(s){
			minScale = s;
			return that;
		}
		that.setMinScale = setMinScale;
		
		var startZoomIn = function(pos){
			if (isZooming) return;
			var zoomFunc = function(c){
				var a = (1 - minScale) / Math.pow(length * interval, 2);
				return a * c * c;
			}
			var func = function(){
				var r = zoomFunc(_c);
				if (typeof elem.style.transform != "undefined"){
					elem.style.transform = "scale(" + (minScale +  r) + ")";
				} else if (typeof elem.style.webkitTransform != "undefined"){
					elem.style.webkitTransform = "scale(" + (minScale +  r) + ")";
				}
				_c++;
				if (_c > length * interval){
					clearInterval(_zoomTimer);
					isZooming = false;
					that.afterZooming();
				}
			}
			_c = 0;
			_zoomTimer = setInterval(func, 1000 / interval);
			func();
			isZooming = true;
		}
		that.startZoomIn = startZoomIn;
		
		var startZoomOut = function(pos){
			if (isZooming) return;
			var zoomFunc = function(c){
				var a = (1 - minScale) / Math.pow(length * interval, 2);
				return a * c * c;
			}
			var func = function(){
				var r = zoomFunc(_c);
				if (typeof elem.style.transform != "undefined"){
					elem.style.transform = "scale(" + (1 - r) + ")";
				} else if (typeof elem.style.webkitTransform != "undefined"){
					elem.style.webkitTransform = "scale(" + (1 - r) + ")";
				}
				_c++;
				if (_c > length * interval){
					clearInterval(_zoomTimer);
					isZooming = false;
					that.afterZooming();
				}
			}
			_c = 0;
			_zoomTimer = setInterval(func, 1000 / interval);
			func();
			isZooming = true;
		}
		that.startZoomOut = startZoomOut;
		
		return that;
	}
	that.Zoomer = Zoomer;

	
	var Fader = function(){
		var that = {};
		var elem;
		var fps, dur;
		var transMax = 1;
		var t = null;
		var o;
		var add = 0;
		
		var setElement = function(el){
			elem = el;
			return that;
		}
		that.setElement = setElement;
		
		var setTimerInterval = function(i){
			fps = i;
			return that;
		}
		that.setTimerInterval = setTimerInterval;
		
		var setLength = function(d){
			dur = d;
			return that;
		}
		that.setLength = setLength;
		
		that.afterFading = function(){}
	
		var setTransMax = function(max){
			transMax = max;
			return that;
		}
		that.setTransMax = setTransMax;
		
		that.fadeFunction = function(x){
			return 0;
		}
		
		var startFadeIn = function(){
			elem.style.opacity = 0;
			elem.style.display = "block";
			o = 0;
			try{clearInterval(t)}catch(e){};
			that.fadeFunction = function(x){
				a = transMax / Math.pow(fps * dur, 2);
				return a * x * x;
			}
			t = setInterval(function(){
				if (o > fps * dur){
					clearInterval(t);
					elem.style.opacity = transMax + "";
					that.afterFading();
					return;
				}
				elem.style.opacity = that.fadeFunction(o) + "";
				o++;
			}, 1000 / fps);
		}
		that.startFadeIn = startFadeIn;
		
		var startFadeOut = function(){
			elem.style.opacity = transMax;
			o = 0;
			try{clearInterval(t)}catch(e){};
			that.fadeFunction = function(x){
				a = transMax / Math.pow(fps * dur, 2);
				return a * x * x;
			}
			t = setInterval(function(){
				if (o > fps * dur){
					clearInterval(t);
					elem.style.opacity = 0;
					that.afterFading();
					return;
				}
				elem.style.opacity = (transMax - that.fadeFunction(o)) + "";
				o++;
			}, 1000 / fps);
		}
		that.startFadeOut = startFadeOut;
		
		return that;
	}
	that.Fader = Fader;
	
	
	var View = (function(){
		var doc;
		var moveValue = 7;
		var f = function(context, element){
			if (!element.JTLView){
				element.JTLView = this;
			}
			this.element = element;
			this.touchX = 0;
			this.touchY = 0;
			this.isTouched = 0;
			this.isMousedown = 0;
			this.doc = context;
			doc = this.doc;
			this.f = function(){}
			this.getFireStatus = function(){
				return doc.fire;
			}
			this.setFireStatus = function(s){
				doc.fire = s;
			}
		}
		f.prototype.setElement = function(el){
			this.element = el;
		}
		f.prototype.setData = function(d){
			var el = this.element;
			if ((el.tagName + "").match(/img|script/i)){
				el.src = d;
			} else if ((el.tagName + "").match(/input|textarea/i)){
				el.value = d;
			} else {
				if ((d + "").match(/<|>/)){
					el.innerHTML = d;
				} else {
					var txNode = doc.createTextNode(d);
					while(el.firstChild){
						el.removeChild(el.firstChild);
					}
					el.appendChild(txNode);
				}
			}
		}
		f.prototype.forceUp = function(){
			this.isTouched = false;
			this.isMousedown = false;
			this.fire = false;
			this.f();
		}
		f.prototype.setOnClickListener = function(func){
			var el = this.element;
			var doc = this.doc;
			var getFireStatus = this.getFireStatus;
			var setFireStatus = this.setFireStatus;
			addEListener(el, "touchstart", function(e){
				this.isTouched = true;
				var touchEvent = (e.touches && e.touches[0]) || e;
				var x, y;
				if (typeof touchEvent.pageX === "undefined"){
					x = event.x + doc.body.scrollLeft;
					y = event.y + doc.body.scrollTop;;
				} else {
					x = touchEvent.pageX;
					y = touchEvent.pageY;
				}
				setFireStatus(true);
				this.touchX = x;
				this.touchY = y;
				return false;
			});
			addEListener(el, "touchmove", function(e){
				if (!this.isTouched) return;
				var touchEvent = (e.touches && e.touches[0]) || e;
				var x, y;
				if (typeof touchEvent.pageX === "undefined"){
					x = event.x + doc.body.scrollLeft;
					y = event.y + doc.body.scrollTop;;
				} else {
					x = touchEvent.pageX;
					y = touchEvent.pageY;
				}
				if ((Math.abs(this.touchX - x) > moveValue) || (Math.abs(this.touchY - y) > moveValue)){
					this.isTouched = false;
					e.preventDefault();
				}
				return false;
			});
			var ff = function(e){
				e.preventDefault();
				if (!this.isTouched) return;
				setTimeout(func, 50);
				this.isTouched = false;
				try{
					clearTimeout(doc.timer);
				} catch(e){};
				doc.timer = setTimeout(function(){
					setFireStatus(false);
				}, 750);
				setFireStatus(true);
				e.preventDefault();
				return false;
			};
			addEListener(el, "touchend", ff);
			addEListener(el, "click", function(e){
				if (getFireStatus() == true){
					e.preventDefault();
					return false;
				}
				func();
				return false;
			});
			
		}
		f.prototype.setOnTouchListener = function(downfunc, upfunc, clickfunc){
			var el = this.element;
			var docX = 0;
			var docY = 0;
			var doc = this.doc;
			var getFireStatus = this.getFireStatus;
			var setFireStatus = this.setFireStatus;
			addEListener(el, "touchstart", function(e){
				if (this.isMousedown) {
					this.isMousedown = false;
				}
				this.isTouched = true;
				var touchEvent = (e.touches && e.touches[0]) || e;
				var x, y;
				if (typeof touchEvent.pageX === "undefined"){
					x = event.x + doc.body.scrollLeft;
					y = event.y + doc.body.scrollTop;;
				} else {
					x = touchEvent.pageX;
					y = touchEvent.pageY;
				}
				this.touchX = x;
				this.touchY = y;
				setFireStatus(true);
				downfunc();
				return false;
			});
			addEListener(el, "mousedown", function(e){
				if (this.isTouched || getFireStatus() == true){
					this.isMousedown = false;
					e.preventDefault();
					return false;
				}
				if (typeof event == "undefined"){
					if (e.button != 0){
						return;
					}
				} else {
					if (event.button != 1 && event.button != 0){
						return;
					}
				}
				this.isMousedown = true;
				var x, y;
				if (typeof e.pageX === "undefined"){
					x = event.x + doc.body.scrollLeft;
					y = event.y + doc.body.scrollTop;;
				} else {
					x = e.pageX;
					y = e.pageY;
				}
				this.touchX = x;
				this.touchY = y;
				downfunc();
				return false;
			});
			addEListener(el, "touchmove", function(e){
				if (!this.isTouched) {
					return false;
				}
				var touchEvent = (e.touches && e.touches[0]) || e;
				var x, y;
				if (typeof touchEvent.pageX === "undefined"){
					x = event.x + doc.body.scrollLeft;
					y = event.y + doc.body.scrollTop;;
				} else {
					x = touchEvent.pageX;
					y = touchEvent.pageY;
				}
				if ((Math.abs(this.touchX - x) > moveValue) || (Math.abs(this.touchY - y) > moveValue)){
					this.isTouched = false;
					upfunc();
					e,preventDefault();
				}
				return false;
			});
			addEListener(el, "mousemove", function(e){
				if (!this.isMousedown) {
					e.preventDefault();
					return false;
				}
				var x, y;
				if (typeof e.pageX === "undefined"){
					x = event.x + doc.body.scrollLeft;
					y = event.y + doc.body.scrollTop;;
				} else {
					x = e.pageX;
					y = e.pageY;
				}
				if ((Math.abs(this.touchX - x) > moveValue) && (Math.abs(this.touchY - y) > moveValue)){
					this.isTouched = false;
					this.isMousedown = false;
					upfunc();
				}
				return false;
			});

			var ff = function(e){
				if (!this.isTouched) return;
				e.preventDefault();
				upfunc();
				setFireStatus(true);
				try{
					clearTimeout(doc.timer);
				} catch(e){};
				doc.timer = setTimeout(function(){
					setFireStatus(false);
				}, 750);
				this.isTouched = false;
				setTimeout(clickfunc, 30);
				return false;
			}
			addEListener(el, "touchend", ff);
			addEListener(el, "mouseup", function(e){
				if (!this.isMousedown || getFireStatus()) return;
				e && e.preventDefault && e.preventDefault();
				upfunc();
				clickfunc();
				this.isTouched = false;
				return false;
			});
			
		}
		return f;
	})();
	that.View = View;
	
	var Toast = function(doc, parentView, tm){
		var _ToastManager = tm;
		
		var that = function(context){
			this.parentView = parentView;
			this.mTN = TN();
		};
		
		var LENGTH_SHORT = 0;
		var LENGTH_LONG = 1;
		
		var makeToastElem = function(doc){
			var el = doc.createElement("div");
			var elTV = doc.createElement("span");
			elTV.id = "text_body";
			el.appendChild(elTV);
			el.className = "__jlt__default_toast";
			return el;
		}
		var defToastView = makeToastElem(doc);
		
		that.LENGTH_SHORT = LENGTH_SHORT;
		that.LENGTH_LONG = LENGTH_LONG;
		
		var toastEl = null;
		var makeText = function(context, text, duration){
			var result = new that();
			
			var copier = ViewCopier();
			var v = copier.copy(defToastView, doc);
			
			var textEl = v.findViewById("text_body");
			textEl.innerHTML = convertNL(text);
			
			result.mNextView = v;
			result.duration = duration;
			
			return result;
		}
		that.makeText = makeText;
		
		var show = function(){
			var tn = this.mTN;
			tn.mNextView = this.mNextView;
			_ToastManager.enqueueToast("", tn, this.duration);
		}
		that.prototype.show = show;
		
		return that;
	}
	that.Toast = Toast;
	
	var TN = function(){
		var that = {};
		
		that.mNextView = null;
		return that;
	}
	that.Toast = Toast;
	
	var _ToastManager = function(parentView){
		var that = {};
		var par = parentView;
		var timer;
		var toastsQueue = [];
		var c = -1;
		var currentToast = null;
		var fade = Fade();
		var durationWeight = 5;
		
		var enqueueToast = function(pkg, tn, duration){
			if (duration == Toast.LENGTH_SHORT){
				duration = 2 * durationWeight;
			} else if (duration == Toast.LENGTH_LONG){
				duration = 4 * durationWeight;
			}
			var t = {
				"pkg" : pkg,
				"view": tn.mNextView,
				"duration": duration
			};
			toastsQueue.push(t);
		}
		that.enqueueToast = enqueueToast;
		
		var TMLooper = function(){
			if (c == -1){
				if (toastsQueue.length == 0) return null;
				c = 0;
				currentToast = toastsQueue[0];
				var cV = currentToast.view;
				cV.style.opacity = 0;
				par.appendChild(cV);
				var bodyWidth = Number(par.clientWidth);
				var viewWidth = Number(cV.offsetWidth);
				var margin = 40;
				var resized = false;
				if (bodyWidth - margin < viewWidth){
					viewWidth = bodyWidth - margin;
					cV.style.width = viewWidth + "px";
					resized = true;
				}
				var left = (bodyWidth / 2) - (viewWidth / 2) - (resized ? margin*(1/4) : 0);
				cV.style.left = left + "px";
				fade = Fade();
				fade.setElement(cV);
				fade.startFadeIn();
			} else {
				if (fade.isFading()){return false};
				if (c > currentToast.duration){
					fade.startFadeOut(function(){
						par.removeChild(currentToast.view);
						currentToast = null;
						toastsQueue.splice(0, 1);
						c = -1;
					});
				}
				c++;
			}
		}
		timer = setInterval(TMLooper, 250);
		
		var destory = function(){
			clearInterval(timer);
		}
		that.destory = destory;
		
		return that;
	}
	that._ToastManager = _ToastManager;

	var ViewCopier = function(){
		var that = {};
		var getRandomName = function(){
			return "___jtl_view_rondom_id_" + Math.floor(Math.random() * Math.pow(10,10));
		}
		var eachIdOption = getRandomName();
		
		var copy = function(view, context, root){
			var clone, ctmp;
			var i, els;
			
			if (root){
				clone = root;
				ctmp = view.cloneNode(true);
				els = ctmp.getElementsByTagName("*");
				for(i=0;i<els.length;i++){
					clone.appendChild(els[i]);
				}
			} else {
				clone = view.cloneNode(true);
			}
			
			els = clone.getElementsByTagName("*");
			var ids = {};
			
			var genRandomId = function(id){
				return eachIdOption + "_stage_id:" + id + "_";
			}
			
			for(i=0;i<els.length; i++){
				if (els[i].id == "") continue;
				ids[els[i].id] = els[i];
				els[i].id = genRandomId(els[i].id);
			}
			ids[clone.id] = clone;
			clone.id = genRandomId(clone.id);
			
			clone.findViewById = (function(func, ids, doc){
				return function(id){
					var e = doc.getElementById(func(id)) || ids[id];
					var els = clone.getElementsByTagName("*");
					var i;
					for(i=0; i<els.length && !e; i++){
						if (els[i].id == func(id)){
							e = els[i];
							break;
						}
					}
					new View(context, e);
					return e;
				}
			})(genRandomId,ids, context);
			
			clone.findViewByClassName = function(className){
				var els = clone && clone.getElementsByTagName && clone.getElementsByTagName("*");
				var reg = new RegExp("^(.*?)\s*" + className + "(.*?)\s*$");
				var res = [];
				for(i=0; i<els.length; i++){
					if (els[i].className.match(reg)){
						res.push(els[i]);
					}
				}
				return res;
			}
	
			
			if ((clone.className + "").match(/^__jlt_layout | __jlt_layout$|^__jlt_layout$/)){
				clone.style.display = "block";
			}

			new View(context, clone);
			return clone;
		}
		that.copy = copy;
		return that;
	}
	that.ViewCopier = ViewCopier;
	
	var Adapter = function(context){
		var that = {};
		
		that.getCount = function(position){
			return 0;
		}
		that.getItem = function(position){
			return null;
		}
		that.getItemId = function(position){
			return null;
		}
		that.getView = function(position, convertView){
			return null;
		}
		that.notifyDatasetChanged = function(){
		}
		
		return that;
	}
	that.Adapter = Adapter;
	
	var PageAdapter = function(context){
		var that = new Adapter(context);
		var pages = [];
		
		JTL.override(that, "getCount", function(position){
			return pages.length;
		});
		
		JTL.override(that, "getItem", function(position){
			return pages[position];
		});
			
		JTL.override(that, "getItemId", function(position){
			return position;
		});
		
		that.addPage = function(page){
			pages.push(page);
		}
		
		return that;
	}
	that.PageAdapter = PageAdapter;
	
	var PageItem = function(){
		var that = {};
		var iconSrc = "";
		var pageObj = null;
		var pageTitle = "";
		
		that.setIconSrc = function(u){
			iconSrc = u;
			return that;
		}
		
		that.getIconSrc = function(){
			return iconSrc;
		}
		
		that.setPageObj = function(o){
			pageObj = o;
			return that;
		}
		
		that.getPageObj = function(){
			return pageObj;
		}
		
		that.setPageTitle = function(t){
			pageTitle = t;
			return that;
		}
		
		that.getPageTitle = function(){
			return pageTitle;
		}

		that.setResourceId = function(id){
			var item = Resources.TabButtons[id];
			iconSrc = item["iconurl"];
			pageTitle = item["title_jp"];
			return that;
		}
		
		return that;
	}
	that.PageItem = PageItem;
	
	var SimpleAdapter = function(context, data, layout, from, to){
		var that = new Adapter(context);
		JTL.override(that, "getCount", function(position){
			return data.length;
		});
		JTL.override(that, "getItem", function(position){
			return data[position];
		});
		JTL.override(that, "getItemId", function(position){
			return position;
		});
		JTL.override(that, "getView", function(position, convertView){
			var i;
			var v = convertView;
			var d = that.getItem(position);
			if (!v){
				var copier = new JTL.ViewCopier();
				v = copier.copy(layout, context.getDocContext());
			}
			for(i=0; i<from.length; i++){
				v.findViewById(to[i]).JTLView.setData(d[from[i]]);
			}
			return v;
		});
		
		return that;
	}
	that.SimpleAdapter = SimpleAdapter;
	
	var ListView = function(sContext){
		var context = sContext.getDocContext();
		var that = {};
		
		var lvElem = null;
		var adapter = null;
		var lvChildren = [];
		var addIdx = -1;
		var itemClickListener = null;
		var listUpFunc = function(){};
			
		var attachUpFunc = function(e){
			listUpFunc();
		}
		
		var setAdapter = function(a){
			adapter = a;
			updateElements();
			adapter.notifyDatasetChanged = (function(func){
				return function(){
					func();
				}
			})(updateElements);
		}
		that.setAdapter = setAdapter;
		
		var setOnItemClickListener = function(l){
			itemClickListener = l;
		}
		that.setOnItemClickListener = setOnItemClickListener;
		
		var setElement = function(elem){
			lvElem = elem;
			try{
				removeEListener(context, "mouseup", attachUpFunc);
				removeEListener(context, "touchend", attachUpFunc);
			}catch(e){}
			addEListener(context, "mouseup", attachUpFunc);
			addEListener(context, "touchend", attachUpFunc);

			var timer1 = setOnScrollEvent(context.body, attachUpFunc);
			var timer2 = setOnScrollEvent(context.documentElement, attachUpFunc);
			sContext.addDestoryFunc(function(){
				clearInterval(timer1);
				clearInterval(timer2);
				removeEListener(context, "mouseup", attachUpFunc);
				removeEListener(context, "touchend", attachUpFunc);
			});
		}
		that.setElement = setElement;
		
		var updateElements = function(){
			if (!adapter || !lvElem) return;
			var i;
			var el;
			var upFuncs = [];
			try{
				lvChildren[lvChildren.length-1].style.borderBottomWidth = "";
			}catch(e){};
			for(i=0; i<adapter.getCount(); i++){
				if (!lvChildren[i]){
					lvChildren[i] = null;
				}
				lvChildren[i] = adapter.getView(i, lvChildren[i]);
				el = lvChildren[i];
				if (i > addIdx){
					lvElem.appendChild(el);
					lvChildren[i].JTLView.setOnTouchListener(
					(function(el){
						return function(){
							listUpFunc();
							el.style.backgroundColor = "#9ddaec";
						}
					})(el), 
					(function(el){
						return function(){
							el.style.backgroundColor = "";
						}
					})(el), 
					(function(el, i, adapter){
						return function(){
							itemClickListener(el, i, adapter.getItemId(i));
						}
					})(el, i, adapter));
					addIdx = i;
				}
				upFuncs.push((function(element){
					return function(){
						element.style.backgroundColor = "";
						element.JTLView.forceUp();
					}
				})(el));
			}
			lvChildren[lvChildren.length-1].style.borderBottomWidth = "0px";
			listUpFunc = function(){
				var i;
				for(i=0; i<upFuncs.length; i++){
					upFuncs[i]();
				}
			}
			setTimeout(function(){
				listUpFunc();
			} , 100);
			listUpFunc();
		}
		
		return that;
	}
	that.ListView = ListView;
	
	var TitleSectionAdapter = function(context, data, from){
		var that = new SimpleAdapter(context, data, JTL.getLayoutById("__jlt_table_view_rowitem"), from, ["left", "right"]);
		
		var title = "untitled";
		var id = "";
		
		var setTitle = function(t){
			title = t;
			return that;
		}
		that.setTitle = setTitle;
		
		var getTitle = function(){
			return title;
		}
		that.getTitle = getTitle;
		
		var setId = function(_id){
			id = _id;
		}
		that.setId = setId;
		
		var getId = function(){
			return id;
		}
		that.getId = getId;
		
		return that;
	}
	that.TitleSectionAdapter = TitleSectionAdapter;
	
	var TableView = function(stageContext){
		var that = {};
		
		var sections = [];
		var listViews = [];
		var sectionTitleElems = [];
		var itemClickListener = function(){};
		var toAdd = [];
		var tvTitle = "";
		
		var notifyAllDatasetChanged = function(){
			var i;
			for(i=0; i<sections.length; i++){
				sections[i].notifyDatasetChanged();
				sectionTitleElems[i].innerHTML = sections[i].getTitle();
			}
		}
		that.notifyAllDatasetChanged = notifyAllDatasetChanged;
		
		var elem = null;
		var setElement = function(el){
			var i;
			elem = el;
			if (toAdd.length > 0){
				for(i=0; i<toAdd.length; i++){
					elem.appendChild(toAdd[i]);
				}
				toAdd = [];
			}
			return that;
		}
		
		var getElement = function(){
			return elem;
		}
		
		var setTableViewTitle = function(s){
			tvTitle = s;
			return that;
		}
		that.setTableViewTitle = setTableViewTitle;
		
		var getTableViewTitle = function(s){
			return tvTitle;
		}
		that.getTableViewTitle = getTableViewTitle;
		
		var setOnItemClickListener = function(l){
			itemClickListener = l;
			return that;
		}
		that.setOnItemClickListener = setOnItemClickListener;
		
		var getOnItemClickListener = function(){
			return itemClickListener;
		}
		that.getOnItemClickListener = getOnItemClickListener;
		
		var addSection = function(s){
			var listView = new JTL.ListView(stageContext);
			var sectionTitle = s.getTitle();
			var titleEl = stageContext.getDocContext().createElement("h3");
			var listEl = stageContext.getDocContext().createElement("ul");
			titleEl.innerHTML = sectionTitle;
			listView.setElement(listEl);
			listView.setAdapter(s);
			s.notifyDatasetChanged();
			
			listView.setOnItemClickListener(function(a, b, c){
				itemClickListener(s.getId(), a, b, c);
			});
			
			if (elem){
				elem.appendChild(titleEl);
				elem.appendChild(listEl);
			} else {
				toAdd.push(titleEl);
				toAdd.push(listEl);
			}
			
			sections.push(s);
			listViews.push(listView);
			sectionTitleElems.push(titleEl);
			
			return that;
		}
		
		var getSection = function(i){
			return sections[i];
		}
		
		var removeSection = function(i){
			elem.removeChild(sectionTitleElems[i]);
			elem.removeChild(listViews.getElement([i]));
			sections.splice(i, 1);
			sectionTitleElems.splice(i, 1);
			listViews.splice(i, 1);
			return that;
		}
		
		that.setElement = setElement;
		that.getElement = getElement;
		that.addSection = addSection;
		that.getSection = getSection;
		that.removeSection = removeSection;
		
		return that;
	}
	that.TableView = TableView;
	
	var TYPE = {
		"LEFT_APPICON" : "left_app",
		"RIGHT_ITEM_RIGHT": "right_itemright",
		"RIGHT_ITEM_LEFT": "right_itemleft"
	};
	that.StageTopItem = TYPE;
	
	var PageManager = function(){
		var that = new Adapter();
		return that;
	}
	
	var Stage = function(doc){
		var that = {};
		var layout = null;
		var context = doc;
		var stageManager = null;
		var titleView = null;
		var actionMenu = null;
		var actionMenuList = null;
		var isActionMenuEnabled = false;
		var topView = null;
		var bottomViewWrapper = null;
		var bottomView = null;
		var Toast = null;
		var onDestoryFuncs = [];
		var topButtonFunc = function(){};
		var stageId = 0;
		var blackOverray = null;
		var blackOverray2 = null;
		var whiteOverray = null;
		var spinnerArea = null;
		var stageBody = null;
		var titleTx = "";
		
		var actionBarStatus = false;
		var actionSlider = new Slider();
		var actionFade = new Fader();
		var whiteOverrayFade = new Fader();
		var blackFadeForAny = new Fader();
		
		var currentPageAdapterIndex = -1;
		var currentPage = null;
		var tabBarPageItems = [];
		
		var oldtitle = "";
		
		var showSpinner = function(s){
			var el = doc.createElement("div");
			el.className = "__jlt_tableview_area __jlt_tableview_wrapper __jlt_spinner";
			while(spinnerArea.firstChild){
				spinnerArea.removeChild(spinnerArea.firstChild);
			}
			s.setElement(el);
			spinnerArea.appendChild(el);
			s.notifyAllDatasetChanged();
			that.showBlackOverray(function(){
				spinnerArea.style.display = "block";
			});
			
			oldtitle = getTitle();
			setTitle(s.getTableViewTitle());
		}
		that.showSpinner = showSpinner;
		
		var hideSpinner = function(){
			that.hideBlackOverray();
			setTitle(oldtitle);
			spinnerArea.style.display = "none";
		}
		that.hideSpinner = hideSpinner;
		
		var setPage = function(index){
			if (index == currentPageAdapterIndex) return;
			var d = that.getPageAdapter().getItem(index);
			var item = d.getPageObj();
			var title = "";
			var newPage = new item(doc);
			var i;
			var fadeEnabled = false;
			try{
				hideSpinner();
			}catch(e){};
			if (currentPage != null){
				currentPage.OnPageFinish();
			}
			
			for(i=0; i<tabBarPageItems.length; i++){
				var e = tabBarPageItems[i];
				if (i == index){
					e.className = "selected";
				} else {
					e.className = "unselected";
				}
			}
			
			whiteOverrayFade.setTimerInterval(25);
			whiteOverrayFade.setLength(0.1);
			var afterFading = function(){
				while(stageBody.firstChild){
					stageBody.removeChild(stageBody.firstChild);
				}
				newPage.OnPageContentLoad();
				stageBody.appendChild(newPage.getPageLayout());
				
				stageBody.scrollTop = 0;
				
				if(isAndroid2x){
					doc.documentElement.scrollTop = 0;
					doc.body.scrollTop = 0;
				}
				
				currentPageAdapterIndex = index;
				title = d.getPageTitle();
				if (title != null) that.setTitle(title);
				newPage.OnPageStart();
				currentPage = newPage;
				stageBody.scrollIntoView(true);
				whiteOverrayFade.setTimerInterval(20);
				whiteOverrayFade.setLength(0.25);
				var afterFading = function(){
					whiteOverray.style.display = "none";
				}
				whiteOverrayFade.afterFading = afterFading;
				if (fadeEnabled){
					whiteOverrayFade.startFadeOut();
				} else {
					afterFading();
				}
			};
			whiteOverrayFade.afterFading = afterFading;
			if (fadeEnabled){
				whiteOverrayFade.startFadeIn();
			} else {
				afterFading();
			}
		}
		that.setPage = setPage;
		
		var getCurrentPage = function(){
			return currentPage;
		}
		that.getCurrentPage = getCurrentPage;
		
		that.getStageTitle = function(){
			return " [STAGE TITLE]";
		}
		
		that.Toast = Toast;
		var setStageLayout = function(newLayout){
			var i, els;
			var copier = new ViewCopier();
			var bodyLayout;
			
			var base = copier.copy(JTL.getLayoutById("__jlt_stage_basic_layout"), context);
			bodyLayout = copier.copy(newLayout, context);
			
			titleView = base.findViewByClassName("__jlt_stage_title_text")[0] || null;
			
			var bodyArea = base.findViewByClassName("__jlt_stage_area_body")[0];
			bodyArea.appendChild(bodyLayout);
			stageBody = bodyArea;
			
			topView = base.findViewByClassName("__jlt_stage_title_bar1")[0] || null;
			actionMenu = base.findViewByClassName("__jlt_stage_actionmenu_area")[0] || null;
			bottomViewWrapper = base.findViewByClassName("__jlt_stage_area_bottom")[0] || null;
			
			blackOverray = base.findViewByClassName("__jlt_stage_black_overray")[0] || null;
			blackOverray2 = base.findViewByClassName("__jlt_stage_black_overray")[1] || null;
			whiteOverray = base.findViewByClassName("__jlt_stage_white_overray")[0] || null;
			spinnerArea = base.findViewByClassName("__jlt_stage_for_spinner")[0] || null;
			
			blackFadeForAny.setElement(blackOverray2);
			blackFadeForAny.setTimerInterval(20);
			blackFadeForAny.setLength(0.1);
			blackFadeForAny.setTransMax(0.85);
			
			new View(context, blackOverray2);
			blackOverray2.JTLView.setOnClickListener(function(){
				try{
					that.hideSpinner();
				}catch(e){
				}
				that.hideBlackOverray();
			});
			
			whiteOverrayFade = new Fader();
			whiteOverrayFade.setElement(whiteOverray);

			new View(context, blackOverray);
			blackOverray.JTLView.setOnClickListener(function(){
				hideActionMenu();
			});
			
			setTopIconEvent();
			layout = base;
			
			OnResizeLayout();
			setTitle(" ");
		
			return that;
		}
		that.setStageLayout = setStageLayout;
		
		var getPageAdapter = function(){
			return new PageManager();
		}
		that.getPageAdapter = getPageAdapter;
		
		var setStageId = function(id){
			stageId = id;
		}
		that.setStageId = setStageId;
		
		
		var setActionMenuContent = function(elem){
			while(actionMenu.firstChild){
				actionMenu.removeChild(actionMenu);
			}
			actionMenu.appendChild(elem);
			OnResizeLayout();
			actionSlider.setElement(actionMenu);
			
			actionFade = new Fader();
			actionFade.setElement(blackOverray);
			actionFade.setTimerInterval(25);
			actionFade.setLength(0.3);
			actionFade.setTransMax(0.7);
			
			isActionMenuEnabled = true;
			return that;
		}
		that.setActionMenuContent = setActionMenuContent;
		
		var getStageId = function(){
			return stageId;
		}
		that.getStageId = getStageId;
		
		var addDestoryFunc = function(f){
			onDestoryFuncs.push(f);
		}
		that.addDestoryFunc = addDestoryFunc;
		
		var getDestoryFuncs = function(){
			return onDestoryFuncs;
		}
		that.getDestoryFuncs = getDestoryFuncs;
		
		var setTitle = function(tx){
			titleView.innerHTML = tx;
			titleTx = tx;
		}
		that.setTitle = setTitle;
		
		var getTitle = function(){
			return titleTx;
		}
		that.getTitle = getTitle;
		
		/*
			画面上部トップバーの要素をセットする
			view:HTMLElement セットする要素（コピーされる）
		*/
		setTopView = function(view){
			var topParent = topView.parentNode;
			var copier = new ViewCopier();
			var newTop = copier.copy(view, context);
			var els;
			
			topParent.insertBefore(newTop, topView);
			topParent.removeChild(topView);
			topView = newTop;
			
			els = getElementsByClassName("__jlt_stage_title_text", layout);
			titleView = els[0];
			
			setTopIconEvent();
			OnResizeLayout();
			that.setTitle(that.getStageTitle());
			return that;
		}
		that.setTopView = setTopView;
		
		/*
			画面下部ボトムバーの要素をセットする
			view:HTMLElement セットする要素（コピーされる）
		*/
		setBottomView = function(view){
			var copier = new ViewCopier();
			var newBottom = copier.copy(view, context);
			var els;
			
			while(bottomViewWrapper.firstChild){
				bottomViewWrapper.removeChild(bottomViewWrapper.firstChild);
			}
			
			bottomViewWrapper.appendChild(newBottom);
			bottomView = newBottom.findViewByClassName("__jlt_stage_bottom_tabbar")[0];

			setTabButtons();
			OnResizeLayout();
			return that;
		}
		that.setBottomView = setBottomView;
		
		var OnTopButtonClick = function(type){
			switch(type){
				case TYPE.LEFT_APPICON:
					if (isActionMenuEnabled == true){
						turnActionMenu();
					}
					break;
			}
		}
		that.OnTopButtonClick = OnTopButtonClick;
		
		
		var OnBottomButtonClick = function(index){
			setPage(index);
		}
		that.OnBottomButtonClick = OnBottomButtonClick;
		
		
		/*
			ボトムバーのタブの要素をセットする
		*/
		var setTabButtons = function(){
			var i;
			var items = that.getPageAdapter();
			while(bottomView.firstChild){
				bottomView.removeChild(bottomView.firstChild);
			}
			var trIcon = doc.createElement("tr");
			var td1, img, title;
			var t;
			tabBarPageItems = [];
			for(i=0; i<items.getCount(); i++){
				t = items.getItem(i);
				td1 = doc.createElement("td");
				img = doc.createElement("img");
				title = doc.createElement("div");
				img.src = t.getIconSrc();
				td1.appendChild(img);
				trIcon.appendChild(td1);
				title.innerHTML = t.getPageTitle();
				td1.appendChild(title);
				td1.rowspan = 2;
				_setIconEvent(td1, (function(i){
					return function(){
						setPage(i);
					}
				})(i));
				if (i != items.getCount() - 1){
					td1.style.borderRight = "solid 1px #f5f5f5";
				}
				tabBarPageItems.push(td1);
			}
			bottomView.appendChild(trIcon);
		}
		
		/*
			ナビゲーションバーのボタンにマウスイベントを設定する
			el:HTMLElement 設定対象要素, func:Function クリック時の操作
		*/
		var _setIconEvent = function(el, func){
			if (!el.JTLView){
				new View(context, el);
				upFunc = function(){
					el.style.backgroundColor = "";
					el.JTLView.forceUp();
				}
				el.JTLView.setOnTouchListener(function(){
					el.style.backgroundColor = "#7FAFEA";
				}, upFunc, function(){
					func();
				});
				addEListener(doc, "touchend", upFunc);
				addEListener(doc, "mouseup", upFunc);
				addDestoryFunc(function(){
					removeEListener(doc, "touchend", upFunc);
					removeEListener(doc, "mouseup", upFunc);
				});
			}
			el.oncontextmenu = function(){return false;}
			el.touchend = function(e){
				e.preventDefault();
				return false;
			}
		}
			
		/*
			ナビゲーションバーのボタンのうちマウスイベントを設定する項目を決定する
			実行する関数にボタンの種類を表す定数を付加する
		*/
		var setTopIconEvent = function(){
			var els, upFunc;
			els = getElementsByClassName("__jlt_stage_top_bar_leftbutton", topView);
			if (els.length > 0){
				_setIconEvent(els[0], function(){
					that.OnTopButtonClick(TYPE.LEFT_APPICON)
				});
			}
			
			els = getElementsByClassName("__jlt_stage_top_bar_rightsidenavi_right_arrow", topView);
			if (els.length > 0){
				_setIconEvent(els[0], function(){
					that.OnTopButtonClick(TYPE.RIGHT_ITEM_RIGHT)
				});
			}
			
			els = getElementsByClassName("__jlt_stage_top_bar_rightsidenavi_left_arrow", topView);
			if (els.length > 0){
				_setIconEvent(els[0], function(){
					that.OnTopButtonClick(TYPE.RIGHT_ITEM_LEFT)
				});
			}
			
			els = topView.getElementsByTagName("*");
			for(i=0; i<els.length; i++){
				els[i].draggable = "false";
				els[i].ondragstart = function(e){
					e.preventDefault();
					return false;
				}
			}
		}
		
		
		setStageManager = function(s){
			stageManager = s;
		}
		that.setStageManager = setStageManager;
		
		getStageManager = function(s){
			return stageManager;
		}
		that.getStageManager = getStageManager;
		
		var getStageLayout = function(){
			return layout;
		}
		that.getStageLayout = getStageLayout;
		
		var OnStageContentLoad = function(){
			that.setStageLayout(doc.createElement("div"));
			return true;
		}
		that.OnStageContentLoad = OnStageContentLoad;
		
		var OnStageStart = function(){
			//ステージ動作開始
			that.setTitle(that.getStageTitle());
			OnResizeLayout();
			return true;
		}
		that.OnStageStart = OnStageStart;
	
		var OnPageSet = function(){
			//ページ読み込み開始
			var count = that.getPageAdapter().getCount();
			if (count > 0){
				setPage(0);
			}
			return true;
		}
		that.OnPageSet = OnPageSet;
		
		var OnResizeLayout = function(){
			var els = layout.getElementsByTagName("*");
			var i;
			var w = 0;
			var topBarHeight = 0;
			var bottomBarHeight = 0;
            
            getStageManager().getAppManager().resizeStage();
			
			els = getElementsByClassName("__jlt_stage_area_top", layout);
			w = els[0].clientWidth;

			els = getElementsByClassName("__jlt_stage_top_bar", layout);
			if (els.length > 0){
				els[0].style.width = w + "px";
				topBarHeight = els[0].clientHeight;
			}
			
			els = getElementsByClassName("__jlt_stage_area_bottom", layout);
			if (els.length > 0){
				els[0].style.width = w + "px";
				bottomBarHeight = els[0].clientHeight;
			}
			
			if (bottomView ==null){
				bottomBarHeight = 0;
			}
			
			actionMenu.style.height = (stageManager.getStageSize().height - topBarHeight) + "px";

			blackOverray.style.height = stageManager.getStageSize().height + "px";
			blackOverray.style.width = stageManager.getStageSize().width + "px";
			
			blackOverray2.style.height = stageManager.getStageSize().height + "px";
			blackOverray2.style.width = stageManager.getStageSize().width + "px";
			
			whiteOverray.style.height = stageManager.getStageSize().height + "px";
			whiteOverray.style.width = stageManager.getStageSize().width + "px";
			
			//spinnerArea.style.height = (stageManager.getStageSize().height - topBarHeight) + "px";
			spinnerArea.style.width = stageManager.getStageSize().width + "px";
			spinnerArea.style.top = topBarHeight + "px";
			
			if(isAndroid2x){
				stageBody.style.height = (stageManager.getStageSize().height) + "px";
				doc.documentElement.style.marginTop = topBarHeight + "px";
				doc.documentElement.style.marginBottom = bottomBarHeight + "px";
			} else {
				stageBody.style.height = (stageManager.getStageSize().height - topBarHeight - bottomBarHeight) + "px";
			}
			
			var c = function(e){
				e.preventDefault();
				return false;
			}
			bottomViewWrapper.ontouchmove = c;
			topView.ontouchmove = c;
		
			if (isiPhone){
				var oldSc = 0;
				var oldPx = 0;
				var c = 0;
				stageBody.ontouchstart = function(e){
					oldSc = stageBody.scrollTop;
					oldPx = e.pageY;
					c = 0;
				}
				stageBody.ontouchmove = function(e){
					if (oldSc == 0){
						if (oldPx < e.pageY){
							e.preventDefault();
							return false;
						}
					}

					if (stageBody.scrollTop + stageBody.offsetHeight == stageBody.scrollHeight){
						if (oldPx > e.pageY){
							e.preventDefault();
							return false;
						}
					}

				}
			}
		}
		that.OnResizeLayout = OnResizeLayout;
		
		var turnActionMenu = function(){
			if (actionBarStatus){
				hideActionMenu();
			} else {
				showActionMenu();
			}
		} 
		that.turnActionMenu = turnActionMenu;
		
		var showActionMenu = function(){
			actionMenu.style.visibility = "hidden";
			actionMenu.style.display = "block";
			
			actionFade.afterFading = function(){
				// DO NOTHING
			}
			actionFade.startFadeIn();
			
			actionSlider.setSlideFunction({"x": -1*actionMenu.clientWidth, "y": null}, {"x": 0, "y": null}, 13);
			actionSlider.setTimerInterval(15);
			actionMenu.style.visibility = "visible";
			actionSlider.startSlide();

			actionSlider.afterSliding = function(){
				//DO NOTHING
			}
			actionBarStatus = true;
		}
		that.showActionMenu = showActionMenu;
		
		var hideActionMenu = function(){
			actionFade.afterFading = function(){
				blackOverray.style.display = "none";
			}
			actionFade.startFadeOut();
			
			actionSlider.setSlideFunction({"x": 0, "y": null}, {"x": -1*(actionMenu.clientWidth + 20), "y": null}, 13);
			actionSlider.setTimerInterval(15);
			actionSlider.startSlide();
			
			actionSlider.afterSliding = function(){
				actionMenu.style.display = "none";
			}
			actionBarStatus = false;
		}
		that.hideActionMenu = hideActionMenu;
		
		var showBlackOverray = function(func){
			blackFadeForAny.afterFading = function(){
				if (func) func();
			}
			blackFadeForAny.startFadeIn();
		}
		that.showBlackOverray = showBlackOverray;
		
		var hideBlackOverray = function(func){
			blackFadeForAny.afterFading = function(){
				if (func) func();
				blackOverray2.style.display = "none";
			};
			blackFadeForAny.startFadeOut();
		}
		that.hideBlackOverray = hideBlackOverray;
		
		var OnStagePause = function(){
			//ステージ中断
			return true;
		}
		that.OnStagePause = OnStagePause;
		
		var OnStageFinish = function(){
			//ステージ終了
			return true;
		}
		that.OnStageFinish = OnStageFinish;
		
		var findViewById = function(name){
			return layout.findViewById(name);
		}
		that.findViewById = findViewById;
		
		var getDocContext = function(){
			return context;
		}
		that.getDocContext = getDocContext;
		
		return that;
	}
	that.Stage = Stage;
	
	var Page = function(doc){
		var that = {};

		var layout = null;
		var context = doc;

		var topButtonFunc = function(){};
		var pageId = 0;
		var pageBody = null;
		var stage = null;
		
		var setStage = function(s){
			stage = s;
			return that;
		}
		that.setStage = setStage;
		
		var getStage = function(){
			return stage;
		}
		that.getStage = getStage;
		
		var getTitle = function(){
			return null;
		}
		that.getTitle = getTitle;
		
		var setPageLayout = function(newLayout){
			var i, els;
			var copier = new ViewCopier();
			var bodyLayout;
			
			var base = copier.copy(JTL.getLayoutById("__jlt_page_basic_layout"), context);
			bodyLayout = copier.copy(newLayout, context);
			
			base.appendChild(bodyLayout);
			
			layout = base;
			return that;
		}
		that.setPageLayout = setPageLayout;
		
		var getPageLayout = function(){
			return layout;
		}
		that.getPageLayout = getPageLayout;
		
		var setPageId = function(id){
			pageId = id;
		}
		that.setPageId = setPageId;
		
		var getPageId = function(){
			return pageId;
		}
		that.getPageId = getPageId;
		
		var OnPageContentLoad = function(){
			//ページ読み込み開始
			that.setPageLayout(doc.createElement("div"));
			return true;
		}
		that.OnPageContentLoad = OnPageContentLoad;
		
		var OnPageStart = function(){
			//ページ動作開始
			OnResizeLayout();
			return true;
		}
		that.OnPageStart = OnPageStart;
		
		var OnResizeLayout = function(){
			// DO NOTHING
		}
		that.OnResizeLayout = OnResizeLayout;
		
		var OnSessionRegSave = function(){
			// DO NOTHING
		}
		that.OnSessionRegSave = OnSessionRegSave;

		var OnPagePause = function(){
			//ページ中断
			return true;
		}
		that.OnPagePause = OnPagePause;
		
		var OnPageFinish = function(){
			//ページ終了
			return true;
		}
		that.OnPageFinish = OnPageFinish;
		
		var findViewById = function(name){
			return layout.findViewById(name);
		}
		that.findViewById = findViewById;
		
		var getDocContext = function(){
			return context;
		}
		that.getDocContext = getDocContext;
		
		return that;
	}
	that.Page = Page;
	
	var StageManager = function(win, doc){
		var that = {};
		var stageArea = null;
		var stageObj = null;
		
		var toastManager = null;
		var toast = null;
		var appManager = null;
		
		var KVStore = null;
		
		var setKVStore = function(store){
			KVStore = store;
			return that;
		}
		that.setKVStore = setKVStore;
		
		var getStage = function(){
			return stageObj;
		}
		that.getStage = getStage;
		
		var setAppManager = function(m){
			appManager = m;
			return that;
		}
		that.setAppManager = setAppManager;
		
		var getAppManager = function(){
			return appManager;
		}
		that.getAppManager = getAppManager;
		
		that.OnPageUnload = function(){};
		
		var keeperId = null;
		var stageSessionKeeper = function(){
			if (!stageObj || !KVStore) return;
			var r = stageObj.OnSessionRegSave();
			if (r){
				r = JSON.stringify(r);
				if (typeof r == "string"){
					KVStore.setItem("stageSessionData__" + stageObj.getStageId() + "__", r);
				}
			}
		}
	
		var newStageZoomer = new Zoomer();
		var newStageFader = new Fader();
		var startStage = function(stageId){
			var i, destoryFuncs;
			var els;
			
			appManager.setCurrentStageId(stageId);
			
			var s = appManager.getStagesObject()[stageId];
			s = new s(doc);
			
			var trStatus = false; //切り替え効果の有無
			if (win.navigator.userAgent.indexOf("iPhone OS") != -1){
				//trStatus = true;
			}
			
			newStageZoomer.setElement(stageArea)
				.setMinScale(0.9)
				.setTimerInterval(30);
			
			newStageFader.setElement(stageArea)
				.setLength(0.18)
				.setTimerInterval(20);
			
			
			var c = 0;
			newStageZoomer.afterZooming = function(){
				c++;
				if (c == 2) afterTrans();
			}
			newStageFader.afterFading = function(){
				c++;
				if (c == 2) afterTrans();
			}
			
			var afterTrans = function(){
				var r = {};
				if (stageObj) {
					r = stageObj.OnStageFinish();
					if (r){
						r = JSON.stringify(r);
						if (typeof r == "string"){
							KVStore.setItem("stageSessionData__" + stageObj.getStageId() + "__", r);
						}
					}
					destoryFuncs = stageObj.getDestoryFuncs();
					for(i=0; i<destoryFuncs.length; i++){
						destoryFuncs[i]();
					}
				}
				
				els = stageArea.childNodes;
				for(i=0; i<els.length; i++){
					if (els[i].className.match(/__jlt__default_toast/)){
						continue;
					}
					stageArea.removeChild(els[i]);
				}
				
				//古いステージの終了処理ここまで
				//以下新しいStageのための処理
				location.hash = s.getStageId();
				doc.title = appManager.getAppName() + " - " + s.getStageTitle();
				
				s.Toast = toast;
				s.setStageManager(that);
				
				//レイアウト等用意
				try{
					s.OnStageContentLoad();
				} catch(e){
					alert("ステージ例外(OnStageContentLoad)" + e);
				}
				stageArea.appendChild(s.getStageLayout());
				
				//ページ移動時のイベント設定
				appManager.beforeUnload = function(){
					r = stageObj.OnStagePause();
					if (r){
						r = JSON.stringify(r);
						if (typeof r == "string"){
							KVStore.setItem("stageSessionData__" + stageObj.getStageId() + "__", r);
						}
					}
				};
				
				var c2 = 0;
				var afterFadeZoomIn = function(){
					//ステージ動作開始
					try{
						r = {};
						r = KVStore.getItem("stageSessionData__" + s.getStageId() + "__");
						if (r){
							r = JSON.parse(r);
							s.OnStageStart(r);
						} else {
							s.OnStageStart();
						}
					} catch(e){
						alert("ステージ例外（OnStageStart)" + e);
					}
					
					//ページ動作開始
					try{
						s.OnPageSet();
					} catch(e){
						alert("ステージ例外（OnPageSet)" + e);
					}
					stageObj = null;
					
					stageObj = s;
				}
				newStageZoomer.afterZooming = function(){
					c2++;
					if (c2 == 2) afterFadeZoomIn();
				}
				newStageFader.afterFading = function(){
					c2++;
					if (c2 == 2) afterFadeZoomIn();
				}
			
				if (trStatus){	
					newStageZoomer.startZoomIn();
					newStageFader.startFadeIn();
				} else {
					afterFadeZoomIn();
				}
				
				return true;
			}
			
			if (trStatus){
				newStageZoomer.startZoomOut();
				newStageFader.startFadeOut();
			} else {
				afterTrans();
			}
		}
		that.startStage = startStage;
		
		var setStageArea = function(el){
			stageArea = el || null;
			
			if (toastManager){
				//Toastのループを解除
 				toastManager.destory();
			}
			while(el.firstChild){
				el.removeChild(el.firstChild);
			}
			toastManager = new JTL._ToastManager(stageArea);
			toast = new JTL.Toast(doc, win, toastManager);
			
			//SessionKeeperを開始
			keeperId = setInterval(stageSessionKeeper, 30 * 1000);
			
			return that;
		}
		that.setStageArea = setStageArea;
		
		var getStageSize = function(){
			return {
				"width": stageArea.clientWidth,
				"height": stageArea.clientHeight
			};
		}
		that.getStageSize = getStageSize;
		
		addEListener(win, "resize", function(){
			if (!stageObj) return;
			stageObj.OnResizeLayout();
		});
		
		return that;
	}
	that.StageManager = StageManager;
	
	var override = function(s, name, func){
		var superMethod = s[name];
		s[name] = func;
		s[name]._super = superMethod;
		return s;
	}
	that.override = override;
	
	var setLayouts = function(l){
		if (typeof l == "string"){
			var e = document.createElement("div");
			e.innerHTML = l;
			layouts = e;
		} else {
			layouts = l;
		}
	}
	that.setLayouts = setLayouts;
	
	var getLayoutById = function(id){
		var els = layouts.getElementsByTagName("*");
		var i;
		for(i=0; i<els.length; i++){
			if (els[i].id == id){
				return els[i];
			}
		}
		return null;
	}
	that.getLayoutById = getLayoutById;
	
	var setOnLoadFunction = function(func){
		if (JTLLoaded == true){
			func();
		} else {
			onloadFunc = func;
		}
	}
	that.setOnLoadFunction = setOnLoadFunction;
	
	var JTLInit = function(){
		JDB.Ajax("get", "JTLLayouts.txt", function(s){
			setLayouts(s);
			//レイアウト読み込み完了
			JTLLoaded = true;
			onloadFunc();
			
			// 以下Intel XDK用
			try{
				navigator.splashscreen.hide();
			}catch(e){};
		});
	}
	
	var AppManager = function(w, d){
		var that = {};
		
		var appName = window.title;
		var appId = location.href;
		var stageManager = null;
		var stagesObject = {};
		var firstStageId = "";
		var curentStageId = "";
		var updateToastCount = 0;
		
		var SETTINGS_CURRENT_STAGEID = "currentStageId";
		var IS_UPDATING = "isupdating";
		
		that.beforeUnload = function(){
		}
		var beforeUnloadWrapper = function(){
			that.beforeUnload();
		}
		
		addEListener(w, "beforeunload", beforeUnloadWrapper);
		addEListener(w, "unload", beforeUnloadWrapper);
		
		var KVStore = (function(){
			var that = {};
			
			that.setItem = function(itemid, itemvalue){
				JDB.Store.setItem(appId + "_appData_" + itemid, itemvalue);
				return that;
			}
			that.getItem = function(itemid){
				return JDB.Store.getItem(appId + "_appData_" + itemid);
			}
			that.removeItem = function(itemid){
				return JDB.Store.removeItem(appId + "_appData_" + itemid);
			}
			
			return that;
		})();
		that.KVStore = KVStore;
		
		
		var FrameworkSettings = (function(){
			var that = {};
			
			var genId = function(id){
				return appId + "" + "_appSettings_" + id + "";
			}
			
			var setItem = function(itemid, itemvalue){
				JDB.Store.setItem(genId(itemid), itemvalue);
				return that;
			}
			var getItem = function(itemid){
				return JDB.Store.getItem(genId(itemid));
			}
			var removeItem = function(itemid){
				return JDB.Store.removeItem(genId(itemid));
			}
			
			that.setItem = setItem;
			that.getItem = getItem;
			that.removeItem = removeItem;
			
			return that;
		})();
		that.FrameworkSettings = FrameworkSettings;
		
		var setCurrentStageId = function(id){
			curentStageId = id;
			FrameworkSettings.setItem(SETTINGS_CURRENT_STAGEID, id);
			return that;
		}
		that.setCurrentStageId = setCurrentStageId;
		
		var getCurrentStageId = function(id){
			return curentStageId;
		}
		that.getCurrentStageId = getCurrentStageId;
		
		var setAppId = function(id){
			appId = id;
			return that;
		}
		that.setAppId = setAppId;
		
		var getAppId = function(){
			return appId;
		}
		that.getAppId = getAppId;
		
		var setAppName = function(name){
			appName = name;
			return that;
		}
		that.setAppName = setAppName;
	
		var getAppName = function(name){
			return appName;
		}
		that.getAppName = getAppName;
		
        that.resizeStage = function(){};
        
		var setStageArea = function(area){
			var s = new JTL.StageManager(w, d);
			area = resizeStageAreaSize(area);
            
            s.setStageArea(area);
			s.setAppManager(that);
            
            that.resizeStage = function(){
                area = resizeStageAreaSize(area);
            }
            
            stageManager = s;
			stageManager.setKVStore(KVStore);
						
            return that;
		}
		that.setStageArea = setStageArea;
		
		var setFirstStageId = function(id){
			firstStageId = id;
			return that;
		}
		that.setFirstStageId = setFirstStageId;
		
		var setStagesObject = function(o){
			stagesObject = o;
			return that;
		}
		that.setStagesObject = setStagesObject;

		var getStagesObject = function(){
			return stagesObject;
		}
		that.getStagesObject = getStagesObject;
		
		var resizeStageAreaSize = function(area){
			var h = 0;
			if (w.innerHeight && w.innerHeight > d.documentElement.offsetHeight){
				h = w.innerHeight;
				if(w.navigator.userAgent.indexOf("Android 2.") != -1){
					isAndroid2x = true;
					h = w.outerHeight;
					d.body.style.overflow = "auto";
					d.documentElement.style.overflow = "auto";
				}
				
			} else {
				h = d.documentElement.offsetHeight || w.innerHeight;
			}
			
			if(w.navigator.userAgent.indexOf("iPhone OS") != -1){
				isiPhone = true;
			}
			if(w.navigator.userAgent.indexOf("3DS") != -1){
				is3DS = true;
			}

			if (h < 200){
				h = "";
			}
			
			if (area && area.style){
				area.style.height = h + "px";
			}
			return area;
		}
		addEListener(w, "resize", resizeStageAreaSize);
		
		updateToastCount = 2;
		var timerid = setInterval(function(){
			updateToastCount --;
			if (updateToastCount <= 0){
				clearInterval(timerid);
			}
		}, 1000);
		
		var updateCheck = function(){
			try{
				w.applicationCache.update();
				return true;
			}catch(e){
				w.location.reload(true);
			};
			return false;
		}
		that.updateCheck = updateCheck;
		
		var cacheEvent = function(e){
			var toast = null;
			try{
				toast = stageManager.getStage().Toast;
			}catch(e){};
			
			switch(e.type){
				case "noupdate":
					var s = FrameworkSettings.getItem(IS_UPDATING);
					if (s == "true"){
						toast && toast.makeText(d, "アプリを更新しました。\n変更についての詳細はヘルプからご覧ください。", toast.LENGTH_LONG).show();
					} else {
						if (updateToastCount == 0){
							toast && toast.makeText(d, "アプリの更新はありません", toast.LENGTH_SHORT).show();
						}
					}
					FrameworkSettings.setItem(IS_UPDATING, "");
					break;
				case "updateready":
					if (confirm("更新版が利用可能です。\n更新を実行しますか？")){
						FrameworkSettings.setItem(IS_UPDATING, "true");
						w.location.reload();
					}
					break;
				case "downloading":
					toast && toast.makeText(d, "データをダウンロード中...", toast.LENGTH_SHORT).show();
					break;
			}
		}
		
		var cacheEventWrapper = function(e){
			cacheEvent(e);
		}
		
		if (w.applicationCache){
			addEListener(w.applicationCache, "checking", cacheEventWrapper);
			addEListener(w.applicationCache, "downloading", cacheEventWrapper);
			addEListener(w.applicationCache, "cached", cacheEventWrapper);
			addEListener(w.applicationCache, "noupdate", cacheEventWrapper);
			addEListener(w.applicationCache, "updateready", cacheEventWrapper);
			try{
				w.applicationCache.update();
			}catch(e){
				//キャッシュを設定していないなど
			};
		}
		
		var startFirstStage = function(){
			var restoreId = FrameworkSettings.getItem(SETTINGS_CURRENT_STAGEID)
			var id = stagesObject[restoreId] ? restoreId : firstStageId;
			stageManager.startStage(id);
			return that;
		}
		that.startFirstStage = startFirstStage;
		
		return that;
	}
	that.AppManager = AppManager;
	
	JTLInit();
	return that;
})();
