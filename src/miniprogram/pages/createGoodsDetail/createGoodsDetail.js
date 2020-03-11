//index.js
import { showToast, showLoading } from '../../utils/toast'
const app = getApp()

Page({
  data: {
    goods_name: '',
    goods_price: '',
    original_price: '',
    tempImg: [], // 本地图片临时路径
    imgList: [], // 云存储图片路径
  },

  onLoad: function() {
    
  },
  inputGoodsName(e) {
    let {
      value
    } = e.detail;
    // 去掉空格&换行，英文单双引号
    value = value.replace(/[\s\r\n\'\"]/g, '')
    this.setData({
      goods_name: value
    })
    return {
      value
    }
  },
  inputOriginalPrice(e) {
    let {
      value
    } = e.detail;
    this.setData({
      original_price: value
    })
  },
  inputGoodsPrice(e) {
    let {
      value
    } = e.detail;
    this.setData({
      goods_price: value
    })
  },
  chooseImage: function (e) {
    let that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // showLoading('上传中')
        that.setData({
          tempImg: that.data.tempImg.concat(res.tempFilePaths),
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  // 云存储图片
  add() {
    showLoading()
    if (this.data.goods_name && this.data.original_price && this.data.goods_price) { 
      const promiseArr = []
      //只能一张张上传 遍历临时的图片数组
      for (let i = 0; i < this.data.tempImg.length; i++) {
        let filePath = this.data.tempImg[i]
        let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
        //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
        promiseArr.push(new Promise((reslove, reject) => {
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix,
            filePath: filePath, // 文件路径
          }).then(res => {
            this.setData({
              imgList: this.data.imgList.concat(res.fileID)
            })
            reslove()
          }).catch(error => {
            wx.hideLoading()
            showToast('none', error)
          })
        }))
      }
      Promise.all(promiseArr).then(res => {
        this.addData()
      })
    }else {
      showToast('none', '请输入输入项')
    }
  },
  addData() {
    let _this = this;
    const db = wx.cloud.database()
    db.collection('goodsList').add({
      data: {
        goods_name: this.data.goods_name,
        goods_price: this.data.goods_price,
        original_price: this.data.original_price,
        imgList: this.data.imgList,
        user_id: '',  // 用户id
        date: Date.parse(new Date()) / 1000, // 时间戳
      },
      success: res => {
        showToast('success', '新增成功')
        wx.hideLoading()
      },
      fail: err => {
        showToast('none', '新增失败')
        wx.hideLoading()
      }
    })
  },

})
