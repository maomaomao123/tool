// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext();
  let pageIndex = event.pageIndex ? event.pageIndex : 1; //页码
  let pageSize = event.pageSize ? event.pageSize : 10;
  // 返回总条数
  let countResult = await db.collection("goodsList")
    .where({
      user_id: event.user_id,
    })
    .count()
  let total = countResult.total; // 得到的总条数
  let totalPage = Math.ceil(total / 10)
  let hasMore; // 是否还有数据
  if (pageIndex < totalPage) {
    hasMore = true;
  } else {
    hasMore = false;
  }

  // 返回数据
  let goodsList = await db.collection("goodsList")
    .where({
      user_id: event.user_id,
    })
    .limit(pageSize) // 限制返回数量
    .orderBy('date', 'desc')  //时间倒序
    .get()
  return {
    goodsList,
    hasMore,
    //  openid: wxContext.OPENID,
    //  appid: wxContext.APPID,
    //  unionid: wxContext.UNIONID,
  }
}