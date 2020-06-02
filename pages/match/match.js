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
    userInfo: '',
    myRunNum:0,
    startloc:''//起点位置
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
        matchMsg: rr,
        startloc:rr.matchInfo[0].info[0].endDate
      })
    })
  },
  // 排行 =>授权
  getUserInfoGoR(e){
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
            that.goPage(1)
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
            that.goPage(1)
          })
        }
      })
    }
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
    let that=this
    let l=that.data.startloc
    wx.openLocation({
      latitude: l.split(';')[0],
      longitude: l.split(';')[1],
    })
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
  // 三个
  goPage(e){
    let i=e
    if(i.currentTarget){
      i=currentTarget.dataset.s
    }else{
      i=e
    }
  },
  
  // 获取我的登顶次数
  getUserMatch() {
    let that = this
    tool({
      url: '/match/signUp/member/getByOpenId',
      data: {
        openId: that.data.openId
      }
    }).then(res => {
      let ee = res.data.data
      let ml=0
      for (var b = 0; b < ee.length; b++) {
        if (that.data.matchId == ee[b].matchId) {
          ml= ++ml
        }
      }
      that.setData({
        myRunNum: ml
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.matchId=112
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