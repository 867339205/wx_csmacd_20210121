// pages/csma/csma.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag_time:{flag_1:96,flag_2:512,flag_3:48,},//各种时延的时间
    bit_time:1,//比特时间
 time_all:{time:0,star:0},
 time_all_id:-1,
 num:[1,1],//第几个数据帧
 flag_a:{flag:1,time:0},//哪一个步骤,时间
 flag_b: { flag: 1, time: 0},//哪一个步骤,时间
    detail_a: [{ text: '第1个数据帧准备发送', title: 1 }, { text: '空闲监听中...', title: 0 }],
    detail_b: [{ text: '第1个数据帧准备发送', title: 1 }, { text: '空闲监听中...', title: 0 }],
    data:[{color:0,top:-50,send:0},{color:0,top:800,send:0}],//数据帧的情况
    trable:[{top:0},{top:0}],//冲突的地方
    trable_i:[0,0],//是否存在冲突
    bit: [{ flag: 1, num: 0 }, { flag: 1, num: 0}],//当前正在发送的帧状态
    again:[0,0],//重传次数
    again_time:[0,0],//重传还需等待时间
    over_3:[1,1],//强化冲突发送完
    over_4:[1,1],//监听到强化冲突
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  star_tap:function(){
    var that=this;
    var time_all=that.data.time_all;
    var time_all_id = that.time_all_id;
    var bit_time = that.data.bit_time;
    time_all.star=1;
    that.setData({
      time_all: time_all
    })

    //加入循环定时
    time_all_id = setInterval(function(){
      var time_all = that.data.time_all;
      time_all.time = time_all.time+1;
      //time_all.time = time_all.time.toFixed(1);
      that.send();
      that.setData({
        time_all: time_all 
      })

    }, bit_time)
    that.setData({
      time_all_id: time_all_id 
    })

  },
  stop_tap:function(){
    var that=this;
    clearInterval(that.data.time_all_id);
    that.setData({
      flag_time: { flag_1: 96, flag_2: 512, flag_3: 48, },//各种时延的时间
      bit_time: 0.01,//比特时间
      time_all: { time: 0, star: 0 },
      time_all_id: -1,
      num: [1, 1],//第几个数据帧
      flag_a: { flag: 1, time: 0 },//哪一个步骤,时间
      flag_b: { flag: 1, time: 0 },//哪一个步骤,时间
      detail_a: [{ text: '第1个数据帧准备发送', title: 1 }, { text: '空闲监听中...', title: 0 }],
      detail_b: [{ text: '第1个数据帧准备发送', title: 1 }, { text: '空闲监听中...', title: 0 }],
      data: [{ color: 0, top: -50, send: 0 }, { color: 0, top: 800, send: 0 }],//数据帧的情况
      trable: [{ top: 0 }, { top: 0 }],//冲突的地方
      trable_i: [0, 0],//是否存在冲突
      bit: [{ flag: 1, num: 0 }, { flag: 1, num: 0 }],//当前正在发送的帧状态
      again: [0, 0],//重传次数
      again_time: [0, 0],//重传还需等待时间
      over_3: [1, 1],//强化冲突发送完
      over_4: [1, 1],//监听到强化冲突
    })
  },
  send:function(){
    var that = this;
    var flag_time=that.data.flag_time;//各种时延的时间
    var num=that.data.num;//第几个数据帧
    var  flag_a=that.data.flag_a;//哪一个步骤,时间
    var flag_b = that.data.flag_b;//哪一个步骤,时间
    var trable=that.data.trable;//冲突的地方
    var trable_i=that.data.trable_i;//是否存在冲突
    var bit=that.data.bit;//当前正在发送的比特状态
    var again=that.data.again;//重传次数
    var data = that.data.data;//数据帧的情况
    var again_time=that.data.again_time;//重传还需等待时间
    var detail_a = that.data.detail_a;
    var detail_b = that.data.detail_b;
    var over_3 = that.data.over_3;
    var over_4 = that.data.over_4;
if(num[0]>11&&num[1]>11){
  clearInterval(that.data.time_all_id);
}
  //主机A
  if(num[0]==11){
    detail_a[detail_a.length] = { text: '主机A数据已经传输完毕！', title: 1 };
    num[0]+=1;
    flag_a.flag=0;
  }
  else if(num[0]>11){

  }
  //监听空闲
  
   else if(flag_a.flag==1){
     if (flag_a.time == flag_time.flag_1){
       //开始传输
       flag_a.flag=2;
       flag_a.time=1;
       data[0].send=1;
       detail_a[detail_a.length] = { text: '开始发送数据帧中...', title: 0 };
     }
     else if(data[1].send==1&&data[1].top<=0){
      flag_a.flag=5;
      flag_a.time=1;
       detail_a[detail_a.length] = { text: '监听信道繁忙中...', title: 0 };
     }
     else{
       flag_a.time = flag_a.time+1;
     }
   }
   //发送数据
   else if(flag_a.flag==2){
     //console.log(data[0].top)
     if (flag_a.time == flag_time.flag_2){
       //开始监听
       data[0] = { color: 0, top: -50,send:0 };
       flag_a.flag = 1;
       flag_a.time = 1;
       num[0]+=1;
       detail_a[detail_a.length] = { text: '第' + num[0]+'个数据帧准备发送',title:1};
       detail_a[detail_a.length] = { text: '空闲监听中...', title: 0 };
     }
     else{
       if ((data[1].top - data[0].top - 4) <= 50 && trable_i[0] == 0 && data[1].send==1){
       //发生冲突
        
       trable_i=[1,1];
       trable[0].top = data[0].top+4;
       
         data[0].top = data[0].top + 4;
         
         data[0].color=1;
         data[1].color=1;
         flag_a.time = flag_a.time + 1;
     }
       else if (((data[1].top - data[0].top - 4) > 50 && trable_i[0] == 0) || (data[0].top + 4 >= 750 && data[0].top+4<=800&&data[1].send==0)){
         //console.log(data[0].top)
         data[0].top = data[0].top + 4;
       
         flag_a.time = flag_a.time + 1;
       }
       else if (data[0].top+4>800) {
        // console.log(data[0].top)
         flag_a.time = flag_a.time + 1;
       }
       else if (data[0].top-4>=-50 && trable_i[0] == 1) {
         data[0].top = data[0].top - 4;
         flag_a.time = flag_a.time + 1;
       }
       else if (data[0].top - 4 < -50 && trable_i[0] == 1) {
       //接收到了冲突信号
         detail_a[detail_a.length] = { text: '发送强化冲突中...', title: 0 };
         flag_a.flag=3;
         flag_a.time=1;
         trable_i[0] = 0;
         data[0] = { color: 0, top: -50, send: 1 };
         over_3[0]=0;
       }
     }
   }
   //强化冲突中
   else if (flag_a.flag == 3 || flag_a.flag == 4) {
if (flag_a.time == flag_time.flag_3 && over_3[0]==0) {
      flag_a.flag=4;
       flag_a.time = 1;
       over_3[0] =1;
       over_4[0]=0;
       detail_a[detail_a.length] = { text: '监听强化冲突中...', title: 0 };
     }
     else {
       if ((data[1].top - data[0].top - 4) <= 50 && trable_i[0] == 0 && data[1].send == 1) {
         //发生冲突
         
         trable_i = [1,1];
         trable[0].top = data[0].top + 4;

         data[0].top = data[0].top + 4;

         data[0].color = 1;
         data[1].color = 1;
         flag_a.time = flag_a.time + 1;
       }
       else if (((data[1].top - data[0].top - 4) > 50 && trable_i[0] == 0) || (data[0].top + 4 >= 750 && data[0].top + 4 <= 800 && data[1].send == 0)) {
         
         data[0].top = data[0].top + 4;

         flag_a.time = flag_a.time + 1;
       }
       else if (data[0].top + 4 > 800) {
         // console.log(data[0].top)
         flag_a.time = flag_a.time + 1;
       }
       else if (data[0].top - 4 >= -50 && trable_i[0] == 1) {
         data[0].top = data[0].top - 4;
         flag_a.time = flag_a.time + 1;
       }
       else if (data[0].top - 4 < -50 && trable_i[0] == 1 && over_4[0]==0) {
         //接收到了冲突信号
         trable_i[0] = 0;
         over_4[0] = 1;
         flag_a.flag = 6;
         flag_a.time = 1;
         data[0] = { color: 0, top: -50, send: 0 };
         detail_a[detail_a.length] = { text: '接收到了强化冲突信号', title: 0 };
         if(again[0]<10){
           again[0] = again[0]+1;
           again_time[0] = Math.floor(Math.random() * (Math.pow(2,again[0])-1) + 0)*512;
           detail_a[detail_a.length] = { text: again_time[0]+'比特时间后重传...', title: 0 };
           //console.log(Math.floor(Math.random() * (Math.pow(2, 2) - 1) + 0))
         }
         else{
           detail_a[detail_a.length] = { text: '第' + num[0] + '个数据帧已经丢弃', title: 0 };
           again[0] =0;
           again_time[0] =0;
           num[0] = num[0]+1;
           //开始监听
           data[0] = { color: 0, top: -50, send: 0 };
           flag_a.flag = 1;
           flag_a.time = 1;
           
           detail_a[detail_a.length] = { text: '第' + num[0] + '个数据帧准备发送', title: 1 };
           detail_a[detail_a.length] = { text: '空闲监听中...', title: 0 };
         }
       }
     }
   }
   //监听重传
   else if(flag_a.flag==6){
     if(again_time[0]>0){
       again_time[0]-=1;
       flag_a.time+=1;
     }
else{
       again_time[0] = 0;
       
       //开始监听
       data[0] = { color: 0, top: -50, send: 0 };
       flag_a.flag = 1;
       flag_a.time = 1;

       detail_a[detail_a.length] = { text: '第' + num[0] + '个数据帧准备发送', title: 1 };
       detail_a[detail_a.length] = { text: '空闲监听中...', title: 0 };
}
   }
   //监听信道繁忙
   if(flag_a.flag==5){
     if (data[1].send == 1 && data[1].top <= 0){
       flag_a.time += 1;
     }
     else{
       //开始监听
       data[0] = { color: 0, top: -50, send: 0 };
       flag_a.flag = 1;
       flag_a.time = 1;

       detail_a[detail_a.length] = { text: '第' + num[0] + '个数据帧准备发送', title: 1 };
       detail_a[detail_a.length] = { text: '空闲监听中...', title: 0 };
     }
   }




  //主机B
    if (num[1] == 11) {
      detail_b[detail_b.length] = { text: '主机B数据已经传输完毕！', title: 1 };
      num[1] += 1;
      flag_b.flag = 0;
    }
    else if (num[1] > 11) {

    }
    //监听空闲
    else if (flag_b.flag == 1) {
      if (flag_b.time == flag_time.flag_1) {
        //开始传输
        flag_b.flag = 2;
        flag_b.time = 1;
        data[1].send = 1;
        detail_b[detail_b.length] = { text: '开始发送数据帧中...', title: 0 };
      }
      else if (data[0].send == 1 && data[0].top >= 750) {
        flag_b.flag = 5;
        flag_b.time = 1;
        detail_b[detail_b.length] = { text: '监听信道繁忙中...', title: 0 };
      }
      else {
        flag_b.time = flag_b.time + 1;
      }
    }
    //发送数据
    else if (flag_b.flag == 2) {
     // console.log(data[1].top)
      if (flag_b.time == flag_time.flag_2) {
        //开始监听
        data[1] = { color: 0, top: 800, send: 0 };
        flag_b.flag = 1;
        flag_b.time = 1;
        num[1] += 1;
        detail_b[detail_b.length] = { text: '第' + num[1] + '个数据帧准备发送', title: 1 };
        detail_b[detail_b.length] = { text: '空闲监听中...', title: 0 };
      }
      else {
        if ((data[1].top - data[0].top - 4) <= 50 && trable_i[1] == 0 && data[0].send == 1) {
          //发生冲突

          trable_i = [1,1];
          trable[1].top = data[1].top - 4;

          data[1].top = data[1].top - 4;

          data[0].color = 1;
          data[1].color = 1;
          flag_b.time = flag_b.time + 1;
        }
        else if (((data[1].top - data[0].top - 4) > 50 && trable_i[1] == 0) || (data[1].top - 4 <= 0 && data[1].top - 4 >= -50 && data[0].send == 0)) {
          //console.log(data[1].top)
          data[1].top = data[1].top - 4;

          flag_b.time = flag_b.time + 1;
        }
        else if (data[1].top - 4 < -50) {
          // console.log(data[0].top)
          flag_b.time = flag_b.time + 1;
        }
        else if (data[1].top + 4 <=800 && trable_i[1] == 1) {
          //console.log(data[1].top)
          data[1].top = data[1].top + 4;
          flag_b.time = flag_b.time + 1;
        }
        else if (data[1].top + 4 >800 ) {
          //接收到了冲突信号
          detail_b[detail_b.length] = { text: '发送强化冲突中...', title: 0 };
          flag_b.flag=3;
          flag_b.time=1;
          trable_i[1] = 0;
          data[1] = { color: 0, top: 800, send: 1 };
          over_3[1]=0;
        }
      }
    }

    //强化冲突中
    else if (flag_b.flag == 3 || flag_b.flag == 4){


      if (flag_b.time == flag_time.flag_3 && over_3[1] == 0) {
        flag_b.flag = 4;
        flag_b.time = 1;
        over_3[1] =1;
        over_4[1] = 0;
        detail_b[detail_b.length] = { text: '监听强化冲突中...', title: 0 };
      }
      else {
        if ((data[1].top - data[0].top - 4) <= 50 && trable_i[1] == 0 && data[0].send == 1) {
          //发生冲突

          trable_i = [1,1];
          trable[1].top = data[1].top - 4;

          data[1].top = data[1].top - 4;

          data[0].color = 1;
          data[1].color = 1;
          flag_b.time = flag_b.time + 1;
        }
        else if (((data[1].top - data[0].top - 4) > 50 && trable_i[1] == 0) || (data[1].top - 4 <= 0 && data[1].top - 4 >= -50 && data[0].send == 0)) {
          //console.log(data[0].top)
          data[1].top = data[1].top - 4;

          flag_b.time = flag_b.time + 1;
        }
        else if (data[1].top - 4 < -50) {
           console.log(data[0].top)
          flag_b.time = flag_b.time + 1;
        }
        else if (data[1].top + 4 <= 800 && trable_i[1] == 1) {
          data[1].top = data[1].top + 4;
          flag_b.time = flag_b.time + 1;
        }
        else if (data[1].top + 4 > 800 && trable_i[1] == 1 && over_4[1]==0) {

         
          //接收到了冲突信号
          trable_i[1] =0;
          over_4[1] = 1;
          flag_b.flag = 6;
          flag_b.time = 1;
          data[1] = { color: 0, top: 800, send: 0 };
          detail_b[detail_b.length] = { text: '接收到了强化冲突信号', title: 0 };

          if (again[1] < 10) {
            again[1] = again[1] + 1;
            again_time[1] = Math.floor(Math.random() * (Math.pow(2, again[1]) ) + 0)*512;
            detail_b[detail_b.length] = { text: again_time[1]+'比特时间后重传...', title: 0 };

            //console.log(Math.floor(Math.random() * (Math.pow(2, 2) - 1) + 0))
          }
          else {
            detail_b[detail_b.length] = { text: '第' + num[1] + '个数据帧已经丢弃', title: 0 };
            again[1] = 0;
            again_time[1] = 0;
            num[1] = num[1] + 1;
            //开始监听
            data[1] = { color: 0, top: 800, send: 0 };
            flag_b.flag = 1;
            flag_b.time = 1;

            detail_b[detail_b.length] = { text: '第' + num[1] + '个数据帧准备发送', title: 1 };
            detail_b[detail_b.length] = { text: '空闲监听中...', title: 0 };
          }
        }
      }
    }
    //重传监听
    else if (flag_b.flag == 6) {
      if (again_time[1] > 0) {
        again_time[1] -= 1;
        flag_b.time += 1;
      }
      else {
        again_time[1] = 0;

        //开始监听
        data[1] = { color: 0, top: 800, send: 0 };
        flag_b.flag = 1;
        flag_b.time = 1;

        detail_b[detail_b.length] = { text: '第' + num[1] + '个数据帧准备发送', title: 1 };
        detail_b[detail_b.length] = { text: '空闲监听中...', title: 0 };
      }
    }
    //监听信道繁忙
    if (flag_b.flag == 5) {
      if (data[0].send == 1 && data[0].top >= 750) {
        flag_b.time += 1;
      }
      else {
        //开始监听
        data[1] = { color: 0, top: 800, send: 0 };
        flag_b.flag = 1;
        flag_b.time = 1;

        detail_b[detail_b.length] = { text: '第' + num[1] + '个数据帧准备发送', title: 1 };
        detail_b[detail_b.length] = { text: '空闲监听中...', title: 0 };
      }
    }

    that.setData({
      flag_time: flag_time,
      num: num,
      flag_a: flag_a,
      flag_b: flag_b,
      trable: trable,
      trable_i: trable_i,
      bit: bit,
      again: again,
      data: data,
      again_time: again_time,
      detail_a: detail_a,
      detail_b: detail_b,
    })
  }
})