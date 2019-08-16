var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: '#advice-list-container',
  data: {
    doctorList: [{
      name:'赵医生',
      serviceType: 1,//图文咨询
      doctorPosition: "主任医师",
      department: "皮肤科",
      hospital: "合肥市蜀山区XX医院",
      desc: "擅长：皮肤性病、乳腺病、痤疮、湿疹、瘙痒症、银屑 病、白癜风、黄褐斑、乳腺增生、带状孢疹、荨麻疹"
    },{
      name:'赵医生',
      serviceType: 2,//图文咨询
      doctorPosition: "主任医师",
      department: "皮肤科",
      hospital: "合肥市蜀山区XX医院",
      desc: "擅长：皮肤性病、乳腺病、痤疮、湿疹、瘙痒症、银屑 病、白癜风、黄褐斑、乳腺增生、带状孢疹、荨麻疹"
    },{
      name:'赵医生',
      serviceType: 1,//图文咨询
      doctorPosition: "主任医师",
      department: "皮肤科",
      hospital: "合肥市蜀山区XX医院",
      desc: "擅长：皮肤性病、乳腺病、痤疮、湿疹、瘙痒症、银屑 病、白癜风、黄褐斑、乳腺增生、带状孢疹、荨麻疹"
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
