var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var vm = new Vue({
  el: '#contract_dq_a',
  data: {
    contractData: {
      "buyUserName": null,
      "userMobile": null,
      "certId": null,
      "currentAmount": null,
      "sellUserName": null,
      "address": null,
      "bussNo": null,
      "targetName": null,
      "buyTime": null,
      "yearRate": null,
      "yearRateStr": null,
      "agreementNo": null,
      "owner": null,
      "basicAsset": null
    },
    imgApiUrl: '/api/auth/register/img-captcha',
    dialogShow: false,
    imgData: null,
    imgKey: null,
    emailAddr: null,
    imgNum: null,
    dqUserId: null
  },
  methods: {
    getAjaxData: function() {
      var vm = this;
      C.myAjax({
        url: "/api/asset/dq-contract?dqUserId=" + vm.dqUserId,
        type: "GET"
      }, function(data) {
        data.yearRateStr = C.NumberFixed(new Number(data.yearRate * 100), 2) + '%';
        vm.contractData = data;
      }, function(data) {
        alert(data);
      });
    },
    getAjaxDataByTargetId: function() {
      var vm = this;
      C.myAjax({
        url: "/api/contract/init?targetId=" + vm.targetId,
        type: "GET"
      }, function(data) {
        data.yearRateStr = C.NumberFixed(new Number(data.yearRate * 100), 2) + '%';
        vm.contractData = data;
      }, function(data) {
        alert(data);
      });
    },
    getImgCode: function() {
      var vm = this;
      C.myAjax({
        url: vm.imgApiUrl,
        type: "GET"
      }, function(data) {
        vm.imgData = 'data:image/png;base64,' + data.imageBase64;
        vm.imgKey = data.imageCaptchaKey;
      });
    },
    contractEmail: function() {
      var vm = this;
      var re = /\w@\w*\.\w/
      if (!re.test(vm.emailAddr)) {
        $("#errorMessage").html("请输入正确的邮箱格式");
        return;
      }
      if (!vm.imgNum) {
        $("#errorMessage").html("请输入验证码");
        return;
      }
      C.myAjax({
        type: "POST",
        url: "/api/asset/dq-contract-send",
        data: JSON.stringify({
          email: vm.emailAddr,
          text: vm.imgNum,
          dqUserId: vm.dqUserId,
          key: vm.imgKey
        }),
      }, function(data) {
        if(data.sendResult) {
          $("#errorMessage").html("");
          $("#successContent").css("display", "block");
          $("#sentContent").css("display", "none");
          setTimeout(function() {
            vm.dialogShow = false;
            $("#successContent").css("display", "none");
            $("#sentContent").css("display", "block");
          }, 2000);
        }
      }, function(data) {
        $("#errorMessage").html(data);
      });
    }
  },

  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.targetId = params.targetId;
    vm.dqUserId = params.dqUserId;
    if (vm.dqUserId) {
      this.getAjaxData();
    } else if (vm.targetId) {
      $('.downloadBtn').hide();
      //this.getAjaxDataByTargetId();
    } else {
      $('.downloadBtn').hide();
      alert("获取信息失败！");
    }
    this.getImgCode();
  }
});
