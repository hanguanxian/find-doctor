var C = require("common");
var Vue = require("vue");
var echarts = require("echarts");

var myVue = new Vue({
    el : '#totalAssets',
    data : {
  		main : {},
      dongjieDetailFlag: true,
      assets: {
        sum: 0,//总资产
        frozenSum: 0,//冻结金额
        totalAssets: 0,//定期理财
        totalAccount: 0,//账户余额
        frozenTotalAccount: 0//提现在途金额
      }
    },
    methods : {
    	init:function(){
    		var self = this;
        var sum = self.assets.sum || 0;
        var echartTitle = "总资产(元)";
        var data = [];
        var color = [];
        if(sum == 0) {
          data = [{value:  100, name:'总资产0.00元'}];
          color = ['#E0E4E7'];
        } else {
          color = ['#70cac4','#e6bf1a','#f4731f'];
          data = [
              {value: self.assets.frozenSum/sum * 100, name:'冻结金额' + self.assets.frozenSum},
              {value: self.assets.totalAccount/sum * 100, name:'可用余额:' + self.assets.totalAccount},
              {value: self.assets.totalAssets/sum * 100, name:('定期理财:' + self.assets.totalAssets)}
          ]
        }
        self.main = echarts.init(document.getElementById('main'));
        option = {
          title: {
              text: echartTitle,
              subtext: sum,
              x: '48.5%',
              y: '38%',
              textAlign: "center",
              textStyle: {
                  fontWeight: 'normal',
                  color: "#C1C3C7",
                  align: "center",
                  fontSize: 13
              },
              subtextStyle: {
                  fontWeight: 'bold',
                  align: "center",
                  fontSize: 22,
                  color: '#494949'
              }
          },
          color: color,
          series: [{
            	name:'总资产',
              type:'pie',
              radius: ['58%', '66%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              legendHoverLink: false,
              label: {
                  normal: { show: false },
                  emphasis: { show: false }
              },
              data:data
            }
          ]
        };
		    self.main.setOption(option);
      },
      auth: function() {
        C.myAjax({
           url: '/api/auth',
           type: "POST",
           data: JSON.stringify({mobile:"18638632761",password:"111111"})
         },function(data){
           console.log(data);
         });
      },
      getData: function() {//获取邀请码
        var self = this;
        C.myAjax({
          url: '/api/asset/asset-details',
          type: "GET"},
          function(result) {
            self.assets.sum = C.NumberFixed(result.totalAssets, 2) || 0;//总资产
            self.assets.totalAssets = C.NumberFixed(result.regularTotalAssets,2) || 0;//定期理财
            self.assets.totalAccount = C.NumberFixed(result.balanceTotalAccount,2) || 0;//账户余额
            self.assets.frozenTotalAccount = C.NumberFixed(result.frozenTotalAccount,2) || 0;//提现在途金额
            self.assets.frozenSum =  C.NumberFixed(result.frozenTotalAccount,2);
            self.init();
          }
        );
      },
      dongjieDetail: function(){
        var self = this;
        self.dongjieDetailFlag = !self.dongjieDetailFlag;
      },
      backApp : function(){
    		var  self = this;
    		self.returnParams();
    	},
    	returnParams : function(){
  			if(C.getDeviceinfo().ios){
  				window.webkit.messageHandlers.goback;
  			}else if(C.getDeviceinfo().android){
  				window.sh.result();
  			}
    	}
    },
    created: function() {
    	var self = this;
      self.getData();
    }
});
