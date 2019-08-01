var Vue = require("vue");
var C = require("common");
var $ = require("jquery");
var BaiduScript = require("baiduScript");

var totalAsset_vm = new Vue({
  el: '#setup_index_container',
  data: {
    accNo: null,
    mobile: null,
    realName: null,
    idCard: null,
    bankinfo: null,
    isBind: false,
    tradePassword: false,
    payWordUrl: "../user/forgetPayWord.html?pageType=resetpsd",
    bindUrl: null
  },
  methods: {
    logout: function() {
      C.myAjax({
        url: '/api/auth',
        type: "PUT",
      }, function(data){
        if(data.logoutResult) {
          C.storage.set("bindCardInfo", '');
          window.location.href = "../user/login.html";
        }
      });
    },
    ajaxData: function() {
      var vm = this;
      C.myAjax({
        url: '/api/auth/user-center'
      }, function(data) {
        vm.accNo = data.bankAcctNo;
        vm.realName = data.realName;
        if(data.userMobile) {
          vm.mobile = data.userMobile.replace(data.userMobile.substr(3,4),"****");
        }
        vm.idCard = data.code;
        vm.bankinfo = data.bankinfo;
        vm.isBind = data.bind;
        vm.tradePassword = data.tradePassword;
        if(!vm.tradePassword) {
          vm.payWordUrl = '../user/forgetPayWord.html';
        }
        if(!vm.isBind) {
          vm.bindUrl = 'bindCard.html';
        }
      }, function(data) {
        alert(data);
      });
    }
  },
  mounted: function() {
    this.ajaxData();
  }
});
