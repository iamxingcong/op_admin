import React from 'react';
 
import { Table, Button, Form, Input, InputNumber, notification, Select  } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';


import axios from "axios";


import {  APIURL } from '../../common/constdt.js';

const { Option } = Select;

export default class StaticResource extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
            opendiv: false,
            tabledtnew: [],
            user_name: null,

        }
        this.adddiv = this.adddiv.bind(this)
        this.dele = this.dele.bind(this)
        this.confirmdt = this.confirmdt.bind(this)

    

    }


    componentDidMount() {
        
        this.agetRates()
 
    }


    
    async agetRates() {


        const ts = this.props.event_id
        const url = `${APIURL}/static/list?event_id=${ts}`;

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
    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    onFinish = (values) => {
             
        console.log('Success:', values);
        this.staticcreate(values)
    }
    
    async staticcreate(v){
        console.log(v)
  
        let url = `${APIURL}/static/create`;

        var bodyFormData = new FormData();
       
        if(!v.page_size ||   !v.domain || !v.pre_qps){
            
            notification.error({
                message: '提示',
                description: '请输入！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
            return 
        }
        bodyFormData.append("page_size", v.page_size);
        bodyFormData.append("page_size_unit", v.page_size_unit);
        bodyFormData.append("event_id", this.props.event_id);
        bodyFormData.append("domain", v.domain);
        bodyFormData.append("pre_qps", v.pre_qps);

         
        if(v.page_size_unit == "KB") {
            
            bodyFormData.append("bandwidth", v.page_size*10*v.pre_qps);

        } else if(v.page_size_unit == "MB")  {
            bodyFormData.append("bandwidth", v.page_size*10000*v.pre_qps);
        } else {
            console.log("pls select unit ")
        }
  
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
                
                 notification.success({
                    message: '提示',
                    description: response.data.msg,
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



    async dele(v){
 
        const url = `${APIURL}/static/delete`;

        var bodyFormData = new FormData();
        bodyFormData.append("static_id", v.id);
     
  
       
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


    async confirmdt(v){
  
        const url = `${APIURL}/static/verify`;

        var bodyFormData = new FormData();
        bodyFormData.append("static_id", v.id);
        bodyFormData.append("event_id", this.props.event_id);

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
                    description: '确认成功',
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




    footer = () => {
         
    
        return( <div className="tbfootsix">
            {this.state.opendiv ||  this.state.tabledtnew.length === 0 ? (
                     <Form
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        initialValues={{ page_size_unit: "MB" }}
                    >
                        <table>
                            <tbody>
                                <tr>
                                <td>

                                <Form.Item
                                    label=""
                                    name="domain"
                         
                                >
                                    <Input placeholder="页面链接" />
                                </Form.Item>
                            </td>
                            <td>
                                <Form.Item
                                    label=""
                                    name="page_size"
                                   
                                >
                                    <InputNumber placeholder="页面大小" />
                                </Form.Item>
                            </td>
                            <td>  
                                <Form.Item
                                    label=""
                                    name="page_size_unit"
                                    
                                >
                                <Select>
                                    <Option value="KB"> KB </Option>
                                    <Option value="MB"> MB </Option>
                                </Select>
                                </Form.Item>
                            </td>
                            <td>
                                <Form.Item
                                    label=""
                                    name="pre_qps"
                                    
                                >
                                    <InputNumber placeholder="预估QPS(万)" />
                                </Form.Item>
                                </td>
                                <td>--</td>
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
            ;
      };
      



    render(){


       function  trans(v){
           if(v.page_size_unit == "MB"){
                if(v.bandwidth > 1000000){
                    return (v.bandwidth / 1000000)+"T"
                } else {
                    return (v.bandwidth / 1000)+"G"
                }
               
           }else if(v.page_size_unit == "KB"){
               if(v.bandwidth > 1000) {
                  return (v.bandwidth / 1000 ) + "G"
               } else {
                    return v.bandwidth +"MB"
               }
                
           }
       }

          
        const columns = [
            {
                title: '页面链接',
                dataIndex: 'domain',
                align: "center",
                width: "16.6%",

            },
            {
                title: '页面大小',
                dataIndex: 'page_size',
                align: "center",
                width: "16.6%",
                render: (text, data, index) => (
                    <div>
                     {data.page_size + data.page_size_unit}
                     </div>
                )

            },
            {
                title: '预估QPS(万)',
                dataIndex: 'pre_qps',
                align: "center",
                width: "16.6%",

            },
            {
                title: '所需宽带',
                dataIndex: 'bandwidth',
                align: "center",
                width: "16.6%",
                render: (text, data) =>  trans(data)

            },
            
            {
                title: '平台负责人确认',
                dataIndex: 'confirm_status',
                align: "center",
                width: "16.6%",
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
                width: "16.6%",
                render: (text, data, index) => (
                    <span>
                        { (index !== this.state.tabledtnew.length - 1) ? (
                             data.confirm_status == 0 ? (
                                <Button icon={<MinusCircleOutlined />}  onClick={()=>this.dele(data)}></Button>
                             ):("--")
                            

                        ) : (
                                <div>
                                    {data.confirm_status == 0 ? (
                                        <div>
                                            <Button icon={<MinusCircleOutlined />}  onClick={()=>this.dele(data)}></Button>
                                            <Button icon={<PlusCircleOutlined />} onClick={this.adddiv}></Button>
                                        </div>
                                    ):(
                                        <div>
                                            
                                            <Button icon={<PlusCircleOutlined />} onClick={this.adddiv}></Button>
                                        </div>
                                    )}
                                    
                                </div>

                            )

                        }


                    </span>
                ),

            },

        ];



        return(
           <div id="staticsResource">

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
