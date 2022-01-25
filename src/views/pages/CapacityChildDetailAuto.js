
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Table, Row,   Button, Col, Card, Select, Tabs, Tooltip, Spin  } from 'antd';

 
import {   LoadingOutlined ,QuestionCircleOutlined, } from '@ant-design/icons';

import CtsdbGraph from './CtsdbGraph.js'
import CtsdbGraphMultiple from './CtsdbGraphMultiple.js'
import OperateUrlConfig from './OperateUrlConfig.js'

import axios from "axios";

import { APIURL } from '../../common/constdt.js'
 
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;
const { TabPane } = Tabs;

class CapacityChildDetailAuto extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            detail: null,
            capacitylist: null,
            tabcapacitylist: null,
            unitcapacity: null,
            event_id: null,
            unit_capacity: null,
            num: null,
           
            link_list: [],
            filemap: false,
            mapdt: null,
            confvisible: false,
          
            secondarray: [],
            originalsecond: [],
            link_id: null,
            link_idpinput: null,
            link_idblur: null,
            link_info: null,
            linklist: null,
            linkspin: null,
            cpname: "",
            wheight: 600,
        }

       
        this.tabeventchaine = this.tabeventchaine.bind(this)
      
        this.ctsdbGraph = this.ctsdbGraph.bind(this)
       
    }


    componentDidMount() {
        let wh =  window.innerHeight - 563;
        console.log(wh);
        this.tabeventchaine()
        const ts = this.props.location.search.replace("?id=","");
        this.setState({
            id: ts,
            wheight: wh,
        })

        this.agetRates(ts)
        this.eventlist()

    
      
    }

    

    callback(key) {
        console.log(key);
    }

    
    ctsdbGraph(v){
     
        console.log(v)
        this.setState({
 
            motlannua: v,
            graphxvisible: true,
        })
     

    }
    openurlcodepop(v) {
      
        console.log(v);
        this.setState({
            confvisible: true,
        })

    }

    async tabeventchaine() {
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
              

                if (response.data.code == 0) {

                    

                    let tsdata = response.data.data;
                   
                    that.setState({
                        linkspin: response.data.data,
                        tabcapacitylist: response.data.data
                    })

                    if(tsdata.length == 0) {
                        return false;
                    }

                    that.setState({
                        link_id: tsdata[0].link_id,
                        link_info: JSON.stringify(tsdata[0].link_info),
                        linklist: tsdata,
                    })
 
  

                }

          
                
 

            })
            .catch(function (error) {
                console.log(error);
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
            })
    }


    async agetRates (t){

      
        const urlsx = `${APIURL}/eventInfo/detail?event_id=${t}`;

        var that = this
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {
              
                if (response.data) {
                  
                    that.setState({
                        cpname: response.data.data.capacity_quota
                    })

                    let link_list = []
                    if(response.data.data.link_list && response.data.data.link_list.length >=1){
                        for(let i = 0; i < response.data.data.link_list.length;i++){
                             
                            let tp = [response.data.data.link_list[i].cateName, response.data.data.link_list[i].pName, response.data.data.link_list[i].subName]
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


    onFinish = (values) => {

        console.log('Success:', values);
    }

 
    
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }


 

    render() {


        const  configChange = (visible) => {
            this.setState({
                confvisible: visible,
            })
        }


        const   bgChange = (visible) => {
            this.setState({
                svisible: visible
            })
        }
        
        const   multipbgChange = (visible) => {
            this.setState({
                graphxvisible: visible
            })
        }
        
        const gobacktoP = () => {

             
            this.props.history.push({
                pathname: "CapacityDetail",
                search: "id="+this.state.detail.pid,
                state: {id: this.state.detail.pid}
             }); 

        }


        const goback = () => {
            
         
        
            this.props.history.push({
                    pathname: "EventListAuto",
                    search: "pid="+ this.state.detail.pid + "&event_type="+this.state.detail.event_type,
                    state: {id: this.state.detail.pid}
            });
          

        }
       

        function areasf(v){
             
            // console.log(v.area);
            // console.log(typeof v.area)
            // console.log(v.area.length)
            
            if(v.area.length > 1 && typeof v.area !== 'string'){
                return "--"
            } else if(v.area.length == 1) {
                return v.area[0]
            } else if(typeof v.area == 'string'){
                return v.area
            }
        }

        const columns = [
            {
                title: '服务名',
                dataIndex: 'server_name',
                align: "center",
                width: "16%",
                ellipsis: true,
                render: (text, data) => (
                    <Tooltip  placement="topLeft"  title= {data.app_name+"."+data.server_name}>
                    <span>
                      
                            
                   <a rel="noopener noreferrer"  href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app_name}&server=${data.server_name}`} target="_blank"> {data.app_name+"."+data.server_name}  </a>
                 
                    </span>
                    </Tooltip>
                    
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
                render: (text, data) =>  areasf(data)
            },
            {
                title: ()=>{
                    return (
                        <div className="tdtooltipx">
                            <Tooltip title="事件开始到结束这段时间每分钟CPU平均使用率最大值">
                                <QuestionCircleOutlined />
                            </Tooltip>
                           
                            CPU平均使用率
                        </div>
                    )
                    
                },
                dataIndex: 'max_cpu_by_time',
                align: "center",
                sorter: (a, b) => a.max_cpu_by_time - b.max_cpu_by_time,

                render: (text, data) => (
                    <span>
                        {data.max_cpu_by_time ? data.max_cpu_by_time.toFixed(2) : "--"}
                    </span>
                    
                )

            },
            {
                title:  ()=>{
                    return (
                        <div className="tdtooltipx">
                            <Tooltip title="事件开始到结束这段时间某个容器的CPU使用率最大值">
                                <QuestionCircleOutlined />
                            </Tooltip>
                           
                            CPU峰值使用率
                        </div>
                    )
                    
                },
                dataIndex: 'max_max_cpu_by_time',
                align: "center",
                sorter: (a, b) => a.max_max_cpu_by_time - b.max_max_cpu_by_time,
                render: (text, data) => (
                    <span>
                        {data.max_max_cpu_by_time ? data.max_max_cpu_by_time : "--"}
                    </span>
                    
                )

            },
            
            {
                title: '原有台数',
                dataIndex: 'before_num',
                sorter: (a, b) => a.before_num - b.before_num,
                align: "center",

            },
            {
                title: '扩容后台数',
                dataIndex: 'after_num',
                align: "center",
                 

            },
            
            {
                title: `(预估)扩容后可支撑${this.state.cpname}`,
                dataIndex: 'cover_capacity',
                align: "center",
                sorter: (a, b) => a.cover_capacity - b.cover_capacity,
                render: (text, data) => (
                    <span>
                        {data.cover_capacity ? data.cover_capacity : "--"}
                    </span>
                    
                )

            },
           
            
            {
                title: '操作',
                dataIndex: 'area',
                align: "center",
                render: (text, data) => (
                    <span>
                         <Button type="link" onClick={ ()=> this.ctsdbGraph(data) }>  数据 </Button>
                    </span>
                    
                )
            },

        ];


        return (
            <div  id="capacitycontainerchild">
            {this.state.id  && this.state.detail ? (

            <Card title="事件详情" bordered={false}  >
            
                <div className="btnwrap">
                    <Button className="rightbtn" onClick={() => goback()}  type="primary"> 返回 </Button>
                    <Button className="rightbtn" onClick={() => gobacktoP()}  type="primary"> 返回到父事件 </Button>
 
                </div>
                    



                    <div className="detailwrap">
                   

                   <Row>
                       <Col span={8}>
                       <label>
                           事件类型：
                        </label>
                           { this.state.detail.event_type == 1 ? "临时性事件" : "周期性事件" }
                           
                       </Col>
                       <Col span={8}>
                         
                          
                           
                           <label>
                           事件名称：
                           </label>
                            
                            
                            <div className="namelength440">
                            {  this.state.detail.event_name  ?  this.state.detail.event_name: "--"}
                            </div>
                            
                       </Col>
                       <Col span={8}>
                         
                   
                               <span> 
                                    <label>
                                     父事件：
                                   </label>
                                   <Select
                                   placeholder="--"
                                   defaultValue={this.state.detail.pid}
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
                         

                   </Col>
                   </Row>
                   <Row>
                       <Col span={8}>
                           <label>
                           开始时间：
                           </label>
                             
                            {  this.state.detail.start_time  ? this.state.detail.start_time : "--" }
                       </Col>
                       <Col span={8}>
                         <label> 预计缩容时间：</label> { this.state.detail.end_time   ?  this.state.detail.end_time : "--" }
                       </Col>
                        
                       <Col span={8}>
                           <label>
                           负责人：
                            </label>
                            <div className="namelength440"> 
                                {  this.state.detail.event_users ? this.state.detail.event_users : "--"}
                            </div>
                       </Col>
                       
                   </Row>
                    {this.state.detail.event_type == 2 ? (

                            <Row>
                            <Col span={8}>
                                <label>
                                容量指标：
                                </label>
                                  
                                {  this.state.detail.capacity_quota  ? this.state.detail.capacity_quota : "--" }
                            </Col>
                            <Col span={8}>
                                <label> 
                                    单位容量：
                                </label>
                            { this.state.detail.unit_capacity   ?  this.state.detail.unit_capacity : "--" }
                            </Col>
                            <Col span={8}>
                                <label>
                                预估容量：
                                </label>
                                  
                                { this.state.detail.capacity_pre_value    ?  this.state.detail.capacity_pre_value   : "-" }
                                
                            </Col>
                            </Row>


                    ): ("")}
                   

                   <Row>

                        <Col span={8}>
                            <label> 扩容最大比例(%)： </label> {  this.state.detail.expand_max_rate ? this.state.detail.expand_max_rate : "无限制"}
                        </Col>



                        
                        <Col span={8}>
                            <label> oncall 工单号：</label>
                            <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${this.state.detail.oncall_id}`} target="_blank"> 
                            
                                {this.state.detail.oncall_id} 
                            </a>
                            {this.state.detail.oncall_id ? "" : "---"}
                        </Col>
                        <Col span={8}>
                            <label>  真实容量：</label>
                            {  this.state.detail.max_op_value ? 
                                <span onClick={ ()=> this.opValueGraph(this.state.detail) } id="linklikespan"> { this.state.detail.max_op_value }   </span>
                                
                            : 
                               <span onClick={ ()=> this.openurlcodepop(this.state.detail) } id="linklikespan"> 关联容量数据  </span>  
                            } 
 
 
                        </Col>
                        </Row>
                   <Row>


                         
                        { this.state.detail.op_pre_value && this.state.detail.event_type == 1  ?
                           
                           <Col span={24}>
                               
                               <label>预估容量：</label>  {this.state.detail.op_pre_value }
                           
                           </Col> :
                         "" }
                     
                        
                     

                       
                   </Row>

               </div>



                  


                    {this.state.tabcapacitylist  ? (
                        
                       
                             <Tabs defaultActiveKey="1" onChange={this.callback}> 
                              { this.state.tabcapacitylist.map((item) => {


                                return (
                                <TabPane
                                tab={
                                    <span>
                                        <Tooltip title={item.link_all_name}>
                                        
                                        {item.link_name}
                                        </Tooltip>
                                    </span>
                                  }
                                   
                                key={item.link_id}>

 
                               
                                  
                                    <Table

                                        columns={columns}
                                        rowKey="id"
                                        dataSource={item.list}
                                        pagination={{  
                                            total: item.list.length, 
                                            pageSize: item.list.length, 
                                            
                                            pageSizeOptions:[item.list.length],
                                            

                                        }}
                                        scroll={{ y:  this.state.wheight  }}

                                        />


                                </TabPane>
                                )


                                })
                            }

                            </Tabs>
                       
                    ):(
                       ""
                    )}
                       
                    {this.state.linkspin ?
                     ("") : (
                         <div className="flowertrans">  <Spin indicator={antIcon} />  </div>
                    )}
                    

 


            </Card>
        ) : (
            
            <div className="flowertrans">  <Spin indicator={antIcon} />  </div>
        )}



            {this.state.graphdt && this.state.graphdt.code == 0 ? (
                <CtsdbGraph 
                ref={this.wrapper}  
                visible={this.state.svisible}
                graphdata={this.state.graphdt}
            
                openmodals={bgChange}
            />

            ): ("")}
                                
            
            {this.state.motlannua ? (
                <CtsdbGraphMultiple 
                ref={this.wrapper}  
                visible={this.state.graphxvisible}
                
                motlannuao={this.state.motlannua}
                multipleopenmodals={multipbgChange}
                />

            ): ("")}
            

              <OperateUrlConfig 
                    ref={this.wrapper}  
                    visible={this.state.confvisible}
                    detail={this.state.detail}
                    configmodals={configChange}
                />
                                        
 

           
              
        </div>
        )
    }

}





export default withRouter(CapacityChildDetailAuto);