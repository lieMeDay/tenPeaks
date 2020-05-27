// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    hasInfo: false,
    userInfo: {}
  },
  // 获取openId
  getOpenId() {
    let that = this
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
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setData({
                hasInfo: true,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
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
  getUserInfo(e) {
    let that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        hasInfo: true,
        userInfo: e.detail.userInfo
      })
      tool({
        url: "/run/getUser",
        data: {
          openId: that.data.openId
        },
      }).then(suc => {
        let ss = suc.data.data
        if (ss) {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: ss.phone,
            headImgUrl: that.data.userInfo.avatarUrl,
            id: ss.id
          }
          tool({
            url: "/run/putUser",
            data: msg,
            method: "POST"
          })
        } else {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: '',
            headImgUrl: that.data.userInfo.avatarUrl,
          }
          tool({
            url: "/run/addUser",
            data: msg,
            method: "POST"
          })
        }
      })
    } else {
      that.setData({
        hasInfo: false
      })
    }
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },

  /*生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*生命周期函数--监听页面显示*/
  onShow: function () {
    this.getOpenId()
  },

  /*生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /*生命周期函数--监听页面卸载*/
  onUnload: function () {

  },

  /*页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

  },

  /*页面上拉触底事件的处理函数*/
  onReachBottom: function () {

  },

  /*用户点击右上角分享*/
  onShareAppMessage: function () {

  }
})