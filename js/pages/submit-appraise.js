var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: "#appraise-container",
  data: {
    stars: 0,
  },
  methods: {
    seleted: function(i,j) {
      const self = this
      
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
