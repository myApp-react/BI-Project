import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import config from 'utils/config'
import styles from './index.less'
import { graphic } from "echarts";
//导入组件
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Recharts, Components } from 'react-component-echarts';
import produce from "immer";
import numeral from 'numeral';
import { Modal, Empty, Icon } from 'antd';
import { connect } from 'dva/index';
const isEqual = require("react-fast-compare");
const { XAxis, YAxis, Series, Grid, Tooltip } = Components;
import EmptyIma from '@/assets/Empty.svg'
import { Timer } from 'utils/Timer';
import _ from 'lodash';
const { RadialGradient } = graphic;
let initState = {
  effect: [],
  center: [],
  source: [],
  target: [],
}

@immutableRenderDecorator
@connect(({ deal }) => ({ deal }))
class FlightMap extends Component {
  timer = null;
  timerID = null;
  echartsRefs = React.createRef();
  state = initState;

  componentDidMount() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.storesliving !== prevState.storesliving) {
      return {
        storesliving: nextProps.storesliving,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.storesliving.length !== 0 && !isEqual(prevState.storesliving, this.props.storesliving)) {
      this._setEffect();
    }else {
      if(this.props.storesliving.length !== 0 ){
        if(this.newTimer){
          clearTimeout(this.newTimer);
        }
        this.newTimer = setTimeout(() => {
          this.props.setTypeEffect({
            effect: [],
            center: [],
            source: [],
            target: [],
          });
        }, 3000)
      }
    }
  }

  _setEffect = () => {
    let target = [],
        source = [],
        center = [],
        effect = [],
        getfloorid = [];
    const { storesliving, typeEffect, typeSalesVal, typePoint  } = this.props
    _.forEach(typeSalesVal, (el, j) => {
      _.forEach(storesliving, (e, i) => {
        if (el.OperationID === e.OperationTypeId) getfloorid.push(el)
      })
    });

    _.forEach(typePoint.nodes, (item, index) => {//匹配绑定店铺
      _.forEach(getfloorid, (e, i) => {
        if(item.name === e.OperationName) {
          target.push(item)
        }
      })
      _.forEach(storesliving, (e, i) => {
        if(item.name === e.StoreName) {
          source.push(item)
        }
      })
    });
    const newTarget = _.uniq(target);
    const newSource = _.uniq(source);
    if (newSource.length !== 0 && newTarget.length !== 0){
      center = typePoint.nodes.filter(_ => _.id === '0'); //中心点
      _.forEach(typePoint.edges, (el, j) => {
        _.forEach(newSource, (ele, i) => {
          _.forEach(newTarget, (o, p) => {
            if(el.source === ele.id && el.target === o.id){
              effect.push(
                { "period": 1, "delay": 10, "data": [{"coords":[ele.value, o.value]}]},
                { "period": 1.6, "delay": 900, "data": [{"coords":[o.value, center[0].value]}]}
              );
            }
          });
        });
      });
    }
    const newEffect = _.uniq(effect);
    if(center.length !== 0 && newTarget.length !== 0 && newEffect.length !== 0  && newSource.length !== 0 ){
      let newTypeEffect = produce(typeEffect, nextData => {
        nextData.center = center
        nextData.target = newTarget
        nextData.effect = newEffect
        nextData.source = newSource
      })
      this.props.dispatch({ type: "deal/_setTypeEffect", payload: { typeEffect: newTypeEffect }})
    }

    // let sumprice = numeral(storesliving.reduce(function (total, currentValue, currentIndex, arr) {
    //   return total + currentValue.TotalSaleAmt;
    // }, 0)).format('0,0');

    // let newPoint = produce(typePoint, nextData => {
    //   // nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(sumprice))
    //   // const newNum = nextData.nodes[0].attributes.name
    //   // nextData.nodes[0].name = numeral(newNum).format('0[.]00')
    //   nextData.nodes.forEach(_ => {
    //     if(_.id === '0'){
    //       _.attributes.name = String(Number(_.attributes.name) + Number(sumprice));
    //       const newNum = _.attributes.name;
    //       _.name = numeral(newNum).format('0,0');
    //       return _
    //     }
    //     storesliving.forEach((e) => {
    //       if(e.StoreName === _.name){
    //         _.TotalSaleAmt = numeral(Number(_.TotalSaleAmt) + Number(e.TotalSaleAmt)).format('0[.]00')
    //         return _
    //       }
    //       if(_.OperationID && e.OperationTypeId === _.OperationID){
    //         _.TotalSaleAmt = numeral(Number(_.TotalSaleAmt) + Number(e.TotalSaleAmt)).format('0[.]00')
    //         return _
    //       }
    //     })
    //   })
    // });
    // this.props.dispatch({ type: "deal/_setTypeCenterVal", payload: { Data: newPoint }})
  }


  shouldComponentUpdate(nextProps, nextState){
    return !isEqual(nextProps.typePoint, this.props.typePoint) ||
      !isEqual(nextProps.typeSalesVal, this.props.typeSalesVal) ||
      !isEqual(nextProps.typeEffect, this.props.typeEffect) ||
      !isEqual(nextProps.storesliving, this.props.storesliving) ||
      nextProps.hide !== this.props.hide
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    if(this.timerID){
      clearInterval(this.timerID)
    }
  }

  _getStoreInfo = (params) => {

    if(params.data.id !== '0'){
      // console.log('%c 业态：点击查询数据','background:#aaa;color:red', params);
      const ModalBasic = {
        width: 300,
        maskClosable: true,
        mask:false,
        className: 'storeInfoWarp',
        icon: <Icon type="info-circle" style={{color: '#fff'}} />,
        style: {
          top: (params.event.offsetY + 205) > window.innerHeight ? 700 : params.event.offsetY,
          left: (params.event.offsetX + 300) > window.innerWidth ? (params.event.offsetX - 150) : params.event.offsetX,
          margin: 0,
          padding: 0,
        },
      }

      if(params.name === "零售" || params.name === "服务配套" || params.name === "主力店" ||  params.name === "餐饮"){
        Modal.info({
          title: `业态: ${params.name}`,
          ...ModalBasic,
          content: (
            <div>
              <p className={styles['sales-name']}>{`销售额：${params.data.TotalSaleAmt || 0}元`}</p>
            </div>
          ),
        });
      }else {
        if(params.data.storeId){
          Modal.info({
            title: `店铺名称: ${params.name}`,
            ...ModalBasic,
            content: (
              <div>
                <p className={styles['sales-name']}>{`销售额：${params.data.TotalSaleAmt || 0}元`}</p>
              </div>
            ),
          });
        }
      }
    }
  }


  render() {

    const { hide, typeEffect, typePoint } = this.props;
    const { effect, center, source, target } = typeEffect;
    const { edges, nodes } = typePoint;//display: ${ hide ? "block" : "none" };
    const HlodCont = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      display: ${ hide ? "flex" : "none" };
    `;

    /**
     * Recharts 参数：
     * notMerge:
     * */
    if (nodes.length === 1){
      return <HlodCont>
        <Empty image={EmptyIma} description={<span style={{color: '#2880B4', fontSize: 16}}>暂无相关业态点位数据，请在管理后台设置</span>} />
      </HlodCont>
    }
    return (
      <div className={`${hide ? styles.chartwarp : styles.chartwarp + ' ' +styles.hide}`} ref={this.echartsRefs} >
        <Recharts
          devicePixelRatio={window.devicePixelRatio}
          width={window.innerWidth}
          height={window.innerHeight}
          backgroundColor={new RadialGradient(0.5, 0.5, 0.9, [{
            offset: 0,
            color: '#0c0278'
          }, {
            offset: 1,
            color: '#09021f'
          }])}
          onEvents = {[['click',params  =>  this._getStoreInfo(params)]]}
        >
          <Tooltip trigger="item" triggerOn="none" extraCssText={config.dealToolTips}/>
          <YAxis type="value" show={false}/>
          <XAxis type="value" show={false}/>
          <Grid left={0} right={210} bottom={0} top={120} containLabel={false}/>
          <Series
            type='graph'
            layout='none'
            coordinateSystem='cartesian2d'
            hoverAnimation={false}
            focusNodeAdjacency={false}
            z={3}
            label={{ show: true, fontSize: 14, color: '#090237', position: 'inside',}}
            itemStyle={{
              shadowColor: '#004866',
              shadowBlur: 20
            }}
            lineStyle={{width: 0.5, color: '#0d76a7', curveness: 0.3, opacity: 1}}
            links={edges}
            data={nodes}
            animation={false}
          />
          {
              effect.map((_, i) =>
                <Series
                  name="effect"
                  key={i}
                  type='lines'
                  coordinateSystem='cartesian2d'
                  zlevel={2}
                  effect={{
                    show: true,
                    period: _.period,
                    trailLength: 0.3,
                    color: '#fff',
                    symbolSize: 5,
                    delay: _.delay,
                    loop: false
                  }}
                  symbol='none'
                  animation={false}
                  lineStyle={{normal: {width: 0, curveness: 0.3}}}
                  data={_.data}
                />
              )
          }
          <Series
            name="center"
            type={'effectScatter'}
            coordinateSystem={ 'cartesian2d'}
            zlevel={3}
            rippleEffect={{period: 2, scale: 1.6, brushType: 'fill'}}
            label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
            symbolSize={(val) => {
              return val[2] / 10;
            }}
            itemStyle={{normal: {color: "#6fdfff"}}}
            data={center}
            animation={false}
          />
          <Series
            name="source"
            type={'effectScatter'}
            coordinateSystem={ 'cartesian2d'}
            zlevel={3}
            rippleEffect={{period: 2, scale: 2, brushType: 'fill'}}
            label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
            symbolSize={20}
            itemStyle={{normal: {color: "#6fdfff"}}}
            data={source}
            animation={false}
          />
          <Series
            name="target"
            type={'effectScatter'}
            coordinateSystem={ 'cartesian2d'}
            zlevel={3}
            rippleEffect={{period: 2, scale: 1.6, brushType: 'fill'}}
            label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
            symbolSize={20}
            itemStyle={{normal: {color: "#6fdfff"}}}
            data={target}
            animation={false}
          />
        </Recharts>
      </div>

    )
  }
}

FlightMap.propTypes = {
  hide: PropTypes.bool,
  dispatch: PropTypes.func,
  typeSalesVal: PropTypes.array,
  storesliving: PropTypes.array,
  typePoint: PropTypes.object,
}

export default FlightMap
