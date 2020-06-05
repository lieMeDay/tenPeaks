// components/rank/rank.js
const app = getApp()
const util = require('../../utils/util')
const tool = util.tool
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    matchId: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        // console.log('nn'+newVal, 'oo'+oldVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */

  data: {
    openId: '',
    matchId: '',
    matchList: [{
      logo: '',
      name: '全部山峰',
      id: '0'
    }],
    rankList: [],
    seeI: 0,
    curI: 0,
    allPer: []
  },

  /*组件的方法列表*/
  methods: {
    // 获取openId
    getOpenId() {
      if (app.globalData.openId) {
        this.setData({
          openId: app.globalData.openId,
        })
        this.needSignIn()
        this.getAllMatch()
      } else {
        app.CallbackOpenid = res => {
          this.setData({
            openId: res.data.data.openid
          })
          this.needSignIn()
          this.getAllMatch()
        }
      }
    },
    // 判断有无手机号
    needSignIn() {
      let that = this
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
        } else {
          that.setData({
            mymsg: rr
          })
        }
      })
    },
    // 获取所有赛事
    getAllMatch() {
      let that = this
      that.setData({
        matchList: [{
          logo: '',
          name: '全部山峰',
          id: '0'
        }],
        rankList: [],
        seeI: 0,
        curI: 0,
        allPer: []
      })
      tool({
        url: "/match/getMatchByOrg",
        data: {
          "orgId": 7
        },
        load: true
      }).then(res => {
        var rr = res.data.data
        let ml = that.data.matchList
        ml = ml.concat(rr)
        for (let a = 0; a < ml.length; a++) {
          if (ml[a].id == that.data.matchId) {
            that.setData({
              curI: a
            })
          }
        }
        if (!that.data.matchId) {
          that.setData({
            matchId: ml[0].id
          })
        }
        this.setData({
          matchList: ml
        })
        that.toggle(that.data.seeI)
      })
    },
    // 切换赛事
    bindPickerChange(e) {
      let that = this
      that.setData({
        curI: e.detail.value,
        matchId: that.data.matchList[e.detail.value].id
      })
      that.toggle(that.data.seeI)
    },

    // 切换 总 年 月
    toggle(e) {
      let that = this
      if (e.currentTarget) {
        var i = e.currentTarget.dataset.i
      } else {
        var i = e
      }
      that.setData({
        seeI: i
      })
      if (i == 0) {
        // 总榜
        tool({
          url: '/run/shifeng/getRankingList',
          data: {
            matchId: that.data.matchId
          }
        }).then(res => {
          let rr = res.data.data
          rr=rr.filter(vv=>vv.open_id&&vv.join_num!=0)
          let my = {}
          for(var a=0;a<rr.length;a++){
            if(rr[a].open_id == that.data.openId){
              my=rr[a]
              my.index=a
              break
            }
          }
          if (JSON.stringify(my) != "{}") {
            that.setData({
              myRank: my.index+1,
              mytotal: my.join_num
            })
          } else {
            that.setData({
              myRank: '',
              mytotal: '---'
            })
          }
          that.setData({
            rankList: rr,
          })
        })
      }else if(i==1){
        // console.log('年榜')
        tool({
          url: '/run/shifeng/getRankingListByYear',
          data: {
            matchId: that.data.matchId
          }
        }).then(res => {
          let rr = res.data.data
          rr=rr.filter(vv=>vv.open_id&&vv.join_num!=0)
          let my = {}
          for(var a=0;a<rr.length;a++){
            if(rr[a].open_id == that.data.openId){
              my=rr[a]
              my.index=a
              break
            }
          }
          if (JSON.stringify(my) != "{}") {
            that.setData({
              myRank: my.index+1,
              mytotal: my.join_num
            })
          } else {
            that.setData({
              myRank: '',
              mytotal: '---'
            })
          }
          that.setData({
            rankList: rr,
          })
        })
      }else if(i==2){
        // console.log('月榜')
        tool({
          url: '/run/shifeng/getRankingListByMonth',
          data: {
            matchId: that.data.matchId
          }
        }).then(res => {
          let rr = res.data.data
          rr=rr.filter(vv=>vv.open_id&&vv.join_num!=0)
          let my = {}
          for(var a=0;a<rr.length;a++){
            if(rr[a].open_id == that.data.openId){
              my=rr[a]
              my.index=a
              break
            }
          }
          if (JSON.stringify(my) != "{}") {
            that.setData({
              myRank: my.index+1,
              mytotal: my.join_num
            })
          } else {
            that.setData({
              myRank: '',
              mytotal: '---'
            })
          }
          that.setData({
            rankList: rr,
          })
        })
      }
    },
  }
})