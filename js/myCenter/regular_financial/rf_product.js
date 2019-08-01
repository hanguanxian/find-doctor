var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#rf_product_artical',
  data: {
    pswDisplay: false,
    apiUrl: '/api/user-asset-info/',
    value: true,
    ifMyPro: true,
    dquserId: "",
    productName: "", //产品名称
    expectedAmount: "", //预期收益
    buyAmount: "", //持有资产
    leftAmount: "", //代收本息
    basicAmount: "", //预期基本收益
    actAmount: "", //预期活动收益
    endDate: "", //到期日期
    allDay: "", //投资期限
    buyDate: "", //投资时间
    yearRate: "", //预期年化收益
    rateAmount: "",
    principalAmount: "",
    detail: {},
    dialogShow: false,
    dquserId: ""
  },
  methods: {
    getAjaxData: function() {
      var vm = this;
      C.myAjax({
        url: "/api/asset/dq-detail?dqUserId=" + vm.dquserId,
        type: "GET"
      }, function(data) {
        vm.detail = data;
        vm.productName = data.productName;
        vm.expectedAmount = C.NumberFixed(data.expectedAmount, 2) || 0;
        vm.buyAmount = C.NumberFixed(data.buyAmount, 2) || 0;
        vm.leftAmount = C.NumberFixed(data.expectedAmount + data.buyAmount, 2) || 0;
        vm.basicAmount = C.NumberFixed(data.basicAmount, 2) || 0;
        vm.actAmount = C.NumberFixed(data.actAmount, 2) || 0;
        vm.rateAmount = C.NumberFixed(data.rateAmount, 2) || 0;
        vm.principalAmount = C.NumberFixed(data.principalAmount, 2) || 0;
        vm.allDay = data.day;
        vm.yearRate = C.NumberFixed(data.basicRate * 100, 2) || 0;
        vm.endDate = data.endDate;
        vm.buyDate = data.buyDate;
      }, function(data) {
        alert(data);
      });
    },
    formatRate: function(value) {
			return C.rateFormat(value);
		},
    formatFloat: function(val) {
      return C.NumberFixed(val, 2);
    },
    showDetailbenifit: function(dialogShow) {
      var vm = this;
      if (!dialogShow) {
        if(!vm.detail.hasRateExtend && !vm.detail.hasPrincipalExtend && !vm.detail.hasTargetExtend) {
          return;
        }
        vm.dialogShow = true;
      } else  {
        vm.dialogShow = false;
      }
    },
    pageToContact: function() {
      window.location.href = '../../contract/pdt_contract_dq.html?dqUserId=' + this.dquserId;
    }
  },

  mounted: function() {
      var parms = C.getUrlParam();
      //var proId = parm.product;
      var type = parms.type;
      this.dquserId = parms.dquserId;
      if (type == "product") {
        this.ifMyPro = true;
      } else if (type == "history") {
        this.ifMyPro = false;
      }
      this.getAjaxData();
    }
});
