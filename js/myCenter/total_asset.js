var totalAsset_vm = new Vue({
    el: '#total_asset_container',
    data: {
        frozenOpen: true,
        dqBalance: null,
        hqBalance: null,
        rateBalance: null,
        amount: null,
        dqFrozen: null,
        hqFrozen: null,
        rateFrozen: null,
        bnBalance: null,
        bnFrozen: null,
        frozenSum: null,
        percentArray: []
    },
    methods: {
        switchDtls: function () {
            this.frozenOpen = !this.frozenOpen;

        },
        ajaxData: function () {
            var userId = storage.get('userId');
            var vm = this;
            rest.get({
                url: '/api/user-asset-info/' + userId + '/asset-detail'
            }, function (data) {
                vm.dqBalance = NumberFixed(data.dqBalance,2);
                vm.hqBalance = NumberFixed(data.hqBalance,2);
                vm.rateBalance = NumberFixed(data.rateBalance,2);
                vm.amount = NumberFixed(data.amount,2);
                vm.dqFrozen = NumberFixed(data.dqFrozen,2);
                vm.hqFrozen = NumberFixed(data.hqFrozen,2);
                vm.rateFrozen = NumberFixed(data.rateFrozen,2);
                vm.bnFrozen = NumberFixed(data.bnFrozen,2);
                vm.bnBalance = NumberFixed(data.bnBalance,2);
                var frozenAcc = (vm.bnFrozen*100 + vm.rateFrozen*100 + vm.dqFrozen*100 + vm.hqFrozen*100)/100;
                vm.frozenSum = NumberFixed(frozenAcc,2);
                vm.calculatePer(data,frozenAcc);

            }, function (data) {
                alert(data);
            })
        },
        calculatePer: function (data,frozenAcc) {
            var vm = this;
            var sumNum = (vm.hqBalance*100 + vm.dqBalance*100 + vm.rateBalance*100 + vm.bnBalance*100 + vm.frozenSum*100)/100;
            var hqPercent = NumberFixed(data.hqBalance * 100 / sumNum,2);
            var dqPercent = NumberFixed(data.dqBalance * 100 / sumNum,2);
            var ratePercent = NumberFixed(data.rateBalance * 100 / sumNum,2);
            var bnPercent = NumberFixed(data.bnBalance * 100 / sumNum,2);
            var frozenPercent = NumberFixed(frozenAcc * 100 / sumNum,2);
            vm.percentArray.push(hqPercent);
            vm.percentArray.push((dqPercent*100+hqPercent*100)/100);
            vm.percentArray.push((ratePercent*100+dqPercent*100+hqPercent*100)/100);
            vm.percentArray.push((bnPercent*100+ratePercent*100+dqPercent*100+hqPercent*100)/100);
            vm.percentArray.push((frozenPercent*100+bnPercent*100+ratePercent*100+dqPercent*100+hqPercent*100)/100);
            console.log(vm.percentArray);
            vm.drawCircle();
        },
        drawCircle: function () {
            var vm = this;
            $(".percent-circle").progressCircle({
                perArray: vm.percentArray,
                colorArray: ['#e87758', '#aa9154', '#81a5a2', '#737eac', '#93749d']
            });
        }
    },
    ready: function () {
        this.ajaxData();
    }
})