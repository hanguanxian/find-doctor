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
