// pages/subUser/subUser.js
const app = getApp()
const util = require('../../utils/util.js')
const tool = util.tool
const contryJSON = require('../../utils/contry.js')
Page({
  /*
   * 页面的初始数据
   */
  data: {
    matchPRule: {},
    priceList: [],
    powerList: [], //报名项目显示设置
    idTypeList: ["居民身份证", "港澳通行证", "护照"],
    idTypeI: 0,
    birthday: '',
    bloodList: ['O', "A", "B", "AB", "其他"],
    bloodI: 0,
    contryList: [],
    contryI: 0,
    region: [],
    customItem: '',
    ClothingList: ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"],
    ClothingI: 0,
    wsImg: [],
    healthImg: [],
    cardImg: [],
    price: 0,
    priceId: '',
    PwArr: [{
        label: "姓名",
        value: "name",
      },
      {
        label: "英文名",
        value: "englishName",
      },
      {
        label: "性别",
        value: "gender",
      },
      {
        label: "手机号",
        value: "phone",
      },
      {
        label: "证件类型",
        value: "idNumberType",
      },
      {
        label: "证件号",
        value: "idNumber",
      },
      {
        label: "血型",
        value: "bloodType",
      },
      {
        label: "国籍",
        value: "nationality",
      },
      {
        label: "地区",
        value: "region",
      },
      {
        label: "出生日期",
        value: "birthday",
      },
      {
        label: "邮箱",
        value: "email",
      },
      {
        label: "详细地址",
        value: "address",
      },
      {
        label: "衣服尺码",
        value: "clothingSize",
      },
      {
        label: "紧急联系人姓名",
        value: "emergencyContactName",
      },
      {
        label: "紧急联系人电话",
        value: "emergencyContactPhone",
      },
      {
        label: "成绩证书",
        value: "scoreReport",
      },
      {
        label: "健康证明",
        value: "healthReport",
      }
    ],
  },
  // 获取openId
  getOpenId() {
    if (app.globalData.openId) {
      this.setData({
        openId: app.globalData.openId,
      })
    } else {
      app.CallbackOpenid = res => {
        this.setData({
          openId: res.data.data.openid
        })
      }
    }
  },
  // 获取赛事价格信息
  getMatchMsg() {
    let that = this
    let opt = {
      matchId: that.data.matchId
    }
    tool({
      url: '/match/signUp/getByMatchId',
      data: opt,
      load: true
    }).then(res => {
      let rr = res.data.data
      for (var k in rr.power) {
        rr.power[k] = JSON.parse(rr.power[k])
        if (k == 'name' || k == 'gender' || k == 'phone' || k == 'idNumberType' || k == 'idNumber') {
          rr.power[k] = true
        }
      }
      that.setData({
        matchPRule: rr,
        powerList: rr.power,
        priceList: rr.matchInfo[0].priceList
      })
    })
  },
  // 证件类型选择切换
  bindPickeridType: function (e) {
    this.setData({
      idTypeI: e.detail.value
    })
  },
  // 出生日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },
  // 血型
  bindPickerbloodType: function (e) {
    console.log(e)
    this.setData({
      bloodI: e.detail.value
    })
  },
  // 国籍
  bindPickerContry(e) {
    console.log(e.detail.value)
    this.setData({
      contryI: e.detail.value
    })
  },
  // 地区
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 衣服尺码
  bindPickerClothingSize(e) {
    this.setData({
      ClothingI: e.detail.value
    })
  },
  // 选择图片
  chooseImg(e) {
    let picS = e.currentTarget.dataset.ps
    // picS ===>1 完赛证书 ; 2 健康证明
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.putImg(tempFilePaths, picS, 0)
      }
    })
  },
  // 上传图片 获取地址
  putImg(tempFilePaths, picS, i) {
    let that = this
    wx.uploadFile({
      url: util.imgUrl + "/run/uploadImg",
      filePath: tempFilePaths[i],
      name: 'img',
      success(res) {
        const imgName = JSON.parse(res.data).data.img
        let imgUrl = util.imgUrl + '/run/query_pic?name=' + imgName
        // console.log(imgUrl)
        let WI = that.data.wsImg
        let HI = that.data.healthImg
        if (picS == 1) {
          WI.push(imgUrl)
          that.setData({
            wsImg: WI
          })
        } else if (picS == 2) {
          HI.push(imgUrl)
          that.setData({
            healthImg: HI
          })
        }
      }
    })
  },
  // 选择购买
  radioChange(e) {
    let that = this
    let val = e.detail.value
    that.setData({
      priceId: val.split('a')[0],
      price: val.split('a')[1],
    })
  },
  // 删除图片
  delp(e) {
    // console.log(e.currentTarget.dataset.i)
    let that = this
    let i = e.currentTarget.dataset.i
    let picS = e.currentTarget.dataset.ps
    let WI = that.data.wsImg
    let HI = that.data.healthImg
    if (picS == 1) {
      WI.splice(i, 1)
      that.setData({
        wsImg: WI
      })
    } else if (picS == 2) {
      HI.splice(i, 1)
      that.setData({
        healthImg: HI
      })
    }
  },
  // 获取提交信息
  formSubmit(e) {
    let that = this
    var sj = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/; //手机号包括港澳台
    var yx = new RegExp(
      "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
    ); //邮箱正则表达式
    var sfz = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; //身份证正则
    let subCon = e.detail.value
    let pwList = that.data.powerList
    let trueMsg = true
    for (var k in pwList) {
      if (pwList[k]) {
        if (subCon[k] == '') {
          let pw = that.data.PwArr
          let tt = pw.filter(v => v.value == k)
          wx.showToast({
            title: '请填写' + tt[0].label,
            icon: 'none',
            duration: 2000
          })
          trueMsg = false
          break
        } else if (k == 'region') {
          let r = subCon[k]
          let c = ''
          r.forEach(v => {
            c += v + ';'
          })
          subCon[k] = c
        } else if (k == 'phone') {
          if (!sj.test(subCon[k])) {
            wx.showToast({
              title: '请填写有效手机号',
              icon: 'none',
              duration: 2000
            })
            trueMsg = false
            break
          }
        } else if (k == 'idNumber') {
          if (subCon.idNumberType == "居民身份证") {
            if (!sfz.test(subCon[k])) {
              wx.showToast({
                title: '请填写有效证件号',
                icon: 'none',
                duration: 2000
              })
              trueMsg = false
              break
            }
          }
        } else if (k == 'email') {
          if (!yx.test(subCon[k])) {
            wx.showToast({
              title: '请填写有效邮箱',
              icon: 'none',
              duration: 2000
            })
            trueMsg = false
            break
          }
        } else if (k == 'emergencyContactPhone') {
          if (!sj.test(subCon[k])) {
            wx.showToast({
              title: '请填写有效紧急联系人手机号',
              icon: 'none',
              duration: 2000
            })
            trueMsg = false
            break
          }
        }
      } else {
        subCon[k] = ''
      }
    }
    subCon.nation = '' //民族
    subCon.oldBird = '' //老鸟
    subCon.idealTime = "" //预计完赛时间
    subCon.openId = that.data.openId
    subCon.matchId = that.data.matchId
    subCon.price = that.data.price
    let wsImgPut = ''
    that.data.wsImg.forEach(item => {
      wsImgPut += item + ";";
    });
    wsImgPut = wsImgPut.substr(0, wsImgPut.length - 1);
    subCon.scoreReport = wsImgPut //成绩证书
    let healthImgPut = ''
    that.data.healthImg.forEach(item => {
      healthImgPut += item + ";";
    });
    healthImgPut = healthImgPut.substr(0, healthImgPut.length - 1);
    subCon.healthReport = healthImgPut //健康证明
    console.log(trueMsg, subCon)
    if (1 == 2) {
      tool({
        url: '/aiyunpao/match/signUp/member/add',
        data: subCon,
        method: "POST"
      }).then(res => {
        wx.hideLoading()
        if (res.data.data) {
          subCon.memberId = res.data.data.memberId
          subCon.signUpId = res.data.data.signUpId
          that.setData({
            putMsg: subCon
          })
          if (subCon.price <= 0) {

          } else {}
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '报名提交失败',
          icon: 'none',
          duration: 2000
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
    wx.hideShareMenu(); //隐藏转发分享按钮
    options.matchId = 109
    // let ll=JSON.parse(options.il)
    let ll = ["20200528180733_run.png", "20200528180740_run.png"]
    let emp = []
    ll.forEach(v => {
      let a = util.imgUrl + '/run/query_pic?name=' + v
      emp.push(a)
    })
    // console.log(emp)
    this.setData({
      matchId: options.matchId,
      cardImg: emp,
      contryList: contryJSON.contry,
    })
    this.getMatchMsg()
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