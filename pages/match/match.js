// pages/match/match.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchId: '',
    openId: '',
    matchMsg: {},
    hasInfo: true,
    userInfo: ''
  },
  // 获取openId
  getopenId() {
    let that = this
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
      }
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            hasInfo: false
          })
        }
      }
    })
  },
  // 获取赛事信息
  getMatch(opt) {
    let that = this
    tool({
      url: "/match/getMatchById",
      data: opt,
      load: true
    }).then(res => {
      let rr = res.data.data
      rr.showData = util.timeShift(rr.matchDate, rr.matchEndDate)
      rr.introduce = rr.introduce.replace(/<img/gi, '<img class="inPimg" ')
      that.setData({
        matchMsg: rr
      })
    })
  },
  // 导航 =>授权
  getUserInfoGo(e) {
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
        load: true
      }).then(res => {
        let rr = res.data.data
        if (rr) {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: rr.phone,
            headImgUrl: that.data.userInfo.avatarUrl
          }
          tool({
            url: "/run/putUser",
            data: msg,
            method: "POST",
            load: true
          }).then(vv => {
            that.goAddress()
          })
        } else {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: '',
            headImgUrl: that.data.userInfo.avatarUrl
          }
          tool({
            url: "/run/addUser",
            data: msg,
            method: "POST",
            load: true
          }).then(vv => {
            that.goAddress()
          })
        }
      })
    }
  },
  // go 导航到这里
  goAddress() {
    console.log(111)
    // wx.openLocation({
    //   latitude: 0,
    //   longitude: 0,
    // })
  },
  // 打卡 =>授权
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
        load: true
      }).then(res => {
        let rr = res.data.data
        if (rr) {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: rr.phone,
            headImgUrl: that.data.userInfo.avatarUrl
          }
          tool({
            url: "/run/putUser",
            data: msg,
            method: "POST",
            load: true
          }).then(vv => {
            that.goMap()
          })
        } else {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: '',
            headImgUrl: that.data.userInfo.avatarUrl
          }
          tool({
            url: "/run/addUser",
            data: msg,
            method: "POST",
            load: true
          }).then(vv => {
            that.goMap()
          })
        }
      })
    }
  },
  goMap() {
    wx.navigateTo({
      url: `/pages/map/map?matchId=${this.data.matchId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getopenId()
    this.setData({
      matchId: options.matchId
    })
    let opt = {
      matchId: options.matchId
    }
    this.getMatch(opt)
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