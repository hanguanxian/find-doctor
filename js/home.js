var Vue = require("vue");
var C = require("common");
var $ = require("jquery");
var Swiper = require("swiper");
//var IScroll = require("iScroll");

var index_vm = new Vue({
  el: '#index-main-container',
  data: {
		products: [],
		banners: [],
    promotions: [],
    announcements: [],
    mySwiper2: {},
    activityBanner: {},
    isLogin: false
  },
  methods: {
		formatRate: function(value) {
			return C.rateFormat(value);
		},
		formatDate: function(value) {
      var now = new Date().getTime();
      // if(value > now && value - now <= 60*60*1000) {
      //   var countDown = (value - now)/1000;
      //   var minute = parseInt(countDown/60);
      //   minute = minute < 10 ? '0' + minute : minute;
      //   var second = parseInt(countDown % 60);
      //   second = second < 10 ? '0' + second : second;
      //   var countDownStr = "00:" + minute + ":" + second + "后";
      //   return countDownStr;
      // } else
      if(C.formatDate(value,"yyyy年MM月dd日") == C.formatDate(now,"yyyy年MM月dd日")){
        return C.formatDate(value,"hh:mm:ss");
      } else {
        return C.formatDate(value,"MM月dd日");
      }
		},
    getAjaxData: function() {
      var vm = this;
      C.myAjax({
				type: "GET",
        url: '/api/index'
      }, function(data) {
        vm.banners = data.banners;
        vm.promotions = data.promotions;
        vm.announcements = data.announcements;
        vm.activityBanner = data.activityBanners[0] || '';
				vm.initBanner();
        vm.initPromotions();
        //vm.initAnnouncements();
				vm.products = data.products;
				if (vm.promotions.length == 0) {
					$(".newman-wrapper").hide();
				}
      }, function(data) {
        $(".pullUpIcon").hide();
        //	alert(data);
      });
    },
    initBanner: function() {
      var vm = this;
      var banners = vm.banners;
      for (var i = 0; i < banners.length; i++) {
        if(banners[i].h5Url != "" && banners[i].h5Url != null) {
          var url = "";
          url = banners[i].h5Url;
          var eachSwiper = "<div class='swiper-slide'>" +
            "<a href=\"" + url + "\">" +
            "<img src=\"" + banners[i].picSrc + "\" alt='' width='100%' height='100%'>" +
            "</a></div>";

          $(".banner1").append(eachSwiper);
        }
      }

        var mySwiper = new Swiper('#swiper-container', {
          loop: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          height: 120,//你的slide高度
					autoplay : 5000,
          slidesPerSlide: 1,
          speed: 500
        });

    },
    initPromotions: function() {
      var vm = this;
      var promotions = vm.promotions;
      for (var j = 0; j < promotions.length; j++) {
        var tags = "";
        var activityRate = "";
        for(var i=0; i<promotions[j].tagList.length; i++) {
          tags += "<img src='" +promotions[j].tagList[i].tagIconUrl +"' />";
        }
        if(promotions[j].activityRate) {
          activityRate = "<span class='addRate'>+" +  C.rateFormat(promotions[j].activityRate) + "%</span>";
        } else {
          activityRate = "<span>%</span>";
        }
        var url2 =   "./product/fixed_product/fixed_product_details.html?productId=" + promotions[j].productId + '&state=' + promotions[j].state;
        var eachSwiper2 = "<div class='swiper-slide'>" +
          "<a href=\"" + url2 + "\">" +
           "<div class='name'>" + promotions[j].productName + tags +"</div><div class='content'><div class='rate'>" +
           C.rateFormat(promotions[j].basicRate) + activityRate +"</div><div class='tip'>预期年化收益率</div></div><div class='bottom'><span class='left'>期限" +
           promotions[j].investDays + "天</span><span class='right'>" +promotions[j].minInvestAmount +
          "元起投</span></div></a></div>";
        $(".banner2").append(eachSwiper2);
      }

      var mySwiper2 = new Swiper('#swiper-container2', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        height: 120,//你的slide高度
        autoplay : false,
        slidesPerSlide: 1,
        speed: 500,
        on: {
          touchStart: function(event){
            console.log(event);
          }
        }
      });
      vm.mySwiper2 = mySwiper2;
    },
    initAnnouncements: function() {
      var vm = this;
      var announcements = vm.announcements;
      for (var j = 0; j < announcements.length; j++) {
        var url =   "./announcement/announcementDetails.html?announcementId=" + announcements[j].announcementId;
        var eachSwiper3 = "<div class='swiper-slide'>" +
          "<a href=\"" + url + "\">" +
           "<div class='name'>" + announcements[j].announcementName +"</div>" +
          "</a></div>";
        $(".banner3").append(eachSwiper3);
      }

      var mySwiper3 = new Swiper('#swiper-container3', {
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        direction : 'vertical',
        height: 120,//你的slide高度
        autoplay : 5000,
        slidesPerSlide: 1,
        speed: 500
      });
    },
    isLoginf: function(){
      var vm = this;
      $.ajax({
        url: '/api/asset/asset-details',
        contentType: "application/json; charset=utf-8",
        dataType:"JSON",
        type: "GET",
        success:function(data) {
          vm.isLogin = true;
        },
        error:function(data) {}
      });
    }
  },
  mounted: function() {
    var vm = this;
    vm.getAjaxData();
    vm.isLoginf();
  }
});
