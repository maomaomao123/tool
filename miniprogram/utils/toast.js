const showToast = (type,des) => {
    wx.showToast({
        icon: type || 'success',
        title: des || '操作成功',
        duration: 2000
    })
}
const showLoading = (title) => {
    wx.showLoading({
        title: title || 'loading',
    })
}

export {
    showToast,
    showLoading
}