// pages/order/order.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getOrder()
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        this.getOrder()
      }
    }
  },
  // 获取订单
  getOrder() {
    let that = this
    tool({
      url: '/match/signUp/order/getByOpenId',
      data: {
        openId: that.data.openId
      }
    }).then(res => {
      let rr = res.data.data
      let dd = res.data.data
      for (var a = 0; a < rr.length; a++) {
        rr[a].orderShowDate = rr[a].orderDate.substring(0, 10)
      }
      let oo = {}
      rr = rr.reduce(function (item, next) {
        oo[next.matchId] ?
          "" :
          (oo[next.matchId] = true && item.push(next));
        return item;
      }, []);
      that.orderMsg(rr, 0, rr.length, dd)
    })
  },
  // 获取产品信息
  orderMsg(rr, a, length, dd) {
    let that = this
    tool({
      url: '/match/signUp/getByMatchId',
      data: {
        matchId: rr[a].matchId
      }
    }).then(val => {
      let vv = val.data.data
      for (let b = 0; b < dd.length; b++) {
        if (vv.matchId == dd[b].matchId) {
          dd[b].logo = vv.logo
          let ss = vv.matchInfo[0].priceList
          for (let c = 0; c < ss.length; c++) {
            if (ss[c].id == dd[b].coupon) {
              dd[b].orderName = ss[c].name
            }
          }
        }
      }
      if (++a < length) {
        that.orderMsg(rr, a, rr.length, dd)
      } else {
        this.setData({
          orderList: dd
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
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