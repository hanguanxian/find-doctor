var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

new Vue({
  el: '#borrower-container',
  data: {
    productId: null,
    detail: null,
    desc: null
  },
  methods: {
    getContentHtml: function() {
      var vm = this;
      C.myAjax({
        url: '/api/fixed-income/bozer-info?targetId=' + vm.productId,
        type: "GET"
      }, function(data) {
        vm.detail = data;
      });
    },
    getDesc: function() {
      var vm = this;
      C.myAjax({
        url: '/api/fixed-income/dq-desc?targetId=' + vm.productId,
        type: "GET"
      }, function(data) {
        vm.desc = data.desc;
      });
    }
  },
  mounted: function() {
    var params = C.getUrlParam();
    this.productId = params.productId;
    this.getContentHtml();
    this.getDesc();
  }
});
