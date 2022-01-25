import React from 'react';
import { withRouter } from 'react-router-dom';

import { Select, Card, Row, Col, DatePicker, Button, Table, Tooltip, Modal, notification, Tabs  } from 'antd';
 

import axios from "axios";
import moment from 'moment';



import CreateEvent from './CreateEvent.js'

import {  APIURL } from '../../common/constdt.js'


const { TabPane } = Tabs;

const { Option } = Select;
const { RangePicker } = DatePicker;
 


 
class EventList extends React.Component {

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
            event_type: 2,
          
        }
    
        this.openCreate = this.openCreate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.check = this.check.bind(this)
      
        this.handleChanges = this.handleChanges.bind(this)
        this.onChangetm = this.onChangetm.bind(this)
 
        this.refreshlista = this.refreshlista.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.delreal = this.delreal.bind(this)
        this.callback = this.callback.bind(this)
    
        this.wrapper = React.createRef();

        

    }

    
    

    componentDidMount() {
       
        this.agetRates(0)
         
        this.eventlist();
        this.getnm()
        this.cookie_user()
     
    }


    callback(key) {
        
        console.log(key);
        console.log('event_type change gose here')
        this.setState({
            event_type: key
        })
        this.callagetRates(0, key)
         
    }


    async cookie_user(){
        const urlsx = `${APIURL}/cookie_user/cookies_staff_helper`;

        await axios.get(urlsx, { withCredentials: true })
            .then(function(r){
                console.log(r)
            })
            .catch(function(er){
                console.log(er)
            })
    }

    async getnm(){
        // https://iwiki.woa.com/pages/viewpage.action?pageId=602598584
        // it seems this do not work, why
        // it works only online, do not work localhost
        let that = this;
        await axios.get("/ts:auth/tauth/info", { withCredentials: true })
            .then(function(r){
                console.log(r)
                document.cookie=`EngName=${r.data.EngName}`;
                console.log(document.cookie);
                that.setState({
                    EngName: r.data.EngName
                })

            })
            .catch(function(er){
                console.log(er)
            })
    }

    async eventlist (){

        this.setState({
            pidlists: null,
            
        })
        const urlsx = `${APIURL}/eventInfo/queryPid`;

        

        let that = this
        await axios.get(urlsx, { 
            withCredentials: true  
        })
            .then(function (response) {
              
                if (response.data) {
                    that.setState({
                        
                        pidlists: response.data.pid_list,
                        
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })

    }
    
    async callagetRates (t,z){
         
        this.setState({
            tabledt: null,
            total: null

        })

        const urlsx = `${APIURL}/eventInfo/getEventList`;

        console.log("state.event_type called gose here, don't change, why")
        console.log(this.state.event_type)

        let that = this
        await axios.get(urlsx,{
            withCredentials: true,
            params: {
                event_status: z == 1 ? that.state.status : null,
                event_type: z,
                start_time: that.state.startTime,
                end_time: that.state.endTime,
                page: t,
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
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })

           
    }


    async agetRates (t){
  
        this.setState({
            tabledt: null,
            total: null

        })
        const urlsx = `${APIURL}/eventInfo/getEventList`;

       
        let that = this
        await axios.get(urlsx,{
            withCredentials: true,
            params: {
                event_status: that.state.status,
                event_type: that.state.event_type,
                start_time: that.state.startTime,
                end_time: that.state.endTime,
                page: t,
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
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })

           
    }


    async  detailgetsx(data) {

        console.log(data)
            
        const urls = `${APIURL}/eventInfo/getEventList`;
       
        let that = this
        await axios.get(urls, {
            withCredentials: true,
            params: {
                pid: data.id,
                event_type: this.state.event_type,
            }
        })
            .then(function (response) {
               
                
                var tempt = [];
                if (response.data) {

                    for(let i = 0; i < that.state.tabledt.length; i++){
                        
                        if(data.id === that.state.tabledt[i].id){
                            if(response.data.data.length >=1){
                                that.state.tabledt[i].children = response.data.data
                            }   
                            
                        }   
                        tempt.push(that.state.tabledt[i])
                    }

                    that.setState({
                        
                        tabledt: tempt,
                         

                    })
                     
                }

              

            })
            .catch(function (error) {
                console.log(error);
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })




       
    }


    openCreate() {
        this.setState({
            visible: true,
        })
    }


  
    onChange(t) {
        
        console.log(t);
        this.setState({
            current: t.current,
            pageSize: t.pageSize,
        })
       this.agetRates(t.current)
        console.log(this.state)
       
    }

 
    handleChanges(v){
         
        console.log(v)
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
        this.agetRates(this.state.current)
    }
 
    onChangetm(ts, ta){
        console.log(ts,ta)
        this.setState({
         startTime: ta[0], 
         endTime: ta[1], 
         
     })
      
    }


    refreshlista(){
       
       
        this.agetRates(0)
    }

    gototest (v){
        console.log(v)

        this.props.history.push({
            pathname: "CapacityDetail",
            search: "id="+1,
            state: {id: 1}
         }); 

    }
    handleCancel(){
        this.setState({
             
            delisModalVisible: false,
        })
    }
    handleOk(){
        console.log('del')
        console.log(this.state.deleteid)
        this.delreal()
    }
    

    async rdeletetnomodal(v){
        
        console.log(v)

        const url = `${APIURL}/eventInfo/deleteEvent`;

        let bodyFormData = new FormData();

   
        bodyFormData.append("id", v.id);

        let that = this

        await axios.post(url, bodyFormData, { withCredentials: true })
       
            .then(function (response) {
              
                if (response.data.code == 0) {
                   
                    notification.success({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });


                    that.agetRates(0)
                    that.setState({
                        
                        delisModalVisible: false 

                    })
                } else {
                   
                    notification.error({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        duration: 60,
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });

                }



            })
            .catch(function (error) {
                console.log(error);
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })
    }
    async delreal(){
       
        const url = `${APIURL}/eventInfo/deleteEvent`;

        let bodyFormData = new FormData();

   
        bodyFormData.append("id", this.state.deleteid);

        let that = this

        await axios.post(url, bodyFormData, { withCredentials: true })
       
            .then(function (response) {
              
                if (response.data.code == 0) {
                   
                    notification.success({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });


                    that.agetRates(0)
                    that.setState({
                        
                        delisModalVisible: false 

                    })
                } else {
                   
                    notification.error({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        duration: 60,
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });

                }



            })
            .catch(function (error) {
                console.log(error);
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })
    }
   
    render(){

      const deletetnomodal = (v) => {
          this.rdeletetnomodal(v)
      }

        const   deletets = (v) => {
            console.log(v)
            console.log(v.id)
            this.setState({
                deleteid: v.id,
                delisModalVisible: true,
            })
            
        }
    
        const   bgChange = (visible) => {
            this.setState({
                visible: visible
            })
        }

       const agotocapacity = (vt) => {
       
 

            this.props.history.push({
                pathname: "CapacityDetail",
                search: "id="+vt,
                state: {id: vt}
             }); 
        }

        const handleDetailchild = (data) => {
           
            
           
            this.props.history.push({
               pathname: "CapacityChildDetail",
               search: "id="+data.id,
               state: {id: data.id}
            }); 
        }


        const subhandleDetail = (data) => {
            console.log(data)
            this.detailgetsx(data)
        }

        const handleDetail = (data) => {
           
           
           
            this.props.history.push({
               pathname: "EventDetail",
               search: "id="+data.id,
               state: {id: data.id}
            }); 
        }

        const handleDetailcap = (data) => {
            
            this.props.history.push({
                pathname: "CapacityDetail",
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
            
           
            if(v.event_type == 2){

            

                return  <span>

                    {v.pid == 0 ? (
                         <Button type = "primary"  size = "small"
                         onClick = {() => handleDetailcap(v)}
                         >
                            详情
                         </Button>
                    ): (
                        <Button type = "primary"  size = "small"
                        onClick = {() => handleDetailchild(v)}
                        >
                            详情
                        </Button>
                    )}
                      
                      <Button type = "primary"  size = "small"
                        onClick = { ()=> deletetnomodal(v) }
                        >
                            删除
                        </Button>
                    </span>


            }  else if(v.event_type == 1){
                  return  <span>
                      {v.pid == 0 ? (
                           <Button type = "primary"  size = "small"
                           onClick = {() => handleDetail(v)}
                           >
                           详情
                           </Button>
                      ):(
                        <Button type = "primary"  size = "small"
                            onClick = {() => handleDetailchild(v)}
                        >
                            详情
                        </Button>
                      )}
                       
                       <Button type = "primary"  size = "small"
                        onClick = {() => deletets(v)}
                        >
                            删除
                        </Button>
                    </span>
            }  
        }
  
          

        const columns = [
            {
                title: '事件id',
                dataIndex: 'id',
                width: "100px",
                align: "center",
                render: (text, data) => (
                    <div className="nameclickd"> 
                        {data.pid == 0 && !data.children && data.child_status ? (
                            <button type="button" className="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed"  onClick = {() => subhandleDetail(data)} ></button>
                            
                        ):("")
                        }
                       
                     
                      <span>
                      {data.id}
                     </span> 
                        
                     
                    </div>
                )

            },
            {
                title: '事件名',
                dataIndex: 'event_name',
                align: "left",
                width: "16%",
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
                width: 220,
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
                width: 220,
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
                width: 120,
                render: (text, data) => (
                    <span>
                        {data.event_type == 1 ? "手动运营事件" : "自动推送事件"}
                    </span>
                )
            },
            {
                title: '事件状态',
                dataIndex: 'event_status',
                align: "left",
                width: 150,
                render: (text, data) =>  trans(data)

            },
            {
                title: '负责人',
                dataIndex: 'event_users',
                align: "left",
                width: "16%",
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
                title: '操作',
           
                width: 170,
                align: "left",
                render: (text, data) =>  buttons(data)
              },
        ]


 

        return (
            <div id="listlist"> 
                   <Card title="事件运营" bordered={false}  > 
                        
                   
                    <div id="eventlistspecialbtns">
                        <Button type="primary"  onClick={this.openCreate}>
                            创建事件
                        </Button>

                    </div>
                    
                       

                    <Tabs defaultActiveKey="2" onChange={this.callback}>
                        
                        <TabPane tab="自动推送事件" key="2">
                        
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

                                    
                                />
                            ) : ("")

                            }

                        </TabPane>
                        <TabPane tab="手动运营事件" key="1">
                            

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
                                        
                                        format="YYYY-MM-DD HH:mm:ss" 
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                                        onChange={this.onChangetm}    
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

                                    
                                />
                            ) : ("")

                            }

                        </TabPane>
                    </Tabs>

                    


                   
                    </Card>
                    {this.state.pidlists ? (
                        <CreateEvent 
                        ref={this.wrapper}  
                        visible={this.state.visible}
                        tabledt={this.state.pidlists}
                    
                        openmodals={bgChange} 
                        gotocapacity={agotocapacity} 
                        refreshlist={this.refreshlista} />

                    ): ("")}
                    

                  
                    <Modal title={`提示`}
                        okText="删除"
                        visible={this.state.delisModalVisible} 
                        onOk={this.handleOk} 
                        onCancel={this.handleCancel}>
                        请确认该事件内扩容的容器都已经缩容完毕！
                    </Modal>
                    
            </div>
        )
    }
    
}

export default withRouter(EventList);