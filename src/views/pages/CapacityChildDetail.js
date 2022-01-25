
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Table, Row,   Button, Col, Card, Select, Tabs, Tooltip  } from 'antd';

 
import {   SyncOutlined  } from '@ant-design/icons';

import axios from "axios";

import { APIURL } from '../../common/constdt.js'
 

const { Option } = Select;
const { TabPane } = Tabs;

class CapacityChildDetail extends React.Component {

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

          
            secondarray: [],
            originalsecond: [],
            link_id: null,
            link_idpinput: null,
            link_idblur: null,
            link_info: null,
            linklist: null,
        }

       
        this.tabeventchaine = this.tabeventchaine.bind(this)
      
         
       
    }


    componentDidMount() {
 
        
        this.tabeventchaine()
        const ts = this.props.location.search.replace("?id=","");
        this.setState({
            id: ts,
        })

        this.agetRates(ts)
        this.eventlist()

    
      
    }

    

    callback(key) {
        console.log(key);
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
                               subtmpobj.expand_oncall_id = 0;
                               subtmpobj.reduce_oncall_id = 0
          
          
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
                    tabcapacitylist: endarray

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
             
             
           })
            
        } else {
            console.log("blank url")
        }
        
           
     }


    onFinish = (values) => {

        console.log('Success:', values);
    }

 
    



 

    render() {

        const goback = () => {


            this.props.history.push({
                pathname: "EventList",

            });

        }
       

     

        const columns = [
            {
                title: '服务名',
                dataIndex: 'server_name',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.app_name+"."+data.server_name}
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
                title: '需扩容台数',
                dataIndex: 'need_num',
                align: "center",
                 

            },
            {
                title: '当前台数',
                dataIndex: 'now_num',
                align: "center",
                 

            },
            {
                title: '扩容工单号',
                dataIndex: 'area',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.expand_oncall_id != 0 ? (
                            <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.expand_oncall_id}`} target="_blank"> {data.reduce_oncall_id} </a>
                        ): ("--")}
                        
                    </span>
                    
                )
            },
            {
                title: '缩容工单号',
                dataIndex: 'area',
                align: "center",
                render: (text, data) => (
                    <span>

                    
                    {data.reduce_oncall_id != 0 ? (
                        <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.reduce_oncall_id}`} target="_blank"> {data.reduce_oncall_id} </a>
                    
                    ):("--")}
                    </span>
                    
                )
            },

        ];


        return (
            <div  id="capacitycontainer">
            {this.state.id  && this.state.detail ? (

            <Card title="容量模版" bordered={false}  >
            
                <div className="btnwrap">
                    <Button className="rightbtn" onClick={() => goback()}  type="primary"> 返回 </Button>
 
                </div>
                    



                    <div className="detailwrap">
                   

                   <Row>
                       <Col span={8}>
                           事件类型： 
                           { this.state.detail.event_type == 1 ? "手动运营事件" : "自动推送事件" }
                           
                       </Col>
                       <Col span={8}>
                         
                           <div className="namelength440">
                           <span className="sixcharacter"> 
                            事件名称：
                            </span>
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
                            开始时间：  
                            {  this.state.detail.start_time  ? this.state.detail.start_time : "--" }
                       </Col>
                       <Col span={8}>
                         <span className="sixcharacter"> 预计缩容时间：</span> { this.state.detail.end_time   ?  this.state.detail.end_time : "--" }
                       </Col>
                        
                       <Col span={8}>
                           负责人： {  this.state.detail.event_users ? this.state.detail.event_users : "--"}
                       </Col>
                       
                   </Row>
                    {this.state.detail.event_type == 2 ? (

                            <Row>
                            <Col span={8}>
                                容量指标：  
                                {  this.state.detail.capacity_quota  ? this.state.detail.capacity_quota : "--" }
                            </Col>
                            <Col span={8}>
                                <span className="sixcharacter"> 
                                    容量单位：
                                </span>
                            { this.state.detail.unit_capacity   ?  this.state.detail.unit_capacity : "--" }
                            </Col>
                            <Col span={8}>
                                
                                预估容量：  
                                { this.state.detail.capacity_pre_value    ?  this.state.detail.capacity_pre_value   : "-" }
                                
                            </Col>
                            </Row>


                    ): ("")}
                   
                   <Row>


                         
                        { this.state.detail.op_pre_value && this.state.detail.event_type == 1  ?
                           
                           <Col span={8}>
                               
                           预估容量：  {this.state.detail.op_pre_value }
                           
                           </Col> :
                         "" }
                     
                        
                       <Col span={8}>
                           扩容最大比例(%)： {  this.state.detail.expand_max_rate ? this.state.detail.expand_max_rate : "--"}
                       </Col>

                       
                   </Row>

               </div>



                    <Row>
                    <Col span={24}>
                        <div className="title">
                            <span>
                                容量详情
                               
                            </span>
                                 
                                 
                        </div>
                        </Col>
                       
                    </Row>


                    {this.state.tabcapacitylist && this.state.tabcapacitylist.length >= 1 ? (
                        
                        <div>
                             <Tabs defaultActiveKey="1" onChange={this.callback}> 
                              { this.state.tabcapacitylist.map((item) => {


                                return (
                                <TabPane
                                tab={
                                    <span>
                                        <Tooltip title={item.link_all_name}>

                                       
                                        <SyncOutlined   />
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

                                        />


                                </TabPane>
                                )


                                })
                            }

                            </Tabs>
                        </div>


                    ):("--")}
                       
                    

 


            </Card>
        ) : ("")}

              
        </div>
        )
    }

}





export default withRouter(CapacityChildDetail);