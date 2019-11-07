import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Statistic, Icon } from 'antd';
import WaterBall from '@/components/waterBall';
import styles from './index.less';
import PropTypes from 'prop-types';
import { formaterVal } from '@/utils'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
// import { WaterWave } from 'ant-design-pro/lib/Charts';
const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #ffffff;
`;

const IntroText = styled.div`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #ffffff;
`;

const Result = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const ItemTitle = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
`;

const PassflowText = styled.div`
    width: 50.9%;
    height: 100%;
    padding: 7px 0 7px 16px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: flex-start;
`;

const PassflowChart = styled.div`
    width: 49.1%;
    height: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;


class Passflow extends PureComponent {
  getCircleProps = () =>(
    {
      idDom: 'circleWaterBall2',
      width: 120,
      height: 120,
      textColor: "#fff",
      waveTextColor: "#333",
      textSize: .9,
      title: '提袋率',
      outerCircle:{
      r: 60,
        fillColor: '#02c7ff'
    },
    innerCircle:{
      r: 58,
        fillColor: '#00AFF6'
    }}
  )


  render() {
    const { CarInCount, PaidPercent, PaidHBPercent, SequentialValue, TotalPassengerFlowCount, PaidTBPercent } = this.props;
    console.warn("keliu",this.props)
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
      <ReactCSSTransitionGroup
        transitionEnter={true}
        transitionLeave={true}
        transitionEnterTimeout={2500}
        transitionLeaveTimeout={1500}
        transitionName="animated"
      >
      <div key="amache" className={'animated bounceInUp' + ' ' +styles.div1_text + ' ' + styles.four_corner_border}>
        <PassflowText>
          <Title>客流</Title>
          {formaterVal(TotalPassengerFlowCount, 2, 2, "人次", "万人次", { fontSize: 28,color: '#fff' }, {width: '100%'})}
          <IntroText>
            <ItemTitle>环</ItemTitle>
            <Result>
              <Statistic
                value={statusNum(SequentialValue)}
                precision={2}
                valueStyle={{ fontSize: 16,color: statusColor(SequentialValue) }}
                prefix={statusIcon(SequentialValue)}
                suffix="%"
              />
            </Result>
          </IntroText>
          <IntroText>
            <ItemTitle>同</ItemTitle>
            <Result>
              <Statistic
                value={statusNum(PaidTBPercent)}
                precision={2}
                valueStyle={{ fontSize: 16,color: statusColor(PaidTBPercent) }}
                prefix={statusIcon(PaidTBPercent)}
                suffix="%"
              />
            </Result>
          </IntroText>
          <IntroText>
            <ItemTitle>提袋率环比</ItemTitle>
            <Result>
              <Statistic
                value={statusNum(PaidHBPercent)}
                precision={2}
                valueStyle={{ fontSize: 16,color: statusColor(PaidHBPercent) }}
                prefix={statusIcon(PaidHBPercent)}
                suffix="%"
              />
            </Result>
          </IntroText>
          <IntroText>
            <ItemTitle>车流</ItemTitle>
            <Result>
              {formaterVal(CarInCount, 0, 0, "车次", "万车次", { fontSize: 16,color: '#fff' }, null)}
            </Result>
          </IntroText>
        </PassflowText>
        <PassflowChart>
          <WaterBall data={{id: 1, value: PaidPercent/100}} config={this.getCircleProps()}/>
        </PassflowChart>
      </div>
      </ReactCSSTransitionGroup>
    )
  }
}
Passflow.propTypes = {
  CarInCount: PropTypes.number,
  PaidPercent: PropTypes.number,
  SequentialValue: PropTypes.number,
  TotalPassengerFlowCount: PropTypes.number
}

export default Passflow
