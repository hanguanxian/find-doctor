var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#asset_index_container',
  data: {
    pswDisplay: false,
    apiUrl: '/api/asset/asset-details',
    totalAssets: null,//总资产
    regularTotalAssets: null,//定期理财
    regularTotalProfit: null,//累计收益
    totalAccount: null,//账户余额
    detail: {},
    value: true,
    isBindCard: false
  },
  methods: {
    init: function() {
      var vm = this;
      C.myAjax({
        type: "GET",
        url: vm.apiUrl
      }, function(data) {
        vm.detail = data;
        vm.totalAssets = C.NumberFixed(data.totalAssets, 2);//总资产
        vm.regularTotalAssets = C.NumberFixed(data.regularTotalAssets,2) || 0;//定期理财
        vm.regularTotalProfit = C.NumberFixed(data.regularTotalProfit,2) || 0;//累计收益
        vm.totalAccount = C.NumberFixed(data.totalAccount,2) || 0;//账户余额
      }, function(data) {
        alert(data);
      });
      C.myAjax({
        type: "GET",
        url: "/api/payment-bank-card/recharge-check-bind"
      }, function(data) {
        vm.isBindCard = data.isBindCard;
      }, function(data) {
        alert(data);
      });
    },
    assetSwitch: function(e) {
      e.cancelBubble || e.stopPropagation();
      this.pswDisplay = !this.pswDisplay;
      this.value = !this.value;
    }
  },
  mounted: function() {
    this.init();
  }
});
