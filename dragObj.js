function dragObj(obj, objEdge){ //obj为拖放对象；objEdge为布尔值，为true则obj的父对象作为拖放的边界
 
	function getScrollOffsets(_w) {//获取页面的滚动位置函数
		_w = _w || window;
		//for all and IE9+
		if (_w.pageXOffset != null) return {
			x: _w.pageXOffset,
			y: _w.pageYOffset
		};
		//for IE678
		var _d = _w.document;
		if (document.compatMode == "CSS1Compat") return { //for IE678
			x: _d.documentElement.scrollLeft,
			y: _d.documentElement.scrollTop
		};
		//for other mode
		return {
			x: _d.body.scrollLeft,
			y: _d.body.scrpllTop
		};
	}
 
	var _self=obj;
	this._self=_self;
 
	if(objEdge) {//初始化边界的属性,如果是图片的话必须页面加载初始化，否则探测不到图片的宽高。也可以放在点击事件处理程序中，这样不需要等页面加载完毕
		var _edge=_self.parentNode;
		this._edge=_edge;
		//初始化目标样式
		if(!_self.style.top) {
			_self.style.top=( _self.getBoundingClientRect().top-_edge.getBoundingClientRect().top )+"px";
 
		}
		if(!_self.style.left) {
			_self.style.left=( _self.getBoundingClientRect().left-_edge.getBoundingClientRect().left )+"px";
		}
		if(!_self.style.position) _self.style.position="absolute"; 
		if(!_self.style.display || _self.style.display=="inline") _self.style.display="block";
 
		//初始化边界样式和移动固定区域
 
		if(!_edge.style.display || _edge.style.display=="inline") _edge.style.display="block"; 
		var edgeSizeWidth=_edge.getBoundingClientRect().right-_edge.getBoundingClientRect().left;//边界尺寸
		var edgeSizeHeight=_edge.getBoundingClientRect().bottom-_edge.getBoundingClientRect().top;
 
		var dragObjSizeWidth=_self.getBoundingClientRect().right-_self.getBoundingClientRect().left;//拖动对象尺寸
		var dragObjSizeHeight=_self.getBoundingClientRect().bottom-_self.getBoundingClientRect().top;
 
		_edge.w=edgeSizeWidth-dragObjSizeWidth;
		_edge.h=edgeSizeHeight-dragObjSizeHeight;
 
	} else {//无边界元素，在页面自由移动
		if(!_self.style.top) {_self.style.top = _self.getBoundingClientRect().top + getScrollOffsets().y + "px"}
		if(!_self.style.left) {_self.style.left = _self.getBoundingClientRect().left + getScrollOffsets().x + "px"}
		if(!_self.style.position || _self.style.position!="absolute" ) _self.style.position="absolute"; 
		if(!_self.style.display || _self.style.display=="inline") _self.style.display="block";
		var _edge=document.body;
	}
 
 
	_self.mousePosition= function(ev){ 
		ev = ev || window.event;
		var target = ev.target || ev.srcElement; // 获得事件源
		if(ev.pageX || ev.pageY){ 
			return {x:ev.pageX, y:ev.pageY}; 
		} 
		return { 
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
			y:ev.clientY + document.body.scrollTop - document.body.clientTop 
		}; 
	}
 
	_self.onmousedown=function(ev){
 
		ev = ev || window.event;
		var startY=_self.mousePosition(ev).y-parseInt(_self.style.top);
		var startX=_self.mousePosition(ev).x-parseInt(_self.style.left);
 
		if (ev && ev.preventDefault) {//阻止事件传播冒泡
			ev.stopPropagation();
		}else if (document.all){
			ev.cancelBubble=true;
		}
 
		_self.onmousemove=function(ev){
			ev = ev || window.event;
 
			var poX=_self.mousePosition(ev).x-startX;
			var poY=_self.mousePosition(ev).y-startY;
			if(objEdge){
				if(poX<0) poX=0;
				if(poX>_edge.w) { poX=_edge.w; }
				if(poY<0) poY=0;
				if(poY>_edge.h) { poY=_edge.h; }
			}
			_self.style.left=poX+"px";
			_self.style.top=poY+"px";
 
			if (ev && ev.preventDefault) {//阻止默认事件,比如图片拖动问题
				ev.preventDefault();
			}else if (document.all){
				ev.returnValue = false;
			}
 
		}
 
		_self.onmouseout=function(ev){//如果鼠标移出了物件，用文档接受鼠标事件
			document.onmousemove = _self.onmousemove;
		}
 
		document.onmouseup=function(){//放开鼠标，释放所有相关事件
			_self.onmousemove=null;
			document.onmousemove=null;
			_self.onmouseout=null;
		}
 
	}
 
}
