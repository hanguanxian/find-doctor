/**
 * Created by ChangFeng on 2016/10/12.
 */
var page = 1, rows = 50;

$(function(){
	$(".voucher_tab li").bind("click",function(){
		$(this).addClass("tab_selected").siblings().removeClass("tab_selected");
		var index = $(this).index();
		$(".voucher_list_wrap").eq(index).show().siblings().hide();
	})
})

var vm = new Vue({
    el : '#voucher_container',
    data : {
    	moneyCouponUrl : '/api/user-asset-info/' + storage.get('userId') + '/tiyan',
    	moneyCouponFlag : true,
    	moneyCouponData : [],
    	moneyCouponCount : 0,
    	rateCouponUrl : '/api/user-asset-info/' + storage.get('userId') + '/rate',
    	rateCouponFlag : true,
    	rateCouponData : [],
    	rateCouponCount : 0
    },
    methods : {
		
        getMoneyCoupon: function () {
            var vm = this;
            rest.get({
            	url : vm.moneyCouponUrl,
            	params : {
                    page : page,
                    rows : rows
                }
            }, function(data){
            	vm.$set('moneyCouponFlag',(data.reslultList && data.reslultList.length > 0) ? true : false);
            	if(vm.moneyCouponFlag){
            		vm.$set('moneyCouponCount',data.reslultList.length);
					for(var x=0; x < vm.moneyCouponCount; x++){
						//var useTime = new Date(data.reslultList[x].useTime);
						var now = new Date();
						if(new Date(data.reslultList[x].closingDate) < now){
							data.reslultList[x].overdue = true;
						}else if (new Date(data.reslultList[x].closingDate) - now <= 5*24*60*60*1000) {
							data.reslultList[x].expiring = true;
						}
						//if (data.reslultList[x].closingDate - new Date().getTime() <= 5*24*60*60*1000) {}
						//data.reslultList[x].useTimeStr = data.reslultList[x].useTime.format("yyyy/MM/dd");
						data.reslultList[x].yearRateStr = NumberFixed(new Number(data.reslultList[x].yearRate * 100), 2) + '%';
						data.reslultList[x].dayRateStr = data.reslultList[x].dayRate * 100 + '%';
					}
					vm.$set('moneyCouponData', data.reslultList);
				}
            }, function(data){
            	alert(data);
            });
        },
        getRateCoupon: function () {
            var vm = this;
            rest.get({
            	url : vm.rateCouponUrl,
            	params : {
                    page : page,
                    rows : rows
                }
            }, function(data){
            	vm.$set('rateCouponFlag',(data.rateCoupons && data.rateCoupons.length > 0) ? true : false);
            	if(vm.rateCouponFlag){
            		vm.$set('rateCouponCount',data.rateCoupons.length);
					for(var x=0; x < vm.rateCouponCount; x++){
						var now = new Date().getTime();
						if(data.rateCoupons[x].closingDate < now){
							data.rateCoupons[x].overdue = true;
						}else if (data.rateCoupons[x].closingDate - now <= 5*24*60*60*1000) {
							data.rateCoupons[x].expiring = true;
						}
						data.rateCoupons[x].closingDateStr = formatDate(new Date(data.rateCoupons[x].closingDate),"yyyy/MM/dd");
						data.rateCoupons[x].yearRateStr = NumberFixed(new Number(data.rateCoupons[x].yearRate * 100), 2);
						data.rateCoupons[x].dayRateStr = data.rateCoupons[x].dayRate * 100 + '%';
					}
					vm.$set('rateCouponData', data.rateCoupons);
				}
            }, function(data){
            	alert(data);
            });
        }
    },
    
    ready: function () {
    	if(userSession.checkId()) {
    		this.getMoneyCoupon();
    		this.getRateCoupon();
    	}
    }
});
