var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#user-payPassword-container',
  data: {
    password1: null,
    password2: null,
    step: 1,
    btnText: "确定",
    tips: "请输入交易密码",
    pageType: ""
  },
  methods: {
    submit: function() {
      var vm = this;
      if(!vm.password1 && vm.step == 1) {
        alert("请输入交易密码！");
      } if(!vm.password2 && vm.step == 2) {
        alert("请输入交易密码！");
      }
      if(vm.pageType == "idresetpsd") {
        vm.idresetpsd()
        return;
      }
      if(vm.step == 1) {
        vm.step = 2;
        if(vm.pageType == "resetpsd") {
          vm.tips = "请输入新密码";
        } else {
          vm.tips = "请再次输入交易密码";
        }
        // if(vm.pageType == "resetpsd") {
        //   vm.tips = "请再次输入密码";
        // } else {
        //   vm.tips = "请再次输入新密码";
        // }
      } else {
        if(vm.pageType == "resetpsd") {
          vm.resetpsd();
        } else {
          if(vm.password1 != vm.password2) {
            vm.password2 = "";
            alert("两次密码不一致！");
            return;
          }
          vm.setpsd();
        }
      }

    },
    idresetpsd: function() {
      var vm = this;
      var params = C.getUrlParam();
      var name = decodeURI(params.name);
      var idCardNo = decodeURI(params.idCardNo);
      C.myAjax({
        url: "/api/auth/transpwd-finding",
        type: "POST",
        data: JSON.stringify({
          transPwd: vm.password1,
          name: name,
          idCardNo: idCardNo
        })
      }, function(data) {
        if(data.result) {
          if(vm.pageType == "idresetpsd") {
            history.go(-2);
          } else {
            window.location.href = "../myCenter/setup_center.html";
          }
        }
      });
    },
    resetpsd: function() {
      var vm = this;
      C.myAjax({
        url: "/api/auth/transpwd-modification",
        type: "PUT",
        data: JSON.stringify({
          oldTransPwd: vm.password1,
          newTransPwd: vm.password2
        })
      }, function(data) {
        if(data.result) {
          window.location.href = "../myCenter/setup_center.html";
        }
      });
    },
    setpsd: function() {
      var vm = this;
      C.myAjax({
        url: "/api/auth/transpwd-creation",
        type: "POST",
        data: JSON.stringify({
          transPwd: vm.password2
        })
      }, function(data) {
        if(data.result) {
          if(vm.pageType == "investPay") {
            window.location.href = document.referrer || "../myCenter/setup_center.html";
          } else {
            window.location.href = "../myCenter/setup_center.html";
          }
        }
      });
    }
  },
  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.pageType = params.pageType || "setpsd";
    if(vm.pageType == "resetpsd") {
      vm.tips = "请输入原密码"
    } else if(vm.pageType == "idresetpsd") {
      vm.tips = "请输入新交易密码"
    }
  }
});
