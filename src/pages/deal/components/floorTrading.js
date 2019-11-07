import React, { memo } from 'react';
import styled from 'styled-components';
import { Recharts, Components } from 'react-component-echarts';
import { Empty } from 'antd';
import EmptyIma from 'assets/Empty.svg';
// import config from 'utils/config';
// import numeral from 'numeral';
// const { TextStyle, Label, Tooltip, Legend, Series } = Components;
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
  View,
  Legend,
} from 'bizcharts';
import DataSet from '@antv/data-set';


const StyledDiv = styled.div`
  position: relative;
  width: 600px;
`;
const EmptyWarp = styled.div`
  padding: 75px 0;
`;

export default memo((props) => {
  const { DataView } = DataSet;
  const dv = new DataView();
  dv.source(props.salesSeries).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: (val) => {
        val = `${(val * 100).toFixed(2)}%`;
        return val;
      },
    },
  };
  const dv1 = new DataView();
  dv1.source(props.salesSeries).transform({
    type: 'percent',
    field: 'value',
    dimension: 'name',
    as: 'percent',
  });

  return (
    <StyledDiv>
      {
        props.LegendData.length === 0 || props.isEmpty ? <EmptyWarp>
            <Empty
              image={EmptyIma}
              imageStyle={{height: 120,}}
              description={<span style={{color: '#2880B4', fontSize: 16}}
              >暂无相关数据</span>} />
          </EmptyWarp> :
          <Chart
            width={600}
            height={300}
            data={dv}
            scale={cols}
            padding={[40, 40, 40, 110]}
          >
            <Coord type="theta" radius={0.5} innerRadius={0.5 / 0.85}/>
            <Legend name="name" visible={false} />
            <Legend
              position="left-center"
              marker="square"
              name="type"
              offsetX={10}
              visible={true}
              itemMarginBottom={16}
              textStyle={{fill: '#fff',}}
              itemFormatter={(val) => {
                const getInfo = props.totalSeries.filter(_ => _.name === val)
                if(val === '-1楼') {
                  return getInfo[0] && `${val}  ${getInfo[0].value}元`
                }
                return getInfo[0] && `${val}   ${getInfo[0].value}元`
              }}
            />
            <Tooltip
              containerTpl='<div class="g2-tooltip"><table class="g2-tooltip-list"></table></div>'
              itemTpl='<tr class="g2-tooltip-list-item"><td><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}</td><td>{value}</td></tr>'
              offset={50}
              g2-tooltip={{
                  position: 'absolute',
                  visibility: 'hidden',
                  border : 'none',
                  boxShadow: '0px 0px 10px 0px rgba(19, 21, 62, 0.5)',
                  backgroundColor: 'rgba(175, 211, 250, .9)',
                  color: '#13153e',
                  padding: '6px 4px',
                  transition: 'top 200ms,left 200ms'
                }}
              g2-tooltip-list={{
                  margin: '10px'
                }}
            />
            <Geom
              type="intervalStack"
              position="percent"
              color={['type',['#2ADFA1','#00A9F7','#A366FF','#FF5881', '#FFDB6C']]}
              tooltip={[
              'type*percent*value',
              (item, percent, value) => {
                percent = `${(percent * 100).toFixed(2)}%`;
                return {
                  name: `${item}：` ,
                  value: `${value}元 (${percent})`,
                };
              },
            ]}
              style={{
              lineWidth: 3,
              stroke: '#090237',
            }}
              select={false}
            >
            </Geom>
            <View data={dv1} scale={cols}>
              <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />
              <Geom
                type="intervalStack"
                position="percent"
                color={[
                'name',
                [
                  '#00B172',
                  '#2ADFA1',
                  '#0278F7',
                  '#00A9F7',
                  '#7232D1',
                  '#A366FF',
                  '#E93A62',
                  '#FF5881',
                  '#E9B51C',
                  '#FFDB6C',
                ],
              ]}
                tooltip={[
                'name*percent*value',
                (item, percent, value) => {
                  percent = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name: `${item}：` ,
                    value: `${value}元 (${percent})`,
                  };
                },
              ]}
                style={{
                lineWidth: 3,
                stroke: '#090237',
              }}
                select={false}
              >
                <Label
                  content={["name*value", (name, value) => {return `${name}: ${value}元`;}]}
                  position="middle"
                  htmlTemplate={(text, item, index) => {
                     const compareInfo = props.tooltipsSeries.filter(_ => _.name === item.point.name);
                     return compareInfo && compareInfo.length !== 0 && '<span class="title" style="display: block;white-space: nowrap;line-height:1.1;color:' + item.color + '">' + compareInfo[0].type + ':' + compareInfo[0].value +'元</span>';
                  }}
                />
              </Geom>
            </View>
          </Chart>
      }
    </StyledDiv>
  )
})

//
// <Recharts
//   height={300}
//   backgroundColor="#090237"
//   color={["#FFDB6C", "#2ADFA1", "#00A9F7", "#A366FF", "#FF5881"]}
// >
//   <Tooltip trigger="item" formatter="{a} <br/>{b}:({d}%)" extraCssText={config.pieExtraCssText}/>
//   <Legend orient="vertical" top="middle" left={10} formatter={(name) => formatter(name, props.totalSeries)} itemWidth={12} itemHeight={12} icon='rect' data={props.LegendData}>
//     <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
//   </Legend>
//   <Series
//     name="总销售额"
//     type="pie"
//     center={['60%', '50%']}
//     radius={["20%","40%"]}
//     itemStyle={{
//               "normal":{
//               "borderColor":"#090237",
//               "borderWidth":4
//               }}}
//     data={props.totalSeries}
//   >
//     <Label show={false} />
//   </Series>
//   <Series
//     name="销售额"
//     type="pie"
//     center={['60%', '50%']}
//     radius={["40%","60%"]}
//     labelLine={{"normal":{"show":true,"length":20,"length2":20,"lineStyle":{"type":"solid","width":1}}}}
//     itemStyle={{
//               "normal":{
//               "borderColor":"#090237",
//               "borderWidth":4
//               }}}
//     data={props.salesSeries}
//   >
//     <Label normal={{
//                 "formatter":"{b},{c}元"
//               }}
//     />
//   </Series>
// </Recharts>
