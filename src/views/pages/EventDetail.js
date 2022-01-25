import React from 'react';
import { Tabs, Card, Row, Col, Button, Select, InputNumber, notification, Tooltip, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import {  LoadingOutlined  } from '@ant-design/icons';

import axios from "axios";


import CheckList from './CheckList'  
import IasDetail from  './IasDetail'

 
import StaticResource from './StaticResource'
import OTTDetail from './OTTDetail'
// import OTTDetail from './OTTDetail/OTTDetail';
import RedisDetail from  "./RedisDetail"
import StreamingMedia from "./StreamingMedia"

import {  APIURL } from '../../common/constdt.js'

import { EditOutlined }  from '@ant-design/icons';
import EditEvent from './EditEvent.js'

const { TabPane } = Tabs;

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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

        var url = new URL(url_string);
     
        
        var id = url.searchParams.get("id");
       
       
        this.setState({
            id: id,
        })

        this.agetRates(id)
        this.eventlist()
        this.getnm()
    }



    
    async getnm(){

        var that = this
        await axios.get("/ts:auth/tauth/info", { withCredentials: true })
            .then(function(r){
            
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
              
           
            })
        }

       

    }
    async eventlist (){

        this.setState({
            tabledt: null,
            

        })
        const urlsx = `${APIURL}/eventInfo/queryPid`;

        

        var that = this
        await axios.get(urlsx, 
            { withCredentials: true,
                params: {
                
                    event_type: 1,
                } 
            })
            .then(function (response) {
              
                if (response.data) {
                    that.setState({
                        
                        tabledt: response.data.pid_list,
                        
                    })
                }



            })
            .catch(function (error) {
                console.log(error);
                
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
           
             
           })
            
        } else {
            console.log("blank url")
        }
        
           
     }


    async agetRates (t){

        this.setState({
                        
            detail: null,
            
        })
      
        const urlsx = `${APIURL}/eventInfo/detail?event_id=${t}`;

        var that = this
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {
              
                if (response.data) {
                    
                    let link_list = []
                    if(response.data.data.link_list && response.data.data.link_list.length >=1){
                        for(let i = 0; i < response.data.data.link_list.length;i++){
                            let tp = [response.data.data.link_list[i].cateName, response.data.data.link_list[i].pName, response.data.data.link_list[i].subName];
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
                
            })
    }


    callback(key) {

       
      
        this.setState({
            defaultActiveKey: key,
        })
        if(key == "checklist"){
          

            this.refs.checklists.cklists()
        }
    }


    goback() {

       
        console.log(this.state.detail)
       
        if(this.state.detail.event_type == 1){
            this.props.history.push({
                pathname: "EventListHand",
               
             }); 
        }else {
            this.props.history.push({
                pathname: "EventList",
               
             }); 
        }
        

    }

    edit(v){
        
        this.newagetRates()
        
        console.log(v)
    }

    
    async newagetRates() {

        const urlsx = `${APIURL}/capacity/newMenu`;

        var that = this;
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {


              

                let array_one = []
                if (response.data.code == 0) {

                    that.setState({
                        eventChain: response.data.data

                    })

                    for (let h = 0; h < response.data.data.length; h++) {
                        let obj_one = {}
                        obj_one.label = response.data.data[h].cateName;
                        obj_one.value = response.data.data[h].cateName;
                        obj_one.children = []
                        array_one.push(obj_one)


                        let array_two = []
                        if (response.data.data[h].menu) {

                            for (let j = 0; j < response.data.data[h].menu.length; j++) {
                                let obj_two = {}
                                obj_two.label = response.data.data[h].menu[j].pName;
                                obj_two.value = response.data.data[h].menu[j].pName;

                                array_two.push(obj_two)



                                let array_three = []


                                if (response.data.data[h].menu[j].menu && response.data.data[h].menu[j].menu.length >= 1 && response.data.data[h].menu[j].menu[0].link_id) {

                                    for (let k = 0; k < response.data.data[h].menu[j].menu.length; k++) {
                                        let obj_three = {}
                                        obj_three.label = response.data.data[h].menu[j].menu[k].subName;
                                        obj_three.value = response.data.data[h].menu[j].menu[k].subName;
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
                     
                        
                        that.setState({
                            eventChainChildren: array_one,
                            visible: true,

                        })
                    }




                }

            })
            .catch(function (error) {
                console.log(error);
                
            })
    }
   


    render() {
        

        const clsbgChange = (visible) => {
            this.setState({
                visible: visible
            })
        }

        const   bgChange = (visible) => {

           
            
            this.setState({
                visible: visible
            })

            this.agetRates(this.state.id)
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
                          <label>
                          事件类型：
                          </label>  {  this.state.detail.event_type == 1 ? "临时性事件" : "周期性事件" }
                            
                        </Col>
                        <Col span={8}>
                          
                                <label>
                                事件名称：
                                </label>
                                
                                <span className="namelength440">
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

                        <label>活动时间：</label>{  this.state.detail.start_time ?   this.state.detail.start_time + "至"  : "-" } 
                            { this.state.detail.end_time ? this.state.detail.end_time : "-" }
                        </Col>
                        <Col span={8}>
                        <label>运营指标：</label>
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
                            <label>负责人：</label>
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
           
            ) : (
                <div className="flowertrans">  <Spin indicator={antIcon} />  </div>
            )}

            
                <EditEvent 
                        ref={this.wrapper}  
                        visible={this.state.visible}
                        detail={this.state.detail}
                        tabledt={this.state.tabledt}
                        link_list={this.state.link_list}
                        filemap={this.state.filemap}
                        mapdt={this.state.mapdt}
                        eventChainChildren = {this.state.eventChainChildren}
                        eventChain = {this.state.eventChain}
                        id={this.state.id}  
                        openmodals={bgChange} 
                        openmodalsocls={clsbgChange}
                        gotocapacity={agotocapacity} />

            </div>
        )
    }

}

export default withRouter(EventDetail);