var Vue = require("vue");
var C = require("common");
var $ = require("jquery");
var BaiduScript = require("baiduScript");

var index_vm = new Vue({
  el: '#user-resetPsw-container',
  data: {
    imgApiUrl: '/api/captcha',
    checkImgCodeUrl: '/api/captcha',
    imgData: null,
    imgKey: null,
    imgCodeText: null,
    mobile: null,
    oldPwd: null,
    newPwd: null,
    newPwd2: null
  },
  watch : {
    newPwd : function(val){
      if (!this.testPwd(val)) {
        $(".form-input-error").html("新密码必须为6-16位字母或数字");
      } else {
        $(".form-input-error").html("");
      }
    },
    newPwd2 : function(val){
      if (this.newPwd != val) {
        $(".form-input-error").html("新密码两次输入不一致");
      } else {
        $(".form-input-error").html("");
      }
    },
    oldPwd : function(val){
      if (!val) {
        $(".form-input-error").html("现有密码不能为空");
      } else if (!this.testPwd(val)) {
        $(".form-input-error").html("现有密码应为6-16位字母或数字");
      } else {
        $(".form-input-error").html("");
      }
    }
  },
  methods: {
    testPwd:function (val) {
      var checkNum = /^[a-zA-Z\d]{6,16}$/;
      return checkNum.test(val);
    },
    logout: function() {
      C.myAjax({
        url: '/api/auth',
        type: "PUT",
      }, function(data){
        if(data.logoutResult) {
          window.location.href = "login.html";
        }
      });
    },
    getImgCode: function() {
      var vm = this;
      rest.post({
        url: vm.imgApiUrl
      }, function(data) {
        vm.$set('imgData', 'data:image/png;base64,' + data.image);
        vm.imgKey = data.imgKey;
      });
    },
    checkImgCode: function() {
      var vm = this;
      rest.post({
        url: vm.checkImgCodeUrl,
        data: {
          imgKey: this.imgKey,
          text: this.imgCodeText
        }
      }, function(data) {
        window.location.href = '/h5/html/user/setNewPsw.html?phone=' + vm.mobile + '&imgKey=' + vm.imgKey + '&imgCodeText=' + vm.imgCodeText;
      });
    },
    confirmEdit: function() {
      var vm = this;
      if(!vm.newPwd2 || !vm.newPwd || !vm.oldPwd){
        $(".form-input-error").html("请输入密码！");
        return
      }
      if ($(".form-input-error").html().length == 0) {
        C.myAjax({
          type: "PUT",
          url: "/api/auth/modify-pwd",
          data: JSON.stringify({
            oldPassword: vm.oldPwd,
            newPassword: vm.newPwd
          })},
          function(data) {
            vm.logout();
          },
          function(data) {
            $(".form-input-error").html(data);
          }
        );
      }
    }
  },
  mounted: function() {
    $(".form-input-error").html("");
  }
});
