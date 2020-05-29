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
    allMatch: []
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
    tool({
      url: "/match/getMatchByOrg",
      data: {
        "orgId": 7
      },
      load: true
    }).then(res => {
      let rr = res.data.data
      that.setData({
        allMatch: rr
      })
      that.getUserMatch()
    })
  },
  // 获取用户参加的赛事
  getUserMatch(){
    let that=this
    tool({
      url:'/match/signUp/member/getByOpenId',
      data:{openId:that.data.openId}
    }).then(res=>{
      let rr=res.data.data
      let did={}
      rr = rr.reduce(function(item, next) {
        did[next.matchId] ? "" : (did[next.matchId] = true && item.push(next));
        return item;
      }, []);
      let ml=that.data.allMatch
      for(var a=0;a<ml.length;a++){
        for(var b=0;b<rr.length;b++){
          if(ml[a].id==rr[b].matchId){
            ml[a].hasRun=true
          }else{
            ml[a].hasRun=false
          }
        }
      }
      that.setData({
        allMatch:ml
      })
    })
  },
  // 获取定位
  getLocation() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // console.log(res)
      },
      fail(err) {
        // console.log(err)
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
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
    this.getLocation()
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