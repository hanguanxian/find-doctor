var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var busRecord_vm = new Vue({
  el: '#business_record_container',
  data: {
    apiUrl: '/api/asset/trade-record/',
    index: 1,
    type: "全部",
    listData: [],
    selectGou: false,
    moreFlag: true,
    menuOpen: false
  },
  methods: {
    init: function() {
      var height = $(window).height();
      var headHeight = $(".header").height();
      $(".business_record_container").css("height", height);
      $(".record_body").css({
        "height": height - headHeight
      });
    },
    switchMenu: function() {
      var vm = this;
      if (!vm.menuOpen) {
        vm.menuOpen = true;
        $(".record_body").show();
      } else {
        vm.menuOpen = false;
        $(".record_body").hide();
      }
    },
    openRecord: function(type) {
      var vm = this;
      vm.menuOpen = false;
      $(".record_body").hide();
      vm.getAjaxData(type);
      $('.record_title').html(type);
    },
    getAjaxData: function(type,index) {
      var vm = this;
      if(!vm.moreFlag) {
        return;
      } else {
        vm.moreFlag = false;
      }
      if(type != vm.type) {
        vm.listData = [];
        vm.type = type;
        $(".more-click").show();
        vm.index = 1;
      }
      if(index) {
        vm.index = index + 1;
      } else {
        vm.index = 1;
      }
      C.myAjax({
        url: vm.apiUrl + vm.index + "?type=" + type,
        type: "GET",
      }, function(data) {
        vm.moreFlag = true;
        vm.listData = vm.listData.concat(data.tradeRecords);
        if(data.tradeRecords.length < 20) {
          $(".more-click").hide();
        }
      }, function(data) {
        alert(data);
      });
    }
  },
  mounted: function() {
    this.init();
    this.getAjaxData('全部');
  }
})
