var Vue = require("vue");
var $ = require("jquery");
var C = require("common");
var weui = require('weui.js');

var index_vm = new Vue({
  el: "#consultation-container",
  data: {
    search: "",
    departmentList: [{
      department: "妇科",
      symptoms:["月经不调","不孕症","更年期综合症","痛经","子宫内膜异位症","妇科炎症","妇科肿瘤"]
    },{
      department: "皮肤科",
      symptoms:["脱发病","银屑病","皮肤真菌病","湿疹","荨麻诊","色斑黄褐斑"]
    },{
      department: "儿科",
      symptoms:["小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽"]
    },{
      department: "妇科",
      symptoms:["月经不调","不孕症","更年期综合症","痛经","子宫内膜异位症","妇科炎症","妇科肿瘤"]
    },{
      department: "皮肤科",
      symptoms:["脱发病","银屑病","皮肤真菌病","湿疹","荨麻诊","色斑黄褐斑"]
    },{
      department: "儿科",
      symptoms:["小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽","小儿咳嗽"]
    }]
  },
  methods: {
    submit: function(i,j) {
      const self = this
      weui.dialog({
        content: '就诊人信息尚未完整，即将跳转到就诊人信息填写页面',
        className: 'custom-classname',
        buttons: [{
            label: '取消',
            type: 'default',
            onClick: function () { alert('取消') }
        }, {
            label: '确定',
            type: 'primary',
            onClick: function () { alert('确定') }
        }]
    });
    
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
