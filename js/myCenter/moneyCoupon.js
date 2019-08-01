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
      window.location.href = "asset_index.html"
    },

    getCouponList: function() {
      var vm = this;
      var url = "/api/gift/coupon-money";
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
    vm.getCouponList();
    vm.notCanUseCouponList = [];
  }
});
