const app = getApp()

Page({
  data: {
    isCanDraw: false,
    shareData: {},
  },
  onLoad() {
    this.getData();
  },
  getData() {
    let that = this
    wx.request({
      url: 'https://ssms-services.carisok.com/api/ssms-open/service/wechat/store/activity/share', //demo
      data: {
        api_version: 6.11,
        activity_id: 88,
        sstore_id: 22343
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          shareData: res.data.data
        })
      }
    })
  },
  createShareImage() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  }
})
