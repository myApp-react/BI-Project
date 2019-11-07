/**
 * title: 交易屏-中铁建BI决策分析系统
 */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
import Sider from "./components/sider";
import FloorTrading from "./components/floorTrading";
import LiveTrading from "./components/liveTrading";
import RankTrading from "./components/rankTrading";
import TimesTrading from "./components/timesTrading";
import TrendTrading from "./components/trendTrading";
import TypeTrading from "./components/typeTrading";
import FlightMap from "./components/flightMap";
import FloorMap from "./components/floorMap";
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Timer } from '@/utils/Timer';
import {clearOneSession, getDateTime, getSession, setSession} from '@/utils';
// import numeral from 'numeral';
// import produce from "immer";

@immutableRenderDecorator
@connect(({ app, deal, loading }) => ({ app, deal, loading }))
class Deal extends Component {
  newTimer = null;
  Time = null;
  state = {
    newDate: [],
  };

  componentDidMount() {
    const { app } = this.props;
    const { Biconfig } = app;
    const { TransDataUpdateFrequency } = Biconfig;
    const getTime = TransDataUpdateFrequency * 60000;
    // const getTime = 0.5 * 60000;
    this._fetchData();
    this.newTimer = new Timer();
    this.Time = this.newTimer.interval(getTime, () => {
      this._fetchData();
    })
  }

  _updateDate = (newDate) => {
    console.log("最后的订单",newDate)
    this.setState((pre) => ({newDate}))
  }

  _fetchData = () => {

    const { dispatch, app, deal } = this.props;
    const { Biconfig } = app;
    const { storesliving } = deal;
    const { TransDataUpdateFrequency } = Biconfig;
    let rankData = { NowDate: moment().format("YYYY-MM-DD HH:mm:ss"), TakeCount: 10 };
    let initDataForm = { NowDate: moment().subtract(TransDataUpdateFrequency, "minute").format("YYYY-MM-DD HH:mm:ss")}; //获取初始数据

    let livingDataForm = storesliving.length === 0 ?
      { StartTime: moment().subtract(TransDataUpdateFrequency, "minute").format("YYYY-MM-DD HH:mm:ss"), EndTime: moment().format("YYYY-MM-DD HH:mm:ss")} :
      { StartTime: moment(new Date(storesliving[storesliving.length - 1].BillTime)).add(1, "seconds").format("YYYY-MM-DD HH:mm:ss"), EndTime: moment().format("YYYY-MM-DD HH:mm:ss") }; //获取初始数据

    console.log("getinitDateTime", getDateTime(this.state.newDate, TransDataUpdateFrequency))

    let livingDataForm1 = { StartTime: '2019-06-10 17:24:00', EndTime: moment().format("YYYY-MM-DD HH:mm:ss") }; //获取初始数据
    let AnalysisForm = { NowDate: moment().format("YYYY-MM-DD HH:mm:ss") };

    /**侧边栏数据请求*/
    dispatch({type: 'deal/getDealTimeInterval'});//销售时段
    dispatch({type: 'deal/getSalesTrend'});//销售趋势
    dispatch({type: 'deal/GetFloorSaleAnalysisData', payload: rankData });//楼层销售分析统计数据
    dispatch({type: 'deal/GetTypeSaleAnalysis', payload: AnalysisForm });//业态统计数据
    dispatch({type: 'deal/GetStoresRankInfo', payload: rankData });//楼层销售排行

    /**
     * 店铺初始数据获取（楼层和类别）
     * */

    const getTimefrom = getDateTime(this.state.newDate, TransDataUpdateFrequency)
    console.warn("请求时间：", getTimefrom);

    dispatch({type: 'deal/_getPointBasicSale',payload: {NowDate: moment(new Date(getTimefrom.EndTime)).add(1, "seconds").format("YYYY-MM-DD HH:mm:ss")}}).then((e) => {
      if(e.isOver){
        //订单实时数据
        dispatch({type: 'deal/GetStoreslivingInfo', payload: getTimefrom});
      }
    })
  }

