import React from 'react';
import { withRouter } from 'react-router-dom';

import { Select, Card, Row, Col, DatePicker, Button, Table, Tooltip, Spin  } from 'antd';
 
import {    LoadingOutlined  } from '@ant-design/icons';
import axios from "axios";
import moment from 'moment';



import {  APIURL } from '../../common/constdt.js'




const { Option } = Select;
const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


 
class EventListAuto extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tabledt: null,
            visible: false,
            total: null,
            pageSize: 25,
            current: 1,
            status: null,
            startTime: null, 
            endTime: null,
            pidlists: null,
            EngName: null,
            deleteid: null,
            delisModalVisible: false,
            event_type: null,
            pid: null,
            wheight: 600,
          
        }
        
        this.check = this.check.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
        this.sxcallagetRates = this.sxcallagetRates.bind(this)
        this.onChangetm = this.onChangetm.bind(this)
        this.onChange = this.onChange.bind(this)
        this.wrapper = React.createRef();
        this.onOks = this.onOks.bind(this);
        

    }

    
    

    componentDidMount() {
        
        let wh =  window.innerHeight - 220;
        console.log(wh);


        var url_string = window.location.href.replace(/\/#/g,"")
       
        
        var url = new URL(url_string);
       
        
        var pid = url.searchParams.get("pid");
        var event_type  = url.searchParams.get("event_type");
       
        this.setState({
            event_type: event_type,
            pid: pid,
            wheight: wh,
        })

        this.callagetRates(pid, event_type)
         
     
     
    }

     
    goback() {
       
        this.props.history.push({
            pathname: "EventList",
           
         }); 

    }
    
    async callagetRates (pid, event_type){
         
        this.setState({
            tabledt: null,
            total: null

        })

        const urlsx = `${APIURL}/eventInfo/getEventList`;


        let that = this
        await axios.get(urlsx,{
            withCredentials: true,
            params: {
                pid:  pid,
                event_type:  event_type,
                start_time: that.state.startTime,
                end_time: that.state.endTime,
                page: this.state.current,
                page_size: that.state.pageSize,
               
            }
        })
            .then(function (response) {
              
                if (response.data) {
                    that.setState({
                        
                        tabledt: response.data.data,
                        total: response.data.page_data.total_num,

                    })
                }



            })
            .catch(function (error) {
                console.log(error);
                
            })

    }


     
     
    async sxcallagetRates (x){
         
        this.setState({
            tabledt: null,
            total: null

        })

        const urlsx = `${APIURL}/eventInfo/getEventList`;

        let that = this;

        await axios.get(urlsx,{
            withCredentials: true,
            params: {
                pid:  this.state.pid,
                event_type:  this.state.event_type,
                event_status: this.state.status,
                start_time: that.state.startTime,
                end_time: that.state.endTime,
                page:   x ? x : this.state.current,
                page_size: that.state.pageSize,
               
            }
        })
            .then(function (response) {
              
                if (response.data) {
                    that.setState({
                        
                        tabledt: response.data.data,
                        total: response.data.page_data.total_num,

                    })
                }


            })
            .catch(function (error) {
                console.log(error);
                
            })

    }

    onChange(t) {
        
   
        
        this.setState({
            current: t.current,
            pageSize: t.pageSize,
        })

        this.sxcallagetRates(t.current)
      
        
       
    }

 
    handleChanges(v){
         
       
        
        if(v){
            this.setState({
                status: v,
                
            })
        }else {
            this.setState({
                status: null,
                
            })
        }
        
    }
   
    check(){
        this.sxcallagetRates()
    }
 
    onChangetm(ts, ta){
        console.log(ts,ta)
        this.setState({
         startTime: ta[0], 
         endTime: ta[1], 
         
     })
      
    }
 

    onOks(v){
       
        if(v[0]){
             
            this.setState({
                startTime: v[0].format("YYYY-MM-DD HH:mm:ss"),
            
            })
         
        }
      
        if(v[1]){
           
            this.setState({
             
                endTime: v[1].format("YYYY-MM-DD HH:mm:ss"), 
         })
             
        }
    
         
          
     }
 
     
   
    render(){

        const handleDetailchild = (data) => {

            
            this.props.history.push({
                pathname: "CapacityChildDetailAuto",
                search: "id="+data.id,
                state: {id: data.id}
             }); 
            
         
           
      
        }
 
        function trans(v){
            
            if(v.event_type == 2 &&  v.pid == 0){
                return "--"
            } else {
                if(v.event_status == 1){
                    return "准备中"
                }else if(v.event_status == 2){
                    return "活动中"
                }else if(v.event_status == 3){
                    return "已结束"
                } else {
                    return "--"
                }
            }
            
        }


        function buttons(v){
            
        
            return  <span>

                
                    <Button type = "primary"  size = "small"
                    onClick = {() => handleDetailchild(v)}
                    >
                        详情
                    </Button>
                
                </span>


        }
  
          

        const columns = [
            
            {
                title: '事件名',
                dataIndex: 'event_name',
                align: "left",
                width: "10%",
                ellipsis: true,
                render: (text, data) => (
                    
                    <Tooltip  placement="topLeft"  title={data.event_name}>
                        <span>
                        {data.event_name}
                        </span>   
                    </Tooltip>
                    
                )
            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                align: "left",
                width: 180,
                render: (text, data) => (
                    <span>
                        {data.start_time ? data.start_time : "--"}
                    </span>
                )

            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                align: "left",
                width: 180,
                render: (text, data) => (
                    <span>
                        {data.end_time ? data.end_time : "--"}
                    </span>
                )

            },
            {
                title: '事件类型',
                dataIndex: 'event_type',
                align: "left",
                width: "10%",
                render: (text, data) => (
                    <span>
                        {data.event_type == 1 ? "临时性事件" : "周期性事件"}
                    </span>
                )
            },
            {
                title: '事件状态',
                dataIndex: 'event_status',
                align: "left",
                width: "10%",
                render: (text, data) =>  trans(data)

            },
            {
                title: '负责人',
                dataIndex: 'event_users',
                align: "left",
                width: "10%",
                ellipsis: true,
                render: (text, data) => (
                    
                    <Tooltip   placement="topLeft"  title={data.event_users}>
                        <span>
                        {data.event_users}
                        </span>   
                    </Tooltip>
                    
                )
               
            },
            {
                title: 'oncall工单号',
                dataIndex: 'oncall_id',
                align: "left",
                width: "10%",
                ellipsis: true,
                render: (text, data) => (
                    <span>
                        <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${text}`} target="_blank"> 
                         {text} 
                        </a>
                        {text ? "" : "---"}
                    </span>
                )
               
            },
            {
                title: '预估容量',
                dataIndex: 'capacity_pre_value',
                align: "left",
                width: "10%",
                 
               
            },
            {
                title: '真实容量',
                dataIndex: 'true_max_value',
                align: "left",
                width: "10%",
               
            },
              {
                title: '操作',
                width: "10%",
                align: "left",
                render: (text, data) =>  buttons(data)
              },
        ]


 

        return (
            <div id="listlist"> 
                   <Card title="事件运营" bordered={false}  > 
                   <div className="btnwrap">
                    
                        <Button className="rightbtn" onClick={() => this.goback()}   type="primary" > 返回 </Button>
                    </div>
                   
                 

                            <Row>
                                <Col span={7}>

                                    <label> 事件状态 ：</label>
                                    <Select defaultValue="" style={{ width: 170 }} onChange={this.handleChanges}>
                                        <Option key="ozero" value="">  全部 </Option>
                                        <Option key="ozero1" value="1">  准备中 </Option>
                                        <Option key="ozero2" value="2">  活动中 </Option>
                                        <Option key="ozero3" value="3">  已结束 </Option>
                                        
                                    </Select>
                                </Col>
                                
                                <Col span={9}>

                                    
    
                                        <RangePicker  
                                         ranges={{
                                            '当天': [moment().startOf('day'), moment().endOf('day')],
                                            '近一周': [moment().subtract(7, 'days').startOf('day'), moment().endOf('day')],
                                            '近一个月': [moment().subtract(30, 'days').startOf('day'), moment().endOf('day')],
                                            '近三个月': [moment().subtract(90, 'days').startOf('day'), moment().endOf('day')]
                                        }}
                                        format="YYYY-MM-DD HH:mm:ss" 
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                                        onChange={this.onChangetm}   
                                        onOk={this.onOks}
                                    />

                                       
                                
                                </Col>
                                <Col span={8}>

                                    <Button type="primary"   onClick={this.check}>
                                        查询
                                    </Button>
                                   
                                </Col>
                            </Row>



                            {this.state.tabledt ? (
                                <Table dataSource={this.state.tabledt.length >= 1   ? this.state.tabledt : null} 
                                    columns={columns}
                                    onChange={this.onChange}
                                    
                                    defaultExpandAllRows={true}
                                    rowKey="id"
                                    pagination={{  
                                        total: this.state.total, 
                                        pageSize: this.state.pageSize, 
                                        current: this.state.current,
        

                                    }}
                                    scroll={{ y:  this.state.wheight  }}
                                    
                                />
                            ) : (
                                <div className="flowertrans">  <Spin indicator={antIcon} />  </div>
                            )

                            }

                    </Card>

                    
            </div>
        )
    }
    
}

export default withRouter(EventListAuto);