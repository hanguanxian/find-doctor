var Vue = require("vue");
var $ = require("jquery");
var C = require("common");
var weui = require('weui.js');

var index_vm = new Vue({
  el: '#patient-info-container',
  data: {
    switchOpen: true,
    gender: null,
    birtyday: null,
    credentialType: null,
  },
  methods: {
    selectGender: function() {
      var vm = this;
      weui.actionSheet([
            {
                label: '男',
                onClick: function () {
                  vm.gender = "男";
                }
            }, {
                label: '女',
                onClick: function () {
                  vm.gender = "女";
                }
            }
        ]);
    },
    IDType: function() {
      var vm = this;
      weui.actionSheet([
        {
            label: '身份证',
            onClick: function () {
              vm.credentialType = "身份证";
            }
        }, {
            label: '护照',
            onClick: function () {
              vm.credentialType = "护照";
            }
        }
    ]);
    },
    selectBirthday: function () {
      var vm = this;
      weui.datePicker({
        start: 1950, // 从今天开始
        end: 2030,
        defaultValue: [1990, 6, 9],
        onConfirm: function(result){
            vm.birtyday = result[0].label + result[1].label + result[2].label
        }
    });
    }
  },
  mounted: function() {
    var param = C.getUrlParam();
  }
});
