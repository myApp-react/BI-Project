import React, { PureComponent } from 'react'
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import BaseLayout from './BaseLayout'
// import 'echarts';
// import "echarts"
import "echarts/lib/chart/line"
import "echarts/lib/chart/pie"
import "echarts/lib/chart/bar"
import "echarts/lib/chart/graph"
import "echarts/lib/chart/lines"
import "echarts/lib/chart/effectScatter"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/legend"
// import "echarts/lib/"
import "echarts/lib/component/grid"
import "echarts/lib/component/title"
NProgress.configure({ showSpinner: false });//禁用进度环
moment.locale('zh-cn');

@withRouter
@connect(({ loading }) => ({ loading }))
class Layout extends PureComponent {
  render() {
    const { loading, children } = this.props;
    if (loading.global) {
      NProgress.start()
    }
    if (!loading.global) {
      NProgress.done()
    }

    return (
      <LocaleProvider locale={zh_CN}>
        <BaseLayout>{children}</BaseLayout>
      </LocaleProvider>
    )
  }
}
export default Layout
