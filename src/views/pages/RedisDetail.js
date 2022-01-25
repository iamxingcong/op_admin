import React from 'react';

import { Table, Form, InputNumber, Button , notification } from 'antd';

import axios from "axios";

import { APIURL } from '../../common/constdt.js';




export default class RedisDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {


            tabledtnew: null,
            pre_qpscurrent: null,
            user_name: null,

        }
        this.cfm = this.cfm.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.blurs = this.blurs.bind(this)



    }





    componentDidMount() {

        this.agetRates();

    }


   
  
    async cfm(d){
        console.log(d)
    
        const url = `${APIURL}/redis/verify`;

        var bodyFormData = new FormData();
        bodyFormData.append("redis_id", d.id);
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
            pre_qpscurrent: v
        })
        
    }
    async blurs(v){
        console.log(v)
        console.log(this.state.pre_qpscurrent)


        const url = `${APIURL}/redis/update`;

        var bodyFormData = new FormData();
        bodyFormData.append("redis_id", v.id);
        bodyFormData.append("pre_qps", this.state.pre_qpscurrent);
        
        let that = this;
       
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {
            
            
            if (response.data.code === 0) {
                   
                that.agetRates();
                  
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
    async agetRates() {


        var ts = this.props.event_id;

        const url = `${APIURL}/redis/list?event_id=${ts}`;

       

        var that = this;
        await axios.get(url, { withCredentials: true })
        .then(function (response) {
             
          if (response.data.code == 0) {
           
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

    render() {


        const columns = [
            {
                title: '实例名',
                dataIndex: 'instance_name',
                align: "center",
                width: "33.3%",
            },
           
            {
                title: '预估QPS',
                dataIndex: 'pre_qps',
                align: "center",
                width: "33.3%",
                render: (text, data) => (
                    <span  className="expandinputct">
                        <InputNumber defaultValue={data.pre_qps}  placeholder={data.pre_qps}  onChange={this.onBlur}  onBlur={()=>this.blurs(data)} />
                
                    </span>
                    )
                

            },
            {
                title: '平台负责人确认',
                dataIndex: 'type_name',
                align: "center",
                width: "33.3%",
                render: (text, data, index) => (
                    <div>

                         {data.confirm_status == 1 ? (
                            
                             <div className="brespans"> 
                             <span>
                               {data.confirm_user } 
                             </span> 
                             <span>
                               {  data.confirm_datetime } 
                              </span>
                            </div>
                         ): (
                            
                            <Button  type="primary" size="small"  onClick={()=>this.cfm(data)}>
                                确认
                            </Button>
                             
                            
                         )}
                    </div>
                     
                )

            },
        ]
        return (
            <div id="OTTDetail"  className="redisdivs">
                <Form
                    name="basicx"


                    onFinish={this.onFinish}

                    autoComplete="off"

                >
                    {this.state.tabledtnew ? (
                        <Table

                        columns={columns}
                        rowKey="id"
                        dataSource={this.state.tabledtnew}
                        pagination={{
                            total: this.state.tabledtnew.length,
                            pageSize: this.state.tabledtnew.length,
                        }}
                        
                    />

                    ) : ("")}
                    

                </Form>
            </div>
        )
    }
}