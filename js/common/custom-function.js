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
