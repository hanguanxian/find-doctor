 	var $ = require("jquery");
 	var C = require("common");
 	var wx = require('weixin-js-sdk');

 	if(window.location.href.indexOf("register") > 0){
 		var shareTitle = "你的好友喊你来领钱！";
		var shareDescr = "88888元体验金，10.8%专享标，让你躺着赚高收益~";
		var shareImgLink = window.location.origin+"/neo-bank/img/activity1204/share.png";
		var shareLink = window.location.href;
 	} else if(window.location.href.indexOf("activity-1204") > 0){
 		var shareTitle = "送你88888体验金礼包，还不快领？10.8%新手标包你满意！";
		var shareDescr = "我已在源码汇投资啦，一起来开启财富之旅吧~";
		var shareImgLink = window.location.origin+"/neo-bank/img/activity1204/share.jpg";
		var shareLink = window.location.origin + '/wx/neo-bank/html/user/register.html';
 	}

	function initWxShare(){
		//微信授权
		C.wx_auth(shareInit);
	}

	/*--------------------微信：初始化分享数据---------------------*/
	function shareInit(data){
		wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: data.appid, // 必填，公众号的唯一标识
		    timestamp: data.timestamp, // 必填，生成签名的时间戳
		    nonceStr: data.noncestr, // 必填，生成签名的随机串
		    signature: data.signature,// 必填，签名
		    jsApiList: [// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		    	'onMenuShareAppMessage',
		    	'onMenuShareTimeline',
		    ]
		});


		wx.ready(function(){
			//分享给朋友�
		    wx.onMenuShareAppMessage({
		      title: shareTitle,
		      desc: shareDescr,
		      link: shareLink,
		      imgUrl: shareImgLink,
		      success: function (res) {
		      	//alert('分享成功');
		      },
		      cancel: function (res) {
		        //alert('已取�);
		      },
		      fail: function (res) {
		        //if(debugSignal) alert(JSON.stringify(res));
		        //alert('分享失败');
		      }
		    });


			//分享朋友圈
		    wx.onMenuShareTimeline({
		      title: shareTitle,
		      desc: shareDescr,
		      link: shareLink,
		      imgUrl: shareImgLink,
		      success: function (res) {
		        //alert('分享成功');
		      },
		      cancel: function (res) {
		        //if(debugSignal) alert('已取�);
		      },
		      fail: function (res) {
		        //alert('分享失败');
		      }
		    });

	  	});


	  	wx.error(function(res){
			C.alertObj(res);
			alert("网络连接失败，请重试111");
			console.log("wx.error");
		});

	}

	module.exports = {
		initWxShare:initWxShare
	}

//})
