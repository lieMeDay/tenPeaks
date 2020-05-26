// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ''
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.needSignIn()
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        this.needSignIn()
      }
    }
  },
  // 判断有无手机号
  needSignIn() {
    let that = this
    tool({
      url: "/run/getUser",
      data: {
        openId: that.data.openId
      },
      load: true
    }).then(res => {
      let rr = res.data.data
      if (!rr || !rr.phone) {
        wx.navigateTo({
          url: '/pages/signIn/signIn',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOpenId()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})