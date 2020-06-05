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
    goldList:[],
    total:0,
    rNum:0
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
      }
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        this.getMatch()
        if(that.data.flag){
          this.needSignIn()
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
    that.setData({
      total:0,
      rNum:0
    })
    that.allTime()
    tool({
      url: "/match/getMatchByOrg",
      data: {
        "orgId": 7
      },
      load: true
    }).then(res => {
      var rr = res.data.data
      that.getMatchMsg(rr,0,rr.length)
      that.setData({
        allMatch: rr
      })
    })
  },
  // 获取赛事信息
  getMatchMsg(rr,a,length){
    let that=this
      let opt ={matchId:rr[a].id}
      wx.showLoading({
        title: '加载中...',
      })
      tool({
        url: "/match/getMatchById",
        data: opt,
        // load: true
      }).then(val=>{
        let vv=val.data.data.matchInfo
        rr[a].showName=vv[0].name
        that.setData({
          allMatch: rr
        })
        let obj = {
          matchId: rr[a].id,
          groupId: vv[0].id,
          openId: that.data.openId
        }
        that.getUserMatch(obj, rr, a,length)
      })
    
  },
  // 总用时
  allTime(){
    let that=this
    let op={
      openId: that.data.openId
    }
    tool({
      url: '/run/person/shifeng/getByOpenId',
      data: op,
      method: "GET"
    }).then(res=>{
      let rr = res.data.data
      let dd=res.data.data
      rr=rr.filter(vv=>vv.state==1&&vv.cpName=='终点')
      dd=dd.filter(vv=>vv.state==1)
      let oo = {}
      rr = rr.reduce(function (item, next) {
        oo[next.startTime] ?
          "" :
          (oo[next.startTime] = true && item.push(next));
        return item;
      }, []);
      let ut=0
      for (let a = 0; a < rr.length; a++) {
        let uu = dd.filter(s => s.startTime == rr[a].startTime)
        ut+=uu[uu.length - 1].cpTime - uu[0].cpTime
      }
      that.setData({
        allUseTime:Math.round(ut/1000/3600)
      })
    })
  },
  // 获取用户赛事登顶次数
  getUserMatch(obj, ml, a,length) {
    let that = this
    tool({
      url: '/run/person/shifeng/finishData/get',
      data: obj,
      method: "GET",
      // load: true
    }).then(res => {
      let rr = res.data.data
      if (rr) {
        ml[a].hasRun = true
        let rNum=that.data.rNum
        rNum+=1
        that.setData({
          rNum:rNum
        })
        ml[a].myRunNum=rr.joinNum
      } else {
        ml[a].hasRun = false
        ml[a].myRunNum=0
      }
      let total=that.data.total
      total+=ml[a].myRunNum
      that.setData({
        total:total
      })
      if(++a<length){
        that.getMatchMsg(ml,a,length)
      }else{
        wx.hideLoading()
        that.setData({
          allMatch: ml,
        })
      }
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    
  },

  /*生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*生命周期函数--监听页面显示*/
  onShow: function () {
    if(this.data.openId&&this.data.flag){
      this.needSignIn()
    }
    this.getOpenId()
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