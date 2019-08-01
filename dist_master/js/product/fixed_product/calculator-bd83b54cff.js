(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var vm = new Vue({
    el: '#calculator-container',
    data:{
        productData: {
        	yearRate: NumberFixed(fixedProductSessionStorageUtils.getSelectedRegularTarget().yearRate * 100, 2),
			day: fixedProductSessionStorageUtils.getSelectedRegularTarget().day
        },
        dayRate: fixedProductSessionStorageUtils.getSelectedRegularTarget().dayRate,
        planNum : 0,
        returnUrl: null,
        targetId: fixedProductSessionStorageUtils.getSelectedRegularTarget().targetId
    },
    ready: function () {
        this.returnUrl = "html/product/fixed_product/fixed_product_details.html?targetId="+this.targetId+"&targetState="+storage.get("targetState");
    }
})

vm.$watch('money_num',function (val) {
    this.planNum = NumberFixed(val * this.dayRate*this.productData.day, 4);
});
},{}]},{},[1]);
