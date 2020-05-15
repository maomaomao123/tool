const app = getApp();
let pageA = {
    data: {
        // 数据区，从服务端拿到的数据
        store_name: "微养车同和店微养车同和店微养车同和店微养车同和店",    // 姓名
        store_phone: "13988887777",  // 电话
        posterUrl: "https://image.carisok.com/filesrv/beta/uploads/files/20200413/1586760706lzvIeL.jpeg", // 海报地址
        photoUrl: "https://image.carisok.com/filesrv/beta/uploads/files/20200413/1586760706lzvIeL.jpeg",                         // 头像地址
        qrcodeUrl: "https://image.carisok.com/filesrv/beta/uploads/files/20200507/1588841295rWhXYD.png",                  // 小程序二维码
        share_goods: [
            {
                activity_price: "0.01",
                goods_id: "189373",
                goods_img: "https://image.carisok.com/filesrv/beta/uploads/store_0/goods_178/202005061436182628.png",
                goods_title: "郑凯伟测试商品专用",
                original_price: "",
            },
            {
                activity_price: "0.01",
                goods_id: "189373",
                goods_img: "https://image.carisok.com/filesrv/beta/uploads/store_0/goods_95/202005061451353748.png",
                goods_title: "郑凯伟测试商品专用",
                original_price: "",
            },
            {
                activity_price: "0.01",
                goods_id: "189373",
                goods_img: "https://image.carisok.com/filesrv/beta/uploads/store_0/goods_178/202005061436182628.png",
                goods_title: "郑凯伟测试商品专用",
                original_price: "",
            },
            {
                activity_price: "0.01",
                goods_id: "189373",
                goods_img: "https://image.carisok.com/filesrv/beta/uploads/store_0/goods_95/202005061451353748.png",
                goods_title: "郑凯伟测试商品专用",
                original_price: "",
            }
        ],

        // 设置区，针对部件的数据设置
        photoDiam: 50,                // 头像直径
        qrcodeDiam: 70,               // 小程序码直径
        infoSpace: 20,                // 底部信息的间距
        saveImageWidth: 500,          // 保存的图像宽度
        bottomInfoHeight: 100,        // 底部信息区高度
        store_address: "微信扫码或长按了解更多",   // 提示语

        // 缓冲区，无需手动设定
        canvasWidth: 0,               // 画布宽
        canvasHeight: 0,              // 画布高
        canvasDom: null,              // 画布dom对象
        canvas: null,                  // 画布的节点
        ctx: null,                    // 画布的上下文
        dpr: 1,                       // 设备的像素比
        posterHeight: 0,              // 海报高
    },
    _data: {
    },
    /**
     * 显示/隐藏loading
     */
    toggleLoading (bool) {
        this.setData({
            'loading.visiable': bool
        })
    },
    onLoad(options) {
        // this.getActivityShare().then(res=> {
        //     console.log(res,'res')
        // })
    },
    /**
     * 获取活动分享的
     */
    getActivityShare() {
        this.toggleLoading(true)
        return new Promise((resolve, reject) => {
            app.request('getActivityShare', {
                activity_id: 308,
                sstore_id: 715,
                is_lottery: 1
            }, res => {
                if (res) {
                    resolve(res)
                }
            }, () => { }, () => {
                this.toggleLoading(false)
             });
        })
    },
    onShow () {
    },
    onHide () {
    },
    onUnload () {
    },
    onReady() {
        this.drawImage()
    },
    // 查询节点信息，并准备绘制图像
    drawImage() {
        const query = wx.createSelectorQuery()  // 创建一个dom元素节点查询器
        query.select('#canvasBox')              // 选择我们的canvas节点
            .fields({                             // 需要获取的节点相关信息
                node: true,                         // 是否返回节点对应的 Node 实例
                size: true                          // 是否返回节点尺寸（width height）
            }).exec((res) => {                    // 执行针对这个节点的所有请求，exec((res) => {alpiny})  这里是一个回调函数
                const dom = res[0]                            // 因为页面只存在一个画布，所以我们要的dom数据就是 res数组的第一个元素
                const canvas = dom.node                       // canvas就是我们要操作的画布节点
                const ctx = canvas.getContext('2d')           // 以2d模式，获取一个画布节点的上下文对象
                const dpr = wx.getSystemInfoSync().pixelRatio // 获取设备的像素比，未来整体画布根据像素比扩大
                this.setData({
                    canvasDom: dom,   // 把canvas的dom对象放到全局
                    canvas: canvas,   // 把canvas的节点放到全局
                    ctx: ctx,         // 把canvas 2d的上下文放到全局
                    dpr: dpr          // 屏幕像素比
                }, function () {
                    this.drawing()    // 开始绘图
                })
            })
        // 对以上设置不明白的朋友
        // 可以参考 createSelectorQuery 的api地址
        // https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html
    },
    // 绘制画面
    drawing() {
        const that = this;
        wx.showLoading({ title: "生成中" }) // 显示loading
        that.drawPoster()               // 绘制海报
            .then(function () {           // 这里用同步阻塞一下，因为需要先拿到海报的高度计算整体画布的高度
                // that.drawInfoBg()           // 绘制底部白色背景
                // that.drawPhoto()            // 绘制头像
                that.drawGoods()
                that.drawQrcode()           // 绘制小程序码
                that.drawText(that.data.store_name, 16, that.data.infoSpace, that.data.canvasHeight - that.data.qrcodeDiam) // 门店名称
                that.drawText(`地址：${that.data.store_address}`, 10, that.data.infoSpace, that.data.canvasHeight - that.data.infoSpace - 14) // 地址
                that.drawText(`联系方式：${that.data.store_phone}`, 10, that.data.infoSpace, that.data.canvasHeight - that.data.infoSpace);
                wx.hideLoading() // 隐藏loading
            })
    },
    // 绘制海报
    drawPoster() {
        const that = this
        return new Promise(function (resolve, reject) {
            let poster = that.data.canvas.createImage();          // 创建一个图片对象
            poster.src = that.data.posterUrl               // 图片对象地址赋值
            poster.onload = () => {
                that.computeCanvasSize(poster.width, poster.height) // 计算画布尺寸
                    .then(function (res) {
                        that.data.ctx.drawImage(poster, 0, 0, poster.width, poster.height, 0, 0, res.width, res.height);
                        resolve()
                    })
            }
        })
    },
    // 计算画布尺寸
    computeCanvasSize(imgWidth, imgHeight) {
        const that = this
        return new Promise(function (resolve, reject) {
            var canvasWidth =  315 || that.data.canvasDom.width                   // 获取画布宽度
            var posterHeight = canvasWidth * (imgHeight / imgWidth)       // 计算海报高度
            // var canvasHeight = posterHeight + that.data.bottomInfoHeight  // 计算画布高度 海报高度+底部高度
            var canvasHeight = posterHeight // 计算画布高度 海报高度+底部高度
            that.setData({
                canvasWidth: canvasWidth,                                   // 设置画布容器宽
                canvasHeight: canvasHeight,                                 // 设置画布容器高
                posterHeight: posterHeight                                  // 设置海报高
            }, () => { // 设置成功后再返回
                that.data.canvas.width = that.data.canvasWidth * that.data.dpr // 设置画布宽
                that.data.canvas.height = canvasHeight * that.data.dpr         // 设置画布高
                that.data.scaleNum = that.data.canvas.width / that.data.canvas.height
                    console.log(that.data.scaleNum,'that.data.scaleNum')
                that.data.ctx.scale(that.data.dpr, that.data.dpr)              // 根据像素比放大
                setTimeout(function () {
                    resolve({ "width": canvasWidth, "height": posterHeight })    // 返回成功
                }, 1200)
            })
        })
    },// 绘制白色背景
    // 注意：这里使用save 和 restore 来模拟图层的概念，防止污染
    drawInfoBg() {
        this.data.ctx.save();
        this.data.ctx.fillStyle = "#ffffff";                                         // 设置画布背景色
        this.data.ctx.fillRect(0, this.data.canvasHeight - this.data.bottomInfoHeight, this.data.canvasWidth, this.data.bottomInfoHeight); // 填充整个画布
        this.data.ctx.restore();
    },

    // 绘制头像
    drawPhoto() {
        let photoDiam = this.data.photoDiam               // 头像路径
        let photo = this.data.canvas.createImage();       // 创建一个图片对象
        photo.src = this.data.photoUrl                    // 图片对象地址赋值
        photo.onload = () => {
            let radius = photoDiam / 2                      // 圆形头像的半径
            let x = this.data.infoSpace                     // 左上角相对X轴的距离
            let y = this.data.canvasHeight - photoDiam - 35 // 左上角相对Y轴的距离 ：整体高度 - 头像直径 - 微调
            this.data.ctx.save()
            this.data.ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI) // arc方法画曲线，按照中心点坐标计算，所以要加上半径
            this.data.ctx.clip()
            this.data.ctx.drawImage(photo, 0, 0, photo.width, photo.height, x, y, photoDiam, photoDiam) // 详见 drawImage 用法
            this.data.ctx.restore();
        }
    },
    // 绘制商品
    drawGoods() {
        this.data.ctx.save();
        this.data.ctx.fillStyle = "#ffffff"; // 设置商品背景色
        for (let i = 0; i < 4; i++){
            this.data.ctx.fillRect((5 + (106 + 5) * i ) * this.data.scaleNum, 180 * this.data.scaleNum, 106 * this.data.scaleNum, 180 * this.data.scaleNum); // 填充
        }
        this.data.ctx.scale(this.data.dpr, this.data.dpr)              // 根据像素比放大
        this.data.ctx.restore();
    },
    // 绘制小程序码
    drawQrcode() {
        let diam = this.data.qrcodeDiam                    // 小程序码直径
        let qrcode = this.data.canvas.createImage();       // 创建一个图片对象
        qrcode.src = this.data.qrcodeUrl                   // 图片对象地址赋值
        qrcode.onload = () => {                                        // 半径，alpiny敲碎了键盘
            let x = this.data.canvasWidth - this.data.infoSpace - diam        // 左上角相对X轴的距离：画布宽 - 间隔 - 直径
            let y = this.data.canvasHeight - this.data.infoSpace - diam + 5   // 左上角相对Y轴的距离 ：画布高 - 间隔 - 直径 + 微调
            this.data.ctx.save()
            this.data.ctx.drawImage(qrcode, 0, 0, qrcode.width, qrcode.height, x, y, diam, diam) // 详见 drawImage 用法
            this.data.ctx.restore();
        }
    },
    // 绘制文字 参数 文字text,文字大小fontSize,x,y
    drawText(text,fontSize,x,y) {
        // const infoSpace = this.data.infoSpace         // 下面数据间距
        // const photoDiam = this.data.photoDiam         // 圆形头像的直径
        this.data.ctx.save();
        this.data.ctx.font = `${fontSize}px Arial` || "16px Arial";             // 设置字体大小
        this.data.ctx.fillStyle = "#3b3b3b";           // 设置文字颜色
        // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
        this.data.ctx.fillText(text, x,y);
        // 地址（距左：间距 ）（距下：总高 - 间距 ）
        // this.data.ctx.fillText(`地址：${this.data.store_address}`, infoSpace, this.data.canvasHeight - infoSpace - 14 - 16);
        // // 电话（距左：间距 + 头像直径 + 间距 - 微调 ）（距下：总高 - 间距 - 文字高 - 上移一点 ）
        // this.data.ctx.fillText(`联系方式：${this.data.store_phone}`, infoSpace, this.data.canvasHeight - infoSpace);
        this.data.ctx.restore();
    },
}
Page(pageA)
