var Vue = require("vue");
var $ = require("jquery");
var C = require("common");

var index_vm = new Vue({
  el: '#evaluate-container',
  data: {
    evaluateList: [{
      name:'赵**',
      star: 5,//
      tag: ['耐心认真',"经验丰富","回复很快"],
      desc: "回复问题及时，解答清晰且耐心认真，责任心强。非常满意！感谢赵医生百忙之中抽时间帮助我。祝全家幸福快乐！",
      datetime: "2019-07-01  16:09",
    },{
      name:'赵**',
      star: 4,//
      tag: ['耐心认真',"经验丰富","回复很快"],
      desc: "回复问题及时，解答清晰且耐心认真，责任心强。非常满意！感谢赵医生百忙之中抽时间帮助我。祝全家幸福快乐！",
      datetime: "2019-07-01  16:09",
    },{
      name:'赵**',
      star: 3,//
      tag: ['耐心认真',"经验丰富","回复很快"],
      desc: "回复问题及时，解答清晰且耐心认真，责任心强。非常满意！感谢赵医生百忙之中抽时间帮助我。祝全家幸福快乐！",
      datetime: "2019-07-01  16:09",
    },{
      name:'赵**',
      star: 2,//
      tag: ['耐心认真',"经验丰富","回复很快"],
      desc: "回复问题及时，解答清晰且耐心认真，责任心强。非常满意！感谢赵医生百忙之中抽时间帮助我。祝全家幸福快乐！",
      datetime: "2019-07-01  16:09",
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
