var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

new Vue({
    el: '#contractTransfer',
    data:{
    	dqUserId:null,
    	canNotSend : false,//是否显示发送到邮箱按钮
    	contractData: {
    		"buyUserName" : null,
    		"userMobile" : null,
    		"certId" : null,
    		"currentAmount" : null,
    		"sellUserName" : null,
    		"address" : null,
    		"bussNo" : null,
    		"targetName" : null,
    		"buyTime" : null,
    		"yearRate" : null,
    		"yearRateStr" : null,
    		"agreementNo" : null,
    		"owner" : null,
    		"basicAsset" : null
    	},
    	imgApiUrl : '/api/captcha',
    	imgData:null,
    	imgKey:null,
    	emailAddr:null,
    	imgNum:null,
    	isSending:false,
    	sendSuc : false
    },
    methods : {
    	getAjaxData: function() {
            var vm = this;
        	var option = {
        		url: '/api/asset/dq-contract?dqUserId='+vm.dqUserId,
                type : "GET"
    		}
    		var successCallBack = function(data){
    			data.yearRateStr = C.NumberFixed(new Number(data.yearRate * 100), 2) + '%';
            	vm.contractData = data;
    		}
    		
    		C.myAjax(option,successCallBack);
        },
        hideDialog:function(){
    		$(".sentFloat").hide();
    	},
    	sentEmail:function(){
    		this.sendSuc = false;
    		this.emailAddr = "";
    		this.imgNum = "";
    		this.setError("");
			$(".sentFloat").show();
			this.isSending = false;
			this.getImgCode();
    	},
    	setError:function(msg){
    		$("#errorMessage").html(msg);
    	},
    	getImgCode : function () {
            var vm = this;
        	var option = {
    			url:"/api/auth/register/img-captcha",
                type : "GET"
    		}
    		var successCallBack = function(data){
    			vm.imgData = 'data:image/png;base64,' + data.imageBase64;
				vm.imgKey = data.imageCaptchaKey;
    		}
    		var errorCallBack = function(data){
    			vm.setError(data);
    		}
    		
    		C.myAjax(option,successCallBack,errorCallBack);
        },
        contractEmail:function(){
        	var vm = this;
        	if(vm.isSending){
        		return;
        	}
        	vm.isSending = true;
        	
        	var re= /\w@\w*\.\w/
	        if(!re.test(vm.emailAddr)){
	         	vm.setError("请输入正确的邮箱格式");
	         	vm.isSending = false;
	         	return;
	        }
        	var option = {
    			url:"/api/asset/dq-contract-send",
                type : "POST",
                data : JSON.stringify({
        	 		"email" : vm.emailAddr,
        	 		"text" : vm.imgNum,
        	 		"dqUserId" : vm.dqUserId,
        	 		"key" : vm.imgKey
        	 	})
    		}
    		var successCallBack = function(data){
    			vm.isSending = false;
    	 		vm.sendSuc = true;
    		}
    		var errorCallBack = function(data){
    			vm.isSending = false;
    			vm.setError(data);
    		}
    		
    		C.myAjax(option,successCallBack,errorCallBack);
        }
    },
    mounted: function () {
        var vm = this;
		var param = C.getUrlParam();
		var dqUserId = param.dqUserId;
		if(!dqUserId){
			return;
		}
		vm.canNotSend = true;
		vm.dqUserId = dqUserId;
		vm.getAjaxData();
    }
});