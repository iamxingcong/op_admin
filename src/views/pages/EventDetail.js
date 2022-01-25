import React from 'react';
import { Tabs, Card, Row, Col, Button, Select, InputNumber, notification, Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';


import axios from "axios";


import CheckList from './CheckList'  
import IasDetail from  './IasDetail'

 
import StaticResource from './StaticResource'
import OTTDetail from './OTTDetail'
import RedisDetail from  "./RedisDetail"
import StreamingMedia from "./StreamingMedia"

import {  APIURL } from '../../common/constdt.js'

import { EditOutlined }  from '@ant-design/icons';
import EditEvent from './EditEvent.js'

const { TabPane } = Tabs;

const { Option } = Select;


class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            detail: null,
            defaultActiveKey: "checklist",
            pid: 0,
            tabledt: [],
            visible: false,
            vcapacityprevinput: true,
            link_list: [],
            filemap: false,
            mapdt: null,
            EngName: null,
        }
        this.callback = this.callback.bind(this)
        this.handleChangePevt = this.handleChangePevt.bind(this)
        this.capacityprevalue = this.capacityprevalue.bind(this)
        this.capacityprevinput = this.capacityprevinput.bind(this)
    }
 
    
  

    componentDidMount() {
      
       
        var url_string = window.location.href.replace(/\/#/g,"")
        console.log(url_string)
        var url = new URL(url_string);
        console.log(url)
        var id = url.searchParams.get("id");
       
       
        this.setState({
            id: id,
        })

        this.agetRates(id)
        this.eventlist()
        this.getnm()
    }

    
    async getnm(){
        // https://iwiki.woa.com/pages/viewpage.action?pageId=602598584
        // it seems this do not work, why
        // it works only online, do not work localhost
        var that = this
        await axios.get("/ts:auth/tauth/info", { withCredentials: true })
            .then(function(r){
                console.log(r)
                that.setState({
                    EngName: r.data.EngName
                })
            })
            .catch(function(er){
                console.log(er)
            })
    }

    //  receive value from child
    defaultk = (defaultkey) => {
        this.setState({
            defaultActiveKey: defaultkey,
        })
    }
    
    capacityprevinput(){
        this.setState({
            vcapacityprevinput: false
        })
    }
    async capacityprevalue(v){
      

       
        console.log(v)
      
        var bodyFormData = new FormData();
        bodyFormData.append("event_id", this.state.id);
        
        // op_pre_value or capacity_pre_value, it depends on event_type

        if(this.state.detail.event_type == 1){
            bodyFormData.append("op_pre_value", v.target.defaultValue * 10000 );
        } else if(this.state.detail.event_type == 2){
            bodyFormData.append("capacity_pre_value", v.target.defaultValue);
        } else {
           
            return false
        }
        
        bodyFormData.append("event_type", this.state.detail.event_type);

        let url = `${APIURL}/eventInfo/update`;
        let that = this
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {
            
            
            if(response.data.code === 0){
                 
                notification.success({
                    message: '提示',
                    description: response.data.msg,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });

                that.setState({
                    vcapacityprevinput: true
                })
            } else {
               
                notification.error({
                    message: '提示',
                    description: response.data.msg,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });


                that.setState({
                    vcapacityprevinput: true
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


    async handleChangePevt(v){
        console.log(v)
       
        var bodyFormData = new FormData();
        bodyFormData.append("event_id", this.state.id);
        bodyFormData.append("pid", v);
        bodyFormData.append("event_type", this.state.detail.event_type);

        let url = `${APIURL}/eventInfo/update`;
        let that = this;

        if(v == this.state.id){
            
            notification.error({
                message: '提示',
                description: '父事件不能为自己！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
           
            return false;
        } else {
            await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {
              
              if(response.data.code === 0){
                    
                that.agetRates(that.state.id);

                notification.success({
                    message: '提示',
                    description: '修改成功',
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });

              } else {
                  console.log(response)
                  

                notification.error({
                    message: '提示',
                    description: response.data.msg,
                    duration: 60,
                    placement: 'topCenter',
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

       

    }
    async eventlist (){

        this.setState({
            tabledt: null,
            

        })
        const urlsx = `${APIURL}/eventInfo/queryPid`;

        

        var that = this
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {
              
                if (response.data) {
                    that.setState({
                        
                        tabledt: response.data.pid_list,
                        
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


    async eventInfofilemap(e){
     
        let url = `${APIURL}/eventInfo/fieldMap`;
 
        var bodyFormData = new FormData();
        bodyFormData.append("url", e); 
        let that = this

        if(e && e.length >= 1){
            await axios.post(url, bodyFormData, { withCredentials: true })
           .then(function (response) {
           
            if(response.data.code == 0){
                that.setState({
                    filemap: true,
                    mapdt: response.data.data
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
            
        } else {
            console.log("blank url")
        }
        
           
     }


    async agetRates (t){

      
        const urlsx = `${APIURL}/eventInfo/detail?event_id=${t}`;

        var that = this
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {
              
                if (response.data) {
                    
                    let link_list = []
                    if(response.data.data.link_list && response.data.data.link_list.length >=1){
                        for(let i = 0; i < response.data.data.link_list.length;i++){
                            let tp = [response.data.data.link_list[i].cate, response.data.data.link_list[i].pType, response.data.data.link_list[i].subType]
                            link_list.push(tp)
                        }
                    }
                    
                    that.setState({
                        
                        detail: response.data.data,
                        pid: response.data.data.pid,
                        link_list: link_list,

                    })
                     
                    if(response.data.data.url_field && response.data.data.op_url){
                        that.eventInfofilemap(response.data.data.op_url)
                    }
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


    callback(key) {

       
        console.log(key);
        this.setState({
            defaultActiveKey: key,
        })
        if(key == "checklist"){
            console.log("checklist ____ p")

            this.refs.checklists.cklists()
        }
    }


    goback() {
       
        this.props.history.push({
            pathname: "EventList",
           
         }); 

    }

    edit(v){
        
        console.log(v)

        this.setState({
            visible: true,
        })
    }

    


    render() {
        

      

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




        return (<div>
             
            {this.state.id  && this.state.detail ? (
               
                <Card title="事件详情" bordered={false}  >
                    <div className="btnwrap">
                    
                    <Button className="rightbtn" onClick={() => this.goback()}   type="primary" > 返回 </Button>

                    <Button className="rightbtn"  onClick={() => this.edit(this.state.detail)}  disabled={!this.state.detail.is_edit} type="primary" > 编辑 </Button>


                    </div>
                    
                <div className="detailwrap">
                   

                    <Row>
                        <Col span={8}>
                            事件类型：{  this.state.detail.event_type == 1 ? "手动运营事件" : "自动推送事件" }
                            
                        </Col>
                        <Col span={8}>
                          
                                <span className="namelength440">
                                事件名称：
                                <Tooltip   placement="topLeft"  title={this.state.detail.event_name}>
                                    {  this.state.detail.event_name  ?  this.state.detail.event_name: "--"}
                                 </Tooltip>
                                </span>
                           
                        </Col>
                        <Col span={8}  className="specialspz">
                            <div>
                             {  this.state.detail.is_edit ? (
                                <span>
                                       <label>
                                            父事件：
                                        </label>
                                            <Select
                                                placeholder="---"
                                                defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                                onChange={this.handleChangePevt}
                                            >
            
                                            {this.state.tabledt ? (
                                                
                                                this.state.tabledt.map(function(itm){
                                                    return (
                                                        <Option value={itm.id} key={itm.id}> {itm.event_name} </Option>
                                                    )
                                                }) 
                                                
                                            ):(
                                                <Option value="null">   请选择 </Option>
                                            )}
                                            
                                        

                                        </Select>
                                        



                                </span>
                            ):(
                                <span> 
                                     <label>
                                      父事件：
                                    </label>
                                    <Select
                                    placeholder="---"
                                    defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                    disabled
                                    >
                                        { this.state.pid != 0 && this.state.tabledt  ? (
                                                
                                                this.state.tabledt.map(function(itm){
                                                    return (
                                                        <Option value={itm.id} key={itm.id}> {itm.event_name}  </Option>
                                                    )
                                                }) 
                                                
                                            ):(
                                                <Option value="null"> -- </Option>
                                            )}
                                            
                                    </Select>
                                     
                                </span>
                             
                            )}
                        </div>
                    </Col>
                    </Row>
                    <Row>
                        <Col span={8}>

                            活动时间：{  this.state.detail.start_time ?   this.state.detail.start_time + "至"  : "-" } 
                            { this.state.detail.end_time ? this.state.detail.end_time : "-" }
                        </Col>
                        <Col span={8}>
                            运营指标：
                            { 
                                 this.state.detail.op_quota == 1 ? "同时在线" : "qps"
                            
                            }
                        </Col>
                        <Col span={8}  className="specialspz">
                            <div>
                           <label> 预估值(万)：</label>
                            { 
                                this.state.detail.is_edit  ? 

                                    this.state.detail.event_type == 1 ? (
                                        <span>
                                            <InputNumber  defaultValue={this.state.detail.op_pre_value / 10000 } onBlur={this.capacityprevalue}  disabled={this.state.vcapacityprevinput} />
                                            
                                            
                                        <EditOutlined onClick={this.capacityprevinput}  />
                                        </span>
                                    ):(
                                        <span>
                                            <InputNumber  defaultValue={this.state.detail.capacity_pre_value} onBlur={this.capacityprevalue}  disabled={this.state.vcapacityprevinput} />
                                            
                                        <EditOutlined onClick={this.capacityprevinput}  />
                                        </span>
                                    )
                                        
                                
                                : <div> 
                                    {this.state.detail.event_type == 1 ? 
                                      <span>  { this.state.detail.op_pre_value ? this.state.detail.op_pre_value / 10000 : "--"} </span>
                                        :
                                        <span>  { this.state.detail.capacity_pre_value ?  this.state.detail.capacity_pre_value : "--"}  </span>
                                    }
                                       
                                  </div>
                             }

                           
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            负责人：
                            <Tooltip    placement="topLeft"  title={this.state.detail.event_users}>

                                {  this.state.detail.event_users  ? this.state.detail.event_users: "--"}

                            </Tooltip>
                             
                        </Col>

                    </Row>

                </div>

                <Tabs defaultActiveKey="checklist" activeKey={this.state.defaultActiveKey} onChange={this.callback} className="tabsdiv">
                    <TabPane tab="CheckList" key="checklist">
                        <CheckList id={this.state.id}  defaultkey={this.defaultk}      ref="checklists" />
                    </TabPane>
                    <TabPane tab=" ias详情 " key="ias">
                        <IasDetail id={this.state.id}  EngName={this.state.EngName}   />
                    </TabPane>
                    
                    <TabPane  tab="123详情" key="capacity">
                        <OTTDetail  id={this.state.id}    EngName={this.state.EngName}    />
                    </TabPane>
                    <TabPane  tab="Redis详情" key="redis">
                        <RedisDetail  event_id={this.state.id}  EngName={this.state.EngName}   />
                    </TabPane>
                    
                    <TabPane  tab="静态资源详情" key="static">
                        <StaticResource event_id={this.state.id}  EngName={this.state.EngName}   />
                    </TabPane>

                    
                    <TabPane  tab="流媒体详情" key="media">
                        <StreamingMedia  event_id={this.state.id}  EngName={this.state.EngName}   />
                    </TabPane>

                   

                </Tabs>

            </Card>
           
            ) : ("")}

            
                <EditEvent 
                        ref={this.wrapper}  
                        visible={this.state.visible}
                        detail={this.state.detail}
                        tabledt={this.state.tabledt}
                        link_list={this.state.link_list}
                        filemap={this.state.filemap}
                        mapdt={this.state.mapdt}
                        id={this.state.id}  
                        openmodals={bgChange} 
                        gotocapacity={agotocapacity} />

            </div>
        )
    }

}

export default withRouter(EventDetail);