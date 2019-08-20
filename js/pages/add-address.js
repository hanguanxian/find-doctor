var Vue = require("vue");
var $ = require("jquery");
var C = require("common");
var weui = require('weui.js');

var index_vm = new Vue({
  el: '#add-address-container',
  data: {
    switchOpen: true,
    province: "",
    city:"",
    area:"",
  },
  methods: {
    selectProvince: function() {
      var vm = this;
      weui.picker([
        {
            label: '安徽',
            value: 0,
        },
        {
            label: '上海',
            value: 1
        }], {
          onConfirm: function (result) {
              console.log(result)
              vm.province = result[0].label
          }
        });
    },
    selectCity: function() {
      var vm = this;
      weui.picker([
        {
            label: '安徽',
            value: 0,
        },
        {
            label: '上海',
            value: 1
        }], {
          onConfirm: function (result) {
              console.log(result)
              vm.city = result[0].label
          }
        });
    },
    selectArea: function() {
      var vm = this;
      weui.picker([
        {
            label: '安徽',
            value: 0,
        },
        {
            label: '上海',
            value: 1
        }], {
          onConfirm: function (result) {
              console.log(result)
              vm.area = result[0].label
          }
        });
    }
  },
  mounted: function() {
    var param = C.getUrlParam();
  }
});
