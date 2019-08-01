var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

new Vue({
  el: '#proInvestRecords',
  data: {
    recordsList: [],
    productId: null
  },
  methods: {
    getInvestRecords: function() {
      var vm = this;
      var option = {
        url: '/api/fixed-income/invest-record?productId=' + vm.productId,
        type: "GET"
      }
      var successCallBack = function(data) {
        var data = data.results;
        for (var i = 0; i < data.length; i++) {
          var obj = {};
          obj.mobile = data[i].phone;
          obj.investMoney = C.moneyFormat(data[i].investAmount, 2);
          obj.investTime = C.formatDate(data[i].investDate, 'yyyy-MM-dd hh:mm:ss');
          vm.recordsList.push(obj);
        }
      }

      C.myAjax(option, successCallBack);
    }
  },
  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.productId = params.productId;
    vm.getInvestRecords();
  }
});
