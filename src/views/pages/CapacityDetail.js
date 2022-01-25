
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Table, Row, InputNumber, Button, Col, Card, Form,   Select , Tooltip, Tabs, notification } from 'antd';

 
import {  CopyOutlined,  QuestionCircleOutlined, SyncOutlined  } from '@ant-design/icons';

import axios from "axios";

import { APIURL, APIURLnos } from '../../common/constdt.js'

import EditEventCapacity from './EditEventCapacity.js'
 
const { TabPane } = Tabs;

 

const { Option } = Select;


class CapacityDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            detail: null,
            capacitylist: null,
            unitcapacity: null,
            event_id: null,
            unit_capacity: null,
            num: null,
           
            link_list: [],
            filemap: false,
            mapdt: null,
            secondarray: [],
            originalsecond: [],
            link_id: null,
            link_idpinput: null,
            link_idblur: null,
            link_info: null,
            linklist: null,
        }

        this.eventchaine = this.eventchaine.bind(this)
        this.unitcapacity = this.unitcapacity.bind(this)
        this.eventInfoinput = this.eventInfoinput.bind(this)
        this.handleChangePevt = this.handleChangePevt.bind(this)
        this.callback = this.callback.bind(this)
         
    }


    componentDidMount() {

        this.eventchaine()

        const ts = this.props.location.search.replace("?id=","");
        this.setState({
            id: ts,
        })

        this.agetRates(ts)
        this.eventlist()

        this.onBlur = this.onBlur.bind(this)
        this.blurs = this.blurs.bind(this)
      
    }


    tabsclick(){
        console.log('icons')
    }

    callback(key) {
        console.log(key);

        // link_idpinput
        this.setState({
            link_idpinput: key,
        })

        for(let i = 0; i < this.state.linklist.length; i++){
            if(key == this.state.linklist[i].link_id){
                this.setState({
                    link_id: this.state.linklist[i].link_id,
                    link_info: JSON.stringify(this.state.linklist[i].link_info),
                    
                })
            }
        }
    }

    paste(){
      let tmpv =  `${APIURLnos}/eventInfo/createPushChild?pid=${this.state.detail.id}&capacity_pre_value=`
        navigator.clipboard.writeText(tmpv)
        console.log(tmpv)
      

        notification.success({
            message: '提示',
            description: '链接已复制',
            placement: 'topCenter',
            onClick: () => {
              console.log('Notification Clicked!');
            },
        });
    }


 

    async handleChangePevt(v){
        console.log(v)
       
        var bodyFormData = new FormData();
        bodyFormData.append("event_id", this.state.id);
        bodyFormData.append("pid", v);
        bodyFormData.append("event_type", this.state.detail.event_type);

        let url = `${APIURL}/eventInfo/update`;
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


    

    async eventchaine() {
        var ts = this.props.location.search.replace("?id=", "")
        const urls = `${APIURL}/capacity/list`;

        this.setState({
            event_id: ts
        })
        var that = this
        await axios.get(urls, {
            withCredentials: true,
            params: {
                event_id: ts
            }
        })
            .then(function (response) {
              

                if (response.data) {

                    var otsdata = response.data.data;
                

                    console.log(otsdata)

                    var tsdata = response.data.data;
                   
                    var toparr = []
                    var topseccond = []

                    if(tsdata.length == 0) {
                        return false;
                    }

                    that.setState({
                        link_id: tsdata[0].link_id,
                        link_info: JSON.stringify(tsdata[0].link_info),
                        linklist: tsdata,
                    })
                    
                    // first time

                    for(let i = 0; i < tsdata.length; i++){
                            
                        let  topobj = {};
                             topobj = tsdata[i];

                       
                        let fstarrst = []
                        
                        for(let j = 0; j < tsdata[i].list.length; j++){
                            let fstobj = {}
                         
                                fstobj = JSON.parse(JSON.stringify(tsdata[i].list[j]))
                             
                                let names =  tsdata[i].list[j].app_name + "." +  tsdata[i].list[j].server_name;
                                fstobj.namesa = names
                              
                                fstarrst.push(fstobj);
                        }
                        
                        topobj.list = fstarrst
                      
                         
                        console.log(fstarrst)
                     toparr.push(topobj)
                     topseccond.push(topobj)
                    
                }

                   
                    console.log('1, add names')
                    console.log(toparr)
                    console.log(topseccond)
                  

                    that.setState({
                        secondarray: toparr,
                       

                    })

                //  second time 
                  

                  let firstarray = []
                  let firstobjarray = []
          
                  
                 
                  for(let k = 0; k < topseccond.length; k++){
          
                      let firstobj = {}
                      let namesobj = {}
                       
                      firstobj = topseccond[k]

                      firstobj = Object.assign({}, topseccond[k]);

                      let firstlistarray = []
                      let firstuniqarr = []
                      let ofirstarr = []
          
                      for(let l = 0; l < topseccond[k].list.length; l++){
                          if(firstlistarray.indexOf(topseccond[k].list[l].namesa) == -1 ) {
                               let subpobj = {};
                               let subtmpobj = {}
          
                               firstlistarray.push(topseccond[k].list[l].namesa);
                               firstuniqarr.push(topseccond[k].list[l]);
          
                               subpobj = topseccond[k].list[l];
                               subtmpobj = Object.assign({}, subpobj);
                               subtmpobj.id = subtmpobj.id * 2 + 1;
                               subtmpobj.area = "--";
                               subtmpobj.now_num = 0;
                               subtmpobj.target_num = 0;
          
          
                               ofirstarr.push(subtmpobj);
                                
                          }
          
                      }
                      namesobj.list = firstlistarray
                      firstobj.list = ofirstarr;
                      firstobjarray.push(firstobj);
                      firstarray.push(namesobj)
                    }



                console.log("2");
                console.log(firstobjarray)
                console.log(firstarray);
                console.log(that.state.secondarray)
                console.log(topseccond)



                
                let endarray = []
                for(let n = 0; n < firstobjarray.length; n++){

                    let endobj = {}
                        endobj =  Object.assign({}, firstobjarray[n]);
                    let lastarr = []
                    for(let m = 0; m < firstobjarray[n].list.length; m++){


                        let tempar = []
                        let tempob = {}
                        tempob = firstobjarray[n].list[m]
                        let nnow_num = 0
                        let ntarget_num = 0;

                        for(let p = 0;  p < topseccond[n].list.length;p++){

                            if(firstobjarray[n].list[m].namesa == topseccond[n].list[p].namesa){
                                tempar.push(topseccond[n].list[p])
                                nnow_num += topseccond[n].list[p].now_num;
                                ntarget_num += topseccond[n].list[p].target_num

                            }
                        }

                        tempob.now_num = nnow_num;
                        tempob.target_num = ntarget_num;
                        tempob.rowspan = tempar.length;

                        if(tempar.length > 1){
                            tempob.children = tempar
                        }
                        
                        lastarr.push(tempob)

                    }
                    endobj.list = lastarr;
                    endarray.push(endobj)
                }

                console.log(endarray)


                that.setState({
                    capacitylist: endarray

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
                
                     
                    if(response.data.data.url_field && response.data.data.op_url){
                        that.eventInfofilemap(response.data.data.op_url)
                    }


                    that.setState({
                        
                        detail: response.data.data,
                        pid: response.data.data.pid,
                        unit_capacity: response.data.data.unit_capacity,
                        link_list: link_list,

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
            console.log(response)
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


    onFinish = (values) => {

        console.log('Success:', values);
    }

    unitcapacity = (v) => {
 
        console.log(this.state.link_idpinput)
       
        console.log(v)
        
    
        if(v == 0) {
            
            notification.error({
                message: '提示',
                description:  '不能填写 0 ！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });

             window.location.reload();

             
            return;
        } else {
            this.setState({
                unitcapacity: v,
                link_idblur: this.state.link_idpinput,
            })

           
        }
        
        
    }

   

    async eventInfoinput (v){
       
        console.log(v)
        console.log(this.state.link_idblur)

         
        const urls = `${APIURL}/eventInfo/newOnekeyWrite`;
        var bodyFormData = new FormData();
        bodyFormData.append("event_id", this.state.event_id);
        bodyFormData.append("unit_capacity", this.state.unit_capacity ? this.state.unit_capacity : 1);
        
        bodyFormData.append("event_id", this.state.event_id);
        bodyFormData.append("link_id", this.state.link_id);
        bodyFormData.append("link_info", this.state.link_info);
        bodyFormData.append("event_link_id", this.state.link_id);

        // if there's only one item, no tabs change
        
        if(v.link_id == this.state.link_idblur || this.state.linklist.length == 1) {
            bodyFormData.append("num", this.state.unitcapacity  );
        } else if(this.state.linklist.length != 1 && v.now_capacity_num != 0 ) {
            bodyFormData.append("num",   v.now_capacity_num );
        } else {
            bodyFormData.append("num", this.state.unitcapacity  );
            console.log(this.state.link_idblur);
            console.log(this.state.linklist.length);
        }   
        
        

        let that = this
       
        
        if(that.state.unitcapacity || v.now_capacity_num ) {

          
    
             
                await axios.post(urls, bodyFormData, { withCredentials: true })

           
                .then(function (response) {
                    console.log(response);
                    if(response.data.code == 0){
                        

                        notification.success({
                            message: '提示',
                            description: '填写成功',
                            placement: 'topCenter',
                            onClick: () => {
                              console.log('Notification Clicked!');
                            },
                        });

                  
                         that.eventchaine();
                    } else {
                        
                        notification.error({
                            message: '提示',
                            description:  response.data.msg,
                            duration: 60,
                            placement: 'topCenter',
                            onClick: () => {
                              console.log('Notification Clicked!');
                            },
                        });
                    }
 
                })
                .catch(function (error) {
                     
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
           
            notification.error({
                message: '提示',
                description: '当前容量不能为空！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
        }
        


    }


    edit(v){
        
        console.log(v)

        this.setState({
            visible: true,
        })
    }




    onBlur(v){
        console.log(v)
        this.setState({
            num: v
        })
        
    }
    async blurs(v){
        console.log(v)
        console.log(this.state.num)


        const url = `${APIURL}/capacity/update`;

        var bodyFormData = new FormData();
        bodyFormData.append("capacity_id", v.id);
        bodyFormData.append("num", this.state.num);
        bodyFormData.append("type", "target_num");
      
        let that = this;
       
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {
          
            
            if (response.data.code === 0) {
                  const ts = that.props.location.search.replace("?id=","");
                  that.agetRates(ts);
                  that.eventchaine();
                  
                notification.success({
                    message: '提示',
                    description: '修改成功',
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

 


    render() {

        const goback = () => {


            this.props.history.push({
                pathname: "EventList",

            });

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


        const columns = [
            {
                title: '服务名',
                dataIndex: 'server_name',
                align: "center",
                 
                render: (text, data) => (
                    <span>
                        {data.app_name + "."+ data.server_name }
                        
                    </span>
                       
                )
               
            },
             
           
            {
                title: 'set',
                dataIndex: 'set_name',
                align: "center",
                 
                render: (text, data) => (
                    <span>
                        {data.set_name ? data.set_name : "--"}
                    </span>
                )
            },
            {
                title: '地域',
                dataIndex: 'area',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.area ? data.area : "--"}
                    </span>
                    
                )
            },
            {
                title: '当前台数',
                dataIndex: 'now_num',
                align: "center",
                 
                render: (text, data) => (
                    <div>
                      
                        {data.children ? (
                            <span>
                            {data.now_num}
                            </span> 
                        ): (
                                
                            <span>
                                {data.now_num}
                            </span> 
                        )}
                    </div>             
                )
            },
            {
                title: '单位容量机器台数',
                dataIndex: 'target_num',
               
                align: "center",
                render: (text, data) => (
                    

                //    <InputNumber defaultValue={data.target_num}  placeholder={data.target_num}  onChange={this.onBlur}  onBlur={()=>this.blurs(data)} />
                
                   <div>
                        {data.children ? (
                          <span>
                             {data.target_num}
                          </span> 
                        ): (
                              
                          <span>
                              <InputNumber defaultValue={data.target_num}  placeholder={data.target_num}  onChange={this.onBlur}  onBlur={()=>this.blurs(data)} />
                              
                          </span> 
                        )}
                    </div>
                )

            },

        ];


        return (
            <div  id="capacitycontainer">
            {this.state.id  && this.state.detail ? (

            <Card title="容量模版" bordered={false}  >
            
                <div className="btnwrap">
                    <Button className="rightbtn" onClick={() => goback()}  type="primary"> 返回 </Button>

                    <Button className="rightbtn"  onClick={() => this.edit(this.state.detail)}  disabled={!this.state.detail.is_edit} type="primary" > 编辑 </Button>

                </div>
                    



                    <div className="detailwrap">
                   

                   <Row>
                       <Col span={8}>
                           事件类型：
                           { this.state.detail.event_type == 1 ? "手动运营事件" : "自动推送事件" }
                           
                       </Col>
                       <Col span={8}>
                      
                           <span className="namelength440">
                            事件名称：
                            <Tooltip  placement="topLeft"  title={this.state.detail.event_name}>
                                {  this.state.detail.event_name  ?  this.state.detail.event_name: "--"}
                            </Tooltip>
                            </span>
                       
                       </Col>
                       <Col span={8}  className="specialsp">
                            {  this.state.detail.is_edit ? (
                               <span>
                                    <label>
                                        父事件：
                                    </label>
                                           
                                      
                                        {this.state.detail.event_type == 1 ? (
                                            <Select
                                            placeholder="--"
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
                                    
                                        ): (
                                            <Select
                                               placeholder="--"
                                               defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                               disabled
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
                                       
                                        )}
                                           



                               </span>
                           ):(
                               <span> 
                                     <label>
                                     父事件：
                                     </label>
                                   <Select
                                   placeholder="--"
                                   defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                   disabled
                                   >
                                       { this.state.pid != 0 &&  this.state.tabledt ? (
                                               
                                               this.state.tabledt.map(function(itm){
                                                   return (
                                                       <Option value={itm.id} key={itm.id}> {itm.event_name} </Option>
                                                   )
                                               }) 
                                               
                                           ):(
                                               <Option value="null"> -- </Option>
                                           )}
                                           
                                   </Select>
                                    
                               </span>
                           )
                           }

                   </Col>
                   </Row>
                   <Row>
                       <Col span={8}>
                            容量指标：
                            {  this.state.detail.capacity_quota  ? this.state.detail.capacity_quota : "--" }
                       </Col>
                       <Col span={8}>
                          单位容量：
                          { this.state.detail.unit_capacity   ?  this.state.detail.unit_capacity : "--" }
                       </Col>
                       <Col span={8} className="specialsp">
                           <label>
                           扩容最大比例(%):

                           </label>
                        
                            {  this.state.detail.expand_max_rate  ? this.state.detail.expand_max_rate : "--" }
                       </Col>
                      
                   </Row>
                   <Row>
                      
                   <Col span={8}>
                           
                           
                           {this.state.detail.reduce_type == 1 ? "缩容延时：" : "缩容时间："}
                           {this.state.detail.reduce_type == 1 ? (
                                 this.state.detail.delay_time   ? this.state.detail.delay_time +" 小时" : "--" 
                           ):(
                                this.state.detail.reduce_time   ? "每天 " + this.state.detail.reduce_time : "--" 
                           )}
                          
                          
                            
                       </Col>
                       <Col span={8}>
                            <span className="namelength440">

                                负责人：
                                <Tooltip  placement="topLeft"  title={this.state.detail.event_users}>
                                    <span>
                                    {this.state.detail.event_users ? this.state.detail.event_users : "--"}
                                    </span>
                                </Tooltip> 
                           </span>
                       </Col>
                    </Row>
                    <Row>
                       <Col span={24}>
                          <div className="leftflt">
                          <span>
                            推送接口
                          </span>
                          <Tooltip  title="该接口发生推送事件时调用，pid 是事件id, capacity_pre_value 为容量指标的预估值">
                                
                               
                                <QuestionCircleOutlined />

                         </Tooltip>
                          ：
                          {`${APIURLnos}/eventInfo/createPushChild?pid=${this.state.detail.id}&capacity_pre_value=`}
                         </div> 

                         
                            <div>
                            <CopyOutlined onClick={()=>this.paste()} />
                            <span id="capacitydetailhref">
                               <span>
                                如有疑问，
                                </span> 
                                <a target="_blank"  rel="noreferrer"  href="https://iwiki.woa.com/pages/viewpage.action?pageId=1132901248">点击查看文档</a>
                            </span>
                            </div>
                           
                          
                       </Col>
                   </Row>

               </div>



                    <Row>
                    <Col span={24}>
                        <div className="title">
                            <span>
                                容量模版：
                                {this.state.detail.capacity_quota ? (
                                   <span>
                                       容量指标为
                                       <strong>
                                       「{this.state.detail.capacity_quota}」
                                        </strong>，单位容量为
                                        <strong>
                                        「{this.state.detail.unit_capacity}」
                                        </strong> 时的容量标准
                                   </span> 
                                ):("")
                                }
                                
                            </span>
                                 
                                 
                        </div>
                        </Col>
                      
                    </Row>

                              

                    <Form
                        name="basicx"


                        onFinish={this.onFinish}

                        autoComplete="off"

                    >




                   

                    {this.state.capacitylist && this.state.capacitylist.length >= 1 ? (
                        
                        <div>
                             <Tabs defaultActiveKey="1" onChange={this.callback}> 
                              { this.state.capacitylist.map((item) => {


                                return (
                                <TabPane
                                tab={
                                    <span>
                                        <Tooltip title={item.link_all_name}>

                                       
                                        <SyncOutlined   onClick={this.tabsclick()} />
                                        {item.link_name}
                                        </Tooltip>
                                    </span>
                                  }
                                   
                                key={item.link_id}>

 
                                                        
                                    <Row>
                                    <Col span={24}>
                                         <div className="leftdivs">
                                                <div id="wrapx">
                                                    <span>
                                                    根据当前容量
                                                    </span>
                                                    <Tooltip  title="通过填写当前容量，平台通过当前机器数来计算每个模块的单位容量机器台数">
                                                    
                                                        <QuestionCircleOutlined />

                                                    </Tooltip>
                                                    <span>
                                                        :
                                                    </span>
                                                
                                                </div>
                                
                                             

                                    
                                        <InputNumber defaultValue={item.now_capacity_num}  onChange={ this.unitcapacity }  key={item.link_id} />
                                        <Button type="primary" size="small" onClick={ () => this.eventInfoinput( item )}> 一键填写 </Button>
                                        <span id="btntipsx"> 单位容量机器台数 </span>
                                        </div>
                                        </Col>
                                    </Row>
                                  
                                    <Table

                                        columns={columns}
                                        rowKey="id"
                                        expandable={{
                                            defaultExpandAllRows: true,
                                        }}
                                        dataSource={item.list}
                                        pagination={{  
                                            total: item.list.length, 
                                            pageSize: item.list.length, 
                                            
                                            pageSizeOptions:[item.list.length],
                                            

                                        }}

                                        />


                                </TabPane>
                                )


                                })
                            }

                            </Tabs>
                        </div>


                    ):("--")}
                       
                    

                       

                          
                      
                    </Form>
                
                    
            </Card>


        ) : ("")}

                <EditEventCapacity 
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





export default withRouter(CapacityDetail);