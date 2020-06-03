// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    openId: '',
    hasInfo: false,
    userInfo: {},
    goldList:[1,2,3,4,5,6,7,8,9,10],
    total:[]
  },
  // 获取openId
  getOpenId() {
    let that = this
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      this.getMatch()
      if(that.data.flag){
        this.needSignIn()
        this.getUserMatch()
      }
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        this.getMatch()
        if(that.data.flag){
          this.needSignIn()
          this.getUserMatch()
        }
      }
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setData({
                hasInfo: true,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  // 判断有无手机号
  needSignIn() {
    let that = this
    that.setData({
      flag:false
    })
    tool({
      url: "/run/getUser",
      data: {
        openId: that.data.openId
      },
      load: true
    }).then(res => {
      let rr = res.data.data
      if (!rr || !rr.phone) {
        wx.navigateTo({
          url: '/pages/signIn/signIn',
        })
      }
    })
  },
  // 获取登录授权
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
      }).then(suc => {
        let ss = suc.data.data
        if (ss) {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: ss.phone,
            headImgUrl: that.data.userInfo.avatarUrl,
            id: ss.id
          }
          tool({
            url: "/run/putUser",
            data: msg,
            method: "POST"
          })
        } else {
          let msg = {
            openId: that.data.openId,
            nikeName: that.data.userInfo.nickName,
            sex: that.data.userInfo.gender == 0 ? '未知' : that.data.userInfo.gender == 1 ? '男' : '女',
            city: that.data.userInfo.city,
            phone: '',
            headImgUrl: that.data.userInfo.avatarUrl,
          }
          tool({
            url: "/run/addUser",
            data: msg,
            method: "POST"
          })
        }
      })
    } else {
      that.setData({
        hasInfo: false
      })
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
      var rr = res.data.data
      for(let a=0;a<rr.length;a++){
        let opt ={matchId:rr[a].id}
        tool({
          url: "/match/getMatchById",
          data: opt,
          load: true
        }).then(val=>{
          let vv=val.data.data.matchInfo
          rr[a].showName=vv[0].name
          that.setData({
            allMatch: rr
          })
        })
      }
      that.setData({
        allMatch: rr
      })
    })
  },
  // 获取用户参加所有的赛事次数
  getUserMatch() {
    let that = this
    that.setData({
      flag:false
    })
    tool({
      url: '/match/signUp/member/getByOpenId',
      data: {
        openId: that.data.openId
      }
    }).then(res => {
      let ee = res.data.data
      if(ee){
        that.setData({
          total:ee
        })
      }else{
        that.setData({
          total:[]
        })
      }
      that.gethasR()
    })
  },
  // 跑过的赛事
  gethasR(){
    let that=this
    let allMatch=that.data.allMatch
    let myTotal=that.data.total
    let rNum=0
    for(var a=0;a<allMatch.length;a++){
      for(var b=0;b<myTotal.length;b++){
        if(allMatch[a].id==myTotal[b].matchId){
          allMatch[a].hasRun=true
          rNum++
        }
      }
    }
    that.setData({
      allMatch:allMatch,
      rNum:rNum
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.getOpenId()
  },

  /*生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*生命周期函数--监听页面显示*/
  onShow: function () {
    if(this.data.openId&&this.data.flag){
      this.needSignIn()
      this.getUserMatch()
    }
  },

  /*生命周期函数--监听页面隐藏*/
  onHide: function () {
    this.setData({
      flag:true
    })
  },

  /*生命周期函数--监听页面卸载*/
  onUnload: function () {

  },

  /*页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

  },

  /*页面上拉触底事件的处理函数*/
  onReachBottom: function () {

  },

  /*用户点击右上角分享*/
  onShareAppMessage: function () {

  }
})