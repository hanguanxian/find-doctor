(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by GuoXiang on 2016/8/24.
 */
var vm=new Vue({
    el:"#invest-record-container",
    data:{
        ApiUrl:'/api/current-target/',
        listData:[]
    },
    methods:{
        getAjaxData: function () {
            var vm = this;
            rest.get({
                url : vm.ApiUrl+storage.get('targetId')+'/1/order'
            },function (data) {
                vm.$set('listData',data.currentOrders);
                vm.hideMobile();
                vm.dateFormat();
            });
        },
        hideMobile:function() {
            var vm = this;
            for(var i=0;i<vm.listData.length;i++){
                head = vm.listData[i].mobile.substring(0, 3);
                tail = vm.listData[i].mobile.substring(7, 11);
                vm.listData[i].mobile = head + '****' + tail;
            }
        },
        dateFormat:function() {
            var vm = this;
            for(var i=0;i<vm.listData.length;i++){
                var date=new Date(parseInt(vm.listData[i].buyTime));
                vm.listData[i].buyTime = date.format('yyyy-MM-dd hh:mm:ss');
            }
        }
    },
    ready: function () {
        this.getAjaxData();
    }
})
},{}]},{},[1]);
