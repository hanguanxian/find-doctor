(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 	var $ = require("jquery");
 	var jq_cookie = require("jq-cookie");
 	/*-----------------------------微信登录函数-------------------------------*/
 	function doWechatTokenLogin(wechatLoginCallback) {
		var wechatToken = getUrlParam().wechatToken || storage.get('wechatToken');
		if(!wechatToken){
			return;
		}

		storage.set('wechatToken',wechatToken);

		var user = storage.get('user');
		var userId = storage.get('userId');

		// if user has logining, then return
		if(user && userId){
			return;
		}

		// if do once, then return;
		if(storage.get('hasDoWechatTokenLogin')){
			return;
		}

		storage.set('hasDoWechatTokenLogin',true);

		$.ajax({
			type :'post',
			url : '/api/auth/wechat',
			data : wechatToken,
			dataType : 'json',
			contentType:'application/json',
			async:false,
			success:function(successRtnData){
				storage.set('user', successRtnData);
		        storage.set('userId', successRtnData.userId);
		        if(wechatLoginCallback){
		        	wechatLoginCallback();
		        }
			},
			error:function(errorRtnData){
				console.log(errorRtnData);
			}
		})
	}

 	/*-----------------------------	新：微信登录函数-------------------------------*/
 	function doOpenTokenLogin(callBack) {
		var openToken = storage.get("openToken");
		$.ajax({
			type :'post',
			url : '/api/auth/wechat-opentoken',
			data : openToken,
			dataType : 'json',
			contentType:'application/json',
			async:false,
			success:function(data){
				storage.set("userId",data.userId);
				storage.set("ifDoroLogin",data.isLogin);
				storage.set("actToken",data.actToken);
		        if(callBack){
		        	callBack();
		        }
			},
			error:function(errorRtnData){
				console.log(errorRtnData);
			}
		})
	}

 	/*-----------------------------获取url参数后面的字符串方法-------------------------------*/
	 function getUrlParam() {
	     var result = new Object();
	     var url = window.location.search;
	     if(url.indexOf('?')!=-1){
	         var str = url.substr(1);
	         var strs = str.split("&");
	         for(var i=0; i< strs.length; i++){
	             var key = strs[i].split('=')[0];
	             var value = strs[i].split('=')[1];
	             result[key] = value;
	         }
	         return result;
	     } else {
	    	 return {};
	     }
	 }

	/*-----------------------------获取url参数后面的from字符串-------------------------------*/
	function getFromUrl(){
		 var from = getUrlParam().from;
		 if(from != null){
			 return decodeURIComponent(from);
		 }
		 return null;
	 }

	/*-----------------------------seesionStorage存储封装-------------------------------*/
	 var storage = new function(){
		 this.get = function(key){
			 var raw = sessionStorage[key];
			 if(raw != null){
				 return JSON.parse(raw);
			 }
			 return null;
		 };
		 this.set = function(key, val){
			 if(val != null){
				 sessionStorage[key] = JSON.stringify(val);
			 } else {
				 sessionStorage[key] = null;
			 }
		 };

	 };

	/*-----------------------------验证码重发-------------------------------*/
	var sendMsgTxt = new function () {
		this.show = function(setTxt){

			var timer = null;
			var leftSecond = 60;
			var prop = true;
			var defaultBg = false;
			setTxt(leftSecond+'s',prop,defaultBg);
			timer = setInterval(setRemainTime, 1000);

			function setRemainTime() {
				if (leftSecond > 0) {
					prop = true;
					defaultBg = false;
					setTxt(leftSecond+'s',prop,defaultBg);
					leftSecond--;
				}
				else{
					clearInterval(timer);
					prop = false;
					defaultBg = true;
					setTxt('重发',prop,defaultBg);
				}
			}
		}

	}

	/*-----------------------------日期格式化-------------------------------*/
	Date.prototype.format = function(fmt) {
	  var o = {
	    "M+" : this.getMonth()+1,                 //月份
	    "d+" : this.getDate(),                    //日
	    "h+" : this.getHours(),                   //小时
	    "m+" : this.getMinutes(),                 //分
	    "s+" : this.getSeconds(),                 //秒
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度
	    "S"  : this.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt))
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  for(var k in o)
	    if(new RegExp("("+ k +")").test(fmt))
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	  return fmt;
	}

	/*-----------------------------获取自定义格式时间-------------------------------*/
	function formatDate(val,format){
		try{
			var date = new Date(val);
			var res = date.format(format);
			return res;
		}catch(e){
			//TODO handle the exception
			console.log(e);
			return "";
		}
	}

	/*-----------------------------输出框验证-------------------------------*/
	var checkInput=new function(){
		this.validatePhoneNum=function(obj, errorId,defaultBg,disabledBg) {//手机号码验证
			var $this = obj;
			if (/^1[3|4|5|6|7|8]\d{9}$/.test($this)) {
				$("#" + errorId).css("background", defaultBg).css("color","#ffffff").removeAttr("disabled");
				return true;
			} else {
				$("#" + errorId).css("background", disabledBg).css("color","#fff").attr("disabled",true);
				return false;
			}
		}
		this.validatePassword=function(obj, errorId,defaultBg,disabledBg) {
			var $this = obj;
			if (/^(\w){6,16}$/.test($this)) {
				$("#" + errorId).css("background", defaultBg).css("color","#ffffff").removeAttr("disabled");
				return true;
			} else {
				$("#" + errorId).css("background", disabledBg).css("color","#fff").attr("disabled",true);
				return false;
			}
		}
		this.validateIDNumber=function(obj, errorId) {
			var $this = obj;
			if (/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($this)) {
				$("#" + errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
				return true;
			} else {
				$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
				return false;
			}
		}
		this.validateAmountNum=function(obj,errorId){
			if(obj==''|| obj==null || (!(/(^[1-9]\d*$)/.test(obj))) || parseInt(obj)<100){
				$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
				return false;
			}else{
				$("#" + errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
				return true;
			}
		}
		this.validateIdentityCard=function(obj, errorId,defaultBg,disabledBg){//身份证号码验证
			var $this = obj;
			if (/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($this)) {
				$("#" + errorId).css("background", defaultBg).removeAttr("disabled");
				return true;
			} else {
				$("#" + errorId).css("background", disabledBg).attr("disabled",true);
				return false;
			}
		}
		this.validateName=function(obj, errorId,defaultBg,disabledBg){//姓名验证
			var $this = obj;
			var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'\"。，、？%+_]");

			if (pattern.test($this)) {
				$("#" + errorId).css("background", defaultBg).removeAttr("disabled");
				return false;
			} else {
				$("#" + errorId).css("background", disabledBg).attr("disabled",true);
				return true;
			}
		}
		this.combinedCheck=function(a,b,c,d,errorId,defaultBg,disabledBg){
			if(a && b && c & d){
				$("#"+errorId).css("background", defaultBg).css("color","#ffffff").removeAttr("disabled");
			}else{
				$("#" + errorId).css("background", disabledBg).css("color","#fff").attr("disabled",true);
			}
		}
	}



	/*--------------------隐藏手机号码中间四位----------------------*/
	var enycryptPhoneNum = function(phone){
		/*var phoneNum = phone.toString();
		var startIndex = 3;
		var endIndex = 7;
		var newPhone = phoneNum.replace(phoneNum.substring(startIndex,endIndex),'****');*/
		if(!phone){
			return phone;
		}
		if(typeof(phone) == "number"){
			phone = phone + "";
		}
		var mobileArray = phone.split('');
		mobileArray.splice(3, 4, '****');
		var newPhone  =mobileArray.join('');

		return newPhone;
	}

	var enycryptIdCardNum = function(idCard){
		if (!idCard) {
			return false;
		}else{
			return idCard.replace(idCard.substr(3,11), "***********");
		}
	}


	/*--------------------获取当前运行设备信息----------------------*/
	function getDeviceinfo() {
		var u = navigator.userAgent,
		app = navigator.appVersion;
		var result = {};
		result.trident = u.indexOf('Trident') > -1, //IE内核
		result.presto = u.indexOf('Presto') > -1, //opera内核
		result.gecko = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
		result.mobile = !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
		result.ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		result.android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,//安卓终端
		result.iPhone = u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
		result.iPad = u.indexOf('iPad') > -1, //是否iPad
		result.webApp = u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		result.language = (navigator.browserLanguage || navigator.language).toLowerCase();

		if (result.mobile) {//判断是否是移动设备打开。browser代码在下面
		  var ua = u.toLowerCase();//获取判断用的对象
		  if (ua.match(/MicroMessenger/i) == "micromessenger") {
		    //在微信中打开
		    result.wechat = true;
		  }
		  if (ua.match(/WeiBo/i) == "weibo") {
		    //在新浪微博客户端打开
		    result.sina = true;
		  }
		  if (ua.match(/QQ/i) == "qq") {
		    //在QQ空间打开
		    result.qq = true;
		  }
		} else {
		  //否则就是PC浏览器打开
		   result.pc = true;
		}
		return result;
	}


	/*--------------------js数字乘法----------------------*/
	function accMul(arg1, arg2) {

		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();

		try {
			m += s1.split(".")[1].length
		} catch(e) {

		}

		try {
			m += s2.split(".")[1].length
		} catch(e) {

		}

		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)

	}

	/*--------------------微信：根据URL获取Token信息----------------------*/
	function setWxInfo(){
		var param = getUrlParam();
		try{
			var openToken = param.openToken;
			var wechatToken = param.wechatToken;
			var inviterInfo = param.msg;
			inviterInfo = decodeURIComponent(inviterInfo);
			var shareToken = inviterInfo.split(":")[1];
			storage.set("shareToken",shareToken);
			inviterInfo = {
				"shareToken":shareToken
			}

			if (openToken) {
				storage.set("openToken",openToken);
			}
			if (wechatToken) {
				storage.set("wechatToken",wechatToken);
			}

			storage.set("inviterInfo",inviterInfo);
		}
		catch(e){
			//if(debugSignal) alert("配置微信用户信息失败");
			alert("配置微信用户信息失败");
		}
	}

	/*--------------------微信（新）：根据URL获取Token信息----------------------*/
	function setWxInfo2(){
		var param = getUrlParam();
		try{
			var openToken = param.openToken;
			var inviterInfo = param.msg;
			inviterInfo = decodeURIComponent(inviterInfo);
			var shareToken = inviterInfo.split(":")[1];
			storage.set("shareToken",shareToken);
			inviterInfo = {
				"shareToken":shareToken
			}
			if (openToken) {
				storage.set("openToken",openToken);
			}
			storage.set("inviterInfo",inviterInfo);

			doOpenTokenLogin();
		}
		catch(e){
			//if(debugSignal) alert("配置微信用户信息失败");
			alert("配置微信Token信息失败");
		}
	}

	/*--------------------微信：获取签名信息----------------------*/
	function wx_auth(init){
		$.ajax({
			url : "/api/wechat-jsapi/jsapi?url="+encodeURIComponent(window.location.href),
			type : "get",
			dataType : "JSON",
			success : function(data) {
				//storage.set("oauth2redirectUri",data.oauth2redirectUri);
				//storage.set("appId",data.appid);
				if(init){
					init(data);//可配置wx.ready等一系列参数
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if(textStatus == 'timeout'){
					alert("获取微信签名失败：网络超时!");
				}else{
					alert("获取微信签名失败："+textStatus+","+XMLHttpRequest.status+","+XMLHttpRequest.statusText+","+XMLHttpRequest.responseText);
				}
			},
		});
	}

	/*--------------------生成uuid----------------------*/
	function uuid(key,value) {
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";

	    var uuid = s.join("");
	    var uuidKey = new Object();
	    uuidKey.key = key;
	    uuidKey.value = value;
	    storage.set("uuidKey",uuidKey);

	    return uuid;
	}

	/*--------------------error code static for share----------------------*/
	var CODE_AlREADYPLAY = "UZ0009";
	var CODE_TOPFLOOR = "UZ1002";
	var CODE_SESSIONTIMEOUT = "UG2001";
	var CODE_NOPLANNER = "PU0001";

	/*--------------------禁止页面滚动----------------------*/
	var preventScroll = false;
	document.addEventListener("touchmove",function(e){
		if(preventScroll){
			e.preventDefault();
			e.stopPropagation();
		}
	},false);

	/*--------------------输出OBJ对象----------------------*/
	function alertObj(obj){
	 	var description = "";
	 	for(var i in obj){
	  		var property=obj[i];
	  		description+=i+" = "+property+"\n";
	 	}
	 	alert(description);
	}


	/*-----------------------------数字标准化-------------------------------*/
	function NumberFixed(num, fixedVal){
		if(!fixedVal&&fixedVal!=0) fixedVal = 2;
		var newFixedVal = fixedVal + 6;
		if(typeof(num) != "number"){
			num -= 0;
		}
		var newNum = num.toFixed(newFixedVal);
		if(fixedVal == 0){
			return newNum.substring(0, newNum.lastIndexOf('.') + newFixedVal-6);
		}
		return newNum.substring(0, newNum.lastIndexOf('.') + newFixedVal-5);
	}

	/*--------------------数字千分位----------------------*/
	function moneyFormat(money,fix) {
		var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
		var n = NumberFixed(money,fix);
		if(!fix&&fix!=0){
			fix = 2;
		}else if(fix === 0){
			n = NumberFixed(money,2);
			return (n.replace(re, "$1,")).split(".")[0];//不带小数点
		}

		return n.replace(re, "$1,");
	}
	/*--------------------利率转化----------------------*/
	function rateFormat(rate,fix){
		if(!fix) fix = 2;
		var rateFix = accMul(rate-0,100);
		return NumberFixed(rateFix,fix);
	}

	function showDialog(objId) {
	    $("#" + objId).show();
	}

	function hideDialog(objId) {
	    $("#" + objId).hide();
	}


	/*--------------------对象转字符串----------------------*/
	function _toString (val) {
	  return val == null
	    ? ''
	    : typeof val === 'object'
	      ? JSON.stringify(val, null, 2)
	      : String(val)
	}

	/*--------------------注册摇一摇事件----------------------*/
	function regDeviceShake(callback){
		window.addEventListener('devicemotion', function(event){
			deviceMotionHandler(event);
		}, false);

		//获取加速度信息
		//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
		//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
        var SHAKE_THRESHOLD = 6000;
        var last_update = 0;
        var x, y, z, last_x = 0, last_y = 0, last_z = 0;

        function deviceMotionHandler(eventData) {
            var acceleration =eventData.accelerationIncludingGravity;
            var curTime = new Date().getTime();
            if ((curTime-last_update)> 10) {
                var diffTime = curTime -last_update;
                last_update = curTime;
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
                if (speed > SHAKE_THRESHOLD) {
                	callback();
                }
                last_x = x;
                last_y = y;
                last_z = z;
            }
        }
	}

	function addLoadingMask(){
		var dom = '<div class="commonMask" id="commonMask" onclick="$(\'body\').css(\'overflow-y\',\'auto\');$(\'#commonMask\').hide();"><p class="loadingText">请求中...</p></div>'
		var ifDom = $("#commonMask").length > 0;
		if(ifDom){
			$("#commonMask").show();
		}
		else{
			$("body").append(dom);
		}
		$("body").css("overflow-y","hidden");
	}


	function myAjax(option,successCallback,handlError){

		var cookie = $.cookie('appToken');
		//var cookie = '3fd370aa-245c-4aa0-9c8b-1c9c62023adc';
		if(cookie){
			$.cookie('SESSION', cookie, {domain: window.location.hostname,path:"/"});
			$.cookie('appToken','');
		}

		/*option.headers = {
	        "yuanma-token": cookie.split("yuanmatoken")[1].split("=")[1].split(";")[0]
	    }*/
		if(!option.contentTyp){
			option.contentType = "application/json; charset=utf-8";
		}
		if(!option.dataType){
			option.dataType = "JSON";
		}
		option.success = function(data){
			successCallback(data);
		};
		option.error = function(data){
			var e = eval('('+data.responseText+')');
				if(e.error.code == CODE_SESSIONTIMEOUT){
					 window.location.href = window.location.origin + "/neo-bank-h5/html/user/login.html";
				}
				else{
					if(handlError){
						if(e.error.code == 'QR0001'){//二维码失效
							alert('二维码已失效,请刷新页面重试');
							return;
						}
						handlError(e.error.message);
					}
					else{
						alert(e.error.message);
					}
			}
		}
		$.ajax(option);
	}

	function login_app_h5(){//h5模拟登录
		var option = {
			url : "/api/auth",
			type : "POST",
			dataType : "JSON",
			data : JSON.stringify({
				mobile : "18717958245",
				password : "123456"
			})
		};
		var successCallBack = function(data){
    	}
		myAjax(option,successCallBack);
	}

	function bankCardFormat(cardNum){//银行卡号加密格式化
		var obj = cardNum.split('');
		for(var i = 0; i < cardNum.length; i++){
			if(i < cardNum.length - 4){
				if((i+1) % 4 == 0){
					obj.splice(i,1,'* ');
				}else{
					obj.splice(i,1,'*');
				}
			}else{
				if(i % 4 == 0){
					obj.splice(i,0,' ');
				}
			}
		}
		var objStr = obj.join('');
		return objStr;
	}

	function returnParams_app(paramsObj,param1,param2,param3){//给APP传参,iOS传参形式为一个拼接好的对象
		if(getDeviceinfo().ios){
			window.webkit.messageHandlers.result.postMessage(paramsObj);
		}else if(getDeviceinfo().android){
			window.sh.result(param1,param2,param3);
		}
	}

	module.exports = {
		getUrlParam:getUrlParam,
		getFromUrl:getFromUrl,
		storage:storage,
		sendMsgTxt:sendMsgTxt,
		formatDate:formatDate,
		checkInput:checkInput,
		enycryptPhoneNum:enycryptPhoneNum,
		enycryptIdCardNum:enycryptIdCardNum,
		getDeviceinfo:getDeviceinfo,
		accMul:accMul,
		setWxInfo:setWxInfo,
		wx_auth:wx_auth,
		uuid:uuid,
		preventScroll:preventScroll,
		alertObj:alertObj,
		NumberFixed:NumberFixed,
		moneyFormat:moneyFormat,
		rateFormat:rateFormat,
		showDialog:showDialog,
		hideDialog:hideDialog,
		_toString:_toString,
		CODE_AlREADYPLAY:CODE_AlREADYPLAY,
		CODE_TOPFLOOR:CODE_TOPFLOOR,
		CODE_SESSIONTIMEOUT:CODE_SESSIONTIMEOUT,
		CODE_NOPLANNER:CODE_NOPLANNER,
		regDeviceShake:regDeviceShake,
		myAjax:myAjax,
		doWechatTokenLogin:doWechatTokenLogin,
		setWxInfo2:setWxInfo2,
		login_app_h5:login_app_h5,
		bankCardFormat:bankCardFormat,
		returnParams_app:returnParams_app
	}

},{"jq-cookie":3,"jquery":6}],2:[function(require,module,exports){
(function (global){
!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&module.exports?module.exports=e():t.echarts=e()}(this,function(){var t,e;!function(){function i(t,e){if(!e)return t;if(0===t.indexOf(".")){var i=e.split("/"),n=t.split("/"),r=i.length-1,a=n.length,o=0,s=0;t:for(var l=0;a>l;l++)switch(n[l]){case"..":if(!(r>o))break t;o++,s++;break;case".":s++;break;default:break t}return i.length=r-o,n=n.slice(s),i.concat(n).join("/")}return t}function n(t){function e(e,o){if("string"==typeof e){var s=n[e];return s||(s=a(i(e,t)),n[e]=s),s}e instanceof Array&&(o=o||function(){},o.apply(this,r(e,o,t)))}var n={};return e}function r(e,n,r){for(var s=[],l=o[r],u=0,c=Math.min(e.length,n.length);c>u;u++){var h,f=i(e[u],r);switch(f){case"require":h=l&&l.require||t;break;case"exports":h=l.exports;break;case"module":h=l;break;default:h=a(f)}s.push(h)}return s}function a(t){var e=o[t];if(!e)throw new Error("No "+t);if(!e.defined){var i=e.factory,n=i.apply(this,r(e.deps||[],i,t));"undefined"!=typeof n&&(e.exports=n),e.defined=1}return e.exports}var o={};e=function(t,e,i){o[t]={id:t,deps:e,factory:i,defined:0,exports:{},require:n(t)}},t=n("")}();var i="../core/util",n="undefined",r="ecModel",a="option",o="stroke",s="applyTransform",l="ordinal",u="getShallow",c="offset",h="parent",f="getItemGraphicEl",d="getItemModel",p="normal",v="../../util/graphic",m="retrieve",g="dataToPoint",y="concat",_="getExtent",x="contain",b="inherits",w="number",T="function",S="isArray",M="replace",C="zlevel",A="getDataParams",P="mouseout",L="splice",I="trigger",z="extend",k="remove",D="colorStops",O="update",E="create",B="getItemVisual",R="dataIndex",N="indexOf",F="length",G="ignore",V="isObject",H="animation",q="string",W="prototype",U="toLowerCase",Z="opacity",X="setStyle",j="position",Y="bottom",$="center",Q="middle",K="getHeight",J="getWidth",te="silent",ee="height",ie="getBoundingRect",ne="getFont",re="textAlign",ae="textStyle",oe="getModel",se="defaults",le="coordinateSystem",ue="getData",ce="zrender/core/util",he="require";e("echarts/chart/bar",[he,ce,"../coord/cartesian/Grid","./bar/BarSeries","./bar/BarView","../layout/barGrid","../echarts","../component/grid"],function(t){var e=t(ce);t("../coord/cartesian/Grid"),t("./bar/BarSeries"),t("./bar/BarView");var i=t("../layout/barGrid"),n=t("../echarts");n.registerLayout(e.curry(i,"bar")),n.registerVisual(function(t){t.eachSeriesByType("bar",function(t){var e=t[ue]();e.setVisual("legendSymbol","roundRect")})}),t("../component/grid")}),e("echarts/chart/line",[he,ce,"../echarts","./line/LineSeries","./line/LineView","../visual/symbol","../layout/points","../processor/dataSample","../component/grid"],function(t){var e=t(ce),i=t("../echarts"),n=i.PRIORITY;t("./line/LineSeries"),t("./line/LineView"),i.registerVisual(e.curry(t("../visual/symbol"),"line","circle","line")),i.registerLayout(e.curry(t("../layout/points"),"line")),i.registerProcessor(n.PROCESSOR.STATISTIC,e.curry(t("../processor/dataSample"),"line")),t("../component/grid")}),e("echarts/component/grid",[he,"../util/graphic",ce,"../echarts","../coord/cartesian/Grid","./axis"],function(t){var e=t("../util/graphic"),i=t(ce),n=t("../echarts");t("../coord/cartesian/Grid"),t("./axis"),n.extendComponentView({type:"grid",render:function(t){this.group.removeAll(),t.get("show")&&this.group.add(new e.Rect({shape:t[le].getRect(),style:i[se]({fill:t.get("backgroundColor")},t.getItemStyle()),silent:!0,z2:-1}))}}),n.registerPreprocessor(function(t){t.xAxis&&t.yAxis&&!t.grid&&(t.grid={})})}),e("echarts/chart/pie",[he,ce,"../echarts","./pie/PieSeries","./pie/PieView","../action/createDataSelectAction","../visual/dataColor","./pie/pieLayout","../processor/dataFilter"],function(t){var e=t(ce),i=t("../echarts");t("./pie/PieSeries"),t("./pie/PieView"),t("../action/createDataSelectAction")("pie",[{type:"pieToggleSelect",event:"pieselectchanged",method:"toggleSelected"},{type:"pieSelect",event:"pieselected",method:"select"},{type:"pieUnSelect",event:"pieunselected",method:"unSelect"}]),i.registerVisual(e.curry(t("../visual/dataColor"),"pie")),i.registerLayout(e.curry(t("./pie/pieLayout"),"pie")),i.registerProcessor(e.curry(t("../processor/dataFilter"),"pie"))}),e("echarts/component/title",[he,"../echarts","../util/graphic","../util/layout"],function(t){var e=t("../echarts"),i=t("../util/graphic"),n=t("../util/layout");e.extendComponentModel({type:"title",layoutMode:{type:"box",ignoreSize:!0},defaultOption:{zlevel:0,z:6,show:!0,text:"",target:"blank",subtext:"",subtarget:"blank",left:0,top:0,backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,textStyle:{fontSize:18,fontWeight:"bolder",color:"#333"},subtextStyle:{color:"#aaa"}}}),e.extendComponentView({type:"title",render:function(t,e,r){if(this.group.removeAll(),t.get("show")){var a=this.group,o=t[oe](ae),s=t[oe]("subtextStyle"),l=t.get(re),u=t.get("textBaseline"),c=new i.Text({style:{text:t.get("text"),textFont:o[ne](),fill:o.getTextColor()},z2:10}),h=c[ie](),f=t.get("subtext"),d=new i.Text({style:{text:f,textFont:s[ne](),fill:s.getTextColor(),y:h[ee]+t.get("itemGap"),textBaseline:"top"},z2:10}),p=t.get("link"),v=t.get("sublink");c[te]=!p,d[te]=!v,p&&c.on("click",function(){window.open(p,"_"+t.get("target"))}),v&&d.on("click",function(){window.open(v,"_"+t.get("subtarget"))}),a.add(c),f&&a.add(d);var m=a[ie](),g=t.getBoxLayoutParams();g.width=m.width,g[ee]=m[ee];var y=n.getLayoutRect(g,{width:r[J](),height:r[K]()},t.get("padding"));l||(l=t.get("left")||t.get("right"),l===Q&&(l=$),"right"===l?y.x+=y.width:l===$&&(y.x+=y.width/2)),u||(u=t.get("top")||t.get(Y),u===$&&(u=Q),u===Y?y.y+=y[ee]:u===Q&&(y.y+=y[ee]/2),u=u||"top"),a.attr(j,[y.x,y.y]);var _={textAlign:l,textVerticalAlign:u};c[X](_),d[X](_),m=a[ie]();var x=y.margin,b=t.getItemStyle(["color",Z]);b.fill=t.get("backgroundColor");var w=new i.Rect({shape:{x:m.x-x[3],y:m.y-x[0],width:m.width+x[1]+x[3],height:m[ee]+x[0]+x[2]},style:b,silent:!0});i.subPixelOptimizeRect(w),a.add(w)}}})}),e("echarts/component/legend",[he,"./legend/LegendModel","./legend/legendAction","./legend/LegendView","../echarts","./legend/legendFilter"],function(t){t("./legend/LegendModel"),t("./legend/legendAction"),t("./legend/LegendView");var e=t("../echarts");e.registerProcessor(t("./legend/legendFilter"))}),e("echarts/component/tooltip",[he,"./tooltip/TooltipModel","./tooltip/TooltipView","../echarts"],function(t){t("./tooltip/TooltipModel"),t("./tooltip/TooltipView"),t("../echarts").registerAction({type:"showTip",event:"showTip",update:"tooltip:manuallyShowTip"},function(){}),t("../echarts").registerAction({type:"hideTip",event:"hideTip",update:"tooltip:manuallyHideTip"},function(){})}),e("echarts/echarts",[he,"zrender/core/env","./model/Global","./ExtensionAPI","./CoordinateSystem","./model/OptionManager","./model/Component","./model/Series","./view/Component","./view/Chart","./util/graphic","./util/model","./util/throttle","zrender",ce,"zrender/tool/color","zrender/mixin/Eventful","zrender/core/timsort","./visual/seriesColor","./preprocessor/backwardCompat","./loading/default","./data/List","./model/Model","./util/number","./util/format","zrender/core/matrix","zrender/core/vector"],function(t){function e(t){return function(e,i,n){e=e&&e[U](),me[W][t].call(this,e,i,n)}}function i(){me.call(this)}function n(t,e,n){function r(t,e){return t.prio-e.prio}n=n||{},typeof e===q&&(e=Fe[e]),this.id,this.group,this._dom=t;var a=this._zr=de.init(t,{renderer:n.renderer||"canvas",devicePixelRatio:n.devicePixelRatio,width:n.width,height:n[ee]});this._throttledZrFlush=fe.throttle(pe.bind(a.flush,a),17),this._theme=pe.clone(e),this._chartsViews=[],this._chartsMap={},this._componentsViews=[],this._componentsMap={},this._api=new Z(this),this._coordSysMgr=new j,me.call(this),this._messageCenter=new i,this._initEvents(),this.resize=pe.bind(this.resize,this),this._pendingActions=[],ge(Ne,r),ge(Be,r),a[H].on("frame",this._onframe,this)}function r(t,e,i){var n,r=this._model,a=this._coordSysMgr.getCoordinateSystems();e=he.parseFinder(r,e);for(var o=0;o<a[F];o++){var s=a[o];if(s[t]&&null!=(n=s[t](r,e,i)))return n}}function a(t,e,i,n,r){var a=t._model,o={};o[n+"Id"]=i[n+"Id"],o[n+"Index"]=i[n+"Index"],o[n+"Name"]=i[n+"Name"];var s={mainType:n,query:o};r&&(s.subType=r),a&&a.eachComponent(s,function(r){var o=t["series"===n?"_chartsMap":"_componentsMap"][r.__viewId];o&&o.__alive&&o[e](r,a,t._api,i)},t)}function o(t,e){var i=t.type,n=Oe[i],r=n.actionInfo,o=(r[O]||O).split(":"),s=o.pop();o=o[0]&&_e(o[0]),this[Ae]=!0;var l=[t],u=!1;t.batch&&(u=!0,l=pe.map(t.batch,function(e){return e=pe[se](pe[z]({},e),t),e.batch=null,e}));for(var c,h=[],f="highlight"===i||"downplay"===i,d=0;d<l[F];d++){var p=l[d];c=n.action(p,this._model),c=c||pe[z]({},p),c.type=r.event||c.type,h.push(c),f?a(this,s,p,"series"):o&&a(this,s,p,o.main,o.sub)}"none"===s||f||o||(this[Le]?(ke.prepareAndUpdate.call(this,t),this[Le]=!1):ke[s].call(this,t)),c=u?{type:r.event||i,batch:h}:h[0],this[Ae]=!1,!e&&this._messageCenter[I](c.type,c)}function s(t){for(var e=this._pendingActions;e[F];){var i=e.shift();o.call(this,i,t)}}function l(t){!t&&this[I]("updated")}function u(t,e,i){var n=this._api;ye(this._componentsViews,function(r){var a=r.__model;r[t](a,e,n,i),y(a,r)},this),e.eachSeries(function(r){var a=this._chartsMap[r.__viewId];a[t](r,e,n,i),y(r,a),g(r,a)},this),m(this._zr,e)}function c(t,e){for(var i="component"===t,n=i?this._componentsViews:this._chartsViews,r=i?this._componentsMap:this._chartsMap,a=this._zr,o=0;o<n[F];o++)n[o].__alive=!1;e[i?"eachComponent":"eachSeries"](function(t,o){if(i){if("series"===t)return}else o=t;var s=o.id+"_"+o.type,l=r[s];if(!l){var u=_e(o.type),c=i?ne.getClass(u.main,u.sub):re.getClass(u.sub);if(!c)return;l=new c,l.init(e,this._api),r[s]=l,n.push(l),a.add(l.group)}o.__viewId=s,l.__alive=!0,l.__id=s,l.__model=o},this);for(var o=0;o<n[F];){var s=n[o];s.__alive?o++:(a[k](s.group),s.dispose(e,this._api),n[L](o,1),delete r[s.__id])}}function h(t,e){ye(Be,function(i){i.func(t,e)})}function f(t){var e={};t.eachSeries(function(t){var i=t.get("stack"),n=t[ue]();if(i&&"list"===n.type){var r=e[i];r&&(n.stackedOn=r),e[i]=n}})}function d(t,e){var i=this._api;ye(Ne,function(n){n.isLayout&&n.func(t,i,e)})}function p(t,e,i){var n=this._api;t.clearColorPalette(),t.eachSeries(function(t){t.clearColorPalette()}),ye(Ne,function(r){(!i||!r.isLayout)&&r.func(t,n,e)})}function v(t,e){var i=this._api;ye(this._componentsViews,function(n){var r=n.__model;n.render(r,t,i,e),y(r,n)},this),ye(this._chartsViews,function(t){t.__alive=!1},this),t.eachSeries(function(n){var r=this._chartsMap[n.__viewId];r.__alive=!0,r.render(n,t,i,e),r.group[te]=!!n.get(te),y(n,r),g(n,r)},this),m(this._zr,t),ye(this._chartsViews,function(e){e.__alive||e[k](t,i)},this)}function m(t,e){var i=t.storage,n=0;i.traverse(function(t){t.isGroup||n++}),n>e.get("hoverLayerThreshold")&&!x.node&&i.traverse(function(t){t.isGroup||(t.useHoverLayer=!0)})}function g(t,e){var i=0;e.group.traverse(function(t){"group"===t.type||t[G]||i++});var n=+t.get("progressive"),r=i>t.get("progressiveThreshold")&&n&&!x.node;r&&e.group.traverse(function(t){t.isGroup||(t.progressive=r?Math.floor(i++/n):-1,r&&t.stopAnimation(!0))});var a=t.get("blendMode")||null;e.group.traverse(function(t){t.isGroup||t[X]("blend",a)})}function y(t,e){var i=t.get("z"),n=t.get(C);e.group.traverse(function(t){"group"!==t.type&&(null!=i&&(t.z=i),null!=n&&(t[C]=n))})}function _(t){function e(t,e){for(var i=0;i<t[F];i++){var n=t[i];n[a]=e}}var i=0,n=1,r=2,a="__connectUpdateStatus";pe.each(Ee,function(o,s){t._messageCenter.on(s,function(o){if(He[t.group]&&t[a]!==i){var s=t.makeActionFromEvent(o),l=[];pe.each(Ve,function(e){e!==t&&e.group===t.group&&l.push(e)}),e(l,i),ye(l,function(t){t[a]!==n&&t.dispatchAction(s)}),e(l,r)}})})}var x=t("zrender/core/env"),M=t("./model/Global"),Z=t("./ExtensionAPI"),j=t("./CoordinateSystem"),$=t("./model/OptionManager"),Q=t("./model/Component"),ie=t("./model/Series"),ne=t("./view/Component"),re=t("./view/Chart"),ae=t("./util/graphic"),he=t("./util/model"),fe=t("./util/throttle"),de=t("zrender"),pe=t(ce),ve=t("zrender/tool/color"),me=t("zrender/mixin/Eventful"),ge=t("zrender/core/timsort"),ye=pe.each,_e=Q.parseClassType,xe=1e3,be=5e3,we=1e3,Te=2e3,Se=3e3,Me=4e3,Ce=5e3,Ae="__flagInMainProcess",Pe="__hasGradientOrPatternBg",Le="__optionUpdated",Ie=/^[a-zA-Z0-9_]+$/;i[W].on=e("on"),i[W].off=e("off"),i[W].one=e("one"),pe.mixin(i,me);var ze=n[W];ze._onframe=function(){if(this[Le]){var t=this[Le][te];this[Ae]=!0,ke.prepareAndUpdate.call(this),this[Ae]=!1,this[Le]=!1,s.call(this,t),l.call(this,t)}},ze.getDom=function(){return this._dom},ze.getZr=function(){return this._zr},ze.setOption=function(t,e,i){var n;if(pe[V](e)&&(i=e.lazyUpdate,n=e[te],e=e.notMerge),this[Ae]=!0,!this._model||e){var r=new $(this._api),a=this._theme,o=this._model=new M(null,null,a,r);o.init(null,null,a,r)}this.__lastOnlyGraphic=!(!t||!t.graphic),pe.each(t,function(t,e){"graphic"!==e&&(this.__lastOnlyGraphic=!1)},this),this._model.setOption(t,Re),i?(this[Le]={silent:n},this[Ae]=!1):(ke.prepareAndUpdate.call(this),this._zr.flush(),this[Le]=!1,this[Ae]=!1,s.call(this,n),l.call(this,n))},ze.setTheme=function(){console.log("ECharts#setTheme() is DEPRECATED in ECharts 3.0")},ze[oe]=function(){return this._model},ze.getOption=function(){return this._model&&this._model.getOption()},ze[J]=function(){return this._zr[J]()},ze[K]=function(){return this._zr[K]()},ze.getRenderedCanvas=function(t){if(x.canvasSupported){t=t||{},t.pixelRatio=t.pixelRatio||1,t.backgroundColor=t.backgroundColor||this._model.get("backgroundColor");var e=this._zr,i=e.storage.getDisplayList();return pe.each(i,function(t){t.stopAnimation(!0)}),e.painter.getRenderedCanvas(t)}},ze.getDataURL=function(t){t=t||{};var e=t.excludeComponents,i=this._model,n=[],r=this;ye(e,function(t){i.eachComponent({mainType:t},function(t){var e=r._componentsMap[t.__viewId];e.group[G]||(n.push(e),e.group[G]=!0)})});var a=this.getRenderedCanvas(t).toDataURL("image/"+(t&&t.type||"png"));return ye(n,function(t){t.group[G]=!1}),a},ze.getConnectedDataURL=function(t){if(x.canvasSupported){var e=this.group,i=Math.min,n=Math.max,r=1/0;if(He[e]){var a=r,o=r,s=-r,l=-r,u=[],c=t&&t.pixelRatio||1;pe.each(Ve,function(r){if(r.group===e){var c=r.getRenderedCanvas(pe.clone(t)),h=r.getDom().getBoundingClientRect();a=i(h.left,a),o=i(h.top,o),s=n(h.right,s),l=n(h[Y],l),u.push({dom:c,left:h.left,top:h.top})}}),a*=c,o*=c,s*=c,l*=c;var h=s-a,f=l-o,d=pe.createCanvas();d.width=h,d[ee]=f;var p=de.init(d);return ye(u,function(t){var e=new ae.Image({style:{x:t.left*c-a,y:t.top*c-o,image:t.dom}});p.add(e)}),p.refreshImmediately(),d.toDataURL("image/"+(t&&t.type||"png"))}return this.getDataURL(t)}},ze.convertToPixel=pe.curry(r,"convertToPixel"),ze.convertFromPixel=pe.curry(r,"convertFromPixel"),ze.containPixel=function(t,e){var i,n=this._model;return t=he.parseFinder(n,t),pe.each(t,function(t,n){n[N]("Models")>=0&&pe.each(t,function(t){var r=t[le];if(r&&r.containPoint)i|=!!r.containPoint(e);else if("seriesModels"===n){var a=this._chartsMap[t.__viewId];a&&a.containPoint&&(i|=a.containPoint(e,t))}},this)},this),!!i},ze.getVisual=function(t,e){var i=this._model;t=he.parseFinder(i,t,{defaultMainType:"series"});var n=t.seriesModel,r=n[ue](),a=t.hasOwnProperty("dataIndexInside")?t.dataIndexInside:t.hasOwnProperty(R)?r.indexOfRawIndex(t[R]):null;return null!=a?r[B](a,e):r.getVisual(e)};var ke={update:function(t){var e=this._model,i=this._api,n=this._coordSysMgr,r=this._zr;if(e){e.restoreData(),n[E](this._model,this._api),h.call(this,e,i),f.call(this,e),n[O](e,i),p.call(this,e,t),v.call(this,e,t);var a=e.get("backgroundColor")||"transparent",o=r.painter;if(o.isSingleCanvas&&o.isSingleCanvas())r.configLayer(0,{clearColor:a});else{if(!x.canvasSupported){var s=ve.parse(a);a=ve.stringify(s,"rgb"),0===s[3]&&(a="transparent")}a[D]||a.image?(r.configLayer(0,{clearColor:a}),this[Pe]=!0,this._dom.style.background="transparent"):(this[Pe]&&r.configLayer(0,{clearColor:null}),this[Pe]=!1,this._dom.style.background=a)}}},updateView:function(t){var e=this._model;e&&(e.eachSeries(function(t){t[ue]().clearAllVisual()}),p.call(this,e,t),u.call(this,"updateView",e,t))},updateVisual:function(t){var e=this._model;e&&(e.eachSeries(function(t){t[ue]().clearAllVisual()}),p.call(this,e,t,!0),u.call(this,"updateVisual",e,t))},updateLayout:function(t){var e=this._model;e&&(d.call(this,e,t),u.call(this,"updateLayout",e,t))},prepareAndUpdate:function(t){var e=this._model;c.call(this,"component",e),c.call(this,"chart",e),this.__lastOnlyGraphic?(ye(this._componentsViews,function(i){var n=i.__model;n&&"graphic"===n.mainType&&(i.render(n,e,this._api,t),y(n,i))},this),this.__lastOnlyGraphic=!1):ke[O].call(this,t)}};ze.resize=function(t){this[Ae]=!0,this._zr.resize(t);var e=this._model&&this._model.resetOption("media"),i=e?"prepareAndUpdate":O;ke[i].call(this),this._loadingFX&&this._loadingFX.resize(),this[Ae]=!1;var n=t&&t[te];s.call(this,n),l.call(this,n)},ze.showLoading=function(t,e){if(pe[V](t)&&(e=t,t=""),t=t||"default",this.hideLoading(),Ge[t]){var i=Ge[t](this._api,e),n=this._zr;this._loadingFX=i,n.add(i)}},ze.hideLoading=function(){this._loadingFX&&this._zr[k](this._loadingFX),this._loadingFX=null},ze.makeActionFromEvent=function(t){var e=pe[z]({},t);return e.type=Ee[t.type],e},ze.dispatchAction=function(t,e){if(pe[V](e)||(e={silent:!!e}),Oe[t.type]){if(this[Ae])return void this._pendingActions.push(t);o.call(this,t,e[te]),e.flush?this._zr.flush(!0):e.flush!==!1&&x.browser.weChat&&this._throttledZrFlush(),s.call(this,e[te]),l.call(this,e[te])}},ze.on=e("on"),ze.off=e("off"),ze.one=e("one");var De=["click","dblclick","mouseover",P,"mousemove","mousedown","mouseup","globalout","contextmenu"];ze._initEvents=function(){ye(De,function(t){this._zr.on(t,function(e){var i,n=this[oe](),r=e.target;if("globalout"===t)i={};else if(r&&null!=r[R]){var a=r.dataModel||n.getSeriesByIndex(r.seriesIndex);i=a&&a[A](r[R],r.dataType)||{}}else r&&r.eventData&&(i=pe[z]({},r.eventData));i&&(i.event=e,i.type=t,this[I](t,i))},this)},this),ye(Ee,function(t,e){this._messageCenter.on(e,function(t){this[I](e,t)},this)},this)},ze.isDisposed=function(){return this._disposed},ze.clear=function(){this.setOption({series:[]},!0)},ze.dispose=function(){if(!this._disposed){this._disposed=!0;var t=this._api,e=this._model;ye(this._componentsViews,function(i){i.dispose(e,t)}),ye(this._chartsViews,function(i){i.dispose(e,t)}),this._zr.dispose(),delete Ve[this.id]}},pe.mixin(n,me);var Oe=[],Ee={},Be=[],Re=[],Ne=[],Fe={},Ge={},Ve={},He={},qe=new Date-0,We=new Date-0,Ue="_echarts_instance_",Ze={version:"3.4.0",dependencies:{zrender:"3.3.0"}};return Ze.init=function(t,e,i){var r=new n(t,e,i);return r.id="ec_"+qe++,Ve[r.id]=r,t.setAttribute&&t.setAttribute(Ue,r.id),_(r),r},Ze.connect=function(t){if(pe[S](t)){var e=t;t=null,pe.each(e,function(e){null!=e.group&&(t=e.group)}),t=t||"g_"+We++,pe.each(e,function(e){e.group=t})}return He[t]=!0,t},Ze.disConnect=function(t){He[t]=!1},Ze.dispose=function(t){pe.isDom(t)?t=Ze.getInstanceByDom(t):typeof t===q&&(t=Ve[t]),t instanceof n&&!t.isDisposed()&&t.dispose()},Ze.getInstanceByDom=function(t){var e=t.getAttribute(Ue);return Ve[e]},Ze.getInstanceById=function(t){return Ve[t]},Ze.registerTheme=function(t,e){Fe[t]=e},Ze.registerPreprocessor=function(t){Re.push(t)},Ze.registerProcessor=function(t,e){typeof t===T&&(e=t,t=xe),Be.push({prio:t,func:e})},Ze.registerAction=function(t,e,i){typeof e===T&&(i=e,e="");var n=pe[V](t)?t.type:[t,t={event:e}][0];t.event=(t.event||n)[U](),e=t.event,pe.assert(Ie.test(n)&&Ie.test(e)),Oe[n]||(Oe[n]={action:i,actionInfo:t}),Ee[e]=n},Ze.registerCoordinateSystem=function(t,e){j.register(t,e)},Ze.registerLayout=function(t,e){typeof t===T&&(e=t,t=we),Ne.push({prio:t,func:e,isLayout:!0})},Ze.registerVisual=function(t,e){typeof t===T&&(e=t,t=Se),Ne.push({prio:t,func:e})},Ze.registerLoading=function(t,e){Ge[t]=e},Ze.extendComponentModel=function(t){return Q[z](t)},Ze.extendComponentView=function(t){return ne[z](t)},Ze.extendSeriesModel=function(t){return ie[z](t)},Ze.extendChartView=function(t){return re[z](t)},Ze.setCanvasCreator=function(t){pe.createCanvas=t},Ze.registerVisual(Te,t("./visual/seriesColor")),Ze.registerPreprocessor(t("./preprocessor/backwardCompat")),Ze.registerLoading("default",t("./loading/default")),Ze.registerAction({type:"highlight",event:"highlight",update:"highlight"},pe.noop),Ze.registerAction({type:"downplay",event:"downplay",update:"downplay"},pe.noop),Ze.List=t("./data/List"),Ze.Model=t("./model/Model"),Ze.graphic=t("./util/graphic"),Ze[w]=t("./util/number"),Ze.format=t("./util/format"),Ze.throttle=fe.throttle,Ze.matrix=t("zrender/core/matrix"),Ze.vector=t("zrender/core/vector"),Ze.color=t("zrender/tool/color"),Ze.util={},ye(["map","each","filter",N,b,"reduce","filter","bind","curry",S,"isString",V,"isFunction",z,se,"clone"],function(t){Ze.util[t]=pe[t]}),Ze.PRIORITY={PROCESSOR:{FILTER:xe,STATISTIC:be},VISUAL:{LAYOUT:we,GLOBAL:Te,CHART:Se,COMPONENT:Me,BRUSH:Ce}},Ze}),e("echarts/scale/Time",[he,ce,"../util/number","../util/format","./Interval"],function(t){var e=t(ce),i=t("../util/number"),n=t("../util/format"),r=t("./Interval"),a=r[W],o=Math.ceil,s=Math.floor,l=1e3,u=60*l,c=60*u,h=24*c,f=function(t,e,i,n){for(;n>i;){var r=i+n>>>1;t[r][2]<e?i=r+1:n=r}return i},d=r[z]({type:"time",getLabel:function(t){var e=this._stepLvl,i=new Date(t);return n.formatTime(e[0],i)},niceExtent:function(t,e,n){var r=this._extent;if(r[0]===r[1]&&(r[0]-=h,r[1]+=h),r[1]===-1/0&&1/0===r[0]){var a=new Date;r[1]=new Date(a.getFullYear(),a.getMonth(),a.getDate()),r[0]=r[1]-h}this.niceTicks(t);var l=this._interval;e||(r[0]=i.round(s(r[0]/l)*l)),n||(r[1]=i.round(o(r[1]/l)*l))},niceTicks:function(t){t=t||10;var e=this._extent,n=e[1]-e[0],r=n/t,a=p[F],l=f(p,r,0,a),u=p[Math.min(l,a-1)],c=u[2];if("year"===u[0]){var h=n/c,d=i.nice(h/t,!0);c*=d}var v=[o(e[0]/c)*c,s(e[1]/c)*c];this._stepLvl=u,this._interval=c,this._niceExtent=v},parse:function(t){return+i.parseDate(t)}});e.each([x,"normalize"],function(t){d[W][t]=function(e){return a[t].call(this,this.parse(e))}});var p=[["hh:mm:ss",1,l],["hh:mm:ss",5,5*l],["hh:mm:ss",10,10*l],["hh:mm:ss",15,15*l],["hh:mm:ss",30,30*l],["hh:mm\nMM-dd",1,u],["hh:mm\nMM-dd",5,5*u],["hh:mm\nMM-dd",10,10*u],["hh:mm\nMM-dd",15,15*u],["hh:mm\nMM-dd",30,30*u],["hh:mm\nMM-dd",1,c],["hh:mm\nMM-dd",2,2*c],["hh:mm\nMM-dd",6,6*c],["hh:mm\nMM-dd",12,12*c],["MM-dd\nyyyy",1,h],["week",7,7*h],["month",1,31*h],["quarter",3,380*h/4],["half-year",6,380*h/2],["year",1,380*h]];return d[E]=function(){return new d},d}),e("echarts/scale/Log",[he,ce,"./Scale","../util/number","./Interval"],function(t){function e(t,e){return u(t,l(e))}var i=t(ce),n=t("./Scale"),r=t("../util/number"),a=t("./Interval"),o=n[W],s=a[W],l=r.getPrecisionSafe,u=r.round,c=Math.floor,h=Math.ceil,f=Math.pow,d=Math.log,p=n[z]({type:"log",base:10,$constructor:function(){n.apply(this,arguments),this._originalScale=new a},getTicks:function(){var t=this._originalScale,n=this._extent,a=t[_]();return i.map(s.getTicks.call(this),function(i){var o=r.round(f(this.base,i));return o=i===n[0]&&t.__fixMin?e(o,a[0]):o,o=i===n[1]&&t.__fixMax?e(o,a[1]):o},this)},getLabel:s.getLabel,scale:function(t){return t=o.scale.call(this,t),f(this.base,t)},setExtent:function(t,e){var i=this.base;t=d(t)/d(i),e=d(e)/d(i),s.setExtent.call(this,t,e)},getExtent:function(){var t=this.base,i=o[_].call(this);i[0]=f(t,i[0]),i[1]=f(t,i[1]);var n=this._originalScale,r=n[_]();return n.__fixMin&&(i[0]=e(i[0],r[0])),n.__fixMax&&(i[1]=e(i[1],r[1])),i},unionExtent:function(t){this._originalScale.unionExtent(t);var e=this.base;t[0]=d(t[0])/d(e),t[1]=d(t[1])/d(e),o.unionExtent.call(this,t)},unionExtentFromData:function(t,e){this.unionExtent(t.getDataExtent(e,!0,function(t){return t>0}))},niceTicks:function(t){t=t||10;var e=this._extent,i=e[1]-e[0];if(!(1/0===i||0>=i)){var n=r.quantity(i),a=t/i*n;for(.5>=a&&(n*=10);!isNaN(n)&&Math.abs(n)<1&&Math.abs(n)>0;)n*=10;var o=[r.round(h(e[0]/n)*n),r.round(c(e[1]/n)*n)];this._interval=n,this._niceExtent=o}},niceExtent:function(t,e,i){s.niceExtent.call(this,t,e,i);var n=this._originalScale;n.__fixMin=e,n.__fixMax=i}});return i.each([x,"normalize"],function(t){p[W][t]=function(e){return e=d(e)/d(this.base),o[t].call(this,e)}}),p[E]=function(){return new p},p}),e(ce,[he],function(){function t(e){if(null==e||"object"!=typeof e)return e;var i=e,n=O.call(e);if("[object Array]"===n){i=[];for(var r=0,a=e[F];a>r;r++)i[r]=t(e[r])}else if(D[n])i=e.constructor.from(e);else if(!k[n]&&!C(e)){i={};for(var o in e)e.hasOwnProperty(o)&&(i[o]=t(e[o]))}return i}function e(i,n,r){if(!S(n)||!S(i))return r?t(n):i;for(var a in n)if(n.hasOwnProperty(a)){var o=i[a],s=n[a];!S(s)||!S(o)||_(s)||_(o)||C(s)||C(o)||M(s)||M(o)?!r&&a in i||(i[a]=t(n[a],!0)):e(o,s,r)}return i}function i(t,i){for(var n=t[0],r=1,a=t[F];a>r;r++)n=e(n,t[r],i);return n}function n(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}function r(t,e,i){for(var n in e)e.hasOwnProperty(n)&&(i?null!=e[n]:null==t[n])&&(t[n]=e[n]);return t}function a(){return document.createElement("canvas")}function o(){return z||(z=U.createCanvas().getContext("2d")),z}function s(t,e){if(t){if(t[N])return t[N](e);for(var i=0,n=t[F];n>i;i++)if(t[i]===e)return i}return-1}function l(t,e){function i(){}var n=t[W];i[W]=e[W],t[W]=new i;for(var r in n)t[W][r]=n[r];t[W].constructor=t,t.superClass=e}function u(t,e,i){t=W in t?t[W]:t,e=W in e?e[W]:e,r(t,e,i)}function c(t){return t?typeof t==q?!1:typeof t[F]==w:void 0}function h(t,e,i){if(t&&e)if(t.forEach&&t.forEach===B)t.forEach(e,i);else if(t[F]===+t[F])for(var n=0,r=t[F];r>n;n++)e.call(i,t[n],n,t);else for(var a in t)t.hasOwnProperty(a)&&e.call(i,t[a],a,t)}function f(t,e,i){if(t&&e){if(t.map&&t.map===V)return t.map(e,i);for(var n=[],r=0,a=t[F];a>r;r++)n.push(e.call(i,t[r],r,t));return n}}function d(t,e,i,n){if(t&&e){if(t.reduce&&t.reduce===H)return t.reduce(e,i,n);for(var r=0,a=t[F];a>r;r++)i=e.call(n,i,t[r],r,t);return i}}function p(t,e,i){if(t&&e){if(t.filter&&t.filter===R)return t.filter(e,i);for(var n=[],r=0,a=t[F];a>r;r++)e.call(i,t[r],r,t)&&n.push(t[r]);return n}}function v(t,e,i){if(t&&e)for(var n=0,r=t[F];r>n;n++)if(e.call(i,t[n],n,t))return t[n]}function m(t,e){var i=G.call(arguments,2);return function(){return t.apply(e,i[y](G.call(arguments)))}}function g(t){var e=G.call(arguments,1);return function(){return t.apply(this,e[y](G.call(arguments)))}}function _(t){return"[object Array]"===O.call(t)}function x(t){return typeof t===T}function b(t){return"[object String]"===O.call(t)}function S(t){var e=typeof t;return e===T||!!t&&"object"==e}function M(t){return!!k[O.call(t)]}function C(t){return"object"==typeof t&&typeof t.nodeType===w&&"object"==typeof t.ownerDocument}function A(t){return t!==t}function P(){for(var t=0,e=arguments[F];e>t;t++)if(null!=arguments[t])return arguments[t]}function L(){return Function.call.apply(G,arguments)}function I(t,e){if(!t)throw new Error(e)}var z,k={"[object Function]":1,"[object RegExp]":1,"[object Date]":1,"[object Error]":1,"[object CanvasGradient]":1,"[object CanvasPattern]":1,"[object Image]":1,"[object Canvas]":1},D={"[object Int8Array]":1,"[object Uint8Array]":1,"[object Uint8ClampedArray]":1,"[object Int16Array]":1,"[object Uint16Array]":1,"[object Int32Array]":1,"[object Uint32Array]":1,"[object Float32Array]":1,"[object Float64Array]":1},O=Object[W].toString,E=Array[W],B=E.forEach,R=E.filter,G=E.slice,V=E.map,H=E.reduce,U={inherits:l,mixin:u,clone:t,merge:e,mergeAll:i,extend:n,defaults:r,getContext:o,createCanvas:a,indexOf:s,slice:L,find:v,isArrayLike:c,each:h,map:f,reduce:d,filter:p,bind:m,curry:g,isArray:_,isString:b,isObject:S,isFunction:x,isBuildInObject:M,isDom:C,eqNaN:A,retrieve:P,assert:I,noop:function(){}};return U}),e("echarts/chart/line/LineSeries",[he,"../helper/createListFromArray","../../model/Series"],function(t){var e=t("../helper/createListFromArray"),i=t("../../model/Series");return i[z]({type:"series.line",dependencies:["grid","polar"],getInitialData:function(t,i){return e(t.data,this,i)},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,hoverAnimation:!0,clipOverflow:!0,label:{normal:{position:"top"}},lineStyle:{normal:{width:2,type:"solid"}},step:!1,smooth:!1,smoothMonotone:null,symbol:"emptyCircle",symbolSize:4,symbolRotate:null,showSymbol:!0,showAllSymbol:!1,connectNulls:!1,sampling:"none",animationEasing:"linear",progressive:0,hoverLayerThreshold:1/0}})}),e("echarts/coord/cartesian/Grid",[he,"exports","../../util/layout","../../coord/axisHelper",ce,"./Cartesian2D","./Axis2D","./GridModel","../../CoordinateSystem"],function(t){function e(t,e){return t.getCoordSysModel()===e}function i(t){var e,i=t.model,n=i.getFormattedLabels(),r=i[oe]("axisLabel.textStyle"),a=1,o=n[F];o>40&&(a=Math.ceil(o/40));for(var s=0;o>s;s+=a)if(!t.isLabelIgnored(s)){var l=r.getTextRect(n[s]);e?e.union(l):e=l}return e}function n(t,e,i){this._coordsMap={},this._coordsList=[],this._axesMap={},this._axesList=[],this._initCartesian(t,e,i),this._model=t}function r(t,e){var i=t[_](),n=i[0]+i[1];t.toGlobalCoord="x"===t.dim?function(t){return t+e}:function(t){return n-t+e},t.toLocalCoord="x"===t.dim?function(t){return t-e}:function(t){return n-t+e}}function a(t){return u.map(m,function(e){var i=t.getReferringComponents(e)[0];return i})}function o(t){return"cartesian2d"===t.get(le)}var s=t("../../util/layout"),l=t("../../coord/axisHelper"),u=t(ce),c=t("./Cartesian2D"),h=t("./Axis2D"),f=u.each,d=l.ifAxisCrossZero,p=l.niceScaleExtent;t("./GridModel");var v=n[W];v.type="grid",v.getRect=function(){return this._rect},v[O]=function(t,e){function i(t){var e=n[t];for(var i in e)if(e.hasOwnProperty(i)){var r=e[i];if(r&&("category"===r.type||!d(r)))return!0}return!1}var n=this._axesMap;this._updateScale(t,this._model),f(n.x,function(t){p(t,t.model)}),f(n.y,function(t){p(t,t.model)}),f(n.x,function(t){i("y")&&(t.onZero=!1)}),f(n.y,function(t){i("x")&&(t.onZero=!1)}),this.resize(this._model,e)},v.resize=function(t,e){function n(){f(o,function(t){var e=t.isHorizontal(),i=e?[0,a.width]:[0,a[ee]],n=t.inverse?1:0;t.setExtent(i[n],i[1-n]),r(t,e?a.x:a.y)})}var a=s.getLayoutRect(t.getBoxLayoutParams(),{width:e[J](),height:e[K]()});this._rect=a;var o=this._axesList;n(),t.get("containLabel")&&(f(o,function(t){if(!t.model.get("axisLabel.inside")){var e=i(t);if(e){var n=t.isHorizontal()?ee:"width",r=t.model.get("axisLabel.margin");a[n]-=e[n]+r,"top"===t[j]?a.y+=e[ee]+r:"left"===t[j]&&(a.x+=e.width+r)}}}),n())},v.getAxis=function(t,e){var i=this._axesMap[t];if(null!=i){if(null==e)for(var n in i)if(i.hasOwnProperty(n))return i[n];return i[e]}},v.getCartesian=function(t,e){if(null!=t&&null!=e){var i="x"+t+"y"+e;return this._coordsMap[i]}for(var n=0,r=this._coordsList;n<r[F];n++)if(r[n].getAxis("x").index===t||r[n].getAxis("y").index===e)return r[n]},v.convertToPixel=function(t,e,i){var n=this._findConvertTarget(t,e);return n.cartesian?n.cartesian[g](i):n.axis?n.axis.toGlobalCoord(n.axis.dataToCoord(i)):null},v.convertFromPixel=function(t,e,i){var n=this._findConvertTarget(t,e);return n.cartesian?n.cartesian.pointToData(i):n.axis?n.axis.coordToData(n.axis.toLocalCoord(i)):null},v._findConvertTarget=function(t,e){var i,n,r=e.seriesModel,a=e.xAxisModel||r&&r.getReferringComponents("xAxis")[0],o=e.yAxisModel||r&&r.getReferringComponents("yAxis")[0],s=e.gridModel,l=this._coordsList;if(r)i=r[le],u[N](l,i)<0&&(i=null);else if(a&&o)i=this.getCartesian(a.componentIndex,o.componentIndex);else if(a)n=this.getAxis("x",a.componentIndex);else if(o)n=this.getAxis("y",o.componentIndex);else if(s){var c=s[le];c===this&&(i=this._coordsList[0])}return{cartesian:i,axis:n}},v.containPoint=function(t){var e=this._coordsList[0];return e?e.containPoint(t):void 0},v._initCartesian=function(t,i){function n(n){return function(s,u){if(e(s,t,i)){var c=s.get(j);"x"===n?"top"!==c&&c!==Y&&(c=Y,r[c]&&(c="top"===c?Y:"top")):"left"!==c&&"right"!==c&&(c="left",r[c]&&(c="left"===c?"right":"left")),r[c]=!0;var f=new h(n,l.createScaleByModel(s),[0,0],s.get("type"),c),d="category"===f.type;
f.onBand=d&&s.get("boundaryGap"),f.inverse=s.get("inverse"),f.onZero=s.get("axisLine.onZero"),s.axis=f,f.model=s,f.grid=this,f.index=u,this._axesList.push(f),a[n][u]=f,o[n]++}}}var r={left:!1,right:!1,top:!1,bottom:!1},a={x:{},y:{}},o={x:0,y:0};return i.eachComponent("xAxis",n("x"),this),i.eachComponent("yAxis",n("y"),this),o.x&&o.y?(this._axesMap=a,void f(a.x,function(t,e){f(a.y,function(i,n){var r="x"+e+"y"+n,a=new c(r);a.grid=this,this._coordsMap[r]=a,this._coordsList.push(a),a.addAxis(t),a.addAxis(i)},this)},this)):(this._axesMap={},void(this._axesList=[]))},v._updateScale=function(t,i){function n(t,e,i){f(i.coordDimToDataDim(e.dim),function(i){e.scale.unionExtentFromData(t,i)})}u.each(this._axesList,function(t){t.scale.setExtent(1/0,-1/0)}),t.eachSeries(function(r){if(o(r)){var s=a(r,t),l=s[0],u=s[1];if(!e(l,i,t)||!e(u,i,t))return;var c=this.getCartesian(l.componentIndex,u.componentIndex),h=r[ue](),f=c.getAxis("x"),d=c.getAxis("y");"list"===h.type&&(n(h,f,r),n(h,d,r))}},this)};var m=["xAxis","yAxis"];return n[E]=function(t,e){var i=[];return t.eachComponent("grid",function(r,a){var o=new n(r,t,e);o.name="grid_"+a,o.resize(r,e),r[le]=o,i.push(o)}),t.eachSeries(function(e){if(o(e)){var i=a(e,t),n=i[0],r=i[1],s=n.getCoordSysModel(),l=s[le];e[le]=l.getCartesian(n.componentIndex,r.componentIndex)}}),i},n.dimensions=c[W].dimensions,t("../../CoordinateSystem").register("cartesian2d",n),n}),e("echarts/chart/bar/BarSeries",[he,"./BaseBarSeries"],function(t){return t("./BaseBarSeries")[z]({type:"series.bar",dependencies:["grid","polar"],brushSelector:"rect"})}),e("echarts/chart/bar/BarView",[he,ce,v,"./helper","../../model/Model","./barItemStyle","../../echarts"],function(t){function e(t,e,i,n,r,a,l){var u=new s.Rect({shape:o[z]({},n)});if(a){var c=u.shape,h=r?ee:"width",f={};c[h]=0,f[h]=n[h],s[l?"updateProps":"initProps"](u,{shape:f},a,e)}return u}function i(t,e,i){i.style.text="",s.updateProps(i,{shape:{width:0}},e,t,function(){i[h]&&i[h][k](i)})}function n(t,e,i){var n=t.getItemLayout(e),r=a(i,n),o=n.width>0?1:-1,s=n[ee]>0?1:-1;return{x:n.x+o*r/2,y:n.y+s*r/2,width:n.width-o*r,height:n[ee]-s*r}}function r(t,e,i,n,r,a,u){var c=e[B](i,"color"),h=e[B](i,Z),f=n[oe]("itemStyle.normal"),d=n[oe]("itemStyle.emphasis").getBarItemStyle();t.setShape("r",f.get("barBorderRadius")||0),t.useStyle(o[se]({fill:c,opacity:h},f.getBarItemStyle()));var p=u?r[ee]>0?Y:"top":r.width>0?"left":"right";l.setLabel(t.style,d,n,c,a,i,p),s.setHoverStyle(t,d)}function a(t,e){var i=t.get(u)||0;return Math.min(i,Math.abs(e.width),Math.abs(e[ee]))}var o=t(ce),s=t(v),l=t("./helper"),u=["itemStyle",p,"barBorderWidth"];o[z](t("../../model/Model")[W],t("./barItemStyle"));var c=t("../../echarts").extendChartView({type:"bar",render:function(t,e,i){var n=t.get(le);return"cartesian2d"===n&&this._renderOnCartesian(t,e,i),this.group},dispose:o.noop,_renderOnCartesian:function(t){var a=this.group,o=t[ue](),l=this._data,u=t[le],c=u.getBaseAxis(),h=c.isHorizontal(),p=t.isAnimationEnabled()?t:null;o.diff(l).add(function(i){if(o.hasValue(i)){var s=o[d](i),l=n(o,i,s),u=e(o,i,s,l,h,p);o.setItemGraphicEl(i,u),a.add(u),r(u,o,i,s,l,t,h)}})[O](function(i,u){var c=l[f](u);if(!o.hasValue(i))return void a[k](c);var v=o[d](i),m=n(o,i,v);c?s.updateProps(c,{shape:m},p,i):c=e(o,i,v,m,h,p,!0),o.setItemGraphicEl(i,c),a.add(c),r(c,o,i,v,m,t,h)})[k](function(t){var e=l[f](t);e&&i(t,p,e)}).execute(),this._data=o},remove:function(t){var e=this.group,n=this._data;t.get(H)?n&&n.eachItemGraphicEl(function(e){i(e[R],t,e)}):e.removeAll()}});return c}),e("echarts/layout/barGrid",[he,ce,"../util/number"],function(t){function e(t){return t.get("stack")||"__ec_stack_"+t.seriesIndex}function i(t){return t.dim+t.index}function n(t){var n={};a.each(t,function(t){var r=t[ue](),a=t[le],o=a.getBaseAxis(),l=o[_](),u="category"===o.type?o.getBandWidth():Math.abs(l[1]-l[0])/r.count(),c=n[i(o)]||{bandWidth:u,remainedWidth:u,autoWidthCount:0,categoryGap:"20%",gap:"30%",stacks:{}},h=c.stacks;n[i(o)]=c;var f=e(t);h[f]||c.autoWidthCount++,h[f]=h[f]||{width:0,maxWidth:0};var d=s(t.get("barWidth"),u),p=s(t.get("barMaxWidth"),u),v=t.get("barGap"),m=t.get("barCategoryGap");d&&!h[f].width&&(d=Math.min(c.remainedWidth,d),h[f].width=d,c.remainedWidth-=d),p&&(h[f].maxWidth=p),null!=v&&(c.gap=v),null!=m&&(c.categoryGap=m)});var r={};return a.each(n,function(t,e){r[e]={};var i=t.stacks,n=t.bandWidth,o=s(t.categoryGap,n),l=s(t.gap,1),u=t.remainedWidth,c=t.autoWidthCount,h=(u-o)/(c+(c-1)*l);h=Math.max(h,0),a.each(i,function(t){var e=t.maxWidth;!t.width&&e&&h>e&&(e=Math.min(e,u),u-=e,t.width=e,c--)}),h=(u-o)/(c+(c-1)*l),h=Math.max(h,0);var f,d=0;a.each(i,function(t){t.width||(t.width=h),f=t,d+=t.width*(1+l)}),f&&(d-=f.width*l);var p=-d/2;a.each(i,function(t,i){r[e][i]=r[e][i]||{offset:p,width:t.width},p+=t.width*(1+l)})}),r}function r(t,r){var o=n(a.filter(r.getSeriesByType(t),function(t){return!r.isSeriesFiltered(t)&&t[le]&&"cartesian2d"===t[le].type})),s={},l={};r.eachSeriesByType(t,function(t){var n=t[ue](),r=t[le],a=r.getBaseAxis(),u=e(t),h=o[i(a)][u],f=h[c],d=h.width,p=r.getOtherAxis(a),v=t.get("barMinHeight")||0,m=a.onZero?p.toGlobalCoord(p.dataToCoord(0)):p.getGlobalExtent()[0],g=r.dataToPoints(n,!0);s[u]=s[u]||[],l[u]=l[u]||[],n.setLayout({offset:f,size:d}),n.each(p.dim,function(t,e){if(!isNaN(t)){s[u][e]||(s[u][e]={p:m,n:m},l[u][e]={p:m,n:m});var i,r,a,o,c=t>=0?"p":"n",h=g[e],y=s[u][e][c],_=l[u][e][c];p.isHorizontal()?(i=y,r=h[1]+f,a=h[0]-_,o=d,l[u][e][c]+=a,Math.abs(a)<v&&(a=(0>a?-1:1)*v),s[u][e][c]+=a):(i=h[0]+f,r=y,a=d,o=h[1]-_,l[u][e][c]+=o,Math.abs(o)<v&&(o=(0>=o?-1:1)*v),s[u][e][c]+=o),n.setItemLayout(e,{x:i,y:r,width:a,height:o})}},!0)},this)}var a=t(ce),o=t("../util/number"),s=o.parsePercent;return r}),e("echarts/visual/symbol",[he],function(){return function(t,e,i,n){n.eachRawSeriesByType(t,function(t){var r=t[ue](),a=t.get("symbol")||e,o=t.get("symbolSize");r.setVisual({legendSymbol:i||a,symbol:a,symbolSize:o}),n.isSeriesFiltered(t)||(typeof o===T&&r.each(function(e){var i=t.getRawValue(e),n=t[A](e);r.setItemVisual(e,"symbolSize",o(i,n))}),r.each(function(t){var e=r[d](t),i=e[u]("symbol",!0),n=e[u]("symbolSize",!0);null!=i&&r.setItemVisual(t,"symbol",i),null!=n&&r.setItemVisual(t,"symbolSize",n)}))})}}),e("echarts/chart/line/LineView",[he,ce,"../helper/SymbolDraw","../helper/Symbol","./lineAnimationDiff",v,"../../util/model","./poly","../../view/Chart"],function(t){function e(t,e){if(t[F]===e[F]){for(var i=0;i<t[F];i++){var n=t[i],r=e[i];if(n[0]!==r[0]||n[1]!==r[1])return}return!0}}function i(t){return typeof t===w?t:t?.3:0}function n(t){var e=t.getGlobalExtent();if(t.onBand){var i=t.getBandWidth()/2-1,n=e[1]>e[0]?1:-1;e[0]+=n*i,e[1]-=n*i}return e}function r(t){return t>=0?1:-1}function a(t,e){var i=t.getBaseAxis(),n=t.getOtherAxis(i),a=i.onZero?0:n.scale[_]()[0],o=n.dim,s="x"===o||"radius"===o?1:0;return e.mapArray([o],function(n,l){for(var u,c=e.stackedOn;c&&r(c.get(o,l))===r(n);){u=c;break}var h=[];return h[s]=e.get(i.dim,l),h[1-s]=u?u.get(o,l,!0):a,t[g](h)},!0)}function o(t,e,i){var r=n(t.getAxis("x")),a=n(t.getAxis("y")),o=t.getBaseAxis().isHorizontal(),s=Math.min(r[0],r[1]),l=Math.min(a[0],a[1]),u=Math.max(r[0],r[1])-s,c=Math.max(a[0],a[1])-l,h=i.get("lineStyle.normal.width")||2,f=i.get("clipOverflow")?h/2:Math.max(u,c);o?(l-=f,c+=2*f):(s-=f,u+=2*f);var d=new b.Rect({shape:{x:s,y:l,width:u,height:c}});return e&&(d.shape[o?"width":ee]=0,b.initProps(d,{shape:{width:u,height:c}},i)),d}function s(t,e,i){var n=t.getAngleAxis(),r=t.getRadiusAxis(),a=r[_](),o=n[_](),s=Math.PI/180,l=new b.Sector({shape:{cx:t.cx,cy:t.cy,r0:a[0],r:a[1],startAngle:-o[0]*s,endAngle:-o[1]*s,clockwise:n.inverse}});return e&&(l.shape.endAngle=-o[0]*s,b.initProps(l,{shape:{endAngle:-o[1]*s}},i)),l}function u(t,e,i){return"polar"===t.type?s(t,e,i):o(t,e,i)}function h(t,e,i){for(var n=e.getBaseAxis(),r="x"===n.dim||"radius"===n.dim?0:1,a=[],o=0;o<t[F]-1;o++){var s=t[o+1],l=t[o];a.push(l);var u=[];switch(i){case"end":u[r]=s[r],u[1-r]=l[1-r],a.push(u);break;case Q:var c=(l[r]+s[r])/2,h=[];u[r]=h[r]=c,u[1-r]=l[1-r],h[1-r]=s[1-r],a.push(u),a.push(h);break;default:u[r]=l[r],u[1-r]=s[1-r],a.push(u)}}return t[o]&&a.push(t[o]),a}function d(t,e){var i=t.getVisual("visualMeta");if(i&&i[F]&&t.count()){for(var n,r=i[F]-1;r>=0;r--)if(i[r].dimension<2){n=i[r];break}if(n&&"cartesian2d"===e.type){var a=n.dimension,o=t.dimensions[a],s=e.getAxis(o),l=p.map(n.stops,function(t){return{coord:s.toGlobalCoord(s.dataToCoord(t.value)),color:t.color}}),u=l[F],h=n.outerColors.slice();u&&l[0].coord>l[u-1].coord&&(l.reverse(),h.reverse());var f=10,d=l[0].coord-f,v=l[u-1].coord+f,m=v-d;if(.001>m)return"transparent";p.each(l,function(t){t[c]=(t.coord-d)/m}),l.push({offset:u?l[u-1][c]:.5,color:h[1]||"transparent"}),l.unshift({offset:u?l[0][c]:.5,color:h[0]||"transparent"});var g=new b.LinearGradient(0,0,0,0,l,!0);return g[o]=d,g[o+"2"]=v,g}}}var p=t(ce),m=t("../helper/SymbolDraw"),y=t("../helper/Symbol"),x=t("./lineAnimationDiff"),b=t(v),T=t("../../util/model"),S=t("./poly"),M=t("../../view/Chart");return M[z]({type:"line",init:function(){var t=new b.Group,e=new m;this.group.add(e.group),this._symbolDraw=e,this._lineGroup=t},render:function(t,n,r){var o=t[le],s=this.group,l=t[ue](),c=t[oe]("lineStyle.normal"),f=t[oe]("areaStyle.normal"),v=l.mapArray(l.getItemLayout,!0),m="polar"===o.type,g=this._coordSys,y=this._symbolDraw,_=this._polyline,x=this._polygon,b=this._lineGroup,w=t.get(H),T=!f.isEmpty(),S=a(o,l),M=t.get("showSymbol"),C=M&&!m&&!t.get("showAllSymbol")&&this._getSymbolIgnoreFunc(l,o),A=this._data;A&&A.eachItemGraphicEl(function(t,e){t.__temp&&(s[k](t),A.setItemGraphicEl(e,null))}),M||y[k](),s.add(b);var P=!m&&t.get("step");_&&g.type===o.type&&P===this._step?(T&&!x?x=this._newPolygon(v,S,o,w):x&&!T&&(b[k](x),x=this._polygon=null),b.setClipPath(u(o,!1,t)),M&&y.updateData(l,C),l.eachItemGraphicEl(function(t){t.stopAnimation(!0)}),e(this._stackedOnPoints,S)&&e(this._points,v)||(w?this._updateAnimation(l,S,o,r,P):(P&&(v=h(v,o,P),S=h(S,o,P)),_.setShape({points:v}),x&&x.setShape({points:v,stackedOnPoints:S})))):(M&&y.updateData(l,C),P&&(v=h(v,o,P),S=h(S,o,P)),_=this._newPolyline(v,o,w),T&&(x=this._newPolygon(v,S,o,w)),b.setClipPath(u(o,!0,t)));var L=d(l,o)||l.getVisual("color");_.useStyle(p[se](c.getLineStyle(),{fill:"none",stroke:L,lineJoin:"bevel"}));var I=t.get("smooth");if(I=i(t.get("smooth")),_.setShape({smooth:I,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")}),x){var z=l.stackedOn,D=0;if(x.useStyle(p[se](f.getAreaStyle(),{fill:L,opacity:.7,lineJoin:"bevel"})),z){var O=z.hostModel;D=i(O.get("smooth"))}x.setShape({smooth:I,stackedOnSmooth:D,smoothMonotone:t.get("smoothMonotone"),connectNulls:t.get("connectNulls")})}this._data=l,this._coordSys=o,this._stackedOnPoints=S,this._points=v,this._step=P},dispose:function(){},highlight:function(t,e,i,n){var r=t[ue](),a=T.queryDataIndex(r,n);if(!(a instanceof Array)&&null!=a&&a>=0){var o=r[f](a);if(!o){var s=r.getItemLayout(a);if(!s)return;o=new y(r,a),o[j]=s,o.setZ(t.get(C),t.get("z")),o[G]=isNaN(s[0])||isNaN(s[1]),o.__temp=!0,r.setItemGraphicEl(a,o),o.stopSymbolAnimation(!0),this.group.add(o)}o.highlight()}else M[W].highlight.call(this,t,e,i,n)},downplay:function(t,e,i,n){var r=t[ue](),a=T.queryDataIndex(r,n);if(null!=a&&a>=0){var o=r[f](a);o&&(o.__temp?(r.setItemGraphicEl(a,null),this.group[k](o)):o.downplay())}else M[W].downplay.call(this,t,e,i,n)},_newPolyline:function(t){var e=this._polyline;return e&&this._lineGroup[k](e),e=new S.Polyline({shape:{points:t},silent:!0,z2:10}),this._lineGroup.add(e),this._polyline=e,e},_newPolygon:function(t,e){var i=this._polygon;return i&&this._lineGroup[k](i),i=new S.Polygon({shape:{points:t,stackedOnPoints:e},silent:!0}),this._lineGroup.add(i),this._polygon=i,i},_getSymbolIgnoreFunc:function(t,e){var i=e.getAxesByScale(l)[0];return i&&i.isLabelIgnored?p.bind(i.isLabelIgnored,i):void 0},_updateAnimation:function(t,e,i,n,r){var a=this._polyline,o=this._polygon,s=t.hostModel,l=x(this._data,t,this._stackedOnPoints,e,this._coordSys,i),u=l.current,c=l.stackedOnCurrent,d=l.next,p=l.stackedOnNext;r&&(u=h(l.current,i,r),c=h(l.stackedOnCurrent,i,r),d=h(l.next,i,r),p=h(l.stackedOnNext,i,r)),a.shape.__points=l.current,a.shape.points=u,b.updateProps(a,{shape:{points:d}},s),o&&(o.setShape({points:u,stackedOnPoints:c}),b.updateProps(o,{shape:{points:d,stackedOnPoints:p}},s));for(var v=[],m=l.status,g=0;g<m[F];g++){var y=m[g].cmd;if("="===y){var _=t[f](m[g].idx1);_&&v.push({el:_,ptIdx:g})}}a.animators&&a.animators[F]&&a.animators[0].during(function(){for(var t=0;t<v[F];t++){var e=v[t].el;e.attr(j,a.shape.__points[v[t].ptIdx])}})},remove:function(){var t=this.group,e=this._data;this._lineGroup.removeAll(),this._symbolDraw[k](!0),e&&e.eachItemGraphicEl(function(i,n){i.__temp&&(t[k](i),e.setItemGraphicEl(n,null))}),this._polyline=this._polygon=this._coordSys=this._points=this._stackedOnPoints=this._data=null}})}),e("echarts/layout/points",[he],function(){return function(t,e){e.eachSeriesByType(t,function(t){var e=t[ue](),i=t[le];if(i){var n=i.dimensions;"singleAxis"===i.type?e.each(n[0],function(t,n){e.setItemLayout(n,isNaN(t)?[0/0,0/0]:i[g](t))}):e.each(n,function(t,n,r){e.setItemLayout(r,isNaN(t)||isNaN(n)?[0/0,0/0]:i[g]([t,n]))},!0)}})}}),e("echarts/processor/dataSample",[],function(){var t={average:function(t){for(var e=0,i=0,n=0;n<t[F];n++)isNaN(t[n])||(e+=t[n],i++);return 0===i?0/0:e/i},sum:function(t){for(var e=0,i=0;i<t[F];i++)e+=t[i]||0;return e},max:function(t){for(var e=-1/0,i=0;i<t[F];i++)t[i]>e&&(e=t[i]);return e},min:function(t){for(var e=1/0,i=0;i<t[F];i++)t[i]<e&&(e=t[i]);return e},nearest:function(t){return t[0]}},e=function(t){return Math.round(t[F]/2)};return function(i,n){n.eachSeriesByType(i,function(i){var n=i[ue](),r=i.get("sampling"),a=i[le];if("cartesian2d"===a.type&&r){var o=a.getBaseAxis(),s=a.getOtherAxis(o),l=o[_](),u=l[1]-l[0],c=Math.round(n.count()/u);if(c>1){var h;typeof r===q?h=t[r]:typeof r===T&&(h=r),h&&(n=n.downSample(s.dim,1/c,h,e),i.setData(n))}}},this)}}),e("echarts/component/axis",[he,"../coord/cartesian/AxisModel","./axis/AxisView"],function(t){t("../coord/cartesian/AxisModel"),t("./axis/AxisView")}),e("echarts/util/graphic",[he,ce,"zrender/tool/path","zrender/graphic/Path","zrender/tool/color","zrender/core/matrix","zrender/core/vector","zrender/container/Group","zrender/graphic/Image","zrender/graphic/Text","zrender/graphic/shape/Circle","zrender/graphic/shape/Sector","zrender/graphic/shape/Ring","zrender/graphic/shape/Polygon","zrender/graphic/shape/Polyline","zrender/graphic/shape/Rect","zrender/graphic/shape/Line","zrender/graphic/shape/BezierCurve","zrender/graphic/shape/Arc","zrender/graphic/CompoundPath","zrender/graphic/LinearGradient","zrender/graphic/RadialGradient","zrender/core/BoundingRect"],function(t){function e(t){return null!=t&&"none"!=t}function i(t){return typeof t===q?M.lift(t,-.1):t}function n(t){if(t.__hoverStlDirty){var n=t.style[o],r=t.style.fill,a=t.__hoverStl;a.fill=a.fill||(e(r)?i(r):null),a[o]=a[o]||(e(n)?i(n):null);var s={};for(var l in a)a.hasOwnProperty(l)&&(s[l]=t.style[l]);t.__normalStl=s,t.__hoverStlDirty=!1}}function r(t){t.__isHover||(n(t),t.useHoverLayer?t.__zr&&t.__zr.addHover(t,t.__hoverStl):(t[X](t.__hoverStl),t.z2+=1),t.__isHover=!0)}function a(t){if(t.__isHover){var e=t.__normalStl;t.useHoverLayer?t.__zr&&t.__zr.removeHover(t):(e&&t[X](e),t.z2-=1),t.__isHover=!1}}function l(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&r(t)}):r(t)}function f(t){"group"===t.type?t.traverse(function(t){"group"!==t.type&&a(t)}):a(t)}function d(t,e){t.__hoverStl=t.hoverStyle||e||{},t.__hoverStlDirty=!0,t.__isHover&&n(t)}function v(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&l(this)}function m(t){this.__hoverSilentOnTouch&&t.zrByTouch||!this.__isEmphasis&&f(this)}function g(){this.__isEmphasis=!0,l(this)}function y(){this.__isEmphasis=!1,f(this)}function _(t,e,i,n,r,a){typeof r===T&&(a=r,r=null);var o=n&&n.isAnimationEnabled();if(o){var s=t?"Update":"",l=n[u]("animationDuration"+s),c=n[u]("animationEasing"+s),h=n[u]("animationDelay"+s);typeof h===T&&(h=h(r,n.getAnimationDelayParams?n.getAnimationDelayParams(e,r):null)),typeof l===T&&(l=l(r)),l>0?e.animateTo(i,l,h||0,c,a):(e.attr(i),a&&a())}else e.attr(i),a&&a()}var x=t(ce),b=t("zrender/tool/path"),w=Math.round,S=t("zrender/graphic/Path"),M=t("zrender/tool/color"),C=t("zrender/core/matrix"),A=t("zrender/core/vector"),L={};return L.Group=t("zrender/container/Group"),L.Image=t("zrender/graphic/Image"),L.Text=t("zrender/graphic/Text"),L.Circle=t("zrender/graphic/shape/Circle"),L.Sector=t("zrender/graphic/shape/Sector"),L.Ring=t("zrender/graphic/shape/Ring"),L.Polygon=t("zrender/graphic/shape/Polygon"),L.Polyline=t("zrender/graphic/shape/Polyline"),L.Rect=t("zrender/graphic/shape/Rect"),L.Line=t("zrender/graphic/shape/Line"),L.BezierCurve=t("zrender/graphic/shape/BezierCurve"),L.Arc=t("zrender/graphic/shape/Arc"),L.CompoundPath=t("zrender/graphic/CompoundPath"),L.LinearGradient=t("zrender/graphic/LinearGradient"),L.RadialGradient=t("zrender/graphic/RadialGradient"),L.BoundingRect=t("zrender/core/BoundingRect"),L.extendShape=function(t){return S[z](t)},L.extendPath=function(t,e){return b.extendFromString(t,e)},L.makePath=function(t,e,i,n){var r=b.createFromString(t,e),a=r[ie]();if(i){var o=a.width/a[ee];if(n===$){var s,l=i[ee]*o;l<=i.width?s=i[ee]:(l=i.width,s=l/o);var u=i.x+i.width/2,c=i.y+i[ee]/2;i.x=u-l/2,i.y=c-s/2,i.width=l,i[ee]=s}L.resizePath(r,i)}return r},L.mergePath=b.mergePath,L.resizePath=function(t,e){if(t[s]){var i=t[ie](),n=i.calculateTransform(e);t[s](n)}},L.subPixelOptimizeLine=function(t){var e=L.subPixelOptimize,i=t.shape,n=t.style.lineWidth;return w(2*i.x1)===w(2*i.x2)&&(i.x1=i.x2=e(i.x1,n,!0)),w(2*i.y1)===w(2*i.y2)&&(i.y1=i.y2=e(i.y1,n,!0)),t},L.subPixelOptimizeRect=function(t){var e=L.subPixelOptimize,i=t.shape,n=t.style.lineWidth,r=i.x,a=i.y,o=i.width,s=i[ee];return i.x=e(i.x,n,!0),i.y=e(i.y,n,!0),i.width=Math.max(e(r+o,n,!1)-i.x,0===o?0:1),i[ee]=Math.max(e(a+s,n,!1)-i.y,0===s?0:1),t},L.subPixelOptimize=function(t,e,i){var n=w(2*t);return(n+w(e))%2===0?n/2:(n+(i?1:-1))/2},L.setHoverStyle=function(t,e,i){t.__hoverSilentOnTouch=i&&i.hoverSilentOnTouch,"group"===t.type?t.traverse(function(t){"group"!==t.type&&d(t,e)}):d(t,e),t.on("mouseover",v).on(P,m),t.on("emphasis",g).on(p,y)},L.setText=function(t,e,i){var n=e[u](j)||"inside",r=e[u](c),a=n[N]("inside")>=0?"white":i,o=e[oe](ae);x[z](t,{textDistance:e[u]("distance")||5,textFont:o[ne](),textPosition:n,textOffset:r,textFill:o.getTextColor()||a})},L.updateProps=function(t,e,i,n,r){_(!0,t,e,i,n,r)},L.initProps=function(t,e,i,n,r){_(!1,t,e,i,n,r)},L.getTransform=function(t,e){for(var i=C.identity([]);t&&t!==e;)C.mul(i,t.getLocalTransform(),i),t=t[h];return i},L[s]=function(t,e,i){return i&&(e=C.invert([],e)),A[s]([],t,e)},L.transformDirection=function(t,e,i){var n=0===e[4]||0===e[5]||0===e[0]?1:Math.abs(2*e[4]/e[0]),r=0===e[4]||0===e[5]||0===e[2]?1:Math.abs(2*e[4]/e[2]),a=["left"===t?-n:"right"===t?n:0,"top"===t?-r:t===Y?r:0];return a=L[s](a,e,i),Math.abs(a[0])>Math.abs(a[1])?a[0]>0?"right":"left":a[1]>0?Y:"top"},L.groupTransition=function(t,e,i){function n(t){var e={};return t.traverse(function(t){!t.isGroup&&t.anid&&(e[t.anid]=t)}),e}function r(t){var e={position:A.clone(t[j]),rotation:t.rotation};return t.shape&&(e.shape=x[z]({},t.shape)),e}if(t&&e){var a=n(t);e.traverse(function(t){if(!t.isGroup&&t.anid){var e=a[t.anid];if(e){var n=r(t);t.attr(r(e)),L.updateProps(t,n,i,t[R])}}})}},L}),e("echarts/chart/pie/PieSeries",[he,"../../data/List",ce,"../../util/model","../../data/helper/completeDimensions","../../component/helper/selectableMixin","../../echarts"],function(t){var e=t("../../data/List"),i=t(ce),n=t("../../util/model"),r=t("../../data/helper/completeDimensions"),o=t("../../component/helper/selectableMixin"),s=t("../../echarts").extendSeriesModel({type:"series.pie",init:function(t){s.superApply(this,"init",arguments),this.legendDataProvider=function(){return this.getRawData()},this.updateSelectedMap(t.data),this._defaultLabelLine(t)},mergeOption:function(t){s.superCall(this,"mergeOption",t),this.updateSelectedMap(this[a].data)},getInitialData:function(t){var i=r(["value"],t.data),n=new e(i,this);return n.initData(t.data),n},getDataParams:function(t){var e=this[ue](),i=s.superCall(this,A,t),n=e.getSum("value");return i.percent=n?+(e.get("value",t)/n*100).toFixed(2):0,i.$vars.push("percent"),i},_defaultLabelLine:function(t){n.defaultEmphasis(t.labelLine,["show"]);var e=t.labelLine[p],i=t.labelLine.emphasis;e.show=e.show&&t.label[p].show,i.show=i.show&&t.label.emphasis.show},defaultOption:{zlevel:0,z:2,legendHoverLink:!0,hoverAnimation:!0,center:["50%","50%"],radius:[0,"75%"],clockwise:!0,startAngle:90,minAngle:0,selectedOffset:10,avoidLabelOverlap:!0,stillShowZeroSum:!0,label:{normal:{rotate:!1,show:!0,position:"outer"},emphasis:{}},labelLine:{normal:{show:!0,length:15,length2:15,smooth:!1,lineStyle:{width:1,type:"solid"}}},itemStyle:{normal:{borderWidth:1},emphasis:{}},animationType:"expansion",animationEasing:"cubicOut",data:[]}});return i.mixin(s,o),s}),e("echarts/action/createDataSelectAction",[he,"../echarts",ce],function(t){var e=t("../echarts"),i=t(ce);return function(t,n){i.each(n,function(i){i[O]="updateView",e.registerAction(i,function(e,n){var r={};return n.eachComponent({mainType:"series",subType:t,query:e},function(t){t[i.method]&&t[i.method](e.name);var n=t[ue]();n.each(function(e){var i=n.getName(e);r[i]=t.isSelected(i)||!1})}),{name:e.name,selected:r}})})}}),e("echarts/visual/dataColor",[he],function(){return function(t,e){var i={};e.eachRawSeriesByType(t,function(t){var n=t.getRawData(),r={};if(!e.isSeriesFiltered(t)){var a=t[ue]();a.each(function(t){var e=a.getRawIndex(t);r[e]=t}),n.each(function(e){var o=r[e],s=null!=o&&a[B](o,"color",!0);if(s)n.setItemVisual(e,"color",s);else{var l=n[d](e),u=l.get("itemStyle.normal.color")||t.getColorFromPalette(n.getName(e),i);n.setItemVisual(e,"color",u),null!=o&&a.setItemVisual(o,"color",u)}})}})}}),e("echarts/chart/pie/PieView",[he,v,ce,"../../view/Chart"],function(t){function e(t,e,n,r){var a=e[ue](),o=this[R],s=a.getName(o),l=e.get("selectedOffset");r.dispatchAction({type:"pieToggleSelect",from:t,name:s,seriesId:e.id}),a.each(function(t){i(a[f](t),a.getItemLayout(t),e.isSelected(a.getName(t)),l,n)})}function i(t,e,i,n,r){var a=(e.startAngle+e.endAngle)/2,o=Math.cos(a),s=Math.sin(a),l=i?n:0,u=[o*l,s*l];r?t.animate().when(200,{position:u}).start("bounceOut"):t.attr(j,u)}function n(t,e){function i(){o[G]=o.hoverIgnore,s[G]=s.hoverIgnore}function n(){o[G]=o.normalIgnore,s[G]=s.normalIgnore}a.Group.call(this);var r=new a.Sector({z2:2}),o=new a.Polyline,s=new a.Text;this.add(r),this.add(o),this.add(s),this.updateData(t,e,!0),this.on("emphasis",i).on(p,n).on("mouseover",i).on(P,n)}function r(t,e,i,n,r){var a=n[oe](ae),s="inside"===r||"inner"===r;return{fill:a.getTextColor()||(s?"#fff":t[B](e,"color")),opacity:t[B](e,Z),textFont:a[ne](),text:o[m](t.hostModel.getFormattedLabel(e,i),t.getName(e))}}var a=t(v),o=t(ce),s=n[W];s.updateData=function(t,e,n){function r(){l.stopAnimation(!0),l.animateTo({shape:{r:f.r+10}},300,"elasticOut")}function s(){l.stopAnimation(!0),l.animateTo({shape:{r:f.r}},300,"elasticOut")}var l=this.childAt(0),c=t.hostModel,h=t[d](e),f=t.getItemLayout(e),v=o[z]({},f);if(v.label=null,n){l.setShape(v);var m=c[u]("animationType");"scale"===m?(l.shape.r=f.r0,a.initProps(l,{shape:{r:f.r}},c,e)):(l.shape.endAngle=f.startAngle,a.updateProps(l,{shape:{endAngle:f.endAngle}},c,e))}else a.updateProps(l,{shape:v},c,e);var g=h[oe]("itemStyle"),y=t[B](e,"color");l.useStyle(o[se]({lineJoin:"bevel",fill:y},g[oe](p).getItemStyle())),l.hoverStyle=g[oe]("emphasis").getItemStyle(),i(this,t.getItemLayout(e),h.get("selected"),c.get("selectedOffset"),c.get(H)),l.off("mouseover").off(P).off("emphasis").off(p),h.get("hoverAnimation")&&c.isAnimationEnabled()&&l.on("mouseover",r).on(P,s).on("emphasis",r).on(p,s),this._updateLabel(t,e),a.setHoverStyle(this)},s._updateLabel=function(t,e){var i=this.childAt(1),n=this.childAt(2),o=t.hostModel,s=t[d](e),l=t.getItemLayout(e),u=l.label,c=t[B](e,"color");a.updateProps(i,{shape:{points:u.linePoints||[[u.x,u.y],[u.x,u.y],[u.x,u.y]]}},o,e),a.updateProps(n,{style:{x:u.x,y:u.y}},o,e),n.attr({style:{textVerticalAlign:u.verticalAlign,textAlign:u[re],textFont:u.font},rotation:u.rotation,origin:[u.x,u.y],z2:10});var h=s[oe]("label.normal"),f=s[oe]("label.emphasis"),v=s[oe]("labelLine.normal"),m=s[oe]("labelLine.emphasis"),g=h.get(j)||f.get(j);n[X](r(t,e,p,h,g)),n[G]=n.normalIgnore=!h.get("show"),n.hoverIgnore=!f.get("show"),i[G]=i.normalIgnore=!v.get("show"),i.hoverIgnore=!m.get("show"),i[X]({stroke:c,opacity:t[B](e,Z)}),i[X](v[oe]("lineStyle").getLineStyle()),n.hoverStyle=r(t,e,"emphasis",f,g),i.hoverStyle=m[oe]("lineStyle").getLineStyle();var y=v.get("smooth");y&&y===!0&&(y=.4),i.setShape({smooth:y})},o[b](n,a.Group);var l=t("../../view/Chart")[z]({type:"pie",init:function(){var t=new a.Group;this._sectorGroup=t},render:function(t,i,r,a){if(!a||a.from!==this.uid){var s=t[ue](),l=this._data,u=this.group,c=i.get(H),h=!l,d=t.get("animationType"),p=o.curry(e,this.uid,t,c,r),v=t.get("selectedMode");if(s.diff(l).add(function(t){var e=new n(s,t);h&&"scale"!==d&&e.eachChild(function(t){t.stopAnimation(!0)}),v&&e.on("click",p),s.setItemGraphicEl(t,e),u.add(e)})[O](function(t,e){var i=l[f](e);i.updateData(s,t),i.off("click"),v&&i.on("click",p),u.add(i),s.setItemGraphicEl(t,i)})[k](function(t){var e=l[f](t);u[k](e)}).execute(),c&&h&&s.count()>0&&"scale"!==d){var m=s.getItemLayout(0),g=Math.max(r[J](),r[K]())/2,y=o.bind(u.removeClipPath,u);u.setClipPath(this._createClipPath(m.cx,m.cy,g,m.startAngle,m.clockwise,y,t))}this._data=s}},dispose:function(){},_createClipPath:function(t,e,i,n,r,o,s){var l=new a.Sector({shape:{cx:t,cy:e,r0:0,r:i,startAngle:n,endAngle:n,clockwise:r}});return a.initProps(l,{shape:{endAngle:n+(r?1:-1)*Math.PI*2}},s,o),l},containPoint:function(t,e){var i=e[ue](),n=i.getItemLayout(0);if(n){var r=t[0]-n.cx,a=t[1]-n.cy,o=Math.sqrt(r*r+a*a);return o<=n.r&&o>=n.r0}}});return l}),e("echarts/processor/dataFilter",[],function(){return function(t,e){var i=e.findComponents({mainType:"legend"});i&&i[F]&&e.eachSeriesByType(t,function(t){var e=t[ue]();e.filterSelf(function(t){for(var n=e.getName(t),r=0;r<i[F];r++)if(!i[r].isSelected(n))return!1;return!0},this)},this)}}),e("echarts/chart/pie/pieLayout",[he,"../../util/number","./labelLayout",ce],function(t){var e=t("../../util/number"),i=e.parsePercent,n=t("./labelLayout"),r=t(ce),a=2*Math.PI,o=Math.PI/180;return function(t,s,l){s.eachSeriesByType(t,function(t){var s=t.get($),u=t.get("radius");r[S](u)||(u=[0,u]),r[S](s)||(s=[s,s]);var c=l[J](),h=l[K](),f=Math.min(c,h),d=i(s[0],c),p=i(s[1],h),v=i(u[0],f/2),m=i(u[1],f/2),g=t[ue](),y=-t.get("startAngle")*o,_=t.get("minAngle")*o,x=g.getSum("value"),b=Math.PI/(x||g.count())*2,w=t.get("clockwise"),T=t.get("roseType"),M=t.get("stillShowZeroSum"),C=g.getDataExtent("value");C[0]=0;var A=a,P=0,L=y,I=w?1:-1;if(g.each("value",function(t,i){var n;if(isNaN(t))return void g.setItemLayout(i,{angle:0/0,startAngle:0/0,endAngle:0/0,clockwise:w,cx:d,cy:p,r0:v,r:T?0/0:m});n="area"!==T?0===x&&M?b:t*b:a/(g.count()||1),_>n?(n=_,A-=_):P+=t;var r=L+I*n;g.setItemLayout(i,{angle:n,startAngle:L,endAngle:r,clockwise:w,cx:d,cy:p,r0:v,r:T?e.linearMap(t,C,[v,m]):m}),L=r},!0),a>A)if(.001>=A){var z=a/g.count();g.each(function(t){var e=g.getItemLayout(t);e.startAngle=y+I*t*z,e.endAngle=y+I*(t+1)*z})}else b=A/P,L=y,g.each("value",function(t,e){var i=g.getItemLayout(e),n=i.angle===_?_:t*b;i.startAngle=L,i.endAngle=L+I*n,L+=I*n});n(t,m,c,h)})}}),e("echarts/util/layout",[he,ce,"zrender/core/BoundingRect","./number","./format"],function(t){function e(t,e,i,n,r){var a=0,o=0;null==n&&(n=1/0),null==r&&(r=1/0);var s=0;e.eachChild(function(l,u){var c,h,f=l[j],d=l[ie](),p=e.childAt(u+1),v=p&&p[ie]();if("horizontal"===t){var m=d.width+(v?-v.x+d.x:0);c=a+m,c>n||l.newline?(a=0,c=m,o+=s+i,s=d[ee]):s=Math.max(s,d[ee])}else{var g=d[ee]+(v?-v.y+d.y:0);h=o+g,h>r||l.newline?(a+=s+i,o=0,h=g,s=d.width):s=Math.max(s,d.width)}l.newline||(f[0]=a,f[1]=o,"horizontal"===t?a=c+i:o=h+i)})}var i=t(ce),n=t("zrender/core/BoundingRect"),r=t("./number"),a=t("./format"),o=r.parsePercent,l=i.each,u={},c=u.LOCATION_PARAMS=["left","right","top",Y,"width",ee];return u.box=e,u.vbox=i.curry(e,"vertical"),u.hbox=i.curry(e,"horizontal"),u.getAvailableSize=function(t,e,i){var n=e.width,r=e[ee],s=o(t.x,n),l=o(t.y,r),u=o(t.x2,n),c=o(t.y2,r);return(isNaN(s)||isNaN(parseFloat(t.x)))&&(s=0),(isNaN(u)||isNaN(parseFloat(t.x2)))&&(u=n),(isNaN(l)||isNaN(parseFloat(t.y)))&&(l=0),(isNaN(c)||isNaN(parseFloat(t.y2)))&&(c=r),i=a.normalizeCssArray(i||0),{width:Math.max(u-s-i[1]-i[3],0),height:Math.max(c-l-i[0]-i[2],0)}},u.getLayoutRect=function(t,e,i){i=a.normalizeCssArray(i||0);var r=e.width,s=e[ee],l=o(t.left,r),u=o(t.top,s),c=o(t.right,r),h=o(t[Y],s),f=o(t.width,r),d=o(t[ee],s),p=i[2]+i[0],v=i[1]+i[3],m=t.aspect;switch(isNaN(f)&&(f=r-c-v-l),isNaN(d)&&(d=s-h-p-u),isNaN(f)&&isNaN(d)&&(m>r/s?f=.8*r:d=.8*s),null!=m&&(isNaN(f)&&(f=m*d),isNaN(d)&&(d=f/m)),isNaN(l)&&(l=r-c-f-v),isNaN(u)&&(u=s-h-d-p),t.left||t.right){case $:l=r/2-f/2-i[3];break;case"right":l=r-f-v}switch(t.top||t[Y]){case Q:case $:u=s/2-d/2-i[0];break;case Y:u=s-d-p}l=l||0,u=u||0,isNaN(f)&&(f=r-l-(c||0)),isNaN(d)&&(d=s-u-(h||0));var g=new n(l+i[3],u+i[0],f,d);return g.margin=i,g},u.positionElement=function(t,e,r,a,o){var l=!o||!o.hv||o.hv[0],c=!o||!o.hv||o.hv[1],h=o&&o.boundingMode||"all";if(l||c){var f;if("raw"===h)f="group"===t.type?new n(0,0,+e.width||0,+e[ee]||0):t[ie]();else if(f=t[ie](),t.needLocalTransform()){var d=t.getLocalTransform();f=f.clone(),f[s](d)}e=u.getLayoutRect(i[se]({width:f.width,height:f[ee]},e),r,a);var p=t[j],v=l?e.x-f.x:0,m=c?e.y-f.y:0;t.attr(j,"raw"===h?[v,m]:[p[0]+v,p[1]+m])}},u.mergeLayoutParam=function(t,e,n){function r(i){var r={},s=0,u={},c=0,h=n.ignoreSize?1:2;if(l(i,function(e){u[e]=t[e]}),l(i,function(t){a(e,t)&&(r[t]=u[t]=e[t]),o(r,t)&&s++,o(u,t)&&c++}),c!==h&&s){if(s>=h)return r;for(var f=0;f<i[F];f++){var d=i[f];if(!a(r,d)&&a(t,d)){r[d]=t[d];break}}return r}return u}function a(t,e){return t.hasOwnProperty(e)}function o(t,e){return null!=t[e]&&"auto"!==t[e]}function s(t,e,i){l(t,function(t){e[t]=i[t]})}!i[V](n)&&(n={});var u=["width","left","right"],c=[ee,"top",Y],h=r(u),f=r(c);s(u,t,h),s(c,t,f)},u.getLayoutParams=function(t){return u.copyLayoutParams({},t)},u.copyLayoutParams=function(t,e){return e&&t&&l(c,function(i){e.hasOwnProperty(i)&&(t[i]=e[i])}),t},u}),e("echarts/component/legend/LegendModel",[he,ce,"../../model/Model","../../echarts"],function(t){var e=t(ce),i=t("../../model/Model"),n=t("../../echarts").extendComponentModel({type:"legend",dependencies:["series"],layoutMode:{type:"box",ignoreSize:!0},init:function(t,e,i){this.mergeDefaultAndTheme(t,i),t.selected=t.selected||{}},mergeOption:function(t){n.superCall(this,"mergeOption",t)},optionUpdated:function(){this._updateData(this[r]);var t=this._data;if(t[0]&&"single"===this.get("selectedMode")){for(var e=!1,i=0;i<t[F];i++){var n=t[i].get("name");if(this.isSelected(n)){this.select(n),e=!0;break}}!e&&this.select(t[0].get("name"))}},_updateData:function(t){var n=e.map(this.get("data")||[],function(t){return(typeof t===q||typeof t===w)&&(t={name:t}),new i(t,this,this[r])},this);this._data=n;var a=e.map(t.getSeries(),function(t){return t.name});t.eachSeries(function(t){if(t.legendDataProvider){var e=t.legendDataProvider();a=a[y](e.mapArray(e.getName))}}),this._availableNames=a},getData:function(){return this._data},select:function(t){var i=this[a].selected,n=this.get("selectedMode");if("single"===n){var r=this._data;e.each(r,function(t){i[t.get("name")]=!1})}i[t]=!0},unSelect:function(t){"single"!==this.get("selectedMode")&&(this[a].selected[t]=!1)},toggleSelected:function(t){var e=this[a].selected;e.hasOwnProperty(t)||(e[t]=!0),this[e[t]?"unSelect":"select"](t)},isSelected:function(t){var i=this[a].selected;
return!(i.hasOwnProperty(t)&&!i[t])&&e[N](this._availableNames,t)>=0},defaultOption:{zlevel:0,z:4,show:!0,orient:"horizontal",left:"center",top:"top",align:"auto",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,itemWidth:25,itemHeight:14,inactiveColor:"#ccc",textStyle:{color:"#333"},selectedMode:!0,tooltip:{show:!1}}});return n}),e("echarts/component/legend/legendAction",[he,"../../echarts",ce],function(t){function e(t,e,i){var r,a={},o="toggleSelected"===t;return i.eachComponent("legend",function(i){o&&null!=r?i[r?"select":"unSelect"](e.name):(i[t](e.name),r=i.isSelected(e.name));var s=i[ue]();n.each(s,function(t){var e=t.get("name");if("\n"!==e&&""!==e){var n=i.isSelected(e);a[e]=e in a?a[e]&&n:n}})}),{name:e.name,selected:a}}var i=t("../../echarts"),n=t(ce);i.registerAction("legendToggleSelect","legendselectchanged",n.curry(e,"toggleSelected")),i.registerAction("legendSelect","legendselected",n.curry(e,"select")),i.registerAction("legendUnSelect","legendunselected",n.curry(e,"unSelect"))}),e("echarts/component/legend/legendFilter",[],function(){return function(t){var e=t.findComponents({mainType:"legend"});e&&e[F]&&t.filterSeries(function(t){for(var i=0;i<e[F];i++)if(!e[i].isSelected(t.name))return!1;return!0})}}),e("echarts/component/tooltip/TooltipModel",[he,"../../echarts"],function(t){t("../../echarts").extendComponentModel({type:"tooltip",defaultOption:{zlevel:0,z:8,show:!0,showContent:!0,trigger:"item",triggerOn:"mousemove",alwaysShowContent:!1,confine:!1,showDelay:0,hideDelay:100,transitionDuration:.4,enterable:!1,backgroundColor:"rgba(50,50,50,0.7)",borderColor:"#333",borderRadius:4,borderWidth:0,padding:5,extraCssText:"",axisPointer:{type:"line",axis:"auto",animation:!0,animationDurationUpdate:200,animationEasingUpdate:"exponentialOut",lineStyle:{color:"#555",width:1,type:"solid"},crossStyle:{color:"#555",width:1,type:"dashed",textStyle:{}},shadowStyle:{color:"rgba(150,150,150,0.3)"}},textStyle:{color:"#fff",fontSize:14}}})}),e("echarts/component/legend/LegendView",[he,ce,"../../util/symbol",v,"../helper/listComponent","../../echarts"],function(t){function e(t,e){e.dispatchAction({type:"legendToggleSelect",name:t})}function i(t,e,i){var n=i.getZr().storage.getDisplayList()[0];n&&n.useHoverLayer||t.get("legendHoverLink")&&i.dispatchAction({type:"highlight",seriesName:t.name,name:e})}function n(t,e,i){var n=i.getZr().storage.getDisplayList()[0];n&&n.useHoverLayer||t.get("legendHoverLink")&&i.dispatchAction({type:"downplay",seriesName:t.name,name:e})}var r=t(ce),o=t("../../util/symbol"),s=t(v),l=t("../helper/listComponent"),u=r.curry;return t("../../echarts").extendComponentView({type:"legend",init:function(){this._symbolTypeStore={}},render:function(t,a,o){var c=this.group;if(c.removeAll(),t.get("show")){var h=t.get("selectedMode"),f=t.get("align");"auto"===f&&(f="right"===t.get("left")&&"vertical"===t.get("orient")?"right":"left");var d={};r.each(t[ue](),function(r){var l=r.get("name");if(""===l||"\n"===l)return void c.add(new s.Group({newline:!0}));var p=a.getSeriesByName(l)[0];if(!d[l])if(p){var v=p[ue](),m=v.getVisual("color");typeof m===T&&(m=m(p[A](0)));var g=v.getVisual("legendSymbol")||"roundRect",y=v.getVisual("symbol"),_=this._createItem(l,r,t,g,y,f,m,h);_.on("click",u(e,l,o)).on("mouseover",u(i,p,null,o)).on(P,u(n,p,null,o)),d[l]=!0}else a.eachRawSeries(function(a){if(!d[l]&&a.legendDataProvider){var s=a.legendDataProvider(),c=s.indexOfName(l);if(0>c)return;var p=s[B](c,"color"),v="roundRect",m=this._createItem(l,r,t,v,null,f,p,h);m.on("click",u(e,l,o)).on("mouseover",u(i,a,l,o)).on(P,u(n,a,l,o)),d[l]=!0}},this)},this),l.layout(c,t,o),l.addBackground(c,t)}},_createItem:function(t,e,i,n,l,u,c,h){var f=i.get("itemWidth"),d=i.get("itemHeight"),p=i.get("inactiveColor"),v=i.isSelected(t),m=new s.Group,g=e[oe](ae),y=e.get("icon"),_=e[oe]("tooltip"),x=_.parentModel;if(n=y||n,m.add(o.createSymbol(n,0,0,f,d,v?c:p)),!y&&l&&(l!==n||"none"==l)){var b=.8*d;"none"===l&&(l="circle"),m.add(o.createSymbol(l,(f-b)/2,(d-b)/2,b,b,v?c:p))}var w="left"===u?f+5:-5,S=u,C=i.get("formatter"),A=t;typeof C===q&&C?A=C[M]("{name}",null!=t?t:""):typeof C===T&&(A=C(t));var P=new s.Text({style:{text:A,x:w,y:d/2,fill:v?g.getTextColor():p,textFont:g[ne](),textAlign:S,textVerticalAlign:"middle"}});m.add(P);var L=new s.Rect({shape:m[ie](),invisible:!0,tooltip:_.get("show")?r[z]({content:t,formatter:x.get("formatter",!0)||function(){return t},formatterParams:{componentType:"legend",legendIndex:i.componentIndex,name:t,$vars:["name"]}},_[a]):null});return m.add(L),m.eachChild(function(t){t[te]=!0}),L[te]=!h,this.group.add(m),s.setHoverStyle(m),m}})}),e("echarts/component/tooltip/TooltipView",[he,"./TooltipContent",v,ce,"../../util/format","../../util/number","../../util/model","zrender/core/env","../../model/Model","../../echarts"],function(t){function e(t,e){if(!t||!e)return!1;var i=w.round;return i(t[0])===i(e[0])&&i(t[1])===i(e[1])}function i(t,e,i,n){return{x1:t,y1:e,x2:i,y2:n}}function n(t,e,i,n){return{x:t,y:e,width:i,height:n}}function a(t,e,i,n,r,a){return{cx:t,cy:e,r0:i,r:n,startAngle:r,endAngle:a,clockwise:!0}}function l(t,e,i,n,r){var a=i.clientWidth,o=i.clientHeight,s=20;return t+a+s>n?t-=a+s:t+=s,e+o+s>r?e-=o+s:e+=s,[t,e]}function u(t,e,i,n,r){var a=i.clientWidth,o=i.clientHeight;return t=Math.min(t+a,n)-a,e=Math.min(e+o,r)-o,t=Math.max(t,0),e=Math.max(e,0),[t,e]}function c(t,e,i){var n=i.clientWidth,r=i.clientHeight,a=5,o=0,s=0,l=e.width,u=e[ee];switch(t){case"inside":o=e.x+l/2-n/2,s=e.y+u/2-r/2;break;case"top":o=e.x+l/2-n/2,s=e.y-r-a;break;case Y:o=e.x+l/2-n/2,s=e.y+u+a;break;case"left":o=e.x-n-a,s=e.y+u/2-r/2;break;case"right":o=e.x+l+a,s=e.y+u/2-r/2}return[o,s]}function h(t,e,i,n,r,a,o,h){var f=h[J](),d=h[K](),p=o&&o[ie]().clone();if(o&&p[s](o.transform),typeof t===T&&(t=t([e,i],a,r.el,p)),x[S](t))e=L(t[0],f),i=L(t[1],d);else if(typeof t===q&&o){var v=c(t,p,r.el);e=v[0],i=v[1]}else{var v=l(e,i,r.el,f,d);e=v[0],i=v[1]}if(n){var v=u(e,i,r.el,f,d);e=v[0],i=v[1]}r.moveTo(e,i)}function p(t){var e=t[le],i=t.get("tooltip.trigger",!0);return!(!e||"cartesian2d"!==e.type&&"polar"!==e.type&&"singleAxis"!==e.type||"item"===i)}var m=t("./TooltipContent"),y=t(v),x=t(ce),b=t("../../util/format"),w=t("../../util/number"),M=t("../../util/model"),L=w.parsePercent,z=t("zrender/core/env"),k=t("../../model/Model");t("../../echarts").extendComponentView({type:"tooltip",_axisPointers:{},init:function(t,e){if(!z.node){var i=new m(e.getDom(),e);this._tooltipContent=i}},render:function(t,e,i){if(!z.node){this.group.removeAll(),this._axisPointers={},this._tooltipModel=t,this._ecModel=e,this._api=i,this._lastHover={};var n=this._tooltipContent;n[O](),n.enterable=t.get("enterable"),this._alwaysShowContent=t.get("alwaysShowContent"),this._seriesGroupByAxis=this._prepareAxisTriggerData(t,e);var r=this._crossText;r&&this.group.add(r);var a=t.get("triggerOn");if(null!=this._lastX&&null!=this._lastY&&"none"!==a){var o=this;clearTimeout(this._refreshUpdateTimeout),this._refreshUpdateTimeout=setTimeout(function(){o.manuallyShowTip(t,e,i,{x:o._lastX,y:o._lastY})})}var s=this._api.getZr();s.off("click",this._tryShow),s.off("mousemove",this._mousemove),s.off(P,this._hide),s.off("globalout",this._hide),"click"===a?s.on("click",this._tryShow,this):"mousemove"===a&&(s.on("mousemove",this._mousemove,this),s.on(P,this._hide,this),s.on("globalout",this._hide,this))}},_mousemove:function(t){var e=this._tooltipModel.get("showDelay"),i=this;clearTimeout(this._showTimeout),e>0?this._showTimeout=setTimeout(function(){i._tryShow(t)},e):this._tryShow(t)},manuallyShowTip:function(t,e,i,n){function r(t){var e=t[ue](),i=M.queryDataIndex(e,n);return null!=i&&!x[S](i)&&e.hasValue(i)?!0:void 0}if(n.from!==this.uid){var e=this._ecModel,a=n.seriesIndex,o=e.getSeriesByIndex(a),i=this._api,l="axis"===this._tooltipModel.get(I);if(null==n.x||null==n.y){if(l?(o&&!r(o)&&(o=null),o||e.eachSeries(function(t){p(t)&&!o&&r(t)&&(o=t)})):o=o||e.getSeriesByIndex(0),o){var u=o[ue](),c=M.queryDataIndex(u,n);if(null==c||x[S](c))return;var h,d,v=u[f](c),m=o[le];if(o.getTooltipPosition){var y=o.getTooltipPosition(c)||[];h=y[0],d=y[1]}else if(m&&m[g]){var y=m[g](u.getValues(x.map(m.dimensions,function(t){return o.coordDimToDataDim(t)[0]}),c,!0));h=y&&y[0],d=y&&y[1]}else if(v){var _=v[ie]().clone();_[s](v.transform),h=_.x+_.width/2,d=_.y+_[ee]/2}null!=h&&null!=d&&this._tryShow({offsetX:h,offsetY:d,position:n[j],target:v,event:{}})}}else{var v=i.getZr().handler.findHover(n.x,n.y);this._tryShow({offsetX:n.x,offsetY:n.y,position:n[j],target:v,event:{}})}}},manuallyHideTip:function(t,e,i,n){n.from!==this.uid&&this._hide()},_prepareAxisTriggerData:function(t,e){var i={};return e.eachSeries(function(t){if(p(t)){var e,n,r=t[le];"cartesian2d"===r.type?(e=r.getBaseAxis(),n=e.dim+e.index):"singleAxis"===r.type?(e=r.getAxis(),n=e.dim+e.type):(e=r.getBaseAxis(),n=e.dim+r.name),i[n]=i[n]||{coordSys:[],series:[]},i[n].coordSys.push(r),i[n].series.push(t)}},this),i},_tryShow:function(t){var e=t.target,i=this._tooltipModel,n=i.get(I),r=this._ecModel,a=this._api;if(i)if(this._lastX=t.offsetX,this._lastY=t.offsetY,e&&null!=e[R]){var o=e.dataModel||r.getSeriesByIndex(e.seriesIndex),s=e[R],l=o[ue](),u=l[d](s);"axis"===(u.get("tooltip.trigger")||n)?this._showAxisTooltip(i,r,t):(this._ticket="",this._hideAxisPointer(),this._resetLastHover(),this._showItemTooltipContent(o,s,e.dataType,t)),a.dispatchAction({type:"showTip",from:this.uid,dataIndexInside:s,dataIndex:l.getRawIndex(s),seriesIndex:e.seriesIndex})}else if(e&&e.tooltip){var c=e.tooltip;if(typeof c===q){var h=c;c={content:h,formatter:h}}var f=new k(c,i),p=f.get("content"),v=Math.random();this._showTooltipContent(f,p,f.get("formatterParams")||{},v,t.offsetX,t.offsetY,t[j],e,a)}else"item"===n?this._hide():this._showAxisTooltip(i,r,t),"cross"===i.get("axisPointer.type")&&a.dispatchAction({type:"showTip",from:this.uid,x:t.offsetX,y:t.offsetY})},_showAxisTooltip:function(t,i,n){var r=t[oe]("axisPointer"),a=r.get("type");if("cross"===a){var o=n.target;if(o&&null!=o[R]){var s=i.getSeriesByIndex(o.seriesIndex),l=o[R];this._showItemTooltipContent(s,l,o.dataType,n)}}this._showAxisPointer();var u=!0;x.each(this._seriesGroupByAxis,function(i){var o=i.coordSys,s=o[0],l=[n.offsetX,n.offsetY];if(!s.containPoint(l))return void this._hideAxisPointer(s.name);u=!1;var c=s.dimensions,h=s.pointToData(l,!0);l=s[g](h);var f=s.getBaseAxis(),d=r.get("axis");if("auto"===d&&(d=f.dim),f.isBlank()||x.eqNaN(l[0])||x.eqNaN(l[1]))return void this._hideAxisPointer(s.name);var p=!1,v=this._lastHover;if("cross"===a)e(v.data,h)&&(p=!0),v.data=h;else{var m=x[N](c,d);v.data===h[m]&&(p=!0),v.data=h[m]}var y=t.get(H);"cartesian2d"!==s.type||p?"polar"!==s.type||p?"singleAxis"!==s.type||p||this._showSinglePointer(r,s,d,l,y):this._showPolarPointer(r,s,d,l,y):this._showCartesianPointer(r,s,d,l,y),"cross"!==a&&this._dispatchAndShowSeriesTooltipContent(s,i.series,l,h,p,n[j])},this),this._tooltipModel.get("show")||this._hideAxisPointer(),u&&this._hide()},_showCartesianPointer:function(t,e,r,a,o){function s(n,r,a){var o="x"===n?i(r[0],a[0],r[0],a[1]):i(a[0],r[1],a[1],r[1]),s=u._getPointerElement(e,t,n,o);y.subPixelOptimizeLine({shape:o,style:s.style}),f?y.updateProps(s,{shape:o},t):s.attr({shape:o})}function l(i,r,a){var o=e.getAxis(i),s=o.getBandWidth(),l=a[1]-a[0],c="x"===i?n(r[0]-s/2,a[0],s,l):n(a[0],r[1]-s/2,l,s),h=u._getPointerElement(e,t,i,c);f?y.updateProps(h,{shape:c},t):h.attr({shape:c})}var u=this,c=t.get("type"),h=e.getBaseAxis(),f=o&&"cross"!==c&&"category"===h.type&&h.getBandWidth()>20;if("cross"===c)s("x",a,e.getAxis("y").getGlobalExtent()),s("y",a,e.getAxis("x").getGlobalExtent()),this._updateCrossText(e,a,t);else{var d=e.getAxis("x"===r?"y":"x"),p=d.getGlobalExtent();"cartesian2d"===e.type&&("line"===c?s:l)(r,a,p)}},_showSinglePointer:function(t,e,n,r,a){function o(n,r,a){var o=e.getAxis(),l=o.orient,c="horizontal"===l?i(r[0],a[0],r[0],a[1]):i(a[0],r[1],a[1],r[1]),h=s._getPointerElement(e,t,n,c);u?y.updateProps(h,{shape:c},t):h.attr({shape:c})}var s=this,l=t.get("type"),u=a&&"cross"!==l&&"category"===e.getBaseAxis().type,c=e.getRect(),h=[c.y,c.y+c[ee]];o(n,r,h)},_showPolarPointer:function(t,e,n,r,o){function s(n,r,a){var o,s=e.pointToCoord(r);if("angle"===n){var l=e.coordToPoint([a[0],s[1]]),c=e.coordToPoint([a[1],s[1]]);o=i(l[0],l[1],c[0],c[1])}else o={cx:e.cx,cy:e.cy,r:s[0]};var h=u._getPointerElement(e,t,n,o);d?y.updateProps(h,{shape:o},t):h.attr({shape:o})}function l(i,n,r){var o,s=e.getAxis(i),l=s.getBandWidth(),c=e.pointToCoord(n),h=Math.PI/180;o="angle"===i?a(e.cx,e.cy,r[0],r[1],(-c[1]-l/2)*h,(-c[1]+l/2)*h):a(e.cx,e.cy,c[0]-l/2,c[0]+l/2,0,2*Math.PI);var f=u._getPointerElement(e,t,i,o);d?y.updateProps(f,{shape:o},t):f.attr({shape:o})}var u=this,c=t.get("type"),h=e.getAngleAxis(),f=e.getRadiusAxis(),d=o&&"cross"!==c&&"category"===e.getBaseAxis().type;if("cross"===c)s("angle",r,f[_]()),s("radius",r,h[_]()),this._updateCrossText(e,r,t);else{var p=e.getAxis("radius"===n?"angle":"radius"),v=p[_]();("line"===c?s:l)(n,r,v)}},_updateCrossText:function(t,e,i){var n=i[oe]("crossStyle"),r=n[oe](ae),a=this._tooltipModel,o=this._crossText;o||(o=this._crossText=new y.Text({style:{textAlign:"left",textVerticalAlign:"bottom"}}),this.group.add(o));var s=t.pointToData(e),l=t.dimensions;s=x.map(s,function(e,i){var n=t.getAxis(l[i]);return e="category"===n.type||"time"===n.type?n.scale.getLabel(e):b.addCommas(e.toFixed(n.getPixelPrecision()))}),o[X]({fill:r.getTextColor()||n.get("color"),textFont:r[ne](),text:s.join(", "),x:e[0]+5,y:e[1]-5}),o.z=a.get("z"),o[C]=a.get(C)},_getPointerElement:function(t,e,i,n){var r=this._tooltipModel,a=r.get("z"),s=r.get(C),l=this._axisPointers,u=t.name;if(l[u]=l[u]||{},l[u][i])return l[u][i];var c=e.get("type"),h=e[oe](c+"Style"),f="shadow"===c,d=h[f?"getAreaStyle":"getLineStyle"](),p="polar"===t.type?f?"Sector":"radius"===i?"Circle":"Line":f?"Rect":"Line";f?d[o]=null:d.fill=null;var v=l[u][i]=new y[p]({style:d,z:a,zlevel:s,silent:!0,shape:n});return this.group.add(v),v},_dispatchAndShowSeriesTooltipContent:function(t,e,i,n,r,a){var o=this._tooltipModel,s=t.getBaseAxis(),l={x:1,radius:1,single:1}[s.dim]?0:1;if(e[F]){var u,c=x.map(e,function(t){return{seriesIndex:t.seriesIndex,dataIndexInside:t.getAxisTooltipDataIndex?t.getAxisTooltipDataIndex(t.coordDimToDataDim(s.dim),n,s):t[ue]().indexOfNearest(t.coordDimToDataDim(s.dim)[0],n[l],!1,"category"===s.type?.5:null)}});x.each(c,function(t,i){e[i][ue]().hasValue(t.dataIndexInside)&&(u=i)}),u=u||0;var f=this._lastHover,d=this._api;f.payloadBatch&&!r&&d.dispatchAction({type:"downplay",batch:f.payloadBatch}),r||(d.dispatchAction({type:"highlight",batch:c}),f.payloadBatch=c);var p=c[u].dataIndexInside;if(d.dispatchAction({type:"showTip",dataIndexInside:p,dataIndex:e[u][ue]().getRawIndex(p),seriesIndex:c[u].seriesIndex,from:this.uid}),s&&o.get("showContent")&&o.get("show")){var v=x.map(e,function(t,e){return t[A](c[e].dataIndexInside)});if(r)h(a||o.get(j),i[0],i[1],o.get("confine"),this._tooltipContent,v,null,d);else{var m=c[u].dataIndexInside,g="time"===s.type?s.scale.getLabel(n[l]):e[u][ue]().getName(m),y=(g?b.encodeHTML(g)+"<br />":"")+x.map(e,function(t,e){return t.formatTooltip(c[e].dataIndexInside,!0)}).join("<br />"),_="axis_"+t.name+"_"+m;this._showTooltipContent(o,y,v,_,i[0],i[1],a,null,d)}}}},_showItemTooltipContent:function(t,e,i,n){var a=this._api,o=t[ue](i),s=o[d](e),l=s.get("tooltip",!0);if(typeof l===q){var u=l;l={formatter:u}}var c=this._tooltipModel,h=t[oe]("tooltip",c),f=new k(l,h,h[r]),p=t[A](e,i),v=t.formatTooltip(e,!1,i),m="item_"+t.name+"_"+e;this._showTooltipContent(f,v,p,m,n.offsetX,n.offsetY,n[j],n.target,a)},_showTooltipContent:function(t,e,i,n,r,a,o,s,l){if(this._ticket="",t.get("showContent")&&t.get("show")){var u=this._tooltipContent,c=t.get("confine"),f=t.get("formatter");o=o||t.get(j);var d=e;if(f)if(typeof f===q)d=b.formatTpl(f,i,!0);else if(typeof f===T){var p=this,v=n,m=function(t,e){t===p._ticket&&(u.setContent(e),h(o,r,a,c,u,i,s,l))};p._ticket=v,d=f(i,v,m)}u.show(t),u.setContent(d),h(o,r,a,c,u,i,s,l)}},_showAxisPointer:function(t){if(t){var e=this._axisPointers[t];e&&x.each(e,function(t){t.show()})}else this.group.eachChild(function(t){t.show()}),this.group.show()},_resetLastHover:function(){var t=this._lastHover;t.payloadBatch&&this._api.dispatchAction({type:"downplay",batch:t.payloadBatch}),this._lastHover={}},_hideAxisPointer:function(t){if(t){var e=this._axisPointers[t];e&&x.each(e,function(t){t.hide()})}else this.group.children()[F]&&this.group.hide()},_hide:function(){clearTimeout(this._showTimeout),this._hideAxisPointer(),this._resetLastHover(),this._alwaysShowContent||this._tooltipContent.hideLater(this._tooltipModel.get("hideDelay")),this._api.dispatchAction({type:"hideTip",from:this.uid}),this._lastX=this._lastY=null},dispose:function(t,e){if(!z.node){var i=e.getZr();this._tooltipContent.hide(),i.off("click",this._tryShow),i.off("mousemove",this._mousemove),i.off(P,this._hide),i.off("globalout",this._hide)}}})}),e("zrender/core/env",[],function(){function t(t){var e={},i={},n=t.match(/Firefox\/([\d.]+)/),r=t.match(/MSIE\s([\d.]+)/)||t.match(/Trident\/.+?rv:(([\d.]+))/),a=t.match(/Edge\/([\d.]+)/),o=/micromessenger/i.test(t);return n&&(i.firefox=!0,i.version=n[1]),r&&(i.ie=!0,i.version=r[1]),a&&(i.edge=!0,i.version=a[1]),o&&(i.weChat=!0),{browser:i,os:e,node:!1,canvasSupported:document.createElement("canvas").getContext?!0:!1,touchEventsSupported:"ontouchstart"in window&&!i.ie&&!i.edge,pointerEventsSupported:"onpointerdown"in window&&(i.edge||i.ie&&i.version>=11)}}var e={};return e=typeof navigator===n?{browser:{},os:{},node:!0,canvasSupported:!0}:t(navigator.userAgent)}),e("echarts/ExtensionAPI",[he,ce],function(t){function e(t){i.each(n,function(e){this[e]=i.bind(t[e],t)},this)}var i=t(ce),n=["getDom","getZr",J,K,"dispatchAction","isDisposed","on","off","getDataURL","getConnectedDataURL",oe,"getOption"];return e}),e("echarts/CoordinateSystem",[he,ce],function(t){function e(){this._coordinateSystems=[]}var i=t(ce),n={};return e[W]={constructor:e,create:function(t,e){var r=[];i.each(n,function(i){var n=i[E](t,e);r=r[y](n||[])}),this._coordinateSystems=r},update:function(t,e){i.each(this._coordinateSystems,function(i){i[O]&&i[O](t,e)})},getCoordinateSystems:function(){return this._coordinateSystems.slice()}},e.register=function(t,e){n[t]=e},e.get=function(t){return n[t]},e}),e("echarts/model/Global",[he,ce,"../util/model","./Model","./Component","./globalDefault","./mixin/colorPalette"],function(t){function e(t,e){u.each(e,function(e,i){y.hasClass(i)||("object"==typeof e?t[i]=t[i]?u.merge(t[i],e,!1):u.clone(e):null==t[i]&&(t[i]=e))})}function i(t){t=t,this[a]={},this[a][x]=1,this._componentsMap={},this._seriesIndices=null,e(t,this._theme[a]),u.merge(t,_,!1),this.mergeOption(t)}function n(t,e){u[S](e)||(e=e?[e]:[]);var i={};return f(e,function(e){i[e]=(t[e]||[]).slice()}),i}function r(t,e,i){var n=e.type?e.type:i?i.subType:y.determineSubType(t,e);return n}function o(t){return p(t,function(t){return t.componentIndex})||[]}function s(t,e){return e.hasOwnProperty("subType")?d(t,function(t){return t.subType===e.subType}):t}function l(t){}var u=t(ce),c=t("../util/model"),h=t("./Model"),f=u.each,d=u.filter,p=u.map,v=u[S],m=u[N],g=u[V],y=t("./Component"),_=t("./globalDefault"),x="\x00_ec_inner",b=h[z]({constructor:b,init:function(t,e,i,n){i=i||{},this[a]=null,this._theme=new h(i),this._optionManager=n},setOption:function(t,e){u.assert(!(x in t),"please use chart.getOption()"),this._optionManager.setOption(t,e),this.resetOption()},resetOption:function(t){var e=!1,n=this._optionManager;if(!t||"recreate"===t){var r=n.mountOption("recreate"===t);this[a]&&"recreate"!==t?(this.restoreData(),this.mergeOption(r)):i.call(this,r),e=!0}if(("timeline"===t||"media"===t)&&this.restoreData(),!t||"recreate"===t||"timeline"===t){var o=n.getTimelineOption(this);o&&(this.mergeOption(o),e=!0)}if(!t||"recreate"===t||"media"===t){var s=n.getMediaOption(this,this._api);s[F]&&f(s,function(t){this.mergeOption(t,e=!0)},this)}return e},mergeOption:function(t){function e(e,l){var h=c.normalizeToArray(t[e]),d=c.mappingToExists(s[e],h);c.makeIdAndName(d),f(d,function(t){var i=t[a];g(i)&&(t.keyInfo.mainType=e,t.keyInfo.subType=r(e,i,t.exist))});var p=n(s,l);i[e]=[],s[e]=[],f(d,function(t,n){var r=t.exist,o=t[a];if(u.assert(g(o)||r,"Empty component definition"),o){var l=y.getClass(e,t.keyInfo.subType,!0);if(r&&r instanceof l)r.name=t.keyInfo.name,r.mergeOption(o,this),r.optionUpdated(o,!1);else{var c=u[z]({dependentModels:p,componentIndex:n},t.keyInfo);r=new l(o,this,this,c),u[z](r,c),r.init(o,this,this,c),r.optionUpdated(null,!0)}}else r.mergeOption({},this),r.optionUpdated({},!1);s[e][n]=r,i[e][n]=r[a]},this),"series"===e&&(this._seriesIndices=o(s.series))}var i=this[a],s=this._componentsMap,l=[];f(t,function(t,e){null!=t&&(y.hasClass(e)?l.push(e):i[e]=null==i[e]?u.clone(t):u.merge(i[e],t,!0))}),y.topologicalTravel(l,y.getAllClassMainTypes(),e,this),this._seriesIndices=this._seriesIndices||[]},getOption:function(){var t=u.clone(this[a]);return f(t,function(e,i){if(y.hasClass(i)){for(var e=c.normalizeToArray(e),n=e[F]-1;n>=0;n--)c.isIdInner(e[n])&&e[L](n,1);t[i]=e}}),delete t[x],t},getTheme:function(){return this._theme},getComponent:function(t,e){var i=this._componentsMap[t];return i?i[e||0]:void 0},queryComponents:function(t){var e=t.mainType;if(!e)return[];var i=t.index,n=t.id,r=t.name,a=this._componentsMap[e];if(!a||!a[F])return[];var o;if(null!=i)v(i)||(i=[i]),o=d(p(i,function(t){return a[t]}),function(t){return!!t});else if(null!=n){var l=v(n);o=d(a,function(t){return l&&m(n,t.id)>=0||!l&&t.id===n})}else if(null!=r){var u=v(r);o=d(a,function(t){return u&&m(r,t.name)>=0||!u&&t.name===r})}else o=a;return s(o,t)},findComponents:function(t){function e(t){var e=r+"Index",i=r+"Id",n=r+"Name";return!t||null==t[e]&&null==t[i]&&null==t[n]?null:{mainType:r,index:t[e],id:t[i],name:t[n]}}function i(e){return t.filter?d(e,t.filter):e}var n=t.query,r=t.mainType,a=e(n),o=a?this.queryComponents(a):this._componentsMap[r];return i(s(o,t))},eachComponent:function(t,e,i){var n=this._componentsMap;if(typeof t===T)i=e,e=t,f(n,function(t,n){f(t,function(t,r){e.call(i,n,t,r)})});else if(u.isString(t))f(n[t],e,i);else if(g(t)){var r=this.findComponents(t);f(r,e,i)}},getSeriesByName:function(t){var e=this._componentsMap.series;return d(e,function(e){return e.name===t})},getSeriesByIndex:function(t){return this._componentsMap.series[t]},getSeriesByType:function(t){var e=this._componentsMap.series;return d(e,function(e){return e.subType===t})},getSeries:function(){return this._componentsMap.series.slice()},eachSeries:function(t,e){l(this),f(this._seriesIndices,function(i){var n=this._componentsMap.series[i];t.call(e,n,i)},this)},eachRawSeries:function(t,e){f(this._componentsMap.series,t,e)},eachSeriesByType:function(t,e,i){l(this),f(this._seriesIndices,function(n){var r=this._componentsMap.series[n];r.subType===t&&e.call(i,r,n)},this)},eachRawSeriesByType:function(t,e,i){return f(this.getSeriesByType(t),e,i)},isSeriesFiltered:function(t){return l(this),u[N](this._seriesIndices,t.componentIndex)<0},filterSeries:function(t,e){l(this);var i=d(this._componentsMap.series,t,e);this._seriesIndices=o(i)},restoreData:function(){var t=this._componentsMap;this._seriesIndices=o(t.series);var e=[];f(t,function(t,i){e.push(i)}),y.topologicalTravel(e,y.getAllClassMainTypes(),function(e){f(t[e],function(t){t.restoreData()})})}});return u.mixin(b,t("./mixin/colorPalette")),b}),e("echarts/model/Component",[he,"./Model",ce,"../util/component","../util/clazz","../util/layout","./mixin/boxLayout"],function(t){function e(t){var e=[];return n.each(c.getClassesByMainType(t),function(t){o.apply(e,t[W].dependencies||[])}),n.map(e,function(t){return l.parseClassType(t).main})}var i=t("./Model"),n=t(ce),o=Array[W].push,s=t("../util/component"),l=t("../util/clazz"),u=t("../util/layout"),c=i[z]({type:"component",id:"",name:"",mainType:"",subType:"",componentIndex:0,defaultOption:null,ecModel:null,dependentModels:[],uid:null,layoutMode:null,$constructor:function(t,e,n,r){i.call(this,t,e,n,r),this.uid=s.getUID("componentModel")},init:function(t,e,i){this.mergeDefaultAndTheme(t,i)},mergeDefaultAndTheme:function(t,e){var i=this.layoutMode,r=i?u.getLayoutParams(t):{},a=e.getTheme();n.merge(t,a.get(this.mainType)),n.merge(t,this.getDefaultOption()),i&&u.mergeLayoutParam(t,r,i)},mergeOption:function(t){n.merge(this[a],t,!0);var e=this.layoutMode;e&&u.mergeLayoutParam(this[a],t,e)},optionUpdated:function(){},getDefaultOption:function(){if(!l.hasOwn(this,"__defaultOption")){for(var t=[],e=this.constructor;e;){var i=e[W].defaultOption;i&&t.push(i),e=e.superClass}for(var r={},a=t[F]-1;a>=0;a--)r=n.merge(r,t[a],!0);l.set(this,"__defaultOption",r)}return l.get(this,"__defaultOption")},getReferringComponents:function(t){return this[r].queryComponents({mainType:t,index:this.get(t+"Index",!0),id:this.get(t+"Id",!0)})}});return l.enableClassManagement(c,{registerWhenExtend:!0}),s.enableSubTypeDefaulter(c),s.enableTopologicalTravel(c,e),n.mixin(c,t("./mixin/boxLayout")),c}),e("echarts/model/OptionManager",[he,ce,"../util/model","./Component"],function(t){function e(t){this._api=t,this._timelineOptions=[],this._mediaList=[],this._mediaDefault,this._currentMediaIndices=[],this._optionBackup,this._newBaseOption}function i(t,e,i){var n,r,o=[],s=[],u=t.timeline;if(t.baseOption&&(r=t.baseOption),(u||t.options)&&(r=r||{},o=(t.options||[]).slice()),t.media){r=r||{};var c=t.media;h(c,function(t){t&&t[a]&&(t.query?s.push(t):n||(n=t))})}return r||(r=t),r.timeline||(r.timeline=u),h([r][y](o)[y](l.map(s,function(t){return t[a]})),function(t){h(e,function(e){e(t,i)})}),{baseOption:r,timelineOptions:o,mediaDefault:n,mediaList:s}}function n(t,e,i){var n={width:e,height:i,aspectratio:e/i},a=!0;return l.each(t,function(t,e){var i=e.match(v);if(i&&i[1]&&i[2]){var o=i[1],s=i[2][U]();r(n[s],t,o)||(a=!1)}}),a}function r(t,e,i){return"min"===i?t>=e:"max"===i?e>=t:t===e}function o(t,e){return t.join(",")===e.join(",")}function s(t,e){e=e||{},h(e,function(e,i){if(null!=e){var n=t[i];if(c.hasClass(i)){e=u.normalizeToArray(e),n=u.normalizeToArray(n);var r=u.mappingToExists(n,e);t[i]=d(r,function(t){return t[a]&&t.exist?p(t.exist,t[a],!0):t.exist||t[a]})}else t[i]=p(n,e,!0)}})}var l=t(ce),u=t("../util/model"),c=t("./Component"),h=l.each,f=l.clone,d=l.map,p=l.merge,v=/^(min|max)?(.+)$/;return e[W]={constructor:e,setOption:function(t,e){t=f(t,!0);var n=this._optionBackup,r=i.call(this,t,e,!n);this._newBaseOption=r.baseOption,n?(s(n.baseOption,r.baseOption),r.timelineOptions[F]&&(n.timelineOptions=r.timelineOptions),r.mediaList[F]&&(n.mediaList=r.mediaList),r.mediaDefault&&(n.mediaDefault=r.mediaDefault)):this._optionBackup=r},mountOption:function(t){var e=this._optionBackup;return this._timelineOptions=d(e.timelineOptions,f),this._mediaList=d(e.mediaList,f),this._mediaDefault=f(e.mediaDefault),this._currentMediaIndices=[],f(t?e.baseOption:this._newBaseOption)},getTimelineOption:function(t){var e,i=this._timelineOptions;if(i[F]){var n=t.getComponent("timeline");n&&(e=f(i[n.getCurrentIndex()],!0))}return e},getMediaOption:function(){var t=this._api[J](),e=this._api[K](),i=this._mediaList,r=this._mediaDefault,s=[],l=[];if(!i[F]&&!r)return l;for(var u=0,c=i[F];c>u;u++)n(i[u].query,t,e)&&s.push(u);return!s[F]&&r&&(s=[-1]),s[F]&&!o(s,this._currentMediaIndices)&&(l=d(s,function(t){return f(-1===t?r[a]:i[t][a])})),this._currentMediaIndices=s,l}},e}),e("echarts/model/Series",[he,ce,"../util/format","../util/clazz","../util/model","./Component","./mixin/colorPalette","zrender/core/env","../util/layout"],function(t){var e=t(ce),i=t("../util/format"),n=t("../util/clazz"),o=t("../util/model"),s=t("./Component"),c=t("./mixin/colorPalette"),h=t("zrender/core/env"),f=t("../util/layout"),d=n.set,p=n.get,v=i.encodeHTML,m=i.addCommas,g=s[z]({type:"series.__base__",seriesIndex:0,coordinateSystem:null,defaultOption:null,legendDataProvider:null,visualColorAccessPath:"itemStyle.normal.color",layoutMode:null,init:function(t,e,i){this.seriesIndex=this.componentIndex,this.mergeDefaultAndTheme(t,i),d(this,"dataBeforeProcessed",this.getInitialData(t,i)),this.restoreData()},mergeDefaultAndTheme:function(t,i){var n=this.layoutMode,r=n?f.getLayoutParams(t):{};e.merge(t,i.getTheme().get(this.subType)),e.merge(t,this.getDefaultOption()),o.defaultEmphasis(t.label,o.LABEL_OPTIONS),this.fillDataTextStyle(t.data),n&&f.mergeLayoutParam(t,r,n)},mergeOption:function(t,i){t=e.merge(this[a],t,!0),this.fillDataTextStyle(t.data);var n=this.layoutMode;n&&f.mergeLayoutParam(this[a],t,n);var r=this.getInitialData(t,i);r&&(d(this,"data",r),d(this,"dataBeforeProcessed",r.cloneShallow()))},fillDataTextStyle:function(t){if(t)for(var e=0;e<t[F];e++)t[e]&&t[e].label&&o.defaultEmphasis(t[e].label,o.LABEL_OPTIONS)},getInitialData:function(){},getData:function(t){var e=p(this,"data");return null==t?e:e.getLinkedData(t)},setData:function(t){d(this,"data",t)},getRawData:function(){return p(this,"dataBeforeProcessed")},coordDimToDataDim:function(t){return[t]},dataDimToCoordDim:function(t){return t},getBaseAxis:function(){var t=this[le];return t&&t.getBaseAxis&&t.getBaseAxis()},formatTooltip:function(t,n){function r(t){var r=[];return e.each(t,function(t,e){var o,s=a.getDimensionInfo(e),u=s&&s.type;o=u===l?t+"":"time"===u?n?"":i.formatTime("yyyy/MM/dd hh:mm:ss",t):m(t),o&&r.push(o)}),r.join(", ")}var a=p(this,"data"),o=this.getRawValue(t),s=v(e[S](o)?r(o):m(o)),u=a.getName(t),c=a[B](t,"color");e[V](c)&&c[D]&&(c=(c[D][0]||{}).color),c=c||"transparent";var h='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+v(c)+'"></span>',f=this.name;return"\x00-"===f&&(f=""),n?h+v(this.name)+" : "+s:(f&&v(f)+"<br />")+h+(u?v(u)+" : "+s:s)},isAnimationEnabled:function(){if(h.node)return!1;var t=this[u](H);return t&&this[ue]().count()>this[u]("animationThreshold")&&(t=!1),t},restoreData:function(){d(this,"data",p(this,"dataBeforeProcessed").cloneShallow())},getColorFromPalette:function(t,e){var i=this[r],n=c.getColorFromPalette.call(this,t,e);return n||(n=i.getColorFromPalette(t,e)),n},getAxisTooltipDataIndex:null,getTooltipPosition:null});return e.mixin(g,o.dataFormatMixin),e.mixin(g,c),g}),e("echarts/view/Component",[he,"zrender/container/Group","../util/component","../util/clazz"],function(t){var e=t("zrender/container/Group"),i=t("../util/component"),n=t("../util/clazz"),r=function(){this.group=new e,this.uid=i.getUID("viewComponent")};r[W]={constructor:r,init:function(){},render:function(){},dispose:function(){}};var a=r[W];return a.updateView=a.updateLayout=a.updateVisual=function(){},n.enableClassExtend(r),n.enableClassManagement(r,{registerWhenExtend:!0}),r}),e("echarts/view/Chart",[he,"zrender/container/Group","../util/component","../util/clazz","../util/model",ce],function(t){function e(){this.group=new r,this.uid=a.getUID("viewChart")}function i(t,e){if(t&&(t[I](e),"group"===t.type))for(var n=0;n<t.childCount();n++)i(t.childAt(n),e)}function n(t,e,n){var r=s.queryDataIndex(t,e);null!=r?l.each(s.normalizeToArray(r),function(e){i(t[f](e),n)}):t.eachItemGraphicEl(function(t){i(t,n)})}var r=t("zrender/container/Group"),a=t("../util/component"),o=t("../util/clazz"),s=t("../util/model"),l=t(ce);e[W]={type:"chart",init:function(){},render:function(){},highlight:function(t,e,i,r){n(t[ue](),r,"emphasis")},downplay:function(t,e,i,r){n(t[ue](),r,p)},remove:function(){this.group.removeAll()},dispose:function(){}};var u=e[W];return u.updateView=u.updateLayout=u.updateVisual=function(t,e,i,n){this.render(t,e,i,n)},o.enableClassExtend(e,["dispose"]),o.enableClassManagement(e,{registerWhenExtend:!0}),e}),e("echarts/util/throttle",[],function(){var t={},e="\x00__throttleOriginMethod",i="\x00__throttleRate",n="\x00__throttleType";return t.throttle=function(t,e,i){function n(){u=(new Date).getTime(),c=null,t.apply(o,s||[])}var r,a,o,s,l=0,u=0,c=null;e=e||0;var h=function(){r=(new Date).getTime(),o=this,s=arguments,a=r-(i?l:u)-e,clearTimeout(c),i?c=setTimeout(n,e):a>=0?n():c=setTimeout(n,-a),l=r
};return h.clear=function(){c&&(clearTimeout(c),c=null)},h},t.createOrUpdate=function(r,a,o,s){var l=r[a];if(l){var u=l[e]||l,c=l[n],h=l[i];if(h!==o||c!==s){if(null==o||!s)return r[a]=u;l=r[a]=t.throttle(u,o,"debounce"===s),l[e]=u,l[n]=s,l[i]=o}return l}},t.clear=function(t,i){var n=t[i];n&&n[e]&&(t[i]=n[e])},t}),e("echarts/util/model",[he,"./format","./number","../model/Model",ce],function(t){function e(t,e){return t&&t.hasOwnProperty(e)}var i=t("./format"),n=t("./number"),r=t("../model/Model"),o=t(ce),s=o.each,u=o[V],h={};return h.normalizeToArray=function(t){return t instanceof Array?t:null==t?[]:[t]},h.defaultEmphasis=function(t,e){if(t){var i=t.emphasis=t.emphasis||{},n=t[p]=t[p]||{};s(e,function(t){var e=o[m](i[t],n[t]);null!=e&&(i[t]=e)})}},h.LABEL_OPTIONS=[j,c,"show",ae,"distance","formatter"],h.getDataItemValue=function(t){return t&&(null==t.value?t:t.value)},h.isDataItemOption=function(t){return u(t)&&!(t instanceof Array)},h.converDataValue=function(t,e){var i=e&&e.type;return i===l?t:("time"!==i||isFinite(t)||null==t||"-"===t||(t=+n.parseDate(t)),null==t||""===t?0/0:+t)},h.createDataFormatModel=function(t,e){var i=new r;return o.mixin(i,h.dataFormatMixin),i.seriesIndex=e.seriesIndex,i.name=e.name||"",i.mainType=e.mainType,i.subType=e.subType,i[ue]=function(){return t},i},h.dataFormatMixin={getDataParams:function(t,e){var i=this[ue](e),n=this.seriesIndex,r=this.name,a=this.getRawValue(t,e),o=i.getRawIndex(t),s=i.getName(t,!0),l=i.getRawDataItem(t);return{componentType:this.mainType,componentSubType:this.subType,seriesType:"series"===this.mainType?this.subType:null,seriesIndex:n,seriesName:r,name:s,dataIndex:o,data:l,dataType:e,value:a,color:i[B](t,"color"),$vars:["seriesName","name","value"]}},getFormattedLabel:function(t,e,n,r){e=e||p;var a=this[ue](n),o=a[d](t),s=this[A](t,n);null!=r&&s.value instanceof Array&&(s.value=s.value[r]);var l=o.get(["label",e,"formatter"]);return typeof l===T?(s.status=e,l(s)):typeof l===q?i.formatTpl(l,s):void 0},getRawValue:function(t,e){var i=this[ue](e),n=i.getRawDataItem(t);return null!=n?!u(n)||n instanceof Array?n:n.value:void 0},formatTooltip:o.noop},h.mappingToExists=function(t,e){e=(e||[]).slice();var i=o.map(t||[],function(t){return{exist:t}});return s(e,function(t,n){if(u(t)){for(var r=0;r<i[F];r++)if(!i[r][a]&&null!=t.id&&i[r].exist.id===t.id+"")return i[r][a]=t,void(e[n]=null);for(var r=0;r<i[F];r++){var o=i[r].exist;if(!(i[r][a]||null!=o.id&&null!=t.id||null==t.name||h.isIdInner(t)||h.isIdInner(o)||o.name!==t.name+""))return i[r][a]=t,void(e[n]=null)}}}),s(e,function(t){if(u(t)){for(var e=0;e<i[F];e++){var n=i[e].exist;if(!i[e][a]&&!h.isIdInner(n)&&null==t.id){i[e][a]=t;break}}e>=i[F]&&i.push({option:t})}}),i},h.makeIdAndName=function(t){var e={};s(t,function(t){var i=t.exist;i&&(e[i.id]=t)}),s(t,function(t){var i=t[a];o.assert(!i||null==i.id||!e[i.id]||e[i.id]===t,"id duplicates: "+(i&&i.id)),i&&null!=i.id&&(e[i.id]=t),!t.keyInfo&&(t.keyInfo={})}),s(t,function(t){var i=t.exist,n=t[a],r=t.keyInfo;if(u(n)){if(r.name=null!=n.name?n.name+"":i?i.name:"\x00-",i)r.id=i.id;else if(null!=n.id)r.id=n.id+"";else{var o=0;do r.id="\x00"+r.name+"\x00"+o++;while(e[r.id])}e[r.id]=t}})},h.isIdInner=function(t){return u(t)&&t.id&&0===(t.id+"")[N]("\x00_ec_\x00")},h.compressBatches=function(t,e){function i(t,e,i){for(var n=0,r=t[F];r>n;n++)for(var a=t[n].seriesId,o=h.normalizeToArray(t[n][R]),s=i&&i[a],l=0,u=o[F];u>l;l++){var c=o[l];s&&s[c]?s[c]=null:(e[a]||(e[a]={}))[c]=1}}function n(t,e){var i=[];for(var r in t)if(t.hasOwnProperty(r)&&null!=t[r])if(e)i.push(+r);else{var a=n(t[r],!0);a[F]&&i.push({seriesId:r,dataIndex:a})}return i}var r={},a={};return i(t||[],r),i(e||[],a,r),[n(r),n(a)]},h.queryDataIndex=function(t,e){return null!=e.dataIndexInside?e.dataIndexInside:null!=e[R]?o[S](e[R])?o.map(e[R],function(e){return t.indexOfRawIndex(e)}):t.indexOfRawIndex(e[R]):null!=e.name?o[S](e.name)?o.map(e.name,function(e){return t.indexOfName(e)}):t.indexOfName(e.name):void 0},h.parseFinder=function(t,i,n){if(o.isString(i)){var r={};r[i+"Index"]=0,i=r}var a=n&&n.defaultMainType;!a||e(i,a+"Index")||e(i,a+"Id")||e(i,a+"Name")||(i[a+"Index"]=0);var l={};return s(i,function(e,n){var e=i[n];if(n===R||"dataIndexInside"===n)return void(l[n]=e);var r=n.match(/^(\w+)(Index|Id|Name)$/)||[],a=r[1],o=r[2];if(a&&o){var s={mainType:a};s[o[U]()]=e;var u=t.queryComponents(s);l[a+"Models"]=u,l[a+"Model"]=u[0]}}),l},h}),e("zrender/tool/color",[he],function(){function t(t){return t=Math.round(t),0>t?0:t>255?255:t}function e(t){return t=Math.round(t),0>t?0:t>360?360:t}function i(t){return 0>t?0:t>1?1:t}function n(e){return t(e[F]&&"%"===e.charAt(e[F]-1)?parseFloat(e)/100*255:parseInt(e,10))}function r(t){return i(t[F]&&"%"===t.charAt(t[F]-1)?parseFloat(t)/100:parseFloat(t))}function a(t,e,i){return 0>i?i+=1:i>1&&(i-=1),1>6*i?t+(e-t)*i*6:1>2*i?e:2>3*i?t+(e-t)*(2/3-i)*6:t}function o(t,e,i){return t+(e-t)*i}function s(t){if(t){t+="";var e=t[M](/ /g,"")[U]();if(e in g)return g[e].slice();if("#"!==e.charAt(0)){var i=e[N]("("),a=e[N](")");if(-1!==i&&a+1===e[F]){var o=e.substr(0,i),s=e.substr(i+1,a-(i+1)).split(","),u=1;switch(o){case"rgba":if(4!==s[F])return;u=r(s.pop());case"rgb":if(3!==s[F])return;return[n(s[0]),n(s[1]),n(s[2]),u];case"hsla":if(4!==s[F])return;return s[3]=r(s[3]),l(s);case"hsl":if(3!==s[F])return;return l(s);default:return}}}else{if(4===e[F]){var c=parseInt(e.substr(1),16);if(!(c>=0&&4095>=c))return;return[(3840&c)>>4|(3840&c)>>8,240&c|(240&c)>>4,15&c|(15&c)<<4,1]}if(7===e[F]){var c=parseInt(e.substr(1),16);if(!(c>=0&&16777215>=c))return;return[(16711680&c)>>16,(65280&c)>>8,255&c,1]}}}}function l(e){var i=(parseFloat(e[0])%360+360)%360/360,n=r(e[1]),o=r(e[2]),s=.5>=o?o*(n+1):o+n-o*n,l=2*o-s,u=[t(255*a(l,s,i+1/3)),t(255*a(l,s,i)),t(255*a(l,s,i-1/3))];return 4===e[F]&&(u[3]=e[3]),u}function u(t){if(t){var e,i,n=t[0]/255,r=t[1]/255,a=t[2]/255,o=Math.min(n,r,a),s=Math.max(n,r,a),l=s-o,u=(s+o)/2;if(0===l)e=0,i=0;else{i=.5>u?l/(s+o):l/(2-s-o);var c=((s-n)/6+l/2)/l,h=((s-r)/6+l/2)/l,f=((s-a)/6+l/2)/l;n===s?e=f-h:r===s?e=1/3+c-f:a===s&&(e=2/3+h-c),0>e&&(e+=1),e>1&&(e-=1)}var d=[360*e,i,u];return null!=t[3]&&d.push(t[3]),d}}function c(t,e){var i=s(t);if(i){for(var n=0;3>n;n++)i[n]=0>e?i[n]*(1-e)|0:(255-i[n])*e+i[n]|0;return m(i,4===i[F]?"rgba":"rgb")}}function h(t){var e=s(t);return e?((1<<24)+(e[0]<<16)+(e[1]<<8)+ +e[2]).toString(16).slice(1):void 0}function f(e,i,n){if(i&&i[F]&&e>=0&&1>=e){n=n||[0,0,0,0];var r=e*(i[F]-1),a=Math.floor(r),s=Math.ceil(r),l=i[a],u=i[s],c=r-a;return n[0]=t(o(l[0],u[0],c)),n[1]=t(o(l[1],u[1],c)),n[2]=t(o(l[2],u[2],c)),n[3]=t(o(l[3],u[3],c)),n}}function d(e,n,r){if(n&&n[F]&&e>=0&&1>=e){var a=e*(n[F]-1),l=Math.floor(a),u=Math.ceil(a),c=s(n[l]),h=s(n[u]),f=a-l,d=m([t(o(c[0],h[0],f)),t(o(c[1],h[1],f)),t(o(c[2],h[2],f)),i(o(c[3],h[3],f))],"rgba");return r?{color:d,leftIndex:l,rightIndex:u,value:a}:d}}function p(t,i,n,a){return t=s(t),t?(t=u(t),null!=i&&(t[0]=e(i)),null!=n&&(t[1]=r(n)),null!=a&&(t[2]=r(a)),m(l(t),"rgba")):void 0}function v(t,e){return t=s(t),t&&null!=e?(t[3]=i(e),m(t,"rgba")):void 0}function m(t,e){var i=t[0]+","+t[1]+","+t[2];return("rgba"===e||"hsva"===e||"hsla"===e)&&(i+=","+t[3]),e+"("+i+")"}var g={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};return{parse:s,lift:c,toHex:h,fastMapToColor:f,mapToColor:d,modifyHSL:p,modifyAlpha:v,stringify:m}}),e("zrender/zrender",[he,"./core/guid","./core/env","./core/util","./Handler","./Storage","./animation/Animation","./dom/HandlerProxy","./Painter"],function(t){function e(t){delete h[t]}var i=t("./core/guid"),n=t("./core/env"),r=t("./core/util"),a=t("./Handler"),o=t("./Storage"),s=t("./animation/Animation"),l=t("./dom/HandlerProxy"),u=!n.canvasSupported,c={canvas:t("./Painter")},h={},f={};f.version="3.3.0",f.init=function(t,e){var n=new d(i(),t,e);return h[n.id]=n,n},f.dispose=function(t){if(t)t.dispose();else{for(var e in h)h.hasOwnProperty(e)&&h[e].dispose();h={}}return f},f.getInstance=function(t){return h[t]},f.registerPainter=function(t,e){c[t]=e};var d=function(t,e,i){i=i||{},this.dom=e,this.id=t;var h=this,f=new o,d=i.renderer;if(u){if(!c.vml)throw new Error("You need to require 'zrender/vml/vml' to support IE8");d="vml"}else d&&c[d]||(d="canvas");var p=new c[d](e,f,i);this.storage=f,this.painter=p;var v=n.node?null:new l(p.getViewportRoot());this.handler=new a(f,p,v,p.root),this[H]=new s({stage:{update:r.bind(this.flush,this)}}),this[H].start(),this._needsRefresh;var m=f.delFromMap,g=f.addToMap;f.delFromMap=function(t){var e=f.get(t);m.call(f,t),e&&e.removeSelfFromZr(h)},f.addToMap=function(t){g.call(f,t),t.addSelfToZr(h)}};return d[W]={constructor:d,getId:function(){return this.id},add:function(t){this.storage.addRoot(t),this._needsRefresh=!0},remove:function(t){this.storage.delRoot(t),this._needsRefresh=!0},configLayer:function(t,e){this.painter.configLayer(t,e),this._needsRefresh=!0},refreshImmediately:function(){this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1},refresh:function(){this._needsRefresh=!0},flush:function(){this._needsRefresh&&this.refreshImmediately(),this._needsRefreshHover&&this.refreshHoverImmediately()},addHover:function(t,e){this.painter.addHover&&(this.painter.addHover(t,e),this.refreshHover())},removeHover:function(t){this.painter.removeHover&&(this.painter.removeHover(t),this.refreshHover())},clearHover:function(){this.painter.clearHover&&(this.painter.clearHover(),this.refreshHover())},refreshHover:function(){this._needsRefreshHover=!0},refreshHoverImmediately:function(){this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.refreshHover()},resize:function(t){t=t||{},this.painter.resize(t.width,t[ee]),this.handler.resize()},clearAnimation:function(){this[H].clear()},getWidth:function(){return this.painter[J]()},getHeight:function(){return this.painter[K]()},pathToImage:function(t,e,n){var r=i();return this.painter.pathToImage(r,t,e,n)},setCursorStyle:function(t){this.handler.setCursorStyle(t)},on:function(t,e,i){this.handler.on(t,e,i)},off:function(t,e){this.handler.off(t,e)},trigger:function(t,e){this.handler[I](t,e)},clear:function(){this.storage.delRoot(),this.painter.clear()},dispose:function(){this[H].stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this[H]=this.storage=this.painter=this.handler=null,e(this.id)}},f}),e("echarts/preprocessor/backwardCompat",[he,ce,"./helper/compatStyle"],function(t){function e(t,e){e=e.split(",");for(var i=t,n=0;n<e[F]&&(i=i&&i[e[n]],null!=i);n++);return i}function i(t,e,i,n){e=e.split(",");for(var r,a=t,o=0;o<e[F]-1;o++)r=e[o],null==a[r]&&(a[r]={}),a=a[r];(n||null==a[e[o]])&&(a[e[o]]=i)}function n(t){u(o,function(e){e[0]in t&&!(e[1]in t)&&(t[e[1]]=t[e[0]])})}var r=t(ce),a=t("./helper/compatStyle"),o=[["x","left"],["y","top"],["x2","right"],["y2",Y]],s=["grid","geo","parallel","legend","toolbox","title","visualMap","dataZoom","timeline"],l=["bar","boxplot","candlestick","chord","effectScatter","funnel","gauge","lines","graph","heatmap","line","map","parallel","pie","radar","sankey","scatter","treemap"],u=r.each;return function(t){u(t.series,function(t){if(r[V](t)){var o=t.type;if(a(t),("pie"===o||"gauge"===o)&&null!=t.clockWise&&(t.clockwise=t.clockWise),"gauge"===o){var s=e(t,"pointer.color");null!=s&&i(t,"itemStyle.normal.color",s)}for(var u=0;u<l[F];u++)if(l[u]===t.type){n(t);break}}}),t.dataRange&&(t.visualMap=t.dataRange),u(s,function(e){var i=t[e];i&&(r[S](i)||(i=[i]),u(i,function(t){n(t)}))})}}),e("echarts/visual/seriesColor",[he,"zrender/graphic/Gradient"],function(t){var e=t("zrender/graphic/Gradient");return function(t){function i(i){var n=(i.visualColorAccessPath||"itemStyle.normal.color").split("."),r=i[ue](),a=i.get(n)||i.getColorFromPalette(i.get("name"));r.setVisual("color",a),t.isSeriesFiltered(i)||(typeof a!==T||a instanceof e||r.each(function(t){r.setItemVisual(t,"color",a(i[A](t)))}),r.each(function(t){var e=r[d](t),i=e.get(n,!0);null!=i&&r.setItemVisual(t,"color",i)}))}t.eachRawSeries(i)}}),e("zrender/core/timsort",[],function(){function t(t){for(var e=0;t>=l;)e|=1&t,t>>=1;return t+e}function e(t,e,n,r){var a=e+1;if(a===n)return 1;if(r(t[a++],t[e])<0){for(;n>a&&r(t[a],t[a-1])<0;)a++;i(t,e,a)}else for(;n>a&&r(t[a],t[a-1])>=0;)a++;return a-e}function i(t,e,i){for(i--;i>e;){var n=t[e];t[e++]=t[i],t[i--]=n}}function n(t,e,i,n,r){for(n===e&&n++;i>n;n++){for(var a,o=t[n],s=e,l=n;l>s;)a=s+l>>>1,r(o,t[a])<0?l=a:s=a+1;var u=n-s;switch(u){case 3:t[s+3]=t[s+2];case 2:t[s+2]=t[s+1];case 1:t[s+1]=t[s];break;default:for(;u>0;)t[s+u]=t[s+u-1],u--}t[s]=o}}function r(t,e,i,n,r,a){var o=0,s=0,l=1;if(a(t,e[i+r])>0){for(s=n-r;s>l&&a(t,e[i+r+l])>0;)o=l,l=(l<<1)+1,0>=l&&(l=s);l>s&&(l=s),o+=r,l+=r}else{for(s=r+1;s>l&&a(t,e[i+r-l])<=0;)o=l,l=(l<<1)+1,0>=l&&(l=s);l>s&&(l=s);var u=o;o=r-l,l=r-u}for(o++;l>o;){var c=o+(l-o>>>1);a(t,e[i+c])>0?o=c+1:l=c}return l}function a(t,e,i,n,r,a){var o=0,s=0,l=1;if(a(t,e[i+r])<0){for(s=r+1;s>l&&a(t,e[i+r-l])<0;)o=l,l=(l<<1)+1,0>=l&&(l=s);l>s&&(l=s);var u=o;o=r-l,l=r-u}else{for(s=n-r;s>l&&a(t,e[i+r+l])>=0;)o=l,l=(l<<1)+1,0>=l&&(l=s);l>s&&(l=s),o+=r,l+=r}for(o++;l>o;){var c=o+(l-o>>>1);a(t,e[i+c])<0?l=c:o=c+1}return l}function o(t,e){function i(t,e){f[y]=t,d[y]=e,y+=1}function n(){for(;y>1;){var t=y-2;if(t>=1&&d[t-1]<=d[t]+d[t+1]||t>=2&&d[t-2]<=d[t]+d[t-1])d[t-1]<d[t+1]&&t--;else if(d[t]>d[t+1])break;s(t)}}function o(){for(;y>1;){var t=y-2;t>0&&d[t-1]<d[t+1]&&t--,s(t)}}function s(i){var n=f[i],o=d[i],s=f[i+1],u=d[i+1];d[i]=o+u,i===y-3&&(f[i+1]=f[i+2],d[i+1]=d[i+2]),y--;var c=a(t[s],t,n,o,0,e);n+=c,o-=c,0!==o&&(u=r(t[n+o-1],t,s,u,u-1,e),0!==u&&(u>=o?l(n,o,s,u):h(n,o,s,u)))}function l(i,n,o,s){var l=0;for(l=0;n>l;l++)_[l]=t[i+l];var c=0,h=o,f=i;if(t[f++]=t[h++],0!==--s){if(1===n){for(l=0;s>l;l++)t[f+l]=t[h+l];return void(t[f+s]=_[c])}for(var d,v,m,g=p;;){d=0,v=0,m=!1;do if(e(t[h],_[c])<0){if(t[f++]=t[h++],v++,d=0,0===--s){m=!0;break}}else if(t[f++]=_[c++],d++,v=0,1===--n){m=!0;break}while(g>(d|v));if(m)break;do{if(d=a(t[h],_,c,n,0,e),0!==d){for(l=0;d>l;l++)t[f+l]=_[c+l];if(f+=d,c+=d,n-=d,1>=n){m=!0;break}}if(t[f++]=t[h++],0===--s){m=!0;break}if(v=r(_[c],t,h,s,0,e),0!==v){for(l=0;v>l;l++)t[f+l]=t[h+l];if(f+=v,h+=v,s-=v,0===s){m=!0;break}}if(t[f++]=_[c++],1===--n){m=!0;break}g--}while(d>=u||v>=u);if(m)break;0>g&&(g=0),g+=2}if(p=g,1>p&&(p=1),1===n){for(l=0;s>l;l++)t[f+l]=t[h+l];t[f+s]=_[c]}else{if(0===n)throw new Error;for(l=0;n>l;l++)t[f+l]=_[c+l]}}else for(l=0;n>l;l++)t[f+l]=_[c+l]}function h(i,n,o,s){var l=0;for(l=0;s>l;l++)_[l]=t[o+l];var c=i+n-1,h=s-1,f=o+s-1,d=0,v=0;if(t[f--]=t[c--],0!==--n){if(1===s){for(f-=n,c-=n,v=f+1,d=c+1,l=n-1;l>=0;l--)t[v+l]=t[d+l];return void(t[f]=_[h])}for(var m=p;;){var g=0,y=0,x=!1;do if(e(_[h],t[c])<0){if(t[f--]=t[c--],g++,y=0,0===--n){x=!0;break}}else if(t[f--]=_[h--],y++,g=0,1===--s){x=!0;break}while(m>(g|y));if(x)break;do{if(g=n-a(_[h],t,i,n,n-1,e),0!==g){for(f-=g,c-=g,n-=g,v=f+1,d=c+1,l=g-1;l>=0;l--)t[v+l]=t[d+l];if(0===n){x=!0;break}}if(t[f--]=_[h--],1===--s){x=!0;break}if(y=s-r(t[c],_,0,s,s-1,e),0!==y){for(f-=y,h-=y,s-=y,v=f+1,d=h+1,l=0;y>l;l++)t[v+l]=_[d+l];if(1>=s){x=!0;break}}if(t[f--]=t[c--],0===--n){x=!0;break}m--}while(g>=u||y>=u);if(x)break;0>m&&(m=0),m+=2}if(p=m,1>p&&(p=1),1===s){for(f-=n,c-=n,v=f+1,d=c+1,l=n-1;l>=0;l--)t[v+l]=t[d+l];t[f]=_[h]}else{if(0===s)throw new Error;for(d=f-(s-1),l=0;s>l;l++)t[d+l]=_[l]}}else for(d=f-(s-1),l=0;s>l;l++)t[d+l]=_[l]}var f,d,p=u,v=0,m=c,g=0,y=0;v=t[F],2*c>v&&(m=v>>>1);var _=[];g=120>v?5:1542>v?10:119151>v?19:40,f=[],d=[],this.mergeRuns=n,this.forceMergeRuns=o,this.pushRun=i}function s(i,r,a,s){a||(a=0),s||(s=i[F]);var u=s-a;if(!(2>u)){var c=0;if(l>u)return c=e(i,a,s,r),void n(i,a,s,a+c,r);var h=new o(i,r),f=t(u);do{if(c=e(i,a,s,r),f>c){var d=u;d>f&&(d=f),n(i,a,a+d,a+c,r),c=d}h.pushRun(a,c),h.mergeRuns(),u-=c,a+=c}while(0!==u);h.forceMergeRuns()}}var l=32,u=7,c=256;return s}),e("zrender/mixin/Eventful",[he],function(){var t=Array[W].slice,e=function(){this._$handlers={}};return e[W]={constructor:e,one:function(t,e,i){var n=this._$handlers;if(!e||!t)return this;n[t]||(n[t]=[]);for(var r=0;r<n[t][F];r++)if(n[t][r].h===e)return this;return n[t].push({h:e,one:!0,ctx:i||this}),this},on:function(t,e,i){var n=this._$handlers;if(!e||!t)return this;n[t]||(n[t]=[]);for(var r=0;r<n[t][F];r++)if(n[t][r].h===e)return this;return n[t].push({h:e,one:!1,ctx:i||this}),this},isSilent:function(t){var e=this._$handlers;return e[t]&&e[t][F]},off:function(t,e){var i=this._$handlers;if(!t)return this._$handlers={},this;if(e){if(i[t]){for(var n=[],r=0,a=i[t][F];a>r;r++)i[t][r].h!=e&&n.push(i[t][r]);i[t]=n}i[t]&&0===i[t][F]&&delete i[t]}else delete i[t];return this},trigger:function(e){if(this._$handlers[e]){var i=arguments,n=i[F];n>3&&(i=t.call(i,1));for(var r=this._$handlers[e],a=r[F],o=0;a>o;){switch(n){case 1:r[o].h.call(r[o].ctx);break;case 2:r[o].h.call(r[o].ctx,i[1]);break;case 3:r[o].h.call(r[o].ctx,i[1],i[2]);break;default:r[o].h.apply(r[o].ctx,i)}r[o].one?(r[L](o,1),a--):o++}}return this},triggerWithContext:function(e){if(this._$handlers[e]){var i=arguments,n=i[F];n>4&&(i=t.call(i,1,i[F]-1));for(var r=i[i[F]-1],a=this._$handlers[e],o=a[F],s=0;o>s;){switch(n){case 1:a[s].h.call(r);break;case 2:a[s].h.call(r,i[1]);break;case 3:a[s].h.call(r,i[1],i[2]);break;default:a[s].h.apply(r,i)}a[s].one?(a[L](s,1),o--):s++}}return this}},e}),e("echarts/loading/default",[he,"../util/graphic",ce],function(t){var e=t("../util/graphic"),i=t(ce),n=Math.PI;return function(t,r){r=r||{},i[se](r,{text:"loading",color:"#c23531",textColor:"#000",maskColor:"rgba(255, 255, 255, 0.8)",zlevel:0});var a=new e.Rect({style:{fill:r.maskColor},zlevel:r[C],z:1e4}),o=new e.Arc({shape:{startAngle:-n/2,endAngle:-n/2+.1,r:10},style:{stroke:r.color,lineCap:"round",lineWidth:5},zlevel:r[C],z:10001}),s=new e.Rect({style:{fill:"none",text:r.text,textPosition:"right",textDistance:10,textFill:r.textColor},zlevel:r[C],z:10001});o.animateShape(!0).when(1e3,{endAngle:3*n/2}).start("circularInOut"),o.animateShape(!0).when(1e3,{startAngle:3*n/2}).delay(300).start("circularInOut");var l=new e.Group;return l.add(o),l.add(s),l.add(a),l.resize=function(){var e=t[J]()/2,i=t[K]()/2;o.setShape({cx:e,cy:i});var n=o.shape.r;s.setShape({x:e-n,y:i-n,width:2*n,height:2*n}),a.setShape({x:0,y:0,width:t[J](),height:t[K]()})},l.resize(),l}}),e("echarts/data/List",[he,"../model/Model","./DataDiffer",ce,"../util/model"],function(t){function e(t){return v[S](t)||(t=[t]),t}function i(t,e){var i=t.dimensions,n=new b(v.map(i,t.getDimensionInfo,t),t.hostModel);x(n,t);for(var r=n._storage={},a=t._storage,o=0;o<i[F];o++){var s=i[o],l=a[s];r[s]=v[N](e,s)>=0?new l.constructor(a[s][F]):a[s]}return n}var a=n,o=typeof window===n?global:window,s=typeof o.Float64Array===a?Array:o.Float64Array,u=typeof o.Int32Array===a?Array:o.Int32Array,c={"float":s,"int":u,ordinal:Array,number:Array,time:Array},h=t("../model/Model"),p=t("./DataDiffer"),v=t(ce),m=t("../util/model"),g=v[V],_=["stackedOn","hasItemOption","_nameList","_idList","_rawData"],x=function(t,e){v.each(_[y](e.__wrappedMethods||[]),function(i){e.hasOwnProperty(i)&&(t[i]=e[i])}),t.__wrappedMethods=e.__wrappedMethods},b=function(t,e){t=t||["x","y"];for(var i={},n=[],r=0;r<t[F];r++){var a,o={};typeof t[r]===q?(a=t[r],o={name:a,stackable:!1,type:"number"}):(o=t[r],a=o.name,o.type=o.type||w),n.push(a),i[a]=o}this.dimensions=n,this._dimensionInfos=i,this.hostModel=e,this.dataType,this.indices=[],this._storage={},this._nameList=[],this._idList=[],this._optionModels=[],this.stackedOn=null,this._visual={},this._layout={},this._itemVisuals=[],this._itemLayouts=[],this._graphicEls=[],this._rawData,this._extent},M=b[W];M.type="list",M.hasItemOption=!0,M.getDimension=function(t){return isNaN(t)||(t=this.dimensions[t]||t),t},M.getDimensionInfo=function(t){return v.clone(this._dimensionInfos[this.getDimension(t)])},M.initData=function(t,e,i){t=t||[],this._rawData=t;var n=this._storage={},r=this.indices=[],a=this.dimensions,o=t[F],s=this._dimensionInfos,l=[],u={};e=e||[];for(var h=0;h<a[F];h++){var f=s[a[h]],d=c[f.type];n[a[h]]=new d(o)}var p=this;i||(p.hasItemOption=!1),i=i||function(t,e,i,n){var r=m.getDataItemValue(t);return m.isDataItemOption(t)&&(p.hasItemOption=!0),m.converDataValue(r instanceof Array?r[n]:r,s[e])};for(var v=0;v<t[F];v++){for(var g=t[v],y=0;y<a[F];y++){var _=a[y],x=n[_];x[v]=i(g,_,v,y)}r.push(v)}for(var h=0;h<t[F];h++){e[h]||t[h]&&null!=t[h].name&&(e[h]=t[h].name);var b=e[h]||"",w=t[h]&&t[h].id;!w&&b&&(u[b]=u[b]||0,w=b,u[b]>0&&(w+="__ec__"+u[b]),u[b]++),w&&(l[h]=w)}this._nameList=e,this._idList=l},M.count=function(){return this.indices[F]},M.get=function(t,e,i){var n=this._storage,r=this.indices[e];if(null==r)return 0/0;var a=n[t]&&n[t][r];if(i){var o=this._dimensionInfos[t];if(o&&o.stackable)for(var s=this.stackedOn;s;){var l=s.get(t,e);(a>=0&&l>0||0>=a&&0>l)&&(a+=l),s=s.stackedOn}}return a},M.getValues=function(t,e,i){var n=[];v[S](t)||(i=e,e=t,t=this.dimensions);for(var r=0,a=t[F];a>r;r++)n.push(this.get(t[r],e,i));return n},M.hasValue=function(t){for(var e=this.dimensions,i=this._dimensionInfos,n=0,r=e[F];r>n;n++)if(i[e[n]].type!==l&&isNaN(this.get(e[n],t)))return!1;return!0},M.getDataExtent=function(t,e,i){t=this.getDimension(t);var n=this._storage[t],r=this.getDimensionInfo(t);e=r&&r.stackable&&e;var a,o=(this._extent||(this._extent={}))[t+!!e];if(o)return o;if(n){for(var s=1/0,l=-1/0,u=0,c=this.count();c>u;u++)a=this.get(t,u,e),(!i||i(a,t,u))&&(s>a&&(s=a),a>l&&(l=a));return this._extent[t+!!e]=[s,l]}return[1/0,-1/0]},M.getSum=function(t,e){var i=this._storage[t],n=0;if(i)for(var r=0,a=this.count();a>r;r++){var o=this.get(t,r,e);isNaN(o)||(n+=o)}return n},M[N]=function(t,e){var i=this._storage,n=i[t],r=this.indices;if(n)for(var a=0,o=r[F];o>a;a++){var s=r[a];if(n[s]===e)return a}return-1},M.indexOfName=function(t){for(var e=this.indices,i=this._nameList,n=0,r=e[F];r>n;n++){var a=e[n];if(i[a]===t)return n}return-1},M.indexOfRawIndex=function(t){var e=this.indices,i=e[t];if(null!=i&&i===t)return t;for(var n=0,r=e[F]-1;r>=n;){var a=(n+r)/2|0;if(e[a]<t)n=a+1;else{if(!(e[a]>t))return a;r=a-1}}return-1},M.indexOfNearest=function(t,e,i,n){var r=this._storage,a=r[t];null==n&&(n=1/0);var o=-1;if(a)for(var s=Number.MAX_VALUE,l=0,u=this.count();u>l;l++){var c=e-this.get(t,l,i),h=Math.abs(c);n>=c&&(s>h||h===s&&c>0)&&(s=h,o=l)}return o},M.getRawIndex=function(t){var e=this.indices[t];return null==e?-1:e},M.getRawDataItem=function(t){return this._rawData[this.getRawIndex(t)]},M.getName=function(t){return this._nameList[this.indices[t]]||""},M.getId=function(t){return this._idList[this.indices[t]]||this.getRawIndex(t)+""},M.each=function(t,i,n,r){typeof t===T&&(r=n,n=i,i=t,t=[]),t=v.map(e(t),this.getDimension,this);var a=[],o=t[F],s=this.indices;r=r||this;for(var l=0;l<s[F];l++)switch(o){case 0:i.call(r,l);break;case 1:i.call(r,this.get(t[0],l,n),l);break;case 2:i.call(r,this.get(t[0],l,n),this.get(t[1],l,n),l);break;default:for(var u=0;o>u;u++)a[u]=this.get(t[u],l,n);a[u]=l,i.apply(r,a)}},M.filterSelf=function(t,i,n,r){typeof t===T&&(r=n,n=i,i=t,t=[]),t=v.map(e(t),this.getDimension,this);var a=[],o=[],s=t[F],l=this.indices;r=r||this;for(var u=0;u<l[F];u++){var c;if(1===s)c=i.call(r,this.get(t[0],u,n),u);else{for(var h=0;s>h;h++)o[h]=this.get(t[h],u,n);o[h]=u,c=i.apply(r,o)}c&&a.push(l[u])}return this.indices=a,this._extent={},this},M.mapArray=function(t,e,i,n){typeof t===T&&(n=i,i=e,e=t,t=[]);var r=[];return this.each(t,function(){r.push(e&&e.apply(this,arguments))},i,n),r},M.map=function(t,n,r,a){t=v.map(e(t),this.getDimension,this);var o=i(this,t),s=o.indices=this.indices,l=o._storage,u=[];return this.each(t,function(){var e=arguments[arguments[F]-1],i=n&&n.apply(this,arguments);if(null!=i){typeof i===w&&(u[0]=i,i=u);for(var r=0;r<i[F];r++){var a=t[r],o=l[a],c=s[e];o&&(o[c]=i[r])}}},r,a),o},M.downSample=function(t,e,n,r){for(var a=i(this,[t]),o=this._storage,s=a._storage,l=this.indices,u=a.indices=[],c=[],h=[],f=Math.floor(1/e),d=s[t],p=this.count(),v=0;v<o[t][F];v++)s[t][v]=o[t][v];for(var v=0;p>v;v+=f){f>p-v&&(f=p-v,c[F]=f);for(var m=0;f>m;m++){var g=l[v+m];c[m]=d[g],h[m]=g}var y=n(c),g=h[r(c,y)||0];d[g]=y,u.push(g)}return a},M[d]=function(t){var e=this.hostModel;return t=this.indices[t],new h(this._rawData[t],e,e&&e[r])},M.diff=function(t){var e,i=this._idList,n=t&&t._idList,r="e\x00\x00";return new p(t?t.indices:[],this.indices,function(t){return null!=(e=n[t])?e:r+t},function(t){return null!=(e=i[t])?e:r+t})},M.getVisual=function(t){var e=this._visual;return e&&e[t]},M.setVisual=function(t,e){if(g(t))for(var i in t)t.hasOwnProperty(i)&&this.setVisual(i,t[i]);else this._visual=this._visual||{},this._visual[t]=e},M.setLayout=function(t,e){if(g(t))for(var i in t)t.hasOwnProperty(i)&&this.setLayout(i,t[i]);else this._layout[t]=e},M.getLayout=function(t){return this._layout[t]},M.getItemLayout=function(t){return this._itemLayouts[t]},M.setItemLayout=function(t,e,i){this._itemLayouts[t]=i?v[z](this._itemLayouts[t]||{},e):e},M.clearItemLayouts=function(){this._itemLayouts[F]=0},M[B]=function(t,e,i){var n=this._itemVisuals[t],r=n&&n[e];return null!=r||i?r:this.getVisual(e)},M.setItemVisual=function(t,e,i){var n=this._itemVisuals[t]||{};if(this._itemVisuals[t]=n,g(e))for(var r in e)e.hasOwnProperty(r)&&(n[r]=e[r]);else n[e]=i},M.clearAllVisual=function(){this._visual={},this._itemVisuals=[]};var C=function(t){t.seriesIndex=this.seriesIndex,t[R]=this[R],t.dataType=this.dataType};return M.setItemGraphicEl=function(t,e){var i=this.hostModel;e&&(e[R]=t,e.dataType=this.dataType,e.seriesIndex=i&&i.seriesIndex,"group"===e.type&&e.traverse(C,e)),this._graphicEls[t]=e},M[f]=function(t){return this._graphicEls[t]},M.eachItemGraphicEl=function(t,e){v.each(this._graphicEls,function(i,n){i&&t&&t.call(e,i,n)})},M.cloneShallow=function(){var t=v.map(this.dimensions,this.getDimensionInfo,this),e=new b(t,this.hostModel);return e._storage=this._storage,x(e,this),e.indices=this.indices.slice(),this._extent&&(e._extent=v[z]({},this._extent)),e},M.wrapMethod=function(t,e){var i=this[t];typeof i===T&&(this.__wrappedMethods=this.__wrappedMethods||[],this.__wrappedMethods.push(t),this[t]=function(){var t=i.apply(this,arguments);return e.apply(this,[t][y](v.slice(arguments)))})},M.TRANSFERABLE_METHODS=["cloneShallow","downSample","map"],M.CHANGABLE_METHODS=["filterSelf"],b}),e("echarts/model/Model",[he,ce,"../util/clazz","zrender/core/env","./mixin/lineStyle","./mixin/areaStyle","./mixin/textStyle","./mixin/itemStyle"],function(t){function e(t,e,i){this.parentModel=e,this[r]=i,this[a]=t}function i(t,e,i){for(var n=0;n<e[F]&&(!e[n]||(t=t&&"object"==typeof t?t[e[n]]:null,null!=t));n++);return null==t&&i&&(t=i.get(e)),t}function n(t,e){var i=s.get(t,"getParent");return i?i.call(t,e):t.parentModel}var o=t(ce),s=t("../util/clazz"),l=t("zrender/core/env");e[W]={constructor:e,init:null,mergeOption:function(t){o.merge(this[a],t,!0)},get:function(t,e){return null==t?this[a]:i(this[a],this.parsePath(t),!e&&n(this,t))},getShallow:function(t,e){var i=this[a],r=null==i?i:i[t],o=!e&&n(this,t);return null==r&&o&&(r=o[u](t)),r},getModel:function(t,o){var s,l=null==t?this[a]:i(this[a],t=this.parsePath(t));return o=o||(s=n(this,t))&&s[oe](t),new e(l,o,this[r])},isEmpty:function(){return null==this[a]},restoreData:function(){},clone:function(){var t=this.constructor;return new t(o.clone(this[a]))},setReadOnly:function(t){s.setReadOnly(this,t)},parsePath:function(t){return typeof t===q&&(t=t.split(".")),t},customizeGetParent:function(t){s.set(this,"getParent",t)},isAnimationEnabled:function(){if(!l.node){if(null!=this[a][H])return!!this[a][H];if(this.parentModel)return this.parentModel.isAnimationEnabled()}}},s.enableClassExtend(e);var c=o.mixin;return c(e,t("./mixin/lineStyle")),c(e,t("./mixin/areaStyle")),c(e,t("./mixin/textStyle")),c(e,t("./mixin/itemStyle")),e}),e("echarts/util/format",[he,ce,"./number","zrender/contain/text"],function(t){var e=t(ce),i=t("./number"),n=t("zrender/contain/text"),r={};r.addCommas=function(t){return isNaN(t)?"-":(t=(t+"").split("."),t[0][M](/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,")+(t[F]>1?"."+t[1]:""))},r.toCamelCase=function(t,e){return t=(t||"")[U]()[M](/-(.)/g,function(t,e){return e.toUpperCase()}),e&&t&&(t=t.charAt(0).toUpperCase()+t.slice(1)),t},r.normalizeCssArray=function(t){var e=t[F];return typeof t===w?[t,t,t,t]:2===e?[t[0],t[1],t[0],t[1]]:3===e?[t[0],t[1],t[2],t[1]]:t};var a=r.encodeHTML=function(t){return String(t)[M](/&/g,"&amp;")[M](/</g,"&lt;")[M](/>/g,"&gt;")[M](/"/g,"&quot;")[M](/'/g,"&#39;")
},o=["a","b","c","d","e","f","g"],s=function(t,e){return"{"+t+(null==e?"":e)+"}"};r.formatTpl=function(t,i,n){e[S](i)||(i=[i]);var r=i[F];if(!r)return"";for(var l=i[0].$vars||[],u=0;u<l[F];u++){var c=o[u],h=s(c,0);t=t[M](s(c),n?a(h):h)}for(var f=0;r>f;f++)for(var d=0;d<l[F];d++){var h=i[f][l[d]];t=t[M](s(o[d],f),n?a(h):h)}return t};var l=function(t){return 10>t?"0"+t:t};return r.formatTime=function(t,e){("week"===t||"month"===t||"quarter"===t||"half-year"===t||"year"===t)&&(t="MM-dd\nyyyy");var n=i.parseDate(e),r=n.getFullYear(),a=n.getMonth()+1,o=n.getDate(),s=n.getHours(),u=n.getMinutes(),c=n.getSeconds();return t=t[M]("MM",l(a))[U]()[M]("yyyy",r)[M]("yy",r%100)[M]("dd",l(o))[M]("d",o)[M]("hh",l(s))[M]("h",s)[M]("mm",l(u))[M]("m",u)[M]("ss",l(c))[M]("s",c)},r.capitalFirst=function(t){return t?t.charAt(0).toUpperCase()+t.substr(1):t},r.truncateText=n.truncateText,r}),e("zrender/core/matrix",[],function(){var t=typeof Float32Array===n?Array:Float32Array,e={create:function(){var i=new t(6);return e.identity(i),i},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},mul:function(t,e,i){var n=e[0]*i[0]+e[2]*i[1],r=e[1]*i[0]+e[3]*i[1],a=e[0]*i[2]+e[2]*i[3],o=e[1]*i[2]+e[3]*i[3],s=e[0]*i[4]+e[2]*i[5]+e[4],l=e[1]*i[4]+e[3]*i[5]+e[5];return t[0]=n,t[1]=r,t[2]=a,t[3]=o,t[4]=s,t[5]=l,t},translate:function(t,e,i){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4]+i[0],t[5]=e[5]+i[1],t},rotate:function(t,e,i){var n=e[0],r=e[2],a=e[4],o=e[1],s=e[3],l=e[5],u=Math.sin(i),c=Math.cos(i);return t[0]=n*c+o*u,t[1]=-n*u+o*c,t[2]=r*c+s*u,t[3]=-r*u+c*s,t[4]=c*a+u*l,t[5]=c*l-u*a,t},scale:function(t,e,i){var n=i[0],r=i[1];return t[0]=e[0]*n,t[1]=e[1]*r,t[2]=e[2]*n,t[3]=e[3]*r,t[4]=e[4]*n,t[5]=e[5]*r,t},invert:function(t,e){var i=e[0],n=e[2],r=e[4],a=e[1],o=e[3],s=e[5],l=i*o-a*n;return l?(l=1/l,t[0]=o*l,t[1]=-a*l,t[2]=-n*l,t[3]=i*l,t[4]=(n*s-o*r)*l,t[5]=(a*r-i*s)*l,t):null}};return e}),e("echarts/util/number",[he],function(){function t(t){return t[M](/^\s+/,"")[M](/\s+$/,"")}var e={},i=1e-4;return e.linearMap=function(t,e,i,n){var r=e[1]-e[0],a=i[1]-i[0];if(0===r)return 0===a?i[0]:(i[0]+i[1])/2;if(n)if(r>0){if(t<=e[0])return i[0];if(t>=e[1])return i[1]}else{if(t>=e[0])return i[0];if(t<=e[1])return i[1]}else{if(t===e[0])return i[0];if(t===e[1])return i[1]}return(t-e[0])/r*a+i[0]},e.parsePercent=function(e,i){switch(e){case $:case Q:e="50%";break;case"left":case"top":e="0%";break;case"right":case Y:e="100%"}return typeof e===q?t(e).match(/%$/)?parseFloat(e)/100*i:parseFloat(e):null==e?0/0:+e},e.round=function(t,e){return null==e&&(e=10),e=Math.min(Math.max(0,e),20),+(+t).toFixed(e)},e.asc=function(t){return t.sort(function(t,e){return t-e}),t},e.getPrecision=function(t){if(t=+t,isNaN(t))return 0;for(var e=1,i=0;Math.round(t*e)/e!==t;)e*=10,i++;return i},e.getPrecisionSafe=function(t){var e=t.toString(),i=e[N](".");return 0>i?0:e[F]-1-i},e.getPixelPrecision=function(t,e){var i=Math.log,n=Math.LN10,r=Math.floor(i(t[1]-t[0])/n),a=Math.round(i(Math.abs(e[1]-e[0]))/n),o=Math.min(Math.max(-r+a,0),20);return isFinite(o)?o:20},e.MAX_SAFE_INTEGER=9007199254740991,e.remRadian=function(t){var e=2*Math.PI;return(t%e+e)%e},e.isRadianAroundZero=function(t){return t>-i&&i>t},e.parseDate=function(t){if(t instanceof Date)return t;if(typeof t===q){var e=new Date(t);return isNaN(+e)&&(e=new Date(new Date(t[M](/-/g,"/"))-new Date("1970/01/01"))),e}return new Date(Math.round(t))},e.quantity=function(t){return Math.pow(10,Math.floor(Math.log(t)/Math.LN10))},e.nice=function(t,i){var n,r=e.quantity(t),a=t/r;return n=i?1.5>a?1:2.5>a?2:4>a?3:7>a?5:10:1>a?1:2>a?2:3>a?3:5>a?5:10,n*r},e.reformIntervals=function(t){function e(t,i,n){return t.interval[n]<i.interval[n]||t.interval[n]===i.interval[n]&&(t.close[n]-i.close[n]===(n?-1:1)||!n&&e(t,i,1))}t.sort(function(t,i){return e(t,i,0)?-1:1});for(var i=-1/0,n=1,r=0;r<t[F];){for(var a=t[r].interval,o=t[r].close,s=0;2>s;s++)a[s]<=i&&(a[s]=i,o[s]=s?1:1-n),i=a[s],n=o[s];a[0]===a[1]&&o[0]*o[1]!==1?t[L](r,1):r++}return t},e.isNumeric=function(t){return t-parseFloat(t)>=0},e}),e("zrender/core/vector",[],function(){var t=typeof Float32Array===n?Array:Float32Array,e={create:function(e,i){var n=new t(2);return null==e&&(e=0),null==i&&(i=0),n[0]=e,n[1]=i,n},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t},clone:function(e){var i=new t(2);return i[0]=e[0],i[1]=e[1],i},set:function(t,e,i){return t[0]=e,t[1]=i,t},add:function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t},scaleAndAdd:function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t},sub:function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t},len:function(t){return Math.sqrt(this.lenSquare(t))},lenSquare:function(t){return t[0]*t[0]+t[1]*t[1]},mul:function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t},div:function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t},dot:function(t,e){return t[0]*e[0]+t[1]*e[1]},scale:function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t},normalize:function(t,i){var n=e.len(i);return 0===n?(t[0]=0,t[1]=0):(t[0]=i[0]/n,t[1]=i[1]/n),t},distance:function(t,e){return Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1]))},distanceSquare:function(t,e){return(t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])},negate:function(t,e){return t[0]=-e[0],t[1]=-e[1],t},lerp:function(t,e,i,n){return t[0]=e[0]+n*(i[0]-e[0]),t[1]=e[1]+n*(i[1]-e[1]),t},applyTransform:function(t,e,i){var n=e[0],r=e[1];return t[0]=i[0]*n+i[2]*r+i[4],t[1]=i[1]*n+i[3]*r+i[5],t},min:function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t},max:function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t}};return e[F]=e.len,e.lengthSquare=e.lenSquare,e.dist=e.distance,e.distSquare=e.distanceSquare,e}),e("echarts/scale/Scale",[he,"../util/clazz"],function(t){function e(){this._extent=[1/0,-1/0],this._interval=0,this.init&&this.init.apply(this,arguments)}var i=t("../util/clazz"),n=e[W];return n.parse=function(t){return t},n[x]=function(t){var e=this._extent;return t>=e[0]&&t<=e[1]},n.normalize=function(t){var e=this._extent;return e[1]===e[0]?.5:(t-e[0])/(e[1]-e[0])},n.scale=function(t){var e=this._extent;return t*(e[1]-e[0])+e[0]},n.unionExtent=function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1])},n.unionExtentFromData=function(t,e){this.unionExtent(t.getDataExtent(e,!0))},n[_]=function(){return this._extent.slice()},n.setExtent=function(t,e){var i=this._extent;isNaN(t)||(i[0]=t),isNaN(e)||(i[1]=e)},n.getTicksLabels=function(){for(var t=[],e=this.getTicks(),i=0;i<e[F];i++)t.push(this.getLabel(e[i]));return t},i.enableClassExtend(e),i.enableClassManagement(e,{registerWhenExtend:!0}),e}),e("echarts/coord/cartesian/Cartesian2D",[he,ce,"./Cartesian"],function(t){function e(t){n.call(this,t)}var i=t(ce),n=t("./Cartesian");return e[W]={constructor:e,type:"cartesian2d",dimensions:["x","y"],getBaseAxis:function(){return this.getAxesByScale(l)[0]||this.getAxesByScale("time")[0]||this.getAxis("x")},containPoint:function(t){var e=this.getAxis("x"),i=this.getAxis("y");return e[x](e.toLocalCoord(t[0]))&&i[x](i.toLocalCoord(t[1]))},containData:function(t){return this.getAxis("x").containData(t[0])&&this.getAxis("y").containData(t[1])},dataToPoints:function(t,e){return t.mapArray(["x","y"],function(t,e){return this[g]([t,e])},e,this)},dataToPoint:function(t,e){var i=this.getAxis("x"),n=this.getAxis("y");return[i.toGlobalCoord(i.dataToCoord(t[0],e)),n.toGlobalCoord(n.dataToCoord(t[1],e))]},pointToData:function(t,e){var i=this.getAxis("x"),n=this.getAxis("y");return[i.coordToData(i.toLocalCoord(t[0]),e),n.coordToData(n.toLocalCoord(t[1]),e)]},getOtherAxis:function(t){return this.getAxis("x"===t.dim?"y":"x")}},i[b](e,n),e}),e("echarts/scale/Interval",[he,"../util/number","../util/format","./Scale"],function(t){var e=t("../util/number"),i=t("../util/format"),n=t("./Scale"),r=Math.floor,a=Math.ceil,o=e.getPrecisionSafe,s=e.round,l=n[z]({type:"interval",_interval:0,setExtent:function(t,e){var i=this._extent;isNaN(t)||(i[0]=parseFloat(t)),isNaN(e)||(i[1]=parseFloat(e))},unionExtent:function(t){var e=this._extent;t[0]<e[0]&&(e[0]=t[0]),t[1]>e[1]&&(e[1]=t[1]),l[W].setExtent.call(this,e[0],e[1])},getInterval:function(){return this._interval||this.niceTicks(),this._interval},setInterval:function(t){this._interval=t,this._niceExtent=this._extent.slice()},getTicks:function(){this._interval||this.niceTicks();var t=this._interval,e=this._extent,i=[],n=1e4;if(t){var r=this._niceExtent,a=o(t)+2;e[0]<r[0]&&i.push(e[0]);for(var l=r[0];l<=r[1];)if(i.push(l),l=s(l+t,a),i[F]>n)return[];e[1]>(i[F]?i[i[F]-1]:r[1])&&i.push(e[1])}return i},getTicksLabels:function(){for(var t=[],e=this.getTicks(),i=0;i<e[F];i++)t.push(this.getLabel(e[i]));return t},getLabel:function(t){return i.addCommas(t)},niceTicks:function(t){t=t||5;var i=this._extent,n=i[1]-i[0];if(isFinite(n)){0>n&&(n=-n,i.reverse());var l=s(e.nice(n/t,!0),Math.max(o(i[0]),o(i[1]))+2),u=o(l)+2,c=[s(a(i[0]/l)*l,u),s(r(i[1]/l)*l,u)];this._interval=l,this._niceExtent=c}},niceExtent:function(t,e,i){var n=this._extent;if(n[0]===n[1])if(0!==n[0]){var o=n[0];i?n[0]-=o/2:(n[1]+=o/2,n[0]-=o/2)}else n[1]=1;var l=n[1]-n[0];isFinite(l)||(n[0]=0,n[1]=1),this.niceTicks(t);var u=this._interval;e||(n[0]=s(r(n[0]/u)*u)),i||(n[1]=s(a(n[1]/u)*u))}});return l[E]=function(){return new l},l}),e("echarts/coord/axisHelper",[he,"../scale/Ordinal","../scale/Interval","../scale/Time","../scale/Log","../scale/Scale","../util/number",ce,"zrender/contain/text"],function(t){var e=t("../scale/Ordinal"),i=t("../scale/Interval");t("../scale/Time"),t("../scale/Log");var n=t("../scale/Scale"),r=t("../util/number"),a=t(ce),o=t("zrender/contain/text"),s={};return s.getScaleExtent=function(t,e){var i,n,o,s=t.scale,u=s.type,c=e.getMin(),h=e.getMax(),f=null!=c,d=null!=h,p=s[_]();return u===l?i=(e.get("data")||[])[F]:(n=e.get("boundaryGap"),a[S](n)||(n=[n||0,n||0]),n[0]=r.parsePercent(n[0],1),n[1]=r.parsePercent(n[1],1),o=p[1]-p[0]),null==c&&(c=u===l?i?0:0/0:p[0]-n[0]*o),null==h&&(h=u===l?i?i-1:0/0:p[1]+n[1]*o),"dataMin"===c&&(c=p[0]),"dataMax"===h&&(h=p[1]),(null==c||!isFinite(c))&&(c=0/0),(null==h||!isFinite(h))&&(h=0/0),t.setBlank(a.eqNaN(c)||a.eqNaN(h)),e.getNeedCrossZero()&&(c>0&&h>0&&!f&&(c=0),0>c&&0>h&&!d&&(h=0)),[c,h]},s.niceScaleExtent=function(t,e){var i=t.scale,n=s.getScaleExtent(t,e),r=null!=e.getMin(),a=null!=e.getMax(),o=e.get("splitNumber");"log"===i.type&&(i.base=e.get("logBase")),i.setExtent(n[0],n[1]),i.niceExtent(o,r,a);var l=e.get("minInterval");if(isFinite(l)&&!r&&!a&&"interval"===i.type){var u=i.getInterval(),c=Math.max(Math.abs(u),l)/u;n=i[_]();var h=(n[1]+n[0])/2;i.setExtent(c*(n[0]-h)+h,c*(n[1]-h)+h),i.niceExtent(o)}var u=e.get("interval");null!=u&&i.setInterval&&i.setInterval(u)},s.createScaleByModel=function(t,r){if(r=r||t.get("type"))switch(r){case"category":return new e(t.getCategories(),[1/0,-1/0]);case"value":return new i;default:return(n.getClass(r)||i)[E](t)}},s.ifAxisCrossZero=function(t){var e=t.scale[_](),i=e[0],n=e[1];return!(i>0&&n>0||0>i&&0>n)},s.getAxisLabelInterval=function(t,e,i,n){var r,a=0,s=0,l=1;e[F]>40&&(l=Math.floor(e[F]/40));for(var u=0;u<t[F];u+=l){var c=t[u],h=o[ie](e[u],i,$,"top");h[n?"x":"y"]+=c,h[n?"width":ee]*=1.3,r?r.intersect(h)?(s++,a=Math.max(a,s)):(r.union(h),s=0):r=h.clone()}return 0===a&&l>1?l:(a+1)*l-1},s.getFormattedLabels=function(t,e){var i=t.scale,n=i.getTicksLabels(),r=i.getTicks();return typeof e===q?(e=function(t){return function(e){return t[M]("{value}",null!=e?e:"")}}(e),a.map(n,e)):typeof e===T?a.map(r,function(n,r){return e("category"===t.type?i.getLabel(n):n,r)},this):n},s}),e("echarts/coord/cartesian/Axis2D",[he,ce,"../Axis","./axisLabelInterval"],function(t){var e=t(ce),i=t("../Axis"),n=t("./axisLabelInterval"),r=function(t,e,n,r,a){i.call(this,t,e,n),this.type=r||"value",this[j]=a||Y};return r[W]={constructor:r,index:0,onZero:!1,model:null,isHorizontal:function(){var t=this[j];return"top"===t||t===Y},getGlobalExtent:function(){var t=this[_]();return t[0]=this.toGlobalCoord(t[0]),t[1]=this.toGlobalCoord(t[1]),t},getLabelInterval:function(){var t=this._labelInterval;return t||(t=this._labelInterval=n(this)),t},isLabelIgnored:function(t){if("category"===this.type){var e=this.getLabelInterval();return typeof e===T&&!e(t,this.scale.getLabel(t))||t%(e+1)}},toLocalCoord:null,toGlobalCoord:null},e[b](r,i),r}),e("echarts/coord/cartesian/GridModel",[he,"./AxisModel","../../model/Component"],function(t){t("./AxisModel");var e=t("../../model/Component");return e[z]({type:"grid",dependencies:["xAxis","yAxis"],layoutMode:"box",coordinateSystem:null,defaultOption:{show:!1,zlevel:0,z:0,left:"10%",top:60,right:"10%",bottom:60,containLabel:!1,backgroundColor:"rgba(0,0,0,0)",borderWidth:1,borderColor:"#ccc"}})}),e("zrender/tool/path",[he,"../graphic/Path","../core/PathProxy","./transformPath","../core/matrix"],function(t){function e(t,e,i,n,r,a,o,s,l,u,p){var g=l*(d/180),y=f(g)*(t-i)/2+h(g)*(e-n)/2,_=-1*h(g)*(t-i)/2+f(g)*(e-n)/2,x=y*y/(o*o)+_*_/(s*s);x>1&&(o*=c(x),s*=c(x));var b=(r===a?-1:1)*c((o*o*s*s-o*o*_*_-s*s*y*y)/(o*o*_*_+s*s*y*y))||0,w=b*o*_/s,T=b*-s*y/o,S=(t+i)/2+f(g)*w-h(g)*T,M=(e+n)/2+h(g)*w+f(g)*T,C=m([1,0],[(y-w)/o,(_-T)/s]),A=[(y-w)/o,(_-T)/s],P=[(-1*y-w)/o,(-1*_-T)/s],L=m(A,P);v(A,P)<=-1&&(L=d),v(A,P)>=1&&(L=0),0===a&&L>0&&(L-=2*d),1===a&&0>L&&(L+=2*d),p.addData(u,S,M,o,s,C,L,g,a)}function i(t){if(!t)return[];var i,n=t[M](/-/g," -")[M](/  /g," ")[M](/ /g,",")[M](/,,/g,",");for(i=0;i<u[F];i++)n=n[M](new RegExp(u[i],"g"),"|"+u[i]);var r,o=n.split("|"),s=0,l=0,c=new a,h=a.CMD;for(i=1;i<o[F];i++){var f,d=o[i],p=d.charAt(0),v=0,m=d.slice(1)[M](/e,-/g,"e-").split(",");m[F]>0&&""===m[0]&&m.shift();for(var g=0;g<m[F];g++)m[g]=parseFloat(m[g]);for(;v<m[F]&&!isNaN(m[v])&&!isNaN(m[0]);){var y,_,x,b,w,T,S,C=s,A=l;switch(p){case"l":s+=m[v++],l+=m[v++],f=h.L,c.addData(f,s,l);break;case"L":s=m[v++],l=m[v++],f=h.L,c.addData(f,s,l);break;case"m":s+=m[v++],l+=m[v++],f=h.M,c.addData(f,s,l),p="l";break;case"M":s=m[v++],l=m[v++],f=h.M,c.addData(f,s,l),p="L";break;case"h":s+=m[v++],f=h.L,c.addData(f,s,l);break;case"H":s=m[v++],f=h.L,c.addData(f,s,l);break;case"v":l+=m[v++],f=h.L,c.addData(f,s,l);break;case"V":l=m[v++],f=h.L,c.addData(f,s,l);break;case"C":f=h.C,c.addData(f,m[v++],m[v++],m[v++],m[v++],m[v++],m[v++]),s=m[v-2],l=m[v-1];break;case"c":f=h.C,c.addData(f,m[v++]+s,m[v++]+l,m[v++]+s,m[v++]+l,m[v++]+s,m[v++]+l),s+=m[v-2],l+=m[v-1];break;case"S":y=s,_=l;var P=c.len(),L=c.data;r===h.C&&(y+=s-L[P-4],_+=l-L[P-3]),f=h.C,C=m[v++],A=m[v++],s=m[v++],l=m[v++],c.addData(f,y,_,C,A,s,l);break;case"s":y=s,_=l;var P=c.len(),L=c.data;r===h.C&&(y+=s-L[P-4],_+=l-L[P-3]),f=h.C,C=s+m[v++],A=l+m[v++],s+=m[v++],l+=m[v++],c.addData(f,y,_,C,A,s,l);break;case"Q":C=m[v++],A=m[v++],s=m[v++],l=m[v++],f=h.Q,c.addData(f,C,A,s,l);break;case"q":C=m[v++]+s,A=m[v++]+l,s+=m[v++],l+=m[v++],f=h.Q,c.addData(f,C,A,s,l);break;case"T":y=s,_=l;var P=c.len(),L=c.data;r===h.Q&&(y+=s-L[P-4],_+=l-L[P-3]),s=m[v++],l=m[v++],f=h.Q,c.addData(f,y,_,s,l);break;case"t":y=s,_=l;var P=c.len(),L=c.data;r===h.Q&&(y+=s-L[P-4],_+=l-L[P-3]),s+=m[v++],l+=m[v++],f=h.Q,c.addData(f,y,_,s,l);break;case"A":x=m[v++],b=m[v++],w=m[v++],T=m[v++],S=m[v++],C=s,A=l,s=m[v++],l=m[v++],f=h.A,e(C,A,s,l,T,S,x,b,w,f,c);break;case"a":x=m[v++],b=m[v++],w=m[v++],T=m[v++],S=m[v++],C=s,A=l,s+=m[v++],l+=m[v++],f=h.A,e(C,A,s,l,T,S,x,b,w,f,c)}}("z"===p||"Z"===p)&&(f=h.Z,c.addData(f)),r=f}return c.toStatic(),c}function n(t,e){var n,r=i(t);return e=e||{},e.buildPath=function(t){t.setData(r.data),n&&o(t,n);var e=t.getContext();e&&t.rebuildPath(e)},e[s]=function(t){n||(n=l[E]()),l.mul(n,t,n),this.dirty(!0)},e}var r=t("../graphic/Path"),a=t("../core/PathProxy"),o=t("./transformPath"),l=t("../core/matrix"),u=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"],c=Math.sqrt,h=Math.sin,f=Math.cos,d=Math.PI,p=function(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])},v=function(t,e){return(t[0]*e[0]+t[1]*e[1])/(p(t)*p(e))},m=function(t,e){return(t[0]*e[1]<t[1]*e[0]?-1:1)*Math.acos(v(t,e))};return{createFromString:function(t,e){return new r(n(t,e))},extendFromString:function(t,e){return r[z](n(t,e))},mergePath:function(t,e){for(var i=[],n=t[F],a=0;n>a;a++){var o=t[a];o.__dirty&&o.buildPath(o.path,o.shape,!0),i.push(o.path)}var s=new r(e);return s.buildPath=function(t){t.appendPath(i);var e=t.getContext();e&&t.rebuildPath(e)},s}}}),e("zrender/graphic/Image",[he,"./Displayable","../core/BoundingRect",i,"../core/LRU"],function(t){function e(t){n.call(this,t)}var n=t("./Displayable"),r=t("../core/BoundingRect"),a=t(i),o=t("../core/LRU"),s=new o(50);return e[W]={constructor:e,type:"image",brush:function(t,e){var i,n=this.style,r=n.image;if(n.bind(t,this,e),i=typeof r===q?this._image:r,!i&&r){var a=s.get(r);if(!a)return i=new Image,i.onload=function(){i.onload=null;for(var t=0;t<a.pending[F];t++)a.pending[t].dirty()},a={image:i,pending:[this]},i.src=r,s.put(r,a),void(this._image=i);if(i=a.image,this._image=i,!i.width||!i[ee])return void a.pending.push(this)}if(i){var o=n.width||i.width,l=n[ee]||i[ee],u=n.x||0,c=n.y||0;if(!i.width||!i[ee])return;if(this.setTransform(t),n.sWidth&&n.sHeight){var h=n.sx||0,f=n.sy||0;t.drawImage(i,h,f,n.sWidth,n.sHeight,u,c,o,l)}else if(n.sx&&n.sy){var h=n.sx,f=n.sy,d=o-h,p=l-f;t.drawImage(i,h,f,d,p,u,c,o,l)}else t.drawImage(i,u,c,o,l);null==n.width&&(n.width=o),null==n[ee]&&(n[ee]=l),this.restoreTransform(t),null!=n.text&&this.drawRectText(t,this[ie]())}},getBoundingRect:function(){var t=this.style;return this._rect||(this._rect=new r(t.x||0,t.y||0,t.width||0,t[ee]||0)),this._rect}},a[b](e,n),e}),e("zrender/container/Group",[he,i,"../Element","../core/BoundingRect"],function(t){var e=t(i),n=t("../Element"),r=t("../core/BoundingRect"),a=function(t){t=t||{},n.call(this,t);for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);this._children=[],this.__storage=null,this.__dirty=!0};return a[W]={constructor:a,isGroup:!0,type:"group",silent:!1,children:function(){return this._children.slice()},childAt:function(t){return this._children[t]},childOfName:function(t){for(var e=this._children,i=0;i<e[F];i++)if(e[i].name===t)return e[i]},childCount:function(){return this._children[F]},add:function(t){return t&&t!==this&&t[h]!==this&&(this._children.push(t),this._doAdd(t)),this},addBefore:function(t,e){if(t&&t!==this&&t[h]!==this&&e&&e[h]===this){var i=this._children,n=i[N](e);n>=0&&(i[L](n,0,t),this._doAdd(t))}return this},_doAdd:function(t){t[h]&&t[h][k](t),t[h]=this;var e=this.__storage,i=this.__zr;e&&e!==t.__storage&&(e.addToMap(t),t instanceof a&&t.addChildrenToStorage(e)),i&&i.refresh()},remove:function(t){var i=this.__zr,n=this.__storage,r=this._children,o=e[N](r,t);return 0>o?this:(r[L](o,1),t[h]=null,n&&(n.delFromMap(t.id),t instanceof a&&t.delChildrenFromStorage(n)),i&&i.refresh(),this)},removeAll:function(){var t,e,i=this._children,n=this.__storage;for(e=0;e<i[F];e++)t=i[e],n&&(n.delFromMap(t.id),t instanceof a&&t.delChildrenFromStorage(n)),t[h]=null;return i[F]=0,this},eachChild:function(t,e){for(var i=this._children,n=0;n<i[F];n++){var r=i[n];t.call(e,r,n)}return this},traverse:function(t,e){for(var i=0;i<this._children[F];i++){var n=this._children[i];t.call(e,n),"group"===n.type&&n.traverse(t,e)}return this},addChildrenToStorage:function(t){for(var e=0;e<this._children[F];e++){var i=this._children[e];t.addToMap(i),i instanceof a&&i.addChildrenToStorage(t)}},delChildrenFromStorage:function(t){for(var e=0;e<this._children[F];e++){var i=this._children[e];t.delFromMap(i.id),i instanceof a&&i.delChildrenFromStorage(t)}},dirty:function(){return this.__dirty=!0,this.__zr&&this.__zr.refresh(),this},getBoundingRect:function(t){for(var e=null,i=new r(0,0,0,0),n=t||this._children,a=[],o=0;o<n[F];o++){var l=n[o];if(!l[G]&&!l.invisible){var u=l[ie](),c=l.getLocalTransform(a);c?(i.copy(u),i[s](c),e=e||i.clone(),e.union(i)):(e=e||u.clone(),e.union(u))}}return e||i}},e[b](a,n),a}),e("zrender/graphic/Text",[he,"./Displayable",i,"../contain/text"],function(t){var e=t("./Displayable"),n=t(i),r=t("../contain/text"),a=function(t){e.call(this,t)};return a[W]={constructor:a,type:"text",brush:function(t,e){var i=this.style,n=i.x||0,a=i.y||0,o=i.text;if(null!=o&&(o+=""),i.bind(t,this,e),o){this.setTransform(t);var s,l=i[re],u=i.textFont||i.font;if(i.textVerticalAlign){var c=r[ie](o,u,i[re],"top");switch(s=Q,i.textVerticalAlign){case Q:a-=c[ee]/2-c.lineHeight/2;break;case Y:a-=c[ee]-c.lineHeight/2;break;default:a+=c.lineHeight/2}}else s=i.textBaseline;t.font=u||"12px sans-serif",t[re]=l||"left",t[re]!==l&&(t[re]="left"),t.textBaseline=s||"alphabetic",t.textBaseline!==s&&(t.textBaseline="alphabetic");for(var h=r.measureText("国",t.font).width,f=o.split("\n"),d=0;d<f[F];d++)i.hasFill()&&t.fillText(f[d],n,a),i.hasStroke()&&t.strokeText(f[d],n,a),a+=h;this.restoreTransform(t)}},getBoundingRect:function(){if(!this._rect){var t=this.style,e=t.textVerticalAlign,i=r[ie](t.text+"",t.textFont||t.font,t[re],e?"top":t.textBaseline);switch(e){case Q:i.y-=i[ee]/2;break;case Y:i.y-=i[ee]}i.x+=t.x||0,i.y+=t.y||0,this._rect=i}return this._rect}},n[b](a,e),a}),e("zrender/graphic/shape/Circle",[he,"../Path"],function(t){return t("../Path")[z]({type:"circle",shape:{cx:0,cy:0,r:0},buildPath:function(t,e,i){i&&t.moveTo(e.cx+e.r,e.cy),t.arc(e.cx,e.cy,e.r,0,2*Math.PI,!0)}})}),e("zrender/graphic/Path",[he,"./Displayable",i,"../core/PathProxy","../contain/path","./Pattern"],function(t){function e(t){n.call(this,t),this.path=new a}var n=t("./Displayable"),r=t(i),a=t("../core/PathProxy"),s=t("../contain/path"),l=t("./Pattern"),u=l[W].getCanvasPattern,c=Math.abs;return e[W]={constructor:e,type:"path",__dirtyPath:!0,strokeContainThreshold:5,brush:function(t,e){var i=this.style,n=this.path,r=i.hasStroke(),a=i.hasFill(),s=i.fill,l=i[o],c=a&&!!s[D],h=r&&!!l[D],f=a&&!!s.image,d=r&&!!l.image;if(i.bind(t,this,e),this.setTransform(t),this.__dirty){var p=this[ie]();c&&(this._fillGradient=i.getGradient(t,s,p)),h&&(this._strokeGradient=i.getGradient(t,l,p))}c?t.fillStyle=this._fillGradient:f&&(t.fillStyle=u.call(s,t)),h?t.strokeStyle=this._strokeGradient:d&&(t.strokeStyle=u.call(l,t));var v=i.lineDash,m=i.lineDashOffset,g=!!t.setLineDash,y=this.getGlobalScale();n.setScale(y[0],y[1]),this.__dirtyPath||v&&!g&&r?(n=this.path.beginPath(t),v&&!g&&(n.setLineDash(v),n.setLineDashOffset(m)),this.buildPath(n,this.shape,!1),this.__dirtyPath=!1):(t.beginPath(),this.path.rebuildPath(t)),a&&n.fill(t),v&&g&&(t.setLineDash(v),t.lineDashOffset=m),r&&n[o](t),v&&g&&t.setLineDash([]),this.restoreTransform(t),null!=i.text&&this.drawRectText(t,this[ie]())},buildPath:function(){},getBoundingRect:function(){var t=this._rect,e=this.style,i=!t;if(i){var n=this.path;this.__dirtyPath&&(n.beginPath(),this.buildPath(n,this.shape,!1)),t=n[ie]()}if(this._rect=t,e.hasStroke()){var r=this._rectWithStroke||(this._rectWithStroke=t.clone());if(this.__dirty||i){r.copy(t);var a=e.lineWidth,o=e.strokeNoScale?this.getLineScale():1;e.hasFill()||(a=Math.max(a,this.strokeContainThreshold||4)),o>1e-10&&(r.width+=a/o,r[ee]+=a/o,r.x-=a/o/2,r.y-=a/o/2)}return r}return t},contain:function(t,e){var i=this.transformCoordToLocal(t,e),n=this[ie](),r=this.style;if(t=i[0],e=i[1],n[x](t,e)){var a=this.path.data;if(r.hasStroke()){var o=r.lineWidth,l=r.strokeNoScale?this.getLineScale():1;if(l>1e-10&&(r.hasFill()||(o=Math.max(o,this.strokeContainThreshold)),s.containStroke(a,o/l,t,e)))return!0}if(r.hasFill())return s[x](a,t,e)}return!1},dirty:function(t){null==t&&(t=!0),t&&(this.__dirtyPath=t,this._rect=null),this.__dirty=!0,this.__zr&&this.__zr.refresh(),this.__clipTarget&&this.__clipTarget.dirty()},animateShape:function(t){return this.animate("shape",t)},attrKV:function(t,e){"shape"===t?(this.setShape(e),this.__dirtyPath=!0,this._rect=null):n[W].attrKV.call(this,t,e)},setShape:function(t,e){var i=this.shape;if(i){if(r[V](t))for(var n in t)t.hasOwnProperty(n)&&(i[n]=t[n]);else i[t]=e;this.dirty(!0)}return this},getLineScale:function(){var t=this.transform;return t&&c(t[0]-1)>1e-10&&c(t[3]-1)>1e-10?Math.sqrt(c(t[0]*t[3]-t[2]*t[1])):1}},e[z]=function(t){var i=function(i){e.call(this,i),t.style&&this.style.extendFrom(t.style,!1);var n=t.shape;if(n){this.shape=this.shape||{};var r=this.shape;for(var a in n)!r.hasOwnProperty(a)&&n.hasOwnProperty(a)&&(r[a]=n[a])}t.init&&t.init.call(this,i)};r[b](i,e);for(var n in t)"style"!==n&&"shape"!==n&&(i[W][n]=t[n]);return i},r[b](e,n),e}),e("zrender/graphic/shape/Sector",[he,"../../core/env","../Path"],function(t){var e=t("../../core/env"),i=t("../Path"),n=[["shadowBlur",0],["shadowColor","#000"],["shadowOffsetX",0],["shadowOffsetY",0]];return i[z]({type:"sector",shape:{cx:0,cy:0,r0:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},brush:e.browser.ie&&e.browser.version>=11?function(){var t,e=this.__clipPaths,r=this.style;if(e)for(var a=0;a<e[F];a++){var o=e[a]&&e[a].shape;if(o&&o.startAngle===o.endAngle){for(var s=0;s<n[F];s++)n[s][2]=r[n[s][0]],r[n[s][0]]=n[s][1];t=!0;break}}if(i[W].brush.apply(this,arguments),t)for(var s=0;s<n[F];s++)r[n[s][0]]=n[s][2]}:i[W].brush,buildPath:function(t,e){var i=e.cx,n=e.cy,r=Math.max(e.r0||0,0),a=Math.max(e.r,0),o=e.startAngle,s=e.endAngle,l=e.clockwise,u=Math.cos(o),c=Math.sin(o);t.moveTo(u*r+i,c*r+n),t.lineTo(u*a+i,c*a+n),t.arc(i,n,a,o,s,!l),t.lineTo(Math.cos(s)*r+i,Math.sin(s)*r+n),0!==r&&t.arc(i,n,r,s,o,l),t.closePath()}})}),e("zrender/graphic/shape/Polygon",[he,"../helper/poly","../Path"],function(t){var e=t("../helper/poly");return t("../Path")[z]({type:"polygon",shape:{points:null,smooth:!1,smoothConstraint:null},buildPath:function(t,i){e.buildPath(t,i,!0)}})}),e("zrender/graphic/shape/Ring",[he,"../Path"],function(t){return t("../Path")[z]({type:"ring",shape:{cx:0,cy:0,r:0,r0:0},buildPath:function(t,e){var i=e.cx,n=e.cy,r=2*Math.PI;t.moveTo(i+e.r,n),t.arc(i,n,e.r,0,r,!1),t.moveTo(i+e.r0,n),t.arc(i,n,e.r0,0,r,!0)}})}),e("zrender/graphic/shape/Rect",[he,"../helper/roundRect","../Path"],function(t){var e=t("../helper/roundRect");return t("../Path")[z]({type:"rect",shape:{r:0,x:0,y:0,width:0,height:0},buildPath:function(t,i){var n=i.x,r=i.y,a=i.width,o=i[ee];i.r?e.buildPath(t,i):t.rect(n,r,a,o),t.closePath()}})}),e("zrender/graphic/shape/Line",[he,"../Path"],function(t){return t("../Path")[z]({type:"line",shape:{x1:0,y1:0,x2:0,y2:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function(t,e){var i=e.x1,n=e.y1,r=e.x2,a=e.y2,o=e.percent;0!==o&&(t.moveTo(i,n),1>o&&(r=i*(1-o)+r*o,a=n*(1-o)+a*o),t.lineTo(r,a))},pointAt:function(t){var e=this.shape;return[e.x1*(1-t)+e.x2*t,e.y1*(1-t)+e.y2*t]}})}),e("zrender/graphic/shape/Polyline",[he,"../helper/poly","../Path"],function(t){var e=t("../helper/poly");return t("../Path")[z]({type:"polyline",shape:{points:null,smooth:!1,smoothConstraint:null},style:{stroke:"#000",fill:null},buildPath:function(t,i){e.buildPath(t,i,!1)}})}),e("zrender/graphic/shape/BezierCurve",[he,"../../core/curve","../../core/vector","../Path"],function(t){function e(t,e,i){var n=t.cpx2,r=t.cpy2;return null===n||null===r?[(i?u:s)(t.x1,t.cpx1,t.cpx2,t.x2,e),(i?u:s)(t.y1,t.cpy1,t.cpy2,t.y2,e)]:[(i?l:o)(t.x1,t.cpx1,t.x2,e),(i?l:o)(t.y1,t.cpy1,t.y2,e)]}var i=t("../../core/curve"),n=t("../../core/vector"),r=i.quadraticSubdivide,a=i.cubicSubdivide,o=i.quadraticAt,s=i.cubicAt,l=i.quadraticDerivativeAt,u=i.cubicDerivativeAt,c=[];return t("../Path")[z]({type:"bezier-curve",shape:{x1:0,y1:0,x2:0,y2:0,cpx1:0,cpy1:0,percent:1},style:{stroke:"#000",fill:null},buildPath:function(t,e){var i=e.x1,n=e.y1,o=e.x2,s=e.y2,l=e.cpx1,u=e.cpy1,h=e.cpx2,f=e.cpy2,d=e.percent;0!==d&&(t.moveTo(i,n),null==h||null==f?(1>d&&(r(i,l,o,d,c),l=c[1],o=c[2],r(n,u,s,d,c),u=c[1],s=c[2]),t.quadraticCurveTo(l,u,o,s)):(1>d&&(a(i,l,h,o,d,c),l=c[1],h=c[2],o=c[3],a(n,u,f,s,d,c),u=c[1],f=c[2],s=c[3]),t.bezierCurveTo(l,u,h,f,o,s)))},pointAt:function(t){return e(this.shape,t,!1)},tangentAt:function(t){var i=e(this.shape,t,!0);return n.normalize(i,i)}})}),e("zrender/graphic/CompoundPath",[he,"./Path"],function(t){var e=t("./Path");return e[z]({type:"compound",shape:{paths:null},_updatePathDirty:function(){for(var t=this.__dirtyPath,e=this.shape.paths,i=0;i<e[F];i++)t=t||e[i].__dirtyPath;this.__dirtyPath=t,this.__dirty=this.__dirty||t},beforeBrush:function(){this._updatePathDirty();for(var t=this.shape.paths||[],e=this.getGlobalScale(),i=0;i<t[F];i++)t[i].path.setScale(e[0],e[1])},buildPath:function(t,e){for(var i=e.paths||[],n=0;n<i[F];n++)i[n].buildPath(t,i[n].shape,!0)},afterBrush:function(){for(var t=this.shape.paths,e=0;e<t[F];e++)t[e].__dirtyPath=!1},getBoundingRect:function(){return this._updatePathDirty(),e[W][ie].call(this)}})}),e("zrender/graphic/shape/Arc",[he,"../Path"],function(t){return t("../Path")[z]({type:"arc",shape:{cx:0,cy:0,r:0,startAngle:0,endAngle:2*Math.PI,clockwise:!0},style:{stroke:"#000",fill:null},buildPath:function(t,e){var i=e.cx,n=e.cy,r=Math.max(e.r,0),a=e.startAngle,o=e.endAngle,s=e.clockwise,l=Math.cos(a),u=Math.sin(a);t.moveTo(l*r+i,u*r+n),t.arc(i,n,r,a,o,!s)}})}),e("zrender/graphic/RadialGradient",[he,i,"./Gradient"],function(t){var e=t(i),n=t("./Gradient"),r=function(t,e,i,r,a){this.x=null==t?.5:t,this.y=null==e?.5:e,this.r=null==i?.5:i,this.type="radial",this.global=a||!1,n.call(this,r)};return r[W]={constructor:r},e[b](r,n),r}),e("zrender/graphic/LinearGradient",[he,i,"./Gradient"],function(t){var e=t(i),n=t("./Gradient"),r=function(t,e,i,r,a,o){this.x=null==t?0:t,this.y=null==e?0:e,this.x2=null==i?1:i,this.y2=null==r?0:r,this.type="linear",this.global=o||!1,n.call(this,a)};return r[W]={constructor:r},e[b](r,n),r}),e("zrender/core/BoundingRect",[he,"./vector","./matrix"],function(t){function e(t,e,i,n){0>i&&(t+=i,i=-i),0>n&&(e+=n,n=-n),this.x=t,this.y=e,this.width=i,this[ee]=n}var i=t("./vector"),n=t("./matrix"),r=i[s],a=Math.min,o=Math.max;return e[W]={constructor:e,union:function(t){var e=a(t.x,this.x),i=a(t.y,this.y);this.width=o(t.x+t.width,this.x+this.width)-e,this[ee]=o(t.y+t[ee],this.y+this[ee])-i,this.x=e,this.y=i},applyTransform:function(){var t=[],e=[],i=[],n=[];return function(s){if(s){t[0]=i[0]=this.x,t[1]=n[1]=this.y,e[0]=n[0]=this.x+this.width,e[1]=i[1]=this.y+this[ee],r(t,t,s),r(e,e,s),r(i,i,s),r(n,n,s),this.x=a(t[0],e[0],i[0],n[0]),this.y=a(t[1],e[1],i[1],n[1]);var l=o(t[0],e[0],i[0],n[0]),u=o(t[1],e[1],i[1],n[1]);this.width=l-this.x,this[ee]=u-this.y}}}(),calculateTransform:function(t){var e=this,i=t.width/e.width,r=t[ee]/e[ee],a=n[E]();return n.translate(a,a,[-e.x,-e.y]),n.scale(a,a,[i,r]),n.translate(a,a,[t.x,t.y]),a},intersect:function(t){if(!t)return!1;t instanceof e||(t=e[E](t));var i=this,n=i.x,r=i.x+i.width,a=i.y,o=i.y+i[ee],s=t.x,l=t.x+t.width,u=t.y,c=t.y+t[ee];return!(s>r||n>l||u>o||a>c)},contain:function(t,e){var i=this;return t>=i.x&&t<=i.x+i.width&&e>=i.y&&e<=i.y+i[ee]},clone:function(){return new e(this.x,this.y,this.width,this[ee])},copy:function(t){this.x=t.x,this.y=t.y,this.width=t.width,this[ee]=t[ee]},plain:function(){return{x:this.x,y:this.y,width:this.width,height:this[ee]}}},e[E]=function(t){return new e(t.x,t.y,t.width,t[ee])},e}),e("echarts/model/globalDefault",[],function(){var t="";return typeof navigator!==n&&(t=navigator.platform||""),{color:["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],textStyle:{fontFamily:t.match(/^Win/)?"Microsoft YaHei":"sans-serif",fontSize:12,fontStyle:"normal",fontWeight:"normal"},blendMode:null,animation:!0,animationDuration:1e3,animationDurationUpdate:300,animationEasing:"exponentialOut",animationEasingUpdate:"cubicOut",animationThreshold:2e3,progressiveThreshold:3e3,progressive:400,hoverLayerThreshold:3e3}}),e("echarts/model/mixin/colorPalette",[he,"../../util/clazz"],function(t){var e=t("../../util/clazz"),i=e.set,n=e.get;return{clearColorPalette:function(){i(this,"colorIdx",0),i(this,"colorNameMap",{})},getColorFromPalette:function(t,e){e=e||this;var r=n(e,"colorIdx")||0,a=n(e,"colorNameMap")||i(e,"colorNameMap",{});if(a[t])return a[t];var o=this.get("color",!0)||[];if(o[F]){var s=o[r];return t&&(a[t]=s),i(e,"colorIdx",(r+1)%o[F]),s
}}}}),e("echarts/model/mixin/lineStyle",[he,"./makeStyleMapper"],function(t){var e=t("./makeStyleMapper")([["lineWidth","width"],[o,"color"],[Z],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]);return{getLineStyle:function(t){var i=e.call(this,t),n=this.getLineDash(i.lineWidth);return n&&(i.lineDash=n),i},getLineDash:function(t){null==t&&(t=1);var e=this.get("type"),i=Math.max(t,2),n=4*t;return"solid"===e||null==e?null:"dashed"===e?[n,n]:[i,i]}}}),e("echarts/util/clazz",[he,ce],function(t){function e(t){r.assert(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(t),'componentType "'+t+'" illegal')}function i(t,e){var i=r.slice(arguments,2);return this.superClass[W][e].apply(t,i)}function n(t,e,i){return this.superClass[W][e].apply(t,i)}var r=t(ce),a={},o=".",s="___EC__COMPONENT__CONTAINER___",l="\x00ec_\x00";a.set=function(t,e,i){return t[l+e]=i},a.get=function(t,e){return t[l+e]},a.hasOwn=function(t,e){return t.hasOwnProperty(l+e)};var u=a.parseClassType=function(t){var e={main:"",sub:""};return t&&(t=t.split(o),e.main=t[0]||"",e.sub=t[1]||""),e};return a.enableClassExtend=function(t,e){t.$constructor=t,t[z]=function(t){var e=this,a=function(){t.$constructor?t.$constructor.apply(this,arguments):e.apply(this,arguments)};return r[z](a[W],t),a[z]=this[z],a.superCall=i,a.superApply=n,r[b](a,this),a.superClass=e,a}},a.enableClassManagement=function(t,i){function n(t){var e=a[t.main];return e&&e[s]||(e=a[t.main]={},e[s]=!0),e}i=i||{};var a={};if(t.registerClass=function(t,i){if(i)if(e(i),i=u(i),i.sub){if(i.sub!==s){var r=n(i);r[i.sub]=t}}else a[i.main]=t;return t},t.getClass=function(t,e,i){var n=a[t];if(n&&n[s]&&(n=e?n[e]:null),i&&!n)throw new Error(e?"Component "+t+"."+(e||"")+" not exists. Load it first.":t+".type should be specified.");return n},t.getClassesByMainType=function(t){t=u(t);var e=[],i=a[t.main];return i&&i[s]?r.each(i,function(t,i){i!==s&&e.push(t)}):e.push(i),e},t.hasClass=function(t){return t=u(t),!!a[t.main]},t.getAllClassMainTypes=function(){var t=[];return r.each(a,function(e,i){t.push(i)}),t},t.hasSubTypes=function(t){t=u(t);var e=a[t.main];return e&&e[s]},t.parseClassType=u,i.registerWhenExtend){var o=t[z];o&&(t[z]=function(e){var i=o.call(this,e);return t.registerClass(i,e.type)})}return t},a.setReadOnly=function(){},a}),e("echarts/model/mixin/areaStyle",[he,"./makeStyleMapper"],function(t){return{getAreaStyle:t("./makeStyleMapper")([["fill","color"],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],[Z],["shadowColor"]])}}),e("echarts/model/mixin/textStyle",[he,"zrender/contain/text"],function(t){function e(t,e){return t&&t[u](e)}var i=t("zrender/contain/text");return{getTextColor:function(){var t=this[r];return this[u]("color")||t&&t.get("textStyle.color")},getFont:function(){var t=this[r],i=t&&t[oe](ae);return[this[u]("fontStyle")||e(i,"fontStyle"),this[u]("fontWeight")||e(i,"fontWeight"),(this[u]("fontSize")||e(i,"fontSize")||12)+"px",this[u]("fontFamily")||e(i,"fontFamily")||"sans-serif"].join(" ")},getTextRect:function(t){return i[ie](t,this[ne](),this[u]("align"),this[u]("baseline"))},truncateText:function(t,e,n,r){return i.truncateText(t,e,this[ne](),n,r)}}}),e("echarts/model/mixin/itemStyle",[he,"./makeStyleMapper"],function(t){var e=t("./makeStyleMapper")([["fill","color"],[o,"borderColor"],["lineWidth","borderWidth"],[Z],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"],["textPosition"],[re]]);return{getItemStyle:function(t){var i=e.call(this,t),n=this.getBorderLineDash();return n&&(i.lineDash=n),i},getBorderLineDash:function(){var t=this.get("borderType");return"solid"===t||null==t?null:"dashed"===t?[5,5]:[1,1]}}}),e("zrender/tool/transformPath",[he,"../core/PathProxy","../core/vector"],function(t){function e(t,e){var n,s,u,c,h,f,d=t.data,p=i.M,v=i.C,m=i.L,g=i.R,y=i.A,_=i.Q;for(u=0,c=0;u<d[F];){switch(n=d[u++],c=u,s=0,n){case p:s=1;break;case m:s=1;break;case v:s=3;break;case _:s=2;break;case y:var x=e[4],b=e[5],w=o(e[0]*e[0]+e[1]*e[1]),T=o(e[2]*e[2]+e[3]*e[3]),S=l(-e[1]/T,e[0]/w);d[u++]+=x,d[u++]+=b,d[u++]*=w,d[u++]*=T,d[u++]+=S,d[u++]+=S,u+=2,c=u;break;case g:f[0]=d[u++],f[1]=d[u++],r(f,f,e),d[c++]=f[0],d[c++]=f[1],f[0]+=d[u++],f[1]+=d[u++],r(f,f,e),d[c++]=f[0],d[c++]=f[1]}for(h=0;s>h;h++){var f=a[h];f[0]=d[u++],f[1]=d[u++],r(f,f,e),d[c++]=f[0],d[c++]=f[1]}}}var i=t("../core/PathProxy").CMD,n=t("../core/vector"),r=n[s],a=[[],[],[]],o=Math.sqrt,l=Math.atan2;return e}),e("zrender/contain/text",[he,i,"../core/BoundingRect"],function(t){function e(t,e){var i=t+":"+e;if(s[i])return s[i];for(var n=(t+"").split("\n"),r=0,a=0,o=n[F];o>a;a++)r=Math.max(d.measureText(n[a],e).width,r);return l>u&&(l=0,s={}),l++,s[i]=r,r}function n(t,i,n,r){var a=((t||"")+"").split("\n")[F],o=e(t,i),s=e("国",i),l=a*s,u=new h(0,0,o,l);switch(u.lineHeight=s,r){case Y:case"alphabetic":u.y-=s;break;case Q:u.y-=s/2}switch(n){case"end":case"right":u.x-=u.width;break;case $:u.x-=u.width/2}return u}function r(t,e,i,n){var r=e.x,a=e.y,o=e[ee],s=e.width,l=i[ee],u=o/2-l/2,c="left";switch(t){case"left":r-=n,a+=u,c="right";break;case"right":r+=n+s,a+=u,c="left";break;case"top":r+=s/2,a-=n+l,c=$;break;case Y:r+=s/2,a+=o+n,c=$;break;case"inside":r+=s/2,a+=u,c=$;break;case"insideLeft":r+=n,a+=u,c="left";break;case"insideRight":r+=s-n,a+=u,c="right";break;case"insideTop":r+=s/2,a+=n,c=$;break;case"insideBottom":r+=s/2,a+=o-l-n,c=$;break;case"insideTopLeft":r+=n,a+=n,c="left";break;case"insideTopRight":r+=s-n,a+=n,c="right";break;case"insideBottomLeft":r+=n,a+=o-l-n;break;case"insideBottomRight":r+=s-n,a+=o-l-n,c="right"}return{x:r,y:a,textAlign:c,textBaseline:"top"}}function a(t,i,n,r,a){if(!i)return"";a=a||{},r=f(r,"...");for(var s=f(a.maxIterations,2),l=f(a.minChar,0),u=e("国",n),c=e("a",n),h=f(a.placeholder,""),d=i=Math.max(0,i-1),p=0;l>p&&d>=c;p++)d-=c;var v=e(r);v>d&&(r="",v=0),d=i-v;for(var m=(t+"").split("\n"),p=0,g=m[F];g>p;p++){var y=m[p],_=e(y,n);if(!(i>=_)){for(var x=0;;x++){if(d>=_||x>=s){y+=r;break}var b=0===x?o(y,d,c,u):_>0?Math.floor(y[F]*d/_):0;y=y.substr(0,b),_=e(y,n)}""===y&&(y=h),m[p]=y}}return m.join("\n")}function o(t,e,i,n){for(var r=0,a=0,o=t[F];o>a&&e>r;a++){var s=t.charCodeAt(a);r+=s>=0&&127>=s?i:n}return a}var s={},l=0,u=5e3,c=t(i),h=t("../core/BoundingRect"),f=c[m],d={getWidth:e,getBoundingRect:n,adjustTextPositionOnRect:r,truncateText:a,measureText:function(t,e){var i=c.getContext();return i.font=e||"12px sans-serif",i.measureText(t)}};return d}),e("zrender/core/PathProxy",[he,"./curve","./vector","./bbox","./BoundingRect","../config"],function(t){var e=t("./curve"),i=t("./vector"),r=t("./bbox"),a=t("./BoundingRect"),s=t("../config").devicePixelRatio,l={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},u=[],c=[],h=[],f=[],d=Math.min,p=Math.max,v=Math.cos,m=Math.sin,g=Math.sqrt,y=Math.abs,_=typeof Float32Array!=n,x=function(){this.data=[],this._len=0,this._ctx=null,this._xi=0,this._yi=0,this._x0=0,this._y0=0,this._ux=0,this._uy=0};return x[W]={constructor:x,_lineDash:null,_dashOffset:0,_dashIdx:0,_dashSum:0,setScale:function(t,e){this._ux=y(1/s/t)||0,this._uy=y(1/s/e)||0},getContext:function(){return this._ctx},beginPath:function(t){return this._ctx=t,t&&t.beginPath(),t&&(this.dpr=t.dpr),this._len=0,this._lineDash&&(this._lineDash=null,this._dashOffset=0),this},moveTo:function(t,e){return this.addData(l.M,t,e),this._ctx&&this._ctx.moveTo(t,e),this._x0=t,this._y0=e,this._xi=t,this._yi=e,this},lineTo:function(t,e){var i=y(t-this._xi)>this._ux||y(e-this._yi)>this._uy||this._len<5;return this.addData(l.L,t,e),this._ctx&&i&&(this._needsDash()?this._dashedLineTo(t,e):this._ctx.lineTo(t,e)),i&&(this._xi=t,this._yi=e),this},bezierCurveTo:function(t,e,i,n,r,a){return this.addData(l.C,t,e,i,n,r,a),this._ctx&&(this._needsDash()?this._dashedBezierTo(t,e,i,n,r,a):this._ctx.bezierCurveTo(t,e,i,n,r,a)),this._xi=r,this._yi=a,this},quadraticCurveTo:function(t,e,i,n){return this.addData(l.Q,t,e,i,n),this._ctx&&(this._needsDash()?this._dashedQuadraticTo(t,e,i,n):this._ctx.quadraticCurveTo(t,e,i,n)),this._xi=i,this._yi=n,this},arc:function(t,e,i,n,r,a){return this.addData(l.A,t,e,i,i,n,r-n,0,a?0:1),this._ctx&&this._ctx.arc(t,e,i,n,r,a),this._xi=v(r)*i+t,this._yi=m(r)*i+t,this},arcTo:function(t,e,i,n,r){return this._ctx&&this._ctx.arcTo(t,e,i,n,r),this},rect:function(t,e,i,n){return this._ctx&&this._ctx.rect(t,e,i,n),this.addData(l.R,t,e,i,n),this},closePath:function(){this.addData(l.Z);var t=this._ctx,e=this._x0,i=this._y0;return t&&(this._needsDash()&&this._dashedLineTo(e,i),t.closePath()),this._xi=e,this._yi=i,this},fill:function(t){t&&t.fill(),this.toStatic()},stroke:function(t){t&&t[o](),this.toStatic()},setLineDash:function(t){if(t instanceof Array){this._lineDash=t,this._dashIdx=0;for(var e=0,i=0;i<t[F];i++)e+=t[i];this._dashSum=e}return this},setLineDashOffset:function(t){return this._dashOffset=t,this},len:function(){return this._len},setData:function(t){var e=t[F];this.data&&this.data[F]==e||!_||(this.data=new Float32Array(e));for(var i=0;e>i;i++)this.data[i]=t[i];this._len=e},appendPath:function(t){t instanceof Array||(t=[t]);for(var e=t[F],i=0,n=this._len,r=0;e>r;r++)i+=t[r].len();_&&this.data instanceof Float32Array&&(this.data=new Float32Array(n+i));for(var r=0;e>r;r++)for(var a=t[r].data,o=0;o<a[F];o++)this.data[n++]=a[o];this._len=n},addData:function(t){var e=this.data;this._len+arguments[F]>e[F]&&(this._expandData(),e=this.data);for(var i=0;i<arguments[F];i++)e[this._len++]=arguments[i];this._prevCmd=t},_expandData:function(){if(!(this.data instanceof Array)){for(var t=[],e=0;e<this._len;e++)t[e]=this.data[e];this.data=t}},_needsDash:function(){return this._lineDash},_dashedLineTo:function(t,e){var i,n,r=this._dashSum,a=this._dashOffset,o=this._lineDash,s=this._ctx,l=this._xi,u=this._yi,c=t-l,h=e-u,f=g(c*c+h*h),v=l,m=u,y=o[F];for(c/=f,h/=f,0>a&&(a=r+a),a%=r,v-=a*c,m-=a*h;c>0&&t>=v||0>c&&v>=t||0==c&&(h>0&&e>=m||0>h&&m>=e);)n=this._dashIdx,i=o[n],v+=c*i,m+=h*i,this._dashIdx=(n+1)%y,c>0&&l>v||0>c&&v>l||h>0&&u>m||0>h&&m>u||s[n%2?"moveTo":"lineTo"](c>=0?d(v,t):p(v,t),h>=0?d(m,e):p(m,e));c=v-t,h=m-e,this._dashOffset=-g(c*c+h*h)},_dashedBezierTo:function(t,i,n,r,a,o){var s,l,u,c,h,f=this._dashSum,d=this._dashOffset,p=this._lineDash,v=this._ctx,m=this._xi,y=this._yi,_=e.cubicAt,x=0,b=this._dashIdx,w=p[F],T=0;for(0>d&&(d=f+d),d%=f,s=0;1>s;s+=.1)l=_(m,t,n,a,s+.1)-_(m,t,n,a,s),u=_(y,i,r,o,s+.1)-_(y,i,r,o,s),x+=g(l*l+u*u);for(;w>b&&(T+=p[b],!(T>d));b++);for(s=(T-d)/x;1>=s;)c=_(m,t,n,a,s),h=_(y,i,r,o,s),b%2?v.moveTo(c,h):v.lineTo(c,h),s+=p[b]/x,b=(b+1)%w;b%2!==0&&v.lineTo(a,o),l=a-c,u=o-h,this._dashOffset=-g(l*l+u*u)},_dashedQuadraticTo:function(t,e,i,n){var r=i,a=n;i=(i+2*t)/3,n=(n+2*e)/3,t=(this._xi+2*t)/3,e=(this._yi+2*e)/3,this._dashedBezierTo(t,e,i,n,r,a)},toStatic:function(){var t=this.data;t instanceof Array&&(t[F]=this._len,_&&(this.data=new Float32Array(t)))},getBoundingRect:function(){u[0]=u[1]=h[0]=h[1]=Number.MAX_VALUE,c[0]=c[1]=f[0]=f[1]=-Number.MAX_VALUE;for(var t=this.data,e=0,n=0,o=0,s=0,d=0;d<t[F];){var p=t[d++];switch(1==d&&(e=t[d],n=t[d+1],o=e,s=n),p){case l.M:o=t[d++],s=t[d++],e=o,n=s,h[0]=o,h[1]=s,f[0]=o,f[1]=s;break;case l.L:r.fromLine(e,n,t[d],t[d+1],h,f),e=t[d++],n=t[d++];break;case l.C:r.fromCubic(e,n,t[d++],t[d++],t[d++],t[d++],t[d],t[d+1],h,f),e=t[d++],n=t[d++];break;case l.Q:r.fromQuadratic(e,n,t[d++],t[d++],t[d],t[d+1],h,f),e=t[d++],n=t[d++];break;case l.A:var g=t[d++],y=t[d++],_=t[d++],x=t[d++],b=t[d++],w=t[d++]+b,T=(t[d++],1-t[d++]);1==d&&(o=v(b)*_+g,s=m(b)*x+y),r.fromArc(g,y,_,x,b,w,T,h,f),e=v(w)*_+g,n=m(w)*x+y;break;case l.R:o=e=t[d++],s=n=t[d++];var S=t[d++],M=t[d++];r.fromLine(o,s,o+S,s+M,h,f);break;case l.Z:e=o,n=s}i.min(u,u,h),i.max(c,c,f)}return 0===d&&(u[0]=u[1]=c[0]=c[1]=0),new a(u[0],u[1],c[0]-u[0],c[1]-u[1])},rebuildPath:function(t){for(var e,i,n,r,a,o,s=this.data,u=this._ux,c=this._uy,h=this._len,f=0;h>f;){var d=s[f++];switch(1==f&&(n=s[f],r=s[f+1],e=n,i=r),d){case l.M:e=n=s[f++],i=r=s[f++],t.moveTo(n,r);break;case l.L:a=s[f++],o=s[f++],(y(a-n)>u||y(o-r)>c||f===h-1)&&(t.lineTo(a,o),n=a,r=o);break;case l.C:t.bezierCurveTo(s[f++],s[f++],s[f++],s[f++],s[f++],s[f++]),n=s[f-2],r=s[f-1];break;case l.Q:t.quadraticCurveTo(s[f++],s[f++],s[f++],s[f++]),n=s[f-2],r=s[f-1];break;case l.A:var p=s[f++],g=s[f++],_=s[f++],x=s[f++],b=s[f++],w=s[f++],T=s[f++],S=s[f++],M=_>x?_:x,C=_>x?1:_/x,A=_>x?x/_:1,P=Math.abs(_-x)>.001,L=b+w;P?(t.translate(p,g),t.rotate(T),t.scale(C,A),t.arc(0,0,M,b,L,1-S),t.scale(1/C,1/A),t.rotate(-T),t.translate(-p,-g)):t.arc(p,g,M,b,L,1-S),1==f&&(e=v(b)*_+p,i=m(b)*x+g),n=v(L)*_+p,r=m(L)*x+g;break;case l.R:e=n=s[f],i=r=s[f+1],t.rect(s[f++],s[f++],s[f++],s[f++]);break;case l.Z:t.closePath(),n=e,r=i}}}},x.CMD=l,x}),e("zrender/graphic/Pattern",[he],function(){var t=function(t,e){this.image=t,this.repeat=e,this.type="pattern"};return t[W].getCanvasPattern=function(t){return this._canvasPattern||(this._canvasPattern=t.createPattern(this.image,this.repeat))},t}),e("zrender/graphic/Displayable",[he,i,"./Style","../Element","./mixin/RectText"],function(t){function e(t){t=t||{},a.call(this,t);for(var e in t)t.hasOwnProperty(e)&&"style"!==e&&(this[e]=t[e]);this.style=new r(t.style),this._rect=null,this.__clipPaths=[]}var n=t(i),r=t("./Style"),a=t("../Element"),o=t("./mixin/RectText");return e[W]={constructor:e,type:"displayable",__dirty:!0,invisible:!1,z:0,z2:0,zlevel:0,draggable:!1,dragging:!1,silent:!1,culling:!1,cursor:"pointer",rectHover:!1,progressive:-1,beforeBrush:function(){},afterBrush:function(){},brush:function(){},getBoundingRect:function(){},contain:function(t,e){return this.rectContain(t,e)},traverse:function(t,e){t.call(e,this)},rectContain:function(t,e){var i=this.transformCoordToLocal(t,e),n=this[ie]();return n[x](i[0],i[1])},dirty:function(){this.__dirty=!0,this._rect=null,this.__zr&&this.__zr.refresh()},animateStyle:function(t){return this.animate("style",t)},attrKV:function(t,e){"style"!==t?a[W].attrKV.call(this,t,e):this.style.set(e)},setStyle:function(t,e){return this.style.set(t,e),this.dirty(!1),this},useStyle:function(t){return this.style=new r(t),this.dirty(!1),this}},n[b](e,a),n.mixin(e,o),e}),e("echarts/model/mixin/makeStyleMapper",[he,ce],function(t){var e=t(ce);return function(t){for(var i=0;i<t[F];i++)t[i][1]||(t[i][1]=t[i][0]);return function(i){for(var n={},r=0;r<t[F];r++){var a=t[r][1];if(!(i&&e[N](i,a)>=0)){var o=this[u](a);null!=o&&(n[t[r][0]]=o)}}return n}}}),e("zrender/contain/path",[he,"../core/PathProxy","./line","./cubic","./quadratic","./arc","./util","../core/curve","./windingLine"],function(t){function e(t,e){return Math.abs(t-e)<g}function i(){var t=_[0];_[0]=_[1],_[1]=t}function n(t,e,n,r,a,o,s,l,u,c){if(c>e&&c>r&&c>o&&c>l||e>c&&r>c&&o>c&&l>c)return 0;var h=d.cubicRootAt(e,r,o,l,c,y);if(0===h)return 0;for(var f,p,v=0,m=-1,g=0;h>g;g++){var x=y[g],b=0===x||1===x?.5:1,w=d.cubicAt(t,n,a,s,x);u>w||(0>m&&(m=d.cubicExtrema(e,r,o,l,_),_[1]<_[0]&&m>1&&i(),f=d.cubicAt(e,r,o,l,_[0]),m>1&&(p=d.cubicAt(e,r,o,l,_[1]))),v+=2==m?x<_[0]?e>f?b:-b:x<_[1]?f>p?b:-b:p>l?b:-b:x<_[0]?e>f?b:-b:f>l?b:-b)}return v}function r(t,e,i,n,r,a,o,s){if(s>e&&s>n&&s>a||e>s&&n>s&&a>s)return 0;var l=d.quadraticRootAt(e,n,a,s,y);if(0===l)return 0;var u=d.quadraticExtremum(e,n,a);if(u>=0&&1>=u){for(var c=0,h=d.quadraticAt(e,n,a,u),f=0;l>f;f++){var p=0===y[f]||1===y[f]?.5:1,v=d.quadraticAt(t,i,r,y[f]);o>v||(c+=y[f]<u?e>h?p:-p:h>a?p:-p)}return c}var p=0===y[0]||1===y[0]?.5:1,v=d.quadraticAt(t,i,r,y[0]);return o>v?0:e>a?p:-p}function a(t,e,i,n,r,a,o,s){if(s-=e,s>i||-i>s)return 0;var l=Math.sqrt(i*i-s*s);y[0]=-l,y[1]=l;var u=Math.abs(n-r);if(1e-4>u)return 0;if(1e-4>u%m){n=0,r=m;var c=a?1:-1;return o>=y[0]+t&&o<=y[1]+t?c:0}if(a){var l=n;n=f(r),r=f(l)}else n=f(n),r=f(r);n>r&&(r+=m);for(var h=0,d=0;2>d;d++){var p=y[d];if(p+t>o){var v=Math.atan2(s,p),c=a?1:-1;0>v&&(v=m+v),(v>=n&&r>=v||v+m>=n&&r>=v+m)&&(v>Math.PI/2&&v<1.5*Math.PI&&(c=-c),h+=c)}}return h}function o(t,i,o,l,f){for(var d=0,m=0,g=0,y=0,_=0,x=0;x<t[F];){var b=t[x++];switch(b===s.M&&x>1&&(o||(d+=p(m,g,y,_,l,f))),1==x&&(m=t[x],g=t[x+1],y=m,_=g),b){case s.M:y=t[x++],_=t[x++],m=y,g=_;break;case s.L:if(o){if(v(m,g,t[x],t[x+1],i,l,f))return!0}else d+=p(m,g,t[x],t[x+1],l,f)||0;m=t[x++],g=t[x++];break;case s.C:if(o){if(u.containStroke(m,g,t[x++],t[x++],t[x++],t[x++],t[x],t[x+1],i,l,f))return!0}else d+=n(m,g,t[x++],t[x++],t[x++],t[x++],t[x],t[x+1],l,f)||0;m=t[x++],g=t[x++];break;case s.Q:if(o){if(c.containStroke(m,g,t[x++],t[x++],t[x],t[x+1],i,l,f))return!0}else d+=r(m,g,t[x++],t[x++],t[x],t[x+1],l,f)||0;m=t[x++],g=t[x++];break;case s.A:var w=t[x++],T=t[x++],S=t[x++],M=t[x++],C=t[x++],A=t[x++],P=(t[x++],1-t[x++]),L=Math.cos(C)*S+w,I=Math.sin(C)*M+T;x>1?d+=p(m,g,L,I,l,f):(y=L,_=I);var z=(l-w)*M/S+w;if(o){if(h.containStroke(w,T,M,C,C+A,P,i,z,f))return!0}else d+=a(w,T,M,C,C+A,P,z,f);m=Math.cos(C+A)*S+w,g=Math.sin(C+A)*M+T;break;case s.R:y=m=t[x++],_=g=t[x++];var k=t[x++],D=t[x++],L=y+k,I=_+D;if(o){if(v(y,_,L,_,i,l,f)||v(L,_,L,I,i,l,f)||v(L,I,y,I,i,l,f)||v(y,I,y,_,i,l,f))return!0}else d+=p(L,_,L,I,l,f),d+=p(y,I,y,_,l,f);break;case s.Z:if(o){if(v(m,g,y,_,i,l,f))return!0}else d+=p(m,g,y,_,l,f);m=y,g=_}}return o||e(g,_)||(d+=p(m,g,y,_,l,f)||0),0!==d}var s=t("../core/PathProxy").CMD,l=t("./line"),u=t("./cubic"),c=t("./quadratic"),h=t("./arc"),f=t("./util").normalizeRadian,d=t("../core/curve"),p=t("./windingLine"),v=l.containStroke,m=2*Math.PI,g=1e-4,y=[-1,-1,-1],_=[-1,-1];return{contain:function(t,e,i){return o(t,0,!1,e,i)},containStroke:function(t,e,i,n){return o(t,e,!0,i,n)}}}),e("echarts/scale/Ordinal",[he,ce,"./Scale"],function(t){var e=t(ce),i=t("./Scale"),n=i[W],r=i[z]({type:"ordinal",init:function(t,e){this._data=t,this._extent=e||[0,t[F]-1]},parse:function(t){return typeof t===q?e[N](this._data,t):Math.round(t)},contain:function(t){return t=this.parse(t),n[x].call(this,t)&&null!=this._data[t]},normalize:function(t){return n.normalize.call(this,this.parse(t))},scale:function(t){return Math.round(n.scale.call(this,t))},getTicks:function(){for(var t=[],e=this._extent,i=e[0];i<=e[1];)t.push(i),i++;return t},getLabel:function(t){return this._data[t]},count:function(){return this._extent[1]-this._extent[0]+1},unionExtentFromData:function(t,e){this.unionExtent(t.getDataExtent(e,!1))},niceTicks:e.noop,niceExtent:e.noop});return r[E]=function(){return new r},r}),e("zrender/graphic/mixin/RectText",[he,"../../contain/text","../../core/BoundingRect"],function(t){function e(t,e){return typeof t===q?t.lastIndexOf("%")>=0?parseFloat(t)/100*e:parseFloat(t):t}var i=t("../../contain/text"),n=t("../../core/BoundingRect"),r=new n,a=function(){};return a[W]={constructor:a,drawRectText:function(t,n,a){var o=this.style,l=o.text;if(null!=l&&(l+=""),l){t.save();var u,c,h=o.textPosition,f=o.textOffset,d=o.textDistance,p=o[re],v=o.textFont||o.font,m=o.textBaseline,g=o.textVerticalAlign;a=a||i[ie](l,v,p,m);var y=this.transform;if(o.textTransform?this.setTransform(t):y&&(r.copy(n),r[s](y),n=r),h instanceof Array){if(u=n.x+e(h[0],n.width),c=n.y+e(h[1],n[ee]),p=p||"left",m=m||"top",g){switch(g){case Q:c-=a[ee]/2-a.lineHeight/2;break;case Y:c-=a[ee]-a.lineHeight/2;break;default:c+=a.lineHeight/2}m=Q}}else{var _=i.adjustTextPositionOnRect(h,n,a,d);u=_.x,c=_.y,p=p||_[re],m=m||_.textBaseline}f&&(u+=f[0],c+=f[1]),t[re]=p||"left",t.textBaseline=m||"alphabetic";var x=o.textFill,b=o.textStroke;x&&(t.fillStyle=x),b&&(t.strokeStyle=b),t.font=v||"12px sans-serif",t.shadowBlur=o.textShadowBlur,t.shadowColor=o.textShadowColor||"transparent",t.shadowOffsetX=o.textShadowOffsetX,t.shadowOffsetY=o.textShadowOffsetY;var w=l.split("\n");o.textRotation&&(y&&t.translate(y[4],y[5]),t.rotate(o.textRotation),y&&t.translate(-y[4],-y[5]));for(var T=0;T<w[F];T++)x&&t.fillText(w[T],u,c),b&&t.strokeText(w[T],u,c),c+=a.lineHeight;t.restore()}}},a}),e("echarts/model/mixin/boxLayout",[he],function(){return{getBoxLayoutParams:function(){return{left:this.get("left"),top:this.get("top"),right:this.get("right"),bottom:this.get(Y),width:this.get("width"),height:this.get(ee)}}}}),e("zrender/Element",[he,"./core/guid","./mixin/Eventful","./mixin/Transformable","./mixin/Animatable","./core/util"],function(t){var e=t("./core/guid"),i=t("./mixin/Eventful"),n=t("./mixin/Transformable"),r=t("./mixin/Animatable"),a=t("./core/util"),o=function(t){n.call(this,t),i.call(this,t),r.call(this,t),this.id=t.id||e()};return o[W]={type:"element",name:"",__zr:null,ignore:!1,clipPath:null,drift:function(t,e){switch(this.draggable){case"horizontal":e=0;break;case"vertical":t=0}var i=this.transform;i||(i=this.transform=[1,0,0,1,0,0]),i[4]+=t,i[5]+=e,this.decomposeTransform(),this.dirty(!1)},beforeUpdate:function(){},afterUpdate:function(){},update:function(){this.updateTransform()},traverse:function(){},attrKV:function(t,e){if(t===j||"scale"===t||"origin"===t){if(e){var i=this[t];i||(i=this[t]=[]),i[0]=e[0],i[1]=e[1]}}else this[t]=e},hide:function(){this[G]=!0,this.__zr&&this.__zr.refresh()},show:function(){this[G]=!1,this.__zr&&this.__zr.refresh()},attr:function(t,e){if(typeof t===q)this.attrKV(t,e);else if(a[V](t))for(var i in t)t.hasOwnProperty(i)&&this.attrKV(i,t[i]);return this.dirty(!1),this},setClipPath:function(t){var e=this.__zr;e&&t.addSelfToZr(e),this.clipPath&&this.clipPath!==t&&this.removeClipPath(),this.clipPath=t,t.__zr=e,t.__clipTarget=this,this.dirty(!1)},removeClipPath:function(){var t=this.clipPath;t&&(t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__clipTarget=null,this.clipPath=null,this.dirty(!1))},addSelfToZr:function(t){this.__zr=t;var e=this.animators;if(e)for(var i=0;i<e[F];i++)t[H].addAnimator(e[i]);this.clipPath&&this.clipPath.addSelfToZr(t)},removeSelfFromZr:function(t){this.__zr=null;var e=this.animators;if(e)for(var i=0;i<e[F];i++)t[H].removeAnimator(e[i]);this.clipPath&&this.clipPath.removeSelfFromZr(t)}},a.mixin(o,r),a.mixin(o,n),a.mixin(o,i),o}),e("zrender/graphic/Style",[he],function(){function t(t,e,i){var n=e.x,r=e.x2,a=e.y,o=e.y2;e.global||(n=n*i.width+i.x,r=r*i.width+i.x,a=a*i[ee]+i.y,o=o*i[ee]+i.y);var s=t.createLinearGradient(n,a,r,o);return s}function e(t,e,i){var n=i.width,r=i[ee],a=Math.min(n,r),o=e.x,s=e.y,l=e.r;e.global||(o=o*n+i.x,s=s*r+i.y,l*=a);var u=t.createRadialGradient(o,s,0,o,s,l);return u}var i=[["shadowBlur",0],["shadowOffsetX",0],["shadowOffsetY",0],["shadowColor","#000"],["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]],n=function(t){this.extendFrom(t)};n[W]={constructor:n,fill:"#000000",stroke:null,opacity:1,lineDash:null,lineDashOffset:0,shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,lineWidth:1,strokeNoScale:!1,text:null,textFill:"#000",textStroke:null,textPosition:"inside",textOffset:null,textBaseline:null,textAlign:null,textVerticalAlign:null,textDistance:5,textShadowBlur:0,textShadowOffsetX:0,textShadowOffsetY:0,textTransform:!1,textRotation:0,blend:null,bind:function(t,e,n){for(var r=this,a=n&&n.style,s=!a,l=0;l<i[F];l++){var u=i[l],c=u[0];(s||r[c]!==a[c])&&(t[c]=r[c]||u[1])}if((s||r.fill!==a.fill)&&(t.fillStyle=r.fill),(s||r[o]!==a[o])&&(t.strokeStyle=r[o]),(s||r[Z]!==a[Z])&&(t.globalAlpha=null==r[Z]?1:r[Z]),(s||r.blend!==a.blend)&&(t.globalCompositeOperation=r.blend||"source-over"),this.hasStroke()){var h=r.lineWidth;t.lineWidth=h/(this.strokeNoScale&&e&&e.getLineScale?e.getLineScale():1)}},hasFill:function(){var t=this.fill;return null!=t&&"none"!==t},hasStroke:function(){var t=this[o];return null!=t&&"none"!==t&&this.lineWidth>0},extendFrom:function(t,e){if(t){var i=this;for(var n in t)!t.hasOwnProperty(n)||!e&&i.hasOwnProperty(n)||(i[n]=t[n])}},set:function(t,e){typeof t===q?this[t]=e:this.extendFrom(t,!0)},clone:function(){var t=new this.constructor;return t.extendFrom(this,!0),t},getGradient:function(i,n,r){for(var a="radial"===n.type?e:t,o=a(i,n,r),s=n[D],l=0;l<s[F];l++)o.addColorStop(s[l][c],s[l].color);return o}};for(var r=n[W],a=0;a<i[F];a++){var s=i[a];s[0]in r||(r[s[0]]=s[1])}return n.getGradient=r.getGradient,n}),e("echarts/coord/cartesian/Cartesian",[he,ce],function(t){function e(t){return this._axes[t]}var i=t(ce),n=function(t){this._axes={},this._dimList=[],this.name=t||""};return n[W]={constructor:n,type:"cartesian",getAxis:function(t){return this._axes[t]},getAxes:function(){return i.map(this._dimList,e,this)},getAxesByScale:function(t){return t=t[U](),i.filter(this.getAxes(),function(e){return e.scale.type===t})},addAxis:function(t){var e=t.dim;this._axes[e]=t,this._dimList.push(e)},dataToCoord:function(t){return this._dataCoordConvert(t,"dataToCoord")},coordToData:function(t){return this._dataCoordConvert(t,"coordToData")},_dataCoordConvert:function(t,e){for(var i=this._dimList,n=t instanceof Array?[]:{},r=0;r<i[F];r++){var a=i[r],o=this._axes[a];n[a]=o[e](t[a])}return n}},n}),e("echarts/util/component",[he,ce,"./clazz"],function(t){var e=t(ce),i=t("./clazz"),n=i.parseClassType,r=0,a={},o="_";return a.getUID=function(t){return[t||"",r++,Math.random()].join(o)},a.enableSubTypeDefaulter=function(t){var e={};return t.registerSubTypeDefaulter=function(t,i){t=n(t),e[t.main]=i},t.determineSubType=function(i,r){var a=r.type;if(!a){var o=n(i).main;t.hasSubTypes(i)&&e[o]&&(a=e[o](r))}return a},t},a.enableTopologicalTravel=function(t,i){function n(t){var n={},o=[];return e.each(t,function(s){var l=r(n,s),u=l.originalDeps=i(s),c=a(u,t);l.entryCount=c[F],0===l.entryCount&&o.push(s),e.each(c,function(t){e[N](l.predecessor,t)<0&&l.predecessor.push(t);var i=r(n,t);e[N](i.successor,t)<0&&i.successor.push(s)})}),{graph:n,noEntryList:o}}function r(t,e){return t[e]||(t[e]={predecessor:[],successor:[]}),t[e]}function a(t,i){var n=[];return e.each(t,function(t){e[N](i,t)>=0&&n.push(t)}),n}t.topologicalTravel=function(t,i,r,a){function o(t){u[t].entryCount--,0===u[t].entryCount&&c.push(t)}function s(t){h[t]=!0,o(t)}if(t[F]){var l=n(i),u=l.graph,c=l.noEntryList,h={};for(e.each(t,function(t){h[t]=!0});c[F];){var f=c.pop(),d=u[f],p=!!h[f];p&&(r.call(a,f,d.originalDeps.slice()),delete h[f]),e.each(d.successor,p?s:o)}e.each(h,function(){throw new Error("Circle dependency may exists")})}}},a}),e("echarts/coord/cartesian/axisLabelInterval",[he,ce,"../axisHelper"],function(t){var e=t(ce),i=t("../axisHelper");return function(t){var n=t.model,r=n[oe]("axisLabel"),a=r.get("interval");return"category"!==t.type||"auto"!==a?"auto"===a?0:a:i.getAxisLabelInterval(e.map(t.scale.getTicks(),t.dataToCoord,t),n.getFormattedLabels(),r[oe](ae)[ne](),t.isHorizontal())}}),e("zrender/mixin/Transformable",[he,"../core/matrix","../core/vector"],function(t){function e(t){return t>a||-a>t}var i=t("../core/matrix"),n=t("../core/vector"),r=i.identity,a=5e-5,o=function(t){t=t||{},t[j]||(this[j]=[0,0]),null==t.rotation&&(this.rotation=0),t.scale||(this.scale=[1,1]),this.origin=this.origin||null},l=o[W];l.transform=null,l.needLocalTransform=function(){return e(this.rotation)||e(this[j][0])||e(this[j][1])||e(this.scale[0]-1)||e(this.scale[1]-1)},l.updateTransform=function(){var t=this[h],e=t&&t.transform,n=this.needLocalTransform(),a=this.transform;return n||e?(a=a||i[E](),n?this.getLocalTransform(a):r(a),e&&(n?i.mul(a,t.transform,a):i.copy(a,t.transform)),this.transform=a,this.invTransform=this.invTransform||i[E](),void i.invert(this.invTransform,a)):void(a&&r(a))},l.getLocalTransform=function(t){t=t||[],r(t);var e=this.origin,n=this.scale,a=this.rotation,o=this[j];return e&&(t[4]-=e[0],t[5]-=e[1]),i.scale(t,t,n),a&&i.rotate(t,t,a),e&&(t[4]+=e[0],t[5]+=e[1]),t[4]+=o[0],t[5]+=o[1],t},l.setTransform=function(t){var e=this.transform,i=t.dpr||1;e?t.setTransform(i*e[0],i*e[1],i*e[2],i*e[3],i*e[4],i*e[5]):t.setTransform(i,0,0,i,0,0)},l.restoreTransform=function(t){var e=(this.transform,t.dpr||1);t.setTransform(e,0,0,e,0,0)};var u=[];return l.decomposeTransform=function(){if(this.transform){var t=this[h],n=this.transform;t&&t.transform&&(i.mul(u,t.invTransform,n),n=u);var r=n[0]*n[0]+n[1]*n[1],a=n[2]*n[2]+n[3]*n[3],o=this[j],s=this.scale;e(r-1)&&(r=Math.sqrt(r)),e(a-1)&&(a=Math.sqrt(a)),n[0]<0&&(r=-r),n[3]<0&&(a=-a),o[0]=n[4],o[1]=n[5],s[0]=r,s[1]=a,this.rotation=Math.atan2(-n[1]/a,n[0]/r)}},l.getGlobalScale=function(){var t=this.transform;if(!t)return[1,1];var e=Math.sqrt(t[0]*t[0]+t[1]*t[1]),i=Math.sqrt(t[2]*t[2]+t[3]*t[3]);return t[0]<0&&(e=-e),t[3]<0&&(i=-i),[e,i]},l.transformCoordToLocal=function(t,e){var i=[t,e],r=this.invTransform;return r&&n[s](i,i,r),i},l.transformCoordToGlobal=function(t,e){var i=[t,e],r=this.transform;return r&&n[s](i,i,r),i},o}),e("echarts/coord/Axis",[he,"../util/number",ce],function(t){function e(t,e){var i=t[1]-t[0],n=e,r=i/n/2;t[0]+=r,t[1]-=r}var i=t("../util/number"),n=i.linearMap,r=t(ce),a=[0,1],o=function(t,e,i){this.dim=t,this.scale=e,this._extent=i||[0,0],this.inverse=!1,this.onBand=!1};return o[W]={constructor:o,contain:function(t){var e=this._extent,i=Math.min(e[0],e[1]),n=Math.max(e[0],e[1]);return t>=i&&n>=t},containData:function(t){return this[x](this.dataToCoord(t))},getExtent:function(){var t=this._extent.slice();return t},getPixelPrecision:function(t){return i.getPixelPrecision(t||this.scale[_](),this._extent)},setExtent:function(t,e){var i=this._extent;i[0]=t,i[1]=e},dataToCoord:function(t,i){var r=this._extent,o=this.scale;return t=o.normalize(t),this.onBand&&o.type===l&&(r=r.slice(),e(r,o.count())),n(t,a,r,i)},coordToData:function(t,i){var r=this._extent,o=this.scale;this.onBand&&o.type===l&&(r=r.slice(),e(r,o.count()));var s=n(t,r,a,i);return this.scale.scale(s)},getTicksCoords:function(t){if(this.onBand&&!t){for(var e=this.getBands(),i=[],n=0;n<e[F];n++)i.push(e[n][0]);return e[n-1]&&i.push(e[n-1][1]),i}return r.map(this.scale.getTicks(),this.dataToCoord,this)},getLabelsCoords:function(){return r.map(this.scale.getTicks(),this.dataToCoord,this)},getBands:function(){for(var t=this[_](),e=[],i=this.scale.count(),n=t[0],r=t[1],a=r-n,o=0;i>o;o++)e.push([a*o/i+n,a*(o+1)/i+n]);return e},getBandWidth:function(){var t=this._extent,e=this.scale[_](),i=e[1]-e[0]+(this.onBand?1:0);0===i&&(i=1);var n=Math.abs(t[1]-t[0]);return Math.abs(n)/i},isBlank:function(){return this._isBlank},setBlank:function(t){this._isBlank=t}},o}),e("zrender/core/guid",[],function(){var t=2311;return function(){return t++}}),e("zrender/mixin/Animatable",[he,"../animation/Animator",i,"../core/log"],function(t){var e=t("../animation/Animator"),n=t(i),r=n.isString,a=n.isFunction,o=n[V],s=t("../core/log"),l=function(){this.animators=[]};return l[W]={constructor:l,animate:function(t,i){var r,a=!1,o=this,l=this.__zr;if(t){var u=t.split("."),c=o;a="shape"===u[0];for(var h=0,f=u[F];f>h;h++)c&&(c=c[u[h]]);c&&(r=c)}else r=o;if(!r)return void s('Property "'+t+'" is not existed in element '+o.id);var d=o.animators,p=new e(r,i);return p.during(function(){o.dirty(a)}).done(function(){d[L](n[N](d,p),1)}),d.push(p),l&&l[H].addAnimator(p),p},stopAnimation:function(t){for(var e=this.animators,i=e[F],n=0;i>n;n++)e[n].stop(t);return e[F]=0,this},animateTo:function(t,e,i,n,o){function s(){u--,u||o&&o()}r(i)?(o=n,n=i,i=0):a(n)?(o=n,n="linear",i=0):a(i)?(o=i,i=0):a(e)?(o=e,e=500):e||(e=500),this.stopAnimation(),this._animateToShallow("",this,t,e,i,n,o);var l=this.animators.slice(),u=l[F];u||o&&o();for(var c=0;c<l[F];c++)l[c].done(s).start(n)},_animateToShallow:function(t,e,i,r,a){var s={},l=0;for(var u in i)if(i.hasOwnProperty(u))if(null!=e[u])o(i[u])&&!n.isArrayLike(i[u])?this._animateToShallow(t?t+"."+u:u,e[u],i[u],r,a):(s[u]=i[u],l++);else if(null!=i[u])if(t){var c={};c[t]={},c[t][u]=i[u],this.attr(c)}else this.attr(u,i[u]);return l>0&&this.animate(t,!1).when(null==r?500:r,s).delay(a||0),this}},l}),e("echarts/coord/cartesian/AxisModel",[he,"../../model/Component",ce,"../axisModelCreator","../axisModelCommonMixin"],function(t){function e(t,e){return e.type||(e.data?"category":"value")}var i=t("../../model/Component"),n=t(ce),o=t("../axisModelCreator"),s=i[z]({type:"cartesian2dAxis",axis:null,init:function(){s.superApply(this,"init",arguments),this.resetRange()},mergeOption:function(){s.superApply(this,"mergeOption",arguments),this.resetRange()},restoreData:function(){s.superApply(this,"restoreData",arguments),this.resetRange()},getCoordSysModel:function(){return this[r].queryComponents({mainType:"grid",index:this[a].gridIndex,id:this[a].gridId})[0]}});n.merge(s[W],t("../axisModelCommonMixin"));
var l={offset:0};return o("x",s,e,l),o("y",s,e,l),s}),e("zrender/core/log",[he,"../config"],function(t){var e=t("../config");return function(){if(0!==e.debugMode)if(1==e.debugMode)for(var t in arguments)throw new Error(arguments[t]);else if(e.debugMode>1)for(var t in arguments)console.log(arguments[t])}}),e("zrender/animation/Animator",[he,"./Clip","../tool/color",i],function(t){function e(t,e){return t[e]}function n(t,e,i){t[e]=i}function r(t,e,i){return(e-t)*i+t}function a(t,e,i){return i>.5?e:t}function o(t,e,i,n,a){var o=t[F];if(1==a)for(var s=0;o>s;s++)n[s]=r(t[s],e[s],i);else for(var l=t[0][F],s=0;o>s;s++)for(var u=0;l>u;u++)n[s][u]=r(t[s][u],e[s][u],i)}function s(t,e,i){var n=t[F],r=e[F];if(n!==r){var a=n>r;if(a)t[F]=r;else for(var o=n;r>o;o++)t.push(1===i?e[o]:y.call(e[o]))}for(var s=t[0]&&t[0][F],o=0;o<t[F];o++)if(1===i)isNaN(t[o])&&(t[o]=e[o]);else for(var l=0;s>l;l++)isNaN(t[o][l])&&(t[o][l]=e[o][l])}function l(t,e,i){if(t===e)return!0;var n=t[F];if(n!==e[F])return!1;if(1===i){for(var r=0;n>r;r++)if(t[r]!==e[r])return!1}else for(var a=t[0][F],r=0;n>r;r++)for(var o=0;a>o;o++)if(t[r][o]!==e[r][o])return!1;return!0}function u(t,e,i,n,r,a,o,s,l){var u=t[F];if(1==l)for(var h=0;u>h;h++)s[h]=c(t[h],e[h],i[h],n[h],r,a,o);else for(var f=t[0][F],h=0;u>h;h++)for(var d=0;f>d;d++)s[h][d]=c(t[h][d],e[h][d],i[h][d],n[h][d],r,a,o)}function c(t,e,i,n,r,a,o){var s=.5*(i-t),l=.5*(n-e);return(2*(e-i)+s+l)*o+(-3*(e-i)-2*s-l)*a+s*r+e}function h(t){if(g(t)){var e=t[F];if(g(t[0])){for(var i=[],n=0;e>n;n++)i.push(y.call(t[n]));return i}return y.call(t)}return t}function f(t){return t[0]=Math.floor(t[0]),t[1]=Math.floor(t[1]),t[2]=Math.floor(t[2]),"rgba("+t.join(",")+")"}function d(t,e,i,n,h){var d=t._getter,m=t._setter,y="spline"===e,_=n[F];if(_){var x,b=n[0].value,w=g(b),T=!1,S=!1,M=w&&g(b[0])?2:1;n.sort(function(t,e){return t.time-e.time}),x=n[_-1].time;for(var C=[],A=[],P=n[0].value,L=!0,I=0;_>I;I++){C.push(n[I].time/x);var z=n[I].value;if(w&&l(z,P,M)||!w&&z===P||(L=!1),P=z,typeof z==q){var k=v.parse(z);k?(z=k,T=!0):S=!0}A.push(z)}if(!L){for(var D=A[_-1],I=0;_-1>I;I++)w?s(A[I],D,M):!isNaN(A[I])||isNaN(D)||S||T||(A[I]=D);w&&s(d(t._target,h),D,M);var O,E,B,R,N,G,V=0,H=0;if(T)var W=[0,0,0,0];var U=function(t,e){var i;if(0>e)i=0;else if(H>e){for(O=Math.min(V+1,_-1),i=O;i>=0&&!(C[i]<=e);i--);i=Math.min(i,_-2)}else{for(i=V;_>i&&!(C[i]>e);i++);i=Math.min(i-1,_-2)}V=i,H=e;var n=C[i+1]-C[i];if(0!==n)if(E=(e-C[i])/n,y)if(R=A[i],B=A[0===i?i:i-1],N=A[i>_-2?_-1:i+1],G=A[i>_-3?_-1:i+2],w)u(B,R,N,G,E,E*E,E*E*E,d(t,h),M);else{var s;if(T)s=u(B,R,N,G,E,E*E,E*E*E,W,1),s=f(W);else{if(S)return a(R,N,E);s=c(B,R,N,G,E,E*E,E*E*E)}m(t,h,s)}else if(w)o(A[i],A[i+1],E,d(t,h),M);else{var s;if(T)o(A[i],A[i+1],E,W,1),s=f(W);else{if(S)return a(A[i],A[i+1],E);s=r(A[i],A[i+1],E)}m(t,h,s)}},Z=new p({target:t._target,life:x,loop:t._loop,delay:t._delay,onframe:U,ondestroy:i});return e&&"spline"!==e&&(Z.easing=e),Z}}}var p=t("./Clip"),v=t("../tool/color"),m=t(i),g=m.isArrayLike,y=Array[W].slice,_=function(t,i,r,a){this._tracks={},this._target=t,this._loop=i||!1,this._getter=r||e,this._setter=a||n,this._clipCount=0,this._delay=0,this._doneList=[],this._onframeList=[],this._clipList=[]};return _[W]={when:function(t,e){var i=this._tracks;for(var n in e)if(e.hasOwnProperty(n)){if(!i[n]){i[n]=[];var r=this._getter(this._target,n);if(null==r)continue;0!==t&&i[n].push({time:0,value:h(r)})}i[n].push({time:t,value:e[n]})}return this},during:function(t){return this._onframeList.push(t),this},_doneCallback:function(){this._tracks={},this._clipList[F]=0;for(var t=this._doneList,e=t[F],i=0;e>i;i++)t[i].call(this)},start:function(t){var e,i=this,n=0,r=function(){n--,n||i._doneCallback()};for(var a in this._tracks)if(this._tracks.hasOwnProperty(a)){var o=d(this,t,r,this._tracks[a],a);o&&(this._clipList.push(o),n++,this[H]&&this[H].addClip(o),e=o)}if(e){var s=e.onframe;e.onframe=function(t,e){s(t,e);for(var n=0;n<i._onframeList[F];n++)i._onframeList[n](t,e)}}return n||this._doneCallback(),this},stop:function(t){for(var e=this._clipList,i=this[H],n=0;n<e[F];n++){var r=e[n];t&&r.onframe(this._target,1),i&&i.removeClip(r)}e[F]=0},delay:function(t){return this._delay=t,this},done:function(t){return t&&this._doneList.push(t),this},getClips:function(){return this._clipList}},_}),e("echarts/coord/axisModelCommonMixin",[he,ce,"./axisHelper"],function(t){function e(t){return i[V](t)&&null!=t.value?t.value:t}var i=t(ce),n=t("./axisHelper");return{getFormattedLabels:function(){return n.getFormattedLabels(this.axis,this.get("axisLabel.formatter"))},getCategories:function(){return"category"===this.get("type")&&i.map(this.get("data"),e)},getMin:function(t){var e=this[a],n=t||null==e.rangeStart?e.min:e.rangeStart;return null==n||"dataMin"===n||i.eqNaN(n)||(n=this.axis.scale.parse(n)),n},getMax:function(t){var e=this[a],n=t||null==e.rangeEnd?e.max:e.rangeEnd;return null==n||"dataMax"===n||i.eqNaN(n)||(n=this.axis.scale.parse(n)),n},getNeedCrossZero:function(){var t=this[a];return null!=t.rangeStart||null!=t.rangeEnd?!1:!t.scale},getCoordSysModel:i.noop,setRange:function(t,e){this[a].rangeStart=t,this[a].rangeEnd=e},resetRange:function(){this[a].rangeStart=this[a].rangeEnd=null}}}),e("echarts/coord/axisModelCreator",[he,"./axisDefault",ce,"../model/Component","../util/layout"],function(t){var e=t("./axisDefault"),i=t(ce),n=t("../model/Component"),r=t("../util/layout"),a=["value","category","time","log"];return function(t,o,s,l){i.each(a,function(n){o[z]({type:t+"Axis."+n,mergeDefaultAndTheme:function(e,a){var o=this.layoutMode,l=o?r.getLayoutParams(e):{},u=a.getTheme();i.merge(e,u.get(n+"Axis")),i.merge(e,this.getDefaultOption()),e.type=s(t,e),o&&r.mergeLayoutParam(e,l,o)},defaultOption:i.mergeAll([{},e[n+"Axis"],l],!0)})}),n.registerSubTypeDefaulter(t+"Axis",i.curry(s,t))}}),e("zrender/animation/Clip",[he,"./easing"],function(t){function e(t){this._target=t.target,this._life=t.life||1e3,this._delay=t.delay||0,this._initialized=!1,this.loop=null==t.loop?!1:t.loop,this.gap=t.gap||0,this.easing=t.easing||"Linear",this.onframe=t.onframe,this.ondestroy=t.ondestroy,this.onrestart=t.onrestart}var i=t("./easing");return e[W]={constructor:e,step:function(t){this._initialized||(this._startTime=t+this._delay,this._initialized=!0);var e=(t-this._startTime)/this._life;if(!(0>e)){e=Math.min(e,1);var n=this.easing,r=typeof n==q?i[n]:n,a=typeof r===T?r(e):e;return this.fire("frame",a),1==e?this.loop?(this.restart(t),"restart"):(this._needsRemove=!0,"destroy"):null}},restart:function(t){var e=(t-this._startTime)%this._life;this._startTime=t-e+this.gap,this._needsRemove=!1},fire:function(t,e){t="on"+t,this[t]&&this[t](this._target,e)}},e}),e("echarts/coord/axisDefault",[he,ce],function(t){var e=t(ce),i={show:!0,zlevel:0,z:0,inverse:!1,name:"",nameLocation:"end",nameRotate:null,nameTruncate:{maxWidth:null,ellipsis:"...",placeholder:"."},nameTextStyle:{},nameGap:15,silent:!1,triggerEvent:!1,tooltip:{show:!1},axisLine:{show:!0,onZero:!0,lineStyle:{color:"#333",width:1,type:"solid"}},axisTick:{show:!0,inside:!1,length:5,lineStyle:{width:1}},axisLabel:{show:!0,inside:!1,rotate:0,margin:8,textStyle:{fontSize:12}},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},n=e.merge({boundaryGap:!0,splitLine:{show:!1},axisTick:{alignWithLabel:!1,interval:"auto"},axisLabel:{interval:"auto"}},i),r=e.merge({boundaryGap:[0,0],splitNumber:5},i),a=e[se]({scale:!0,min:"dataMin",max:"dataMax"},r),o=e[se]({logBase:10},r);return o.scale=!0,{categoryAxis:n,valueAxis:r,timeAxis:a,logAxis:o}}),e("zrender/animation/easing",[],function(){var t={linear:function(t){return t},quadraticIn:function(t){return t*t},quadraticOut:function(t){return t*(2-t)},quadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},cubicIn:function(t){return t*t*t},cubicOut:function(t){return--t*t*t+1},cubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},quarticIn:function(t){return t*t*t*t},quarticOut:function(t){return 1- --t*t*t*t},quarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},quinticIn:function(t){return t*t*t*t*t},quinticOut:function(t){return--t*t*t*t*t+1},quinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},sinusoidalIn:function(t){return 1-Math.cos(t*Math.PI/2)},sinusoidalOut:function(t){return Math.sin(t*Math.PI/2)},sinusoidalInOut:function(t){return.5*(1-Math.cos(Math.PI*t))},exponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},exponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},exponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)},circularIn:function(t){return 1-Math.sqrt(1-t*t)},circularOut:function(t){return Math.sqrt(1- --t*t)},circularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},elasticIn:function(t){var e,i=.1,n=.4;return 0===t?0:1===t?1:(!i||1>i?(i=1,e=n/4):e=n*Math.asin(1/i)/(2*Math.PI),-(i*Math.pow(2,10*(t-=1))*Math.sin(2*(t-e)*Math.PI/n)))},elasticOut:function(t){var e,i=.1,n=.4;return 0===t?0:1===t?1:(!i||1>i?(i=1,e=n/4):e=n*Math.asin(1/i)/(2*Math.PI),i*Math.pow(2,-10*t)*Math.sin(2*(t-e)*Math.PI/n)+1)},elasticInOut:function(t){var e,i=.1,n=.4;return 0===t?0:1===t?1:(!i||1>i?(i=1,e=n/4):e=n*Math.asin(1/i)/(2*Math.PI),(t*=2)<1?-.5*i*Math.pow(2,10*(t-=1))*Math.sin(2*(t-e)*Math.PI/n):i*Math.pow(2,-10*(t-=1))*Math.sin(2*(t-e)*Math.PI/n)*.5+1)},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},backInOut:function(t){var e=2.5949095;return(t*=2)<1?.5*t*t*((e+1)*t-e):.5*((t-=2)*t*((e+1)*t+e)+2)},bounceIn:function(e){return 1-t.bounceOut(1-e)},bounceOut:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bounceInOut:function(e){return.5>e?.5*t.bounceIn(2*e):.5*t.bounceOut(2*e-1)+.5}};return t}),e("echarts/chart/bar/BaseBarSeries",[he,"../../model/Series","../helper/createListFromArray"],function(t){var e=t("../../model/Series"),i=t("../helper/createListFromArray");return e[z]({type:"series.__base_bar__",getInitialData:function(t,e){return i(t.data,this,e)},getMarkerPosition:function(t){var e=this[le];if(e){var i=e[g](t,!0),n=this[ue](),r=n.getLayout(c),a=n.getLayout("size"),o=e.getBaseAxis().isHorizontal()?0:1;return i[o]+=r+a/2,i}return[0/0,0/0]},defaultOption:{zlevel:0,z:2,coordinateSystem:"cartesian2d",legendHoverLink:!0,barMinHeight:0,itemStyle:{normal:{},emphasis:{}}}})}),e("zrender/config",[],function(){var t=1;typeof window!==n&&(t=Math.max(window.devicePixelRatio||1,1));var e={debugMode:0,devicePixelRatio:t};return e}),e("echarts/chart/helper/createListFromArray",[he,"../../data/List","../../data/helper/completeDimensions",ce,"../../util/model","../../CoordinateSystem"],function(t){function e(t){for(var e=0;e<t[F]&&null==t[e];)e++;return t[e]}function i(t){var i=e(t);return null!=i&&!c[S](d(i))}function n(t,e,n){t=t||[];var r=e.get(le),a=v[r],l=f.get(r),m=a&&a(t,e,n),g=m&&m.dimensions;g||(g=l&&l.dimensions||["x","y"],g=u(g,t,g[y](["value"])));var _=m?m.categoryIndex:-1,x=new s(g,e),b=o(m,t),w={},T=_>=0&&i(t)?function(t,e,i,n){return h.isDataItemOption(t)&&(x.hasItemOption=!0),n===_?i:p(d(t),g[n])}:function(t,e,i,n){var r=d(t),a=p(r&&r[n],g[n]);h.isDataItemOption(t)&&(x.hasItemOption=!0);var o=m&&m.categoryAxesModels;return o&&o[e]&&typeof a===q&&(w[e]=w[e]||o[e].getCategories(),a=c[N](w[e],a),0>a&&!isNaN(a)&&(a=+a)),a};return x.hasItemOption=!1,x.initData(t,b,T),x}function r(t){return"category"!==t&&"time"!==t}function a(t){return"category"===t?l:"time"===t?"time":"float"}function o(t,e){var i,n=[],r=t&&t.dimensions[t.categoryIndex];if(r&&(i=t.categoryAxesModels[r.name]),i){var a=i.getCategories();if(a){var o=e[F];if(c[S](e[0])&&e[0][F]>1){n=[];for(var s=0;o>s;s++)n[s]=a[e[s][t.categoryIndex||0]]}else n=a.slice(0)}}return n}var s=t("../../data/List"),u=t("../../data/helper/completeDimensions"),c=t(ce),h=t("../../util/model"),f=t("../../CoordinateSystem"),d=h.getDataItemValue,p=h.converDataValue,v={cartesian2d:function(t,e,i){var n=c.map(["xAxis","yAxis"],function(t){return i.queryComponents({mainType:t,index:e.get(t+"Index"),id:e.get(t+"Id")})[0]}),o=n[0],s=n[1],l=o.get("type"),h=s.get("type"),f=[{name:"x",type:a(l),stackable:r(l)},{name:"y",type:a(h),stackable:r(h)}],d="category"===l,p="category"===h;u(f,t,["x","y","z"]);var v={};return d&&(v.x=o),p&&(v.y=s),{dimensions:f,categoryIndex:d?0:p?1:-1,categoryAxesModels:v}},singleAxis:function(t,e,i){var n=i.queryComponents({mainType:"singleAxis",index:e.get("singleAxisIndex"),id:e.get("singleAxisId")})[0],o=n.get("type"),s="category"===o,l=[{name:"single",type:a(o),stackable:r(o)}];u(l,t);var c={};return s&&(c.single=n),{dimensions:l,categoryIndex:s?0:-1,categoryAxesModels:c}},polar:function(t,e,i){var n=i.queryComponents({mainType:"polar",index:e.get("polarIndex"),id:e.get("polarId")})[0],o=n.findAxisModel("angleAxis"),s=n.findAxisModel("radiusAxis"),l=s.get("type"),c=o.get("type"),h=[{name:"radius",type:a(l),stackable:r(l)},{name:"angle",type:a(c),stackable:r(c)}],f="category"===c,d="category"===l;u(h,t,["radius","angle","value"]);var p={};return d&&(p.radius=s),f&&(p.angle=o),{dimensions:h,categoryIndex:f?1:d?0:-1,categoryAxesModels:p}},geo:function(t){return{dimensions:u([{name:"lng"},{name:"lat"}],t,["lng","lat","value"])}}};return n}),e("zrender/core/curve",[he,"./vector"],function(t){function e(t){return t>-x&&x>t}function i(t){return t>x||-x>t}function n(t,e,i,n,r){var a=1-r;return a*a*(a*t+3*r*e)+r*r*(r*n+3*a*i)}function r(t,e,i,n,r){var a=1-r;return 3*(((e-t)*a+2*(i-e)*r)*a+(n-i)*r*r)}function a(t,i,n,r,a,o){var s=r+3*(i-n)-t,l=3*(n-2*i+t),u=3*(i-t),c=t-a,h=l*l-3*s*u,f=l*u-9*s*c,d=u*u-3*l*c,p=0;if(e(h)&&e(f))if(e(l))o[0]=0;else{var v=-u/l;v>=0&&1>=v&&(o[p++]=v)}else{var m=f*f-4*h*d;if(e(m)){var g=f/h,v=-l/s+g,x=-g/2;v>=0&&1>=v&&(o[p++]=v),x>=0&&1>=x&&(o[p++]=x)}else if(m>0){var b=_(m),S=h*l+1.5*s*(-f+b),M=h*l+1.5*s*(-f-b);S=0>S?-y(-S,T):y(S,T),M=0>M?-y(-M,T):y(M,T);var v=(-l-(S+M))/(3*s);v>=0&&1>=v&&(o[p++]=v)}else{var C=(2*h*l-3*s*f)/(2*_(h*h*h)),A=Math.acos(C)/3,P=_(h),L=Math.cos(A),v=(-l-2*P*L)/(3*s),x=(-l+P*(L+w*Math.sin(A)))/(3*s),I=(-l+P*(L-w*Math.sin(A)))/(3*s);v>=0&&1>=v&&(o[p++]=v),x>=0&&1>=x&&(o[p++]=x),I>=0&&1>=I&&(o[p++]=I)}}return p}function o(t,n,r,a,o){var s=6*r-12*n+6*t,l=9*n+3*a-3*t-9*r,u=3*n-3*t,c=0;if(e(l)){if(i(s)){var h=-u/s;h>=0&&1>=h&&(o[c++]=h)}}else{var f=s*s-4*l*u;if(e(f))o[0]=-s/(2*l);else if(f>0){var d=_(f),h=(-s+d)/(2*l),p=(-s-d)/(2*l);h>=0&&1>=h&&(o[c++]=h),p>=0&&1>=p&&(o[c++]=p)}}return c}function s(t,e,i,n,r,a){var o=(e-t)*r+t,s=(i-e)*r+e,l=(n-i)*r+i,u=(s-o)*r+o,c=(l-s)*r+s,h=(c-u)*r+u;a[0]=t,a[1]=o,a[2]=u,a[3]=h,a[4]=h,a[5]=c,a[6]=l,a[7]=n}function l(t,e,i,r,a,o,s,l,u,c,h){var f,d,p,v,m,y=.005,x=1/0;S[0]=u,S[1]=c;for(var w=0;1>w;w+=.05)M[0]=n(t,i,a,s,w),M[1]=n(e,r,o,l,w),v=g(S,M),x>v&&(f=w,x=v);x=1/0;for(var T=0;32>T&&!(b>y);T++)d=f-y,p=f+y,M[0]=n(t,i,a,s,d),M[1]=n(e,r,o,l,d),v=g(M,S),d>=0&&x>v?(f=d,x=v):(C[0]=n(t,i,a,s,p),C[1]=n(e,r,o,l,p),m=g(C,S),1>=p&&x>m?(f=p,x=m):y*=.5);return h&&(h[0]=n(t,i,a,s,f),h[1]=n(e,r,o,l,f)),_(x)}function u(t,e,i,n){var r=1-n;return r*(r*t+2*n*e)+n*n*i}function c(t,e,i,n){return 2*((1-n)*(e-t)+n*(i-e))}function h(t,n,r,a,o){var s=t-2*n+r,l=2*(n-t),u=t-a,c=0;if(e(s)){if(i(l)){var h=-u/l;h>=0&&1>=h&&(o[c++]=h)}}else{var f=l*l-4*s*u;if(e(f)){var h=-l/(2*s);h>=0&&1>=h&&(o[c++]=h)}else if(f>0){var d=_(f),h=(-l+d)/(2*s),p=(-l-d)/(2*s);h>=0&&1>=h&&(o[c++]=h),p>=0&&1>=p&&(o[c++]=p)}}return c}function f(t,e,i){var n=t+i-2*e;return 0===n?.5:(t-e)/n}function d(t,e,i,n,r){var a=(e-t)*n+t,o=(i-e)*n+e,s=(o-a)*n+a;r[0]=t,r[1]=a,r[2]=s,r[3]=s,r[4]=o,r[5]=i}function p(t,e,i,n,r,a,o,s,l){var c,h=.005,f=1/0;S[0]=o,S[1]=s;for(var d=0;1>d;d+=.05){M[0]=u(t,i,r,d),M[1]=u(e,n,a,d);var p=g(S,M);f>p&&(c=d,f=p)}f=1/0;for(var v=0;32>v&&!(b>h);v++){var m=c-h,y=c+h;M[0]=u(t,i,r,m),M[1]=u(e,n,a,m);var p=g(M,S);if(m>=0&&f>p)c=m,f=p;else{C[0]=u(t,i,r,y),C[1]=u(e,n,a,y);var x=g(C,S);1>=y&&f>x?(c=y,f=x):h*=.5}}return l&&(l[0]=u(t,i,r,c),l[1]=u(e,n,a,c)),_(f)}var v=t("./vector"),m=v[E],g=v.distSquare,y=Math.pow,_=Math.sqrt,x=1e-8,b=1e-4,w=_(3),T=1/3,S=m(),M=m(),C=m();return{cubicAt:n,cubicDerivativeAt:r,cubicRootAt:a,cubicExtrema:o,cubicSubdivide:s,cubicProjectPoint:l,quadraticAt:u,quadraticDerivativeAt:c,quadraticRootAt:h,quadraticExtremum:f,quadraticSubdivide:d,quadraticProjectPoint:p}}),e("zrender/core/bbox",[he,"./vector","./curve"],function(t){var e=t("./vector"),i=t("./curve"),n={},r=Math.min,a=Math.max,o=Math.sin,s=Math.cos,l=e[E](),u=e[E](),c=e[E](),h=2*Math.PI;n.fromPoints=function(t,e,i){if(0!==t[F]){var n,o=t[0],s=o[0],l=o[0],u=o[1],c=o[1];for(n=1;n<t[F];n++)o=t[n],s=r(s,o[0]),l=a(l,o[0]),u=r(u,o[1]),c=a(c,o[1]);e[0]=s,e[1]=u,i[0]=l,i[1]=c}},n.fromLine=function(t,e,i,n,o,s){o[0]=r(t,i),o[1]=r(e,n),s[0]=a(t,i),s[1]=a(e,n)};var f=[],d=[];return n.fromCubic=function(t,e,n,o,s,l,u,c,h,p){var v,m=i.cubicExtrema,g=i.cubicAt,y=m(t,n,s,u,f);for(h[0]=1/0,h[1]=1/0,p[0]=-1/0,p[1]=-1/0,v=0;y>v;v++){var _=g(t,n,s,u,f[v]);h[0]=r(_,h[0]),p[0]=a(_,p[0])}for(y=m(e,o,l,c,d),v=0;y>v;v++){var x=g(e,o,l,c,d[v]);h[1]=r(x,h[1]),p[1]=a(x,p[1])}h[0]=r(t,h[0]),p[0]=a(t,p[0]),h[0]=r(u,h[0]),p[0]=a(u,p[0]),h[1]=r(e,h[1]),p[1]=a(e,p[1]),h[1]=r(c,h[1]),p[1]=a(c,p[1])},n.fromQuadratic=function(t,e,n,o,s,l,u,c){var h=i.quadraticExtremum,f=i.quadraticAt,d=a(r(h(t,n,s),1),0),p=a(r(h(e,o,l),1),0),v=f(t,n,s,d),m=f(e,o,l,p);u[0]=r(t,s,v),u[1]=r(e,l,m),c[0]=a(t,s,v),c[1]=a(e,l,m)},n.fromArc=function(t,i,n,r,a,f,d,p,v){var m=e.min,g=e.max,y=Math.abs(a-f);if(1e-4>y%h&&y>1e-4)return p[0]=t-n,p[1]=i-r,v[0]=t+n,void(v[1]=i+r);if(l[0]=s(a)*n+t,l[1]=o(a)*r+i,u[0]=s(f)*n+t,u[1]=o(f)*r+i,m(p,l,u),g(v,l,u),a%=h,0>a&&(a+=h),f%=h,0>f&&(f+=h),a>f&&!d?f+=h:f>a&&d&&(a+=h),d){var _=f;f=a,a=_}for(var x=0;f>x;x+=Math.PI/2)x>a&&(c[0]=s(x)*n+t,c[1]=o(x)*r+i,m(p,c,p),g(v,c,v))},n}),e("echarts/data/DataDiffer",[he],function(){function t(t){return t}function e(e,i,n,r){this._old=e,this._new=i,this._oldKeyGetter=n||t,this._newKeyGetter=r||t}function i(t,e,i,n){for(var r=0;r<t[F];r++){var a=n(t[r],r),o=e[a];null==o?(i.push(a),e[a]=r):(o[F]||(e[a]=o=[o]),o.push(r))}}return e[W]={constructor:e,add:function(t){return this._add=t,this},update:function(t){return this._update=t,this},remove:function(t){return this._remove=t,this},execute:function(){var t,e=this._old,n=this._new,r=this._oldKeyGetter,a=this._newKeyGetter,o={},s={},l=[],u=[];for(i(e,o,l,r),i(n,s,u,a),t=0;t<e[F];t++){var c=l[t],h=s[c];if(null!=h){var f=h[F];f?(1===f&&(s[c]=null),h=h.unshift()):s[c]=null,this._update&&this._update(h,t)}else this._remove&&this._remove(t)}for(var t=0;t<u[F];t++){var c=u[t];if(s.hasOwnProperty(c)){var h=s[c];if(null==h)continue;if(h[F])for(var d=0,f=h[F];f>d;d++)this._add&&this._add(h[d]);else this._add&&this._add(h)}}}},e}),e("echarts/data/helper/completeDimensions",[he,ce],function(t){function e(t,e,a,o){if(!e)return t;var s=i(e[0]),l=n[S](s)&&s[F]||1;a=a||[],o=o||"extra";for(var u=0;l>u;u++)if(!t[u]){var c=a[u]||o+(u-a[F]);t[u]=r(e,u)?{type:"ordinal",name:c}:c}return t}function i(t){return n[S](t)?t:n[V](t)?t.value:t}var n=t(ce),r=e.guessOrdinal=function(t,e){for(var r=0,a=t[F];a>r;r++){var o=i(t[r]);if(!n[S](o))return!1;var o=o[e];if(null!=o&&isFinite(o))return!1;if(n.isString(o)&&"-"!==o)return!0}return!1};return e}),e("zrender/contain/cubic",[he,"../core/curve"],function(t){var e=t("../core/curve");return{containStroke:function(t,i,n,r,a,o,s,l,u,c,h){if(0===u)return!1;var f=u;if(h>i+f&&h>r+f&&h>o+f&&h>l+f||i-f>h&&r-f>h&&o-f>h&&l-f>h||c>t+f&&c>n+f&&c>a+f&&c>s+f||t-f>c&&n-f>c&&a-f>c&&s-f>c)return!1;var d=e.cubicProjectPoint(t,i,n,r,a,o,s,l,c,h,null);return f/2>=d}}}),e("zrender/contain/quadratic",[he,"../core/curve"],function(t){var e=t("../core/curve");return{containStroke:function(t,i,n,r,a,o,s,l,u){if(0===s)return!1;var c=s;if(u>i+c&&u>r+c&&u>o+c||i-c>u&&r-c>u&&o-c>u||l>t+c&&l>n+c&&l>a+c||t-c>l&&n-c>l&&a-c>l)return!1;var h=e.quadraticProjectPoint(t,i,n,r,a,o,l,u,null);return c/2>=h}}}),e("zrender/contain/line",[],function(){return{containStroke:function(t,e,i,n,r,a,o){if(0===r)return!1;var s=r,l=0,u=t;if(o>e+s&&o>n+s||e-s>o&&n-s>o||a>t+s&&a>i+s||t-s>a&&i-s>a)return!1;if(t===i)return Math.abs(a-t)<=s/2;l=(e-n)/(t-i),u=(t*n-i*e)/(t-i);var c=l*a-o+u,h=c*c/(l*l+1);return s/2*s/2>=h}}}),e("zrender/contain/util",[he],function(){var t=2*Math.PI;return{normalizeRadian:function(e){return e%=t,0>e&&(e+=t),e}}}),e("zrender/contain/arc",[he,"./util"],function(t){var e=t("./util").normalizeRadian,i=2*Math.PI;return{containStroke:function(t,n,r,a,o,s,l,u,c){if(0===l)return!1;var h=l;u-=t,c-=n;var f=Math.sqrt(u*u+c*c);if(f-h>r||r>f+h)return!1;if(Math.abs(a-o)%i<1e-4)return!0;if(s){var d=a;a=e(o),o=e(d)}else a=e(a),o=e(o);a>o&&(o+=i);var p=Math.atan2(c,u);return 0>p&&(p+=i),p>=a&&o>=p||p+i>=a&&o>=p+i}}}),e("zrender/contain/windingLine",[],function(){return function(t,e,i,n,r,a){if(a>e&&a>n||e>a&&n>a)return 0;if(n===e)return 0;var o=e>n?1:-1,s=(a-e)/(n-e);(1===s||0===s)&&(o=e>n?.5:-.5);var l=s*(i-t)+t;return l>r?o:0}}),e("echarts/chart/bar/helper",[he,ce,v],function(t){function e(t,e,i,r,a){n.setText(t,e,i),t.text=r,"outside"===t.textPosition&&(t.textPosition=a)}var i=t(ce),n=t(v),r={};return r.setLabel=function(t,n,r,a,o,s,l){var u=r[oe]("label.normal"),c=r[oe]("label.emphasis");u.get("show")?e(t,u,a,i[m](o.getFormattedLabel(s,p),o.getRawValue(s)),l):t.text="",c.get("show")?e(n,c,a,i[m](o.getFormattedLabel(s,"emphasis"),o.getRawValue(s)),l):n.text=""},r}),e("echarts/chart/bar/barItemStyle",[he,"../../model/mixin/makeStyleMapper"],function(t){var e=t("../../model/mixin/makeStyleMapper")([["fill","color"],[o,"borderColor"],["lineWidth","borderWidth"],[o,"barBorderColor"],["lineWidth","barBorderWidth"],[Z],["shadowBlur"],["shadowOffsetX"],["shadowOffsetY"],["shadowColor"]]);return{getBarItemStyle:function(t){var i=e.call(this,t);if(this.getBorderLineDash){var n=this.getBorderLineDash();n&&(i.lineDash=n)}return i}}}),e("zrender/core/LRU",[he],function(){var t=function(){this.head=null,this.tail=null,this._len=0},e=t[W];e.insert=function(t){var e=new i(t);return this.insertEntry(e),e},e.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,this.tail=t):this.head=this.tail=t,this._len++},e[k]=function(t){var e=t.prev,i=t.next;e?e.next=i:this.head=i,i?i.prev=e:this.tail=e,t.next=t.prev=null,this._len--},e.len=function(){return this._len};var i=function(t){this.value=t,this.next,this.prev},n=function(e){this._list=new t,this._map={},this._maxSize=e||10},r=n[W];return r.put=function(t,e){var i=this._list,n=this._map;if(null==n[t]){var r=i.len();if(r>=this._maxSize&&r>0){var a=i.head;i[k](a),delete n[a.key]}var o=i.insert(e);o.key=t,n[t]=o}},r.get=function(t){var e=this._map[t],i=this._list;return null!=e?(e!==i.tail&&(i[k](e),i.insertEntry(e)),e.value):void 0},r.clear=function(){this._list.clear(),this._map={}},n}),e("zrender/graphic/helper/poly",[he,"./smoothSpline","./smoothBezier"],function(t){var e=t("./smoothSpline"),i=t("./smoothBezier");return{buildPath:function(t,n,r){var a=n.points,o=n.smooth;if(a&&a[F]>=2){if(o&&"spline"!==o){var s=i(a,o,r,n.smoothConstraint);t.moveTo(a[0][0],a[0][1]);for(var l=a[F],u=0;(r?l:l-1)>u;u++){var c=s[2*u],h=s[2*u+1],f=a[(u+1)%l];t.bezierCurveTo(c[0],c[1],h[0],h[1],f[0],f[1])}}else{"spline"===o&&(a=e(a,r)),t.moveTo(a[0][0],a[0][1]);for(var u=1,d=a[F];d>u;u++)t.lineTo(a[u][0],a[u][1])}r&&t.closePath()}}}}),e("zrender/graphic/helper/smoothBezier",[he,"../../core/vector"],function(t){var e=t("../../core/vector"),i=e.min,n=e.max,r=e.scale,a=e.distance,o=e.add;return function(t,s,l,u){var c,h,f,d,p=[],v=[],m=[],g=[];if(u){f=[1/0,1/0],d=[-1/0,-1/0];for(var y=0,_=t[F];_>y;y++)i(f,f,t[y]),n(d,d,t[y]);i(f,f,u[0]),n(d,d,u[1])}for(var y=0,_=t[F];_>y;y++){var x=t[y];if(l)c=t[y?y-1:_-1],h=t[(y+1)%_];else{if(0===y||y===_-1){p.push(e.clone(t[y]));continue}c=t[y-1],h=t[y+1]}e.sub(v,h,c),r(v,v,s);var b=a(x,c),w=a(x,h),T=b+w;0!==T&&(b/=T,w/=T),r(m,v,-b),r(g,v,w);var S=o([],x,m),M=o([],x,g);u&&(n(S,S,f),i(S,S,d),n(M,M,f),i(M,M,d)),p.push(S),p.push(M)}return l&&p.push(p.shift()),p}}),e("zrender/graphic/helper/smoothSpline",[he,"../../core/vector"],function(t){function e(t,e,i,n,r,a,o){var s=.5*(i-t),l=.5*(n-e);return(2*(e-i)+s+l)*o+(-3*(e-i)-2*s-l)*a+s*r+e}var i=t("../../core/vector");return function(t,n){for(var r=t[F],a=[],o=0,s=1;r>s;s++)o+=i.distance(t[s-1],t[s]);var l=o/2;l=r>l?r:l;for(var s=0;l>s;s++){var u,c,h,f=s/(l-1)*(n?r:r-1),d=Math.floor(f),p=f-d,v=t[d%r];n?(u=t[(d-1+r)%r],c=t[(d+1)%r],h=t[(d+2)%r]):(u=t[0===d?d:d-1],c=t[d>r-2?r-1:d+1],h=t[d>r-3?r-1:d+2]);var m=p*p,g=p*m;a.push([e(u[0],v[0],c[0],h[0],p,m,g),e(u[1],v[1],c[1],h[1],p,m,g)])}return a}}),e("zrender/graphic/helper/roundRect",[he],function(){return{buildPath:function(t,e){var i,n,r,a,o=e.x,s=e.y,l=e.width,u=e[ee],c=e.r;0>l&&(o+=l,l=-l),0>u&&(s+=u,u=-u),typeof c===w?i=n=r=a=c:c instanceof Array?1===c[F]?i=n=r=a=c[0]:2===c[F]?(i=r=c[0],n=a=c[1]):3===c[F]?(i=c[0],n=a=c[1],r=c[2]):(i=c[0],n=c[1],r=c[2],a=c[3]):i=n=r=a=0;var h;i+n>l&&(h=i+n,i*=l/h,n*=l/h),r+a>l&&(h=r+a,r*=l/h,a*=l/h),n+r>u&&(h=n+r,n*=u/h,r*=u/h),i+a>u&&(h=i+a,i*=u/h,a*=u/h),t.moveTo(o+i,s),t.lineTo(o+l-n,s),0!==n&&t.quadraticCurveTo(o+l,s,o+l,s+n),t.lineTo(o+l,s+u-r),0!==r&&t.quadraticCurveTo(o+l,s+u,o+l-r,s+u),t.lineTo(o+a,s+u),0!==a&&t.quadraticCurveTo(o,s+u,o,s+u-a),t.lineTo(o,s+i),0!==i&&t.quadraticCurveTo(o,s,o+i,s)}}}),e("zrender/graphic/Gradient",[he],function(){var t=function(t){this[D]=t||[]};return t[W]={constructor:t,addColorStop:function(t,e){this[D].push({offset:t,color:e})}},t}),e("zrender/Storage",[he,"./core/util","./core/env","./container/Group","./core/timsort"],function(t){function e(t,e){return t[C]===e[C]?t.z===e.z?t.z2-e.z2:t.z-e.z:t[C]-e[C]}var i=t("./core/util"),n=t("./core/env"),r=t("./container/Group"),a=t("./core/timsort"),o=function(){this._elements={},this._roots=[],this._displayList=[],this._displayListLen=0};return o[W]={constructor:o,traverse:function(t,e){for(var i=0;i<this._roots[F];i++)this._roots[i].traverse(t,e)},getDisplayList:function(t,e){return e=e||!1,t&&this.updateDisplayList(e),this._displayList},updateDisplayList:function(t){this._displayListLen=0;for(var i=this._roots,r=this._displayList,o=0,s=i[F];s>o;o++)this._updateAndAddDisplayable(i[o],null,t);r[F]=this._displayListLen,n.canvasSupported&&a(r,e)},_updateAndAddDisplayable:function(t,e,i){if(!t[G]||i){t.beforeUpdate(),t.__dirty&&t[O](),t.afterUpdate();var n=t.clipPath;if(n){e=e?e.slice():[];for(var r=n,a=t;r;)r[h]=a,r.updateTransform(),e.push(r),a=r,r=r.clipPath}if(t.isGroup){for(var o=t._children,s=0;s<o[F];s++){var l=o[s];t.__dirty&&(l.__dirty=!0),this._updateAndAddDisplayable(l,e,i)}t.__dirty=!1}else t.__clipPaths=e,this._displayList[this._displayListLen++]=t}},addRoot:function(t){this._elements[t.id]||(t instanceof r&&t.addChildrenToStorage(this),this.addToMap(t),this._roots.push(t))},delRoot:function(t){if(null==t){for(var e=0;e<this._roots[F];e++){var n=this._roots[e];n instanceof r&&n.delChildrenFromStorage(this)}return this._elements={},this._roots=[],this._displayList=[],void(this._displayListLen=0)}if(t instanceof Array)for(var e=0,a=t[F];a>e;e++)this.delRoot(t[e]);else{var o;o=typeof t==q?this._elements[t]:t;var s=i[N](this._roots,o);s>=0&&(this.delFromMap(o.id),this._roots[L](s,1),o instanceof r&&o.delChildrenFromStorage(this))}},addToMap:function(t){return t instanceof r&&(t.__storage=this),t.dirty(!1),this._elements[t.id]=t,this},get:function(t){return this._elements[t]},delFromMap:function(t){var e=this._elements,i=e[t];return i&&(delete e[t],i instanceof r&&(i.__storage=null)),this},dispose:function(){this._elements=this._renderList=this._roots=null},displayableSortFunc:e},o}),e("zrender/animation/Animation",[he,i,"../core/event","./requestAnimationFrame","./Animator"],function(t){var e=t(i),n=t("../core/event").Dispatcher,r=t("./requestAnimationFrame"),a=t("./Animator"),o=function(t){t=t||{},this.stage=t.stage||{},this.onframe=t.onframe||function(){},this._clips=[],this._running=!1,this._time,this._pausedTime,this._pauseStart,this._paused=!1,n.call(this)};return o[W]={constructor:o,addClip:function(t){this._clips.push(t)},addAnimator:function(t){t[H]=this;for(var e=t.getClips(),i=0;i<e[F];i++)this.addClip(e[i])},removeClip:function(t){var i=e[N](this._clips,t);i>=0&&this._clips[L](i,1)},removeAnimator:function(t){for(var e=t.getClips(),i=0;i<e[F];i++)this.removeClip(e[i]);t[H]=null},_update:function(){for(var t=(new Date).getTime()-this._pausedTime,e=t-this._time,i=this._clips,n=i[F],r=[],a=[],o=0;n>o;o++){var s=i[o],l=s.step(t);l&&(r.push(l),a.push(s))}for(var o=0;n>o;)i[o]._needsRemove?(i[o]=i[n-1],i.pop(),n--):o++;n=r[F];for(var o=0;n>o;o++)a[o].fire(r[o]);this._time=t,this.onframe(e),this[I]("frame",e),this.stage[O]&&this.stage[O]()},_startLoop:function(){function t(){e._running&&(r(t),!e._paused&&e._update())}var e=this;this._running=!0,r(t)},start:function(){this._time=(new Date).getTime(),this._pausedTime=0,this._startLoop()},stop:function(){this._running=!1},pause:function(){this._paused||(this._pauseStart=(new Date).getTime(),this._paused=!0)},resume:function(){this._paused&&(this._pausedTime+=(new Date).getTime()-this._pauseStart,this._paused=!1)},clear:function(){this._clips=[]},animate:function(t,e){e=e||{};var i=new a(t,e.loop,e.getter,e.setter);return this.addAnimator(i),i}},e.mixin(o,n),o}),e("zrender/Painter",[he,"./config","./core/util","./core/log","./core/BoundingRect","./core/timsort","./Layer","./animation/requestAnimationFrame","./graphic/Image"],function(t){function e(t){return parseInt(t,10)}function i(t){return t?t.isBuildin?!0:typeof t.resize!==T||typeof t.refresh!==T?!1:!0:!1}function n(t){t.__unusedCount++}function r(t){1==t.__unusedCount&&t.clear()}function a(t,e,i){return y.copy(t[ie]()),t.transform&&y[s](t.transform),_.width=e,_[ee]=i,!y.intersect(_)}function o(t,e){if(t==e)return!1;if(!t||!e||t[F]!==e[F])return!0;for(var i=0;i<t[F];i++)if(t[i]!==e[i])return!0}function l(t,e){for(var i=0;i<t[F];i++){var n=t[i],r=n.path;n.setTransform(e),r.beginPath(e),n.buildPath(r,n.shape),e.clip(),n.restoreTransform(e)}}function u(t,e){var i=document.createElement("div");return i.style.cssText=["position:relative","overflow:hidden","width:"+t+"px","height:"+e+"px","padding:0","margin:0","border-width:0"].join(";")+";",i}var c=t("./config"),h=t("./core/util"),f=t("./core/log"),d=t("./core/BoundingRect"),p=t("./core/timsort"),v=t("./Layer"),m=t("./animation/requestAnimationFrame"),g=5,y=new d(0,0,0,0),_=new d(0,0,0,0),x=function(t,e,i){var n=!t.nodeName||"CANVAS"===t.nodeName.toUpperCase();this._opts=i=h[z]({},i||{}),this.dpr=i.devicePixelRatio||c.devicePixelRatio,this._singleCanvas=n,this.root=t;var r=t.style;r&&(r["-webkit-tap-highlight-color"]="transparent",r["-webkit-user-select"]=r["user-select"]=r["-webkit-touch-callout"]="none",t.innerHTML=""),this.storage=e;var a=this._zlevelList=[],o=this._layers={};if(this._layerConfig={},n){var s=t.width,l=t[ee];this._width=s,this._height=l;var f=new v(t,this,1);f.initContext(),o[0]=f,a.push(0),this._domRoot=t}else{this._width=this._getSize(0),this._height=this._getSize(1);var d=this._domRoot=u(this._width,this._height);t.appendChild(d)}this.pathToImage=this._createPathToImage(),this._progressiveLayers=[],this._hoverlayer,this._hoverElements=[]};return x[W]={constructor:x,isSingleCanvas:function(){return this._singleCanvas},getViewportRoot:function(){return this._domRoot},refresh:function(t){var e=this.storage.getDisplayList(!0),i=this._zlevelList;this._paintList(e,t);for(var n=0;n<i[F];n++){var r=i[n],a=this._layers[r];!a.isBuildin&&a.refresh&&a.refresh()}return this.refreshHover(),this._progressiveLayers[F]&&this._startProgessive(),this},addHover:function(t,e){if(!t.__hoverMir){var i=new t.constructor({style:t.style,shape:t.shape});i.__from=t,t.__hoverMir=i,i[X](e),this._hoverElements.push(i)}},removeHover:function(t){var e=t.__hoverMir,i=this._hoverElements,n=h[N](i,e);
n>=0&&i[L](n,1),t.__hoverMir=null},clearHover:function(){for(var t=this._hoverElements,e=0;e<t[F];e++){var i=t[e].__from;i&&(i.__hoverMir=null)}t[F]=0},refreshHover:function(){var t=this._hoverElements,e=t[F],i=this._hoverlayer;if(i&&i.clear(),e){p(t,this.storage.displayableSortFunc),i||(i=this._hoverlayer=this.getLayer(1e5));var n={};i.ctx.save();for(var r=0;e>r;){var a=t[r],o=a.__from;o&&o.__zr?(r++,o.invisible||(a.transform=o.transform,a.invTransform=o.invTransform,a.__clipPaths=o.__clipPaths,this._doPaintEl(a,i,!0,n))):(t[L](r,1),o.__hoverMir=null,e--)}i.ctx.restore()}},_startProgessive:function(){function t(){i===e._progressiveToken&&e.storage&&(e._doPaintList(e.storage.getDisplayList()),e._furtherProgressive?(e._progress++,m(t)):e._progressiveToken=-1)}var e=this;if(e._furtherProgressive){var i=e._progressiveToken=+new Date;e._progress++,m(t)}},_clearProgressive:function(){this._progressiveToken=-1,this._progress=0,h.each(this._progressiveLayers,function(t){t.__dirty&&t.clear()})},_paintList:function(t,e){null==e&&(e=!1),this._updateLayerStatus(t),this._clearProgressive(),this.eachBuildinLayer(n),this._doPaintList(t,e),this.eachBuildinLayer(r)},_doPaintList:function(t,e){function i(t){var e=a.dpr||1;a.save(),a.globalAlpha=1,a.shadowBlur=0,n.__dirty=!0,a.setTransform(1,0,0,1,0,0),a.drawImage(t.dom,0,0,c*e,d*e),a.restore()}for(var n,r,a,o,s,l,u=0,c=this._width,d=this._height,p=this._progress,v=0,m=t[F];m>v;v++){var y=t[v],_=this._singleCanvas?0:y[C],x=y.__frame;if(0>x&&s&&(i(s),s=null),r!==_&&(a&&a.restore(),o={},r=_,n=this.getLayer(r),n.isBuildin||f("ZLevel "+r+" has been used by unkown layer "+n.id),a=n.ctx,a.save(),n.__unusedCount=0,(n.__dirty||e)&&n.clear()),n.__dirty||e){if(x>=0){if(!s){if(s=this._progressiveLayers[Math.min(u++,g-1)],s.ctx.save(),s.renderScope={},s&&s.__progress>s.__maxProgress){v=s.__nextIdxNotProg-1;continue}l=s.__progress,s.__dirty||(p=l),s.__progress=p+1}x===p&&this._doPaintEl(y,s,!0,s.renderScope)}else this._doPaintEl(y,n,e,o);y.__dirty=!1}}s&&i(s),a&&a.restore(),this._furtherProgressive=!1,h.each(this._progressiveLayers,function(t){t.__maxProgress>=t.__progress&&(this._furtherProgressive=!0)},this)},_doPaintEl:function(t,e,i,n){var r=e.ctx,s=t.transform;if(!(!e.__dirty&&!i||t.invisible||0===t.style[Z]||s&&!s[0]&&!s[3]||t.culling&&a(t,this._width,this._height))){var u=t.__clipPaths;(n.prevClipLayer!==e||o(u,n.prevElClipPaths))&&(n.prevElClipPaths&&(n.prevClipLayer.ctx.restore(),n.prevClipLayer=n.prevElClipPaths=null,n.prevEl=null),u&&(r.save(),l(u,r),n.prevClipLayer=e,n.prevElClipPaths=u)),t.beforeBrush&&t.beforeBrush(r),t.brush(r,n.prevEl||null),n.prevEl=t,t.afterBrush&&t.afterBrush(r)}},getLayer:function(t){if(this._singleCanvas)return this._layers[0];var e=this._layers[t];return e||(e=new v("zr_"+t,this,this.dpr),e.isBuildin=!0,this._layerConfig[t]&&h.merge(e,this._layerConfig[t],!0),this.insertLayer(t,e),e.initContext()),e},insertLayer:function(t,e){var n=this._layers,r=this._zlevelList,a=r[F],o=null,s=-1,l=this._domRoot;if(n[t])return void f("ZLevel "+t+" has been used already");if(!i(e))return void f("Layer of zlevel "+t+" is not valid");if(a>0&&t>r[0]){for(s=0;a-1>s&&!(r[s]<t&&r[s+1]>t);s++);o=n[r[s]]}if(r[L](s+1,0,t),o){var u=o.dom;u.nextSibling?l.insertBefore(e.dom,u.nextSibling):l.appendChild(e.dom)}else l.firstChild?l.insertBefore(e.dom,l.firstChild):l.appendChild(e.dom);n[t]=e},eachLayer:function(t,e){var i,n,r=this._zlevelList;for(n=0;n<r[F];n++)i=r[n],t.call(e,this._layers[i],i)},eachBuildinLayer:function(t,e){var i,n,r,a=this._zlevelList;for(r=0;r<a[F];r++)n=a[r],i=this._layers[n],i.isBuildin&&t.call(e,i,n)},eachOtherLayer:function(t,e){var i,n,r,a=this._zlevelList;for(r=0;r<a[F];r++)n=a[r],i=this._layers[n],i.isBuildin||t.call(e,i,n)},getLayers:function(){return this._layers},_updateLayerStatus:function(t){var e=this._layers,i=this._progressiveLayers,n={},r={};this.eachBuildinLayer(function(t,e){n[e]=t.elCount,t.elCount=0,t.__dirty=!1}),h.each(i,function(t,e){r[e]=t.elCount,t.elCount=0,t.__dirty=!1});for(var a,o,s=0,l=0,u=0,c=t[F];c>u;u++){var f=t[u],d=this._singleCanvas?0:f[C],p=e[d],m=f.progressive;if(p&&(p.elCount++,p.__dirty=p.__dirty||f.__dirty),m>=0){o!==m&&(o=m,l++);var y=f.__frame=l-1;if(!a){var _=Math.min(s,g-1);a=i[_],a||(a=i[_]=new v("progressive",this,this.dpr),a.initContext()),a.__maxProgress=0}a.__dirty=a.__dirty||f.__dirty,a.elCount++,a.__maxProgress=Math.max(a.__maxProgress,y),a.__maxProgress>=a.__progress&&(p.__dirty=!0)}else f.__frame=-1,a&&(a.__nextIdxNotProg=u,s++,a=null)}a&&(s++,a.__nextIdxNotProg=u),this.eachBuildinLayer(function(t,e){n[e]!==t.elCount&&(t.__dirty=!0)}),i[F]=Math.min(s,g),h.each(i,function(t,e){r[e]!==t.elCount&&(f.__dirty=!0),t.__dirty&&(t.__progress=0)})},clear:function(){return this.eachBuildinLayer(this._clearLayer),this},_clearLayer:function(t){t.clear()},configLayer:function(t,e){if(e){var i=this._layerConfig;i[t]?h.merge(i[t],e,!0):i[t]=e;var n=this._layers[t];n&&h.merge(n,i[t],!0)}},delLayer:function(t){var e=this._layers,i=this._zlevelList,n=e[t];n&&(n.dom.parentNode.removeChild(n.dom),delete e[t],i[L](h[N](i,t),1))},resize:function(t,e){var i=this._domRoot;i.style.display="none";var n=this._opts;if(null!=t&&(n.width=t),null!=e&&(n[ee]=e),t=this._getSize(0),e=this._getSize(1),i.style.display="",this._width!=t||e!=this._height){i.style.width=t+"px",i.style[ee]=e+"px";for(var r in this._layers)this._layers.hasOwnProperty(r)&&this._layers[r].resize(t,e);h.each(this._progressiveLayers,function(i){i.resize(t,e)}),this.refresh(!0)}return this._width=t,this._height=e,this},clearLayer:function(t){var e=this._layers[t];e&&e.clear()},dispose:function(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},getRenderedCanvas:function(t){if(t=t||{},this._singleCanvas)return this._layers[0].dom;var e=new v("image",this,t.pixelRatio||this.dpr);e.initContext(),e.clearColor=t.backgroundColor,e.clear();for(var i=this.storage.getDisplayList(!0),n={},r=0;r<i[F];r++){var a=i[r];this._doPaintEl(a,e,!0,n)}return e.dom},getWidth:function(){return this._width},getHeight:function(){return this._height},_getSize:function(t){var i=this._opts,n=["width",ee][t],r=["clientWidth","clientHeight"][t],a=["paddingLeft","paddingTop"][t],o=["paddingRight","paddingBottom"][t];if(null!=i[n]&&"auto"!==i[n])return parseFloat(i[n]);var s=this.root,l=document.defaultView.getComputedStyle(s);return(s[r]||e(l[n])||e(s.style[n]))-(e(l[a])||0)-(e(l[o])||0)|0},_pathToImage:function(e,i,n,r,a){var o=document.createElement("canvas"),s=o.getContext("2d");o.width=n*a,o[ee]=r*a,s.clearRect(0,0,n*a,r*a);var l={position:i[j],rotation:i.rotation,scale:i.scale};i[j]=[0,0,0],i.rotation=0,i.scale=[1,1],i&&i.brush(s);var u=t("./graphic/Image"),c=new u({id:e,style:{x:0,y:0,image:o}});return null!=l[j]&&(c[j]=i[j]=l[j]),null!=l.rotation&&(c.rotation=i.rotation=l.rotation),null!=l.scale&&(c.scale=i.scale=l.scale),c},_createPathToImage:function(){var t=this;return function(e,i,n,r){return t._pathToImage(e,i,n,r,t.dpr)}}},x}),e("zrender/Handler",[he,"./core/util","./mixin/Draggable","./mixin/Eventful"],function(t){function e(t,e,i){return{type:t,event:i,target:e,cancelBubble:!1,offsetX:i.zrX,offsetY:i.zrY,gestureEvent:i.gestureEvent,pinchX:i.pinchX,pinchY:i.pinchY,pinchScale:i.pinchScale,wheelDelta:i.zrDelta,zrByTouch:i.zrByTouch}}function i(){}function n(t,e,i){if(t[t.rectHover?"rectContain":x](e,i)){for(var n=t;n;){if(n[te]||n.clipPath&&!n.clipPath[x](e,i))return!1;n=n[h]}return!0}return!1}var r=t("./core/util"),a=t("./mixin/Draggable"),o=t("./mixin/Eventful");i[W].dispose=function(){};var s=["click","dblclick","mousewheel",P,"mouseup","mousedown","mousemove","contextmenu"],l=function(t,e,n,l){o.call(this),this.storage=t,this.painter=e,this.painterRoot=l,n=n||new i,this.proxy=n,n.handler=this,this._hovered,this._lastTouchMoment,this._lastX,this._lastY,a.call(this),r.each(s,function(t){n.on&&n.on(t,this[t],this)},this)};return l[W]={constructor:l,mousemove:function(t){var e=t.zrX,i=t.zrY,n=this.findHover(e,i,null),r=this._hovered,a=this.proxy;this._hovered=n,a.setCursor&&a.setCursor(n?n.cursor:"default"),r&&n!==r&&r.__zr&&this.dispatchToElement(r,P,t),this.dispatchToElement(n,"mousemove",t),n&&n!==r&&this.dispatchToElement(n,"mouseover",t)},mouseout:function(t){this.dispatchToElement(this._hovered,P,t);var e,i=t.toElement||t.relatedTarget;do i=i&&i.parentNode;while(i&&9!=i.nodeType&&!(e=i===this.painterRoot));!e&&this[I]("globalout",{event:t})},resize:function(){this._hovered=null},dispatch:function(t,e){var i=this[t];i&&i.call(this,e)},dispose:function(){this.proxy.dispose(),this.storage=this.proxy=this.painter=null},setCursorStyle:function(t){var e=this.proxy;e.setCursor&&e.setCursor(t)},dispatchToElement:function(t,i,n){for(var r="on"+i,a=e(i,t,n),o=t;o&&(o[r]&&(a.cancelBubble=o[r].call(o,a)),o[I](i,a),o=o[h],!a.cancelBubble););a.cancelBubble||(this[I](i,a),this.painter&&this.painter.eachOtherLayer(function(t){typeof t[r]==T&&t[r].call(t,a),t[I]&&t[I](i,a)}))},findHover:function(t,e,i){for(var r=this.storage.getDisplayList(),a=r[F]-1;a>=0;a--)if(!r[a][te]&&r[a]!==i&&!r[a][G]&&n(r[a],t,e))return r[a]}},r.each(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(t){l[W][t]=function(e){var i=this.findHover(e.zrX,e.zrY,null);if("mousedown"===t)this._downel=i,this._upel=i;else if("mosueup"===t)this._upel=i;else if("click"===t&&this._downel!==this._upel)return;this.dispatchToElement(i,t,e)}}),r.mixin(l,o),r.mixin(l,a),l}),e("zrender/dom/HandlerProxy",[he,"../core/event",i,"../mixin/Eventful","../core/env","../core/GestureMgr"],function(t){function e(t){return"mousewheel"===t&&h.browser.firefox?"DOMMouseScroll":t}function n(t,e,i){var n=t._gestureMgr;"start"===i&&n.clear();var r=n.recognize(e,t.handler.findHover(e.zrX,e.zrY,null),t.dom);if("end"===i&&n.clear(),r){var a=r.type;e.gestureEvent=a,t.handler.dispatchToElement(r.target,a,r.event)}}function r(t){t._touching=!0,clearTimeout(t._touchTimer),t._touchTimer=setTimeout(function(){t._touching=!1},700)}function a(t){var e=t.pointerType;return"pen"===e||"touch"===e}function o(t){function e(t,e){return function(){return e._touching?void 0:t.apply(e,arguments)}}u.each(_,function(e){t._handlers[e]=u.bind(w[e],t)}),u.each(b,function(e){t._handlers[e]=u.bind(w[e],t)}),u.each(g,function(i){t._handlers[i]=e(w[i],t)})}function s(t){function i(i,n){u.each(i,function(i){d(t,e(i),n._handlers[i])},n)}c.call(this),this.dom=t,this._touching=!1,this._touchTimer,this._gestureMgr=new f,this._handlers={},o(this),h.pointerEventsSupported?i(b,this):(h.touchEventsSupported&&i(_,this),i(g,this))}var l=t("../core/event"),u=t(i),c=t("../mixin/Eventful"),h=t("../core/env"),f=t("../core/GestureMgr"),d=l.addEventListener,p=l.removeEventListener,v=l.normalizeEvent,m=300,g=["click","dblclick","mousewheel",P,"mouseup","mousedown","mousemove","contextmenu"],_=["touchstart","touchend","touchmove"],x={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},b=u.map(g,function(t){var e=t[M]("mouse","pointer");return x[e]?e:t}),w={mousemove:function(t){t=v(this.dom,t),this[I]("mousemove",t)},mouseout:function(t){t=v(this.dom,t);var e=t.toElement||t.relatedTarget;if(e!=this.dom)for(;e&&9!=e.nodeType;){if(e===this.dom)return;e=e.parentNode}this[I](P,t)},touchstart:function(t){t=v(this.dom,t),t.zrByTouch=!0,this._lastTouchMoment=new Date,n(this,t,"start"),w.mousemove.call(this,t),w.mousedown.call(this,t),r(this)},touchmove:function(t){t=v(this.dom,t),t.zrByTouch=!0,n(this,t,"change"),w.mousemove.call(this,t),r(this)},touchend:function(t){t=v(this.dom,t),t.zrByTouch=!0,n(this,t,"end"),w.mouseup.call(this,t),+new Date-this._lastTouchMoment<m&&w.click.call(this,t),r(this)},pointerdown:function(t){w.mousedown.call(this,t)},pointermove:function(t){a(t)||w.mousemove.call(this,t)},pointerup:function(t){w.mouseup.call(this,t)},pointerout:function(t){a(t)||w[P].call(this,t)}};u.each(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(t){w[t]=function(e){e=v(this.dom,e),this[I](t,e)}});var T=s[W];return T.dispose=function(){for(var t=g[y](_),i=0;i<t[F];i++){var n=t[i];p(this.dom,e(n),this._handlers[n])}},T.setCursor=function(t){this.dom.style.cursor=t||"default"},u.mixin(s,c),s}),e("zrender/mixin/Draggable",[he],function(){function t(){this.on("mousedown",this._dragStart,this),this.on("mousemove",this._drag,this),this.on("mouseup",this._dragEnd,this),this.on("globalout",this._dragEnd,this)}return t[W]={constructor:t,_dragStart:function(t){var e=t.target;e&&e.draggable&&(this._draggingTarget=e,e.dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.dispatchToElement(e,"dragstart",t.event))},_drag:function(t){var e=this._draggingTarget;if(e){var i=t.offsetX,n=t.offsetY,r=i-this._x,a=n-this._y;this._x=i,this._y=n,e.drift(r,a,t),this.dispatchToElement(e,"drag",t.event);var o=this.findHover(i,n,e),s=this._dropTarget;this._dropTarget=o,e!==o&&(s&&o!==s&&this.dispatchToElement(s,"dragleave",t.event),o&&o!==s&&this.dispatchToElement(o,"dragenter",t.event))}},_dragEnd:function(t){var e=this._draggingTarget;e&&(e.dragging=!1),this.dispatchToElement(e,"dragend",t.event),this._dropTarget&&this.dispatchToElement(this._dropTarget,"drop",t.event),this._draggingTarget=null,this._dropTarget=null}},t}),e("zrender/animation/requestAnimationFrame",[he],function(){return typeof window!==n&&(window.requestAnimationFrame||window.msRequestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){setTimeout(t,16)}}),e("zrender/core/event",[he,"../mixin/Eventful","./env"],function(t){function e(t){return t.getBoundingClientRect?t.getBoundingClientRect():{left:0,top:0}}function i(t,e,i,n){return i=i||{},n||!u.canvasSupported?r(t,e,i):u.browser.firefox&&null!=e.layerX&&e.layerX!==e.offsetX?(i.zrX=e.layerX,i.zrY=e.layerY):null!=e.offsetX?(i.zrX=e.offsetX,i.zrY=e.offsetY):r(t,e,i),i}function r(t,i,n){var r=e(t);n.zrX=i.clientX-r.left,n.zrY=i.clientY-r.top}function a(t,e,n){if(e=e||window.event,null!=e.zrX)return e;var r=e.type,a=r&&r[N]("touch")>=0;if(a){var o="touchend"!=r?e.targetTouches[0]:e.changedTouches[0];o&&i(t,o,e,n)}else i(t,e,e,n),e.zrDelta=e.wheelDelta?e.wheelDelta/120:-(e.detail||0)/3;return e}function o(t,e,i){c?t.addEventListener(e,i):t.attachEvent("on"+e,i)}function s(t,e,i){c?t.removeEventListener(e,i):t.detachEvent("on"+e,i)}var l=t("../mixin/Eventful"),u=t("./env"),c=typeof window!==n&&!!window.addEventListener,h=c?function(t){t.preventDefault(),t.stopPropagation(),t.cancelBubble=!0}:function(t){t.returnValue=!1,t.cancelBubble=!0};return{clientToLocal:i,normalizeEvent:a,addEventListener:o,removeEventListener:s,stop:h,Dispatcher:l}}),e("zrender/core/GestureMgr",[he,"./event"],function(t){function e(t){var e=t[1][0]-t[0][0],i=t[1][1]-t[0][1];return Math.sqrt(e*e+i*i)}function i(t){return[(t[0][0]+t[1][0])/2,(t[0][1]+t[1][1])/2]}var n=t("./event"),r=function(){this._track=[]};r[W]={constructor:r,recognize:function(t,e,i){return this._doTrack(t,e,i),this._recognize(t)},clear:function(){return this._track[F]=0,this},_doTrack:function(t,e,i){var r=t.touches;if(r){for(var a={points:[],touches:[],target:e,event:t},o=0,s=r[F];s>o;o++){var l=r[o],u=n.clientToLocal(i,l,{});a.points.push([u.zrX,u.zrY]),a.touches.push(l)}this._track.push(a)}},_recognize:function(t){for(var e in a)if(a.hasOwnProperty(e)){var i=a[e](this._track,t);if(i)return i}}};var a={pinch:function(t,n){var r=t[F];if(r){var a=(t[r-1]||{}).points,o=(t[r-2]||{}).points||a;if(o&&o[F]>1&&a&&a[F]>1){var s=e(a)/e(o);!isFinite(s)&&(s=1),n.pinchScale=s;var l=i(a);return n.pinchX=l[0],n.pinchY=l[1],{type:"pinch",target:t[0].target,event:n}}}}};return r}),e("zrender/Layer",[he,"./core/util","./config","./graphic/Style","./graphic/Pattern"],function(t){function e(){return!1}function i(t,e,i,n){var r=document.createElement(e),a=i[J](),o=i[K](),s=r.style;return s[j]="absolute",s.left=0,s.top=0,s.width=a+"px",s[ee]=o+"px",r.width=a*n,r[ee]=o*n,r.setAttribute("data-zr-dom-id",t),r}var n=t("./core/util"),r=t("./config"),a=t("./graphic/Style"),o=t("./graphic/Pattern"),s=function(t,a,o){var s;o=o||r.devicePixelRatio,typeof t===q?s=i(t,"canvas",a,o):n[V](t)&&(s=t,t=s.id),this.id=t,this.dom=s;var l=s.style;l&&(s.onselectstart=e,l["-webkit-user-select"]="none",l["user-select"]="none",l["-webkit-touch-callout"]="none",l["-webkit-tap-highlight-color"]="rgba(0,0,0,0)",l.padding=0,l.margin=0,l["border-width"]=0),this.domBack=null,this.ctxBack=null,this.painter=a,this.config=null,this.clearColor=0,this.motionBlur=!1,this.lastFrameAlpha=.7,this.dpr=o};return s[W]={constructor:s,elCount:0,__dirty:!0,initContext:function(){this.ctx=this.dom.getContext("2d"),this.ctx.dpr=this.dpr},createBackBuffer:function(){var t=this.dpr;this.domBack=i("back-"+this.id,"canvas",this.painter,t),this.ctxBack=this.domBack.getContext("2d"),1!=t&&this.ctxBack.scale(t,t)},resize:function(t,e){var i=this.dpr,n=this.dom,r=n.style,a=this.domBack;r.width=t+"px",r[ee]=e+"px",n.width=t*i,n[ee]=e*i,a&&(a.width=t*i,a[ee]=e*i,1!=i&&this.ctxBack.scale(i,i))},clear:function(t){var e=this.dom,i=this.ctx,n=e.width,r=e[ee],s=this.clearColor,l=this.motionBlur&&!t,u=this.lastFrameAlpha,c=this.dpr;if(l&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(e,0,0,n/c,r/c)),i.clearRect(0,0,n,r),s){var h;s[D]?(h=s.__canvasGradient||a.getGradient(i,s,{x:0,y:0,width:n,height:r}),s.__canvasGradient=h):s.image&&(h=o[W].getCanvasPattern.call(s,i)),i.save(),i.fillStyle=h||s,i.fillRect(0,0,n,r),i.restore()}if(l){var f=this.domBack;i.save(),i.globalAlpha=u,i.drawImage(f,0,0,n,r),i.restore()}}},s}),e("echarts/preprocessor/helper/compatStyle",[he,ce],function(t){function e(t){var e=t&&t.itemStyle;e&&i.each(n,function(n){var r=e[p],a=e.emphasis;r&&r[n]&&(t[n]=t[n]||{},t[n][p]?i.merge(t[n][p],r[n]):t[n][p]=r[n],r[n]=null),a&&a[n]&&(t[n]=t[n]||{},t[n].emphasis?i.merge(t[n].emphasis,a[n]):t[n].emphasis=a[n],a[n]=null)})}var i=t(ce),n=["areaStyle","lineStyle","nodeStyle","linkStyle","chordStyle","label","labelLine"];return function(t){if(t){e(t),e(t.markPoint),e(t.markLine);var n=t.data;if(n){for(var r=0;r<n[F];r++)e(n[r]);var a=t.markPoint;if(a&&a.data)for(var o=a.data,r=0;r<o[F];r++)e(o[r]);var s=t.markLine;if(s&&s.data)for(var l=s.data,r=0;r<l[F];r++)i[S](l[r])?(e(l[r][0]),e(l[r][1])):e(l[r])}}}}),e("echarts/chart/helper/SymbolDraw",[he,v,"./Symbol"],function(t){function e(t){this.group=new n.Group,this._symbolCtor=t||r}function i(t,e,i){var n=t.getItemLayout(e);return!(!n||isNaN(n[0])||isNaN(n[1])||i&&i(e)||"none"===t[B](e,"symbol"))}var n=t(v),r=t("./Symbol"),a=e[W];return a.updateData=function(t,e){var r=this.group,a=t.hostModel,o=this._data,s=this._symbolCtor,l={itemStyle:a[oe]("itemStyle.normal").getItemStyle(["color"]),hoverItemStyle:a[oe]("itemStyle.emphasis").getItemStyle(),symbolRotate:a.get("symbolRotate"),symbolOffset:a.get("symbolOffset"),hoverAnimation:a.get("hoverAnimation"),labelModel:a[oe]("label.normal"),hoverLabelModel:a[oe]("label.emphasis")};t.diff(o).add(function(n){var a=t.getItemLayout(n);if(i(t,n,e)){var o=new s(t,n,l);o.attr(j,a),t.setItemGraphicEl(n,o),r.add(o)}})[O](function(u,c){var h=o[f](c),d=t.getItemLayout(u);return i(t,u,e)?(h?(h.updateData(t,u,l),n.updateProps(h,{position:d},a)):(h=new s(t,u),h.attr(j,d)),r.add(h),void t.setItemGraphicEl(u,h)):void r[k](h)})[k](function(t){var e=o[f](t);e&&e.fadeOut(function(){r[k](e)})}).execute(),this._data=t},a.updateLayout=function(){var t=this._data;t&&t.eachItemGraphicEl(function(e,i){var n=t.getItemLayout(i);e.attr(j,n)})},a[k]=function(t){var e=this.group,i=this._data;i&&(t?i.eachItemGraphicEl(function(t){t.fadeOut(function(){e[k](t)})}):e.removeAll())},e}),e("echarts/component/axis/AxisView",[he,ce,v,"./AxisBuilder","../../echarts"],function(t){function e(t,e){function i(t){var e=n.getAxis(t);return e.toGlobalCoord(e.dataToCoord(0))}var n=t[le],r=e.axis,a={},o=r[j],s=r.onZero?"onZero":o,l=r.dim,u=n.getRect(),h=[u.x,u.x+u.width,u.y,u.y+u[ee]],f=e.get(c)||0,d={x:{top:h[2]-f,bottom:h[3]+f},y:{left:h[0]-f,right:h[1]+f}};d.x.onZero=Math.max(Math.min(i("y"),d.x[Y]),d.x.top),d.y.onZero=Math.max(Math.min(i("x"),d.y.right),d.y.left),a[j]=["y"===l?d.y[s]:h[0],"x"===l?d.x[s]:h[3]],a.rotation=Math.PI/2*("x"===l?0:1);var p={top:-1,bottom:1,left:-1,right:1};a.labelDirection=a.tickDirection=a.nameDirection=p[o],r.onZero&&(a.labelOffset=d[l][o]-d[l].onZero),e[oe]("axisTick").get("inside")&&(a.tickDirection=-a.tickDirection),e[oe]("axisLabel").get("inside")&&(a.labelDirection=-a.labelDirection);var v=e[oe]("axisLabel").get("rotate");return a.labelRotation="top"===s?-v:v,a.labelInterval=r.getLabelInterval(),a.z2=1,a}var i=t(ce),n=t(v),r=t("./AxisBuilder"),a=r.ifIgnoreOnTick,o=r.getInterval,s=["axisLine","axisLabel","axisTick","axisName"],l=["splitArea","splitLine"],u=t("../../echarts").extendComponentView({type:"axis",render:function(t){this.group.removeAll();var a=this._axisGroup;if(this._axisGroup=new n.Group,this.group.add(this._axisGroup),t.get("show")){var o=t.getCoordSysModel(),u=e(o,t),c=new r(t,u);i.each(s,c.add,c),this._axisGroup.add(c.getGroup()),i.each(l,function(e){t.get(e+".show")&&this["_"+e](t,o,u.labelInterval)},this),n.groupTransition(a,this._axisGroup,t)}},_splitLine:function(t,e,r){var s=t.axis;if(!s.isBlank()){var l=t[oe]("splitLine"),u=l[oe]("lineStyle"),c=u.get("color"),h=o(l,r);c=i[S](c)?c:[c];for(var f=e[le].getRect(),d=s.isHorizontal(),p=0,v=s.getTicksCoords(),m=s.scale.getTicks(),g=[],y=[],_=u.getLineStyle(),x=0;x<v[F];x++)if(!a(s,x,h)){var b=s.toGlobalCoord(v[x]);d?(g[0]=b,g[1]=f.y,y[0]=b,y[1]=f.y+f[ee]):(g[0]=f.x,g[1]=b,y[0]=f.x+f.width,y[1]=b);var w=p++%c[F];this._axisGroup.add(new n.Line(n.subPixelOptimizeLine({anid:"line_"+m[x],shape:{x1:g[0],y1:g[1],x2:y[0],y2:y[1]},style:i[se]({stroke:c[w]},_),silent:!0})))}}},_splitArea:function(t,e,r){var s=t.axis;if(!s.isBlank()){var l=t[oe]("splitArea"),u=l[oe]("areaStyle"),c=u.get("color"),h=e[le].getRect(),f=s.getTicksCoords(),d=s.scale.getTicks(),p=s.toGlobalCoord(f[0]),v=s.toGlobalCoord(f[0]),m=0,g=o(l,r),y=u.getAreaStyle();c=i[S](c)?c:[c];for(var _=1;_<f[F];_++)if(!a(s,_,g)){var x,b,w,T,M=s.toGlobalCoord(f[_]);s.isHorizontal()?(x=p,b=h.y,w=M-x,T=h[ee]):(x=h.x,b=v,w=h.width,T=M-b);var C=m++%c[F];this._axisGroup.add(new n.Rect({anid:"area_"+d[_],shape:{x:x,y:b,width:w,height:T},style:i[se]({fill:c[C]},y),silent:!0})),p=x+w,v=b+T}}}});u[z]({type:"xAxis"}),u[z]({type:"yAxis"})}),e("echarts/chart/helper/Symbol",[he,ce,"../../util/symbol",v,"../../util/number"],function(t){function e(t,e){var i=t[B](e,"symbolSize");return i instanceof Array?i.slice():[+i,+i]}function i(t){return[t[0]/2,t[1]/2]}function n(t,e,i){s.Group.call(this),this.updateData(t,e,i)}function r(t,e){this[h].drift(t,e)}var a=t(ce),o=t("../../util/symbol"),s=t(v),c=t("../../util/number"),f=n[W];f._createSymbol=function(t,e,n,a){this.removeAll();var l=e.hostModel,u=e[B](n,"color"),c=o.createSymbol(t,-1,-1,2,2,u);c.attr({z2:100,culling:!0,scale:[0,0]}),c.drift=r,s.initProps(c,{scale:i(a)},l,n),this._symbolType=t,this.add(c)},f.stopSymbolAnimation=function(t){this.childAt(0).stopAnimation(t)},f.getSymbolPath=function(){return this.childAt(0)},f.getScale=function(){return this.childAt(0).scale},f.highlight=function(){this.childAt(0)[I]("emphasis")},f.downplay=function(){this.childAt(0)[I](p)},f.setZ=function(t,e){var i=this.childAt(0);i[C]=t,i.z=e},f.setDraggable=function(t){var e=this.childAt(0);e.draggable=t,e.cursor=t?"move":"pointer"},f.updateData=function(t,n,r){this[te]=!1;var a=t[B](n,"symbol")||"circle",o=t.hostModel,l=e(t,n);if(a!==this._symbolType)this._createSymbol(a,t,n,l);else{var u=this.childAt(0);s.updateProps(u,{scale:i(l)},o,n)}this._updateCommon(t,n,l,r),this._seriesModel=o};var g=["itemStyle",p],y=["itemStyle","emphasis"],_=["label",p],x=["label","emphasis"];return f._updateCommon=function(t,e,n,r){var o=this.childAt(0),h=t.hostModel,f=t[B](e,"color");"image"!==o.type&&o.useStyle({strokeNoScale:!0}),r=r||null;var v=r&&r.itemStyle,b=r&&r.hoverItemStyle,w=r&&r.symbolRotate,T=r&&r.symbolOffset,S=r&&r.labelModel,M=r&&r.hoverLabelModel,C=r&&r.hoverAnimation;if(!r||t.hasItemOption){var A=t[d](e);v=A[oe](g).getItemStyle(["color"]),b=A[oe](y).getItemStyle(),w=A[u]("symbolRotate"),T=A[u]("symbolOffset"),S=A[oe](_),M=A[oe](x),C=A[u]("hoverAnimation")}else b=a[z]({},b);var L=o.style;o.attr("rotation",(w||0)*Math.PI/180||0),T&&o.attr(j,[c.parsePercent(T[0],n[0]),c.parsePercent(T[1],n[1])]),o.setColor(f),o[X](v);var I=t[B](e,Z);null!=I&&(L[Z]=I);for(var k,D,O=t.dimensions.slice();O[F]&&(k=O.pop(),D=t.getDimensionInfo(k).type,D===l||"time"===D););null!=k&&S[u]("show")?(s.setText(L,S,f),L.text=a[m](h.getFormattedLabel(e,p),t.get(k,e))):L.text="",null!=k&&M[u]("show")?(s.setText(b,M,f),b.text=a[m](h.getFormattedLabel(e,"emphasis"),t.get(k,e))):b.text="",o.off("mouseover").off(P).off("emphasis").off(p),o.hoverStyle=b,s.setHoverStyle(o);var E=i(n);if(C&&h.isAnimationEnabled()){var R=function(){var t=E[1]/E[0];this.animateTo({scale:[Math.max(1.1*E[0],E[0]+3),Math.max(1.1*E[1],E[1]+3*t)]},400,"elasticOut")},N=function(){this.animateTo({scale:E},400,"elasticOut")};o.on("mouseover",R).on(P,N).on("emphasis",R).on(p,N)}},f.fadeOut=function(t){var e=this.childAt(0);this[te]=!0,e.style.text="",s.updateProps(e,{scale:[0,0]},this._seriesModel,this[R],t)},a[b](n,s.Group),n}),e("echarts/chart/line/lineAnimationDiff",[he],function(){function t(t){return t>=0?1:-1}function e(e,i,n){for(var r,a=e.getBaseAxis(),o=e.getOtherAxis(a),s=a.onZero?0:o.scale[_]()[0],l=o.dim,u="x"===l||"radius"===l?1:0,c=i.stackedOn,h=i.get(l,n);c&&t(c.get(l,n))===t(h);){r=c;break}var f=[];return f[u]=i.get(a.dim,n),f[1-u]=r?r.get(l,n,!0):s,e[g](f)}function i(t,e){var i=[];return e.diff(t).add(function(t){i.push({cmd:"+",idx:t})})[O](function(t,e){i.push({cmd:"=",idx:e,idx1:t})})[k](function(t){i.push({cmd:"-",idx:t})}).execute(),i}return function(t,n,r,a,o,s){for(var l=i(t,n),u=[],c=[],h=[],f=[],d=[],p=[],v=[],m=s.dimensions,y=0;y<l[F];y++){var _=l[y],x=!0;switch(_.cmd){case"=":var b=t.getItemLayout(_.idx),w=n.getItemLayout(_.idx1);(isNaN(b[0])||isNaN(b[1]))&&(b=w.slice()),u.push(b),c.push(w),h.push(r[_.idx]),f.push(a[_.idx1]),v.push(n.getRawIndex(_.idx1));break;case"+":var T=_.idx;u.push(o[g]([n.get(m[0],T,!0),n.get(m[1],T,!0)])),c.push(n.getItemLayout(T).slice()),h.push(e(o,n,T)),f.push(a[T]),v.push(n.getRawIndex(T));break;case"-":var T=_.idx,S=t.getRawIndex(T);S!==T?(u.push(t.getItemLayout(T)),c.push(s[g]([t.get(m[0],T,!0),t.get(m[1],T,!0)])),h.push(r[T]),f.push(e(s,t,T)),v.push(S)):x=!1}x&&(d.push(_),p.push(p[F]))}p.sort(function(t,e){return v[t]-v[e]});for(var M=[],C=[],A=[],P=[],L=[],y=0;y<p[F];y++){var T=p[y];M[y]=u[T],C[y]=c[T],A[y]=h[T],P[y]=f[T],L[y]=d[T]}return{current:M,next:C,stackedOnCurrent:A,stackedOnNext:P,status:L}}}),e("echarts/chart/line/poly",[he,"zrender/graphic/Path","zrender/core/vector"],function(t){function e(t){return isNaN(t[0])||isNaN(t[1])}function i(t,i,n,r,d,p,v,m,g,y,_){for(var x=0,b=n,w=0;r>w;w++){var T=i[b];if(b>=d||0>b)break;if(e(T)){if(_){b+=p;continue}break}if(b===n)t[p>0?"moveTo":"lineTo"](T[0],T[1]),u(h,T);else if(g>0){var S=b+p,M=i[S];if(_)for(;M&&e(i[S]);)S+=p,M=i[S];var C=.5,A=i[x],M=i[S];if(!M||e(M))u(f,T);else{e(M)&&!_&&(M=T),a.sub(c,M,A);var P,L;if("x"===y||"y"===y){var I="x"===y?0:1;P=Math.abs(T[I]-A[I]),L=Math.abs(T[I]-M[I])}else P=a.dist(T,A),L=a.dist(T,M);C=L/(L+P),l(f,T,c,-g*(1-C))}o(h,h,m),s(h,h,v),o(f,f,m),s(f,f,v),t.bezierCurveTo(h[0],h[1],f[0],f[1],T[0],T[1]),l(h,T,c,g*C)}else t.lineTo(T[0],T[1]);x=b,b+=p}return w}function n(t,e){var i=[1/0,1/0],n=[-1/0,-1/0];if(e)for(var r=0;r<t[F];r++){var a=t[r];a[0]<i[0]&&(i[0]=a[0]),a[1]<i[1]&&(i[1]=a[1]),a[0]>n[0]&&(n[0]=a[0]),a[1]>n[1]&&(n[1]=a[1])}return{min:e?i:n,max:e?n:i}}var r=t("zrender/graphic/Path"),a=t("zrender/core/vector"),o=a.min,s=a.max,l=a.scaleAndAdd,u=a.copy,c=[],h=[],f=[];return{Polyline:r[z]({type:"ec-polyline",shape:{points:[],smooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},style:{fill:null,stroke:"#000"},buildPath:function(t,r){var a=r.points,o=0,s=a[F],l=n(a,r.smoothConstraint);if(r.connectNulls){for(;s>0&&e(a[s-1]);s--);for(;s>o&&e(a[o]);o++);}for(;s>o;)o+=i(t,a,o,s,s,1,l.min,l.max,r.smooth,r.smoothMonotone,r.connectNulls)+1}}),Polygon:r[z]({type:"ec-polygon",shape:{points:[],stackedOnPoints:[],smooth:0,stackedOnSmooth:0,smoothConstraint:!0,smoothMonotone:null,connectNulls:!1},buildPath:function(t,r){var a=r.points,o=r.stackedOnPoints,s=0,l=a[F],u=r.smoothMonotone,c=n(a,r.smoothConstraint),h=n(o,r.smoothConstraint);if(r.connectNulls){for(;l>0&&e(a[l-1]);l--);for(;l>s&&e(a[s]);s++);}for(;l>s;){var f=i(t,a,s,l,l,1,c.min,c.max,r.smooth,u,r.connectNulls);i(t,o,s+f-1,f,l,-1,h.min,h.max,r.stackedOnSmooth,u,r.connectNulls),s+=f+1,t.closePath()}}})}}),e("echarts/component/helper/selectableMixin",[he,ce],function(t){var e=t(ce);return{updateSelectedMap:function(t){this._selectTargetMap=e.reduce(t||[],function(t,e){return t[e.name]=e,t},{})},select:function(t){var i=this._selectTargetMap,n=i[t],r=this.get("selectedMode");"single"===r&&e.each(i,function(t){t.selected=!1}),n&&(n.selected=!0)},unSelect:function(t){var e=this._selectTargetMap[t];e&&(e.selected=!1)},toggleSelected:function(t){var e=this._selectTargetMap[t];return null!=e?(this[e.selected?"unSelect":"select"](t),e.selected):void 0},isSelected:function(t){var e=this._selectTargetMap[t];return e&&e.selected}}}),e("echarts/component/helper/listComponent",[he,"../../util/layout","../../util/format",v],function(t){function e(t,e,n){i.positionElement(t,e.getBoxLayoutParams(),{width:n[J](),height:n[K]()},e.get("padding"))}var i=t("../../util/layout"),n=t("../../util/format"),r=t(v);return{layout:function(t,n,r){var a=i.getLayoutRect(n.getBoxLayoutParams(),{width:r[J](),height:r[K]()},n.get("padding"));i.box(n.get("orient"),t,n.get("itemGap"),a.width,a[ee]),e(t,n,r)},addBackground:function(t,e){var i=n.normalizeCssArray(e.get("padding")),a=t[ie](),o=e.getItemStyle(["color",Z]);o.fill=e.get("backgroundColor");var s=new r.Rect({shape:{x:a.x-i[3],y:a.y-i[0],width:a.width+i[1]+i[3],height:a[ee]+i[0]+i[2]},style:o,silent:!0,z2:-1});r.subPixelOptimizeRect(s),t.add(s)}}}),e("echarts/util/symbol",[he,"./graphic","zrender/core/BoundingRect"],function(t){var e=t("./graphic"),i=t("zrender/core/BoundingRect"),n=e.extendShape({type:"triangle",shape:{cx:0,cy:0,width:0,height:0},buildPath:function(t,e){var i=e.cx,n=e.cy,r=e.width/2,a=e[ee]/2;t.moveTo(i,n-a),t.lineTo(i+r,n+a),t.lineTo(i-r,n+a),t.closePath()}}),r=e.extendShape({type:"diamond",shape:{cx:0,cy:0,width:0,height:0},buildPath:function(t,e){var i=e.cx,n=e.cy,r=e.width/2,a=e[ee]/2;t.moveTo(i,n-a),t.lineTo(i+r,n),t.lineTo(i,n+a),t.lineTo(i-r,n),t.closePath()}}),a=e.extendShape({type:"pin",shape:{x:0,y:0,width:0,height:0},buildPath:function(t,e){var i=e.x,n=e.y,r=e.width/5*3,a=Math.max(r,e[ee]),o=r/2,s=o*o/(a-o),l=n-a+o+s,u=Math.asin(s/o),c=Math.cos(u)*o,h=Math.sin(u),f=Math.cos(u);t.arc(i,l,o,Math.PI-u,2*Math.PI+u);var d=.6*o,p=.7*o;t.bezierCurveTo(i+c-h*d,l+s+f*d,i,n-p,i,n),t.bezierCurveTo(i,n-p,i-c+h*d,l+s+f*d,i-c,l+s),t.closePath()}}),s=e.extendShape({type:"arrow",shape:{x:0,y:0,width:0,height:0},buildPath:function(t,e){var i=e[ee],n=e.width,r=e.x,a=e.y,o=n/3*2;t.moveTo(r,a),t.lineTo(r+o,a+i),t.lineTo(r,a+i/4*3),t.lineTo(r-o,a+i),t.lineTo(r,a),t.closePath()}}),l={line:e.Line,rect:e.Rect,roundRect:e.Rect,square:e.Rect,circle:e.Circle,diamond:r,pin:a,arrow:s,triangle:n},u={line:function(t,e,i,n,r){r.x1=t,r.y1=e+n/2,r.x2=t+i,r.y2=e+n/2},rect:function(t,e,i,n,r){r.x=t,r.y=e,r.width=i,r[ee]=n},roundRect:function(t,e,i,n,r){r.x=t,r.y=e,r.width=i,r[ee]=n,r.r=Math.min(i,n)/4},square:function(t,e,i,n,r){var a=Math.min(i,n);r.x=t,r.y=e,r.width=a,r[ee]=a},circle:function(t,e,i,n,r){r.cx=t+i/2,r.cy=e+n/2,r.r=Math.min(i,n)/2},diamond:function(t,e,i,n,r){r.cx=t+i/2,r.cy=e+n/2,r.width=i,r[ee]=n},pin:function(t,e,i,n,r){r.x=t+i/2,r.y=e+n/2,r.width=i,r[ee]=n},arrow:function(t,e,i,n,r){r.x=t+i/2,r.y=e+n/2,r.width=i,r[ee]=n},triangle:function(t,e,i,n,r){r.cx=t+i/2,r.cy=e+n/2,r.width=i,r[ee]=n
}},c={};for(var h in l)l.hasOwnProperty(h)&&(c[h]=new l[h]);var f=e.extendShape({type:"symbol",shape:{symbolType:"",x:0,y:0,width:0,height:0},beforeBrush:function(){var t=this.style,e=this.shape;"pin"===e.symbolType&&"inside"===t.textPosition&&(t.textPosition=["50%","40%"],t[re]=$,t.textVerticalAlign=Q)},buildPath:function(t,e,i){var n=e.symbolType,r=c[n];"none"!==e.symbolType&&(r||(n="rect",r=c[n]),u[n](e.x,e.y,e.width,e[ee],r.shape),r.buildPath(t,r.shape,i))}}),d=function(t){if("image"!==this.type){var e=this.style,i=this.shape;i&&"line"===i.symbolType?e[o]=t:this.__isEmptyBrush?(e[o]=t,e.fill="#fff"):(e.fill&&(e.fill=t),e[o]&&(e[o]=t)),this.dirty(!1)}},p={createSymbol:function(t,n,r,a,o,s){var l=0===t[N]("empty");l&&(t=t.substr(5,1)[U]()+t.substr(6));var u;return u=0===t[N]("image://")?new e.Image({style:{image:t.slice(8),x:n,y:r,width:a,height:o}}):0===t[N]("path://")?e.makePath(t.slice(7),{},new i(n,r,a,o)):new f({shape:{symbolType:t,x:n,y:r,width:a,height:o}}),u.__isEmptyBrush=l,u.setColor=d,u.setColor(s),u}};return p}),e("echarts/component/tooltip/TooltipContent",[he,ce,"zrender/tool/color","zrender/core/event","../../util/format","zrender/core/env"],function(t){function e(t){var e="cubic-bezier(0.23, 1, 0.32, 1)",i="left "+t+"s "+e+",top "+t+"s "+e;return a.map(f,function(t){return t+"transition:"+i}).join(";")}function i(t){var e=[],i=t.get("fontSize"),n=t.getTextColor();return n&&e.push("color:"+n),e.push("font:"+t[ne]()),i&&e.push("line-height:"+Math.round(3*i/2)+"px"),u(["decoration","align"],function(i){var n=t.get(i);n&&e.push("text-"+i+":"+n)}),e.join(";")}function n(t){t=t;var n=[],r=t.get("transitionDuration"),a=t.get("backgroundColor"),s=t[oe](ae),f=t.get("padding");return r&&n.push(e(r)),a&&(h.canvasSupported?n.push("background-Color:"+a):(n.push("background-Color:#"+o.toHex(a)),n.push("filter:alpha(opacity=70)"))),u(["width","color","radius"],function(e){var i="border-"+e,r=c(i),a=t.get(r);null!=a&&n.push(i+":"+a+("color"===e?"":"px"))}),n.push(i(s)),null!=f&&n.push("padding:"+l.normalizeCssArray(f).join("px ")+"px"),n.join(";")+";"}function r(t,e){var i=document.createElement("div"),n=e.getZr();this.el=i,this._x=e[J]()/2,this._y=e[K]()/2,t.appendChild(i),this._container=t,this._show=!1,this._hideTimeout;var r=this;i.onmouseenter=function(){r.enterable&&(clearTimeout(r._hideTimeout),r._show=!0),r._inContent=!0},i.onmousemove=function(e){if(e=e||window.event,!r.enterable){var i=n.handler;s.normalizeEvent(t,e,!0),i.dispatch("mousemove",e)}},i.onmouseleave=function(){r.enterable&&r._show&&r.hideLater(r._hideDelay),r._inContent=!1}}var a=t(ce),o=t("zrender/tool/color"),s=t("zrender/core/event"),l=t("../../util/format"),u=a.each,c=l.toCamelCase,h=t("zrender/core/env"),f=["","-webkit-","-moz-","-o-"],d="position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;";return r[W]={constructor:r,enterable:!0,update:function(){var t=this._container,e=t.currentStyle||document.defaultView.getComputedStyle(t),i=t.style;"absolute"!==i[j]&&"absolute"!==e[j]&&(i[j]="relative")},show:function(t){clearTimeout(this._hideTimeout);var e=this.el;e.style.cssText=d+n(t)+";left:"+this._x+"px;top:"+this._y+"px;"+(t.get("extraCssText")||""),e.style.display=e.innerHTML?"block":"none",this._show=!0},setContent:function(t){var e=this.el;e.innerHTML=t,e.style.display=t?"block":"none"},moveTo:function(t,e){var i=this.el.style;i.left=t+"px",i.top=e+"px",this._x=t,this._y=e},hide:function(){this.el.style.display="none",this._show=!1},hideLater:function(t){!this._show||this._inContent&&this.enterable||(t?(this._hideDelay=t,this._show=!1,this._hideTimeout=setTimeout(a.bind(this.hide,this),t)):this.hide())},isShow:function(){return this._show}},r}),e("echarts/component/axis/AxisBuilder",[he,ce,"../../util/format",v,"../../model/Model","../../util/number","zrender/core/vector"],function(t){function e(t){var e={componentType:t.mainType};return e[t.mainType+"Index"]=t.componentIndex,e}function i(t,e,i){var n,r,a=d(e-t.rotation);return p(a)?(r=i>0?"top":Y,n=$):p(a-b)?(r=i>0?Y:"top",n=$):(r=Q,n=a>0&&b>a?i>0?"right":"left":i>0?"left":"right"),{rotation:a,textAlign:n,verticalAlign:r}}function n(t,e,i,n){var r,a,o=d(i-t.rotation),s=n[0]>n[1],l="start"===e&&!s||"start"!==e&&s;return p(o-b/2)?(a=l?Y:"top",r=$):p(o-1.5*b)?(a=l?"top":Y,r=$):(a=Q,r=1.5*b>o&&o>b/2?l?"left":"right":l?"right":"left"),{rotation:o,textAlign:r,verticalAlign:a}}function a(t){var e=t.get("tooltip");return t.get(te)||!(t.get("triggerEvent")||e&&e.show)}var o=t(ce),u=t("../../util/format"),c=t(v),h=t("../../model/Model"),f=t("../../util/number"),d=f.remRadian,p=f.isRadianAroundZero,g=t("zrender/core/vector"),y=g[s],x=o[m],b=Math.PI,w=function(t,e){this.opt=e,this.axisModel=t,o[se](e,{labelOffset:0,nameDirection:1,tickDirection:1,labelDirection:1,silent:!0}),this.group=new c.Group;var i=new c.Group({position:e[j].slice(),rotation:e.rotation});i.updateTransform(),this._transform=i.transform,this._dumbGroup=i};w[W]={constructor:w,hasBuilder:function(t){return!!S[t]},add:function(t){S[t].call(this)},getGroup:function(){return this.group}};var S={axisLine:function(){var t=this.opt,e=this.axisModel;if(e.get("axisLine.show")){var i=this.axisModel.axis[_](),n=this._transform,r=[i[0],0],a=[i[1],0];n&&(y(r,r,n),y(a,a,n)),this.group.add(new c.Line(c.subPixelOptimizeLine({anid:"line",shape:{x1:r[0],y1:r[1],x2:a[0],y2:a[1]},style:o[z]({lineCap:"round"},e[oe]("axisLine.lineStyle").getLineStyle()),strokeContainThreshold:t.strokeContainThreshold||5,silent:!0,z2:1})))}},axisTick:function(){var t=this.axisModel,e=t.axis;if(t.get("axisTick.show")&&!e.isBlank())for(var i=t[oe]("axisTick"),n=this.opt,r=i[oe]("lineStyle"),a=i.get(F),s=C(i,n.labelInterval),l=e.getTicksCoords(i.get("alignWithLabel")),u=e.scale.getTicks(),h=[],f=[],d=this._transform,p=0;p<l[F];p++)if(!M(e,p,s)){var v=l[p];h[0]=v,h[1]=0,f[0]=v,f[1]=n.tickDirection*a,d&&(y(h,h,d),y(f,f,d)),this.group.add(new c.Line(c.subPixelOptimizeLine({anid:"tick_"+u[p],shape:{x1:h[0],y1:h[1],x2:f[0],y2:f[1]},style:o[se](r.getLineStyle(),{stroke:t.get("axisLine.lineStyle.color")}),z2:2,silent:!0})))}},axisLabel:function(){function t(t,e){var i=t&&t[ie]().clone(),n=e&&e[ie]().clone();return i&&n?(i[s](t.getLocalTransform()),n[s](e.getLocalTransform()),i.intersect(n)):void 0}var n=this.opt,l=this.axisModel,u=l.axis,f=x(n.axisLabelShow,l.get("axisLabel.show"));if(f&&!u.isBlank()){var d=l[oe]("axisLabel"),p=d[oe](ae),v=d.get("margin"),m=u.scale.getTicks(),g=l.getFormattedLabels(),y=x(n.labelRotation,d.get("rotate"))||0;y=y*b/180;var _=i(n,y,n.labelDirection),w=l.get("data"),S=[],C=a(l),A=l.get("triggerEvent");if(o.each(m,function(t,i){if(!M(u,i,n.labelInterval)){var a=p;w&&w[t]&&w[t][ae]&&(a=new h(w[t][ae],p,l[r]));var o=a.getTextColor()||l.get("axisLine.lineStyle.color"),s=u.dataToCoord(t),f=[s,n.labelOffset+n.labelDirection*v],d=u.scale.getLabel(t),m=new c.Text({anid:"label_"+t,style:{text:g[i],textAlign:a.get("align",!0)||_[re],textVerticalAlign:a.get("baseline",!0)||_.verticalAlign,textFont:a[ne](),fill:typeof o===T?o(d):o},position:f,rotation:_.rotation,silent:C,z2:10});A&&(m.eventData=e(l),m.eventData.targetType="axisLabel",m.eventData.value=d),this._dumbGroup.add(m),m.updateTransform(),S.push(m),this.group.add(m),m.decomposeTransform()}},this),null!=l.getMin()){var P=S[0],L=S[1];t(P,L)&&(P[G]=!0)}if(null!=l.getMax()){var I=S[S[F]-1],z=S[S[F]-2];t(z,I)&&(I[G]=!0)}}},axisName:function(){var t=this.opt,r=this.axisModel,s=x(t.axisName,r.get("name"));if(s){var l,h=r.get("nameLocation"),f=t.nameDirection,d=r[oe]("nameTextStyle"),p=r.get("nameGap")||0,v=this.axisModel.axis[_](),m=v[0]>v[1]?-1:1,g=["start"===h?v[0]-m*p:"end"===h?v[1]+m*p:(v[0]+v[1])/2,h===Q?t.labelOffset+f*p:0],y=r.get("nameRotate");null!=y&&(y=y*b/180);var w;h===Q?l=i(t,null!=y?y:t.rotation,f):(l=n(t,h,y||0,v),w=t.axisNameAvailableWidth,null!=w&&(w=Math.abs(w/Math.sin(l.rotation)),!isFinite(w)&&(w=null)));var T=d[ne](),S=r.get("nameTruncate",!0)||{},M=S.ellipsis,C=x(S.maxWidth,w),A=null!=M&&null!=C?u.truncateText(s,C,T,M,{minChar:2,placeholder:S.placeholder}):s,P=r.get("tooltip",!0),L=r.mainType,I={componentType:L,name:s,$vars:["name"]};I[L+"Index"]=r.componentIndex;var k=new c.Text({anid:"name",__fullText:s,__truncatedText:A,style:{text:A,textFont:T,fill:d.getTextColor()||r.get("axisLine.lineStyle.color"),textAlign:l[re],textVerticalAlign:l.verticalAlign},position:g,rotation:l.rotation,silent:a(r),z2:1,tooltip:P&&P.show?o[z]({content:s,formatter:function(){return s},formatterParams:I},P):null});r.get("triggerEvent")&&(k.eventData=e(r),k.eventData.targetType="axisName",k.eventData.name=s),this._dumbGroup.add(k),k.updateTransform(),this.group.add(k),k.decomposeTransform()}}},M=w.ifIgnoreOnTick=function(t,e,i){var n,r=t.scale;return r.type===l&&(typeof i===T?(n=r.getTicks()[e],!i(n,r.getLabel(n))):e%(i+1))},C=w.getInterval=function(t,e){var i=t.get("interval");return(null==i||"auto"==i)&&(i=e),i};return w}),e("echarts/chart/pie/labelLayout",[he,"zrender/contain/text"],function(t){function e(t,e,i,n,r,a,o){function s(e,i,n){for(var r=e;i>r;r++)if(t[r].y+=n,r>e&&i>r+1&&t[r+1].y>t[r].y+t[r][ee])return void l(r,n/2);l(i-1,n/2)}function l(e,i){for(var n=e;n>=0&&(t[n].y-=i,!(n>0&&t[n].y>t[n-1].y+t[n-1][ee]));n--);}function u(t,e,i,n,r,a){for(var o=a>0?e?Number.MAX_VALUE:0:e?Number.MAX_VALUE:0,s=0,l=t[F];l>s;s++)if(t[s][j]!==$){var u=Math.abs(t[s].y-n),c=t[s].len,h=t[s].len2,f=r+c>u?Math.sqrt((r+c+h)*(r+c+h)-u*u):Math.abs(t[s].x-i);e&&f>=o&&(f=o-10),!e&&o>=f&&(f=o+10),t[s].x=i+f*a,o=f}}t.sort(function(t,e){return t.y-e.y});for(var c,h=0,f=t[F],d=[],p=[],v=0;f>v;v++)c=t[v].y-h,0>c&&s(v,f,-c,r),h=t[v].y+t[v][ee];0>o-h&&l(f-1,h-o);for(var v=0;f>v;v++)t[v].y>=i?p.push(t[v]):d.push(t[v]);u(d,!1,e,i,n,r),u(p,!0,e,i,n,r)}function i(t,i,n,r,a,o){for(var s=[],l=[],u=0;u<t[F];u++)t[u].x<i?s.push(t[u]):l.push(t[u]);e(l,i,n,r,1,a,o),e(s,i,n,r,-1,a,o);for(var u=0;u<t[F];u++){var c=t[u].linePoints;if(c){var h=c[1][0]-c[2][0];c[2][0]=t[u].x<i?t[u].x+3:t[u].x-3,c[1][1]=c[2][1]=t[u].y,c[1][0]=c[2][0]+h}}}var n=t("zrender/contain/text");return function(t,e,r,a){var o,s,l=t[ue](),u=[],c=!1;l.each(function(i){var r,a,h,f,v=l.getItemLayout(i),m=l[d](i),g=m[oe]("label.normal"),y=g.get(j)||m.get("label.emphasis.position"),_=m[oe]("labelLine.normal"),x=_.get(F),b=_.get("length2"),w=(v.startAngle+v.endAngle)/2,T=Math.cos(w),S=Math.sin(w);o=v.cx,s=v.cy;var M="inside"===y||"inner"===y;if(y===$)r=v.cx,a=v.cy,f=$;else{var C=(M?(v.r+v.r0)/2*T:v.r*T)+o,A=(M?(v.r+v.r0)/2*S:v.r*S)+s;if(r=C+3*T,a=A+3*S,!M){var P=C+T*(x+e-v.r),L=A+S*(x+e-v.r),I=P+(0>T?-1:1)*b,z=L;r=I+(0>T?-5:5),a=z,h=[[C,A],[P,L],[I,z]]}f=M?$:T>0?"left":"right"}var k=g[oe](ae)[ne](),D=g.get("rotate")?0>T?-w+Math.PI:-w:0,O=t.getFormattedLabel(i,p)||l.getName(i),E=n[ie](O,k,f,"top");c=!!D,v.label={x:r,y:a,position:y,height:E[ee],len:x,len2:b,linePoints:h,textAlign:f,verticalAlign:"middle",font:k,rotation:D},M||u.push(v.label)}),!c&&t.get("avoidLabelOverlap")&&i(u,o,s,e,r,a)}}),e("zrender",["zrender/zrender"],function(t){return t}),e("echarts",["echarts/echarts"],function(t){return t});var fe=t("echarts");return fe.graphic=t("echarts/util/graphic"),fe.number=t("echarts/util/number"),fe.format=t("echarts/util/format"),t("echarts/chart/bar"),t("echarts/chart/line"),t("echarts/chart/pie"),t("echarts/component/grid"),t("echarts/component/title"),t("echarts/component/legend"),t("echarts/component/tooltip"),fe});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){

; jQuery = global.jQuery = require("jquery");
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
/*! jquery.cookie v1.4.1 | MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(__browserify_shim_require__("jquery")):a(jQuery)}(function(a){function b(a){return h.raw?a:encodeURIComponent(a)}function c(a){return h.raw?a:decodeURIComponent(a)}function d(a){return b(h.json?JSON.stringify(a):String(a))}function e(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return a=decodeURIComponent(a.replace(g," ")),h.json?JSON.parse(a):a}catch(b){}}function f(b,c){var d=h.raw?b:e(b);return a.isFunction(c)?c(d):d}var g=/\+/g,h=a.cookie=function(e,g,i){if(void 0!==g&&!a.isFunction(g)){if(i=a.extend({},h.defaults,i),"number"==typeof i.expires){var j=i.expires,k=i.expires=new Date;k.setTime(+k+864e5*j)}return document.cookie=[b(e),"=",d(g),i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}for(var l=e?void 0:{},m=document.cookie?document.cookie.split("; "):[],n=0,o=m.length;o>n;n++){var p=m[n].split("="),q=c(p.shift()),r=p.join("=");if(e&&e===q){l=f(r,g);break}e||void 0===(r=f(r))||(l[q]=r)}return l};h.defaults={},a.removeCookie=function(b,c){return void 0===a.cookie(b)?!1:(a.cookie(b,"",a.extend({},c,{expires:-1})),!a.cookie(b))}});
}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":6}],4:[function(require,module,exports){
/*!
 * Vue.js v2.0.2
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Vue=t()}(this,function(){"use strict";function e(e){return null==e?"":"object"==typeof e?JSON.stringify(e,null,2):String(e)}function t(e){var t=parseFloat(e,10);return t||0===t?t:e}function n(e,t){for(var n=Object.create(null),r=e.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return t?function(e){return n[e.toLowerCase()]}:function(e){return n[e]}}function r(e,t){if(e.length){var n=e.indexOf(t);if(n>-1)return e.splice(n,1)}}function i(e,t){return yr.call(e,t)}function o(e){return"string"==typeof e||"number"==typeof e}function a(e){var t=Object.create(null);return function(n){var r=t[n];return r||(t[n]=e(n))}}function s(e,t){function n(n){var r=arguments.length;return r?r>1?e.apply(t,arguments):e.call(t,n):e.call(t)}return n._length=e.length,n}function c(e,t){t=t||0;for(var n=e.length-t,r=new Array(n);n--;)r[n]=e[n+t];return r}function u(e,t){for(var n in t)e[n]=t[n];return e}function l(e){return null!==e&&"object"==typeof e}function f(e){return xr.call(e)===kr}function d(e){for(var t={},n=0;n<e.length;n++)e[n]&&u(t,e[n]);return t}function p(){}function v(e){return e.reduce(function(e,t){return e.concat(t.staticKeys||[])},[]).join(",")}function h(e,t){return e==t||!(!l(e)||!l(t))&&JSON.stringify(e)===JSON.stringify(t)}function m(e,t){for(var n=0;n<e.length;n++)if(h(e[n],t))return n;return-1}function g(e){var t=(e+"").charCodeAt(0);return 36===t||95===t}function y(e,t,n,r){Object.defineProperty(e,t,{value:n,enumerable:!!r,writable:!0,configurable:!0})}function _(e){if(!Tr.test(e)){var t=e.split(".");return function(e){for(var n=0;n<t.length;n++){if(!e)return;e=e[t[n]]}return e}}}function b(e){return/native code/.test(e.toString())}function $(e){Fr.target&&Hr.push(Fr.target),Fr.target=e}function w(){Fr.target=Hr.pop()}function C(){Ur.length=0,zr={},Vr=Jr=!1}function x(){for(Jr=!0,Ur.sort(function(e,t){return e.id-t.id}),qr=0;qr<Ur.length;qr++){var e=Ur[qr],t=e.id;zr[t]=null,e.run()}Rr&&Or.devtools&&Rr.emit("flush"),C()}function k(e){var t=e.id;if(null==zr[t]){if(zr[t]=!0,Jr){for(var n=Ur.length-1;n>=0&&Ur[n].id>e.id;)n--;Ur.splice(Math.max(n,qr)+1,0,e)}else Ur.push(e);Vr||(Vr=!0,Ir(x))}}function A(e,t){var n,r;t||(t=Zr,t.clear());var i=Array.isArray(e),o=l(e);if((i||o)&&Object.isExtensible(e)){if(e.__ob__){var a=e.__ob__.dep.id;if(t.has(a))return;t.add(a)}if(i)for(n=e.length;n--;)A(e[n],t);else if(o)for(r=Object.keys(e),n=r.length;n--;)A(e[r[n]],t)}}function O(e,t){e.__proto__=t}function T(e,t,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];y(e,o,t[o])}}function S(e){if(l(e)){var t;return i(e,"__ob__")&&e.__ob__ instanceof ei?t=e.__ob__:Xr.shouldConvert&&!Or._isServer&&(Array.isArray(e)||f(e))&&Object.isExtensible(e)&&!e._isVue&&(t=new ei(e)),t}}function E(e,t,n,r){var i=new Fr,o=Object.getOwnPropertyDescriptor(e,t);if(!o||o.configurable!==!1){var a=o&&o.get,s=o&&o.set,c=S(n);Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var t=a?a.call(e):n;return Fr.target&&(i.depend(),c&&c.dep.depend(),Array.isArray(t)&&N(t)),t},set:function(t){var r=a?a.call(e):n;t!==r&&(s?s.call(e,t):n=t,c=S(t),i.notify())}})}}function j(e,t,n){if(Array.isArray(e))return e.splice(t,1,n),n;if(i(e,t))return void(e[t]=n);var r=e.__ob__;if(!(e._isVue||r&&r.vmCount))return r?(E(r.value,t,n),r.dep.notify(),n):void(e[t]=n)}function L(e,t){var n=e.__ob__;e._isVue||n&&n.vmCount||i(e,t)&&(delete e[t],n&&n.dep.notify())}function N(e){for(var t=void 0,n=0,r=e.length;n<r;n++)t=e[n],t&&t.__ob__&&t.__ob__.dep.depend(),Array.isArray(t)&&N(t)}function D(e){e._watchers=[],M(e),P(e),R(e),B(e),F(e)}function M(e){var t=e.$options.props;if(t){var n=e.$options.propsData||{},r=e.$options._propKeys=Object.keys(t),i=!e.$parent;Xr.shouldConvert=i;for(var o=function(i){var o=r[i];E(e,o,Le(o,t,n,e))},a=0;a<r.length;a++)o(a);Xr.shouldConvert=!0}}function P(e){var t=e.$options.data;t=e._data="function"==typeof t?t.call(e):t||{},f(t)||(t={});for(var n=Object.keys(t),r=e.$options.props,o=n.length;o--;)r&&i(r,n[o])||z(e,n[o]);S(t),t.__ob__&&t.__ob__.vmCount++}function R(e){var t=e.$options.computed;if(t)for(var n in t){var r=t[n];"function"==typeof r?(ti.get=I(r,e),ti.set=p):(ti.get=r.get?r.cache!==!1?I(r.get,e):s(r.get,e):p,ti.set=r.set?s(r.set,e):p),Object.defineProperty(e,n,ti)}}function I(e,t){var n=new Wr(t,e,p,{lazy:!0});return function(){return n.dirty&&n.evaluate(),Fr.target&&n.depend(),n.value}}function B(e){var t=e.$options.methods;if(t)for(var n in t)e[n]=null==t[n]?p:s(t[n],e)}function F(e){var t=e.$options.watch;if(t)for(var n in t){var r=t[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)H(e,n,r[i]);else H(e,n,r)}}function H(e,t,n){var r;f(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=e[n]),e.$watch(t,n,r)}function U(e){var t={};t.get=function(){return this._data},Object.defineProperty(e.prototype,"$data",t),e.prototype.$set=j,e.prototype.$delete=L,e.prototype.$watch=function(e,t,n){var r=this;n=n||{},n.user=!0;var i=new Wr(r,e,t,n);return n.immediate&&t.call(r,i.value),function(){i.teardown()}}}function z(e,t){g(t)||Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:function(){return e._data[t]},set:function(n){e._data[t]=n}})}function V(e){var t=new ni(e.tag,e.data,e.children,e.text,e.elm,e.ns,e.context,e.componentOptions);return t.isStatic=e.isStatic,t.key=e.key,t.isCloned=!0,t}function J(e){for(var t=new Array(e.length),n=0;n<e.length;n++)t[n]=V(e[n]);return t}function q(e,t,n){if(o(e))return[K(e)];if(Array.isArray(e)){for(var r=[],i=0,a=e.length;i<a;i++){var s=e[i],c=r[r.length-1];Array.isArray(s)?r.push.apply(r,q(s,t,i)):o(s)?c&&c.text?c.text+=String(s):""!==s&&r.push(K(s)):s instanceof ni&&(s.text&&c&&c.text?c.text+=s.text:(t&&W(s,t),s.tag&&null==s.key&&null!=n&&(s.key="__vlist_"+n+"_"+i+"__"),r.push(s)))}return r}}function K(e){return new ni(void 0,void 0,void 0,String(e))}function W(e,t){if(e.tag&&!e.ns&&(e.ns=t,e.children))for(var n=0,r=e.children.length;n<r;n++)W(e.children[n],t)}function Z(e){return e&&e.filter(function(e){return e&&e.componentOptions})[0]}function G(e,t,n,r){r+=t;var i=e.__injected||(e.__injected={});if(!i[r]){i[r]=!0;var o=e[t];o?e[t]=function(){o.apply(this,arguments),n.apply(this,arguments)}:e[t]=n}}function Y(e,t,n,r,i){var o,a,s,c,u,l;for(o in e)if(a=e[o],s=t[o],a)if(s){if(a!==s)if(Array.isArray(s)){s.length=a.length;for(var f=0;f<s.length;f++)s[f]=a[f];e[o]=s}else s.fn=a,e[o]=s}else l="!"===o.charAt(0),u=l?o.slice(1):o,Array.isArray(a)?n(u,a.invoker=Q(a),l):(a.invoker||(c=a,a=e[o]={},a.fn=c,a.invoker=X(a)),n(u,a.invoker,l));else;for(o in t)e[o]||(u="!"===o.charAt(0)?o.slice(1):o,r(u,t[o].invoker))}function Q(e){return function(t){for(var n=arguments,r=1===arguments.length,i=0;i<e.length;i++)r?e[i](t):e[i].apply(null,n)}}function X(e){return function(t){var n=1===arguments.length;n?e.fn(t):e.fn.apply(null,arguments)}}function ee(e){var t=e.$options,n=t.parent;if(n&&!t.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(e)}e.$parent=n,e.$root=n?n.$root:e,e.$children=[],e.$refs={},e._watcher=null,e._inactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}function te(e){e.prototype._mount=function(e,t){var n=this;return n.$el=e,n.$options.render||(n.$options.render=ri),ne(n,"beforeMount"),n._watcher=new Wr(n,function(){n._update(n._render(),t)},p),t=!1,null==n.$vnode&&(n._isMounted=!0,ne(n,"mounted")),n},e.prototype._update=function(e,t){var n=this;n._isMounted&&ne(n,"beforeUpdate");var r=n.$el,i=ii;ii=n;var o=n._vnode;n._vnode=e,o?n.$el=n.__patch__(o,e):n.$el=n.__patch__(n.$el,e,t),ii=i,r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el),n._isMounted&&ne(n,"updated")},e.prototype._updateFromParent=function(e,t,n,r){var i=this,o=!(!i.$options._renderChildren&&!r);if(i.$options._parentVnode=n,i.$options._renderChildren=r,e&&i.$options.props){Xr.shouldConvert=!1;for(var a=i.$options._propKeys||[],s=0;s<a.length;s++){var c=a[s];i[c]=Le(c,i.$options.props,e,i)}Xr.shouldConvert=!0}if(t){var u=i.$options._parentListeners;i.$options._parentListeners=t,i._updateListeners(t,u)}o&&(i.$slots=_e(r,i._renderContext),i.$forceUpdate())},e.prototype.$forceUpdate=function(){var e=this;e._watcher&&e._watcher.update()},e.prototype.$destroy=function(){var e=this;if(!e._isBeingDestroyed){ne(e,"beforeDestroy"),e._isBeingDestroyed=!0;var t=e.$parent;!t||t._isBeingDestroyed||e.$options.abstract||r(t.$children,e),e._watcher&&e._watcher.teardown();for(var n=e._watchers.length;n--;)e._watchers[n].teardown();e._data.__ob__&&e._data.__ob__.vmCount--,e._isDestroyed=!0,ne(e,"destroyed"),e.$off(),e.$el&&(e.$el.__vue__=null)}}}function ne(e,t){var n=e.$options[t];if(n)for(var r=0,i=n.length;r<i;r++)n[r].call(e);e.$emit("hook:"+t)}function re(e,t,n,r,i){if(e&&(l(e)&&(e=Ce.extend(e)),"function"==typeof e)){if(!e.cid)if(e.resolved)e=e.resolved;else if(e=le(e,function(){n.$forceUpdate()}),!e)return;t=t||{};var o=fe(t,e);if(e.options.functional)return ie(e,o,t,n,r);var a=t.on;t.on=t.nativeOn,e.options.abstract&&(t={}),pe(t);var s=e.options.name||i,c=new ni("vue-component-"+e.cid+(s?"-"+s:""),t,void 0,void 0,void 0,void 0,n,{Ctor:e,propsData:o,listeners:a,tag:i,children:r});return c}}function ie(e,t,n,r,i){var o={},a=e.options.props;if(a)for(var c in a)o[c]=Le(c,a,t);var u=e.options.render.call(null,s(he,{_self:Object.create(r)}),{props:o,data:n,parent:r,children:q(i),slots:function(){return _e(i,r)}});return u.functionalContext=r,n.slot&&((u.data||(u.data={})).slot=n.slot),u}function oe(e,t){var n=e.componentOptions,r={_isComponent:!0,parent:t,propsData:n.propsData,_componentTag:n.tag,_parentVnode:e,_parentListeners:n.listeners,_renderChildren:n.children},i=e.data.inlineTemplate;return i&&(r.render=i.render,r.staticRenderFns=i.staticRenderFns),new n.Ctor(r)}function ae(e,t){if(!e.child||e.child._isDestroyed){var n=e.child=oe(e,ii);n.$mount(t?e.elm:void 0,t)}}function se(e,t){var n=t.componentOptions,r=t.child=e.child;r._updateFromParent(n.propsData,n.listeners,t,n.children)}function ce(e){e.child._isMounted||(e.child._isMounted=!0,ne(e.child,"mounted")),e.data.keepAlive&&(e.child._inactive=!1,ne(e.child,"activated"))}function ue(e){e.child._isDestroyed||(e.data.keepAlive?(e.child._inactive=!0,ne(e.child,"deactivated")):e.child.$destroy())}function le(e,t){if(!e.requested){e.requested=!0;var n=e.pendingCallbacks=[t],r=!0,i=function(t){if(l(t)&&(t=Ce.extend(t)),e.resolved=t,!r)for(var i=0,o=n.length;i<o;i++)n[i](t)},o=function(e){},a=e(i,o);return a&&"function"==typeof a.then&&!e.resolved&&a.then(i,o),r=!1,e.resolved}e.pendingCallbacks.push(t)}function fe(e,t){var n=t.options.props;if(n){var r={},i=e.attrs,o=e.props,a=e.domProps;if(i||o||a)for(var s in n){var c=Cr(s);de(r,o,s,c,!0)||de(r,i,s,c)||de(r,a,s,c)}return r}}function de(e,t,n,r,o){if(t){if(i(t,n))return e[n]=t[n],o||delete t[n],!0;if(i(t,r))return e[n]=t[r],o||delete t[r],!0}return!1}function pe(e){e.hook||(e.hook={});for(var t=0;t<ai.length;t++){var n=ai[t],r=e.hook[n],i=oi[n];e.hook[n]=r?ve(i,r):i}}function ve(e,t){return function(n,r){e(n,r),t(n,r)}}function he(e,t,n){return t&&(Array.isArray(t)||"object"!=typeof t)&&(n=t,t=void 0),me(this._self,e,t,n)}function me(e,t,n,r){if(!n||!n.__ob__){if(!t)return ri();if("string"==typeof t){var i,o=Or.getTagNamespace(t);return Or.isReservedTag(t)?new ni(t,n,q(r,o),void 0,void 0,o,e):(i=je(e.$options,"components",t))?re(i,n,e,r,t):new ni(t,n,q(r,o),void 0,void 0,o,e)}return re(t,n,e,r)}}function ge(e){e.$vnode=null,e._vnode=null,e._staticTrees=null,e._renderContext=e.$options._parentVnode&&e.$options._parentVnode.context,e.$slots=_e(e.$options._renderChildren,e._renderContext),e.$createElement=s(he,e),e.$options.el&&e.$mount(e.$options.el)}function ye(n){n.prototype.$nextTick=function(e){Ir(e,this)},n.prototype._render=function(){var e=this,t=e.$options,n=t.render,r=t.staticRenderFns,i=t._parentVnode;if(e._isMounted)for(var o in e.$slots)e.$slots[o]=J(e.$slots[o]);r&&!e._staticTrees&&(e._staticTrees=[]),e.$vnode=i;var a;try{a=n.call(e._renderProxy,e.$createElement)}catch(t){if(Or.errorHandler)Or.errorHandler.call(null,t,e);else{if(Or._isServer)throw t;setTimeout(function(){throw t},0)}a=e._vnode}return a instanceof ni||(a=ri()),a.parent=i,a},n.prototype._h=he,n.prototype._s=e,n.prototype._n=t,n.prototype._e=ri,n.prototype._q=h,n.prototype._i=m,n.prototype._m=function(e,t){var n=this._staticTrees[e];if(n&&!t)return Array.isArray(n)?J(n):V(n);if(n=this._staticTrees[e]=this.$options.staticRenderFns[e].call(this._renderProxy),Array.isArray(n))for(var r=0;r<n.length;r++)"string"!=typeof n[r]&&(n[r].isStatic=!0,n[r].key="__static__"+e+"_"+r);else n.isStatic=!0,n.key="__static__"+e;return n};var r=function(e){return e};n.prototype._f=function(e){return je(this.$options,"filters",e,!0)||r},n.prototype._l=function(e,t){var n,r,i,o,a;if(Array.isArray(e))for(n=new Array(e.length),r=0,i=e.length;r<i;r++)n[r]=t(e[r],r);else if("number"==typeof e)for(n=new Array(e),r=0;r<e;r++)n[r]=t(r+1,r);else if(l(e))for(o=Object.keys(e),n=new Array(o.length),r=0,i=o.length;r<i;r++)a=o[r],n[r]=t(e[a],a,r);return n},n.prototype._t=function(e,t){var n=this.$slots[e];return n||t},n.prototype._b=function(e,t,n){if(t)if(l(t)){Array.isArray(t)&&(t=d(t));for(var r in t)if("class"===r||"style"===r)e[r]=t[r];else{var i=n||Or.mustUseProp(r)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={});i[r]=t[r]}}else;return e},n.prototype._k=function(e){return Or.keyCodes[e]}}function _e(e,t){var n={};if(!e)return n;for(var r,i,o=q(e)||[],a=[],s=0,c=o.length;s<c;s++)if(i=o[s],(i.context===t||i.functionalContext===t)&&i.data&&(r=i.data.slot)){var u=n[r]||(n[r]=[]);"template"===i.tag?u.push.apply(u,i.children):u.push(i)}else a.push(i);return a.length&&(1!==a.length||" "!==a[0].text&&!a[0].isComment)&&(n.default=a),n}function be(e){e._events=Object.create(null);var t=e.$options._parentListeners,n=s(e.$on,e),r=s(e.$off,e);e._updateListeners=function(t,i){Y(t,i||{},n,r,e)},t&&e._updateListeners(t)}function $e(e){e.prototype.$on=function(e,t){var n=this;return(n._events[e]||(n._events[e]=[])).push(t),n},e.prototype.$once=function(e,t){function n(){r.$off(e,n),t.apply(r,arguments)}var r=this;return n.fn=t,r.$on(e,n),r},e.prototype.$off=function(e,t){var n=this;if(!arguments.length)return n._events=Object.create(null),n;var r=n._events[e];if(!r)return n;if(1===arguments.length)return n._events[e]=null,n;for(var i,o=r.length;o--;)if(i=r[o],i===t||i.fn===t){r.splice(o,1);break}return n},e.prototype.$emit=function(e){var t=this,n=t._events[e];if(n){n=n.length>1?c(n):n;for(var r=c(arguments,1),i=0,o=n.length;i<o;i++)n[i].apply(t,r)}return t}}function we(e){function t(e,t){var r=e.$options=Object.create(n(e));r.parent=t.parent,r.propsData=t.propsData,r._parentVnode=t._parentVnode,r._parentListeners=t._parentListeners,r._renderChildren=t._renderChildren,r._componentTag=t._componentTag,t.render&&(r.render=t.render,r.staticRenderFns=t.staticRenderFns)}function n(e){var t=e.constructor,n=t.options;if(t.super){var r=t.super.options,i=t.superOptions;r!==i&&(t.superOptions=r,n=t.options=Ee(r,t.extendOptions),n.name&&(n.components[n.name]=t))}return n}e.prototype._init=function(e){var r=this;r._uid=si++,r._isVue=!0,e&&e._isComponent?t(r,e):r.$options=Ee(n(r),e||{},r),r._renderProxy=r,r._self=r,ee(r),be(r),ne(r,"beforeCreate"),D(r),ne(r,"created"),ge(r)}}function Ce(e){this._init(e)}function xe(e,t){var n,r,o;for(n in t)r=e[n],o=t[n],i(e,n)?l(r)&&l(o)&&xe(r,o):j(e,n,o);return e}function ke(e,t){return t?e?e.concat(t):Array.isArray(t)?t:[t]:e}function Ae(e,t){var n=Object.create(e||null);return t?u(n,t):n}function Oe(e){if(e.components){var t,n=e.components;for(var r in n){var i=r.toLowerCase();gr(i)||Or.isReservedTag(i)||(t=n[r],f(t)&&(n[r]=Ce.extend(t)))}}}function Te(e){var t=e.props;if(t){var n,r,i,o={};if(Array.isArray(t))for(n=t.length;n--;)r=t[n],"string"==typeof r&&(i=br(r),o[i]={type:null});else if(f(t))for(var a in t)r=t[a],i=br(a),o[i]=f(r)?r:{type:r};e.props=o}}function Se(e){var t=e.directives;if(t)for(var n in t){var r=t[n];"function"==typeof r&&(t[n]={bind:r,update:r})}}function Ee(e,t,n){function r(r){var i=li[r]||fi;l[r]=i(e[r],t[r],n,r)}Oe(t),Te(t),Se(t);var o=t.extends;if(o&&(e="function"==typeof o?Ee(e,o.options,n):Ee(e,o,n)),t.mixins)for(var a=0,s=t.mixins.length;a<s;a++){var c=t.mixins[a];c.prototype instanceof Ce&&(c=c.options),e=Ee(e,c,n)}var u,l={};for(u in e)r(u);for(u in t)i(e,u)||r(u);return l}function je(e,t,n,r){if("string"==typeof n){var i=e[t],o=i[n]||i[br(n)]||i[$r(br(n))];return o}}function Le(e,t,n,r){var o=t[e],a=!i(n,e),s=n[e];if(Me(o.type)&&(a&&!i(o,"default")?s=!1:""!==s&&s!==Cr(e)||(s=!0)),void 0===s){s=Ne(r,o,e);var c=Xr.shouldConvert;Xr.shouldConvert=!0,S(s),Xr.shouldConvert=c}return s}function Ne(e,t,n){if(i(t,"default")){var r=t.default;return l(r),"function"==typeof r&&t.type!==Function?r.call(e):r}}function De(e){var t=e&&e.toString().match(/^\s*function (\w+)/);return t&&t[1]}function Me(e){if(!Array.isArray(e))return"Boolean"===De(e);for(var t=0,n=e.length;t<n;t++)if("Boolean"===De(e[t]))return!0;return!1}function Pe(e){e.use=function(e){if(!e.installed){var t=c(arguments,1);return t.unshift(this),"function"==typeof e.install?e.install.apply(e,t):e.apply(null,t),e.installed=!0,this}}}function Re(e){e.mixin=function(t){e.options=Ee(e.options,t)}}function Ie(e){e.cid=0;var t=1;e.extend=function(e){e=e||{};var n=this,r=0===n.cid;if(r&&e._Ctor)return e._Ctor;var i=e.name||n.options.name,o=function(e){this._init(e)};return o.prototype=Object.create(n.prototype),o.prototype.constructor=o,o.cid=t++,o.options=Ee(n.options,e),o.super=n,o.extend=n.extend,Or._assetTypes.forEach(function(e){o[e]=n[e]}),i&&(o.options.components[i]=o),o.superOptions=n.options,o.extendOptions=e,r&&(e._Ctor=o),o}}function Be(e){Or._assetTypes.forEach(function(t){e[t]=function(n,r){return r?("component"===t&&f(r)&&(r.name=r.name||n,r=e.extend(r)),"directive"===t&&"function"==typeof r&&(r={bind:r,update:r}),this.options[t+"s"][n]=r,r):this.options[t+"s"][n]}})}function Fe(e){var t={};t.get=function(){return Or},Object.defineProperty(e,"config",t),e.util=di,e.set=j,e.delete=L,e.nextTick=Ir,e.options=Object.create(null),Or._assetTypes.forEach(function(t){e.options[t+"s"]=Object.create(null)}),u(e.options.components,vi),Pe(e),Re(e),Ie(e),Be(e)}function He(e){for(var t=e.data,n=e,r=e;r.child;)r=r.child._vnode,r.data&&(t=Ue(r.data,t));for(;n=n.parent;)n.data&&(t=Ue(t,n.data));return ze(t)}function Ue(e,t){return{staticClass:Ve(e.staticClass,t.staticClass),class:e.class?[e.class,t.class]:t.class}}function ze(e){var t=e.class,n=e.staticClass;return n||t?Ve(n,Je(t)):""}function Ve(e,t){return e?t?e+" "+t:e:t||""}function Je(e){var t="";if(!e)return t;if("string"==typeof e)return e;if(Array.isArray(e)){for(var n,r=0,i=e.length;r<i;r++)e[r]&&(n=Je(e[r]))&&(t+=n+" ");return t.slice(0,-1)}if(l(e)){for(var o in e)e[o]&&(t+=o+" ");return t.slice(0,-1)}return t}function qe(e){return Ti(e)?"svg":"math"===e?"math":void 0}function Ke(e){if(!Er)return!0;if(Ei(e))return!1;if(e=e.toLowerCase(),null!=ji[e])return ji[e];var t=document.createElement(e);return e.indexOf("-")>-1?ji[e]=t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:ji[e]=/HTMLUnknownElement/.test(t.toString())}function We(e){if("string"==typeof e){if(e=document.querySelector(e),!e)return document.createElement("div")}return e}function Ze(e,t){var n=document.createElement(e);return"select"!==e?n:(t.data&&t.data.attrs&&"multiple"in t.data.attrs&&n.setAttribute("multiple","multiple"),n)}function Ge(e,t){return document.createElementNS(Ci[e],t)}function Ye(e){return document.createTextNode(e)}function Qe(e){return document.createComment(e)}function Xe(e,t,n){e.insertBefore(t,n)}function et(e,t){e.removeChild(t)}function tt(e,t){e.appendChild(t)}function nt(e){return e.parentNode}function rt(e){return e.nextSibling}function it(e){return e.tagName}function ot(e,t){e.textContent=t}function at(e){return e.childNodes}function st(e,t,n){e.setAttribute(t,n)}function ct(e,t){var n=e.data.ref;if(n){var i=e.context,o=e.child||e.elm,a=i.$refs;t?Array.isArray(a[n])?r(a[n],o):a[n]===o&&(a[n]=void 0):e.data.refInFor?Array.isArray(a[n])?a[n].push(o):a[n]=[o]:a[n]=o}}function ut(e){return null==e}function lt(e){return null!=e}function ft(e,t){return e.key===t.key&&e.tag===t.tag&&e.isComment===t.isComment&&!e.data==!t.data}function dt(e,t,n){var r,i,o={};for(r=t;r<=n;++r)i=e[r].key,lt(i)&&(o[i]=r);return o}function pt(e){function t(e){return new ni(C.tagName(e).toLowerCase(),{},[],void 0,e)}function n(e,t){function n(){0===--n.listeners&&r(e)}return n.listeners=t,n}function r(e){var t=C.parentNode(e);C.removeChild(t,e)}function i(e,t,n){var r,i=e.data;if(e.isRootInsert=!n,lt(i)&&(lt(r=i.hook)&&lt(r=r.init)&&r(e),lt(r=e.child)))return u(e,t),e.elm;var o=e.children,s=e.tag;return lt(s)?(e.elm=e.ns?C.createElementNS(e.ns,s):C.createElement(s,e),l(e),a(e,o,t),lt(i)&&c(e,t)):e.isComment?e.elm=C.createComment(e.text):e.elm=C.createTextNode(e.text),e.elm}function a(e,t,n){if(Array.isArray(t))for(var r=0;r<t.length;++r)C.appendChild(e.elm,i(t[r],n,!0));else o(e.text)&&C.appendChild(e.elm,C.createTextNode(e.text))}function s(e){for(;e.child;)e=e.child._vnode;return lt(e.tag)}function c(e,t){for(var n=0;n<$.create.length;++n)$.create[n](Di,e);_=e.data.hook,lt(_)&&(_.create&&_.create(Di,e),_.insert&&t.push(e))}function u(e,t){e.data.pendingInsert&&t.push.apply(t,e.data.pendingInsert),e.elm=e.child.$el,s(e)?(c(e,t),l(e)):(ct(e),t.push(e))}function l(e){var t;lt(t=e.context)&&lt(t=t.$options._scopeId)&&C.setAttribute(e.elm,t,""),lt(t=ii)&&t!==e.context&&lt(t=t.$options._scopeId)&&C.setAttribute(e.elm,t,"")}function f(e,t,n,r,o,a){for(;r<=o;++r)C.insertBefore(e,i(n[r],a),t)}function d(e){var t,n,r=e.data;if(lt(r))for(lt(t=r.hook)&&lt(t=t.destroy)&&t(e),t=0;t<$.destroy.length;++t)$.destroy[t](e);if(!lt(t=e.child)||r.keepAlive&&!e.context._isBeingDestroyed||d(t._vnode),lt(t=e.children))for(n=0;n<e.children.length;++n)d(e.children[n])}function p(e,t,n,r){for(;n<=r;++n){var i=t[n];lt(i)&&(lt(i.tag)?(v(i),d(i)):C.removeChild(e,i.elm))}}function v(e,t){if(t||lt(e.data)){var i=$.remove.length+1;for(t?t.listeners+=i:t=n(e.elm,i),lt(_=e.child)&&lt(_=_._vnode)&&lt(_.data)&&v(_,t),_=0;_<$.remove.length;++_)$.remove[_](e,t);lt(_=e.data.hook)&&lt(_=_.remove)?_(e,t):t()}else r(e.elm)}function h(e,t,n,r,o){for(var a,s,c,u,l=0,d=0,v=t.length-1,h=t[0],g=t[v],y=n.length-1,_=n[0],b=n[y],$=!o;l<=v&&d<=y;)ut(h)?h=t[++l]:ut(g)?g=t[--v]:ft(h,_)?(m(h,_,r),h=t[++l],_=n[++d]):ft(g,b)?(m(g,b,r),g=t[--v],b=n[--y]):ft(h,b)?(m(h,b,r),$&&C.insertBefore(e,h.elm,C.nextSibling(g.elm)),h=t[++l],b=n[--y]):ft(g,_)?(m(g,_,r),$&&C.insertBefore(e,g.elm,h.elm),g=t[--v],_=n[++d]):(ut(a)&&(a=dt(t,l,v)),s=lt(_.key)?a[_.key]:null,ut(s)?(C.insertBefore(e,i(_,r),h.elm),_=n[++d]):(c=t[s],c.tag!==_.tag?(C.insertBefore(e,i(_,r),h.elm),_=n[++d]):(m(c,_,r),t[s]=void 0,$&&C.insertBefore(e,_.elm,h.elm),_=n[++d])));l>v?(u=ut(n[y+1])?null:n[y+1].elm,f(e,u,n,d,y,r)):d>y&&p(e,t,l,v)}function m(e,t,n,r){if(e!==t){if(t.isStatic&&e.isStatic&&t.key===e.key&&t.isCloned)return void(t.elm=e.elm);var i,o=t.data,a=lt(o);a&&lt(i=o.hook)&&lt(i=i.prepatch)&&i(e,t);var c=t.elm=e.elm,u=e.children,l=t.children;if(a&&s(t)){for(i=0;i<$.update.length;++i)$.update[i](e,t);lt(i=o.hook)&&lt(i=i.update)&&i(e,t)}ut(t.text)?lt(u)&&lt(l)?u!==l&&h(c,u,l,n,r):lt(l)?(lt(e.text)&&C.setTextContent(c,""),f(c,null,l,0,l.length-1,n)):lt(u)?p(c,u,0,u.length-1):lt(e.text)&&C.setTextContent(c,""):e.text!==t.text&&C.setTextContent(c,t.text),a&&lt(i=o.hook)&&lt(i=i.postpatch)&&i(e,t)}}function g(e,t,n){if(n&&e.parent)e.parent.data.pendingInsert=t;else for(var r=0;r<t.length;++r)t[r].data.hook.insert(t[r])}function y(e,t,n){t.elm=e;var r=t.tag,i=t.data,o=t.children;if(lt(i)&&(lt(_=i.hook)&&lt(_=_.init)&&_(t,!0),lt(_=t.child)))return u(t,n),!0;if(lt(r)){if(lt(o)){var s=C.childNodes(e);if(s.length){var l=!0;if(s.length!==o.length)l=!1;else for(var f=0;f<o.length;f++)if(!y(s[f],o[f],n)){l=!1;break}if(!l)return!1}else a(t,o,n)}lt(i)&&c(t,n)}return!0}var _,b,$={},w=e.modules,C=e.nodeOps;for(_=0;_<Mi.length;++_)for($[Mi[_]]=[],b=0;b<w.length;++b)void 0!==w[b][Mi[_]]&&$[Mi[_]].push(w[b][Mi[_]]);return function(e,n,r,o){var a,c,u=!1,l=[];if(e){var f=lt(e.nodeType);if(!f&&ft(e,n))m(e,n,l,o);else{if(f){if(1===e.nodeType&&e.hasAttribute("server-rendered")&&(e.removeAttribute("server-rendered"),r=!0),r&&y(e,n,l))return g(n,l,!0),e;e=t(e)}if(a=e.elm,c=C.parentNode(a),i(n,l),n.parent&&(n.parent.elm=n.elm,s(n)))for(var v=0;v<$.create.length;++v)$.create[v](Di,n.parent);null!==c?(C.insertBefore(c,n.elm,C.nextSibling(a)),p(c,[e],0,0)):lt(e.tag)&&d(e)}}else u=!0,i(n,l);return g(n,l,u),n.elm}}function vt(e,t){if(e.data.directives||t.data.directives){var n,r,i,o=e===Di,a=ht(e.data.directives,e.context),s=ht(t.data.directives,t.context),c=[],u=[];for(n in s)r=a[n],i=s[n],r?(i.oldValue=r.value,gt(i,"update",t,e),i.def&&i.def.componentUpdated&&u.push(i)):(gt(i,"bind",t,e),i.def&&i.def.inserted&&c.push(i));if(c.length){var l=function(){c.forEach(function(n){gt(n,"inserted",t,e)})};o?G(t.data.hook||(t.data.hook={}),"insert",l,"dir-insert"):l()}if(u.length&&G(t.data.hook||(t.data.hook={}),"postpatch",function(){u.forEach(function(n){gt(n,"componentUpdated",t,e)})},"dir-postpatch"),!o)for(n in a)s[n]||gt(a[n],"unbind",e)}}function ht(e,t){var n=Object.create(null);if(!e)return n;var r,i;for(r=0;r<e.length;r++)i=e[r],n[mt(i)]=i,i.modifiers||(i.modifiers=Ri),i.def=je(t.$options,"directives",i.name,!0);return n}function mt(e){return e.rawName||e.name+(e.modifiers?"."+Object.keys(e.modifiers).join("."):"")}function gt(e,t,n,r){var i=e.def&&e.def[t];i&&i(n.elm,e,n,r)}function yt(e,t){if(e.data.attrs||t.data.attrs){var n,r,i,o=t.elm,a=e.data.attrs||{},s=t.data.attrs||{};s.__ob__&&(s=t.data.attrs=u({},s));for(n in s)r=s[n],i=a[n],i!==r&&_t(o,n,r);for(n in a)null==s[n]&&(bi(n)?o.removeAttributeNS(_i,$i(n)):gi(n)||o.removeAttribute(n))}}function _t(e,t,n){yi(t)?wi(n)?e.removeAttribute(t):e.setAttribute(t,t):gi(t)?e.setAttribute(t,wi(n)||"false"===n?"false":"true"):bi(t)?wi(n)?e.removeAttributeNS(_i,$i(t)):e.setAttributeNS(_i,t,n):wi(n)?e.removeAttribute(t):e.setAttribute(t,n)}function bt(e,t){var n=t.elm,r=t.data,i=e.data;if(r.staticClass||r.class||i&&(i.staticClass||i.class)){var o=He(t),a=n._transitionClasses;a&&(o=Ve(o,Je(a))),o!==n._prevClass&&(n.setAttribute("class",o),n._prevClass=o)}}function $t(e,t){if(e.data.on||t.data.on){var n=t.data.on||{},r=e.data.on||{},i=t.elm._v_add||(t.elm._v_add=function(e,n,r){t.elm.addEventListener(e,n,r)}),o=t.elm._v_remove||(t.elm._v_remove=function(e,n){t.elm.removeEventListener(e,n)});Y(n,r,i,o,t.context)}}function wt(e,t){if(e.data.domProps||t.data.domProps){var n,r,i=t.elm,o=e.data.domProps||{},a=t.data.domProps||{};a.__ob__&&(a=t.data.domProps=u({},a));for(n in o)null==a[n]&&(i[n]=void 0);for(n in a)if("textContent"!==n&&"innerHTML"!==n||!t.children||(t.children.length=0),r=a[n],"value"===n){i._value=r;var s=null==r?"":String(r);i.value===s||i.composing||(i.value=s)}else i[n]=r}}function Ct(e,t){if(e.data&&e.data.style||t.data.style){var n,r,i=t.elm,o=e.data.style||{},a=t.data.style||{};if("string"==typeof a)return void(i.style.cssText=a);var s=a.__ob__;Array.isArray(a)&&(a=t.data.style=d(a)),s&&(a=t.data.style=u({},a));for(r in o)null==a[r]&&(i.style[Vi(r)]="");for(r in a)n=a[r],n!==o[r]&&(i.style[Vi(r)]=null==n?"":n)}}function xt(e,t){if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.add(t)}):e.classList.add(t);else{var n=" "+e.getAttribute("class")+" ";n.indexOf(" "+t+" ")<0&&e.setAttribute("class",(n+t).trim())}}function kt(e,t){if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.remove(t)}):e.classList.remove(t);else{for(var n=" "+e.getAttribute("class")+" ",r=" "+t+" ";n.indexOf(r)>=0;)n=n.replace(r," ");e.setAttribute("class",n.trim())}}function At(e){Xi(function(){Xi(e)})}function Ot(e,t){(e._transitionClasses||(e._transitionClasses=[])).push(t),xt(e,t)}function Tt(e,t){e._transitionClasses&&r(e._transitionClasses,t),kt(e,t)}function St(e,t,n){var r=Et(e,t),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===Ki?Gi:Qi,c=0,u=function(){e.removeEventListener(s,l),n()},l=function(t){t.target===e&&++c>=a&&u()};setTimeout(function(){c<a&&u()},o+1),e.addEventListener(s,l)}function Et(e,t){var n,r=window.getComputedStyle(e),i=r[Zi+"Delay"].split(", "),o=r[Zi+"Duration"].split(", "),a=jt(i,o),s=r[Yi+"Delay"].split(", "),c=r[Yi+"Duration"].split(", "),u=jt(s,c),l=0,f=0;t===Ki?a>0&&(n=Ki,l=a,f=o.length):t===Wi?u>0&&(n=Wi,l=u,f=c.length):(l=Math.max(a,u),n=l>0?a>u?Ki:Wi:null,f=n?n===Ki?o.length:c.length:0);var d=n===Ki&&eo.test(r[Zi+"Property"]);return{type:n,timeout:l,propCount:f,hasTransform:d}}function jt(e,t){return Math.max.apply(null,t.map(function(t,n){return Lt(t)+Lt(e[n])}))}function Lt(e){return 1e3*Number(e.slice(0,-1))}function Nt(e){var t=e.elm;t._leaveCb&&(t._leaveCb.cancelled=!0,t._leaveCb());var n=Mt(e.data.transition);if(n&&!t._enterCb&&1===t.nodeType){var r=n.css,i=n.type,o=n.enterClass,a=n.enterActiveClass,s=n.appearClass,c=n.appearActiveClass,u=n.beforeEnter,l=n.enter,f=n.afterEnter,d=n.enterCancelled,p=n.beforeAppear,v=n.appear,h=n.afterAppear,m=n.appearCancelled,g=ii.$vnode,y=g&&g.parent?g.parent.context:ii,_=!y._isMounted||!e.isRootInsert;if(!_||v||""===v){var b=_?s:o,$=_?c:a,w=_?p||u:u,C=_&&"function"==typeof v?v:l,x=_?h||f:f,k=_?m||d:d,A=r!==!1&&!Nr,O=C&&(C._length||C.length)>1,T=t._enterCb=Pt(function(){A&&Tt(t,$),T.cancelled?(A&&Tt(t,b),k&&k(t)):x&&x(t),t._enterCb=null});e.data.show||G(e.data.hook||(e.data.hook={}),"insert",function(){var n=t.parentNode,r=n&&n._pending&&n._pending[e.key];r&&r.tag===e.tag&&r.elm._leaveCb&&r.elm._leaveCb(),C&&C(t,T)},"transition-insert"),w&&w(t),A&&(Ot(t,b),Ot(t,$),At(function(){Tt(t,b),T.cancelled||O||St(t,i,T)})),e.data.show&&C&&C(t,T),A||O||T()}}}function Dt(e,t){function n(){m.cancelled||(e.data.show||((r.parentNode._pending||(r.parentNode._pending={}))[e.key]=e),u&&u(r),v&&(Ot(r,s),Ot(r,c),At(function(){Tt(r,s),m.cancelled||h||St(r,a,m)})),l&&l(r,m),v||h||m())}var r=e.elm;r._enterCb&&(r._enterCb.cancelled=!0,r._enterCb());var i=Mt(e.data.transition);if(!i)return t();if(!r._leaveCb&&1===r.nodeType){var o=i.css,a=i.type,s=i.leaveClass,c=i.leaveActiveClass,u=i.beforeLeave,l=i.leave,f=i.afterLeave,d=i.leaveCancelled,p=i.delayLeave,v=o!==!1&&!Nr,h=l&&(l._length||l.length)>1,m=r._leaveCb=Pt(function(){r.parentNode&&r.parentNode._pending&&(r.parentNode._pending[e.key]=null),v&&Tt(r,c),m.cancelled?(v&&Tt(r,s),d&&d(r)):(t(),f&&f(r)),r._leaveCb=null});p?p(n):n()}}function Mt(e){if(e){if("object"==typeof e){var t={};return e.css!==!1&&u(t,to(e.name||"v")),u(t,e),t}return"string"==typeof e?to(e):void 0}}function Pt(e){var t=!1;return function(){t||(t=!0,e())}}function Rt(e,t,n){var r=t.value,i=e.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=e.options.length;s<c;s++)if(a=e.options[s],i)o=m(r,Bt(a))>-1,a.selected!==o&&(a.selected=o);else if(h(Bt(a),r))return void(e.selectedIndex!==s&&(e.selectedIndex=s));i||(e.selectedIndex=-1)}}function It(e,t){for(var n=0,r=t.length;n<r;n++)if(h(Bt(t[n]),e))return!1;return!0}function Bt(e){return"_value"in e?e._value:e.value}function Ft(e){e.target.composing=!0}function Ht(e){e.target.composing=!1,Ut(e.target,"input")}function Ut(e,t){var n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}function zt(e){return!e.child||e.data&&e.data.transition?e:zt(e.child._vnode)}function Vt(e){var t=e&&e.componentOptions;return t&&t.Ctor.options.abstract?Vt(Z(t.children)):e}function Jt(e){var t={},n=e.$options;for(var r in n.propsData)t[r]=e[r];var i=n._parentListeners;for(var o in i)t[br(o)]=i[o].fn;return t}function qt(e,t){return/\d-keep-alive$/.test(t.tag)?e("keep-alive"):null}function Kt(e){for(;e=e.parent;)if(e.data.transition)return!0}function Wt(e){e.elm._moveCb&&e.elm._moveCb(),e.elm._enterCb&&e.elm._enterCb();
}function Zt(e){e.data.newPos=e.elm.getBoundingClientRect()}function Gt(e){var t=e.data.pos,n=e.data.newPos,r=t.left-n.left,i=t.top-n.top;if(r||i){e.data.moved=!0;var o=e.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}function Yt(e,t){var n=document.createElement("div");return n.innerHTML='<div a="'+e+'">',n.innerHTML.indexOf(t)>0}function Qt(e){return go.innerHTML=e,go.textContent}function Xt(e,t,n){return t&&(e=e.replace(Wo,"<").replace(Zo,">")),n&&(e=e.replace(Go,"\n")),e.replace(Yo,"&").replace(Qo,'"')}function en(e,t){function n(t){d+=t,e=e.substring(t)}function r(){var t=e.match(xo);if(t){var r={tagName:t[1],attrs:[],start:d};n(t[0].length);for(var i,o;!(i=e.match(ko))&&(o=e.match($o));)n(o[0].length),r.attrs.push(o);if(i)return r.unarySlash=i[1],n(i[0].length),r.end=d,r}}function i(e){var n=e.tagName,r=e.unarySlash;u&&("p"===s&&Oi(n)&&o("",s),Ai(n)&&s===n&&o("",n));for(var i=l(n)||"html"===n&&"head"===s||!!r,a=e.attrs.length,d=new Array(a),p=0;p<a;p++){var v=e.attrs[p];To&&v[0].indexOf('""')===-1&&(""===v[3]&&delete v[3],""===v[4]&&delete v[4],""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"";d[p]={name:v[1],value:f?Xt(h,t.shouldDecodeTags,t.shouldDecodeNewlines):h}}i||(c.push({tag:n,attrs:d}),s=n,r=""),t.start&&t.start(n,d,i,e.start,e.end)}function o(e,n,r,i){var o;if(null==r&&(r=d),null==i&&(i=d),n){var a=n.toLowerCase();for(o=c.length-1;o>=0&&c[o].tag.toLowerCase()!==a;o--);}else o=0;if(o>=0){for(var u=c.length-1;u>=o;u--)t.end&&t.end(c[u].tag,r,i);c.length=o,s=o&&c[o-1].tag}else"br"===n.toLowerCase()?t.start&&t.start(n,[],!0,r,i):"p"===n.toLowerCase()&&(t.start&&t.start(n,[],!1,r,i),t.end&&t.end(n,r,i))}for(var a,s,c=[],u=t.expectHTML,l=t.isUnaryTag||Ar,f=t.isFromDOM,d=0;e;){if(a=e,s&&qo(s)){var p=s.toLowerCase(),v=Ko[p]||(Ko[p]=new RegExp("([\\s\\S]*?)(</"+p+"[^>]*>)","i")),h=0,m=e.replace(v,function(e,n,r){return h=r.length,"script"!==p&&"style"!==p&&"noscript"!==p&&(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")),t.chars&&t.chars(n),""});d+=e.length-m.length,e=m,o("</"+p+">",p,d-h,d)}else{var g=e.indexOf("<");if(0===g){if(/^<!--/.test(e)){var y=e.indexOf("-->");if(y>=0){n(y+3);continue}}if(/^<!\[/.test(e)){var _=e.indexOf("]>");if(_>=0){n(_+2);continue}}var b=e.match(Oo);if(b){n(b[0].length);continue}var $=e.match(Ao);if($){var w=d;n($[0].length),o($[0],$[1],w,d);continue}var C=r();if(C){i(C);continue}}var x=void 0;g>=0?(x=e.substring(0,g),n(g)):(x=e,e=""),t.chars&&t.chars(x)}if(e===a)throw new Error("Error parsing template:\n\n"+e)}o()}function tn(e){function t(){(a||(a=[])).push(e.slice(d,i).trim()),d=i+1}var n,r,i,o,a,s=!1,c=!1,u=0,l=0,f=0,d=0;for(i=0;i<e.length;i++)if(r=n,n=e.charCodeAt(i),s)39===n&&92!==r&&(s=!s);else if(c)34===n&&92!==r&&(c=!c);else if(124!==n||124===e.charCodeAt(i+1)||124===e.charCodeAt(i-1)||u||l||f)switch(n){case 34:c=!0;break;case 39:s=!0;break;case 40:f++;break;case 41:f--;break;case 91:l++;break;case 93:l--;break;case 123:u++;break;case 125:u--}else void 0===o?(d=i+1,o=e.slice(0,i).trim()):t();if(void 0===o?o=e.slice(0,i).trim():0!==d&&t(),a)for(i=0;i<a.length;i++)o=nn(o,a[i]);return o}function nn(e,t){var n=t.indexOf("(");if(n<0)return'_f("'+t+'")('+e+")";var r=t.slice(0,n),i=t.slice(n+1);return'_f("'+r+'")('+e+","+i}function rn(e,t){var n=t?ta(t):Xo;if(n.test(e)){for(var r,i,o=[],a=n.lastIndex=0;r=n.exec(e);){i=r.index,i>a&&o.push(JSON.stringify(e.slice(a,i)));var s=tn(r[1].trim());o.push("_s("+s+")"),a=i+r[0].length}return a<e.length&&o.push(JSON.stringify(e.slice(a))),o.join("+")}}function on(e){console.error("[Vue parser]: "+e)}function an(e,t){return e?e.map(function(e){return e[t]}).filter(function(e){return e}):[]}function sn(e,t,n){(e.props||(e.props=[])).push({name:t,value:n})}function cn(e,t,n){(e.attrs||(e.attrs=[])).push({name:t,value:n})}function un(e,t,n,r,i,o){(e.directives||(e.directives=[])).push({name:t,rawName:n,value:r,arg:i,modifiers:o})}function ln(e,t,n,r,i){r&&r.capture&&(delete r.capture,t="!"+t);var o;r&&r.native?(delete r.native,o=e.nativeEvents||(e.nativeEvents={})):o=e.events||(e.events={});var a={value:n,modifiers:r},s=o[t];Array.isArray(s)?i?s.unshift(a):s.push(a):s?o[t]=i?[a,s]:[s,a]:o[t]=a}function fn(e,t,n){var r=dn(e,":"+t)||dn(e,"v-bind:"+t);if(null!=r)return r;if(n!==!1){var i=dn(e,t);if(null!=i)return JSON.stringify(i)}}function dn(e,t){var n;if(null!=(n=e.attrsMap[t]))for(var r=e.attrsList,i=0,o=r.length;i<o;i++)if(r[i].name===t){r.splice(i,1);break}return n}function pn(e,t){So=t.warn||on,Eo=t.getTagNamespace||Ar,jo=t.mustUseProp||Ar,Lo=t.isPreTag||Ar,No=an(t.modules,"preTransformNode"),Do=an(t.modules,"transformNode"),Mo=an(t.modules,"postTransformNode"),Po=t.delimiters;var n,r,i=[],o=t.preserveWhitespace!==!1,a=!1,s=!1;return en(e,{expectHTML:t.expectHTML,isUnaryTag:t.isUnaryTag,isFromDOM:t.isFromDOM,shouldDecodeTags:t.shouldDecodeTags,shouldDecodeNewlines:t.shouldDecodeNewlines,start:function(e,o,c){function u(e){}var l=r&&r.ns||Eo(e);t.isIE&&"svg"===l&&(o=En(o));var f={type:1,tag:e,attrsList:o,attrsMap:On(o),parent:r,children:[]};l&&(f.ns=l),Sn(f)&&(f.forbidden=!0);for(var d=0;d<No.length;d++)No[d](f,t);if(a||(vn(f),f.pre&&(a=!0)),Lo(f.tag)&&(s=!0),a)hn(f);else{yn(f),_n(f),$n(f),mn(f),f.plain=!f.key&&!o.length,gn(f),wn(f),Cn(f);for(var p=0;p<Do.length;p++)Do[p](f,t);xn(f)}n||(n=f,u(n)),r&&!f.forbidden&&(f.else?bn(f,r):(r.children.push(f),f.parent=r)),c||(r=f,i.push(f));for(var v=0;v<Mo.length;v++)Mo[v](f,t)},end:function(){var e=i[i.length-1],t=e.children[e.children.length-1];t&&3===t.type&&" "===t.text&&e.children.pop(),i.length-=1,r=i[i.length-1],e.pre&&(a=!1),Lo(e.tag)&&(s=!1)},chars:function(e){if(r&&(e=s||e.trim()?la(e):o&&r.children.length?" ":"")){var t;!a&&" "!==e&&(t=rn(e,Po))?r.children.push({type:2,expression:t,text:e}):(e=e.replace(ua,""),r.children.push({type:3,text:e}))}}}),n}function vn(e){null!=dn(e,"v-pre")&&(e.pre=!0)}function hn(e){var t=e.attrsList.length;if(t)for(var n=e.attrs=new Array(t),r=0;r<t;r++)n[r]={name:e.attrsList[r].name,value:JSON.stringify(e.attrsList[r].value)};else e.pre||(e.plain=!0)}function mn(e){var t=fn(e,"key");t&&(e.key=t)}function gn(e){var t=fn(e,"ref");t&&(e.ref=t,e.refInFor=kn(e))}function yn(e){var t;if(t=dn(e,"v-for")){var n=t.match(ra);if(!n)return;e.for=n[2].trim();var r=n[1].trim(),i=r.match(ia);i?(e.alias=i[1].trim(),e.iterator1=i[2].trim(),i[3]&&(e.iterator2=i[3].trim())):e.alias=r}}function _n(e){var t=dn(e,"v-if");t&&(e.if=t),null!=dn(e,"v-else")&&(e.else=!0)}function bn(e,t){var n=Tn(t.children);n&&n.if&&(n.elseBlock=e)}function $n(e){var t=dn(e,"v-once");null!=t&&(e.once=!0)}function wn(e){if("slot"===e.tag)e.slotName=fn(e,"name");else{var t=fn(e,"slot");t&&(e.slotTarget=t)}}function Cn(e){var t;(t=fn(e,"is"))&&(e.component=t),null!=dn(e,"inline-template")&&(e.inlineTemplate=!0)}function xn(e){var t,n,r,i,o,a,s,c,u=e.attrsList;for(t=0,n=u.length;t<n;t++)if(r=i=u[t].name,o=u[t].value,na.test(r))if(e.hasBindings=!0,s=An(r),s&&(r=r.replace(ca,"")),oa.test(r))r=r.replace(oa,""),s&&s.prop&&(c=!0,r=br(r),"innerHtml"===r&&(r="innerHTML")),c||jo(r)?sn(e,r,o):cn(e,r,o);else if(aa.test(r))r=r.replace(aa,""),ln(e,r,o,s);else{r=r.replace(na,"");var l=r.match(sa);l&&(a=l[1])&&(r=r.slice(0,-(a.length+1))),un(e,r,i,o,a,s)}else cn(e,r,JSON.stringify(o))}function kn(e){for(var t=e;t;){if(void 0!==t.for)return!0;t=t.parent}return!1}function An(e){var t=e.match(ca);if(t){var n={};return t.forEach(function(e){n[e.slice(1)]=!0}),n}}function On(e){for(var t={},n=0,r=e.length;n<r;n++)t[e[n].name]=e[n].value;return t}function Tn(e){for(var t=e.length;t--;)if(e[t].tag)return e[t]}function Sn(e){return"style"===e.tag||"script"===e.tag&&(!e.attrsMap.type||"text/javascript"===e.attrsMap.type)}function En(e){for(var t=[],n=0;n<e.length;n++){var r=e[n];fa.test(r.name)||(r.name=r.name.replace(da,""),t.push(r))}return t}function jn(e,t){e&&(Ro=pa(t.staticKeys||""),Io=t.isReservedTag||function(){return!1},Nn(e),Dn(e,!1))}function Ln(e){return n("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(e?","+e:""))}function Nn(e){if(e.static=Mn(e),1===e.type)for(var t=0,n=e.children.length;t<n;t++){var r=e.children[t];Nn(r),r.static||(e.static=!1)}}function Dn(e,t){if(1===e.type){if(e.once||e.static)return e.staticRoot=!0,void(e.staticInFor=t);if(e.children)for(var n=0,r=e.children.length;n<r;n++)Dn(e.children[n],!!e.for)}}function Mn(e){return 2!==e.type&&(3===e.type||!(!e.pre&&(e.hasBindings||e.if||e.for||gr(e.tag)||!Io(e.tag)||!Object.keys(e).every(Ro))))}function Pn(e,t){var n=t?"nativeOn:{":"on:{";for(var r in e)n+='"'+r+'":'+Rn(e[r])+",";return n.slice(0,-1)+"}"}function Rn(e){if(e){if(Array.isArray(e))return"["+e.map(Rn).join(",")+"]";if(e.modifiers){var t="",n=[];for(var r in e.modifiers)ma[r]?t+=ma[r]:n.push(r);n.length&&(t=In(n)+t);var i=va.test(e.value)?e.value+"($event)":e.value;return"function($event){"+t+i+"}"}return va.test(e.value)?e.value:"function($event){"+e.value+"}"}return"function(){}"}function In(e){var t=1===e.length?Bn(e[0]):Array.prototype.concat.apply([],e.map(Bn));return Array.isArray(t)?"if("+t.map(function(e){return"$event.keyCode!=="+e}).join("&&")+")return;":"if($event.keyCode!=="+t+")return;"}function Bn(e){return parseInt(e,10)||ha[e]||"_k("+JSON.stringify(e)+")"}function Fn(e,t){e.wrapData=function(e){return"_b("+e+","+t.value+(t.modifiers&&t.modifiers.prop?",true":"")+")"}}function Hn(e,t){var n=zo,r=zo=[];Vo=t,Bo=t.warn||on,Fo=an(t.modules,"transformCode"),Ho=an(t.modules,"genData"),Uo=t.directives||{};var i=e?Un(e):'_h("div")';return zo=n,{render:"with(this){return "+i+"}",staticRenderFns:r}}function Un(e){if(e.staticRoot&&!e.staticProcessed)return e.staticProcessed=!0,zo.push("with(this){return "+Un(e)+"}"),"_m("+(zo.length-1)+(e.staticInFor?",true":"")+")";if(e.for&&!e.forProcessed)return Jn(e);if(e.if&&!e.ifProcessed)return zn(e);if("template"!==e.tag||e.slotTarget){if("slot"===e.tag)return Yn(e);var t;if(e.component)t=Qn(e);else{var n=qn(e),r=e.inlineTemplate?null:Wn(e);t="_h('"+e.tag+"'"+(n?","+n:"")+(r?","+r:"")+")"}for(var i=0;i<Fo.length;i++)t=Fo[i](e,t);return t}return Wn(e)||"void 0"}function zn(e){var t=e.if;return e.ifProcessed=!0,"("+t+")?"+Un(e)+":"+Vn(e)}function Vn(e){return e.elseBlock?Un(e.elseBlock):"_e()"}function Jn(e){var t=e.for,n=e.alias,r=e.iterator1?","+e.iterator1:"",i=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,"_l(("+t+"),function("+n+r+i+"){return "+Un(e)+"})"}function qn(e){if(!e.plain){var t="{",n=Kn(e);n&&(t+=n+","),e.key&&(t+="key:"+e.key+","),e.ref&&(t+="ref:"+e.ref+","),e.refInFor&&(t+="refInFor:true,"),e.component&&(t+='tag:"'+e.tag+'",'),e.slotTarget&&(t+="slot:"+e.slotTarget+",");for(var r=0;r<Ho.length;r++)t+=Ho[r](e);if(e.attrs&&(t+="attrs:{"+Xn(e.attrs)+"},"),e.props&&(t+="domProps:{"+Xn(e.props)+"},"),e.events&&(t+=Pn(e.events)+","),e.nativeEvents&&(t+=Pn(e.nativeEvents,!0)+","),e.inlineTemplate){var i=e.children[0];if(1===i.type){var o=Hn(i,Vo);t+="inlineTemplate:{render:function(){"+o.render+"},staticRenderFns:["+o.staticRenderFns.map(function(e){return"function(){"+e+"}"}).join(",")+"]}"}}return t=t.replace(/,$/,"")+"}",e.wrapData&&(t=e.wrapData(t)),t}}function Kn(e){var t=e.directives;if(t){var n,r,i,o,a="directives:[",s=!1;for(n=0,r=t.length;n<r;n++){i=t[n],o=!0;var c=Uo[i.name]||ga[i.name];c&&(o=!!c(e,i,Bo)),o&&(s=!0,a+='{name:"'+i.name+'",rawName:"'+i.rawName+'"'+(i.value?",value:("+i.value+"),expression:"+JSON.stringify(i.value):"")+(i.arg?',arg:"'+i.arg+'"':"")+(i.modifiers?",modifiers:"+JSON.stringify(i.modifiers):"")+"},")}return s?a.slice(0,-1)+"]":void 0}}function Wn(e){if(e.children.length)return"["+e.children.map(Zn).join(",")+"]"}function Zn(e){return 1===e.type?Un(e):Gn(e)}function Gn(e){return 2===e.type?e.expression:JSON.stringify(e.text)}function Yn(e){var t=e.slotName||'"default"',n=Wn(e);return n?"_t("+t+","+n+")":"_t("+t+")"}function Qn(e){var t=Wn(e);return"_h("+e.component+","+qn(e)+(t?","+t:"")+")"}function Xn(e){for(var t="",n=0;n<e.length;n++){var r=e[n];t+='"'+r.name+'":'+r.value+","}return t.slice(0,-1)}function er(e,t){var n=pn(e.trim(),t);jn(n,t);var r=Hn(n,t);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}}function tr(e,t){var n=(t.warn||on,dn(e,"class"));n&&(e.staticClass=JSON.stringify(n));var r=fn(e,"class",!1);r&&(e.classBinding=r)}function nr(e){var t="";return e.staticClass&&(t+="staticClass:"+e.staticClass+","),e.classBinding&&(t+="class:"+e.classBinding+","),t}function rr(e){var t=fn(e,"style",!1);t&&(e.styleBinding=t)}function ir(e){return e.styleBinding?"style:("+e.styleBinding+"),":""}function or(e,t,n){Jo=n;var r=t.value,i=t.modifiers,o=e.tag,a=e.attrsMap.type;if("select"===o)return ur(e,r);if("input"===o&&"checkbox"===a)ar(e,r);else{if("input"!==o||"radio"!==a)return cr(e,r,i);sr(e,r)}}function ar(e,t){var n=fn(e,"value")||"null",r=fn(e,"true-value")||"true",i=fn(e,"false-value")||"false";sn(e,"checked","Array.isArray("+t+")?_i("+t+","+n+")>-1:_q("+t+","+r+")"),ln(e,"change","var $$a="+t+",$$el=$event.target,$$c=$$el.checked?("+r+"):("+i+");if(Array.isArray($$a)){var $$v="+n+",$$i=_i($$a,$$v);if($$c){$$i<0&&("+t+"=$$a.concat($$v))}else{$$i>-1&&("+t+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+t+"=$$c}",null,!0)}function sr(e,t){var n=fn(e,"value")||"null";sn(e,"checked","_q("+t+","+n+")"),ln(e,"change",t+"="+n,null,!0)}function cr(e,t,n){var r=e.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=o||Lr&&"range"===r?"change":"input",u=!o&&"range"!==r,l="input"===e.tag||"textarea"===e.tag,f=l?"$event.target.value"+(s?".trim()":""):"$event",d=a||"number"===r?t+"=_n("+f+")":t+"="+f;if(l&&u&&(d="if($event.target.composing)return;"+d),sn(e,"value",l?"_s("+t+")":"("+t+")"),ln(e,c,d,null,!0),u)return!0}function ur(e,t){var n=t+'=Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){return "_value" in o ? o._value : o.value})'+(null==e.attrsMap.multiple?"[0]":"");return ln(e,"change",n,null,!0),!0}function lr(e,t){t.value&&sn(e,"textContent","_s("+t.value+")")}function fr(e,t){t.value&&sn(e,"innerHTML","_s("+t.value+")")}function dr(e,t){return t=t?u(u({},Ca),t):Ca,er(e,t)}function pr(e,t,n){var r=(t&&t.warn||ui,t&&t.delimiters?String(t.delimiters)+e:e);if(wa[r])return wa[r];var i={},o=dr(e,t);i.render=vr(o.render);var a=o.staticRenderFns.length;i.staticRenderFns=new Array(a);for(var s=0;s<a;s++)i.staticRenderFns[s]=vr(o.staticRenderFns[s]);return wa[r]=i}function vr(e){try{return new Function(e)}catch(e){return p}}function hr(e){if(e.outerHTML)return e.outerHTML;var t=document.createElement("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}var mr,gr=n("slot,component",!0),yr=Object.prototype.hasOwnProperty,_r=/-(\w)/g,br=a(function(e){return e.replace(_r,function(e,t){return t?t.toUpperCase():""})}),$r=a(function(e){return e.charAt(0).toUpperCase()+e.slice(1)}),wr=/([^-])([A-Z])/g,Cr=a(function(e){return e.replace(wr,"$1-$2").replace(wr,"$1-$2").toLowerCase()}),xr=Object.prototype.toString,kr="[object Object]",Ar=function(){return!1},Or={optionMergeStrategies:Object.create(null),silent:!1,devtools:!1,errorHandler:null,ignoredElements:null,keyCodes:Object.create(null),isReservedTag:Ar,isUnknownElement:Ar,getTagNamespace:p,mustUseProp:Ar,_assetTypes:["component","directive","filter"],_lifecycleHooks:["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated"],_maxUpdateCount:100,_isServer:!1},Tr=/[^\w\.\$]/,Sr="__proto__"in{},Er="undefined"!=typeof window&&"[object Object]"!==Object.prototype.toString.call(window),jr=Er&&window.navigator.userAgent.toLowerCase(),Lr=jr&&/msie|trident/.test(jr),Nr=jr&&jr.indexOf("msie 9.0")>0,Dr=jr&&jr.indexOf("edge/")>0,Mr=jr&&jr.indexOf("android")>0,Pr=jr&&/iphone|ipad|ipod|ios/.test(jr),Rr=Er&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,Ir=function(){function e(){r=!1;var e=n.slice(0);n.length=0;for(var t=0;t<e.length;t++)e[t]()}var t,n=[],r=!1;if("undefined"!=typeof Promise&&b(Promise)){var i=Promise.resolve();t=function(){i.then(e),Pr&&setTimeout(p)}}else if("undefined"==typeof MutationObserver||!b(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())t=function(){setTimeout(e,0)};else{var o=1,a=new MutationObserver(e),s=document.createTextNode(String(o));a.observe(s,{characterData:!0}),t=function(){o=(o+1)%2,s.data=String(o)}}return function(e,i){var o=i?function(){e.call(i)}:e;n.push(o),r||(r=!0,t())}}();mr="undefined"!=typeof Set&&b(Set)?Set:function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(e){return void 0!==this.set[e]},e.prototype.add=function(e){this.set[e]=1},e.prototype.clear=function(){this.set=Object.create(null)},e}();var Br=0,Fr=function(){this.id=Br++,this.subs=[]};Fr.prototype.addSub=function(e){this.subs.push(e)},Fr.prototype.removeSub=function(e){r(this.subs,e)},Fr.prototype.depend=function(){Fr.target&&Fr.target.addDep(this)},Fr.prototype.notify=function(){for(var e=this.subs.slice(),t=0,n=e.length;t<n;t++)e[t].update()},Fr.target=null;var Hr=[],Ur=[],zr={},Vr=!1,Jr=!1,qr=0,Kr=0,Wr=function(e,t,n,r){void 0===r&&(r={}),this.vm=e,e._watchers.push(this),this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync,this.expression=t.toString(),this.cb=n,this.id=++Kr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new mr,this.newDepIds=new mr,"function"==typeof t?this.getter=t:(this.getter=_(t),this.getter||(this.getter=function(){})),this.value=this.lazy?void 0:this.get()};Wr.prototype.get=function(){$(this);var e=this.getter.call(this.vm,this.vm);return this.deep&&A(e),w(),this.cleanupDeps(),e},Wr.prototype.addDep=function(e){var t=e.id;this.newDepIds.has(t)||(this.newDepIds.add(t),this.newDeps.push(e),this.depIds.has(t)||e.addSub(this))},Wr.prototype.cleanupDeps=function(){for(var e=this,t=this.deps.length;t--;){var n=e.deps[t];e.newDepIds.has(n.id)||n.removeSub(e)}var r=this.depIds;this.depIds=this.newDepIds,this.newDepIds=r,this.newDepIds.clear(),r=this.deps,this.deps=this.newDeps,this.newDeps=r,this.newDeps.length=0},Wr.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():k(this)},Wr.prototype.run=function(){if(this.active){var e=this.get();if(e!==this.value||l(e)||this.deep){var t=this.value;if(this.value=e,this.user)try{this.cb.call(this.vm,e,t)}catch(e){if(!Or.errorHandler)throw e;Or.errorHandler.call(null,e,this.vm)}else this.cb.call(this.vm,e,t)}}},Wr.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},Wr.prototype.depend=function(){for(var e=this,t=this.deps.length;t--;)e.deps[t].depend()},Wr.prototype.teardown=function(){var e=this;if(this.active){this.vm._isBeingDestroyed||this.vm._vForRemoving||r(this.vm._watchers,this);for(var t=this.deps.length;t--;)e.deps[t].removeSub(e);this.active=!1}};var Zr=new mr,Gr=Array.prototype,Yr=Object.create(Gr);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(e){var t=Gr[e];y(Yr,e,function(){for(var n=arguments,r=arguments.length,i=new Array(r);r--;)i[r]=n[r];var o,a=t.apply(this,i),s=this.__ob__;switch(e){case"push":o=i;break;case"unshift":o=i;break;case"splice":o=i.slice(2)}return o&&s.observeArray(o),s.dep.notify(),a})});var Qr=Object.getOwnPropertyNames(Yr),Xr={shouldConvert:!0,isSettingProps:!1},ei=function(e){if(this.value=e,this.dep=new Fr,this.vmCount=0,y(e,"__ob__",this),Array.isArray(e)){var t=Sr?O:T;t(e,Yr,Qr),this.observeArray(e)}else this.walk(e)};ei.prototype.walk=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)E(e,t[n],e[t[n]])},ei.prototype.observeArray=function(e){for(var t=0,n=e.length;t<n;t++)S(e[t])};var ti={enumerable:!0,configurable:!0,get:p,set:p},ni=function(e,t,n,r,i,o,a,s){this.tag=e,this.data=t,this.children=n,this.text=r,this.elm=i,this.ns=o,this.context=a,this.functionalContext=void 0,this.key=t&&t.key,this.componentOptions=s,this.child=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1},ri=function(){var e=new ni;return e.text="",e.isComment=!0,e},ii=null,oi={init:ae,prepatch:se,insert:ce,destroy:ue},ai=Object.keys(oi),si=0;we(Ce),U(Ce),$e(Ce),te(Ce),ye(Ce);var ci,ui=p,li=Or.optionMergeStrategies;li.data=function(e,t,n){return n?e||t?function(){var r="function"==typeof t?t.call(n):t,i="function"==typeof e?e.call(n):void 0;return r?xe(r,i):i}:void 0:t?"function"!=typeof t?e:e?function(){return xe(t.call(this),e.call(this))}:t:e},Or._lifecycleHooks.forEach(function(e){li[e]=ke}),Or._assetTypes.forEach(function(e){li[e+"s"]=Ae}),li.watch=function(e,t){if(!t)return e;if(!e)return t;var n={};u(n,e);for(var r in t){var i=n[r],o=t[r];i&&!Array.isArray(i)&&(i=[i]),n[r]=i?i.concat(o):[o]}return n},li.props=li.methods=li.computed=function(e,t){if(!t)return e;if(!e)return t;var n=Object.create(null);return u(n,e),u(n,t),n};var fi=function(e,t){return void 0===t?e:t},di=Object.freeze({defineReactive:E,_toString:e,toNumber:t,makeMap:n,isBuiltInTag:gr,remove:r,hasOwn:i,isPrimitive:o,cached:a,camelize:br,capitalize:$r,hyphenate:Cr,bind:s,toArray:c,extend:u,isObject:l,isPlainObject:f,toObject:d,noop:p,no:Ar,genStaticKeys:v,looseEqual:h,looseIndexOf:m,isReserved:g,def:y,parsePath:_,hasProto:Sr,inBrowser:Er,UA:jr,isIE:Lr,isIE9:Nr,isEdge:Dr,isAndroid:Mr,isIOS:Pr,devtools:Rr,nextTick:Ir,get _Set(){return mr},mergeOptions:Ee,resolveAsset:je,warn:ui,formatComponentName:ci,validateProp:Le}),pi={name:"keep-alive",abstract:!0,created:function(){this.cache=Object.create(null)},render:function(){var e=Z(this.$slots.default);if(e&&e.componentOptions){var t=e.componentOptions,n=null==e.key?t.Ctor.cid+"::"+t.tag:e.key;this.cache[n]?e.child=this.cache[n].child:this.cache[n]=e,e.data.keepAlive=!0}return e},destroyed:function(){var e=this;for(var t in this.cache){var n=e.cache[t];ne(n.child,"deactivated"),n.child.$destroy()}}},vi={KeepAlive:pi};Fe(Ce),Object.defineProperty(Ce.prototype,"$isServer",{get:function(){return Or._isServer}}),Ce.version="2.0.2";var hi,mi=n("value,selected,checked,muted"),gi=n("contenteditable,draggable,spellcheck"),yi=n("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),_i="http://www.w3.org/1999/xlink",bi=function(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)},$i=function(e){return bi(e)?e.slice(6,e.length):""},wi=function(e){return null==e||e===!1},Ci={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},xi=n("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),ki=n("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr",!0),Ai=n("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source",!0),Oi=n("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track",!0),Ti=n("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Si=function(e){return"pre"===e},Ei=function(e){return xi(e)||Ti(e)},ji=Object.create(null),Li=Object.freeze({createElement:Ze,createElementNS:Ge,createTextNode:Ye,createComment:Qe,insertBefore:Xe,removeChild:et,appendChild:tt,parentNode:nt,nextSibling:rt,tagName:it,setTextContent:ot,childNodes:at,setAttribute:st}),Ni={create:function(e,t){ct(t)},update:function(e,t){e.data.ref!==t.data.ref&&(ct(e,!0),ct(t))},destroy:function(e){ct(e,!0)}},Di=new ni("",{},[]),Mi=["create","update","remove","destroy"],Pi={create:vt,update:vt,destroy:function(e){vt(e,Di)}},Ri=Object.create(null),Ii=[Ni,Pi],Bi={create:yt,update:yt},Fi={create:bt,update:bt},Hi={create:$t,update:$t},Ui={create:wt,update:wt},zi=["Webkit","Moz","ms"],Vi=a(function(e){if(hi=hi||document.createElement("div"),e=br(e),"filter"!==e&&e in hi.style)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<zi.length;n++){var r=zi[n]+t;if(r in hi.style)return r}}),Ji={create:Ct,update:Ct},qi=Er&&!Nr,Ki="transition",Wi="animation",Zi="transition",Gi="transitionend",Yi="animation",Qi="animationend";qi&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Zi="WebkitTransition",Gi="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Yi="WebkitAnimation",Qi="webkitAnimationEnd"));var Xi=Er&&window.requestAnimationFrame||setTimeout,eo=/\b(transform|all)(,|$)/,to=a(function(e){return{enterClass:e+"-enter",leaveClass:e+"-leave",appearClass:e+"-enter",enterActiveClass:e+"-enter-active",leaveActiveClass:e+"-leave-active",appearActiveClass:e+"-enter-active"}}),no=Er?{create:function(e,t){t.data.show||Nt(t)},remove:function(e,t){e.data.show?t():Dt(e,t)}}:{},ro=[Bi,Fi,Hi,Ui,Ji,no],io=ro.concat(Ii),oo=pt({nodeOps:Li,modules:io});Nr&&document.addEventListener("selectionchange",function(){var e=document.activeElement;e&&e.vmodel&&Ut(e,"input")});var ao={inserted:function(e,t,n){if("select"===n.tag){var r=function(){Rt(e,t,n.context)};r(),(Lr||Dr)&&setTimeout(r,0)}else"textarea"!==n.tag&&"text"!==e.type||(Mr||(e.addEventListener("compositionstart",Ft),e.addEventListener("compositionend",Ht)),Nr&&(e.vmodel=!0))},componentUpdated:function(e,t,n){if("select"===n.tag){Rt(e,t,n.context);var r=e.multiple?t.value.some(function(t){return It(t,e.options)}):It(t.value,e.options);r&&Ut(e,"change")}}},so={bind:function(e,t,n){var r=t.value;n=zt(n);var i=n.data&&n.data.transition;r&&i&&!Nr&&Nt(n);var o="none"===e.style.display?"":e.style.display;e.style.display=r?o:"none",e.__vOriginalDisplay=o},update:function(e,t,n){var r=t.value,i=t.oldValue;if(r!==i){n=zt(n);var o=n.data&&n.data.transition;o&&!Nr?r?(Nt(n),e.style.display=e.__vOriginalDisplay):Dt(n,function(){e.style.display="none"}):e.style.display=r?e.__vOriginalDisplay:"none"}}},co={model:ao,show:so},uo={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String},lo={name:"transition",props:uo,abstract:!0,render:function(e){var t=this,n=this.$slots.default;if(n&&(n=n.filter(function(e){return e.tag}),n.length)){var r=this.mode,i=n[0];if(Kt(this.$vnode))return i;var o=Vt(i);if(!o)return i;if(this._leaving)return qt(e,i);var a=o.key=null==o.key||o.isStatic?"__v"+(o.tag+this._uid)+"__":o.key,s=(o.data||(o.data={})).transition=Jt(this),c=this._vnode,l=Vt(c);if(o.data.directives&&o.data.directives.some(function(e){return"show"===e.name})&&(o.data.show=!0),l&&l.data&&l.key!==a){var f=l.data.transition=u({},s);if("out-in"===r)return this._leaving=!0,G(f,"afterLeave",function(){t._leaving=!1,t.$forceUpdate()},a),qt(e,i);if("in-out"===r){var d,p=function(){d()};G(s,"afterEnter",p,a),G(s,"enterCancelled",p,a),G(f,"delayLeave",function(e){d=e},a)}}return i}}},fo=u({tag:String,moveClass:String},uo);delete fo.mode;var po={props:fo,render:function(e){for(var t=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=Jt(this),s=0;s<i.length;s++){var c=i[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var d=r[f];d.data.transition=a,d.data.pos=d.elm.getBoundingClientRect(),n[d.key]?u.push(d):l.push(d)}this.kept=e(t,null,u),this.removed=l}return e(t,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept},updated:function(){var e=this.prevChildren,t=this.moveClass||this.name+"-move";if(e.length&&this.hasMove(e[0].elm,t)){e.forEach(Wt),e.forEach(Zt),e.forEach(Gt);document.body.offsetHeight;e.forEach(function(e){if(e.data.moved){var n=e.elm,r=n.style;Ot(n,t),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Gi,n._moveCb=function e(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Gi,e),n._moveCb=null,Tt(n,t))})}})}},methods:{hasMove:function(e,t){if(!qi)return!1;if(null!=this._hasMove)return this._hasMove;Ot(e,t);var n=Et(e);return Tt(e,t),this._hasMove=n.hasTransform}}},vo={Transition:lo,TransitionGroup:po};Ce.config.isUnknownElement=Ke,Ce.config.isReservedTag=Ei,Ce.config.getTagNamespace=qe,Ce.config.mustUseProp=mi,u(Ce.options.directives,co),u(Ce.options.components,vo),Ce.prototype.__patch__=Or._isServer?p:oo,Ce.prototype.$mount=function(e,t){return e=e&&!Or._isServer?We(e):void 0,this._mount(e,t)},setTimeout(function(){Or.devtools&&Rr&&Rr.emit("init",Ce)},0);var ho=!!Er&&Yt(">","&gt;"),mo=!!Er&&Yt("\n","&#10;"),go=document.createElement("div"),yo=/([^\s"'<>\/=]+)/,_o=/(?:=)/,bo=[/"([^"]*)"+/.source,/'([^']*)'+/.source,/([^\s"'=<>`]+)/.source],$o=new RegExp("^\\s*"+yo.source+"(?:\\s*("+_o.source+")\\s*(?:"+bo.join("|")+"))?"),wo="[a-zA-Z_][\\w\\-\\.]*",Co="((?:"+wo+"\\:)?"+wo+")",xo=new RegExp("^<"+Co),ko=/^\s*(\/?)>/,Ao=new RegExp("^<\\/"+Co+"[^>]*>"),Oo=/^<!DOCTYPE [^>]+>/i,To=!1;"x".replace(/x(.)?/g,function(e,t){To=""===t});var So,Eo,jo,Lo,No,Do,Mo,Po,Ro,Io,Bo,Fo,Ho,Uo,zo,Vo,Jo,qo=n("script,style",!0),Ko={},Wo=/&lt;/g,Zo=/&gt;/g,Go=/&#10;/g,Yo=/&amp;/g,Qo=/&quot;/g,Xo=/\{\{((?:.|\n)+?)\}\}/g,ea=/[-.*+?^${}()|[\]\/\\]/g,ta=a(function(e){var t=e[0].replace(ea,"\\$&"),n=e[1].replace(ea,"\\$&");return new RegExp(t+"((?:.|\\n)+?)"+n,"g")}),na=/^v-|^@|^:/,ra=/(.*?)\s+(?:in|of)\s+(.*)/,ia=/\(([^,]*),([^,]*)(?:,([^,]*))?\)/,oa=/^:|^v-bind:/,aa=/^@|^v-on:/,sa=/:(.*)$/,ca=/\.[^\.]+/g,ua=/\u2028|\u2029/g,la=a(Qt),fa=/^xmlns:NS\d+/,da=/^NS\d+:/,pa=a(Ln),va=/^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*\s*$/,ha={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},ma={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:"if($event.target !== $event.currentTarget)return;"},ga={bind:Fn,cloak:p},ya=(new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),{staticKeys:["staticClass"],transformNode:tr,genData:nr}),_a={transformNode:rr,genData:ir},ba=[ya,_a],$a={model:or,text:lr,html:fr},wa=Object.create(null),Ca={isIE:Lr,expectHTML:!0,modules:ba,staticKeys:v(ba),directives:$a,isReservedTag:Ei,isUnaryTag:ki,mustUseProp:mi,getTagNamespace:qe,isPreTag:Si},xa=a(function(e){var t=We(e);return t&&t.innerHTML}),ka=Ce.prototype.$mount;return Ce.prototype.$mount=function(e,t){if(e=e&&We(e),e===document.body||e===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template,i=!1;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(i=!0,r=xa(r));else{if(!r.nodeType)return this;i=!0,r=r.innerHTML}else e&&(i=!0,r=hr(e));if(r){var o=pr(r,{warn:ui,isFromDOM:i,shouldDecodeTags:ho,shouldDecodeNewlines:mo,delimiters:n.delimiters},this),a=o.render,s=o.staticRenderFns;n.render=a,n.staticRenderFns=s}}return ka.call(this,e,t)},Ce.compile=pr,Ce});
},{}],5:[function(require,module,exports){
var C = require("common");
var Vue = require("vue");
var echarts = require("echarts");

var myVue = new Vue({
    el : '#totalAssets',
    data : {
  		main : {},
      dongjieDetailFlag: true,
      assets: {
        sum: 0,//总资产
        frozenSum: 0,//冻结金额
        totalAssets: 0,//定期理财
        totalAccount: 0,//账户余额
        frozenTotalAccount: 0//提现在途金额
      }
    },
    methods : {
    	init:function(){
    		var self = this;
        var sum = self.assets.sum || 0;
        var echartTitle = "总资产(元)";
        var data = [];
        var color = [];
        if(sum == 0) {
          data = [{value:  100, name:'总资产0.00元'}];
          color = ['#E0E4E7'];
        } else {
          color = ['#70cac4','#e6bf1a','#f4731f'];
          data = [
              {value: self.assets.frozenSum/sum * 100, name:'冻结金额' + self.assets.frozenSum},
              {value: self.assets.totalAccount/sum * 100, name:'可用余额:' + self.assets.totalAccount},
              {value: self.assets.totalAssets/sum * 100, name:('定期理财:' + self.assets.totalAssets)}
          ]
        }
        self.main = echarts.init(document.getElementById('main'));
        option = {
          title: {
              text: echartTitle,
              subtext: sum,
              x: '48.5%',
              y: '38%',
              textAlign: "center",
              textStyle: {
                  fontWeight: 'normal',
                  color: "#C1C3C7",
                  align: "center",
                  fontSize: 13
              },
              subtextStyle: {
                  fontWeight: 'bold',
                  align: "center",
                  fontSize: 22,
                  color: '#494949'
              }
          },
          color: color,
          series: [{
            	name:'总资产',
              type:'pie',
              radius: ['58%', '66%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              legendHoverLink: false,
              label: {
                  normal: { show: false },
                  emphasis: { show: false }
              },
              data:data
            }
          ]
        };
		    self.main.setOption(option);
      },
      auth: function() {
        C.myAjax({
           url: '/api/auth',
           type: "POST",
           data: JSON.stringify({mobile:"18638632761",password:"111111"})
         },function(data){
           console.log(data);
         });
      },
      getData: function() {//获取邀请码
        var self = this;
        C.myAjax({
          url: '/api/asset/asset-details',
          type: "GET"},
          function(result) {
            self.assets.sum = C.NumberFixed(result.totalAssets, 2) || 0;//总资产
            self.assets.totalAssets = C.NumberFixed(result.regularTotalAssets,2) || 0;//定期理财
            self.assets.totalAccount = C.NumberFixed(result.balanceTotalAccount,2) || 0;//账户余额
            self.assets.frozenTotalAccount = C.NumberFixed(result.frozenTotalAccount,2) || 0;//提现在途金额
            self.assets.frozenSum =  C.NumberFixed(result.frozenTotalAccount,2);
            self.init();
          }
        );
      },
      dongjieDetail: function(){
        var self = this;
        self.dongjieDetailFlag = !self.dongjieDetailFlag;
      },
      backApp : function(){
    		var  self = this;
    		self.returnParams();
    	},
    	returnParams : function(){
  			if(C.getDeviceinfo().ios){
  				window.webkit.messageHandlers.goback;
  			}else if(C.getDeviceinfo().android){
  				window.sh.result();
  			}
    	}
    },
    created: function() {
    	var self = this;
      self.getData();
    }
});

},{"common":1,"echarts":2,"vue":4}],6:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}]},{},[5]);
