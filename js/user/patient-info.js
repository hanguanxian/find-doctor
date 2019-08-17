var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: '#patient-info-container',
  data: {
    switchOpen: true,
  },
  methods: {
    sendSms: function() {
      var vm = this;
    },
    reg: function() {
      var vm = this;
    }
  },
  mounted: function() {
    var param = C.getUrlParam();
  }
});
