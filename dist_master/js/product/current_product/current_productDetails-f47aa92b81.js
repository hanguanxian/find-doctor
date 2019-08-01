(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var vm = new Vue({
    el: '#current_productDtls_container',
    data:{
        beginAmt: 100,
        hqApiUrl: '/api/current-target',
        targetId: null,
        targetName: null,
        targetAmount: null,
        targetFreeAmount:null,
        barStatus: true,
        targetYearRate:NumberFixed(0.00, 2),
        targetDayRate:NumberFixed(0.000000, 6),
        appendYearDate:NumberFixed(0.00, 2),
        appendLable:'',
        appendContent: false
    },
    methods:{
        getAjaxData: function () {
            var vm = this;
            rest.get({
                url : vm.hqApiUrl
            },function (data) {
                vm.$set('targetId',data.targetId);
                vm.$set('targetName',data.targetName);
                vm.$set('targetAmount',data.targetAmount);
                vm.$set('targetFreeAmount',data.targetAmount-data.targetBidAmount);
                vm.$set('targetYearRate', NumberFixed(data.targetYearRate*100, 2));
                vm.$set('targetDayRate',data.targetDayRate);
                vm.$set('appendYearDate',NumberFixed(data.appendYearDate*100, 2));
                vm.$set('appendLable',data.appendLable);
                storage.set('targetId',data.targetId);

                vm.setProgressBar(data);

                if(vm.appendLable!=null){
                    vm.appendContent = true;
                }else{
                    vm.appendContent = false;
                }
            });
        },
        setProgressBar: function (data) {
            var per = 100*data.targetBidAmount/data.targetAmount;
            console.log("per================"+per);
            if(this.targetFreeAmount<this.beginAmt){
                per = 100;
                vm.barStatus = true;
            }
            else if(per<80){
                    vm.barStatus = false;

            }else{
                vm.barStatus = true;
            }
            $(".progressBar p").css("width",per+'%');
        }
    },
    ready: function () {
        this.getAjaxData();

    }
})
},{}]},{},[1]);
