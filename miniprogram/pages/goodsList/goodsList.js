//index.js
import { showToast, showLoading } from '../../utils/toast'
const app = getApp()

Page({
  data: {
    pageIndex: 1, //页码
    pageSize: 10, //分页返回最大条数，默认10条
    hasMore: false, // 是否有更多
    goodsList: [
      {
        goods_name: '轮胎轮胎轮胎轮胎轮胎轮胎轮胎轮',
        goods_price: '123',
        original_price: '456',
        imgList: [
          'https://image.carisok.com/filesrv/release/uploads/store_0/goods_109/202003121608295872.jpg',
        ]
      }
    ]
  },

  onLoad: function () {
    this.getData()
  },

  getData() {
    let _this = this;
    showLoading()
    _this.data.hasMore = false; //避免重新加载
    wx.cloud.callFunction({
      name: "getGoodsList",
      // 传给云函数的参数
      data: {
        user_id: '', // 根据user_id去查签到记录
        pageIndex: _this.data.pageIndex,
        pageSize: _this.data.pageSize,
      },
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      let list = res.result.goodsList.data
      if (_this.data.pageIndex != 1) { //页数!=1，数据拼接
        list = _this.data.goodsList.concat(list)
      } else {
        list = list
      }
      _this.setData({
        goodsList: list,
        hasMore: res.result.hasMore
      })
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },

  /*分页*/
  onReachBottom() {
    // 加载数据
    if (this.data.hasMore) {
      this.data.pageIndex++; // 增加一页
      this.getData()
    } else {
      showLoading('没有更多了')
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    }
  },
})
