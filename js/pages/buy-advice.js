var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: '#advice-container',
  data: {
    switchOpen: true,
  },
  methods: {
    sendSms: function() {
      var vm = this;
    },
    submit: function() {
      console.log(11);
      var vm = this;
    }
  },
  mounted: function() {
    var param = C.getUrlParam();
  }
});
