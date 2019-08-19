安装node npm包管理 node安装8.*版本 npm随意

安装下载地址 https://nodejs.org/download/release/v8.16.0/node-v8.16.0-x86.msi

然后依次运行下面的 

npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install gulp -g

cnpm install

//master 本地打包 访问目录在 dist_master 目录下

gulp build 

//master release 环境打包 访问目录在 dist_master 或 dist_release 目录下

gulp build -p master

//product 生产打包 发布文件在 dist 目录下

gulp build -p product


html/user/reg.html 注册

html/user/register-agreement.html  注册-用户协议

html/asset-index.html//个人中心

html/advice-list.html//咨询列表-我的咨询

html/doctor-list.html//医生列表

html/inquiry.html//填写问诊单

html/take-medicine.html//05支付订单-煎服方式

html/find-doctor.html//01找医生

html/evaluate.html//评价

html/doctor-detail.html//医生详情

user/patient-info.html//就诊人信息

html/consultation.html//在线咨询

html/medicine-orders.html//用药订单

html/addr-list.html//常用地址

html/my-patiens.html//我的就诊人

html/appraises.html//个人中心-评价列表

html/submit-appraise.html//我的评价

html/buy-advice.html//购买图文咨询

html/prescription.html//05支付订单-药方详情


