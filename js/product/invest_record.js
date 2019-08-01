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