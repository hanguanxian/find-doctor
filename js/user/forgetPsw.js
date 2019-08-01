var Vue = require("vue");
var C = require("common");
var $ = require("jquery");
var BaiduScript = require("baiduScript");

var index_vm = new Vue({
  el: '#user-fPsw-container',
  data: {
    imgApiUrl: '/api/auth/register/img-captcha',
    checkImgCodeUrl: '/api/auth/register/img-captcha/verify',
    imgData: null,
    imgCodeText: null,
    mobile: null,
    imgCheckParams: {
      imageKey: null, //图形验证码前后端交互的秘钥 通过获取图形验证码借口返回
      mobile: null, //手机号
      userInputCaptchaValue: null //用户填写的图形验证码显示的数字
    }
  },
  methods: {
    getImgCode: function() {
      var vm = this;
      C.myAjax({
        url: vm.imgApiUrl,
        type: "GET"
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
        type: "GET",
        data: vm.imgCheckParams
      }, function(data) {
        if (data.result) {
          window.location.href = 'setNewPsw.html?mobile=' + vm.mobile + '&imgKey=' + vm.imgCheckParams.imageKey + '&imgCodeText=' + vm.imgCodeText;
        }
      }, function(data) {
        alert(data);
        vm.getImgCode();
      });
    }
  },
  mounted: function() {
    this.getImgCode();
  }
});
