var Vue = require("vue");
var C = require("common");
var $ = require("jquery");

var index_vm = new Vue({
  el: '#user-authentication-container',
  data: {
    name: null,
    idCardNo: null,
    nameFlag: false,
    idFlag: false
  },
  watch : {
    name : function(val){
      this.nameFlag = C.checkInput.validateName(val, 'regBtn');
      C.checkInput.combinedCheck(this.nameFlag, this.idFlag, true, true, 'regBtn',"#F66B12","#868c90");
    },
    idCardNo : function(val){
      this.idFlag = C.checkInput.validateIdentityCard(val, 'regBtn');
      C.checkInput.combinedCheck(this.nameFlag, this.idFlag, true, true, 'regBtn',"#F66B12","#868c90");
    }
  },
  methods: {
    submit: function() {
      var vm = this;
      var params = C.getUrlParam();
      C.myAjax({
        url: "/api/auth/identity-verification",
        type: "POST",
        data: JSON.stringify({
          name: vm.name,
          idCardNo: vm.idCardNo
        })
      }, function(data) {
        if(data.result) {
          window.location.href = "forgetPayWord.html?pageType=idresetpsd&name=" + vm.name + "&idCardNo=" + vm.idCardNo;
        }
      });
    }
  },
  mounted: function() {
    var vm = this;

  }
});
