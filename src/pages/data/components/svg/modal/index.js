import React, { Component } from 'react'
import { Modal, Row, Col, Avatar, Tag, Icon, Statistic, Spin } from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import { Recharts, Components } from 'react-component-echarts';
import config from 'utils/config';
import { renderTooltips } from '@/utils'
const { AxisPointer, TextStyle, LineStyle, AxisLabel, NameTextStyle, Grid, SplitLine, AxisLine, AxisTick, Legend, Tooltip, XAxis, YAxis, Series } = Components


@connect(({data, loading}) => ({data, loading}))
class Trend extends Component {

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.visible !== nextProps.visible || this.props.loading.global !== nextProps.loading.global){
      return true
    }
    return false
  }

  render() {
    const { data, visible, onCancel, width, loading} = this.props;
    const { GetStoreInfo, StoreCompare, StoreSale, StoreSequential } = data;
    const { global } = loading;
    const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
    const statusNum = (value) => {
      let initNum = 0;
      if( Number(value) >= 0 ){
        initNum = value;
      }else {
        initNum = String(value).split("-")[1];
      }
      return initNum
    };

    const statusColor = (value) => {
      let initColor = "#fff";
      if( Number(value) > 0 ){
        initColor = "#ff8160";
      }else if(Number(value) < 0){
        initColor = "#2bdfa0";
      }
      return initColor
    };

    const statusIcon = (value) => {
      let initIcon = <Icon type='minus' />;
      if( Number(value) > 0 ){
        initIcon = <Icon type='caret-up' />;
      }else if(Number(value) < 0){
        initIcon = <Icon type='caret-down' />;
      }
      return initIcon
    };

    return (
      <Modal
        centered={true}
        visible={visible}
        closable={false}
        onCancel={onCancel}
        width={width}
        className={styles.customModal}
        footer={null}
      >
        <i className={styles['modal-border-com'] + ' ' + styles['modal-border-left-top']} />
        <i className={styles['modal-border-com'] + ' ' + styles['modal-border-left-bottom']} />
        <i className={styles['modal-border-com'] + ' ' + styles['modal-border-right-top']} />
        <i className={styles['modal-border-com'] + ' ' + styles['modal-border-right-bottom']} />
        <Spin indicator={antIcon} spinning={global} wrapperClassName='modalspinning'>
          <div className={styles.row_item}>
            <Row gutter={40}>
              <Col span={12} >
                <div className={styles.store_info}>
                  <div className={styles.store_info_img}>
                    <Avatar
                      size={80}
                      style={{ backgroundColor: '#fff' }}
                      src={GetStoreInfo.StoreCoverImg}
                    />
                  </div>
                  <h3 className={styles.store_info_name}>
                    <span>{GetStoreInfo.StoreName}</span>
                    <Tag color="#3A355F">{GetStoreInfo.OperationName}</Tag>
                  </h3>
                </div>
                <div className={styles.store_extra_info}>
                  <ul>
                    <li>
                      <span className={styles.store_extra_title}>销售排名：</span>
                      <span className={styles.store_extra_cont}>
                        {
                          GetStoreInfo.SaleRank && GetStoreInfo.SaleRank !== '0' ?
                            <Statistic
                              value={GetStoreInfo.SaleRank}
                              precision={0}
                              valueStyle={{ color: '#ff8160' }}
                              prefix={"NO."}
                            /> :
                            <Icon type='minus' />
                        }
                        {/*<Statistic*/}
                          {/*value={GetStoreInfo.SaleRank}*/}
                          {/*precision={0}*/}
                          {/*valueStyle={{ color: '#ff8160' }}*/}
                          {/*prefix={"NO."}*/}
                        {/*/>*/}
                      </span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>收益排名：</span>
                      <span className={styles.store_extra_cont}>
                        {
                          GetStoreInfo.EarningRank && GetStoreInfo.EarningRank !== '0' ? <Statistic
                            value={GetStoreInfo.EarningRank}
                            precision={0}
                            valueStyle={{ color: '#ff8160' }}
                            prefix={"NO."}
                          /> : <Icon type='minus' />
                        }
                        {/*<Statistic*/}
                          {/*value={GetStoreInfo.EarningRank}*/}
                          {/*precision={0}*/}
                          {/*valueStyle={{ color: '#ff8160' }}*/}
                          {/*prefix={"NO."}*/}
                        {/*/>*/}
                      </span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>开业时间：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.OpenDate}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>占地面积：</span>
                      <span className={styles.store_extra_cont}>{`${GetStoreInfo.StoreArea} m²`}</span>
                    </li>
                    {/*<li>*/}
                    {/*<span className={styles.store_extra_title}>租金收取方式：</span>*/}
                    {/*<span className={styles.store_extra_cont}>{GetStoreInfo.RentCollectMethod}</span>*/}
                    {/*</li>*/}
                    <li>
                      <span className={styles.store_extra_title}>店铺编号：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.StoreCode}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>租金收益：</span>
                      <span className={styles.store_extra_cont}>{`${GetStoreInfo.RentEarning} 元`}</span>
                    </li>

                    <li className={styles['store-position']}>
                      <span className={styles.store_extra_title}>店铺位置：</span>
                      <span className={styles.store_extra_cont + ' ' + styles['store-position-text']}>{`${GetStoreInfo.FloorName}楼${GetStoreInfo.DoorNumber}`}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>所属业态：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.OperationName}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>欠费：</span>
                      <span className={styles.store_extra_cont}>
                        <Statistic
                          value={GetStoreInfo.UnChargeAmt}
                          precision={2}
                          valueStyle={{ color: '#0fecf2' }}
                          suffix="元"
                        />
                      </span>
                    </li>
                  </ul>
                </div>

              </Col>
              <Col span={12} >
                <div className={styles.store_chart_item + ' ' + styles.slider_card_corner_border}>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="销售额"
                      value={StoreCompare.SaleAmt}
                      precision={2}
                      suffix="元"
                    />
                    <div className={styles['list-warp']}>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>同</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.SaleComparedValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.SaleComparedValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.SaleComparedValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>环</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.SaleSequentialValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.SaleSequentialValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.SaleSequentialValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="收益"
                      value={StoreCompare.EarningAmt}
                      precision={2}
                      suffix="元"
                    />
                    <div className={styles['list-warp']}>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>同</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.EarningComparedValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.EarningComparedValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.EarningComparedValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>环</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.EarningSequentialValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.EarningSequentialValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.EarningSequentialValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="客单价"
                      value={StoreCompare.CustomerPerOrder}
                      precision={2}
                      suffix="元"
                    />
                    <div className={styles['list-warp']}>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>同</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.CustomerComparedOrder)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.CustomerComparedOrder), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.CustomerComparedOrder)}
                            suffix="%"
                          />
                        </div>
                      </div>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>环</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.CustomerSequentialOrder)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.CustomerSequentialOrder), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.CustomerSequentialOrder)}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="销售坪效"
                      value={StoreCompare.SaleAmtPerArea}
                      precision={2}
                      suffix="元/m²"
                    />
                    <div className={styles['list-warp']}>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>同</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.SaleAmtPerAreaComparedValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.SaleAmtPerAreaComparedValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.SaleAmtPerAreaComparedValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>环</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.SaleAmtPerAreaSequentialValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.SaleAmtPerAreaSequentialValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.SaleAmtPerAreaSequentialValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="收益坪效"
                      value={StoreCompare.RentEarningPerArea}
                      precision={2}
                      suffix="元/m²"
                    />
                    <div className={styles['list-warp']}>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>同</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.EarningPerAreaComparedValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.EarningPerAreaComparedValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.EarningPerAreaComparedValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>环</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.EarningPerAreaSequentialValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.EarningPerAreaSequentialValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.EarningPerAreaSequentialValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="会员占比"
                      value={StoreCompare.CustomerSaleAmtPercent}
                      precision={2}
                      suffix="%"
                    />
                    <div className={styles['list-warp']}>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>同</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.CustomerSaleAmtComparedValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.CustomerSaleAmtComparedValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.CustomerSaleAmtComparedValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                      <div className={styles['list-col']}>
                        <h3 className={styles.title}>环</h3>
                        <div className={styles['main-cont']}>
                          <Statistic
                            value={statusNum(StoreCompare.CustomerSaleAmtSequentialValue)}
                            precision={2}
                            valueStyle={{ color: statusColor(StoreCompare.CustomerSaleAmtSequentialValue), fontSize: 14 }}
                            prefix={statusIcon(StoreCompare.CustomerSaleAmtSequentialValue)}
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row gutter={40}>
              <Col span={12} >
                <div className={styles.chart_item}>
                  <div className={styles.chart_list_title}>
                    <div className={styles.list_title_text}>
                      店铺销售分析
                      <i className={styles['border-top']}/>
                      <i className={styles['border-oblique']}/>
                    </div>
                  </div>
                  <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                    <Recharts color={["#d36abf", "#03a3db", "#ef547d", "#eac057"]}>
                      <Tooltip
                        trigger="axis"
                        formatter={(params) => {
                          return `${renderTooltips(params)}`
                        }}
                        extraCssText={config.dataExtraCssText}
                      >
                        <AxisPointer type="line" />
                      </Tooltip>
                      <Grid left="10%" top="20%" bottom="12%" right="4%" />
                      <Legend top="0" x='right' icon="rect" itemWidth={9} itemHeight={9}>
                        <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
                      </Legend>
                      <XAxis type="category" data={StoreSale.SaleYearMonth}>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <AxisLine>
                          <LineStyle color="#fff"/>
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                      </XAxis>
                      <YAxis type="value" name="金额（元）" min={0}>
                        <AxisLine>
                          <LineStyle color="#fff" />
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <NameTextStyle color="#fff" fontSize={10}/>
                      </YAxis>
                      <Series z={4} name="业态平均" type="line" symbolSize={1} smooth={true} data={StoreSale.OperationTypeSaleAvg} >
                        <LineStyle normal={{"width":3,"shadowColor":"#090237","shadowBlur":8,"shadowOffsetY":4}} />
                      </Series>
                      <Series z={3} name="项目平均" type="line" symbolSize={1} smooth={true} data={StoreSale.MallSaleAvg} >
                        <LineStyle normal={{"width":3,"shadowColor":"#090237","shadowBlur":8,"shadowOffsetY":4}} />
                      </Series>
                      <Series z={2} stack="销售" barGap="-100%" name="会员销售" type="bar" data={StoreSale.CustomerSaleAvg} />
                      <Series z={1} stack="销售" barGap="-100%" name="非会员销售" type="bar" data={StoreSale.NonCustomerSaleAvg} />
                    </Recharts>
                  </div>
                </div>
              </Col>
              <Col span={12} >
                <div className={styles.chart_item}>
                  <div className={styles.chart_list_title}>
                    <div className={styles.list_title_text}>
                      收益分析
                      <i className={styles['border-top']}/>
                      <i className={styles['border-oblique']}/>
                    </div>
                  </div>
                  <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                    <Recharts color={["#d36abf", "#03a3db","#e8816d"]}>
                      <Tooltip
                        trigger="axis"
                        extraCssText={config.dataExtraCssText}
                      >
                        <AxisPointer type="line" />
                      </Tooltip>
                      <Grid left="10%" top="20%" bottom="12%" right="4%" />
                      <Legend top="0" x='right' icon="rect" itemWidth={9} itemHeight={9}>
                        <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
                      </Legend>
                      <XAxis type="category" data={StoreSequential.SaleYearMonth}>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <AxisLine>
                          <LineStyle color="#fff"/>
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                      </XAxis>
                      <YAxis type="value" name="金额（元）" min={0}>
                        <AxisLine>
                          <LineStyle color="#fff" />
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <NameTextStyle color="#fff" fontSize={10}/>
                      </YAxis>
                      <Series
                        z={3}
                        name="业态平均"
                        type="line"
                        symbolSize={1}
                        smooth={true}
                        data={StoreSequential.OperationTypeEarningAvg}
                      >
                        <LineStyle normal={{"width":3,"shadowColor":"#090237","shadowBlur":8,"shadowOffsetY":4}} />
                      </Series>
                      <Series
                        z={2}
                        symbolSize={1}
                        smooth={true}
                        name="项目平均"
                        type="line"
                        data={StoreSequential.MallEarningAvg}
                      >
                        <LineStyle normal={{"width":3,"shadowColor":"#090237","shadowBlur":8,"shadowOffsetY":4}} />
                      </Series>
                      <Series z={1} barWidth={14} barGap="-100%" name="收益额" type="bar" data={StoreSequential.StoreEarning} />
                    </Recharts>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default Trend
