(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by GuoXiang on 2016/10/12.
 */
var pageIndex = 1, pageNum = 10;
var myScroll;

var currentBao_vm = new Vue({
    el: '#currentBao_container',
    data: {
        accountNum: null,
        yestNum: null,
        sumNum: null,
        leftDays: null,
        currentlist: [],
        userId: null,
        returnData: []
    },
    methods: {
        initData: function () {
            var vm = this;
            if (storage.get("userId")) {
                vm.userId = storage.get("userId");
            }
            rest.get({
                url: '/api/user-asset-info/' + vm.userId + '/hquser',
                params: {
                    page: pageIndex,
                    rows: pageNum
                }
            }, function (data) {
                vm.accountNum = NumberFixed(data.current, 2);
                vm.yestNum = NumberFixed(data.yesterdayInterest, 2);
                vm.sumNum = NumberFixed(data.countInterest, 2);
                if (data.hqList.length > 0) {
                    for (var i = 0, len = data.hqList.length; i < len; i++) {
                        var nextAppendDate = data.hqList[i].nextAppendDate;
                        data.hqList[i].currentAmount = NumberFixed(data.hqList[i].currentAmount, 2);
                        data.hqList[i].yearRate = NumberFixed(data.hqList[i].yearRate * 100, 1);
                        data.hqList[i].appendRate = NumberFixed(data.hqList[i].appendRate * 100, 1);
                        data.hqList[i].leftDays = Math.floor((new Date(nextAppendDate) - new Date()) / (1000 * 86400));
                        vm.returnData.push(data.hqList[i]);
                    };
                    vm.$set('currentlist', vm.returnData);

                    if (data.hqList.length < pageNum) {
                        $('#pullUp').hide();
                        if (vm.returnData.length > pageNum) {
                            $('.noMoreData').show();
                        }
                    }else{
                        $('#pullUp').show();
                        $('.noMoreData').hide();
                    }

                    setTimeout(function(){
                        myScroll.refresh();
                    },100)

                }else{
                    $('#pullUp').hide();
                    if(pageIndex > 1){
                        $('.noMoreData').show();
                    }
                    setTimeout(function(){
                        myScroll.refresh();
                    },100)
                }
                
            }, function (data) {
                $(".pullUpIcon").hide();
                alert(data);
            })
        },
        currentOut: function () {
                if(confirm("转出请下载源码汇APP")){
                    window.location.href = "http://ad.51doro.com/pf/wxPoster/poster3.html";
                }else{

                }
            }


    },
    ready: function () {
        this.initData();
        var vm = this;


    }
})
function pullUpAction() {
    pageIndex++;
    setTimeout(function () {
        currentBao_vm.initData();
    },1000);

}

$(function () {
    setTimeout(function () {
        scrollInit(pullUpAction);
    }, 500);
})
},{}]},{},[1]);
