import React, { Component } from 'react'
// import Tract from '../retract/tract'
import { Select, Input, DatePicker, Space, Button, Table, Checkbox, Spin, AutoComplete, Form, Cascader } from 'antd';
import { APIURL } from '../../../common/constdt'
import moment from 'moment';
import ReactEcharts from 'echarts-for-react'
import { Link } from 'react-router-dom';
import './list.css'
import axios from 'axios'
// import '../../../mock/mock'
const { Option } = Select;
const { RangePicker } = DatePicker;
export default class list extends Component {
    state = {
        loadings: [],
        status: null,
        app_server: null,
        // event_id: null,
        start_time: null,
        end_time: null,
        page_size: null,
        page: null,
        listdat: null,
        dataSource: {    //数据存放
            count: 0,    //一共几条数据
            data: [],    //数据
        },
        queryInfo: {    //设置最初一页显示多少条
            pageSize: 20
        },
        loading: false,
        finall_all_data: [],  //柱状图下名称
        arr: [],
        success_fail_data: [],
        fail_reason_data: null,
        total_num: null,
        downlist: [],
        id: 'ALL',
        checked: false,
        lz: true,
        page: 1,
        datas: [],
        value: undefined,
        query_list: ['1', '222', '1212'],
        eventChainChildren: null, // 服务数据
        link: null,// 链路id
        link_name: []
    };
    // list接口
    listport = () => {
        const link_id = window.location.href.split('?').length < 2 ? '' : window.location.href.split('?')[1].split('&')[0]
        const urlsrr = link_id == '' ? `${APIURL}/task/taskField` : `${APIURL}/task/taskField?link_id=${link_id}`
        axios.get(urlsrr).then(
            res => {
                // 获取列表信息
                let data = Object.assign({}, { data: res.data.task_list }, { count: res.data.page_data.total_num })
                this.setState((prevState, props) => ({
                    dataSource: data,
                }));
                this.setState({
                    link_name:res.data.link_name,
                    isLoading: true
                })
                console.log(this.state.link_name);
                console.log(res);
            },
            err => {
                console.log('失败', err);
            }
        )
    }
    // 图表接口
    chartport = () => {
        const link_id = window.location.href.split('?').length < 2 ? '' : window.location.href.split('?')[1].split('&')[0]
        const urls = link_id == '' ? `${APIURL}/task/taskGraphList` : `${APIURL}/task/taskGraphList?link_id=${link_id}`
        axios.get(urls).then(
            res => {
                // 获取列表信息
                const datal = res.data.task_list
                this.setState({ listdat: datal })
                // 获取柱状图
                const finall_all_data = res.data.finall_all_data[0]
                const maxone = res.data.finall_all_data[0].sum_num
                const maxtwo = Math.max(...maxone)
                const maxthree = Math.ceil(maxtwo / 50) * 50

                //获取饼图数据
                const success_fail_data = res.data.success_fail_data[0]
                const fail_reason_data = res.data.fail_reason_data

                // 处理柱状图数据
                let arr = []
                finall_all_data.succ_rate.map(itme => {
                    return arr.push((itme * 100).toFixed(2))
                })
                //获取数据额
                // const total_num = res.data.page_data.total_num
                this.setState((prevState, props) => ({
                    finall_all_data: finall_all_data,
                    arr: arr,
                    success_fail_data: success_fail_data,
                    fail_reason_data: fail_reason_data,
                    // total_num: total_num,
                    maxthree: maxthree
                }));
                this.setState({ lz: false })
            },
            err => {
                console.log('失败', err);
            }
        )
    }
    componentDidMount() {
        // 图表接口
        this.chartport()
        // 调用list接口
        this.listport()
        // 选择框接口
        const urlsr = `${APIURL}/eventInfo/getEventList?event_type=2`
        axios.get(urlsr).then(
            res => {
                const downlistss = res.data.data
                let downlist = []
                downlistss.map(itme => {
                    if (itme.pid == 0) {
                        return downlist.push(itme)
                    }
                    return downlist
                })
                this.setState((prevState, props) => ({
                    downlist: downlist,
                }))
            },
            err => {
                console.log('失败', err);
            }
        )
        // 服务接口
        const urlsrrr = `${APIURL}/capacityModel/queryServerName`
        axios.get(urlsrrr).then(
            res => {
                this.setState((prevState, props) => ({
                    query_list: res.data.query_list,
                }));
            },
            err => {
                console.log('失败', err);
            }
        )
        this.newagetRates()
        let myChart = this.echarts && this.echarts.getEchartsInstance();
        window.addEventListener('resize', () => {
            myChart && myChart.resize();
        })
    }
    newagetRates() {
        const urlsx = `${APIURL}/capacity/newMenu`;
        let that = this;
        axios.get(urlsx, { withCredentials: true })
            .then(function (response) {
                let array_one = []
                if (response.data.code == 0) {
                    that.setState({
                        eventChain: response.data.data
                    })
                    for (let h = 0; h < response.data.data.length; h++) {
                        let obj_one = {}
                        obj_one.label = response.data.data[h].cateName;
                        obj_one.value = response.data.data[h].link_id;
                        obj_one.children = []
                        array_one.push(obj_one)
                        let array_two = []
                        if (response.data.data[h].menu) {
                            for (let j = 0; j < response.data.data[h].menu.length; j++) {
                                let obj_two = {}
                                obj_two.label = response.data.data[h].menu[j].pName;
                                obj_two.value = response.data.data[h].menu[j].link_id;
                                array_two.push(obj_two)
                                let array_three = []
                                if (response.data.data[h].menu[j].menu && response.data.data[h].menu[j].menu.length >= 1 && response.data.data[h].menu[j].menu[0].link_id) {

                                    for (let k = 0; k < response.data.data[h].menu[j].menu.length; k++) {
                                        let obj_three = {}
                                        obj_three.label = response.data.data[h].menu[j].menu[k].subName;
                                        obj_three.value = response.data.data[h].menu[j].menu[k].link_id;
                                        array_three.push(obj_three)
                                    }
                                    array_two[j].children = array_three
                                } else {
                                    let obj_three = {}
                                    obj_three.label = "_";
                                    obj_three.value = "_";
                                    array_three.push(obj_three)
                                }
                            }
                            array_one[h].children = array_two
                        }
                        // new menus
                    }
                    that.setState({
                        eventChainChildren: array_one,
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    // 搜索按钮动画节流
    enterLoading = index => {
        const urlsrr = `${APIURL}/task/taskGraphList`
        const urlsrrr = `${APIURL}/task/taskField`
        this.setState(({ loadings }) => {
            const newLoadings = [...loadings];
            newLoadings[index] = true;

            return {
                loadings: newLoadings,
            };
        });
        setTimeout(() => {
            this.setState(({ loadings }) => {
                const newLoadings = [...loadings];
                newLoadings[index] = false;

                return {
                    loadings: newLoadings,
                };
            });
        }, 3000);
        let params = {}
        if (this.state.status != null && this.state.status != 'ALL') {
            params['status'] = this.state.status
        }
        if (this.state.app_server != null && this.state.app_server != '') {
            params['app_server'] = this.state.app_server
        }
        // if (this.state.event_id != null && this.state.event_id != '') {
        //     params['event_id'] = this.state.event_id
        // }
        if (this.state.start_time != null) {
            params['start_time'] = this.state.start_time
        }
        if (this.state.end_time != null) {
            params['end_time'] = this.state.end_time
        }
        if (this.state.link != null) {
            params['link_id'] = this.state.link
        }
        if (this.state.id != null && this.state.id != 'ALL') {
            params['event_id'] = this.state.id
        }
        axios.get(urlsrr, {
            params: params
        }).then(
            res => {
                if (res.data.code == 0) {
                    console.log('成功', res);
                    const finall_all_data = res.data.finall_all_data[0]
                    const maxone = res.data.finall_all_data[0].sum_num
                    const maxtwo = Math.max(...maxone)
                    const maxthree = Math.ceil(maxtwo / 50) * 50
                    const success_fail_data = res.data.success_fail_data[0]
                    const fail_reason_data = res.data.fail_reason_data
                    let arr = []
                    finall_all_data.succ_rate.map(itme => {
                        return arr.push((itme * 100).toFixed(2))
                    })
                    this.setState({
                        // listdat: res.data.task_list, total_num: res.data.page_data.total_num,
                        maxthree: maxthree,
                        finall_all_data: finall_all_data,
                        arr: arr,
                        success_fail_data: success_fail_data,
                        fail_reason_data: fail_reason_data,
                    })
                    params = {}
                } else {
                    alert(res.data.msg)
                }
            },
            err => {
                alert('网络错误,请稍后')
                console.log('失败', err);
                console.log(params);
                params = {}
            }
        )
        axios.get(urlsrrr, {
            params: params
        }).then(
            res => {
                if (res.data.code == 0) {
                    let data = Object.assign({}, { data: res.data.task_list }, { count: res.data.page_data.total_num })
                    this.setState((prevState, props) => ({
                        dataSource: data,
                    }));
                    console.log('成功', res);
                }
                params = {}
            },
            err => {
                console.log('失败', err);
            }
        )
    };
    // 柱状图
    getOpion() {
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            // toolbox: {
            //     feature: {
            //         // dataView: { show: true, readOnly: false },
            //         magicType: { show: true, type: ['line', 'bar'] },
            //         // restore: { show: true },
            //         // saveAsImage: { show: true }
            //     }
            // },
            legend: {
                data: ['扩容总台数', '成功台数', '失败台数', '成功率']
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.state.finall_all_data.date,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '台数',
                    min: 0,
                    max: this.state.maxthree,
                    interval: this.state.maxthree / 5,
                },
                {
                    type: 'value',
                    name: '成功率',
                    min: 0,
                    max: 100,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
            ],
            series: [
                {
                    name: '扩容总台数',
                    type: 'bar',
                    data: this.state.finall_all_data.sum_num
                },
                {
                    name: '失败台数',
                    type: 'bar',
                    data: this.state.finall_all_data.fail_num
                },
                {
                    name: '成功台数',
                    type: 'bar',
                    data: this.state.finall_all_data.succ_num
                },
                {
                    name: '成功率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.state.arr
                }
            ]

        };
        return option
    }
    // 饼图1
    getOpionone() {
        let option = {
            title: {
                // text: 'Referer of a Website',
                subtext: '数据汇总',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: this.state.success_fail_data.all_succ_num, name: '成功' },
                        { value: this.state.success_fail_data.all_fail_num, name: '失败' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],

        };
        return option
    }
    // 饼图2
    getOpiontwo() {
        let option = {
            title: {
                // text: 'Referer of a Website',
                subtext: '失败原因汇总',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: this.state.fail_reason_data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return option
    }
    onChange = (value) => {
        this.setState({ status: value })
    }
    serveonChange = (e) => {
        let app_server = e.target.value
        this.setState({ app_server: app_server, })
    }
    date = (v) => {
        // 获取选择时间
        if (v == null) {
            this.setState({ start_time: '' })
            this.setState({ end_time: '' })
            console.log(1);
        } else {
            let begin = v[0].format("YYYY-MM-DD HH:mm:ss")
            let over = v[1].format("YYYY-MM-DD HH:mm:ss")
            console.log(begin, over);
            // 对获取的时间进行截取和拼接
            let beginS = begin.substring(0, begin.length - 8) + '00:00:00';
            let overS = over.substring(0, over.length - 8) + '23:59:00';
            console.log(beginS, overS);
            this.setState({ start_time: beginS })
            this.setState({ end_time: overS })
        }
    }
    onChangetwo = (value) => {
        let num = value
        this.setState({ id: num })
        console.log(this.state.id);
    }
    onChangetofill = (e) => {
        console.log(e.target.checked);
        this.setState({ checked: e.target.checked })
        this.setState({ id: 'ALL' })
    }
    onChangethree = (e) => {
        console.log(e.target.value);
        this.setState({ id: e.target.value })
    }
    paging = (current, pageSize) => {
        const urlsrr = `${APIURL}/taskInsertDb/taskField`
        let paramsr = {}
        if (this.state.status != null && this.state.status != 'ALL') {
            paramsr['status'] = this.state.status
        }
        if (this.state.app_server != null && this.state.app_server != '') {
            paramsr['app_server'] = this.state.app_server
        }
        if (this.state.start_time != null) {
            paramsr['start_time'] = this.state.start_time
        }
        if (this.state.end_time != null) {
            paramsr['end_time'] = this.state.end_time
        }
        if (this.state.id != null && this.state.id != 'ALL') {
            paramsr['event_id'] = this.state.id
        }
        if (this.state.task_no != '') {
            paramsr['task_no'] = this.state.task_no
        }
        if (this.state.proc_cn_name != null && this.state.proc_cn_name != '全部') {
            paramsr['proc_cn_name'] = this.state.proc_cn_name
        }
        this.setState({ page: current })
        paramsr['page'] = current
        paramsr['page_size'] = pageSize
        axios.get(urlsrr, {
            params: paramsr
        }).then(
            res => {
                let data = Object.assign({}, { data: res.data.task_list[0] }, { count: res.data.task_list[1].total_num })
                this.setState((prevState, props) => ({
                    dataSource: data,
                }));
                console.log('成功', res);
                paramsr = {}
            },
            err => {
                console.log('失败', err);
            }
        )
    }
    handleSearch = value => {
        if (value) {
            fetch(value, data => this.setState({ data }));
        } else {
            this.setState({ datas: [] });
        }
    };
    onSelect = (v) => {
        console.log(v);
        this.setState({ app_server: v })
    }
    onChangeCascader = (v) => {

        let link = v.pop()
        // console.log(link);
        this.setState({ link: link })
        console.log(this.state.link);
    }
    render() {
        const provinceData = this.state.downlist;
        const { loadings, link_name, } = this.state;
        // 表头设置
        const columns = [
            {
                title: '任务名称',
                dataIndex: 'task_name',
                key: 'age',
                width: 150,
            },
            {
                title: '任务编号',
                dataIndex: ['task_no', 'url'],
                key: 'ider',
                width: 150,
                render: (text, record) => {
                    return <div>
                        <a href={record.url} target="_blank">{record.task_no}</a>
                    </div>
                }
            },
            {
                title: '服务',
                dataIndex: ["app", "server"],
                key: 'address',
                width: 150,
                render: (text, record) => {
                    return <div>
                        <p>{record.app}.{record.server}</p>
                    </div>
                }
            },
            {
                title: '地域',
                dataIndex: 'area',
                key: 'territory',
                width: 70,
                // render: (text, record) => {
                //     return <div>
                //         —
                //     </div>
                // }
            },
            {
                title: 'set',
                dataIndex: 'set',
                key: 'set',
                width: 140,
                // render: (text, record) => {
                //     return <div>
                //         —
                //     </div>
                // }
            },
            {
                title: '扩容总数|成功数|失败数(台)',
                dataIndex: ["total_num", "succ_num", "fail_num"],
                key: 'count',
                width: 150,
                render: (text, record) => {
                    return <div>
                        {record.total_num}丨{record.succ_num}丨{record.fail_num}
                    </div>
                }
            },
            {
                title: '成功率(%)',
                dataIndex: 'succ_rate',
                key: 'chenggonglv',
                width: 70,
                render: (text, record) => {
                    return <div>
                        {record.succ_rate * 100}%
                    </div>
                }
            },
            {
                title: '耗时(s)',
                dataIndex: 'cons_time',
                key: 'haoshi',
                width: 60,
            },
            {
                title: '状态',
                dataIndex: 'status_cn_name',
                key: 'zhuangtai',
                width: 120,
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: 120,
                render: (text, record) => {
                    return <div>
                        <Link to={{ pathname: `/Details`, search: record.task_no }} target="_blank">
                            查看
                        </Link>
                    </div>
                }
            },
        ];
        const data = this.state.dataSource.data;
        return (
            <div>
                {/* seek */}
                <div className='seek'>
                    {/* 类型选择 */}
                    <div className='box1'>
                        <span>状态：</span>
                        <Select
                            showSearch
                            style={{ width: 100 }}
                            placeholder="请选择"
                            optionFilterProp="children"
                            onChange={this.onChange}
                            defaultValue="全部"
                            // onFocus={onFocus}
                            // onBlur={onBlur}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="ALL">全部</Option>
                            <Option value="SUCCEED">成功</Option>
                            <Option value="PARTIAL SUCCESS">部分成功</Option>
                            <Option value="FAILED">失败</Option>
                        </Select>
                    </div >
                    {/* 服务选择 */}
                    <div className='box1'>
                        {/* <span>服务：</span>
                        <Input placeholder="单行输入" style={{ width: 150 }} onChange={e => this.serveonChange(e)} /> */}
                        <Form hideRequiredMark>
                            <Form.Item label={'服务'}>
                                {(
                                    <AutoComplete
                                        allowClear
                                        key="AutoCompleteCom"
                                        dataSource={this.state.query_list}
                                        style={{
                                            width: 200,
                                        }}
                                        /*
                                         *此处的filterOption对象中的函数就是筛选函数
                                         *inputValue:输入框输入的值
                                         *option:List中的所有元素
                                         */
                                        filterOption={(inputValue, option) =>
                                            option.props.children.includes(inputValue)
                                        }
                                        onChange={this.onSelect}
                                        placeholder="请选择"
                                    />
                                )}
                            </Form.Item>
                        </Form>
                    </div >
                    {/* 选择链路id */}
                    <div className='box1'>
                        <span>链路：</span>
                        <Cascader key={link_name} defaultValue={link_name} options={this.state.eventChainChildren} onChange={this.onChangeCascader}/>
                    </div>
                    {/* 选择事件 */}
                    <div className='box1'>
                        <span>选择事件：</span>
                        {this.state.checked == true ? <Input style={{ width: 200 }} onChange={this.onChangethree} placeholder="请输入事件id" /> : <Select defaultValue={provinceData[0]} style={{ width: 200 }} onChange={this.onChangetwo} defaultValue="全部">
                            <Option value="ALL">全部</Option>
                            {provinceData.map((itme, index) => (
                                <Option key={index} value={itme.id} >{itme.event_name}</Option>
                            ))}
                        </Select>}
                        <Checkbox onChange={this.onChangetofill} className='tofill'><span style={{ color: this.state.checked == true ? 'cornflowerblue' : 'black' }}>手填</span></Checkbox>
                    </div >
                    {/* 日期选择 */}
                    <div className='box1'>
                        <Space direction="vertical" size={12}>
                            <RangePicker
                                ranges={{
                                    '当天': [moment().startOf('day'), moment().endOf('day')],
                                    '近一周': [moment().subtract(7, 'days').startOf('day'), moment().endOf('day')],
                                    '近一个月': [moment().subtract(30, 'days').startOf('day'), moment().endOf('day')]
                                }}
                                format="YYYY-MM-DD"
                                onChange={this.date}
                                allowClear={true}
                            />
                        </Space>
                    </div>
                    {/* 搜索 */}
                    <div className='box1'>
                        <Button type="primary" loading={loadings[0]} onClick={() => this.enterLoading(0)} >
                            查询
                        </Button>
                    </div>
                </div>
                {/* echarts */}
                <div className='echarts'>
                    {/* 柱状图 */}
                    <div className='bar'>
                        <Spin tip="加载中....." spinning={this.state.lz}>
                            <ReactEcharts
                                ref={e => {
                                    this.echartsReact = e;
                                }}

                                option={this.getOpion()}
                                notMerge={true}
                                lazyUpdate={true}
                            />
                        </Spin>
                    </div>
                    {/* 饼图1 */}
                    <div className='pie'>
                        <Spin tip="加载中....." spinning={this.state.lz}>
                            <ReactEcharts
                                option={this.getOpionone()}
                                notMerge={true}
                                lazyUpdate={true}
                            ></ReactEcharts>
                        </Spin>
                    </div>
                    {/* 饼图2 */}
                    <div className='pie'>
                        <Spin tip="加载中....." spinning={this.state.lz}>
                            <ReactEcharts
                                option={this.getOpiontwo()}
                                notMerge={true}
                                lazyUpdate={true}
                            ></ReactEcharts>
                        </Spin>
                    </div>
                </div>
                {/* table */}
                <Table columns={columns} dataSource={data} rowKey={record => record.id} scroll={{ y: 'calc(100vh - 610px)' }}
                    pagination={{  //分页
                        total: this.state.dataSource.count, //数据总数量r
                        // pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                        defaultPageSize: this.state.queryInfo.pageSize, //默认显示几条一页
                        showSizeChanger: true,  //是否显示可以设置几条一页的选项
                        onChange: (current, pageSize) => {
                            this.paging(current, pageSize)
                        },
                        showTotal: () => {  //设置显示一共几条数据
                            return '共 ' + this.state.dataSource.count + ' 条数据';
                        }
                    }} />
            </div >
        )
    }
}
