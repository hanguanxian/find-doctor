var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var vm = new Vue({
  el: '#fixed_productDtls_container',
  data: {
    beginDateStr: null,
    endDateStr: null,
    investDays: null,
    activityDays: null,
    minInvestAmount: null,
    activityRateStr: null,
    basicRateStr: null,
    basicRate: null,
    activityRate: null,
    activityLabel: null,
    barStatus: false,
    productId: null,
    state: null,
    leftAmount: null,
    totalAmount: null,
    productContent: null,
    investmentRatio: null,
    productName: null,
    safeOperateDay: 1107,
    tagList: [],
    sprogTag: null
  },
  methods: {
    getSafety: function() {
      var vm = this;
      C.myAjax({
          url: '/api/system/safeOperateDay',
          type: "GET"
        },
        function(data) {
          vm.safeOperateDay = data.safeOperateDay;
        }
      );
    },
    getAjaxData: function() {
      var vm = this;
      C.myAjax({
          url: '/api/fixed-income/detail?productId=' + vm.productId,
          type: "GET"
        },
        function(data) {
          document.title = data.productName;
          vm.productName = data.productName;
          vm.activityLabel = data.activityLabel;
          vm.basicRate = data.basicRate;
          vm.activityRate = data.activityRate;
          vm.basicRateStr = parseFloat(C.NumberFixed(data.basicRate * 100, 2));
          vm.activityRateStr = parseFloat(C.NumberFixed(data.activityRate * 100, 2));
          vm.minInvestAmount = C.moneyFormat(data.minInvestAmount, 0);
          vm.activityDays = data.activityDays;
          vm.investDays = data.investDays;
          vm.beginDateStr = C.formatDate(data.beginDate, 'yyyy-MM-dd');
          vm.endDateStr = C.formatDate(data.endDate, 'yyyy-MM-dd');
          vm.investmentRatio = parseInt(data.investmentRatio);
          if(data.state == 500){
  					vm.investmentRatio = 100;
  				}
          vm.state = data.state;
          vm.leftAmount = data.overageAmount || 0;
          vm.totalAmount = data.fixedAmount || 0;
          vm.productContent = data.productContent || 0;
          vm.tagList = data.tagList || [];
          for(var i=0; i< vm.tagList.length; i++) {
            if(vm.tagList[i].displayType == 100) {
              vm.sprogTag = vm.tagList[i];
              vm.tagList.splice(i,1);
            }
          }
          vm.setProgressBar(data);
        },
        function(data) {
          alert(data);
        }
      );
    },
    setProgressBar: function() {
      var vm = this;
      var per = vm.investmentRatio;
      if (per < 0) {
        per = 0;
      } else if (per > 100) {
        per = 100;
      }
      if (per > 10 && vm.state == 400) {
        vm.barStatus = true;
      } else if (vm.state == 300) {
        vm.barStatus = false;
        per = 0;
      } else if (vm.state == 500) {
        vm.barStatus = true;
        per = 100;
      }
      $(".currentProgress").css("width", per + '%');
    }
  },
  mounted: function() {
    var vm = this;
    var params = C.getUrlParam();
    vm.productId = params.productId;
    vm.getAjaxData();
    vm.getSafety();
  }
});

$(function() {
  $('.openDes span').click(function() {
    if ($(this).attr("s") == "open") {
      $(this).attr("s", "close");
      $(this).html("收起");
      $('.upArrow').show();
      $('.downArrow').hide();
      $('.intro').css("height", "auto");
    } else {
      $(this).attr("s", "open");
      $(this).html("展开");
      $('.upArrow').hide();
      $('.downArrow').show();
      $('.intro').css("height", "20px");
    }
  })
})
