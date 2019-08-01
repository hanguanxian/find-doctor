var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

new Vue({
  el: '#overview',
  data: {
    mainContentHtml: null,
    productId: null
  },
  methods: {
    getContentHtml: function() {
      var vm = this;
      var option = {
        url: '/api/fixed-income/dq-desc?targetId=' + vm.productId,
        type: "GET"
      }
      var successCallBack = function(data) {
        vm.mainContentHtml = data.desc;
      }

      C.myAjax(option, successCallBack);
    },
  },
  mounted: function() {
    var params = C.getUrlParam();
    this.productId = params.productId;
    this.getContentHtml();
  }
});
