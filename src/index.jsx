import React, { Component } from 'react'
import './index.css'

class TouchMove extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oLeft: 0,
      oTop: 0
    }
    this.$vm = null    // 移动dom
    this.$root = null  // 外层包括dom

    this.oW = null     // 点击位置距离移动块左侧的距离
    this.oH = null     // 距离顶部的距离

    this.aW = null     // 块的宽度
    this.aH = null     // 块的高度

    // 惯性
    this.preX = 0        // 偏移开始位置
    this.sTime = null    // 偏移开始时间

    this.speedX = null    // 惯性速度
    this.speedY = null

    this.rootWidth = null    // 容器宽度
    this.rootHeight = null   // 容器高度
    this.rootLeft = 0        // 容器到左侧的距离
    this.rootTop = 0         // 到顶部的距离

  }

  static defaultProps = {
    x: true,
    y: false
  }

  // 开始移动
  onTouchStart(e) {
    this.rootWidth = this.$root.getBoundingClientRect().width
    this.rootHeight = this.$root.getBoundingClientRect().height
    this.rootLeft = this.$root.getBoundingClientRect().left
    this.rootTop = this.$root.getBoundingClientRect().top

    this.$vm.className = 't-content'
    e = e.touches[0]

    this.oW = e.clientX - this.$vm.getBoundingClientRect().left
    this.oH = e.clientY - this.$vm.getBoundingClientRect().top

    this.aW = this.$vm.getBoundingClientRect().width
    this.aH = this.$vm.getBoundingClientRect().height

    this.preX = this.state.oLeft
    this.preY = this.state.oTop
    this.sTime = Date.now()
  }

  // 移动中
  onTouchMove(e) {
    e = e.touches[0]

    // 计算瞬间速度
    const time = Date.now() - this.sTime
    const distX = e.clientX - this.preX
    const distY = e.clientY - this.preY

    this.speedX = distX / time
    this.speedY = distY / time

    this.sTime = Date.now()
    this.preX = e.clientX
    this.preY = e.clientY

    // 距离左侧最大距离
    const maxLeft = this.rootWidth - this.aW
    const maxTop = this.rootHeight - this.aH

    // 左偏移
    let oLeft = e.clientX - this.oW - this.rootLeft

    if (oLeft > 0) {
      oLeft = Math.sqrt(oLeft) * 7
    } else if (oLeft < maxLeft) {
      oLeft = maxLeft - Math.sqrt(maxLeft - oLeft) * 7
    }

    // 上偏移
    let oTop = e.clientY - this.oH - this.rootTop
    if (oTop > 0) {
      oTop = Math.sqrt(oTop)*7
    } else if (oTop < maxTop) {
      oTop = maxTop - Math.sqrt(maxTop - oTop)*7
    }

    this.setState({
      oLeft,
      oTop
    })

  }

  // 移动结束
  onTouchEnd() {
    this.$vm.className = 't-content t-content-animate'


    let { oLeft, oTop } = this.state
    // x轴回弹
    if (oLeft > 0) {
      // 左侧外部移动回弹
      oLeft = 0
    } else if (oLeft < (this.rootWidth - this.aW)) {
      // 右侧外部
      oLeft = this.rootWidth - this.aW
    } else {
      // 滚动
      const speedX = this.speedX * 150
      oLeft = oLeft + speedX
      if (oLeft > 0) {
        oLeft = 0
      } else if (oLeft < (this.rootWidth - this.aW)) {
        oLeft = this.rootWidth - this.aW
      }
    }

    // y轴回弹
    if (oTop > 0) {
      // 左侧外部移动回弹
      oTop = 0
    } else if (oTop < (this.rootHeight - this.aH)) {
      // 右侧外部
      oTop = this.rootHeight - this.aH
    } else {
      // 滚动
      const speedX = this.speedX * 150
      oTop = oTop + speedX
      if (oTop > 0) {
        oTop = 0
      } else if (oTop < (this.rootHeight - this.aH)) {
        oTop = this.rootHeight - this.aH
      }
    }

    this.preX = oLeft
    this.preY = oTop

    this.setState({
      oLeft,
      oTop
    })

    // 移动完毕初始化speed
    this.speedX = 0
    this.speedY = 0

  }

  render() {
    const { oLeft, oTop } = this.state
    const { x, y} = this.props
    return (
      <div className='t-main' ref={$root => this.$root = $root}>
        <div className='t-block'>
          <div
            className='t-content'
            onTouchStart={e => this.onTouchStart(e)}
            onTouchMove={e => this.onTouchMove(e)}
            onTouchEnd={e => this.onTouchEnd(e)}
            ref={$vm => this.$vm = $vm}
            style={{
              transform: `translate(${x ? oLeft : 0}px, ${y ? oTop : 0}px)`
            }}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default TouchMove