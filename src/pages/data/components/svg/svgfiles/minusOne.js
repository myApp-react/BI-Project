import React, {Component, Fragment} from 'react';
import styles from './minusOne.less';
import Modal from '../modal';
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO} from 'react-svg-pan-zoom';
import minusOne from './json/minusOne';
import moment from 'moment';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant';

@connect(({globalData, data}) => ({globalData, data}))
class MinusOne extends Component {
  Viewer = null;
  wrapper = null;
  svgwarp = null;
  state = {
    tool: "auto",
    value: INITIAL_VALUE,
    width: 800,
    height: 544,
    visible: false,
    StoreID: ''
  }

  componentDidMount() {
    // this.Viewer.fitToViewer("center", "center");
    const width = this.wrapper.clientWidth
    const height = this.wrapper.clientHeight
    // this.setState({width, height})
    this.setState(() => ({
      width, height
    }), () => {
      this.Viewer && this.Viewer.fitSelection(-(width/2 - 190), 10, 860, 860)
    });
  }

  changeTool(nextTool) {
    this.setState({tool: nextTool})
  }

  changeValue(nextValue) {
    this.setState({value: nextValue})
  }

  fitToViewer() {
    this.Viewer.fitToViewer()
  }

  fitSelection() {
    this.Viewer.fitSelection(40, 40, 200, 200)
  }

