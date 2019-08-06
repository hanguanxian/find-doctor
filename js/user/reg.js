var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#user-register-container',
  data: {
    sendTxt: '发送验证码',
    isAgreement: false,
    imgApiUrl: '/api/auth/register/img-captcha',
    sendSmsUrl: '/api/auth/register/sms-captcha',
    checkImgCodeUrl: '/api/auth/register/img-captcha/verify',
    regApiUrl: '/api/auth/register',
    imgData: null,
    imgCodeText: null,
    smsKey: null,
    smsValue: null,
    mobile: null,
    password: null,
    disableAttr: false,
    type: 'password',
    bgStatus: true,
    pswDisplay: false,
    maskShow: false,
    ar_winShow: false,
    isBindWechat: true,
    phoneFalg: false,
    pswdFlag: false,
    imgFlag: false,
    msgFlag: false,
    inviteCode: null,
    imgCheckParams: {
      imageKey: null, //图形验证码前后端交互的秘钥 通过获取图形验证码借口返回
      mobile: null, //手机号
      userInputCaptchaValue: null //用户填写的图形验证码显示的数字
    }
  },
  watch : {
    mobile : function(val){
      this.phoneFlag = C.checkInput.validatePhoneNum(val, 'sendBtn');
      C.checkInput.combinedCheck(this.phoneFlag, this.imgFlag, true, true, 'sendBtn');
      C.checkInput.combinedCheck(this.pswdFlag, this.msgFlag, this.phoneFlag, this.imgFlag, 'regBtn',"#F66B12","#868c90");
    },
    password : function(val){
      this.pswdFlag = C.checkInput.validatePassword(val, 'regBtn');
      C.checkInput.combinedCheck(this.pswdFlag, this.msgFlag, this.phoneFlag, this.imgFlag, 'regBtn',"#F66B12","#868c90");
    },
    imgCodeText : function(val){
      if (val == null || val == '' || val.length != 4) {
        this.imgFlag = false;
      } else {
        this.imgFlag = true;
      }
      C.checkInput.combinedCheck(this.phoneFlag, this.imgFlag, true, true, 'sendBtn');
      C.checkInput.combinedCheck(this.pswdFlag, this.msgFlag, this.phoneFlag, this.imgFlag, 'regBtn',"#F66B12","#868c90");
    },
    smsValue : function(val){
      if (val == null || val == '' || val.length != 6) {
        this.msgFlag = false;
      } else {
        this.msgFlag = true;
      }
      C.checkInput.combinedCheck(this.pswdFlag, this.msgFlag, this.phoneFlag, this.imgFlag, 'regBtn',"#F66B12","#868c90");
    }
  },
  methods: {
    psSwitch: function() {
      this.pswDisplay = !this.pswDisplay;
      if (this.type == 'text') {
        this.type = 'password';
      } else {
        this.type = 'text';
      }
    },
    getImgCode: function() {
      var vm = this;
      C.myAjax({
        url: vm.imgApiUrl,
        type : "GET"
      }, function(data) {
        vm.imgData = 'data:image/png;base64,' + data.imageBase64;
        vm.imgCheckParams.imageKey = data.imageCaptchaKey;
      });
    },
    verifiyCode: function() {
      var vm = this;
      vm.imgCheckParams.mobile = vm.mobile;
      vm.imgCheckParams.userInputCaptchaValue = vm.imgCodeText;
      C.myAjax({
        url: vm.checkImgCodeUrl,
        type : "GET",
        data: vm.imgCheckParams
      }, function(data) {
        if(data.result) {
          vm.reg();
        }
      },function(data){
        alert(data);
        vm.getImgCode();
      });
    },
    sendSms: function() {
      var vm = this;
      if(!C.checkInput.validatePhoneNum(vm.mobile)) {
        alert("请输入正确的手机号码");
        return;
      }
      if(vm.disableAttr) {
        return;
      }
      vm.sendTxt = '60s';
      C.sendMsgTxt.show(function(txt, prop, bgColor) {
        vm.sendTxt = txt;
        vm.disableAttr = prop;
        vm.bgStatus = bgColor;
      });

      C.myAjax({
        url: vm.sendSmsUrl,
        type : "GET",
        data: {mobile: vm.mobile}
      }, function(data) {
        if(data.isExceedLimit) {
          alert('超过发送次数');
          return;
        }
        vm.smsKey = data.smsKey;
      }, function() {
        vm.getImgCode();
      });
    },
    reg: function() {
      var vm = this;
      if(!C.checkInput.validatePassword(vm.password)) {
        alert("请输入6-16位数字或字母");
        return;
      }
      C.myAjax({
        url: vm.regApiUrl,
        type : "POST",
        headers:{
           "From-Channel": vm.fromChannel,
           "From-Client": "h5"
        },
        data: JSON.stringify({
          smsKey: vm.smsKey, //短信验证码前后端交互的秘钥
          smsValue: vm.smsValue,//短信验证码
          mobile: vm.mobile,
          userPwd: vm.password,
          openToken: C.storage.get('wechatToken'),
          inviteCode: vm.inviteCode//邀请码，可不传
        })
      }, function(data) {
        if(data.result) {
          window.location.href = '../home.html';
        }
      });
    },
    bindWechat: function() {
      if (document.getElementById("checkbox-10-1").checked) {
        this.isBindWechat = true;
        return true;
      } else {
        this.isBindWechat = false;
        return false;
      }
    },
    showContract: function() {
      $(".platform_article").show();
    },
    toReg: function() {
      $(".platform_article").hide();
    }
  },
  mounted: function() {
    var param = C.getUrlParam();
    this.inviteCode = param.inviteCode || '';
    this.fromChannel = param.fromChannel || '';
  }
});
