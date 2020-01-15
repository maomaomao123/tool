Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    },
    shareData: {  //分享信息
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        // console.log(newVal, oldVal)
      }
    }
  },
  data: {
    isModal: false, //是否显示拒绝保存图片后的弹窗
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    visible: false
  },
  methods: {
    handlePhotoSaved() {
      this.savePhoto(this.data.sharePath)
    },
    handleClose() {
      this.setData({
        visible: false
      })
    },
    drawPic() {
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData') 
        return
      }
      wx.showLoading({
        title: '生成中'
      })
      this.setData({
        imgDraw: {
          width: '992rpx',
          height: '1418rpx',
          background: this.data.shareData.share_info.share_bg,
          views: [
            {
              type: 'rect',
              css: {
                top: '400rpx',
                left: '20rpx',
                width: '230rpx',
                height: '360rpx',
                color: '#fff'
              }
            },
            {
              type: 'image',
              url: `${this.data.shareData.share_info.store_code}`,
              css: {
                top: '400rpx',
                left: '20rpx',
                width: '230rpx',
                height: '230rpx'
              }
            },
            {
              type: 'text',
              text: `我是商品1十大发那扩所付那扩付你咦一`,
              css: {
                top: '640rpx',
                left: '30rpx',
                fontSize: '22rpx',
                color: '#3b3b3b',
                width: '214rpx',
                lineHeight: '30rpx',
                maxLines: '2',
              }
            },
            {
              type: 'text',
              text: `￥338.00`,
              css: {
                top: '700rpx',
                left: '30rpx',
                fontSize: '24rpx',
                color: '#e60014',
              }
            },
            {
              type: 'text',
              text: `￥688.00`,
              css: {
                top: '704rpx',
                left: '160rpx',
                fontSize: '20rpx',
                color: '#999',
                textDecoration: 'line-through',
              }
            },
            
            {
              type: 'rect',
              css: {
                top: '400rpx',
                left: '260rpx',
                width: '230rpx',
                height: '360rpx',
                color: '#fff'
              }
            },
            {
              type: 'image',
              url: `${this.data.shareData.share_info.store_code}`,
              css: {
                top: '400rpx',
                left: '260rpx',
                width: '230rpx',
                height: '230rpx'
              }
            },
            {
              type: 'text',
              text: `我是商品1十大发那扩所付那扩付你咦一`,
              css: {
                top: '640rpx',
                left: '270rpx',
                fontSize: '22rpx',
                color: '#3b3b3b',
                width: '214rpx',
                lineHeight: '30rpx',
                maxLines: '2',
              }
            },
            {
              type: 'text',
              text: `￥338.00`,
              css: {
                top: '700rpx',
                left: '270rpx',
                fontSize: '24rpx',
                color: '#e60014',
              }
            },
            {
              type: 'text',
              text: `￥688.00`,
              css: {
                top: '704rpx',
                left: '400rpx',
                fontSize: '20rpx',
                color: '#999',
                textDecoration: 'line-through',
              }
            },

            {
              type: 'rect',
              css: {
                top: '400rpx',
                left: '500rpx',
                width: '230rpx',
                height: '360rpx',
                color: '#fff'
              }
            },
            {
              type: 'image',
              url: `${this.data.shareData.share_info.store_code}`,
              css: {
                top: '400rpx',
                left: '500rpx',
                width: '230rpx',
                height: '230rpx'
              }
            },
            {
              type: 'text',
              text: `我是商品1十大发那扩所付那扩付你咦一`,
              css: {
                top: '640rpx',
                left: '510rpx',
                fontSize: '22rpx',
                color: '#3b3b3b',
                width: '214rpx',
                lineHeight: '30rpx',
                maxLines: '2',
              }
            },
            {
              type: 'text',
              text: `￥338.00`,
              css: {
                top: '700rpx',
                left: '510rpx',
                fontSize: '24rpx',
                color: '#e60014',
              }
            },
            {
              type: 'text',
              text: `￥688.00`,
              css: {
                top: '704rpx',
                left: '640rpx',
                fontSize: '20rpx',
                color: '#999',
                textDecoration: 'line-through',
              }
            },

            {
              type: 'rect',
              css: {
                top: '400rpx',
                left: '740rpx',
                width: '230rpx',
                height: '360rpx',
                color: '#fff'
              }
            },
            {
              type: 'image',
              url: `${this.data.shareData.share_info.store_code}`,
              css: {
                top: '400rpx',
                left: '740rpx',
                width: '230rpx',
                height: '230rpx'
              }
            },
            {
              type: 'text',
              text: `我是商品1十大发那扩所付那扩付你咦一`,
              css: {
                top: '640rpx',
                left: '750rpx',
                fontSize: '22rpx',
                color: '#3b3b3b',
                width: '214rpx',
                lineHeight: '30rpx',
                maxLines: '2',
              }
            },
            {
              type: 'text',
              text: `￥338.00`,
              css: {
                top: '700rpx',
                left: '760rpx',
                fontSize: '24rpx',
                color: '#e60014',
              }
            },
            {
              type: 'text',
              text: `￥688.00`,
              css: {
                top: '704rpx',
                left: '880rpx',
                fontSize: '20rpx',
                color: '#999',
                textDecoration: 'line-through',
              }
            },

            {
              type: 'text',
              text: `${this.data.shareData.share_info.store_name}`,
              css: {
                bottom: '120rpx',
                left: '60rpx',
                fontSize: '32rpx',
                color: '#3b3b3b',
                fontWeight: 'bold',
                width: '700rpx',
                lineHeight: '40rpx',
                maxLines: 2,
              }
            },
            {
              type: 'text',
              text: `地址：${this.data.shareData.share_info.store_addr}`,
              css: {
                bottom: '90rpx',
                left: '60rpx',
                fontSize: '20rpx',
                color: '#3b3b3b',
                width: '400rpx',
                maxLines: 1,
              }
            },
            {
              type: 'text',
              text: `联系方式：130000000`,
              css: {
                bottom: '60rpx',
                left: '60rpx',
                fontSize: '20rpx',
                color: '#3b3b3b',
                width: '400rpx',
                maxLines: 1,
              }
            },
            {
              type: 'image',
              url: `${this.data.shareData.share_info.store_code}`,
              css: {
                bottom: '50rpx',
                right: '70rpx',
                width: '160rpx',
                height: '160rpx'
              }
            }
          ]
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
    },
    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData') 
    },
    preventDefault() { },
    // 保存图片
    savePhoto(path) {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      this.setData({
        isDrawImage: false
      })
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
          }, 300)
        },
        fail: (res) => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting['scope.writePhotosAlbum']) {
                this.setData({
                  isModal: true
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
          }, 300)
        }
      })
    }
  }
})
