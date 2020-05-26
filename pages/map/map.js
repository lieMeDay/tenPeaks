// pages/map/map.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: "",
    longitude: '',
    latitude: ''
  },
  // 获取openId
  getOpenId() {
    let that = this
    if (app.globalData.openId) {
      that.setData({
        openId: app.globalData.openId,
      })
      that.getUser()
    } else {
      app.CallbackOpenid = res => {
        that.setData({
          openId: res.data.data.openid
        })
        that.getUser()
      }
    }
  },
  // 用户基本信息
  getUser() {
    let that=this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateBack()
        } else {
          tool({
            url: "/run/getUser",
            data: {
              openId: that.data.openId
            },
            load: true
          }).then(res => {
            let rr = res.data.data
            if (rr.phone) {
              that.getloacltion()
            } else {
              wx.navigateTo({
                url: '/pages/signIn/signIn',
              })
            }
          })
        }
      }
    })
  },
  // 获取定位
  getloacltion() {
    let that=this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          longitude:longitude,
          latitude:latitude
        })
      },
      fail(err) {
        wx.showModal({
          title: '定位权限为授予',
          content: '需要获取您的位置才能够继续提供服务请在设置中允许授权位置信息',
          confirmText: "授权",
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                  let r = res.authSetting
                  // if (!r["scope.userLocation"]) {}
                }
              })
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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