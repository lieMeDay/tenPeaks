// pages/record/record.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    allData: [],
    allRecord: []
  },
  // 获取openId
  getOpenId() {
    let that = this
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
      that.getAllData()
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
        that.getAllData()
      }
    }
  },
  // 获取所有
  getAllData() {
    let that = this
    let op = {
      openId: that.data.openId
    }
    tool({
      url: '/run/person/shifeng/getByOpenId',
      data: op,
      method: "GET"
    }).then(res => {
      let rr = res.data.data
      let dd = res.data.data
      if(rr.length>0){
        that.setData({
          allData: dd
        })
        let oo = {}
        rr = rr.reduce(function (item, next) {
          oo[next.startTime] ?
            "" :
            (oo[next.startTime] = true && item.push(next));
          return item;
        }, []);
  
        function sortData(a, b) {
          return b.startTime - a.startTime
        }
        rr = rr.sort(sortData);
        for(var c=0;c<rr.length;c++){
          if(rr[c].cpName=='起点'){
            let uu = dd.filter(s => s.startTime == rr[c].startTime)
            if(uu.length<=1){
              rr.splice(c--, 1);
            }
          }
        }
        that.forV(rr, 0, rr.length, dd)
      }
    })
  },
  forV(rr, a, length, dd) {
    let that = this
    let uu = dd.filter(s => s.startTime == rr[a].startTime)

    function sortData(a, b) {
      return a.cpTime - b.cpTime
    }
    uu = uu.sort(sortData);
    rr[a].useTime = util.formatSeconds(parseInt((uu[uu.length - 1].cpTime - uu[0].cpTime) / 1000))
    rr[a].runtime = util.timeConvert(rr[a].cpTime).slice(0, 10)
    rr[a].year = Number(rr[a].runtime.split('/')[0])
    rr[a].month = Number(rr[a].runtime.split('/')[1])
    let opt = {
      matchId: rr[a].matchId
    }
    tool({
      url: "/match/getMatchById",
      data: opt,
      load: true
    }).then(suc => {
      let ss = suc.data.data
      rr[a].name = ss.matchInfo[0].name
      var map = {},
        dest = [];
      for (var i = 0; i < rr.length; i++) {
        var ai = rr[i];
        if (!map[ai.year]) {
          dest.push({
            year: ai.year,
            month: ai.month,
            data: [ai]
          });
          map[ai.year] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.year == ai.year) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      if (++a < length) {
        that.forV(rr, a, length, dd)
      } else {
        that.setData({
          allRecord: dest
        })
      }
    })
  },
  // 看
  seeCard(e) {
    let that = this
    let v = e.currentTarget.dataset.v
    let dd = that.data.allData
    let oo = dd.filter(s => s.startTime == v.startTime)
    wx.setStorageSync('seeRecord', oo)
    wx.navigateTo({
      url: `/pages/cardMsg/cardMsg?matchId=${v.matchId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
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