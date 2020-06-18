// pages/banner/banner.js
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getMsg(opt) {
    tool({
      url: '/slideshow/getSlideshowById',
      data: opt
    }).then(res => {
      let rr = res.data.data
      if (rr.infos) {
        rr.infos = rr.infos.replace(/<img/gi, '<img class="inPimg" ')
      }
      this.setData({
        msg: rr
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let opt = {
      id: options.id
    }
    this.getMsg(opt)
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