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

    this.oW = null     // 距离左侧的距离
    this.oH = null     // 距离顶部的距离

    this.aW = null     // 块的宽度

    // 惯性
    this.preX = 0        // 偏移开始位置
    this.sTime = null    // 偏移开始时间
    this.speed = null    // 惯性速度

    this.htmlWidth = null
  }

  componentDidMount() {
  }
  
  onTouchStart(e) {
    this.htmlWidth = document.documentElement.clientWidth;
    this.htmlHeight = document.documentElement.clientHeight;

    this.$vm.className = 't-content'
    e = e.touches[0]
    this.oW = e.clientX - this.$vm.getBoundingClientRect().left
    this.aW = this.$vm.getBoundingClientRect().width
    this.preX = this.state.oLeft
    this.sTime = Date.now()
    // this.oH = e.clientY - this.$vm.getBoundingClientRect().top
  }

  onTouchMove(e) {

    e = e.touches[0]

    // 计算瞬间速度
    let time = Date.now() - this.sTime
    let dist = e.clientX - this.preX

    this.speed = dist/time

    console.log(this.speed, 'xxx')

    this.sTime = Date.now()
    this.preX = e.clientX


    let oLeft = e.clientX - this.oW
    if (oLeft > 130) {
      oLeft = 130
    } else if (oLeft < (this.htmlWidth - this.aW) - 130 ) {
      oLeft = this.htmlWidth - this.aW - 130
    }

    this.setState({
      oLeft
    })


  }

  onTouchEnd() {
    this.$vm.className = 't-content t-content-animate'
    const sTime = Date.now() - this.sTime

    if(this.state.oLeft > 0) {
      this.setState({
        oLeft: 0
      })
    } else if (this.state.oLeft < (this.htmlWidth - this.aW)) {
      this.setState({
        oLeft: this.htmlWidth - this.aW
      })
    } else {
      const speed = this.speed * 150
      let oLeft = this.state.oLeft + speed
  
      if(oLeft > 0) {
          oLeft = 0
      } else if (oLeft < (this.htmlWidth - this.aW)) {
        oLeft = this.htmlWidth - this.aW
      }

      this.setState({
        oLeft
      })
  
      this.preX = this.state.oLeft
    }

  }

  render() {
    const { oLeft } = this.state
    return (
      <div className='t-main'>
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
              横向滑动这行横向滑动这行横向滑动这行横向滑动这行横向滑动这行横向滑动这行
          </div>
        </div>
      </div>
    )
  }
}

export default TouchMove