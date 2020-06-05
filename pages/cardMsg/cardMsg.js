// pages/cardMsg/cardMsg.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    seeImg:''
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
      var ss=wx.getStorageSync('seeRecord')
      rr.matchInfo[0].info.forEach(v=>{
        if(v.name=='起点'||v.name=='终点'){
          v.showName=v.name.split('')[0]
        }else{
          v.showName=v.name
        }
        if(ss){
          ss.forEach(vv=>{
            if(v.name==vv.cpName){
              v.cardImg=vv.cpImg
              v.cptime=util.timeConvert(vv.cpTime).slice(11)
            }
          })
        }
      })
      let h=ss.filter(v=>v.state==0)
      if(h.length>0){
        that.setData({
          examine:true
        })
      }
      that.setData({
        matchMsg: rr,
        info:rr.matchInfo[0].info
      })
    })
  },
  // 查看图片
  seeBig(e){
    let v=e.currentTarget.dataset.v
    this.setData({
      seeImg:v
    })
  },
  closeImg(){
    this.setData({
      seeImg:''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let opt={
      matchId:options.matchId
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
    wx.removeStorage({
      key: 'seeRecord',
    })
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