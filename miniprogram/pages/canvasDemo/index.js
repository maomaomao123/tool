const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

    let json = {
      cover: "https://image.carisok.com/filesrv/beta/uploads/files/20200413/1586760706lzvIeL.jpeg",
      downBg: "./bg2.jpg",
      tempHeader: "./header.jpg",
      shareContent: '拆家小能手',
      playerName: '@前端智酷方程',
      slogan: "一起研究，一起进步"
    };
    wx.showLoading({
      title: '海报生成中...',
    })
    console.log(json);
    //选取画板
    const query = wx.createSelectorQuery()
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        canvas.width = res[0].width;
        canvas.height = res[0].height;
        ctx.clearRect(0, 0, 320, 410); //清空画板
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 320, 410);

        //生成主图
        const mainImg = canvas.createImage();
        mainImg.src = json.cover;
        let mainImgPo = await new Promise((resolve, reject) => {
          mainImg.onload = () => {
            resolve(mainImg)
          }
          mainImg.onerror = (e) => {
            reject(e)
          }
        });
        let h = mainImgPo.height;
        let w = mainImgPo.width;
        let setHeight = 250, //默认源图截取的区域
          setWidth = 320; //默认源图截取的区域
        if (w / h > 1.3) {
          setHeight = h;
          setWidth = parseInt(320 / 250 * h);
        } else {
          setWidth = w;
          setHeight = parseInt(250 / 320 * w);
        }
        ctx.drawImage(mainImgPo, 0, 0, setWidth, setHeight, 0, 0, 320, 250);


        //写底部背景
        const bgImg = canvas.createImage();
        bgImg.src = json.downBg;
        let bgImgPo = await new Promise((resolve, reject) => {
          bgImg.onload = () => {
            resolve(bgImg)
          }
          bgImg.onerror = (e) => {
            reject(e)
          }
        });
        ctx.drawImage(bgImgPo, 0, 250, 320, 160);


        //文案内容
        let txtLeftPos = 65;
        ctx.textBaseline = "top";
        ctx.textAlign = 'left';
        //用户昵称
        ctx.font = "16px bold"; //设置字体大小，默认10
        ctx.fillStyle = '#000'; //文字颜色：默认黑色
        ctx.fillText(json.playerName, txtLeftPos, 275)//绘制文本
        //比赛内容
        ctx.font = "12px normal"; //设置字体大小，默认10
        ctx.fillStyle = '#707070'; //文字颜色：默认黑色
        ctx.fillText(json.slogan, txtLeftPos, 295)//绘制文本
        //战绩
        ctx.font = "14px normal"; //设置字体大小，默认10
        ctx.fillStyle = '#a4a4a4'; //文字颜色：默认黑色
        ctx.fillText('称号：', 20, 360)//绘制文本
        //成绩
        ctx.font = "44px bold"; //设置字体大小，默认10
        ctx.fillStyle = 'blue'; //文字颜色：默认黑色
        ctx.fillText(json.shareContent, txtLeftPos, 335)//绘制文本
        console.log("写完字")


        //获取用户头像
        /**
         * 生成微信头像的公共方法
         * @param {string} headImageLocal 微信头像
         */
        function canvasWxHeader(headImageLocal) {
          const headerImg = canvas.createImage();
          console.log(headImageLocal)
          headerImg.src = headImageLocal;
          headerImg.onload = () => {
            ctx.save();
            ctx.beginPath()//开始创建一个路径
            ctx.arc(38, 288, 18, 0, 2 * Math.PI, false)//画一个圆形裁剪区域
            ctx.clip()//裁剪
            ctx.drawImage(headerImg, 20, 270, 36, 36);
            ctx.closePath();
            ctx.restore();
            //关闭loading
            wx.hideLoading();
          }
        }
        canvasWxHeader(json.tempHeader);

        //因为是 代码段  所以微信头像授权不被允许!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //获取头像
        // let headUri = await new Promise((resolve, reject) => {
        //   // 查看是否授权
        //   wx.getSetting({
        //     success(res) {
        //       if (res.authSetting['scope.userInfo']) {
        //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //         wx.getUserInfo({
        //           success(res) {
        //             console.log(res.userInfo)
        //             //下载头像图片  并放入 canvas
        //             resolve(res.userInfo.avatarUrl)
        //           }
        //         })
        //       } else { //如果没有权限
        //         resolve(defaultHeadUri) //没有授权，默认头像
        //       }
        //     }
        //   })
        // })
        //canvasWxHeader(headUri)
      });
  },
  /**
     * 获取用户保存相册权限
     */
  getPhotosAuthorize: function () {
    let self = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              self.saveImg();
            },
            //用户拒绝
            fail() {
              console.log("用户再次拒绝")
            }
          })
        } else {
          self.saveImg();
        }
      }
    })
  },
  /**
   * 保存到相册
   */
  async saveImg() {
    let self = this;
    const query = wx.createSelectorQuery();
    const canvasObj = await new Promise((resolve, reject) => {
      query.select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          resolve(res[0].node);
        })
    });
    console.log(canvasObj);
    wx.canvasToTempFilePath({
      //fileType: 'jpg',
      //canvasId: 'posterCanvas', //之前的写法
      canvas: canvasObj, //现在的写法
      success: (res) => {
        console.log(res);
        self.setData({ canClose: true });
        //保存图片
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
            // setTimeout(() => {
            //   self.setData({show: false})
            // }, 6000);
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
            } else {
              util.showToast("请截屏保存分享");
            }
          },
          complete(res) {
            wx.hideLoading();
            console.log(res);
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    }, this)
  },
})
