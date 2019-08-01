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
    selectCoupon: function(autoId, amount) {
      C.storage.set("principalCouponId", autoId);
			C.storage.set("principalCouponval", amount);
      window.location.href = "fixed_invest_money.html?productId=" + vm.targetId + "&investMoney=" + vm.buyAmount + "&from=tyj";
    },
    unSelectCoupon: function() {
      C.storage.set("principalCouponId", "");
			C.storage.set("principalCouponval", "");
      window.location.href = "fixed_invest_money.html?productId=" + vm.targetId + "&investMoney=" + vm.buyAmount + "&from=tyj";
    },
    getCouponList: function() {
      var vm = this;
      var url = "/api/gift/coupon-principal/invest?targetId=" + vm.targetId + "&buyAmount=" + vm.buyAmount;
      C.myAjax({
          url: url,
          type: "GET"
        },function(data) {
          vm.canUseCouponList = data.canUsePrincipalCouponList;
          vm.notCanUseCouponList = data.notCanUsePrinicipalCouponList;
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
