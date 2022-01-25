import React from 'react';
import { Table, Button, Form, Input, InputNumber,notification } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

import axios from "axios";


import {  APIURL } from '../../common/constdt.js';




export default class IasDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
            opendiv: false,

            event_id: null,
            domain: null,
            now_qps: null,
            pre_qps: null,
            tabledtnew: [],
            user_name: null,
   
        }

        this.adddiv = this.adddiv.bind(this)

        this.agetRates = this.agetRates.bind(this)
        
        this.dele = this.dele.bind(this)
        this.confirmdt = this.confirmdt.bind(this)

    }




    componentDidMount() {
       
       
        console.log(this.props.id)


       

        this.agetRates();

    }

   
   
    async agetRates() {

           


        const ts = this.props.id
        const url = `${APIURL}/ias/list?event_id=${ts}`;

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
         
        })
       

 
    }


    adddiv(v) {
 

        this.setState({
            opendiv: true,
        })
        
    }

    async dele(v){
      

        const url = `${APIURL}/ias/delete`;

        var bodyFormData = new FormData();
        bodyFormData.append("ias_id", v.id);
        
        let that = this;
       
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {
        
            
          
          if (response.data.code === 0) {
                 
                that.agetRates();
              
                notification.success({
                    message: '提示',
                    description: '删除成功！',
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
    async confirmdt(v){
         
      
        
        const url = `${APIURL}/ias/verify`;

        var bodyFormData = new FormData();
        bodyFormData.append("ias_id", v.id);
        bodyFormData.append("event_id", this.props.id);
        if(this.props.EngName){
            bodyFormData.append("user_name", this.props.EngName);
        }
        
 
        let that = this;

        await axios.post(url, bodyFormData, { withCredentials: true })
        
        .then(function (response) {
          
            
          
          if (response.data.code === 0) {
                 
                that.agetRates();
            
                notification.success({
                    message: '提示',
                    description: '确认成功！',
                  
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

    async createisa(){
       let url = `${APIURL}/ias/create`;

       var bodyFormData = new FormData();
       bodyFormData.append("event_id", this.state.event_id);
       bodyFormData.append("domain", this.state.domain);
       bodyFormData.append("now_qps", this.state.now_qps);
       bodyFormData.append("pre_qps", this.state.pre_qps);
        var that = this
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
                    opendiv: false,
                })
                that.agetRates()
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


      onFinish = (values) => {
             
        console.log('Success:', values);
       
        for(let i in values){
            if(!values[i]){
                 
              
                notification.error({
                    message: '提示',
                    description: i+" 的值不能为 "+ values[i],
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });
                
                return
            }
        }
        this.setState({
            event_id: this.props.id,
            domain: values.domain,
            now_qps: 100,
            pre_qps: values.pre_qps
        })

        this.createisa();

    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    footer = () => {
         
    
        return( <div className="tbfootertds4">
            {this.state.opendiv || this.state.tabledtnew.length === 0 ? (
                     <Form
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        
                        <table>
                        <tbody>
                        <tr>
                            <td>

                           
                                <Form.Item
                                    label=""
                                    name="domain"
                                >
                                    <Input placeholder="域名" />
                                </Form.Item>
                            
                            </td>
                          
                            <td>
                                <Form.Item
                                    label=""
                                    name="pre_qps"
                                >
                                    <InputNumber placeholder="预估QPS" />
                                </Form.Item>
                           </td>
                           <td>
                               --
                            </td>
                            <td>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"> 确认添加
                                         
                                    </Button>
                                </Form.Item>
                                </td>
                            </tr>
                        </tbody>
                        </table>

                    </Form>
                    ) : (
                        
                         ""
                    )}


                   
            </div>)
            
      };
      


    render() {



        const columns = [
            {
                title: '域名',
                dataIndex: 'domain',
                align: "center",
                width: "25%",
            },
            
            {
                title: '预估QPS',
                dataIndex: 'pre_qps',
                align: "center",
                width: "25%",

            },
            {
                title: '平台负责人确认',
                dataIndex: 'confirm_status',
                align: "center",
                width: "25%",
                render: (text, data, index) => (
                    <div>
                        {data.confirm_status === 0 ? (
                          

                            <Button   onClick={()=>this.confirmdt(data)} type="primary" size="small">
                                确认
                            </Button>

                         
                           
                        ): (
                          <div className="brespans"> 
                              <span>
                                {data.confirm_user } 
                              </span> 
                              <span>
                                {  data.confirm_datetime } 
                               </span>
                             </div>
                        )}
                    </div>
                )


            },
            {
                title: '操作',
                dataIndex: 'type_name',
                align: "center",
                width: "25%",
                render: (text, data, index) => (
                    <span>
                        { (index !== this.state.tabledtnew.length - 1) ? (

                                data.confirm_status == 0 ? (<Button icon={<MinusCircleOutlined />}  onClick={()=>this.dele(data)}></Button>):("--")
                            

                        ) : (
                                <div>
                                      {data.confirm_status == 0 ? (
                                            <div>
                                            <Button icon={<MinusCircleOutlined />}  onClick={()=>this.dele(data)}></Button>
                                            <Button icon={<PlusCircleOutlined />} onClick={this.adddiv}></Button>
                                            </div>
                                      ):(
                                        
                                        <Button icon={<PlusCircleOutlined />} onClick={this.adddiv}></Button>
                                      )}
                                   
                                </div>

                            )

                        }


                    </span>
                ),

            },

        ];



        return (
            <div id="IasDetail">
              
           
                <Table

                    columns={columns}
                    rowKey="id"
                    dataSource={this.state.tabledtnew}
                    pagination={{
                        total: this.state.tabledtnew.length,
                        pageSize: this.state.tabledtnew.length,
                    }}
                    footer={this.footer}
                />

 
            </div>
        )
    }

}
