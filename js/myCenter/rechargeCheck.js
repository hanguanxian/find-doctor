var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var vm = new Vue({
  el: '#pay-fixedPro-container',
  data: {
    detailUrl: "/api/payment/ways",
    buyTargetUrl: "/api/trade/buy-target",
    amount: null,
    investmentOrderId: null, //订单号
    payTypes: [], //支付方式
    morePay: true,
    password: null,
    errorMsg: null,
    payTypeCode: null,
    overflowShowFlag: false,
    overflowConten: "noPassword",
    smsValue: null,
    sendTxt: null,
    disableAttr: false,
    bgStatus: true,
    mobile: null,
    orderId: null,
    accountBalance: 0,
    selected: 0
  },
  watch : {
    password: function(val) {
      var vm = this;
      if(val.length == 6) {
        C.myAjax({
            url: "/api/auth/transpwd-verification",
            type: "POST",
            data: JSON.stringify({
              transPwd: val
            })
          },
          function(data) {
            if(data.result) {
              vm.submitOrder(vm.investmentOrderId);
            }
          },function(data) {
            vm.errorMsg = data;
          }
        );
      }

    }
  },
  methods: {
    putPayment: function(){
      var vm = this;
      for(var i=0;i<vm.payTypes.length; i++) {//只使用绑卡支付
        if(vm.payTypes[i].type == 100 && !vm.payTypes[i].flag) return;
      }
      C.myAjax({
          url: "/api/payment/ways-select",
          type: "PUT",
          data: JSON.stringify({
            investmentOrderId: vm.investmentOrderId,
            type: vm.payTypeCode
          })
        },
        function(data) {
          if(data.result) {
            vm.paySelect();
          }
        }
      );
    },

    submitOrder: function(investmentOrderId) {
      var vm = this;
      C.myAjax({
          url: vm.buyTargetUrl,
          type: "POST",
          data: JSON.stringify({
            investmentOrderId: investmentOrderId
          })
        },
        function(data) {
          if (data.result) {
            window.location.href = "fixed_invest_success.html?productId=" + vm.productId + "&investmentOrderId=" + data.investmentOrderId;
          } else {
            window.location.href = "fixed_invest_failure.html?productId=" + vm.productId;
          }
        },
        function(data) {
          alert(data);
        }
      );
    },
    formatFloat: function(val) {
      return C.NumberFixed(val * 100, 2);
    },
    resend: function(){
      var vm = this;
      if(vm.disableAttr) {
        return;
      }
      C.sendMsgTxt.show(function(txt, prop, bgColor) {
        vm.sendTxt = txt;
        vm.disableAttr = prop;
        vm.bgStatus = bgColor;
      });
      vm.bankCardSendSms();
    },
    submitBindCard: function(){
      var vm = this;
      C.myAjax({
          url: "/api/payment-recharge/fuiou/api-recharge/do",
          type: "POST",
          contentTyp: "application/x-www-form-urlencoded; charset=UTF-8",
          data: {
            vercd: vm.smsValue,
            order_id: vm.orderId,
            invest_id: vm.investmentOrderId
          }
        },function(data) {
          if (data.result == "SUCCESS") {
            window.location.href = "rechargeSuccess.html?paymentOrderId=" + data.order_id;
          } else {
            window.location.href = "rechargeFail.html?amount=" + data.amount;
          }
        },
        function(data) {
          alert(data);
        }
      );
    },
    bankCardSendSms: function() {
      var vm = this;
      C.myAjax({
          url: "/api/payment-recharge/fuiou/api-recharge/order",
          type: "POST",
          contentTyp: "application/x-www-form-urlencoded; charset=UTF-8",
          data: {
            amount: vm.amount
          }
        },
        function(data) {
          if(data.mobile) {
            vm.overflowShowFlag = true;
            var middle = data.mobile.substr(3,4);
            vm.mobile = data.mobile.replace(middle,"****");
            vm.orderId = data.order_id;
          }
        },
        function(data) {
          alert(data);
        }
      );
    },
    transpwdExistence: function(){
      C.myAjax({
          url: "/api/auth/transpwd-existence",
          type: "GET"
        },
        function(data) {
          if(data.result) {
            vm.overflowConten = "passwordInput";
          } else {
            vm.overflowConten = "noPassword";
          }
        },
        function(data) {
          alert(data);
        }
      );
    },
    paySelect: function() {
      var vm = this;
      var index = vm.selected;
      vm.payTypeCode = vm.payTypes[index].type;
      if(vm.payTypes[index].type == 0) {
        vm.transpwdExistence();
      } else if(vm.payTypes[index].type == 100){
        vm.overflowConten = "sms";
        vm.resend();
      }
    },
    getOrderInfo: function() {
      var vm = this;
      var params = C.getUrlParam();
      C.myAjax({
          url: vm.detailUrl,
          type: "POST",
          data: JSON.stringify({
            amount: vm.amount
          })
        },
        function(data) {
          vm.payTypes = data.results;
        },
        function(data) {
          alert(data);
        }
      );
    }
  },

  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.amount = params.amount;
    vm.accountBalance = params.accountBalance;
    vm.getOrderInfo();
  }
});
