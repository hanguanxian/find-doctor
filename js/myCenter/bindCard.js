var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var vm = new Vue({
  el: '#bind-card-container',
  data: {
    bindCardInfo: {
      idHolder: null,//真实姓名
      idCard: null,//身份证号码
      bankCode: null,
      bankAcctNo: null,
      mobile: null,
      smsKey: null,
      smsValue: null
    },
    apiUrl: '/api/payment-bank-card/bind',
    idcard: null,
    bgStatus: true,
    bankName: '请选择开户行',
    sendTxt: '发送',
    btnPass: true,
    productId: "",
    disableAttr: false
  },
  watch : {
    idcard : function(val){
      this.bindCardInfo.idCard = val;
      if(val && !C.checkInput.validateIDNumber(val, 'bindCard')) {
        $('.errorMessage').html("身份证号码错误！");
      }
    }
  },
  methods: {
    goBack: function() {
        C.storage.set("bindCardInfo", '');
        window.location.href="setup_center.html";
    },
    bindCard: function() {
      var vm = this;
      if(!vm.btnPass) {
        return;
      }
      var params = C.getUrlParam();
      if(!vm.bindCardInfo.idHolder){
				$('.errorMessage').html("姓名不能为空");
        return;
			} else if(!vm.bindCardInfo.idCard){
        $('.errorMessage').html("请输入身份证号码");
        return;
			} else if(!vm.bindCardInfo.bankCode){
        $('.errorMessage').html("请选择开户类型");
        return;
			} else if(!vm.bindCardInfo.bankAcctNo){
        $('.errorMessage').html("请输入储蓄卡号");
        return;
			} else if(!vm.bindCardInfo.mobile){
        $('.errorMessage').html("请输入手机号");
        return;
			} else if(!vm.bindCardInfo.smsValue){
        $('.errorMessage').html("请输入短信验证码");
        return;
			}
      vm.btnPass = false;
      $("#bindCard").css("background-color","#868c90");
      C.myAjax({
        url: vm.apiUrl,
        data: JSON.stringify(vm.bindCardInfo),
        type: "POST"},
        function(data) {
          vm.btnPass = true;
          alert("绑卡成功！");
          $("#bindCard").css("background-color","#F66B12");
          if(this.productId) {
            window.location.href = "../product/fixed_product/fixed_invest_money.html?productId=" + vm.productId;
          } else {
            window.location.href = "asset_index.html";
          }
        },
        function(data) {
          vm.btnPass = true;
          $("#bindCard").css("background-color","#F66B12");
          $('.errorMessage').html(data);
        }
      );
    },
    sendSms: function() {
      var vm = this;
      if(!C.checkInput.validatePhoneNum(vm.bindCardInfo.mobile)) {
        alert("请输入正确的手机号码");
        return;
      }
      vm.sendTxt = '60s';
      C.sendMsgTxt.show(function(txt, prop, bgStatus) {
        vm.sendTxt = txt;
        vm.disableAttr = prop;
        vm.bgStatus = bgStatus;
      });

      C.myAjax({
        url: '/api/auth/register/sms-captcha',
        type : "GET",
        data: {mobile: vm.bindCardInfo.mobile}
      }, function(data) {
        if(data.isExceedLimit) {
          alert('超过发送次数');
          return;
        }
        vm.bindCardInfo.smsKey = data.smsKey;
      }, function(data) {
        alert(data);
      });
    },
    choseBank: function() {
      C.storage.set("bindCardInfo", this.bindCardInfo);
      if(this.productId) {
        window.location.href = "choseBank.html?productId=" + this.productId;
      } else {
        window.location.href = "choseBank.html";
      }
    }
  },
  mounted: function() {
    var vm = this;
    var bindCardInfo = C.storage.get("bindCardInfo") || {};
    var params = C.getUrlParam();
    vm.productId = params.productId;
    if(bindCardInfo){
      vm.bindCardInfo = bindCardInfo;
      vm.idcard = vm.bindCardInfo.idCard || '';
      if(vm.bindCardInfo.bankName) {
        vm.bankName =  vm.bindCardInfo.bankName;
        delete vm.bindCardInfo.bankName;
      }
    }
  }
});
