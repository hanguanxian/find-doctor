var Vue = require("vue");
var C = require("common");
var $ = require("jquery");
var BaiduScript = require("baiduScript");

var recharge_vm = new Vue({
  el: '#recharge-money-container',
  data: {
    bankInfoUrl: '/api/payment-bank-card/bind?userId=',
    accountBalanceUrl: '/api/user-account/',
    accountBalance: null,
    amount: '',
    isPass: false
  },
  watch: {
    amount: function(val) {
      if(val) {
        this.isPass = true;
        this.amount = parseInt(val);
      } else {
        this.isPass = false;
      }
    }
  },
  methods: {
    recharge: function() {
      var vm = this;
      vm.amount = parseInt(vm.amount);
      window.location.href = "./rechargeCheck.html?amount=" + vm.amount + "&accountBalance=" + vm.accountBalance;
    }
  },
  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.amount = params.amount || null;
    vm.accountBalance = params.accountBalance || 0;
  }
});
