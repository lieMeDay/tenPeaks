// pagesA/notice/notice.js
const app = getApp()
const util = require('../../utils/util.js')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: []
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
      that.getNotice(rr, 0, rr.length, [])
    })
  },
  getNotice(rr, a, length, list) {
    let that = this
    tool({
      url: '/match/notice/getByMatchId',
      data: {
        matchId: rr[a].id
      }
    }).then(res => {
      let ss = res.data.data
      list = list.concat(ss)
      if (++a < length) {
        that.getNotice(rr, a, length, list)
      } else {
        wx.hideLoading()
        list.forEach(v => {
          let ipu = v.noticeCover.split('9090/')[1]
          v.noticeCover = util.imgUrl + '/run/query_pic?name=' + ipu
          v.showDate = this.timechange(v.creatTime)
        })
        this.setData({
          noticeList: list
        })
      }
    })
  },
  timechange(time) {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return year + '.' + month + '.' + day + " " + hour + ":" + minute
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMatch()
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