// pages/seeNotice/seeNotice.js
const app = getApp()
const util = require('../../utils/util.js')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:{}
  },
  getNotice(opt){
    tool({
      url:'/match/notice/getById',
      data:opt
    }).then(res=>{
      console.log(res)
      let rr=res.data.data
      rr.noticeContent = rr.noticeContent.replace(/<img/gi, '<img class="inPimg" ')
      rr.showDate=this.timechange(rr.creatTime)
      this.setData({
        notice:rr
      })
    })
  },
  timechange(time) {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return year+'.'+month+'.'+day+" "+hour+":"+minute
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNotice(options)
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