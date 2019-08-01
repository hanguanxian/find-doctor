var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#rf_index_artical',
  data: {
    pswDisplay: false,
    value: true,
    tab_showTab1: true,
    totalAsset: 0,
    totalProfit: 0,
    type: '',
    myProducts: [],
    hisProducts: []
  },
  methods: {
    getNowData: function() {
      var vm = this;
      C.myAjax({
        url: '/api/asset/dq',
        type: "GET",
      }, function(data) {
        console.log(data);
        vm.totalAsset = C.NumberFixed(data.totalAsset, 2) || 0;
        vm.totalProfit = C.NumberFixed(data.totalProfit, 2) || 0;
        var unfinishedList = data.dqUserAssetUnfinishedList;
        var finishedList = data.dqUserAssetFinishedList;
        vm.myProducts = unfinishedList.concat(finishedList);
      }, function(data) {
        alert(data);
      });
    },
    formatFloat: function(val){
			return C.NumberFixed(val, 2) || 0;
		},
    getHistoryData: function() {
      var vm = this;
      C.myAjax({
        url: '/api/asset/dq-history',
        type: "GET",
      }, function(data) {
        vm.hisProducts = data.dqUserAssetList;
      }, function(data) {
        alert(data);
      });
    },
    goBack: function() {
      var vm = this;
      if(vm.type=="history") {
        window.location.href = 'rf_index.html';
      } else {
        window.location.href = '../asset_index.html';
      }
    },
    showMyProcDetail: function(id,state) {
      if(state =='待支付') {
        alert("请到APP查看详情");
        return;
      }
      window.location.href = 'rf_product.html?type=product&dquserId=' + id;
    },
    showHisProcDetail: function(id) {
      window.location.href = 'rf_product.html?type=history&dquserId=' + id;
    }
  },

  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.type = params.type;
    if(vm.type=="history") {
      vm.getHistoryData();
      $("#head-title").text("历史资产")
    } else {
      vm.getNowData();
    }
  }
});
