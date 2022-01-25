import React from 'react';
import { withRouter } from 'react-router-dom';

import {    Card,  Button, Table, Tooltip, Modal, notification,  Spin  } from 'antd';
 
import { LoadingOutlined } from '@ant-design/icons';

import axios from "axios";
 



import CreateEvent from './CreateEvent.js'

import {  APIURL } from '../../common/constdt.js'

 

 
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

 
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
            autodelisModalVisible: false,
            event_type: 2,
            eventChainChildren: null,
            eventChain: null,
          
        }
    
        this.openCreate = this.openCreate.bind(this);
        this.onChange = this.onChange.bind(this);
      
      
      
      
       
 
        this.refreshlista = this.refreshlista.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.autohandleCancel = this.autohandleCancel.bind(this)
        this.autohandleOk = this.autohandleOk.bind(this)
        this.delreal = this.delreal.bind(this)
       
        this.check = this.check.bind(this)
      

        this.wrapper = React.createRef();

        

    }

    
    

    componentDidMount() {
       
        this.agetRates(0)
         
        this.eventlist();
        this.getnm()
        this.cookie_user()
     
    }


   

    async cookie_user(){
        const urlsx = `${APIURL}/cookie_user/cookies_staff_helper`;

        await axios.get(urlsx, { withCredentials: true })
            .then(function(r){
                
            })
            .catch(function(er){
                
            })
    }

    async getnm(){
        
        let that = this;
        await axios.get("/ts:auth/tauth/info", { withCredentials: true })
            .then(function(r){
                
                document.cookie=`EngName=${r.data.EngName}`;
                
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
               
            })

           
    }

     
    async statusagetRates (t){
  
        this.setState({
            tabledt: null,
            total: null

        })
        const urlsx = `${APIURL}/eventInfo/getEventList`;

       
        let that = this
        await axios.get(urlsx,{
            withCredentials: true,
            params: {
                event_status: t ? t : null,
                event_type: that.state.event_type,
                start_time: that.state.startTime,
                end_time: that.state.endTime,
                page: 0,
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

    async typeagetRates (start_time, end_time){
  
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
                start_time: start_time,
                end_time: end_time,
                page: 0,
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


    async  detailgetsx(data) {

        let tmpbjs = {
            capacity_pre_value: null,
            capacity_quota: "",
            delay_time: 0,
            end_time: "",
            event_desc: null,
            event_name: null,
            event_status: null,
            event_type: null,
            event_users: "",
            expand_max_rate: null,
            id: "more",
            is_del: 0,
            op_pre_value: 0,
            op_quota: 0,
            op_url: null,
            pid: '',
            reduce_time: "",
            reduce_type: null,
            start_time: "",
            unit_capacity: 0,
            url_field: null,
            webhook: "",
        }

       
            
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

                            if(response.data.data.length == 5){
                                tmpbjs.pid = response.data.data[4].pid;
                                tmpbjs.event_type = response.data.data[4].event_type;
                                that.state.tabledt[i].children.push(tmpbjs)
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
                
            })




       
    }


    async newagetRates() {

        const urlsx = `${APIURL}/capacity/newMenu`;

        let that = this;
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


    openCreate() {

        

        this.newagetRates()
        
    }


  
    onChange(t) {
        
        
        this.setState({
            current: t.current,
            pageSize: t.pageSize,
        })
       this.agetRates(t.current)
       
       
    }

 
    
   
    check(){
        this.agetRates(this.state.current)
    }
 

    

   
    

    

    refreshlista(){
       
      
        this.agetRates(0)
    }

    gototest (v){
       

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
        
        this.delreal()
    }
    

    autohandleCancel(){
        this.setState({
             
            autodelisModalVisible: false,
        })
    }
    autohandleOk(){
        
        this.rdeletetnomodal()
    }
    

    async rdeletetnomodal(){
        
        

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
                        
                        autodelisModalVisible: false 

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
               
            })
    }
   
    render(){

      const deletetnomodal = (v) => {
          
          this.setState({
            deleteid: v.id,
            autodelisModalVisible: true,
        })
         
      }

        const   deletets = (v) => {
           
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

        const morethanfinve = (data) => {
             
            
            window.open (window.location.protocol + "//" + window.location.host+`/#/EventListAuto?pid=`+data.pid + "&event_type=" + data.event_type)
        }
        const subhandleDetail = (data) => {
           
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

            document.cookie = "url_address=EventList";
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

            

                return  <span  className="opbtngrp">

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
                  return  <span   className="opbtngrp">
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
                align: "right",

                render: (text, data, index) => {

                    const obj = {
                        children: data.event_name ? text : <Button type="link" onClick={ () => morethanfinve(data) }> 查看更多 </Button>,
                        props: {},
                      };

                      if(data.pid == 0 && !data.children && data.child_status) {
                          return  <div  className="nameclickd">
                                     
                                
                                        <button type="button" className="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed"  onClick = {() => subhandleDetail(data)} ></button>
                                        
                                        <span>
                                            {data.id}
                                        </span> 
                                     
                                </div>
                            
                           

                      }

                     if ( !data.event_name ) {
                        obj.props.colSpan = 8;
                       
                         
                      }
                       
                      return obj;
                }

                
              

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
                        {data.event_type == 1 ? "临时性事件" : "周期性事件"}
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
                   <Card title="周期性事件" bordered={false}  > 
                        
                   
                   <div className="btnwrap">
                        <Button type="primary"  onClick={this.openCreate}>
                            创建事件
                        </Button>

                    </div>
                    
                       

                    
                        
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
                            ) : (
                                <div className="flowertrans">

                                        <Spin indicator={antIcon} />
                                </div>
                            )

                            }

                       

                    


                   
                    </Card>
                    {this.state.pidlists ? (
                        <CreateEvent 
                        ref={this.wrapper}  
                        visible={this.state.visible}
                        tabledt={this.state.pidlists}
                        eventChainChildren = {this.state.eventChainChildren}
                        eventChain = {this.state.eventChain}
                        openmodals={bgChange} 
                        gotocapacity={agotocapacity} 
                        refreshlist={this.refreshlista} />

                    ): ("")}
                    

                        {/* autodelisModalVisible */}

                     <Modal title={`提示`}
                        okText="删除"
                        visible={this.state.autodelisModalVisible} 
                        onOk={this.autohandleOk} 
                        onCancel={this.autohandleCancel}>
                       确认删除吗？
                    </Modal>


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