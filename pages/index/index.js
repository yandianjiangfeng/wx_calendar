//index.js
//获取应用实例
const app = getApp();
// 左右滑动日历所需变量
let time = 0; //时间记录，用于滑动时且时间小于1s则执行左右滑动
let touchDot = 0;//触摸时的原点
let interval = "";// 记录/清理 时间记录
let tmpFlag = true;// 不再执行滑动事件开关
let weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
Page({
  data: {
    hasEmptyGrid: false
  },
  onLoad: function () {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    //获取空数据
    this.calculateEmptyGrids(cur_year, cur_month);
    //获取当月数据
    this.calculateDays(cur_year, cur_month, cur_day);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch,
      cur_day,
    });
  },
  // 计算当月天数
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 计算第一天星期几
  getDayOfWeek(year, month) {   
     return new Date(year, month - 1, 1).getDay(); 
  },
  // 计算空数据
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 计算当月数据
  calculateDays(year, month, today) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false,
      });
    }    
    days[today - 1].choosed = true;
    this.setData({
      days:days
    })        
  },
  // 点击今日事件
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const cur_day = e.currentTarget.dataset.idx + 1;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;

    let days = this.data.days;
    days.map(function (item, index, arr) {
      if (index != idx) {
        days[index].choosed = false;
      }
    }, this);
    days[idx].choosed = !days[idx].choosed;
    this.setData({
      days,
      cur_day,
    });
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -60 && time < 10 && tmpFlag) {
      tmpFlag = false;
      //执行切换页面的方法
      console.log("向左滑动");
      this.nextMonth(1);
    }
    // 向右滑动   
    if (touchMove - touchDot >= 60 && time < 10 && tmpFlag) {
      tmpFlag = false;
      //执行切换页面的方法
      console.log("向右滑动");
      this.nextMonth(-1);
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true;
  },
  // 新的月份
  nextMonth: function (num) {
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    const cur_day = this.data.cur_day;
    let newMonth, newYear;
    if (num > 0) {
      // 下一月
      newMonth = cur_month + 1;
      newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
    } else {
      //  上一月
      newMonth = cur_month - 1;
      newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
    }

    this.calculateDays(newYear, newMonth, cur_day);
    this.calculateEmptyGrids(newYear, newMonth);
    this.setData({
      cur_year: newYear,
      cur_month: newMonth
    });
  },
  //上一月
  prev:function(){
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    const cur_day = this.data.cur_day;
    let  newMonth = cur_month - 1;
    let newYear = cur_year;
    if (newMonth < 1) {
      newYear = cur_year - 1;
      newMonth = 12;
    }
    this.calculateDays(newYear, newMonth, cur_day);
    this.calculateEmptyGrids(newYear, newMonth);
    this.setData({
      cur_year: newYear,
      cur_month: newMonth
    });
  },
  //下一月
  next:function(){
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    const cur_day = this.data.cur_day;
    let newMonth = cur_month + 1;
    let newYear = cur_year;
    if (newMonth > 12) {
      newYear = cur_year + 1;
      newMonth = 1;
    }
    this.calculateDays(newYear, newMonth, cur_day);
    this.calculateEmptyGrids(newYear, newMonth);
    this.setData({
      cur_year: newYear,
      cur_month: newMonth
    });

  },
})
