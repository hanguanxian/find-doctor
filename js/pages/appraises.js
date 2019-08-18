var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: '#appraises-container',
  data: {
    tab1Flag: true,//tab切换
    ordersList: [{
      price: 5.4
    },{
      price: 5.4
    },{
      price: 5.4
    }],
  },
  methods: {
    sendSms: function() {
     
    },
    reg: function() {
      var vm = this;
      C.myAjax({
        url: vm.regApiUrl,
        type : "POST",
        headers:{
           "From-Channel": vm.fromChannel,
           "From-Client": "h5"
        },
        data: JSON.stringify({
          aa:11
        })
      }, function(data) {
        if(data.result) {
        }
      });
    }
  },
  mounted: function() {

  }
});
