var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

var vm = new Vue({
  el: '#buy-fixedPro-container',
  data: {
    investInfoUrl: "/api/trade/invest-info?targetId=", //获取标地信息
    checkBindUrl: "/api/payment-bank-card/recharge-check-bind", //校验是否绑卡
    computeUrl: "/api/trade/expected-earning", //计算接口
    creatOrder: "/api/trade/invest-order", //创建订单
    buyTargetUrl: "/api/trade/buy-target",
    productId: null, //产品ID
    productInfo: {}, //产品信息
    agreeFlag: true, //是否阅读须知
    earnNum: 0, //预期收益
    isBindCard: true,//是否绑卡
    errorMsg: "",//错误信息
    chargeNum: null,
    rateCouponId: null,
    principalCouponId: null,
    rateCouponVal: null,
    principalCouponval: null,
    canUseRateCount: 0,//能使用加息券数量
    canUsePrincipalCount: 0,//能使用体验金数量
    joinActType: null,
    investMoney: null, //投资金额
    overlayShow: false
  },
  watch: {
    investMoney: function(val) {
      var vm = this;
      vm.errorMsg = "";
      if (!vm.investMoney || vm.investMoney > vm.productInfo.remainAmount) {
        vm.errorMsg = "产品的购买金额大于剩余可售金额";
      }
      if (!vm.investMoney || vm.investMoney < vm.productInfo.minAmount) {
        vm.errorMsg = "产品的购买金额小于最小购买金额";
      }
      if((vm.investMoney - vm.productInfo.minAmount) % vm.productInfo.unitAmount != 0){
        vm.errorMsg = '投资金额需为'+ vm.productInfo.unitAmount +'的整数倍';
      }

      C.myAjax({
          url: vm.computeUrl,
          type: "POST",
          data: JSON.stringify({
            targetId: vm.productId,
            buyAmount: vm.investMoney,
            rateCouponId: vm.rateCouponId,
            principalCouponId: vm.principalCouponId,
          })
        },
        function(data) {
          vm.earnNum = data.expectedEarning || 0;
          vm.canUseRateCount = data.canUseRateCount || 0;
          vm.canUsePrincipalCount = data.canUsePrincipalCount || 0;
          vm.rateCouponAmount = 0;
          vm.principalAmount = 0;
        },function(data) {}
      );
    },
    agreeFlag: function(val){
      if(!val) {
        this.errorMsg = "请先阅读并同意产品合同";
      } else {
        this.errorMsg = "";
      }
    }
  },
  methods: {
    submit:function(){
      var vm = this;
      C.myAjax({
          url: vm.creatOrder,
          type: "POST",
          data: JSON.stringify({
            targetId: vm.productId,
            investAmount: vm.investMoney,
            rateCouponId: vm.rateCouponId || null,
            principalCouponId: vm.principalCouponId || null,
            exchangeCouponId: null
          })
        },
        function(data) {
          if(data.investmentOrderId) {
            C.storage.set("rateCouponId", "");
      			C.storage.set("rateCouponVal", "");
            C.storage.set("principalCouponId", "");
      			C.storage.set("principalCouponval", "");
            window.location.href="fixed_invest_pay.html?id="+ data.investmentOrderId + "&productId=" +vm.productId + "&productName="+ vm.productInfo.targetName;
            //vm.submitOrder(data.investmentOrderId);
          } else {
            alert("创建订单失败！");
          }
        },function(data) {
          alert(data);
        }
      );
    },
    buyForward: function() {
      var vm = this;
      if (!vm.agreeFlag) {
        vm.errorMsg = "请先阅读并同意产品合同";
        return;
      }
      if (!vm.investMoney || vm.investMoney > vm.productInfo.remainAmount) {
        vm.errorMsg = "产品的购买金额大于剩余可售金额";
        return;
      }
      if (!vm.investMoney || vm.investMoney < vm.productInfo.minAmount) {
        vm.errorMsg = "产品的购买金额小于最小购买金额";
        return;
      }
      if((vm.investMoney - vm.productInfo.minAmount) % vm.productInfo.unitAmount != 0){
        vm.errorMsg = '投资金额需为'+ vm.productInfo.unitAmount +'的整数倍';
        return;
      }
      if(vm.joinActType == 3 && ((!vm.rateCouponId && vm.canUseRateCount > 0 ) || (!vm.principalCouponId && vm.canUsePrincipalCount > 0))) {
        vm.overlayShow = true;
        return;
      } else if(vm.joinActType == 1 && !vm.rateCouponId && vm.canUseRateCount > 0) {
        vm.overlayShow = true;
        return;
      } else if(vm.joinActType == 2 && !vm.principalCouponId && vm.canUsePrincipalCount > 0) {
        vm.overlayShow = true;
        return;
      } else if(vm.joinActType == -1 && !vm.principalCouponId && !vm.rateCouponId && (vm.canUseRateCount > 0 || vm.canUsePrincipalCount > 0)) {
        vm.overlayShow = true;
        return;
      } else {
        vm.submit();
      }

    },
    submitOrder: function(investmentOrderId){
      var vm = this;
      C.myAjax({
          url: vm.buyTargetUrl,
          type: "POST",
          data: JSON.stringify({
            investmentOrderId: investmentOrderId
          })
        },
        function(data) {
          if(data.result) {
            window.location.href = "fixed_invest_success.html?productId=" + vm.productId + "&investmentOrderId=" + data.investmentOrderId;
          } else {
            window.location.href = "fixed_invest_failure.html?productId=" + vm.productId;
          }
        },function(data) {
          alert(data);
        }
      );
    },
    goBack: function(){
      C.storage.set("rateCouponId", "");
      C.storage.set("rateCouponVal", "");
      C.storage.set("principalCouponId", "");
      C.storage.set("principalCouponval", "");
      window.location.href = "fixed_product_details.html?productId=" + this.productId;
    },
    bindCard: function() {
      C.storage.set("rateCouponId", "");
      C.storage.set("rateCouponVal", "");
      C.storage.set("principalCouponId", "");
      C.storage.set("principalCouponval", "");
      window.location.href = "../../myCenter/bindCard.html?productId=" + this.productId;
    },
    formatFloat: function(val){
			return C.NumberFixed(val * 100, 2);
		},
    getProductInfo: function() {
      var vm = this;
      var params = C.getUrlParam();
      C.myAjax({
          url: vm.investInfoUrl + vm.productId,
          type: "GET"
        },
        function(data) {
          vm.productInfo = data;
          vm.productInfo.yearRate = parseFloat(C.NumberFixed(data.yearRate * 100, 2));
          vm.productInfo.activityRate = parseFloat(C.NumberFixed(data.activityRate * 100, 2));
          vm.userBalance = C.NumberFixed(vm.userBalance, 2);
          vm.joinActType = data.joinActType;
          vm.setJoinActType();
          if(params.investMoney) {
            vm.investMoney = params.investMoney;
          } else {
            vm.investMoney = vm.productInfo.minAmount;
          }

        },function(data) {
          alert(data);
        }
      );
    },
    setJoinActType: function(){
      var vm = this;
      if(vm.joinActType == 1) {
        vm.principalCouponId = null;
        vm.principalCouponval = null;
      } else if(vm.joinActType == 2) {
        vm.rateCouponId = null;
        vm.rateCouponVal = null;
      } else if(vm.joinActType == -1) {
        if(vm.from == "tyj") {
          vm.rateCouponId = null;
          vm.rateCouponVal = null;
        } else if(vm.from == "jxq") {
          vm.principalCouponId = null;
          vm.principalCouponval = null;
        }
      } else if(vm.joinActType == 0) {
        vm.principalCouponId = null;
        vm.principalCouponval = null;
        vm.rateCouponId = null;
        vm.rateCouponVal = null;
      }
    },
    isBindCard: function() {
      var vm = this;
      C.myAjax({
          url: vm.checkBindUrl,
          type: "GET"
        },function(data) {
          vm.isBindCard = data.isBindCard;
        }
      );
    }
  },

  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.from = params.from;
    vm.productId = params.productId;
    vm.rateCouponId = C.storage.get("rateCouponId");
    vm.principalCouponId = C.storage.get("principalCouponId");
    vm.rateCouponVal = C.storage.get("rateCouponVal") || 0;
    vm.principalCouponval = C.storage.get("principalCouponval") || 0;
    vm.getProductInfo();
    vm.isBindCard();
    // this.getUserAccount();
    // this.getUserInfo();
    // this.setBuyAmount();
  }
});
