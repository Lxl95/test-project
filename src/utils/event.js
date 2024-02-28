// 滚轮事件的监听于移除并返回当前滚轮滚动方向,取消监听执行scrollFunc第二个参数
export function scrollEven(scrollFunc) {
  let isRemove = false
  // 火狐浏览器
  if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scroll, false)
  } // W3C
  document.addEventListener('mousewheel', scroll, false) // IE/Opera/Chrome/Safari

  function scroll(e) {
    // direct 是 1 向上，是 -1 向下
    var direct = 0
    e = e || window.event
    if (e.wheelDelta) {
      //IE/Opera/Chrome
      direct = e.wheelDelta > 0 ? 1 : -1
    } else if (e.detail) {
      //Firefox
      direct = e.detail < 0 ? 1 : -1
    }
    if (isRemove) {
      document.removeEventListener('DOMMouseScroll', scroll, false)
      document.removeEventListener('mousewheel', scroll, false) // IE/Opera/Chrome/Safari
    }
    scrollFunc(direct, removeScroll, e)
  }

  function removeScroll() {
    isRemove = true
  }
}
