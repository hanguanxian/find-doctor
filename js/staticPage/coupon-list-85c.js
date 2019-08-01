var Vue = require("vue");
var C = require("common");

var vm = new Vue({
  el: '#coupon',
  data: {
    listType: "available",
    couponList:[]
  },
  methods: {
    auth: function() {
      C.myAjax({
         url: '/api/auth',
         type: "POST",
         data: JSON.stringify({mobile:"15618334836",password:"111111"})
       },function(data){
         console.log(data);
       });
    },
    goDetail: function(index) {
      var self = this;
      window.location.href="coupon-detail-85c.html?couponId="+ self.couponList[index].couponId + "&couponType=" + self.couponList[index].couponType;
    },
    goHistory: function(index) {
      window.location.href="coupon-list-85c.html?listType=history";
    },
    getCouponList: function(listType) {//获取邀请码
      var self = this;
      C.myAjax({
        url: '/api/act-85coffee/list?listType=' + listType,
        type: "GET"},
        function(result) {
          self.couponList = result.user85CoffeeCouponList;
        }
      );
    }
  },
  mounted: function() {
    var self = this;
    self.listType = C.getUrlParam().listType || "available";
    if(self.listType == "history") {
      document.title = "历史优惠券";
    }
    self.getCouponList(self.listType);
  }
});
