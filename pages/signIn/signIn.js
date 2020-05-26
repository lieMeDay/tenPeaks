// pages/signIn/signIn.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    userInfo: {}
  },
  // 取消绑定
  cancle() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 绑定手机号
  getPhoneNumber(e) {
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          let JSCODE = res.code
          tool({
            url: "/run/getOpenId",
            data: {
              code: JSCODE
            },
          }).then(res => {
            that.setData({
              openId: res.data.data.openid
            })
            let obj = {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              sessionKey: res.data.data.session_key
            }
            tool({
              url: "/run/getPhone",
              data: obj,
            }).then(val => {
              if (val.data.data) {
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
                      phone: val.data.data.phoneNumber,
                      headImgUrl: that.data.userInfo.avatarUrl,
                      id: ss.id
                    }
                    tool({
                      url: "/run/putUser",
                      data: msg,
                      method: "POST"
                    }).then(vv => {
                      wx.navigateBack()
                    })
                  } else {
                    let msg = {
                      openId: that.data.openId,
                      nikeName: '',
                      sex: '',
                      city: '',
                      phone: val.data.data.phoneNumber,
                      headImgUrl: '',
                    }
                    tool({
                      url: "/run/addUser",
                      data: msg,
                      method: "POST"
                    }).then(vv => {
                      wx.navigateBack()
                    })
                  }
                })
              }
            })
          })
        }
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
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