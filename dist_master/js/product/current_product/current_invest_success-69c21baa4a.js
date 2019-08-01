(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var vm = new Vue({
    el: '#currPro-success-container',
    data:{
        money: storage.get('hqmoney'),
        ApiUrl:'/api/system-time',
        buyTime: null,
        nextPayDate: null
    },
    methods: {
        toAsset : function () {
            window.location.href = "html/myCenter/asset_index.html";
        },
        toIndexPage : function () {
            window.location.href = "html/activities/index.html";
        },
        getAjaxData : function () {
            var vm = this;
            rest.get( {
                url : vm.ApiUrl
            },function (data) {
                var date=new Date(parseInt(data.timestamp));
                var hour=date.getHours();
                if(hour>14){
                    date=new Date(parseInt(data.timestamp)+86400000);
                    var dateformat=date.format('yyyy-MM-dd');
                    vm.$set('buyTime',dateformat);
                    date=new Date(parseInt(data.timestamp)+86400000*2);
                    var pdateformat=date.format('yyyy-MM-dd');
                    vm.$set('nextPayDate',pdateformat);
                }else{
                    vm.$set('buyTime',date.format('yyyy-MM-dd'));
                    date=new Date(parseInt(data.timestamp)+86400000);
                    vm.$set('nextPayDate',date.format('yyyy-MM-dd'));
                }
            });
        },
    },
    ready: function () {
        this.getAjaxData();
    }
});

},{}]},{},[1]);
