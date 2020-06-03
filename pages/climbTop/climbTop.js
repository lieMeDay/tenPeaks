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
    tool({
      url: '/match/signUp/member/getByOpenId',
      data: {
        openId: that.data.openId
      }
    }).then(res => {
      let ee = res.data.data
      let mymsg = []
      for (var b = 0; b < ee.length; b++) {
        if (that.data.matchId == ee[b].matchId) {
          mymsg.push(ee[b])
        }
      }
      if (mymsg.length > 0) {
        mymsg = that.sortKey(mymsg, 'signUpDate')
        for (var a = 0; a < mymsg.length; a++) {
          mymsg[a].showDate = mymsg[a].signUpDate.slice(0, 10)
          mymsg[a].showDate = mymsg[a].showDate.split('-')[0] + '/' + mymsg[a].showDate.split('-')[1] + '/' + mymsg[a].showDate.split('-')[2]
        }
      }
      that.setData({
        mymsg: mymsg
      })
    })
    
    let obj = {
      matchId: that.data.matchId,
      groupId: that.data.matchMsg.matchInfo[0].id,
      openId: that.data.openId
    }
    tool({
      url:'/run/person/shifeng/finishData/get',
      data:obj,
      method:"GET",
      load:true
    }).then(res=>{
      let ml = 0
      that.setData({
        myRunNum: ml,
      })
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
      load:true
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
    options.matchId = 112
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