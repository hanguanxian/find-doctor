var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: "#inquiry-container",
  data: {
    questions: [{
      title: "体表感觉是怎么样？",
      seleted:[0,0,0,0,0],
      options:["正常","怕冷","怕风","怕热","发热"]
    },{
      title: "睡眠情况怎么样？",
      seleted:[0,0,0,0,0,0,0],
      options:["正常","入睡困难","醒后难以再入睡","容易被惊醒","容易被惊醒","睡觉流口水","做梦"]
    },{
      title: "体表感觉是怎么样？",
      seleted:[0,0,0,0,0],
      options:["正常","怕冷","怕风","怕热","发热"]
    },{
      title: "睡眠情况怎么样？",
      seleted:[0,0,0,0,0,0,0],
      options:["正常","入睡困难","醒后难以再入睡","容易被惊醒","容易被惊醒","睡觉流口水","做梦"]
    }]
  },
  methods: {
    check: function(i,j) {
      const self = this
      if(self.questions[i].seleted[j] == 1) {
        self.questions[i].seleted[j]  = 0
      } else {
        self.questions[i].seleted[j]  = 1
      }
      self.$set(self.questions,self.questions[i],self.questions[i])
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
