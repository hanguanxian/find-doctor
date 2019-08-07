var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#user-register-container',
  data: {
    sendTxt: '发送验证码',
    isAgreement: false,//是否同意平台服务条款
    inviteCode: null,//邀请码
    fromChannel: null,//来源
    smsValue: null,//短信验证码
    mobile: null,//手机号
    disableAttr: false,
    bgStatus: true,
    maskShow: false,
  },
  methods: {
   
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

      // C.myAjax({
      //   url: vm.sendSmsUrl,
      //   type : "GET",
      //   data: {mobile: vm.mobile}
      // }, function(data) {
        
      //   vm.smsKey = data.smsKey;
      // }, function() {

      // });
    },
    reg: function() {
      var vm = this;
      
      C.myAjax({
        url: vm.regApiUrl,
        type : "POST",
        headers:{
           "From-Channel": vm.fromChannel,
           "From-Client": "h5"
        },
        data: JSON.stringify({
          smsValue: vm.smsValue,//短信验证码
          userPwd: vm.password,
          inviteCode: vm.inviteCode//邀请码，可不传
        })
      }, function(data) {
        if(data.result) {
          window.location.href = '../home.html';
        }
      });
    }
  },
  mounted: function() {
    var param = C.getUrlParam();
    this.inviteCode = param.inviteCode || '';
    this.fromChannel = param.fromChannel || '';
  }
});
