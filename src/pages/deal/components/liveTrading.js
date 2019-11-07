import React, { Component, Fragment } from 'react'
import style from './liveTrading.less';
import PropTypes from 'prop-types'
// import { Ellipsis } from "ant-design-pro";
import { Empty } from "antd";
import styled from 'styled-components'
import EmptyIma from 'assets/Empty.svg';
import moment from 'moment';
import { Timer } from 'utils/Timer'
import _ from 'lodash'
const isEqual = require("react-fast-compare");
// import Swiper from 'swiper/dist/js/swiper.js'
// import 'swiper/dist/css/swiper.min.css';

const EmptyWarp = styled.div`
  padding: 24px 0;
`;

class LiveTrading extends Component {
  bannerSwiper = null;
  state = {
    livingData: [],
  }

  static getDerivedStateFromProps(props, state) {
    if (props.storesliving.length !== 0 && !isEqual(props.storesliving, state.livingData)) {
      return {
        livingData: props.storesliving
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState){
    if(!isEqual(this.props.storesliving, prevState.livingData)){
      console.log("prevState.livingData", prevState.livingData)
      console.warn("this.state", this.state.livingData)
      this.initialBannerSwiper(prevState.livingData, this.state.livingData)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return !isEqual(this.state.livingData, nextState.livingData)
  }

  initialBannerSwiper = (pre, current) => {
    let slides = [];
    if(this.bannerSwiper){
      // console.warn("this.bannerSwiper.autoplay.running", this.bannerSwiper.autoplay.running)
      current.forEach((_, index)=>{
        slides.push(`<div class="swiper-slide stop-swiping">
                <div class="live_list">
                  <div class="store_img"><img src=${_.StoreCoverImg} alt=""/></div>
                  <div class="store_text_label_name">${_.StoreName}</div>
                  <div class="store_text_label_sale">${_.TotalSaleAmt}元</div>
                  <div class="store_text_label">${moment(new Date(_.BillTime)).format('HH:mm:ss')}</div>
                </div>
              </div>`)
      });
      this.bannerSwiper.virtual.appendSlide(slides);//设置新的虚拟Slide数组
      if(!this.bannerSwiper.autoplay.running){
        this.bannerSwiper.autoplay.start();
      }
      this.props._updateDate(_.last(current))
      return
    }

    this.bannerSwiper = new Swiper('.swiper-container', {
      height: 210,
      width: 400,
      noSwiping : true,
      noSwipingClass : 'stop-swiping',
      virtual: {
        cache: false,
        slides: []
      }, //虚拟Slide会在Dom结构中保持尽量少的Slide，只渲染当前可见的slide和前后的slide
      direction:'vertical',
      slidesPerView: 5, //设置slider容器能够同时显示的slides数量(carousel模式) 默认值为1。
      slidesPerGroup: 5,
      speed: 400,
      //observer: true,  //当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
      //observeParents: true, //将observe应用于Swiper的父元素。当Swiper的父元素变化时，例如window.resize，Swiper更新。
      //shortSwipes: false,  // 这个属性后面会说
      //slideToClickedSlide: false, //设置为true则点击slide会过渡到这个slide。
      autoplay: {
        delay: 400,
        stopOnLastSlide: true,
        disableOnInteraction: false,
      },
    });

    current.forEach((_, index)=>{
      slides.push(`<div class="swiper-slide stop-swiping">
                <div class="live_list">
                  <div class="store_img"><img src=${_.StoreCoverImg} alt=""/></div>
                  <div class="store_text_label_name">${_.StoreName}</div>
                  <div class="store_text_label_sale">${_.TotalSaleAmt}元</div>
                  <div class="store_text_label">${moment(new Date(_.BillTime)).format('HH:mm:ss')}</div>
                </div>
              </div>`)
    });
    this.bannerSwiper.virtual.appendSlide(slides);//设置新的虚拟Slide数组
    this.props._updateDate(_.last(current))
  }


  componentWillUnmount() {
    if(this.bannerSwiper){
      // this.bannerSwiper.detachEvents()
      this.bannerSwiper.destroy()
    }
  }

  render() {
    const { livingData } = this.state;
    // console.log("livingData", livingData)
    // let imgHtml = livingData.map((_, index)=>{
    //   return(
    //     <div className="swiper-slide"  key={_.ID}>
    //       <div className={style.live_list}>
    //         <div className={style.store_img}><img src={_.StoreCoverImg && _.StoreCoverImg} alt=""/></div>
    //         <div className={style.store_text_label_name}>
    //           <Ellipsis
    //             tooltip={{
    //               placement:"left",
    //               overlayClassName: style.tooltip,
    //               trigger: 'click',
    //             }}
    //             lines={1}
    //           >{_.StoreName}</Ellipsis>
    //         </div>
    //         <div className={style.store_text_label_sale}>{`${_.TotalSaleAmt}元`}</div>
    //         <div className={style.store_text_label}>{moment(new Date(_.BillTime)).format('HH:mm:ss')}</div>
    //       </div>
    //     </div>
    //   )
    // })

    return (
      <div className={style.liveTrading}>
        {
          livingData.length === 0 ? <EmptyWarp>
            <Empty
              image={EmptyIma}
              imageStyle={{height: 120,}}
              description={<span style={{color: '#2880B4', fontSize: 16}}
              >暂无相关数据</span>} />
          </EmptyWarp> :
          <div className="swiper-container">
            <div className="swiper-wrapper">
            {/*{imgHtml}*/}
            </div>
          </div>
        }
      </div>
    )
  }
}

LiveTrading.propTypes = {
  updateIndex: PropTypes.number,
  floorSalesVal: PropTypes.array,
  typeSalesVal: PropTypes.array,
  storesliving: PropTypes.array,
  dispatch: PropTypes.func,
}

export default LiveTrading
