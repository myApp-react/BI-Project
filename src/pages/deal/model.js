import {
  GetdealSalesTrend,
  GetdealTimeInterval,
  GetFloorStoreSale,
  GettypeStoreSale,
  GetFloorSaleAnalysisData,
  GetStoresPositionInfo,
  GetTypeSaleAnalysis,
  GetStoresRankInfo,
  GetStoreslivingInfo,
} from 'api'
import _ from 'lodash'
import moment  from 'moment'
import floorPoint  from './components/floorPoint'
import typePoint  from './components/typePoint'
import { _filterNodes, _filterEdges } from '@/utils'
import numeral from 'numeral';
import Retail from 'assets/retail-icon.svg'
import Food from 'assets/food-icon.svg'
import mainStore from 'assets/mainstore-icon.svg'
import Matching from 'assets/Matching-icon.svg'
import produce from "immer"
// const myWorker = require("worker-loader!@/utils/getNodes.worker.js");
// let worker = new myWorker();

const matchSymbol = (id) => {
  let SymbolUrl = null
  switch (id){
    case '1'://零售
      SymbolUrl = 'image://'+ Retail;
      break;
    case '2'://餐饮
      SymbolUrl = 'image://'+ Food;
      break;
    case '4':// 服务配套
      SymbolUrl = 'image://'+ Matching;
      break;
    case '5': //主力店
      SymbolUrl = 'image://'+ mainStore;
      break;
  }
  return SymbolUrl
}
typePoint.nodes.forEach(function(node, index) {
  node.symbol = matchSymbol(node.id)
  if(node.id !== '0'){
    node.label.color = "#fff"
  }
});

