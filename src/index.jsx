import React, { Component } from 'react'
import './index.css'

class TouchMove extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oLeft: 0
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
    this.speed = null    // 惯性速度

    this.rootWidth = null    // 容器宽度
    this.rootHeight = null   // 容器高度
  }

  componentDidMount() {
  }
  
  // 开始移动
  onTouchStart(e) {
    this.rootWidth = this.$root.getBoundingClientRect().width;
    this.rootHeight = this.$root.getBoundingClientRect().height;

    this.$vm.className = 't-content'
    e = e.touches[0]

    this.oW = e.clientX - this.$vm.getBoundingClientRect().left

    this.aW = this.$vm.getBoundingClientRect().width
    this.preX = this.state.oLeft
    this.sTime = Date.now()
    // this.oH = e.clientY - this.$vm.getBoundingClientRect().top
  }

  // 移动中
  onTouchMove(e) {
    e = e.touches[0]

    // 计算瞬间速度
    let time = Date.now() - this.sTime
    let dist = e.clientX - this.preX

    this.speed = dist/time

    this.sTime = Date.now()
    this.preX = e.clientX

    // 距离左侧最大距离
    const maxLeft = this.rootWidth - this.aW

    let oLeft = e.clientX - this.oW
    if (oLeft > 0) {
      oLeft = Math.sqrt(oLeft)*7
    } else if (oLeft < maxLeft ) {
      oLeft = maxLeft - Math.sqrt(maxLeft - oLeft)*7
    }

    this.setState({
      oLeft
    })


  }

  // 移动结束
  onTouchEnd() {
    this.$vm.className = 't-content t-content-animate'

    let oLeft
    if(this.state.oLeft > 0) {
      // 左侧外部移动回弹
      oLeft = 0
    } else if (this.state.oLeft < (this.rootWidth - this.aW)) {
      // 右侧外部
        oLeft = this.rootWidth - this.aW
    } else {
      // 滚动
      const speed = this.speed * 150
      oLeft = this.state.oLeft + speed
  
      if(oLeft > 0) {
          oLeft = 0
      } else if (oLeft < (this.rootWidth - this.aW)) {
        oLeft = this.rootWidth - this.aW
      }

    }
    this.preX = this.state.oLeft
    this.setState({
      oLeft
    })

    // 移动完毕初始化speed
    this.speed = 0

  }

  render() {
    const { oLeft } = this.state
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
              transform: `translateX(${oLeft}px)`
            }}>
              {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default TouchMove