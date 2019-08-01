var $ = require("jquery");
var C = require("common");
var Vue = require("vue");

new Vue({
    el: '#product-info-container',
    data:{
        targetName : null,//产品名称
        targetAmount : null,//产品规模
        investDays : null,//产品期限
        minAmount : null,//起购金额
        yearRate : null,//年化收益
        beginDateStr : null,//起息日
        endDateStr : null,//到期日
        productId: null
    },
    methods : {
        getProductInfo: function(){
        	var vm = this;
    		var option = {
    			url: '/api/fixed-income/dq-content?targetId='+vm.productId,
                type : "GET"
    		}
    		var successCallBack = function(data){
				vm.targetName = data.targetName;
				vm.targetAmount = parseInt(data.targetAmount)/10000;
				vm.investDays = data.investDays;
				vm.minAmount = parseInt(data.minAmount);
				vm.yearRate = parseFloat(C.NumberFixed(data.yearRate*100,2))
				vm.beginDateStr = C.formatDate(data.beginDate,'yyyy-MM-dd');
				vm.endDateStr = C.formatDate(data.endDate,'yyyy-MM-dd');
    		}

    		C.myAjax(option,successCallBack);
    	},
      gobackStep: function(){
      	window.location.href = "fixed_product_details.html?productId=" + vm.productId;
      }
    },
    mounted: function () {
      var vm = this;
      vm.productId = C.getUrlParam().productId;
      this.getProductInfo();
    }
});
