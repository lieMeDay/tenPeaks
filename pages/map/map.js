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
    showAlert: false,
    posStart: false, //在起点
    posEnd: false, //在终点
    auto: false, //是否是弹出自动打卡
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
                that.getMatch()
                that.setData({
                  myMsg: rr
                })
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
  getloacltion(s) {
    if (s.currentTarget) {
      s = s.currentTarget.dataset.s
    } else {
      s = s
    }
    // s==1>点击页面的图标 s==2>表示js里调用定位
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
          slongitude: longitude.toFixed(6),
          slatitude: latitude.toFixed(6),
        })
        if (s == 1) {
          let wz = that.endAround()
          if (wz == 'atEnd') {
            that.setData({
              posStart: false,
              posEnd: true,
              showAlert: true,
              auto: true
            })
          } else if (wz == 'atStart') {
            let vv = wx.getStorageSync('mountainStart')
            if (!vv) {
              that.setData({
                posStart: true, //起点位置
                posEnd: false, //在终点位置
                showAlert: true, //显示打卡
                auto: true
              })
            }
          } else {
            that.setData({
              // posStart: false, //起点位置
              // posEnd: false, //在终点位置
              showAlert: false, //显示打卡
              auto: false
            })
          }
        }
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
              iconPath: '/image/last.png',
              id: 2,
              longitude: kmlLine[kmlLine.length - 1].longitude,
              latitude: kmlLine[kmlLine.length - 1].latitude,
              width: 25,
              height: 25
            }]
            let circle = [{
              longitude: kmlLine[kmlLine.length - 1].longitude,
              latitude: kmlLine[kmlLine.length - 1].latitude,
              fillColor: '#7cb5ec88',
              radius: 50
            }]
            let cardPoint = [{
              longitude: kmlLine[0].longitude,
              latitude: kmlLine[0].latitude,
            }, {
              longitude: kmlLine[kmlLine.length - 1].longitude,
              latitude: kmlLine[kmlLine.length - 1].latitude,
            }]
            that.setData({
              'polyline[0].points': kmlLine,
              markers: empmk,
              circles: circle,
              cardPoint: cardPoint
            })
            let listImg = []
            listImg.push(group.info[0])
            listImg.push(group.info[group.info])
            that.setData({
              matchMsg: rr,
              groupMsg: group,
              listImg: listImg
            })
            that.getloacltion(1)
          })
        }
      } else {
        let empmk = [{
          iconPath: '/image/last.png',
          id: 2,
          longitude: Number(group.info[group.info.length - 1].endDate.split(';')[0]),
          latitude: Number(group.info[group.info.length - 1].endDate.split(';')[1]),
          width: 25,
          height: 25
        }]
        let circle = [{
          longitude: Number(group.info[group.info.length - 1].endDate.split(';')[0]),
          latitude: Number(group.info[group.info.length - 1].endDate.split(';')[1]),
          fillColor: '#7cb5ec88',
          radius: 50
        }]
        let cardPoint = [{
          longitude: Number(group.info[group.info.length - 1].endDate.split(';')[0]),
          latitude: Number(group.info[group.info.length - 1].endDate.split(';')[1]),
        }]
        if (Number(group.info[0].endDate.split(';')[0])) {
          cardPoint.unshift({
            longitude: Number(group.info[0].endDate.split(';')[0]),
            latitude: Number(group.info[0].endDate.split(';')[1]),
          })
        }
        that.setData({
          markers: empmk,
          circles: circle,
          cardPoint: cardPoint
        })
        let listImg = []
        listImg.push(group.info[0])
        listImg.push(group.info[group.info])
        that.setData({
          matchMsg: rr,
          groupMsg: group,
          listImg: listImg
        })
        that.getloacltion(1)
      }
    })
  },
  // 判断是否在打卡点附近
  endAround() {
    let that = this
    let myLat = that.data.latitude
    let myLng = that.data.longitude
    let point = that.data.cardPoint
    let Dend = util.getDistance(myLat, myLng, point[point.length - 1].latitude, point[point.length - 1].longitude)
    if (Dend <= 0.1) {
      return 'atEnd'
    } else if (point.length > 1) {
      let Dstart = util.getDistance(myLat, myLng, point[0].latitude, point[0].longitude)
      if (Dstart <= 0.1) {
        return 'atStart'
      } else {
        return 'notCpoint'
      }
    } else {
      return 'notCpoint'
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
            let il = that.data.imgList
            il.push(imgName)
            that.setData({
              imgList: il
            })
            let target = {
              matchId: that.data.matchId,
              groupId: that.data.groupMsg.id,
              openId: that.data.openId,
              cpTime: new Date().getTime(),
              cpImg: imgUrl,
              longitude: that.data.longitude,
              latitude: that.data.latitude,
              altitude: that.data.altitude,
            }
            var vv = wx.getStorageSync('mountainStart')
            if (vv) {
              that.data.posEnd = true
              target.startTime = vv.cpTime
            } else {
              target.startTime = target.cpTime
            }
            // 终点
            if (that.data.posEnd) {
              target.cpName = '终点'
              // 自动弹出打卡
              if (that.data.auto) {
                target.auto = true
                that.hasEnd(imgName, target)
              } else {
                that.hasEnd(imgName, target)
              }
            } else {
              // 起点拍照打卡
              target.cpName = '起点'
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
      },
      fail: function (err) {
        wx.showToast({
          title: '请上传图片呦',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  // 起点打完卡
  hasStart(target) {
    wx.hideLoading()
    let that = this
    wx.setStorage({
      data: target,
      key: 'mountainStart',
    })
    that.setData({
      posStart: false,
      posEnd: false,
      showAlert: false,
      hasqid: true
    })
  },
  // 终点打完卡
  hasEnd(imgName, target) {
    wx.hideLoading()
    let that = this
    wx.setStorage({
      data: target,
      key: 'mountainTop',
    })
    let url = `/pages/subUser/subUser?matchId=${that.data.matchId}&turl=${imgName}`
    wx.redirectTo({
      url: url,
    })
    that.setData({
      posStart: false,
      posEnd: false,
      showAlert: false,
    })
    wx.removeStorage({
      key: 'mountainStart',
    })
  },
  // 关闭打卡
  closeBind() {
    this.setData({
      showAlert: false
    })
  },
  // 点击打卡
  toCard() {
    let that = this
    that.getloacltion(2)
    let state = that.endAround()
    if (state == 'atEnd') {
      that.setData({
        posStart: false,
        posEnd: true,
        showAlert: true,
        auto: true
      })
    } else if (state == 'atStart') {
      let vv = wx.getStorageSync('mountainStart')
      if (!vv) {
        that.setData({
          posStart: true, //起点位置
          posEnd: false, //在终点位置
          showAlert: true, //显示打卡
          auto: true
        })
      }
    } else {
      let vv = wx.getStorageSync('mountainStart')
      if (vv) {
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
                auto: false
              })
              that.putPicBtn()
            } else if (res.cancel) {}
          }
        })
      } else {
        that.setData({
          posStart: true, //起点位置
          posEnd: false, //在终点位置
          showAlert: true, //显示打卡
          auto: false
        })
      }
    }
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    let s = wx.getStorageSync('mountainStart')
    if (s) {
      let n = new Date().getTime()
      let b = 12 * 60 * 60 * 1000
      let a = s.startTime
      if (n > a + b) {
        wx.removeStorage({
          key: 'mountainStart',
        })
      }
    }
    wx.removeStorage({
      key: 'mountainTop',
    })
    this.setData({
      matchId: Number(options.matchId)
    })
    // this.getMatch()
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