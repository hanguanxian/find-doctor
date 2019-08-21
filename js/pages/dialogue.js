var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: '#dialogue-container',
  data: {
    doctorAvatar: "../../img/avatar.png",
    userAvatar: "../../img/avatar2.png",
    dialogueList: [{
      type: "text",
      isMine: false,
      content:"你好"
    },{
      type: "text",
      isMine: true,
      content:"不舒服不舒服不舒服不舒服不 舒服不舒服"
    },{
      type: "img",
      isMine: true,
      content:"https://cn.vuejs.org/images/logo.png"
    },{
      type: "link",
      isMine: true,
      content: {
        linkImg: "https://cn.vuejs.org/images/logo.png",
        linkTitle:"请进一步填写问诊单",
        linkDesc:"方便我对您的病情有一个初步的判断，点击填写",
      }
    },{
      type: "link",
      isMine: true,
      content: {
        linkImg: "https://cn.vuejs.org/images/logo.png",
        linkTitle:"赵某某医生的建议方",
        linkDesc:"2019/06/24 19:06",
      }
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
