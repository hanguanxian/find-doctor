var Vue = require("vue");
var C = require("common");
var $ = require("jquery");
var BaiduScript = require("baiduScript");

var index_vm = new Vue({
  el: '#user-setNewpsw-container',
  data: {
    sendSmsUrl: '/api/auth/register/sms-captcha',
    setPasswordUrl: '/api/auth/reset-pwd',
    smsKey: null,
    smsText: null,
    mobile: null,
    mobileText: "",
    password: null,
    imgKey: "",
    imgCodeText: "",
    pswDisplay: false,
    type: 'password',
    sendTxt: '发送',
    bgStatus: '',
    disableAttr: false
  },
  watch: {
    password: function(val) {
      if (val == null || val == '' || val.length != 6) {
        this.msgFlag = false;
      } else {
        this.msgFlag = true;
      }
      C.checkInput.validatePassword(val, 'setPswBtn');
    }
  },
  methods: {
    sendSms: function() {
      var vm = this;
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
      });
    },
    setPassword: function() {
      var vm = this;
      C.myAjax({
        url: vm.setPasswordUrl,
        type : "POST",
        data: JSON.stringify({
          mobile: vm.mobile,
          userPwd: vm.password,
          smsKey: vm.smsKey,
          smsValue: vm.smsText
        })
      }, function(data) {
        if(data.result) {
          window.location.href = 'login.html';
        }
      });
    },
    psSwitch: function() {
      this.pswDisplay = !this.pswDisplay;
      if (this.type == 'text') {
        this.type = 'password';
      } else {
        this.type = 'text';
      }
    },

  },
  mounted: function() {
    var parm = C.getUrlParam();
    this.imgKey = parm.imgKey;
    this.mobile = parm.mobile;
    this.imgCodeText = parm.imgCodeText;
    this.sendSms();
    this.mobileText = C.enycryptPhoneNum(this.mobile);
  }
});
