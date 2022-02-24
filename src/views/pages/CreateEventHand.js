import React from 'react';

import { Button, Modal, Form, Input, Select, Row, Col, DatePicker, InputNumber, Cascader, notification, Spin } from 'antd';
import moment from 'moment';
import axios from "axios";

import { APIURL } from '../../common/constdt.js';



import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    LoadingOutlined,

} from '@ant-design/icons';

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;



let ct = 0;
let tem = [];
let okt = [];

class CreateEventHand extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

            filemap: false,
            mapdt: null,


            one: 1,
            zero: 0,
            parent_type: "",
            eventChainChildren: null,
            eventChain: null,
       
            event_name: "",
            event_type: 1,
            event_users: "",
            pid: "",
            event_desc: null,
            start_time: "",
            end_time: "",
            op_url: "",
            url_field: "",
            op_quota: 0,
            op_pre_value: 0,
            capacity_quota: "",
            unit_capacity: 0,
            capacity_pre_value: 0.0,
            delay_time: 0,
            link_info: null,
            alink_info: null,
            blink_info: null,
            clink_info: null,
            link_infa: [],
            btndisabled: false,
            reduce_type: 1,
            mentionlist: []
        }

        this.hideModal = this.hideModal.bind(this);
        this.onFinish = this.onFinish.bind(this);

        this.onChangetm = this.onChangetm.bind(this)
        this.onChangetmb = this.onChangetmb.bind(this)
        this.onOk = this.onOk.bind(this)
        this.onChangea = this.onChangea.bind(this)
        this.linkinfcarray = this.linkinfcarray.bind(this)
        this.dellinkitm = this.dellinkitm.bind(this)
        this.onReduceTypeChange = this.onReduceTypeChange.bind(this)
        this.monChange = this.monChange.bind(this)
        this.unitcapacity = this.unitcapacity.bind(this)
    }

    componentDidMount() {

        this.setState({
            btndisabled: false,
        })
       
        
    }

    


    
    unitcapacity(v){
       
        let vt = parseInt(v.target.value)
      
        if(typeof vt != 'number' ||  isNaN(vt)){
            notification.error({
                message: '提示',
                description: '单位容量字段请填写数字！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
        }
       
       
    }
 
    async monChange(v){
         
        let url =  "https://oncall.oa.com/api/oncall/searchName"
        
        let that = this;

    

        await axios.get(url, {
            withCredentials: true,
            params: {
                name: v,
            }
        })
        .then(function (response) {
            
            that.setState({
                mentionlist: response.data.data
            })
            
        })
        .catch(function (error) {
            console.log(error);
            
        })


    }
    onReduceTypeChange(v){
     
         
        this.setState({
            reduce_type: v,
        })
    }
    

    dellinkitm(i) {
 
        let index = tem.indexOf(i);
        if (index > -1) {
            tem.splice(index, 1);
        }


        this.setState({
            link_infa: tem
        })
        
    }
    linkinfcarray() {
        ct++;
        tem.push('a' + ct);
        this.setState({
            link_infa: tem
        })
        
    }

     



    hideModal() {


        this.props.openmodals(false)
        this.props.refreshlist(true)
        
        
        ct = 0;
        tem = [];
        okt = [];
        this.setState({
            link_infa: []
        })

    };

    onFinish(values) {
        okt = [];
        let templinkar = []
        
        templinkar.push(values.link_infc)

        for (let i = 0; i < this.state.link_infa.length; i++) {
            
            let tempname = "link_infc" + this.state.link_infa[i];
            templinkar.push(values[tempname]);
        }

        


        let deduplication = []
        for (let s = 0; s < templinkar.length; s++) {

            deduplication.push(JSON.stringify(templinkar[s]));

        }

        

        let tmparr = []
        for (let z = 0; z < deduplication.length; z++) {
            if (tmparr.indexOf(deduplication[z]) === -1) {
                tmparr.push(deduplication[z])
            } else {
                
               
                notification.error({
                    message: '提示',
                    description: '请去除重复的链路！！',
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });

                return false;
            }
             
        }


        for (let s = 0; s < templinkar.length; s++) {
            this.finishlinkinfos(templinkar[s]);


        }

        this.setState({
            event_name: values.event_name,
            
            event_users: values.event_users,
            reduce_type: values.reduce_type,
            reduce_time: values.reduce_time,
            pid: values.pid,
            event_desc: values.event_desc,

            op_url: values.op_url,
            url_field: values.url_field,
            op_quota: values.op_quota,
            op_pre_value: values.op_pre_value,
            capacity_quota: values.capacity_quota,
            unit_capacity: values.unit_capacity,
            capacity_pre_value: values.capacity_pre_value,
            delay_time: values.delay_time,
            link_info: templinkar,


        })

     

        if (this.state.end_time <= this.state.start_time ) {
             
            notification.error({
                message: '提示',
                description: '结束时间不能早于或等于开始时间！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });

            return false;
        } else {
            this.eventInfonewBuild(values)
        }



    };

    onOk(value) {
        console.log('onOk: ', value);
    }

    onChangetmb(ts, ta) {
       
        this.setState({

            end_time: ta,

        })
         
    }

    onChangetm(ts, ta) {
         
        this.setState({
            start_time: ta,


        })
     
    }

    async eventInfonewBuild(v) {
       

        this.setState({

            btndisabled: true,
        })
        let url = `${APIURL}/eventInfo/create`;

        let bodyFormData = new FormData();
        bodyFormData.append("event_name", v.event_name);
        bodyFormData.append("event_type", 1);
        bodyFormData.append("event_users", v.event_users);
        if (v.pid) {
            bodyFormData.append("pid", v.pid);
        }

        if (v.event_desc) {
            bodyFormData.append("event_desc", v.event_desc);
        }

        if (v.start_time) {
            bodyFormData.append("start_time", this.state.start_time);

        }

        if (v.end_time) {

            bodyFormData.append("end_time", this.state.end_time);
        }

        if (v.op_url) {
            bodyFormData.append("op_url", v.op_url);
        }


        if (v.url_field) {
            bodyFormData.append("url_field", v.url_field);
        }

        if (v.op_quota) {
            bodyFormData.append("op_quota", v.op_quota);
        }

        if (v.op_pre_value) {
            bodyFormData.append("op_pre_value", v.op_pre_value * 10000);

        }

        if (v.capacity_quota) {
            bodyFormData.append("capacity_quota", v.capacity_quota);
        }


        if (v.unit_capacity) {
            bodyFormData.append("unit_capacity", v.unit_capacity);
        }
        if (v.capacity_pre_value) {
            bodyFormData.append("capacity_pre_value", v.capacity_pre_value);
        }
        if (v.delay_time) {
            bodyFormData.append("delay_time", v.delay_time);
        }

        if (v.reduce_time) {
            bodyFormData.append("reduce_time", v.reduce_time);
        }
        if (v.reduce_type) {
            bodyFormData.append("reduce_type", v.reduce_type);
        }
        if (v.expand_max_rate) {
            bodyFormData.append("expand_max_rate", v.expand_max_rate);
        }

        if (v.webhook) {
            bodyFormData.append("webhook", v.webhook);
        }
        bodyFormData.append("link_info", JSON.stringify(this.state.clink_info));




        let that = this;

        await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {



                if (response.data.code === 0) {
                     

                    notification.success({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });

                    ct = 0;
                    tem = [];
                    okt = [];
                    that.setState({
                        link_infa: [],
                        btndisabled: false,
                    })

                  
                        that.props.openmodals(false)
                        that.props.refreshlist(true)
                    
                } else {

                    that.setState({
                        btndisabled: false,
                    })

                 
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
        
                 
                that.setState({
                    btndisabled: false,
                })
            })

    }



    onEventTypeChange = (value) => {
       

        this.setState({
            event_type: 1,
        });
        
    };


    finishlinkinfos(value) {
        
        if (value.length == 2) {
            for (let i = 0; i < this.props.eventChain.length; i++) {


                if (value[0] === this.props.eventChain[i].link_id) {




                    for (let j = 0; j < this.props.eventChain[i].menu.length; j++) {



                        if (value[1] === this.props.eventChain[i].menu[j].link_id) {




                            let sob = this.props.eventChain[i].menu[j];
                            delete sob.menu
                            console.log(sob)

                            okt.push(sob)
                            this.setState({
                                clink_info: okt
                            })


                        }
                    }
                }
            }
        } else {
            for (let k = 0; k < this.props.eventChain.length; k++) {


                if (value[0] === this.props.eventChain[k].link_id) {




                    for (let l = 0; l < this.props.eventChain[k].menu.length; l++) {



                        if (value[1] === this.props.eventChain[k].menu[l].link_id) {



                            for (let f = 0; f < this.props.eventChain[k].menu[l].menu.length; f++) {




                                if (value[2] === this.props.eventChain[k].menu[l].menu[f].link_id) {


                                    

                                    okt.push(this.props.eventChain[k].menu[l].menu[f])
                                    this.setState({
                                        clink_info: okt
                                    })

                                }
                            }
                        }
                    }
                }
            }
        }



    }

    

    onChangea = (value) => {


        console.log(value)


    }



    onBlur = (e) => {

        console.log(e)

        this.eventInfofilemap(e.target.value)
    };

    async eventInfofilemap(e) {

        let url = `${APIURL}/eventInfo/fieldMap`;

        let bodyFormData = new FormData();
        bodyFormData.append("url", e);
        let that = this

        if (e && e.length >= 1) {
            await axios.post(url, bodyFormData, { withCredentials: true })
                .then(function (response) {
                     
                    if (response.data.code == 0) {
                        

                        that.setState({
                            filemap: true,
                            mapdt: response.data.data
                        })

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

        } else {
            console.log("blank url")
        }


    }


    render() {




        return (
            <div id="createevent">

                <Modal
                    title={`创建事件`}

                    closable
                    maskClosable={false}
                    centered
                    visible={this.props.visible}
                    onCancel={this.hideModal}
                    width={1120}
                    footer={null}
                    destroyOnClose={true}

                >


                    <Form
                        name="basicx"
                        onFinish={this.onFinish}
                        autoComplete="off"
                        initialValues={{ event_type: this.state.event_type + '', reduce_type: this.state.reduce_type+'' }}
                    >
                        
                        <Form.Item
                            label="事件名称"
                            name="event_name"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        {this.state.event_type == 1 ? (

                            <Form.Item
                                label="父事件"
                                name="pid"

                            >

                                <Select
                                    placeholder="请选择父事件"
                                >

                                    {this.props.tabledt ? (

                                        this.props.tabledt.map(function (itm) {
                                            return (
                                                <Option key={itm.id}> {itm.event_name} </Option>
                                            )
                                        })

                                    ) : (
                                            <Option value="null">   请选择 </Option>
                                        )}



                                </Select>
                            </Form.Item>

                        ) : ("")}


                        


                        {this.state.event_type == 1 ? (
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="开始时间"
                                        name="start_time"
                                        rules={[{ required: true }]}
                                    >

                                        <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} onChange={this.onChangetm} onOk={this.onOk} />
                                    </Form.Item>

                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="结束时间"
                                        name="end_time"
                                        rules={[{ required: true }]}

                                    >

                                        <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} onChange={this.onChangetmb} onOk={this.onOk} />
                                    </Form.Item>

                                </Col>
                            </Row>

                        ) : ("")}

                       


                      
                        <Form.Item
                            label="负责人"
                            name="event_users"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        {this.state.event_type == 1 ? (
                            <Row className="col12row">
                                <Col span={12}>
                                    <Form.Item
                                        label="运营指标"
                                        name="op_quota"
                                        rules={[{ required: true }]}
                                    >


                                        <Select>
                                            <Option value="1"> 同时在线 </Option>
                                            <Option value="2"> qps </Option>

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="预估值(万)"
                                        name="op_pre_value"
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                            </Row>

                        ) : ("")}


                        <Row>
                            <Col span={24} id="specialhrefs">
                                <div className="ant-col ant-form-item-label">
                                    <label title="报警机器人(帮助)">
                                        报警机器人(<a target="_blank" rel="noreferrer" href="https://iwiki.woa.com/pages/viewpage.action?pageId=1132901246">帮助</a>)
                                        </label>
                                </div>

                                <Form.Item
                                    label=""
                                    name="webhook"

                                >


                                    <Input placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=0bd9a136-96a0-44fc-af07-c64e17ad0a71" />
                                </Form.Item>
                            </Col>

                        </Row>




                        {this.state.event_type == 2 ? (
                            <div>


                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label="运营指标"
                                            name="capacity_quota"
                                            rules={[{ required: true }]}
                                        >


                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="运营单位"
                                            name="unit_capacity"
                                            rules={[{ required: true , message: "单位容量字段请填写数字！"}]}
                                        >
                                            <InputNumber    onBlur={this.unitcapacity} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}  className="eventtypequest">
                                    
                                    <Form.Item
                                        label="最大扩容比例"
                                        name="expand_max_rate"
                                        rules={[{ required: true }]}
                                        tooltip={{ title: "例如：当前机器数有50台，最大扩容比例设置为100%，那么可以最大扩容的机器数即为50台。", overlayClassName: "expandcrsinput" }}
                                    >


                                        <Select
                                            placeholder="设置每个模块允许扩容机器数的最大比例"
                                        >
                                          
                                            <Option value="30"> 30 </Option>
                                            <Option value="50">  50 </Option>
                                            <Option value="100">  100  </Option>
                                            <Option value="200">  200 </Option>
                                            <Option value="0"> 无限制 </Option>

                                        </Select>

                                    </Form.Item>
                                    
                                </Col>
                                </Row>
                            </div>
                        ) : ("")}
                        <Row>
                            {/* <Col span={12}>
                                <Form.Item
                                    label="实时数据url"
                                    name="op_url"
                                >
                                    <Input onBlur={this.onBlur} />
                                </Form.Item>
                            </Col> */}
                            <Col span={12}>
                                {this.state.filemap ? (
                                    <div>

                                        <Form.Item
                                            label="映射字段"
                                            name="url_field"

                                        >
                                            <Select

                                                style={{ width: 200 }}
                                                placeholder="Search to Select"
                                                optionFilterProp="children"

                                            >
                                                 
                                                {this.state.mapdt ? (
                                                    this.state.mapdt.map(function (i, t) {
                                                        return (<Option value={i} key={t}> {i} </Option>)
                                                    })

                                                ) : ("")}

                                            </Select>
                                        </Form.Item>

                                    </div>


                                ) : ("")}
                            </Col>
                        </Row>

                         

                        {this.props.eventChainChildren ? (

                            <div>
                                <Row>

                                    <Col span={12}>

                                        <Form.Item label="活动链路" name="link_infc" rules={[{ required: true }]}>





                                            <Cascader options={this.props.eventChainChildren} onChange={this.onChangea} placeholder="Please select" key="-1"   allowClear={false} />

                                        </Form.Item>

                                    </Col>
                                    <Col span={4}>
                                        <div id="addicons">
                                            <PlusCircleOutlined onClick={this.linkinfcarray} />
                                        </div>
                                    </Col>
                                </Row>




                                {  this.state.link_infa.map((a, index) =>
                                    <Row key={a}  className="slecassed">


                                        <Col span={12}>
                                            <div className="addeditms">


                                                <Form.Item name={`link_infc` + a} rules={[{ required: true }]} key={a}>
                                                    <Cascader options={this.props.eventChainChildren} onChange={this.onChangea} placeholder="Please select" key={a} />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="deliconsitm">

                                                <MinusCircleOutlined onClick={() => this.dellinkitm(a)} />

                                            </div>
                                        </Col>

                                    </Row>
                                )}


                            </div>

                        ) : ("")
                        }



                        <Form.Item wrapperCol={{ offset: 3, span: 21 }}>

                            <div id="btnright">
                                <Button type="primary" htmlType="submit" disabled={this.state.btndisabled}>
                                    提交
                                </Button>
                            </div>



                        </Form.Item>
                    </Form>
    
                    {this.state.btndisabled ? (
                            <div className="editspindx">  <Spin indicator={antIcon} />  </div>
                    ): (
                        ""
                    )}

                </Modal>
            </div>
        )
    }
}



export default CreateEventHand;