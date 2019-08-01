var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var vm = new Vue({
  el: '#fixed-invest-failure',
  data: {
    productId: null
  },
  methods: {
    reBuy: function() {
      window.location.href = "fixed_invest_money.html?productId=" + vm.productId;
    },
    toIndexPage: function() {
      window.location.href = "../../home.html";
    }
  },
  mounted: function() {
    // 计息时间
    var vm = this;
    var params = C.getUrlParam();
    vm.productId = params.productId;
  }
});
