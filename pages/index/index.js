//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    allMatch: [],
    curIndex: 0
  },
  swiperChange(e) {
    // console.log(e.detail.current)
    this.setData({
      curIndex: e.detail.current
    })
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getMatch()
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        this.getMatch()
      }
    }
  },
  // 获取赛事
  getMatch() {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    tool({
      url: "/match/getMatchByOrg",
      data: {
        "orgId": 7
      },
    }).then(res => {
      var rr = res.data.data
      that.matchMsg(rr, 0, rr.length)
      that.setData({
        allMatch: rr
      })
      this.getTopNum()
    })
  },
  // 获取赛事信息
  matchMsg(rr, a, length) {
    // console.log(1)
    let that = this
    rr[a].altitude = 0
    let opt = {
      matchId: rr[a].id
    }
    tool({
      url: "/match/getMatchById",
      data: opt,
    }).then(val => {
      let vv = val.data.data.matchInfo
      rr[a].altitude = vv[0].rise
      that.setData({
        allMatch: rr
      })
      let obj = {
        matchId: rr[a].id,
        groupId: vv[0].id,
        openId: that.data.openId
      }
      that.getUserMatch(obj, rr, a, length)
    })
  },
  // 获取用户赛事登顶次数
  getUserMatch(obj, ml, a, length) {
    let that = this
    tool({
      url: '/run/person/shifeng/finishData/get',
      data: obj,
      method: "GET",
    }).then(res => {
      let rr = res.data.data
      if (rr&&rr.joinNum>0) {
        ml[a].hasRun = true
        ml[a].myRunNum = rr.joinNum
      } else {
        ml[a].hasRun = false
        ml[a].myRunNum = 0
      }
      if (++a < length) {
        that.matchMsg(ml, a, length)
      } else {
        wx.hideLoading()
        that.setData({
          allMatch: ml
        })
      }
    })
  },
  // 获取赛事总登顶人数
  getTopNum() {
    let that = this
    tool({
      url: '/run/person/shifeng/count',
      method: "GET"
    }).then(res => {
      let rr = res.data.data
      let ml = that.data.allMatch
      for (var b = 0; b < ml.length; b++) {
        ml[b].runNum = 0
        for (var a = 0; a < rr.length; a++) {
          if (rr[a].match_id == ml[b].id) {
            ml[b].runNum = rr[a].num
          }
        }
      }
      that.setData({
        allMatch: ml
      })
    })
  },
  // 获取定位
  getLoc() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // console.log(res)
      },
      fail(err) {
        console.log(err)
        if (err.errMsg == 'getLocation:fail auth deny') {
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
              } else if (res.cancel) {}
            }
          })
        }
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
    this.getLoc()
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})