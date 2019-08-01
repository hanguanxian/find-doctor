 define(["jquery","common","vue","baiduScript"],function($,common,Vue,bs,sc){
 			//设置channel
 			setChannel();
			function setChannel(){
				var param = common.getUrlParam();
				var channel = param.channel||"";
				common.storage.set("channel",channel);
			}
						
			
			return{
			}
})
