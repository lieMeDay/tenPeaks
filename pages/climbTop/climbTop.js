// pages/climbTop/climbTop.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    matchMsg: {},
    myRunNum: 0
  },
  // 获取openId
  getopenId() {
    let that = this
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getmatch()
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        this.getmatch()
      }
    }
  },
  // 获取赛事信息
  getmatch() {
    let that = this
    let opt = {
      matchId: that.data.matchId
    }
    tool({
      url: "/match/getMatchById",
      data: opt,
      load: true
    }).then(res => {
      let rr = res.data.data
      that.setData({
        matchMsg: rr,
      })
      this.getUserMatch()
      that.getMyRank()
    })
  },
  // 获取我的登顶次数
  getUserMatch() {
    let that = this
    // 首次登顶时间
    tool({
      url: '/run/person/shifeng/gets',
      data: {
        matchId: that.data.matchId,
        openId: that.data.openId
      },
      method: "GET"
    }).then(res => {
      let rr = res.data.data
      if (rr && rr.length > 0) {
        let rend = rr.filter(v => v.cpName == '终点' && v.state == 1)
        if (rend.length > 0) {
          for (var a = 0; a < rend.length; a++) {
            rend[a].showdata = util.timeConvert(rend[a].cpTime)
          }
          rend = that.sortKey(rend, 'showdata')
          rend[0].showdata= rend[0].showdata.slice(0,10)
          that.setData({
            firstDtate: rend[0].showdata
          })
        }
      }
    })

    let obj = {
      matchId: that.data.matchId,
      groupId: that.data.matchMsg.matchInfo[0].id,
      openId: that.data.openId
    }
    tool({
      url: '/run/person/shifeng/finishData/get',
      data: obj,
      method: "GET",
      load: true
    }).then(res => {
      let rr = res.data.data
      if (rr) {
        that.setData({
          myRunNum: rr.joinNum,
          myName:rr.memberName
        })
      }
    })
  },
  // 获取首次
  sortKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  },
  // 获取排行
  getMyRank() {
    let that = this
    let obj = {
      matchId: that.data.matchId,
      groupId: that.data.matchMsg.matchInfo[0].id,
      openId: that.data.openId
    }
    tool({
      url: "/run/person/shifeng/myRank",
      data: obj,
      method: "GET",
      load: true
    }).then(res => {
      if (res.data.data) {
        that.setData({
          myRank: res.data.data
        })
      } else {
        that.setData({
          myRank: '--'
        })
      }
    }).catch(err => {
      that.setData({
        myRank: '--'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      matchId: options.matchId
    })
    this.getopenId()
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