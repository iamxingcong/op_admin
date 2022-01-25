import React from 'react';
 
import { Table, Button,   Form,   InputNumber, notification } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from "axios";


import {  APIURL } from '../../common/constdt.js';


 
export default class StreamingMedia extends React.Component {

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
        const url = `${APIURL}/media/list?event_id=${ts}`;

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

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    onFinish = (values) => {
             
        console.log('Success:', values);
        this.staticcreate(values)
    }
    async staticcreate(v){
        let url = `${APIURL}/media/create`;

        var bodyFormData = new FormData();

        if(!v.bit_rate || !v.pre_online_num){
             
            notification.error({
                message: '提示',
                description: '请输入！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
            return false;
        }
        bodyFormData.append("bit_rate", v.bit_rate);
        bodyFormData.append("event_id",  this.props.event_id);
        bodyFormData.append("pre_online_num", parseInt(v.pre_online_num));
   
  
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

    adddiv(v) {
 
        this.setState({
            opendiv: true,
        })
        
    }

    async dele(v){

        var bodyFormData = new FormData();
        bodyFormData.append("media_id", v.id);
        


        const url = `${APIURL}/media/delete`;


        let that = this;
        await axios.post(url,bodyFormData, { withCredentials: true })
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
       
   
        const url = `${APIURL}/media/verify`;

        var bodyFormData = new FormData();
        bodyFormData.append("media_id", v.id);
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
            }  else {
                
               
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
         
    
        return( <div className="tbfootertds">
            {this.state.opendiv  || this.state.tabledtnew.length === 0 ? (
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
                                    name="bit_rate"

                                >
                                    <InputNumber placeholder="码率" />
                                </Form.Item>
                            
                            </td>
                            <td>

                            
                            
                                <Form.Item
                                    label=""
                                    name="pre_online_num"

                                >
                                    <InputNumber placeholder="预估同时在线(万)" />
                                </Form.Item>
                             
                            </td>
                            <td><span> -- </span></td>
                            <td><span> -- </span></td>
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
      



    render(){


       

          
        const columns = [
            {
                title: '码率（Mbps）',
                dataIndex: 'bit_rate',
                align: "center",
                width: "20%",

            },
            {
                title: '预估同时在线(万)',
                dataIndex: 'pre_online_num',
                align: "center",
                width: "20%",
            },
            {
                title: '所需宽带',
                dataIndex: 'bandwidth',
                align: "center",
                width: "20%",
                render: (text, data, index) => (
                    <span> {data.bandwidth >= 100 ? data.bandwidth * 0.01 + "T" :  data.bandwidth * 10 + "G" } </span>
                )
            },
            {
                title: '平台负责人确认',
                dataIndex: 'confirm_status',
                align: "center",
                width: "20%",
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
                width: "20%",
                render: (text, data, index) => (
                    <span>
                        { (index !== this.state.tabledtnew.length - 1) ? (
                            data.confirm_status == 0 ? (
                                <Button icon={<MinusCircleOutlined />}  onClick={()=>this.dele(data)}> </Button>
                            ):("--")
                            

                        ) : (
                                <div>
                                    {data.confirm_status == 0 ? (
                                        <div>
                                             <Button icon={<MinusCircleOutlined />}  onClick={()=>this.dele(data)}> </Button>
                                             <Button icon={<PlusCircleOutlined />} onClick={this.adddiv}>  </Button>
                                        </div>
                                    ) : (
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
           <div id="StreamingMedia">

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
