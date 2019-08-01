var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var vm = new Vue({
  el: '#try-cash-container',
  data: {
    selectId: null,
    selectValue: null,
    canUseCouponList: [],
    notCanUseCouponList: [],
    targetId: null,
    buyAmount: null,
  },
  methods: {
		formatFloat: function(val){
			return C.NumberFixed(val * 100, 2);
		},
    selectCoupon: function(autoId, yearRate) {
      C.storage.set("rateCouponId", autoId);
			C.storage.set("rateCouponVal", yearRate);
      window.location.href = "fixed_invest_money.html?productId=" + vm.targetId + "&investMoney=" + vm.buyAmount + "&from=jxq";
    },
    unSelectCoupon: function() {
			C.storage.set("rateCouponId", "");
			C.storage.set("rateCouponVal", "");
      window.location.href = "fixed_invest_money.html?productId=" + vm.targetId + "&investMoney=" + vm.buyAmount + "&from=jxq";
    },
    getCouponList: function() {
      var vm = this;
      var url = "/api/gift/coupon-rate/invest?targetId=" + vm.targetId + "&buyAmount=" + vm.buyAmount;
      C.myAjax({
          url: url,
          type: "GET"
        },function(data) {
          vm.canUseCouponList = data.canUseRateCouponList;
          vm.notCanUseCouponList = data.notCanUseRateCouponList;
        },function(data) {}
      );
    }
  },
  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.targetId = params.productId;
    vm.buyAmount = params.investMoney || 0;
    vm.getCouponList();
  }
});
