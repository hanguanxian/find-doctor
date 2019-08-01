var vm = new Vue({
        el: '#buy-currPro-container',
        data: {
            dayRate: getUrlParam().dayRate,
            availAmount: null,
            targetFreeAmount: getUrlParam().targetFreeAmount,
            day_earning: 0 + '元',
            recharge: null,
            ApiUrl: '/api/current-order',
            userApiUrl: '/api/user-account/' + storage.get('userId'),
            postdata: {
                userId: storage.get('userId'),
                targetId: storage.get('targetId'),
                amount: NumberFixed(0.00, 2)
            },
            hqmoney: null,
            agreeContract: true,
            btnDisplay: true
        },
        methods: {
            toRecharge: function () {
                var url = window.location.pathname+window.location.search;
                storage.set("rechargeFinishedUrl",url);
                window.location.href = "html/myCenter/ifBind.html";
            },
            buyForward: function () {
                var vm = this;
                if (!document.getElementById("checkbox-1-1").checked) {
                    alert("请阅读产品合同！");
                    return;
                }
                storage.set('hqmoney', this.hqmoney);
                vm.$set('postdata.amount', this.hqmoney);
                rest.post({
                    url: vm.ApiUrl,
                    data: vm.postdata
                }, function (data) {
                    window.location.href = "html/product/current_product/current_invest_success.html";
                });
            },
            amountCheck: function (val) {
                var vm = this;
                var b = (!(parseInt(val) % 100 == 0))|| !(/(^[1-9]\d*$)/.test(val));
                if (b) {
                    if(val==null){
                        $("#purchaseBtn1").hide();
                        $("#purchaseBtn2").hide();
                        $("#purchaseBtn4").hide();
                        this.btnDisplay = true;
                        $("#purchaseBtn").css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
                        return;
                    }
                    $("#purchaseBtn1").hide();
                    $("#purchaseBtn2").hide();
                    $("#purchaseBtn4").show();
                    this.btnDisplay = true;
                    $("#purchaseBtn").css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
                }else {
                    if (parseInt(val) > parseInt(vm.targetFreeAmount)) {
                        $("#purchaseBtn2").hide();
                        $("#purchaseBtn4").hide();
                        $("#purchaseBtn1").show();
                        this.btnDisplay = true;
                        $("#purchaseBtn").css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
                    } else {
                        if( parseInt(val) > parseInt(vm.availAmount)){
                            this.btnDisplay = false;
                            $("#purchaseBtn1").hide();
                            $("#purchaseBtn4").hide();
                            
                            vm.recharge = NumberFixed(val - vm.availAmount, 2);
                            $("#purchaseBtn2").show();
                        }else{
                            $("#purchaseBtn2").hide();
                            $("#purchaseBtn4").hide();
                            $("#purchaseBtn1").hide();
                            this.btnDisplay = true;
                            $("#purchaseBtn").css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
                        }
                    }
                }
            },

        },

    ready: function () {
	    if (!userSession.checkId()) {
	        return;
	    }
        
        /*$.ajax({
                url: '/api/payment-bank-card/recharge-check-bind?userId='+storage.get('userId'),
                type : "GET",
                dataType : "JSON",
                success : function(data){
                    var isBindCard = data.isBindCard;
                    var paymentChannelCode = data.paymentChannelCode;
                    
                    if(!isBindCard){
                        var url = window.location.pathname+window.location.search;
                        storage.set("bindFinishedUrl",url);
                        window.location.href = '/h5/html/myCenter/bindCard.html';
                    }
                },
                error : function(data){
                    var e = eval('('+data.responseText+')');
                    setError(e.error.message);
                }
        })*/

        this.amountCheck(this.hqmoney);
	    rest.get({
	        url: this.userApiUrl
	    }, function (data) {
	        vm.$set('availAmount', Math.floor(data.acctBalance*100)/100);
	    });
    }
})
;
vm.$watch('hqmoney', function (val) {
    this.day_earning = NumberFixed(val * this.dayRate, 4) + '元';
    this.amountCheck(val);
});

