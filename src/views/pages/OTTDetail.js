import React from 'react';

import { Table, Button,  Form , Checkbox, InputNumber,  notification} from 'antd';

import axios from "axios";
import { withRouter } from 'react-router-dom';

import {  APIURL } from '../../common/constdt.js';

var expanded = []
var reduced = []
 
 

class OTTDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
            tabledtnew: [],
            fselectedRowKeys: [],
            expanded_ids: [],
            reduced_ids: [],
            inputnum: null,
     

        }
        this.capacity_bulkExpand = this.capacity_bulkExpand.bind(this);
        this.capacitybulkReduce = this.capacitybulkReduce.bind(this);
        this.checkeddt = this.checkeddt.bind(this);
        this.checkedrd = this.checkedrd.bind(this)
        this.onBlur = this.onBlur.bind(this);
       
        
    }


     

    componentDidMount() {
        
        this.agetRates()
 
    }
    onFinish = (values) => {
        console.log('Success:', values);
    }

    checkedrd(v){

        console.log(v.target)
        if(v.target.checked){
            reduced.push(v.target.reduce)
        }else {
            let rtm = v.target.reduce;
            let rindex = reduced.indexOf(rtm);
            reduced.splice(rindex,1)

        }
        this.setState({
            reduced_ids: reduced
        })
        console.log(reduced)
    }

    checkeddt(v){
        
        console.log(v.target)
        console.log(v.target.checked)
        if(v.target.checked){
            expanded.push(v.target.expand)
        } else {
            let tm = v.target.expand
            let tmindex = expanded.indexOf(tm);
            console.log(tmindex)
            expanded.splice(tmindex,1)
        }
        this.setState({
            expanded_ids: expanded
        })
        console.log(expanded)
    }

    async agetRates() {


        const ts = this.props.id
        const url = `${APIURL}/capacity/handList?event_id=${ts}`;

        var that = this;
        await axios.get(url, { withCredentials: true })
        .then(function (response) {
         
            
          if (response.data.data) {
            
            that.setState({
                
                tabledtnew: response.data.data,
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

    onBlur(v){
        
        console.log(v)
        this.setState({
            inputnum: v,
            
        })
        
    }
    
 
    async neednum(d){
        
        console.log(d)
        console.log(this.state.tabledtnew[0])

        const url = `${APIURL}/capacity/update`;

        var bodyFormData = new FormData();

        bodyFormData.append("num", this.state.inputnum);
           
        
        if(d.id == this.state.tabledtnew[0].id){
         
           
                let tmpmarr = []
            
                for(let r = 0; r < this.state.tabledtnew.length; r++){
                    
                    tmpmarr.push(this.state.tabledtnew[r].id)
               
                }
                bodyFormData.append("capacity_id_list", JSON.stringify(tmpmarr));
 
        } else {
            let tmp = []
            tmp.push(d.id)
            bodyFormData.append("capacity_id_list",  JSON.stringify(tmp));
        }
            let that = this;
            await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {
                
                
                if (response.data.code === 0) {
                    
                    notification.success({
                        message: '提示',
                        description: '修改成功',
                        placement: 'topCenter',
                        onClick: () => {
                        console.log('Notification Clicked!');
                        },
                    });
                    
                    that.agetRates()



                    if(d.id == that.state.tabledtnew[0].id){
                        let ts = that.props.id
                        that.props.history.push({
                            pathname: "EventDetail",
                            search: "id="+ts,
                            state: {id: ts}
                         }); 
            
                        window.location  = window.location.href+"&tabs=capacity"
                        window.location.reload() 
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
    async  capacity_bulkExpand() {
  
        this.onFinish()
        var bodyFormData = new FormData();
        let tmp = []
        if(this.state.expanded_ids.length == 0) {
            

            notification.error({
                message: '提示',
                description: '请选择',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });

            return false;
        } else {

        
            
            for(let i = 0; i < this.state.expanded_ids.length; i++){

                for(let j = 0; j < this.state.tabledtnew.length; j++){
                    if(this.state.expanded_ids[i] == this.state.tabledtnew[j].id){
                        if(this.state.tabledtnew[j].expand_oncall_id == 0){
                           
                            let tjs = this.state.tabledtnew[j];
                            tmp.push(tjs)
                            
                        } else {
                           console.log( this.state.tabledtnew[j] )
                        }
                        
                    }
                }

            }
        }
        

        let url = `${APIURL}/capacity/bulkExpand`;

         
        bodyFormData.append("bulk_expand_list",  JSON.stringify(tmp));
        
       
        
        if(tmp.length == 0) {
            return false;
        }
        var that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {
           
            console.log(response)
            if(response.data.code === 0){
                 

                 notification.success({
                    message: '提示',
                    description: response.data.msg,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });

                that.agetRates();
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



    async  capacitybulkReduce() {
        
        this.onFinish()

        let tmp = []

        var bodyFormData = new FormData();
     
        if(this.state.reduced_ids.length == 0) {
            
            notification.error({
                message: '提示',
                description: '请选择',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
            
            return false;
        } else {

        

            for(let i = 0; i < this.state.reduced_ids.length; i++){

                for(let j = 0; j < this.state.tabledtnew.length; j++){
                    if(this.state.reduced_ids[i] == this.state.tabledtnew[j].id){
                        if(this.state.tabledtnew[j].reduce_oncall_id == 0){
                             
                            tmp.push(this.state.tabledtnew[j].id);
                           
                        } else {
                           console.log( this.state.tabledtnew[j] )
                        }
                        
                    }
                }

            }
        }
        
        console.log(this.state.tabledtnew)

        
        console.log(tmp)
      
        bodyFormData.append("capacity_id_list", JSON.stringify(tmp));

        let url = `${APIURL}/capacity/bulkReduce`;

  
        
        if(tmp.length == 0) {
            return false;
        }
        var that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {
            
            if(response.data.code === 0){
                that.agetRates();
               

                notification.success({
                    message: '提示',
                    description:
                    response.data.msg,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });
                
            } else {
                console.log(response)
              

                notification.error({
                    message: '提示',
                    description:
                    response.data.msg,
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



    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ 
            fselectedRowKeys: selectedRowKeys
        });
      };
    


    render(){
       
        
       console.log('render')

        const columns = [
            {
                title: '扩容工单号',
                dataIndex: 'expand_oncall_id',
                align: "center",
                width: "14.2%",
                render: (text, data, index) => (
                    <span>
                     {data.expand_oncall_id == 0 ? (
                         
                         <Form.Item
                            valuePropName="expand"
                            name={data.id+"_a"}
                            initialValue={data.id}
                        >    
                            <Checkbox    onChange={this.checkeddt}> </Checkbox>

                         </Form.Item>
                     ) : (
                          
                         <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.expand_oncall_id}`}  target="_blank"> {data.expand_oncall_id} </a>
                     )}
                    </span>
                )

            },  
            {
                title: '缩容工单号',
                dataIndex: 'reduce_oncall_id',
                align: "center",
                width: "14.2%",
                render: (text, data, index) => (
                    <span>
                     {data.reduce_oncall_id == 0 ? (
                         
                         <div>
                             {data.expand_oncall_id == 0 ? (
                                  <Form.Item
                                     
                                        name={data.id}
                                        defaultChecked={false}
                                        valuePropName="reduce" 
                                         
                                    >    
                                      <Checkbox  disabled />
            
                                    </Form.Item>
                             ): (
                                <Form.Item
                                    valuePropName="reduce"
                                    
                                    name={data.id}
                                    initialValue={data.id}
                                >    
                                    <Checkbox  onChange={this.checkedrd}></Checkbox>
        
                                </Form.Item>
                             )}
                         </div>
                           

                     ) : (
                        <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.reduce_oncall_id}`} target="_blank"> {data.reduce_oncall_id} </a>
                     )}
                    </span>
                )

            },
          
            {
                title: '服务名',
                dataIndex: 'server_name',
                align: "center",
                width: "14.2%",
                render: (text, data, index) => (
                    <span> {data.app_name+"."+data.server_name} </span>
                )

            },
            {
                title: 'set',
                dataIndex: 'set_name',
                align: "center",
                width: "14.2%",
                render: (text, data, index) => (
                    <span> {data.set_name ? data.set_name : "--" } </span>
                )

            },
            {
                title: '地域',
                dataIndex: 'area',
                width: "14.2%",
                align: "center",

            },
            {
                title: '当前台数',
                dataIndex: 'now_num',
                align: "center",
                width: "14.2%",

            },
            {
                title: '扩容比例（%）',
                dataIndex: 'expand_scale_num',
                align: "center",
                width: "14.2%",
                render: (text, data, index) => (
                    <span className="expandinputct">
                        {data.reduce_oncall_id == 0 || data.expand_oncall_id == 0 ? (
                            <Form.Item
                        
                            name={"neednum_"+index}
                          
                            initialValue={data.expand_scale_num}
                            >    
                            {data.expand_oncall_id != 0 ? (
                                <InputNumber  disabled />
                            ): (
                                <InputNumber   onChange={this.onBlur}  onBlur={()=> this.neednum(data)}  />
                            )}
                                
    
                            </Form.Item>

                        ):( text )} 
                     
                    </span>
                )

            }
            
           
        ]
        return(
            <div id="OTTDetail"> 
             
                <div id="divwrapott">
                    
                    <Button type="primary"   className="btnb" onClick={this.capacitybulkReduce}> 一键缩容 </Button>
                    <Button type="primary"   className="btna" onClick={this.capacity_bulkExpand}> 一键扩容 </Button>
                    
                </div> 
            
       
            <Form
                name="basic"
                autoComplete="off"
                onFinish={this.onFinish}
            >
              
                <Table
                   // rowSelection={rowSelection} 
                    columns={columns}
                    rowKey="id"
                    dataSource={this.state.tabledtnew}
                    pagination={{
                        total: this.state.tabledtnew.length,
                        pageSize: this.state.tabledtnew.length,
                    }}
                />
 
            </Form>

            
            

             </div>
        )
    }
}


export default withRouter(OTTDetail);