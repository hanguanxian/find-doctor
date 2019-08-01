/**
 * Created by jiamu on 2016/8/31.
 */
var vm = new Vue({
    el: '#product-info-container',
    data: {
        beginAnt:100,
        targetName:decodeURI(getUrlParam().targetName),
        targetAmount:getUrlParam().targetAmount,
        targetYearRate:getUrlParam().targetYearRate
    }
});