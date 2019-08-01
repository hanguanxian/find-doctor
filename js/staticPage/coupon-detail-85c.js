var Vue = require("vue");
var C = require("common");

var vm = new Vue({
  el: '#coupon',
  data: {
    couponId: "",
    couponType: "",
    explains: [],
    barImg: "",
    coupon: {}
  },
  methods: {
    getBarCode: function() {
      var self = this;
      C.myAjax({
        url: '/api/barcode?msg=' + self.couponId,
        type: "GET"},
        function(result) {
          self.barImg = "data:image/png;base64," + result.barcodeBase64;
        }
      );
    },
    getDetail: function() {
      var self = this;
      C.myAjax({
        url: '/api/act-85coffee/detail?couponId=' + self.couponId +"&couponType=" + self.couponType,
        type: "GET"},
        function(result) {
          self.coupon = result;
          self.explains = result.description.split("||");
        }
      );
    }
  },
  mounted: function() {
    var self = this;
    self.couponId = C.getUrlParam().couponId;
    self.couponType = C.getUrlParam().couponType;
    self.getDetail();
    self.getBarCode();
  }
});