export default {
  namespace: 'deal',
  state: {
    storesliving: [],
    PointForType: {
      data: []
    },
    SalesTrend: {
      GuestCount: [],
      CustSaleAmt: [],
      NoCustSaleAmt: [],
      BizDate: []
    },
    TimeInterval: {
      CustSaleAmt: [],
      DateTime: [],
      NoCustSaleAmt: [],
      PersonCount: [],
    },
    FloorSaleAnalysis: {
      LegendData: [],
      totalSeries: [],
      salesSeries: [],
      tooltipsSeries: [],
      isEmpty: true
    },
    floorPoint: {
      nodes: [],
      edges: []
    },
    floorSalesVal: [],
    typePoint: {
      nodes: [],
      edges: []
    },
    typeSalesVal: [],
    typeSaleAnalysis: {
      LegendData: [],
      totalSeries: [],
      salesSeries: [],
      tooltipsSeries: [],
      isEmpty: true
    },
    storesRank: {
      numOne: {
        BillAmount: 0,
        StoreConverImg: "",
        StoreID: "",
        StoreName: "",
      },
      numTwo: {
        BillAmount: 0,
        StoreConverImg: "",
        StoreID: "",
        StoreName: "",
      },
      numThree: {
        BillAmount: 0,
        StoreConverImg: "",
        StoreID: "",
        StoreName: "",
      },
      otherList: []
    },
    floorEffect: {
      effect: [],
      center: [],
      source: [],
      target: [],
    },
    typeEffect: {
      effect: [],
      center: [],
      source: [],
      target: [],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      //async
      history.listen(location => {
        dispatch({type: '_getPointForFloor', payload: {queryType: 1}})
        dispatch({type: '_getPointForType', payload: {queryType: 2}})
      })
    },
  },

  effects: {
    *_getPointForFloor({ payload }, { call, put }) {
      const response = yield call(GetStoresPositionInfo, payload);
      const { success, Data } = response;
      let nodes = [],
          edges = [];
      if(success && Data && Data !== null){
        // worker.postMessage({
        //   floorPoint,
        //   basicData: Data
        // });
        // worker.addEventListener('message', event => {
        //   nodes = event.data.nodes;
        //   edges = event.data.edges;
        // });
        _.forEach(floorPoint.nodes, (item, index) => {
          if(Number(item.id) === 0) nodes.push(item);
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.id)){
              nodes.push({
                attributes: {name: elem.StoreName},
                id: item.id,
                itemStyle: item.itemStyle,
                label: {...item.label, show: false},
                name: elem.StoreName,
                symbolSize: item.symbolSize,
                value: item.value,
                viz: item.viz,
                x: item.x,
                y: item.y,
                storeId: elem
              })
            }
          })
        })
        _.forEach(floorPoint.edges, (item, index) => {
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.source)){
              edges.push(item);
              edges.push(_filterEdges(item.target, floorPoint.edges));
              nodes.push(_filterNodes(item.target, floorPoint.nodes));
            }
          })
        });
        yield put({
          type: '_pointForFloorSucc',
          payload: {Data: {nodes: _.uniq(nodes), edges: _.uniq(edges)}},
        })
      } else {
        throw response
      }
    },
    *_getPointForType({ payload }, { call, put }) {
      const response = yield call(GetStoresPositionInfo, payload);
      const { success, Data } = response;
      let nodes = [],
        edges = [];
      if(success && Data){
        // console.warn(typePoint.nodes)
        // console.warn(_.uniq(typePoint.nodes))
        // console.warn(Data)
        // console.warn(_.uniq(Data))
        _.forEach(typePoint.nodes, (item, index) => {
          if(Number(item.id) === 0) nodes.push(item)
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.id)){
              nodes.push({
                attributes: {name: elem.StoreName},
                id: item.id,
                itemStyle: item.itemStyle,
                label: {...item.label, show: false},
                name: elem.StoreName,
                symbolSize: item.symbolSize,
                value: item.value,
                viz: item.viz,
                x: item.x,
                y: item.y,
                storeId: elem
              })
            }
          })
        })
        _.forEach(typePoint.edges, (item, index) => {
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.source)){
              edges.push(item)
              edges.push(_filterEdges(item.target, typePoint.edges))
              nodes.push(_filterNodes(item.target, typePoint.nodes))
            }
          })
        });
        yield put({type: '_pointForTypeSucc', payload: {Data: {nodes: _.uniq(nodes), edges: _.uniq(edges)}},})
      } else {
        throw response
      }
    },
    *_getPointBasicSale({ payload }, { all, call, put, select }) {//飞行图点位数据(基础)
      const floorResponse = yield call(GetFloorStoreSale, payload);
      const typeResponse = yield call(GettypeStoreSale, payload);
      const { floorPoint, typePoint } = yield select(_ => _.deal);
      // const [floorResponse, typeResponse]  = yield all([
      //   call(GetFloorStoreSale, payload),
      //   call(GettypeStoreSale, payload)
      // ]);
      // console.log(floorResponse)
      // console.log(typeResponse)
      if(floorResponse.Status === 1 && floorResponse.Data && typeResponse.Status === 1 && typeResponse.Data){
          const FloorSale = floorResponse.Data.FloorSale;//楼层销售
          const FloorSaleAmt = floorResponse.Data.MallSaleAmt;//楼层总计
          const OperationSale = typeResponse.Data.OperationSale;//业态销售
          const typeSaleAmt = typeResponse.Data.MallSaleAmt;//业态总计

          const newfloorPoint = produce(floorPoint, nextData => {

            // nextData.nodes[0].name = String(numeral(FloorSaleAmt).format('0,0'));
            // nextData.nodes[0].attributes.name = String(FloorSaleAmt);
            //
            _.forEach(nextData.nodes, (ele) => {
              if(ele.id === '0') {
                ele.name = String(numeral(FloorSaleAmt).format('0,0'));
                ele.attributes.name = String(FloorSaleAmt);
                return ele
              }
              _.forEach(FloorSale, (item) => {
                const FloorName = ele.name.split('F')[0]
                if(FloorName === item.FloorName) {
                  ele.symbolSize = item.symbolSize
                  ele.TotalSaleAmt = item.TotalSaleAmt
                  ele.searchId = item.FloorId
                  ele.FloorId = item.FloorId
                  return ele
                }
                _.forEach(item.StoreSale, (elem) => {
                  if(ele.name === elem.StoreName){
                    ele.symbolSize = elem.symbolSize
                    ele.TotalSaleAmt = elem.TotalSaleAmt
                    ele.searchId = elem.StoreID
                    return ele
                  }
                })
              })
            })
          });

          const newTypePoint = produce(typePoint, nextData => {
            // nextData.nodes[0].name = String(numeral(typeSaleAmt).format('0,0'))
            // nextData.nodes[0].attributes.name = String(typeSaleAmt)
            _.forEach(nextData.nodes, (ele) => {
              if(ele.id === '0') {
                ele.name = String(numeral(typeSaleAmt).format('0,0'));
                ele.attributes.name = String(typeSaleAmt);
                return ele
              }
              _.forEach(OperationSale, (item) => {
                if(ele.name === item.OperationName) {
                  ele.symbolSize = item.symbolSize
                  ele.TotalSaleAmt = item.TotalSaleAmt
                  ele.searchId = item.OperationID
                  ele.OperationID = item.OperationID
                  return ele
                }
                _.forEach(item.StoreSale, (elem) => {
                  if(ele.name === elem.StoreName){
                    ele.symbolSize = elem.symbolSize
                    ele.TotalSaleAmt = elem.TotalSaleAmt
                    ele.searchId = elem.StoreID
                    return ele
                  }
                })
              })
            })
          });
          yield put({ type: '_floorStoreSaleSucc', payload: { Data: { floorPoint: newfloorPoint, floorSalesVal: FloorSale }}});
          yield put({ type: '_typeStoreSucc', payload: { Data: { typePoint: newTypePoint, typeSalesVal: OperationSale } } });
          return {isOver: true}
      } else {
        throw floorResponse || typeResponse
      }
    },
    *GetFloorStoreSale({ payload }, { call, put, select }) {//飞行图点位数据(基础)
      const response = yield call(GetFloorStoreSale, payload);
      const { success, Data } = response;
      const { floorPoint } = yield select(_ => _.deal)
      if(success && Data){
        const { MallSaleAmt, FloorSale } = Data;

        const newPoint = produce(floorPoint, nextData => {
          nextData.nodes[0].name = String(numeral(MallSaleAmt).format('0,0'));
          nextData.nodes[0].attributes.name = String(MallSaleAmt);
          _.forEach(nextData.nodes, (ele) => {
            _.forEach(FloorSale, (item) => {
              const FloorName = ele.name.split('F')[0]
              if(FloorName === item.FloorName) {
                ele.symbolSize = item.symbolSize
                ele.TotalSaleAmt = item.TotalSaleAmt
                ele.searchId = item.FloorId
                ele.FloorId = item.FloorId
                return ele
              }
              _.forEach(item.StoreSale, (elem) => {
                if(ele.name === elem.StoreName){
                  ele.symbolSize = elem.symbolSize
                  ele.TotalSaleAmt = elem.TotalSaleAmt
                  ele.searchId = elem.StoreID
                  return ele
                }
              })
            })
          })
        });
        yield put({
          type: '_floorStoreSaleSucc',
          payload: {
            Data: {
              floorPoint: newPoint,
              floorSalesVal: FloorSale
            }
          }
        })
      } else {
        throw response
      }
    },
    *GettypeStoreSale({ payload }, { call, put, select }) {//飞行图点位数据，业态
      const response = yield call(GettypeStoreSale, payload);
      const { success, Data } = response;
      const { typePoint } = yield select(_ => _.deal)
      if(success && Data){
        const { MallSaleAmt, OperationSale } = Data;
        const newPoint = produce(typePoint, nextData => {
          nextData.nodes[0].name = String(numeral(MallSaleAmt).format('0,0'))
          nextData.nodes[0].attributes.name = String(MallSaleAmt)
          _.forEach(nextData.nodes, (ele) => {
            _.forEach(OperationSale, (item) => {
              if(ele.name === item.OperationName) {
                ele.symbolSize = item.symbolSize
                ele.TotalSaleAmt = item.TotalSaleAmt
                ele.searchId = item.OperationID
                ele.OperationID = item.OperationID
                return ele
              }
              _.forEach(item.StoreSale, (elem) => {
                if(ele.name === elem.StoreName){
                  ele.symbolSize = elem.symbolSize
                  ele.TotalSaleAmt = elem.TotalSaleAmt
                  ele.searchId = elem.StoreID
                  return ele
                }
              })
            })
          })
        });

        // console.warn("业态点位分布:", newPoint)
        yield put({
          type: '_typeStoreSucc',
          payload: {
            Data: {
              typePoint: newPoint,
              typeSalesVal: OperationSale
            }
          }
        })
      } else {
        throw response
      }
    },
    *GetTypeSaleAnalysis({ payload }, { call, put }) {//业态销售分析
      const response = yield call(GetTypeSaleAnalysis, payload);
      const { success, Data } = response;
      let LegendData = [],
        totalSeries = [],
        salesSeries = [],
        tooltipsSeries = [],
        isEmpty = true;

      if(success && Data){
        // console.warn("Data", Data)
        Data.forEach((_) => {
          if(_.TotalAmount !== 0 || _.VipAmount !== 0 || _.NormalAmount !== 0){
            isEmpty = false
          }
          LegendData.push(`${_.OperationTypeName}`)
          totalSeries.push({
            value: String(_.TotalAmount),
            name: `${_.OperationTypeName}`
          })
          salesSeries.push(
            {
              value: _.VipAmount > 0 ? _.VipAmount : 0,
              type: `${_.OperationTypeName}`,
              name: `会员 ${_.OperationTypeName}`
            },
            {
              value: _.NormalAmount > 0 ? _.NormalAmount : 0,
              type: `${_.OperationTypeName}`,
              name: `非会员 ${_.OperationTypeName}`
            })
          tooltipsSeries.push(
            {
              value: _.VipAmount,
              type: `会员`,
              name: `会员 ${_.OperationTypeName}`
            },
            {
              value: _.NormalAmount,
              type: `非会员`,
              name: `非会员 ${_.OperationTypeName}`
            }
          )
        });
        yield put({
          type: '_typeSaleAnalysisSucc',
          payload: {Data: {LegendData, totalSeries, salesSeries, tooltipsSeries, isEmpty}},
        })
      } else {
        throw response
      }

    },
    *GetStoresRankInfo({ payload }, { call, put }) {//查询商铺实时交易排序数据
      const response = yield call(GetStoresRankInfo, payload);
      const { success, Data } = response;
      let numOne = {},
          numTwo = {},
          numThree = {},
          otherList = [];
      if(success && Data){
        Data.forEach((e, i) => {
          if(i === 0){
            numOne = {
              BillAmount: e.BillAmount,
              StoreConverImg: e.StoreConverImg,
              StoreID: e.StoreID,
              StoreName: e.StoreName,
            }
          }
          if(i === 1){
            numTwo = {
              BillAmount: e.BillAmount,
              StoreConverImg: e.StoreConverImg,
              StoreID: e.StoreID,
              StoreName: e.StoreName,
            }
          }
          if(i === 2){
            numThree = {
              BillAmount: e.BillAmount,
              StoreConverImg: e.StoreConverImg,
              StoreID: e.StoreID,
              StoreName: e.StoreName,
            }
          }
          if(i !== 0 && i !== 1 && i !== 2){
            otherList.push(e)
          }
        })
        yield put({ type: '_storesRankSucc', payload: {Data: {numOne, numTwo, numThree, otherList}}})
      } else {
        throw response
      }
    },
    *getDealTimeInterval({ payload }, { call, put }) {//销售时段
      const response = yield call(GetdealTimeInterval);
      const { success, Data } = response;
      let CustSaleAmt = [],
        DateTime = [],
        PersonCount = [],
        NoCustSaleAmt = [];
      if(success && Data){
        Data.forEach((_) => {
          DateTime.push(moment(_.DateTime).format('HH:mm'))
          CustSaleAmt.push(_.CustSaleAmt)
          PersonCount.push(_.PersonCount)
          NoCustSaleAmt.push(_.NoCustSaleAmt)
        });
        yield put({
          type: '_timeIntervalSucc',
          payload: {Data: {DateTime, CustSaleAmt, PersonCount, NoCustSaleAmt}},
        })
      } else {
        throw response
      }
    },
    *getSalesTrend({ payload }, { call, put }) {//销售趋势
      const response = yield call(GetdealSalesTrend);
      const { success, Data } = response;
      let BizDate = [],
        CustSaleAmt = [],
        GuestCount = [],
        NoCustSaleAmt = [];
      if(success && Data){
        Data.forEach((_) => {
          GuestCount.push(numeral(_.GuestCount).format('0[.]00'))
          CustSaleAmt.push(numeral(_.CustSaleAmt).format('0[.]00'))
          NoCustSaleAmt.push(numeral(_.NoCustSaleAmt).format('0[.]00'))
          BizDate.push(moment(_.BizDate).format('YYYY.MM.DD'))
        });
        yield put({
          type: '_salesTrendSucc',
          payload: {Data: {BizDate, CustSaleAmt, GuestCount, NoCustSaleAmt}},
        })
      } else {
        throw response
      }
    },
    *GetStoreslivingInfo({ payload }, { call, put, select, take }) {//订单实时数据，处理交互动画逻辑
      const response = yield call(GetStoreslivingInfo, payload);
      const { success, Data } = response;
      if(success && Data){
        const newData =  _.orderBy(Data, ['BillTime'], ['asc']);
        yield put({ type: '_storeslivingInfoSucc', payload: {Data: {storesliving: newData}}});
      } else {
        throw response
      }
    },
    *GetFloorSaleAnalysisData({ payload }, { call, put }) {//楼层销售分析统计数据
      const response = yield call(GetFloorSaleAnalysisData, payload);
      const { success, Data } = response;
      let LegendData = [],
        totalSeries = [],
        salesSeries = [],
        tooltipsSeries = [],
        isEmpty = true;
      if(success && Data){
        let newData = _.orderBy(Data, ['FloorName'], ['asc'])
        newData.forEach((_) => {
          if(_.TotalAmount !== 0 || _.VipAmount !== 0 || _.NormalAmount !== 0){
            isEmpty = false
          }
          LegendData.push(`${_.FloorName}楼`)
          totalSeries.push({
            value: _.TotalAmount,
            name: `${_.FloorName}楼`
          })

          salesSeries.push(
            {
              value: _.VipAmount > 0 ? _.VipAmount : 0,
              type: `${_.FloorName}楼`,
              name: `会员 ${_.FloorName}楼`
            },
            {
              value: _.NormalAmount > 0 ? _.NormalAmount : 0,
              type: `${_.FloorName}楼`,
              name: `非会员 ${_.FloorName}楼`
            })
          tooltipsSeries.push(
            {
              value: _.VipAmount,
              type: `会员`,
              name: `会员 ${_.FloorName}楼`
            },
            {
              value: _.NormalAmount,
              type: `非会员`,
              name: `非会员 ${_.FloorName}楼`
            }
          )
        });

        yield put({
          type: '_floorSaleAnalysisSucc',
          payload: {
            Data: {LegendData, totalSeries:  _.orderBy(totalSeries, ['name'], ['asc']), salesSeries, tooltipsSeries, isEmpty}
          },
        })
      } else {
        throw response
      }
    },
  },

  reducers: {
    _updateStatus(state, { payload }){
      const { newState } = payload
      return { ...state, ...newState }
    },
    _typeSaleAnalysisSucc(state, { payload }){
      const { Data } = payload
      return { ...state, typeSaleAnalysis: Data }
    },
    _storesRankSucc(state, { payload }){
      const { Data } = payload
      return { ...state, storesRank: Data }
    },
    _salesTrendSucc(state, { payload }){
      const { Data } = payload
      return { ...state, SalesTrend: Data }
    },
    _timeIntervalSucc(state, { payload }){
      const { Data } = payload
      return { ...state, TimeInterval: Data }
    },
    _floorStoreSaleSucc(state, { payload }){
      const { Data } = payload;
      const { floorPoint, floorSalesVal } = Data;
      return {...state, floorPoint, floorSalesVal}
    },
    _typeStoreSucc(state, { payload }){
      const { Data } = payload
      const { typePoint, typeSalesVal } = Data
      return {...state, typePoint, typeSalesVal}
    },
    _floorSaleAnalysisSucc(state, { payload }){
      const { Data } = payload
      return { ...state, FloorSaleAnalysis: Data }
    },
    _pointForFloorSucc(state, { payload }){
      const { Data } = payload
      return { ...state, floorPoint: Data }
    },
    _pointForTypeSucc(state, { payload }){
      const { Data } = payload
      return { ...state, typePoint: Data }
    },
    _storeslivingInfoSucc(state, { payload }){
      const { Data } = payload
      const { storesliving } = Data
      return { ...state, storesliving,  }
    },
    _setFloorCenterVal(state, { payload }){
      const { Data } = payload
      return { ...state, floorPoint: Data  }
    },
    _setTypeCenterVal(state, { payload }){
      const { Data } = payload
      return { ...state, typePoint: Data,  }
    },
    _setFloorEffect(state, { payload }){//设置当前订单
      const { floorEffect } = payload;
      return { ...state, floorEffect }
    },
    _setTypeEffect(state, { payload }){//设置当前订单
      const { typeEffect } = payload
      return { ...state, typeEffect }
    },

  }
}
