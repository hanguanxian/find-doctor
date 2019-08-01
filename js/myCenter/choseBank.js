var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

new Vue({
  el: '#bank-list-container',
  data: {
    apiUrl: '/api/payment-bank-card/bank',
    listData: [],
    productId: ""
  },
  methods: {
    getData: function() {
      var vm = this;
      C.myAjax({
        url: vm.apiUrl,
        type: "GET"},function(data) {
          console.log(data);
          vm.listData = data.paymentBanks;
        });
    },
    chooseBank: function(bankObj) {
      console.log(bankObj);
      var bindCardInfo = C.storage.get("bindCardInfo");
      bindCardInfo.bankCode = bankObj.bankCode;
      bindCardInfo.bankName = bankObj.bankName;
      C.storage.set("bindCardInfo", bindCardInfo);
      if(this.productId) {
        window.location.href = "bindCard.html?productId=" + this.productId;
      } else {
        window.location.href = "bindCard.html";
      }
    }
  },
  mounted: function() {
    this.getData();
    var params = C.getUrlParam();
    this.productId = params.productId;
  }
});