  // shouldComponentUpdate(nextProps, preState) {
  //   if(this.state.storesliving !== preState.storesliving || this.state.startIndex !== preState.startIndex){
  //     return true
  //   }
  //   return false
  // }
  //

  onChange = (e) => {
    const { dispatch, app } = this.props;
    const currentKey = e.target.getAttribute("data-key");
    dispatch({
      type: 'app/siderChange',
      payload: {
        key: currentKey === app.dealsiderKey ? "999" : currentKey,
      },
    })
  };

  componentWillUnmount() {
    this.newTimer && this.newTimer.removeSchedule(this.Time)
  }


  render() {
    const { deal, app, dispatch } = this.props;
    const { dealsiderKey, dealBtnInit, Biconfig } = app;
    const { TransDataUpdateFrequency, DefaultStoreLogoUrl } = Biconfig;
    const {
      typeSaleAnalysis,
      storesRank,
      FloorSaleAnalysis,
      TimeInterval,
      SalesTrend,
      storesliving,
      floorPoint,
      typePoint,
      updateIndex,
      typeSalesVal,
      floorSalesVal,
      currentOrder,
      floorEffect,
      typeEffect,
    } = deal;

    const showList = TransDataUpdateFrequency * 60000 / 3000;
    // console.warn("showList----", showList)
    // console.log("showList", storesliving.length)
    //storesliving.length >= showList ? 5 : 1
    const livingProps = {
      storesliving,
      dispatch,
      typeSalesVal,
      floorSalesVal,
      _updateDate: this._updateDate
    };

    const setTypeEffect = (data) => {
      dispatch({ type: "deal/_setTypeEffect", payload: { typeEffect: data }})
    }

    const setfloorEffect = (data) => {
      dispatch({ type: "deal/_setFloorEffect", payload: { floorEffect: data }})
    }

    const flightMapProps = {
      typePoint,
      typeSalesVal,
      storesliving,
      hide: dealBtnInit !== '1',
      dispatch,
      typeEffect,
      setTypeEffect: setTypeEffect
    };

    const floorMapProps = {
      floorPoint,
      floorSalesVal,
      floorEffect,
      storesliving,
      hide: dealBtnInit !== '2',
      dispatch,
      setfloorEffect: setfloorEffect
    };
    const RankProps = { ...storesRank, DefaultStoreLogoUrl };
    // console.log("typeSaleAnalysis", typeSaleAnalysis)
    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles['menu-sider-right']}>
            <Sider onChange={this.onChange} activeKey={dealsiderKey}>
              <div data-tab="销售实时数据" key="1" data-init={1}><LiveTrading {...livingProps}/></div>
              <div data-tab="销售排行TOP10" key="2" data-init={0}><RankTrading {...RankProps} /></div>
              <div data-tab="业态销售分析" key="3" data-init={0}><TypeTrading {...typeSaleAnalysis}/></div>
              <div data-tab="楼层销售分析" key="4" data-init={0}><FloorTrading {...FloorSaleAnalysis}/></div>
              <div data-tab="销售时段分析" key="5" data-init={0}><TimesTrading {...TimeInterval}/></div>
              <div data-tab="销售趋势分析" key="6" data-init={0}><TrendTrading {...SalesTrend}/></div>
            </Sider>
          </div>
          {/*{*/}
            {/*dealBtnInit === '1' ?*/}
              {/*<FloorMap*/}
                {/*hide={dealBtnInit !== '2'}*/}
              {/*/> :*/}
              {/*<FlightMap*/}
                {/*hide={dealBtnInit !== '1'}*/}
              {/*/>*/}
          {/*}*/}
          <FloorMap {...floorMapProps} />
          <FlightMap {...flightMapProps} />
        </div>
      </Fragment>
    )
  }
}

Deal.propTypes = {
  deal: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Deal
