// pagesC/feedback/feedback.js
const app=getApp()
const util = require('../../utils/util')
const tool = util.tool
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    textV: '',
    openId:''
  },
  
  // 获取openId
  getOpenId() {
    let that = this
    if (app.globalData.openId) {
      that.setData({
        openId: app.globalData.openId,
      })
    } else {
      app.CallbackOpenid = res => {
        that.setData({
          openId: res.data.data.openid
        })
      }
    }
  },
  // 选择图片
  chooseImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // let bdil = that.data.bdImgList
        // bdil.push(tempFilePaths[0])
        // that.setData({
        //   bdImgList: bdil
        // })
        // // 上传图片
        wx.uploadFile({
          url: util.imgUrl + "/run/uploadImg",
          filePath: tempFilePaths[0],
          name: 'img',
          success(res) {
            const imgName = JSON.parse(res.data).data.img
            let imgUrl = util.imgUrl + '/run/query_pic?name=' + imgName
            let il = that.data.imgList
            il.push(imgUrl)
            that.setData({
              imgList: il
            })
          }
        })
      }
    })
  },
  // 删除图片
  delp(e) {
    // console.log(e.currentTarget.dataset.i)
    let that = this
    let i = e.currentTarget.dataset.i
    let il = that.data.imgList
    il.splice(i, 1)
    that.setData({
      imgList: il
    })
  },
  bindtextV(e) {
    this.setData({
      textV: e.detail.value
    })
  },
  subBind() {
    let that = this
    let newImg = that.data.imgList.join(';')
    let obj = {
      openId: that.data.openId,
      content: that.data.textV,
      quesImg: newImg,
      time: new Date().getTime()
    }
    console.log(obj)
    tool({
      url:'/run/addFeedback',
      data:obj,
      method:"POST"
    }).then(res=>{
      wx.showModal({
        title: '提示',
        content: '提交成功，感谢反馈',
        showCancel:false,
        success (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateBack()
          }
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
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