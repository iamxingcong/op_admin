import React from 'react';

import { Table, Button, Row, Col, Form, Input, InputNumber,notification } from 'antd';
 
 
 

class MultiTable extends React.Component {
     
 
    constructor(props) {
        super(props);

        this.state = {
             detail: null,
           
        }
        

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
            now_qps: values.now_qps,
            pre_qps: values.pre_qps
        })

        this.createisa();

    };

      onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)



    }

    footer = () => {
         
    
        return( <div>
                     <Form
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Row>
                            <Col span={5}>
                                <Form.Item
                                    label=""
                                    name="domain"

                                >
                                    <Input placeholder="域名" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label=""
                                    name="now_qps"

                                >
                                    <InputNumber placeholder="当前QPS" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label=""
                                    name="pre_qps"

                                >
                                    <InputNumber placeholder="预估QPS" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                
                            </Col>
                            <Col span={4}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"> 确认添加
                                         
                                    </Button>
                                </Form.Item>

                            </Col>
                        </Row>





                    </Form>


            </div>)
            ;
      };
      

    render(){


       
        
        const {
            tabledtnew
        } = this.props

  
        const columns = [
            {
                title: 'id',
                dataIndex: 'id',
               
              },
            {
              title: 'type_name',
              dataIndex: 'type_name',
             
             
            },
             
          ];
          
          
          
       
        return (
            <div>
                {tabledtnew && tabledtnew.length >= 1 ? (

                        <Table
                         
                            columns={columns}
                            rowKey="id"
                            dataSource={tabledtnew}
                            footer={this.footer}
                        />
                    ): ("")
                }


            </div>
            
        )
    }
}

export default MultiTable