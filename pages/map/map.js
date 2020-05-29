// pages/map/map.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: "",
    matchId: '',
    matchMsg: '',
    groupMsg: '',
    longitude: '',
    latitude: '',
    altitude: '',
    markers: [],
    polyline: [{
      points: [],
      color: "#FF0000DD",
      width: 6,
    }, {
      points: [],
      color: "#07c160",
      width: 3,
    }], //线 第一项为官方路径线 第二项为自己跑的
    circles: [],
    hasBegin: false,
    showAlert: false,
    posStart: false, //在起点
    posEnd: false, //在终点
    imgList: []
  },
  // 获取openId
  getOpenId() {
    let that = this
    if (app.globalData.openId) {
      that.setData({
        openId: app.globalData.openId,
      })
      that.getUser()
    } else {
      app.CallbackOpenid = res => {
        that.setData({
          openId: res.data.data.openid
        })
        that.getUser()
      }
    }
  },
  // 用户基本信息
  getUser() {
    let that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateBack()
        } else {
          tool({
            url: "/run/getUser",
            data: {
              openId: that.data.openId
            },
            load: true
          }).then(res => {
            let rr = res.data.data
            if (rr) {
              if (rr.phone) {
                that.getloacltion()
              } else {
                wx.navigateTo({
                  url: '/pages/signIn/signIn',
                })
              }
            } else {
              wx.navigateTo({
                url: '/pages/signIn/signIn',
              })
            }
          })
        }
      }
    })
  },
  // 获取定位
  getloacltion() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const altitude = res.altitude
        that.setData({
          longitude: longitude,
          latitude: latitude,
          altitude: altitude
        })
        that.endAround()
      },
      fail(err) {
        console.log(err)
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
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
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
      let group = rr.matchInfo[0]
      if (group.route == 0) {
        if (group.kmlFile) {
          let file = {
            fileName: group.kmlFile
          }
          tool({
            url: '/match/run/getKml',
            data: file,
            load: true
          }).then(suc => {
            let ss = suc.data.data
            let kmlLine = []
            ss.kmlProperty.kmlLines[0].points.forEach(vv => {
              kmlLine.push(vv)
            })
            let empmk = [{
              iconPath: '/image/first.png',
              id: 1,
              latitude: kmlLine[0].latitude,
              longitude: kmlLine[0].longitude,
              width: 25,
              height: 25
            }, {
              iconPath: '/image/last.png',
              id: 2,
              latitude: kmlLine[kmlLine.length - 1].latitude,
              longitude: kmlLine[kmlLine.length - 1].longitude,
              width: 25,
              height: 25
            }]
            let circle = [{
              latitude: kmlLine[0].latitude,
              longitude: kmlLine[0].longitude,
              fillColor: '#7cb5ec88',
              radius: 50
            }, {
              latitude: kmlLine[kmlLine.length - 1].latitude,
              longitude: kmlLine[kmlLine.length - 1].longitude,
              fillColor: '#7cb5ec88',
              radius: 50
            }]
            that.setData({
              'polyline[0].points': kmlLine,
              markers: empmk,
              circles: circle
            })
          })
        }
      }
      that.setData({
        matchMsg: rr,
        groupMsg: group
      })
    })
  },
  // 点击开始
  start() {
    let that = this
    that.setData({
      hasBegin: true, //已经开始
      posStart: true, //起点位置
      posEnd: false, //在终点位置
      showAlert: true //显示打卡
    })
  },
  // 判断是否在终点附近
  endAround() {
    let that = this
    let myLat = that.data.latitude
    let myLng = that.data.longitude
    let point = that.data.polyline[0]['points']
    if (point.length > 0) {
      let Dend = util.getDistance(myLat, myLng, point[point.length - 1].latitude, point[point.length - 1].longitude)
      if (Dend <= 0.05) {
        that.setData({
          posStart: false,
          posEnd: true,
          showAlert: true
        })
        return 'atEnd'
      }else {
        return 'notEnd'
      }
    }
    // else {
    //   return 'notEnd'
    // }
  },
  // 手动点击打卡
  showCard() {
    let that = this
    that.getloacltion()
    if (that.data.hasBegin) {
      let state = that.endAround()
      if (state == 'notEnd') {
        wx.showModal({
          title: '打卡提示',
          content: '定位系统监测您未在山顶附近，是否坚持打卡',
          confirmText: '确认打卡',
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.setData({
                posStart: false,
                posEnd: true,
              })
              that.putPicBtn()
            } else if (res.cancel) {}
          }
        })
      } else {
        that.setData({
          posStart: false,
          posEnd: true,
          showAlert: true
        })
      }
    } else {
      wx.showToast({
        title: '请先开始',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 打卡
  putPicBtn() {
    let that = this
    // console.log(that.data.sOe)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // // 上传图片
        wx.uploadFile({
          url: util.imgUrl + "/run/uploadImg",
          filePath: tempFilePaths[0],
          name: 'img',
          success(res) {
            const imgName = JSON.parse(res.data).data.img
            let imgUrl = util.imgUrl + '/run/query_pic?name=' + imgName
            let il = that.data.imgList
            il.push(imgName)
            that.setData({
              imgList: il
            })
            let target = {
              // matchId   groupId  openId  cpTime  cpName   cpImg   longitude   latitude   altitude
              matchId: that.data.matchId,
              groupId: that.data.groupMsg.id,
              openId: that.data.openId,
              cpTime: new Date().getTime(),
              cpImg: imgUrl,
              longitude: that.data.longitude,
              latitude: that.data.latitude,
              altitude: that.data.altitude,
            }
            if (that.data.posStart) {
              target.cpName = '起点'
            } else {
              target.cpName = '终点'
            }
            if (that.data.posEnd) {
              wx.setStorage({
                data: target,
                key: 'mountaintop',
              })
              let url = `/pages/subUser/subUser?matchId=${that.data.matchId}`
              wx.redirectTo({
                url: url,
              })
              that.setData({
                hasBegin: false,
                posStart: false,
                posEnd: false,
                showAlert: false,
              })
            } else {
              tool({
                url: '/run/person/shifeng/addToActivity',
                data: target,
                method: "POST",
                load: true
              }).then(resolve => {
                that.setData({
                  posStart: false,
                  posEnd: false,
                  showAlert: false,
                })
              })
            }
          }
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '请上传图片右',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  // 关闭打卡
  closeBind() {
    this.setData({
      showAlert: false
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    this.setData({
      matchId: Number(options.matchId)
    })
    this.getMatch()
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.getOpenId()
  },

  /* 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /* 生命周期函数--监听页面卸载*/
  onUnload: function () {

  },

  /*页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

  },

  /* 页面上拉触底事件的处理函数*/
  onReachBottom: function () {

  },

  /*用户点击右上角分享*/
  onShareAppMessage: function () {

  }
})