var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var vm = new Vue({
  el: '#fixed-success-container',
  data: {
    amount: null,
    beginDate: null
  },
  methods: {
    getStatus: function() {
      var vm = this;
      C.myAjax({
          url: "/api/trade/invest-order-result",
          type: "POST",
          data: JSON.stringify({
            investmentOrderId: vm.investmentOrderId
          })
        },function(data) {
          console.log(data);
          vm.amount = data.amount;
          vm.beginDate =  C.formatDate(data.beginDate,"yyyy-MM-dd");
        }
      );
    },
    toAsset: function() {
      window.location.href = "../../myCenter/asset_index.html";
    },
    toIndexPage: function() {
      window.location.href = "../../home.html";
    }
  },
  mounted: function() {
    // 计息时间
    var vm = this;
    var params = C.getUrlParam();
    vm.investmentOrderId = params.investmentOrderId;
    vm.getStatus();
  }
});
