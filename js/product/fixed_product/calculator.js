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