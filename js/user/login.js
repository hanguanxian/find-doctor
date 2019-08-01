var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var vm=new Vue({
    el: '#user-login-container',
    data:{
        pswDisplay: false,
      	postData:{
      		mobile : null,
      		password : null,
          openToken:C.storage.get('wechatToken')
      	},
        fromUrl: "",
        type: 'password',
    		mobile:null,
    		passwd:null,
    		phoneFalg:false,
    		pswdFlag:false,
    },
    watch : {
    	mobile : function(val){
        this.phoneFlag = C.checkInput.validatePhoneNum(val,'loginBtn');
        C.checkInput.combinedCheck(this.phoneFlag,this.pswdFlag,true,true,'loginBtn',"#F66B12","#868c90");
    	},
      passwd : function(val){
        this.pswdFlag=C.checkInput.validatePassword(val,'loginBtn');
      	C.checkInput.combinedCheck(this.phoneFlag,this.pswdFlag,true,true,'loginBtn',"#F66B12","#868c90");
    	}
    },
    methods:{
        goBack: function(){
          window.location.href = "../home.html";
        },
        login : function() {
        	var vm = this;
    			vm.postData.mobile = this.mobile;
    			vm.postData.password = this.passwd;
    			C.storage.set('mobile', C.enycryptPhoneNum(this.mobile));
        	C.myAjax({
        		url: '/api/auth',
            type: "POST",
        		data : JSON.stringify(vm.postData)
        	}, function(data){
            if(data.result) {
              if(document.referrer.indexOf("login.html") > -1 || document.referrer.indexOf("resetPsw.html") > -1) {
                window.location.href = "../myCenter/asset_index.html"
              } else {
                window.location.href = document.referrer || "../home.html";
              }
            }
        	});
        },
        psSwitch : function () {
            this.pswDisplay = !this.pswDisplay;
            if(this.type=='text'){
                this.type = 'password';
            }else{
                this.type = 'text';
            }
        },
        bindWechat: function () {
        	if(document.getElementById("checkbox-10-1").checked){
        		this.isBindWechat = true;
        		return true;
            }else{
            	this.isBindWechat = false;
            	return false;
            }
        }
    },
    mounted: function () {
    	var vm = this;
  		document.getElementById("checkbox-10-1").checked = true;
  		// var wechat = C.storage.get('wechatToken');
  		// if(!wechat){
  		// 	$("#checkbox_open").css("display","none");
  		// }
  		// else{
  		// 	$("#checkbox_open").css("display","block");
  		// }
      $("#checkbox_open").css("display","none");
      var defaultUrl =  "../myCenter/asset_index.html";
    	vm.fromUrl = C.getFromUrl() || defaultUrl;
      if(vm.fromUrl == "home") {
        vm.fromUrl = "../home.html";
      }
    }
});
