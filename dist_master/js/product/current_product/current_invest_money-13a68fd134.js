(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}]},{},[1]);
