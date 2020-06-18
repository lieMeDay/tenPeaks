// pages/cardMsg/cardMsg.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({
  /**
   * 页面的初始数据
   */
  data: {
    seeImg: '',
    longitude: '',
    latitude: '',
    altitude: '',
  },

  // 获取openId
  getOpenId() {
    let that = this
    if (app.globalData.openId) {
      that.setData({
        openId: app.globalData.openId,
      })
      this.getMatch()
    } else {
      app.CallbackOpenid = res => {
        that.setData({
          openId: res.data.data.openid
        })
        this.getMatch()
      }
    }
  },
  // 获取定位
  getloacltion() {
    let that = this
    wx.getLocation({
      // type: 'wgs84',
      type: "gcj02",
      altitude: true,
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const altitude = res.altitude
        that.setData({
          longitude: longitude,
          latitude: latitude,
          altitude: altitude,
        })
      },
      fail(err) {
        console.log(err)
        if (err.errMsg == 'getLocation:fail auth deny') {
          wx.showModal({
            title: '定位权限为授予',
            content: '需要获取您的位置才能够继续提供服务请在设置中允许授权位置信息',
            confirmText: "授权",
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    let r = res.authSetting
                    // if (!r["scope.userLocation"]) {}
                  }
                })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },
  // 获取赛事信息
  getMatch() {
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
      // rr.showData = util.timeShift(rr.matchDate, rr.matchEndDate)
      var ss = wx.getStorageSync('mountainList')
      rr.matchInfo[0].info.forEach(v => {
        if (v.name == '起点' || v.name == '终点') {
          v.showName = v.name.split('')[0]
        } else {
          v.showName = v.name
        }
        if (ss) {
          ss.forEach(vv => {
            if (v.name == vv.cpName) {
              v.cardImg = vv.cpImg
              v.cptime = util.timeConvert(vv.cpTime).slice(11)
            }
          })
        }
        v.matchId = rr.id
        v.groupId = rr.matchInfo[0].id
      })
      that.setData({
        matchMsg: rr,
        info: rr.matchInfo[0].info
      })
    })
  },
  // 查看图片
  seeBig(e) {
    let v = e.currentTarget.dataset.v
    this.setData({
      seeImg: v
    })
  },
  closeImg() {
    this.setData({
      seeImg: ''
    })
  },
  // 点击打卡
  putCard(e) {
    let val = e.currentTarget.dataset.val
    console.log(val)
    let that = this
    that.getloacltion()
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '加载中...',
        })
        // 上传图片
        wx.uploadFile({
          url: util.imgUrl + "/run/uploadImg",
          filePath: tempFilePaths[0],
          name: 'img',
          success(res) {
            const imgName = JSON.parse(res.data).data.img
            let imgUrl = util.imgUrl + '/run/query_pic?name=' + imgName
            let target = {
              matchId: val.matchId,
              groupId: val.groupId,
              openId: that.data.openId,
              cpTime: new Date().getTime(),
              cpImg: imgUrl,
              longitude: that.data.longitude,
              latitude: that.data.latitude,
              altitude: that.data.altitude,
            }
            var vv = wx.getStorageSync('mountainStart')
            if (vv) {
              target.startTime = vv.cpTime
            } else {
              target.startTime = target.cpTime
            }
            target.cpName = val.name
            console.log(target)

            if (val.name == '终点') {
              that.hasEnd(imgName, target)
            } else {
              // 不是终点拍照
              tool({
                url: '/run/person/shifeng/addToActivity/auto',
                data: target,
                method: "POST",
                load: true
              }).then(resolve => {
                that.hasStart(target)
              })
            }
          }
        })
      }
    });
  },
  // 其他点打完卡
  hasStart(target) {
    wx.hideLoading()
    let that = this
    let vv = wx.getStorageSync('mountainStart')
    if (!vv) {
      wx.setStorageSync('mountainStart', target);
    }
    let ll = wx.getStorageSync('mountainList')
    if (ll) {
      ll.push(target)
      wx.setStorageSync('mountainList', ll);
    } else {
      let arr = []
      arr.push(target)
      wx.setStorageSync('mountainList', arr);
    }
    let ii = that.data.info
    ii.forEach(v => {
      if (v.name == target.cpName) {
        v.cardImg = target.cpImg
        v.cptime = util.timeConvert(target.cpTime).slice(11)
      }
    })
    that.setData({
      info: ii
    })
    wx.navigateBack()
  },
  // 终点打完卡
  hasEnd(imgName, target) {
    wx.hideLoading()
    let that = this
    wx.setStorage({
      data: target,
      key: 'mountainTop',
    })
    wx.stopLocationUpdate()
    wx.navigateBack()
    // let url = `/pages/subUser/subUser?matchId=${that.data.matchId}&turl=${imgName}`
    // wx.redirectTo({
    //   url: url,
    // })
    // wx.removeStorageSync('mountainStart')
    // wx.removeStorageSync('mountainList')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏转发分享按钮
    this.setData({
      matchId: options.matchId
    })
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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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