import React, { Component } from 'react'
import { Select, Input, DatePicker, Space, Button, Table } from 'antd';
import axios from 'axios'
import moment from 'moment';
import { APIURL } from '../../../../common/constdt'
import '../list'
const { Option } = Select;
const { RangePicker } = DatePicker;
export default class details extends Component {
    state = {
        loadings: [],
        status: null,
        task_no: '',
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
        maxthree: null, // 最大的数据
        downlist: [],
        id: null,
        proc_cn_name:null,
        page:1
    };
    componentDidMount() {
        // const urls = `${APIURL}/taskInsertDb/taskList`
        const urlsr = `${APIURL}/taskInsertDb/taskDetail`
        const id = this.props.location.search.slice(1)
        this.setState((prevState, props) => ({
            task_no:id,
        }));
        axios.get(urlsr, {
            params: {
                task_no: id
            }
        }).then(
            res => {
                console.log(res.data.task_detail_list);
                let data = Object.assign({}, this.state.dataSource.data,{data:res.data.task_detail_list[0]},{count:res.data.task_detail_list[1].total_num})
                this.setState((prevState, props) => ({
                    dataSource:data,
                }));
            },
            err => {
                alert('网络错误')
                console.log('失败', err);
            }
        )

    }
    enterLoading = index => {
        const urlsr = `${APIURL}/taskInsertDb/taskDetail`
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
        // debugger;
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
        paramsr['page'] = this.state.page
        axios.get(urlsr, {
            params: paramsr
        }).then(
            res => {
                console.log('成功', res);
                let data = Object.assign({},{data:res.data.task_detail_list[0]},{count:res.data.task_detail_list[1].total_num})
                console.log(data);
                this.setState((prevState, props) => ({
                    dataSource:data,
                }));
                console.log(res.data.task_detail_list);
                console.log(data);
                console.log(this.state.dataSource);
                paramsr = {}
            },
            err => {
                alert('请检查您输入是否有误')
                console.log('失败', err);
                console.log(paramsr);
            }
            
        )
    };
    onChange = (value) => {
        this.setState({ status: value })
    }
    onChangesrr = (value) => {
        this.setState({ proc_cn_name: value })
    }
    serveonChange = (e) => {
        let task_no = e.target.value
        this.setState({ task_no: task_no, })
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
    paging = (current, pageSize) =>{
        const urlsr = `${APIURL}/taskInsertDb/taskDetail`
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
        this.setState({page:current})
        paramsr['page'] = current
        paramsr['page_size'] = pageSize
         axios.get(urlsr,{
             params:paramsr
         }).then(
              res => {
                let data = Object.assign({},{data:res.data.task_detail_list[0]},{count:res.data.task_detail_list[1].total_num})
                this.setState((prevState, props) => ({
                    dataSource:data,
                }));
                console.log('成功', res);
                paramsr = {}
              },
              err => {
                console.log('失败', err);
              }
            )
    }
    render() {
        const provinceData = this.state.downlist;
        const { loadings, listdat, total_num, } = this.state;
        const columns = [
            {
                title: '节点名',
                dataIndex: 'container_name',
                key: 'container_name',
                width: 100
            },
            {
                title: '容器名',
                dataIndex: 'instance_name',
                key: 'instance_name',
                width: 100
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => {
                    return <div>
                        {record.status == 'SUCCEED'? '成功': record.status == 'PARTIALSUCCESS'? '部分成功':'失败'}
                    </div>
                }
            },
            {
                title: '失败过程',
                dataIndex: 'proc_cn_name',
                key: 'proc_cn_name',
                width: 100
            },
            {
                title: '失败原因',
                dataIndex: 'message',
                key: 'message',
                width: 100
            },
            {
                title: '时间',
                dataIndex: 'add_time',
                key: 'add_time',
                width: 100
            },
        ];
        const id = this.props.location.search.slice(1)
        const data = this.state.dataSource.data
        return (

            <div>
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
                    <div className='box1'>
                        <span>失败过程：</span>
                        <Select
                            showSearch
                            style={{ width: 100 }}
                            placeholder="请选择"
                            optionFilterProp="children"
                            onChange={this.onChangesrr}
                            defaultValue="全部"
                            // onFocus={onFocus}
                            // onBlur={onBlur}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="ALL">全部</Option>
                            <Option value="资源配置">资源配置</Option>
                            <Option value="副本增加1">副本增加1</Option>
                            <Option value="集群调度">集群调度</Option>
                            <Option value="前处理">前处理</Option>
                            <Option value="服务启动">服务启动</Option>
                            <Option value="后处理">后处理</Option>
                        </Select>
                    </div >
                    <div className='box1'>
                        <span>任务编号：</span>
                        <Input placeholder="单行输入" style={{ width: 200 }} onChange={e => this.serveonChange(e)} defaultValue={id}  allowClear/>
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
                        <Button type="primary" loading={loadings[0]} onClick={() => this.enterLoading(0)}>
                            查询
                        </Button>
                    </div>
                </div >
                <div>
                    <Table  columns={columns} dataSource={data} scroll={{y:'calc(100vh - 250px)'}} pagination={{  //分页
                        total: this.state.dataSource.count, //数据总数量r
                        // pageSize: this.state.queryInfo.pageSize,  //显示几条一页
                        defaultPageSize: this.state.queryInfo.pageSize, //默认显示几条一页
                        showSizeChanger: true,  //是否显示可以设置几条一页的选项
                        onChange:(current, pageSize)=>{
                            this.paging(current, pageSize)
                        },
                        showTotal: () => {  //设置显示一共几条数据
                            return '共 ' + this.state.dataSource.count + ' 条数据';
                        }
                    }} />
                </div>
            </div>
        )
    }
}

