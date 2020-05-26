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
    cardImg:[],
    price: 0
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
        if (k == 'name' || k == 'gender' || k == 'phone') {
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
        let CI = that.data.cardImg
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
        } else if (picS == 3) {
          CI.push(imgUrl)
          that.setData({
            cardImg: CI
          })
        }
      }
    })
  },
  // 选择购买
  checkboxChange(e) {
    let that = this
    let val = e.detail.value
    let p = 0
    val.forEach(v => {
      p += Number(v.split('a')[1])
    })
    that.setData({
      price: p
    })
  },
  // 获取提交信息
  formSubmit(e) {
    let subCon = e.detail.value
    console.log(subCon)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//隐藏转发分享按钮
    options = {
      matchId: 100
    }
    this.setData({
      matchId: options.matchId,
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