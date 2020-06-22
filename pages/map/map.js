// pages/map/map.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpimgList: [{
      a: '/image/cpImg/a0.png',
    }, {
      a: '/image/cpImg/a1.png',
    }, {
      a: '/image/cpImg/a2.png',
    }, {
      a: '/image/cpImg/a3.png',
    }, {
      a: '/image/cpImg/a4.png',
    }, {
      a: '/image/cpImg/a5.png',
    }, {
      a: '/image/cpImg/a6.png',
    }, {
      a: '/image/cpImg/a7.png',
    }, {
      a: '/image/cpImg/a8.png',
    }, {
      a: '/image/cpImg/a9.png',
    }, {
      a: '/image/cpImg/a10.png',
    }, {
      a: '/image/cpImg/a11.png',
    }, {
      a: '/image/cpImg/a12.png',
    }, {
      a: '/image/cpImg/a13.png',
    }, {
      a: '/image/cpImg/a14.png',
    }, {
      a: '/image/cpImg/a15.png',
    }],
    loadEnd: false,
    yiEnd: false,
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
    pointCard: {}, //正在打卡点信息
    auto: false, //是否是弹出自动打卡
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
          wx.redirectTo({
            url: `/pages/match/match?matchId=${that.data.matchId}`
          })
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
  // 开启前后台实时获取位置
  openBGloc() {
    let that = this
    wx.startLocationUpdate()
    wx.startLocationUpdateBackground({
      success(res) {
        console.log('开启后台定位成功', res)
        that.getMylocRT()
      },
      fail(res) {
        console.log('开启后台定位失败', res)
      }
    })
    wx.getSetting({
      success(res) {
        let ULB = res.authSetting
        if (!ULB.hasOwnProperty('scope.userLocationBackground')) {
          wx.showModal({
            title: '提示',
            content: '请在位置设置中选择使用小程序期间和离开小程序后',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // console.log('用户点击确定')
                that.openBG()
              }
            }
          })
        }
      }
    })
  },
  // 实时获取位置
  getMylocRT() {
    let that = this
    wx.onLocationChange(function (res) {
      that.setData({
        longitude: res.longitude,
        latitude: res.latitude,
        altitude: res.altitude,
        slongitude: res.longitude.toFixed(6),
        slatitude: res.latitude.toFixed(6),
      })
      let wz = that.endAround()
      if (wz) {
        if (!that.data.showAlert) {
          that.vibrate(0)
          that.setData({
            pointCard: wz, //正在打卡点信息
            showAlert: true, //显示打卡弹框
            auto: true, //是否自动打卡
          })
        }
      } else {
        that.setData({
          showAlert: false, //显示打卡
          auto: false, //是否自动打卡
        })
      }
    })
  },
  // 判断 openSetting 选择使用时和离开后
  openBG() {
    let that = this
    wx.openSetting({
      success(res) {
        // console.log(res.authSetting)
        let ULB = res.authSetting
        if (!ULB.hasOwnProperty('scope.userLocationBackground')) {
          wx.showModal({
            title: '提示',
            content: '请在位置设置中选择使用小程序期间和离开小程序后',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // console.log('用户点击确定')
                that.goSQ()
              }
            }
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 获取定位
  getloacltion(s, o) {
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
        if (o) {
          that.openBGloc()
        } else {
          if (s == 1) {
            let wz = that.endAround()
            if (wz) {
              that.vibrate(0)
              that.setData({
                pointCard: wz, //正在打卡点信息
                showAlert: true, //显示打卡弹框
                auto: true, //是否自动打卡
              })
            } else {
              that.setData({
                showAlert: false, //显示打卡
                auto: false, //是否自动打卡
              })
            }
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
            that.setData({
              'polyline[0].points': kmlLine
            })
          })
        }
      }
      let empmk = []
      let circle = []
      let cardPoint = []
      for (let a = 0; a < group.info.length; a++) {
        if (group.info[a].endDate != ';') {
          let op = {
            iconPath: that.data.cpimgList[a]['a'],
            id: a,
            longitude: Number(group.info[a].endDate.split(';')[0]),
            latitude: Number(group.info[a].endDate.split(';')[1]),
            width: 25,
            height: 25
          }
          if (a == group.info.length - 1) {
            op.iconPath = '/image/last.png'
          }
          empmk.push(op)
          let cq = {
            longitude: Number(group.info[a].endDate.split(';')[0]),
            latitude: Number(group.info[a].endDate.split(';')[1]),
            fillColor: '#7cb5ec88',
            radius: 50
          }
          circle.push(cq)
          let pp = {
            longitude: Number(group.info[a].endDate.split(';')[0]),
            latitude: Number(group.info[a].endDate.split(';')[1]),
            name: group.info[a].name,
            cpName: group.info[a].cpName,
            cpImg: group.info[a].cpImg,
          }
          cardPoint.push(pp)
        }
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
        listImg: listImg,
        loadEnd: true
      })
      if (!that.data.yiEnd) {
        that.setData({
          yiEnd: true
        })
        that.getloacltion(1, true)
      }
    })
  },
  // 判断是否在打卡点附近
  endAround() {
    let that = this
    let myLat = that.data.latitude
    let myLng = that.data.longitude
    let point = that.data.cardPoint
    for (let a = 0; a < point.length; a++) {
      let DD = util.getDistance(myLat, myLng, point[a].latitude, point[a].longitude)
      // a==0
      if (DD <= 0.1) {
        let ll = wx.getStorageSync('mountainList')
        if (ll) {
          let hh = ll.filter(v => v.cpName == point[a].name)
          if (hh.length <= 0) {
            return point[a]
          }
        } else {
          return point[a]
        }
      }
    }
  },
  // 打卡
  putPicBtn() {
    let that = this
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
              target.startTime = vv.cpTime
            } else {
              target.startTime = target.cpTime
            }
            target.cpName = that.data.pointCard.name
            if (that.data.pointCard.name == '终点') {
              // 自动弹出打卡
              if (that.data.auto) {
                target.auto = true
                that.hasEnd(imgName, target)
              } else {
                that.hasEnd(imgName, target)
              }
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
    that.setData({
      pointCard: {},
      showAlert: false
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
    wx.stopLocationUpdate()
    let url = `/pages/subUser/subUser?matchId=${that.data.matchId}&turl=${imgName}`
    wx.redirectTo({
      url: url,
    })
    that.setData({
      pointCard: {},
      showAlert: false,
    })
    wx.removeStorageSync('mountainStart')
    wx.removeStorageSync('mountainList')
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
    console.log(state)
    if (state) {
      that.setData({
        pointCard: state, //正在打卡点信息
        showAlert: true, //显示打卡弹框
        auto: true, //是否自动打卡
      })
    } else {
      that.setData({
        showAlert: false, //显示打卡
        auto: false, //是否自动打卡
      })
      wx.navigateTo({
        url: `/pages/card/card?matchId=${that.data.matchId}`,
      })
    }
  },
  // 震动
  vibrate(i) {
    console.log(i)
    let that = this
    wx.vibrateLong({
      success(res) {
        i = ++i
        // console.log(i)
        if (i < 3) {
          setTimeout(function () {
            that.vibrate(i)
          }, 200)
        }
      },
      fail(err) {
        console.log('暂不支持震动', err)
      }
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏转发分享按钮
    this.setData({
      matchId: Number(options.matchId)
    })
    let s = wx.getStorageSync('mountainStart')
    if (s) {
      let n = new Date().getTime()
      let b = 12 * 60 * 60 * 1000
      let a = s.startTime
      if (n > a + b) {
        wx.removeStorageSync('mountainStart')
        wx.removeStorageSync('mountainList')
      }
      if (s.matchId != options.matchId) {
        wx.removeStorageSync('mountainStart')
        wx.removeStorageSync('mountainList')
      }
    }
    wx.removeStorageSync('mountainTop')
    this.getOpenId()
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    let vh = wx.getStorageSync('mountainTop')
    if (vh) {
      let imgName = vh.cpImg.split('/run/query_pic?name=')[1]
      let url = `/pages/subUser/subUser?matchId=${this.data.matchId}&turl=${imgName}`
      wx.redirectTo({
        url: url,
      })
    }
    if (this.data.loadEnd && this.data.yiEnd) {
      this.getloacltion(1, true)
    }
  },

  /* 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /* 生命周期函数--监听页面卸载*/
  onUnload: function () {
    wx.stopLocationUpdate()
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