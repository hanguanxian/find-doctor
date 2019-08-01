var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var vm = new Vue({
  el: '#try-cash-container',
  data: {
    canUseCouponList: [],
    notCanUseCouponList: [],
    type: null
  },
  methods: {
		formatFloat: function(val){
			return C.rateFormat(val);
		},
    btnBack: function() {
      var vm = this;
      if(vm.type=="history") {
        window.location.href = "rateCoupon.html"
      } else {
        window.location.href = "asset_index.html"
      }
    },
    goHistory: function(val){
			window.location.href = "rateCoupon.html?type=history"
		},
    getHistory: function() {
      var vm = this;
      var url = "/api/gift/history/coupon-rate";
      C.myAjax({
          url: url,
          type: "POST"
        },function(data) {
          vm.notCanUseCouponList = data.list;
        }
      );
    },
    getCouponList: function() {
      var vm = this;
      var url = "/api/gift/coupon-rate";
      C.myAjax({
          url: url,
          type: "POST"
        },function(data) {
          vm.canUseCouponList = data.list;
        }
      );
    }
  },
  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.type = params.type;
    if(vm.type == "history") {
      vm.getHistory();
      vm.canUseCouponList = [];
    } else {
      vm.getCouponList();
      vm.notCanUseCouponList = [];
    }
  }
});