  zoomOnViewerCenter() {
    this.Viewer.zoomOnViewerCenter(1)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.value !== nextState.value || this.state.visible !== nextState.visible || this.props.GetStoreSale !== nextProps.GetStoreSale || this.props.currentKey !== nextProps.currentKey) {
      return true
    }
    return false
  }

  _getStoreInfo = (e) => {
    const StoreID = e.originalEvent.target.getAttribute("data-storeid");
    const { dispatch, globalData: {rangeDate, StartDate, EndDate}} = this.props;
    const Start = moment(StartDate).format('YYYY-MM')
    const End = moment(EndDate).format('YYYY-MM')
    const payload = { StartDate: Start, EndDate: End, StoreID }
    const IncomeForm = { StartDate: moment().subtract(12, 'months').format('YYYY-MM'), EndDate: moment().subtract(1, 'months').format('YYYY-MM'), StoreID }
    if(StoreID){
      //店铺基本信息
      dispatch({type: 'data/GetStoreInfo', payload})
      dispatch({type: 'data/GetStoreCompareInfo', payload})
      dispatch({type: 'data/GetStoreSale', payload})
      dispatch({type: 'data/GetStoreSequential', payload: IncomeForm})
      this.setState({visible: true, StoreID});
    }
  }

  handleCancel = (e) => {
    const { cancelRequest = new Map() } = window;
    cancelRequest.forEach((value, key) => {
      value.cancel(CANCEL_REQUEST_MESSAGE)
      cancelRequest.delete(key)
    });
    this.setState((pre) => ({
      visible: !pre.visible
    }));
  }

  render() {
    const { width, height, visible, StoreID } = this.state;
    const {
      GetStoreSale,
      DefaultStoreIsShowDoorNum,
      DefaultStoreIsShowStoreName,
      EmptyStoreIsShowDoorNum,
      EmptyStoreIsShowOther,
      EmptyStoreShowOtherInfo,
      currentKey
    } = this.props;
    const { polygon, rect } = minusOne;
    const modalProps = {StoreID}
    let selectRect = [],
        selectPolygon = []

    _.forEach(GetStoreSale, (item, index) => {
      _.forEach(polygon, (ele, i) => {
        if(ele.doorNum.num === item.BIStoreLocationNum){
          if(item.DegreeID && Number(currentKey) === Number(item.DegreeID)){
            selectPolygon.push({
              points: ele.polygon.points,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: item.DegreeColor,
              fillText: "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }else {
            selectPolygon.push({
              points: ele.polygon.points,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: currentKey ? '#1f204d' : item.DegreeColor,
              fillText: currentKey ? '#7a7c99' : "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }

        }
      })
      _.forEach(rect, (ele, i) => {
        if(ele.doorNum.num === item.BIStoreLocationNum){
          if( item.DegreeID && Number(currentKey) === Number(item.DegreeID)){
            selectRect.push({
              x: ele.rect.x,
              y: ele.rect.y,
              width: ele.rect.width,
              height: ele.rect.height,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: item.DegreeColor,
              fillText: "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }else {
            selectRect.push({
              x: ele.rect.x,
              y: ele.rect.y,
              width: ele.rect.width,
              height: ele.rect.height,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: currentKey ? '#1f204d' : item.DegreeColor,
              fillText: currentKey ? '#7a7c99' : "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }
        }
      })
    });

    return (
      <Fragment>
        <div className={styles.wrapper}  ref={_ => this.wrapper = _}>
          <ReactSVGPanZoom
            width={width}
            height={height}
            background={"#0C0028"}
            SVGBackground={"#0C0028"}
            ref={Viewer => this.Viewer = Viewer}
            tool={this.state.tool}
            detectAutoPan={false}
            toolbarProps={{position: 'none'}}
            miniatureProps={{position: 'none'}}
            onChangeTool={tool => this.changeTool(tool)}
            value={this.state.value}
            onChangeValue={value => this.changeValue(value)}
            onClick={this._getStoreInfo}
          >
            <svg width={860} height={860} viewBox="0 0 843.5 902.6">
              <g>
                <path className={styles.svg_bg} d="M452.3,83.2L0,81.1v762.3l841.5,0.1l37-30.4V515.8h24.1V111.3h-24.1h-71.4l-27.6,0.2H667.4V28.3h-124V0h-91.1
		L452.3,83.2L452.3,83.2z M534,23.8v28.3h123.9v83.2H767l52.9-0.2h34.9h27.3V492H858l-3.2,297.3l-37,30.4l-795.5-0.1V104.9
		l447.6,2.1V23.8H534L534,23.8z"/>
                <polygon className={styles.svg_bg} points="25.3,108 25.3,816.4 814.5,816.6 851.5,786.1 851.5,488.8 875.6,488.8 875.6,138.2 851.5,138.2
		819.9,138.2 766.9,138.4 654.6,138.4 654.6,55.2 530.7,55.2 530.7,27 474.5,27 474.5,110.1 	"/>
              </g>

              {
                polygon.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <polygon
                      points={_.polygon.points}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : '' }</text>
                    <text
                      transform={_.doortext.transform}
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }</text>
                  </g>
                })
              }
              {
                rect.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <rect
                      x={_.rect.x}
                      y={_.rect.y}
                      width={_.rect.width}
                      height={_.rect.height}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : '' }</text>
                    <text
                      transform={_.doortext.transform}
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }</text>
                  </g>
                })
              }
              {
                selectPolygon.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <polygon
                      points={_.points}
                      style={{cursor: 'pointer'}}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                      data-degreeid={_.DegreeID}
                    />
                    <text
                      data-storeid={_.storeid}
                      transform={_.numTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      data-storeid={_.storeid}
                      transform={_.textTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
                  </g>
                })
              }
              {
                selectRect.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <rect
                      className="st1"
                      x={_.x}
                      y={_.y}
                      width={_.width}
                      height={_.height}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                      data-degreeid={_.DegreeID}
                      style={{cursor: 'pointer'}}
                    />
                    <text
                      data-storeid={_.storeid}
                      transform={_.numTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      data-storeid={_.storeid}
                      transform={_.textTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
                  </g>
                })
              }
            </svg>
          </ReactSVGPanZoom>
          <Modal
            visible={visible}
            onCancel={this.handleCancel}
            width={1200}
            {...modalProps}
          />
        </div>
      </Fragment>
    )
  }
}

MinusOne.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  DefaultStoreIsShowDoorNum: PropTypes.number,
  DefaultStoreIsShowStoreName: PropTypes.number,
  EmptyStoreIsShowDoorNum: PropTypes.number,
  EmptyStoreIsShowOther: PropTypes.number,
  EmptyStoreShowOtherInfo: PropTypes.string,
}

export default MinusOne
