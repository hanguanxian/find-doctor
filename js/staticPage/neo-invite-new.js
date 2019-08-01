var $ = require("jquery");
var Vue = require("vue");
var C = require("common");
//var sc = require("shareConf");

var vm = new Vue({
  el: '#invite',
  data: {
    inviteCode: "",
    inviteList:[],
    moreBtnShow: true,
    startTime: "",
    endTime: "",
    total: 0,
    page: 0,
    totalPrice: 0,
    size: 5
  },
  methods: {
    moreInvite: function() {
      const self = this;
      self.page = self.page + 1;
      self.getInviteList();
    },
    splitInviteCode: function(){
        return this.inviteCode.substring(0,3) + " " + this.inviteCode.substring(3,7) + " " + this.inviteCode.substring(7,11);
    },
    auth: function() {
      C.myAjax({
         url: '/api/auth',
         type: "POST",
         data: JSON.stringify({mobile:"15900722344",password:"111111"})
       },function(data){
         console.log(data);
       });
    },
    getInviteCode: function() {//获取邀请码
      var self = this;
      C.myAjax({
        url: '/api/act/invite/code',
        type: "GET"},
        function(result) {
          if(result.code == 0) {
            self.inviteCode = result.data.mobile;
            self.startTime = C.formatDate(result.data.startTime,"yyyy年MM月dd日");
            self.endTime = C.formatDate(result.data.endTime,"yyyy年MM月dd日");
          }
        }
      );

    },
    openOverlay: function(){
      $(".overlay").show();
      $(".share-wrapper").hide();
      $(".body").css("overflow","hidden");
    },
    closeOverlay: function(){
      $(".overlay").hide();
      $(".share-wrapper").show();
      $(".body").removeAttr("style");
    },
    shareApp: function(){
      var self = this;
      var shareTitle = "送你88888体验金礼包，还不快领？10.8%新手标包你满意！";
      var shareDescr = "我已在源码汇投资啦，一起来开启财富之旅吧~";
      var shareLink = window.location.origin + '/wx/neo-bank/html/user/register.html?inviteCode=' + self.inviteCode;
      var shareImgLink = window.location.origin + '/wx/neo-bank/img/logo.jpg' ;
      if(C.getDeviceinfo().ios){
        var obj = {"shareTitle":shareTitle,"shareDescr":shareDescr,"shareLink":shareLink,"shareImgLink":shareImgLink};
        window.webkit.messageHandlers.shareApp.postMessage(obj);
      } else if(C.getDeviceinfo().android){
        window.sh.shareApp(shareTitle,shareDescr,shareLink,shareImgLink);
      }
    },
    getInviteList: function() {//获取列表信息
      var self = this;
      C.myAjax({
        url: '/api/act/invite?page=' + self.page + "&size=" + self.size,
        type: "GET"},
        function(result) {
          if(result.code == 0) {
            if(result.data.list && result.data.list.length >= 0) {
              self.total = result.data.total;
              //console.log(self.total);
              self.totalPrice = result.data.totalPrice;
              self.inviteList = self.inviteList.concat(result.data.list);
              if(result.data.list.length < self.size || (self.page + 1) * self.size >= self.total) {
                //console.log((self.page + 1) * self.size);
                self.moreBtnShow = false;
              }
            }
          }
        }
      );

    }
  },
  mounted: function() {
    var self = this;
    self.getInviteCode();
    self.getInviteList();
    //sc.initWxShare();
  }
});
