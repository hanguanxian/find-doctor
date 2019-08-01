var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var rechargeSuccess_vm=new Vue({
    el: '#recharge-success-container',
    data:{
      paymentOrderId: null,
      actualAmount: null,
      bankInfo: null
    },
    methods: {
      finish: function(){
        window.location.href = "asset_index.html";
      },
      getStatus: function(){
        var vm = this;
        C.myAjax({
            url: "/api/payment-recharge/order/" + vm.paymentOrderId,
            type: "GET"
          },
          function(data) {
            vm.actualAmount = C.NumberFixed(data.actualAmount,2);
            vm.bankInfo = data.bankName + "（尾号" + data.bankAcctNo.substr(data.bankAcctNo.length-4,4) +"）";
          }
        );
      }
    },
    mounted: function () {
      var vm = this;
      var params = C.getUrlParam();
      vm.paymentOrderId = params.paymentOrderId;
      vm.getStatus();
    }
});
