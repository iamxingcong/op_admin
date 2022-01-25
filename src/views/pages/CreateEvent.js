import React from 'react';

import { Button, Modal, Form, Input, Select, Row, Col, DatePicker, InputNumber, Cascader, notification, Mentions } from 'antd';
import moment from 'moment';
import axios from "axios";

import { APIURL } from '../../common/constdt.js';



import {
    PlusCircleOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;


var ct = 0;
var tem = [];
var okt = [];

class CreateEvent extends React.Component {


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
    }

    componentDidMount() {

        this.setState({
            btndisabled: false,
        })
       
        this.newagetRates();
    }
 
    async monChange(v){
        console.log(v)
        let url =  "https://oncall.oa.com/api/oncall/searchName"
        // let urls = "http://jsoncall.pcg.com/api/oncall/searchName"

        // let urlss = "https://jsoncall.pcg.com/api/oncall/searchName"

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
            console.log(response)
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
    onReduceTypeChange(v){
     
        console.log(v)
        this.setState({
            reduce_type: v,
        })
    }
    async newagetRates() {

        const urlsx = `${APIURL}/capacity/newMenu`;

        var that = this;
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {


                console.log(response.data.data);

                let array_one = []
                if (response.data.data) {

                    that.setState({
                        eventChain: response.data.data

                    })

                    for (let h = 0; h < response.data.data.length; h++) {
                        let obj_one = {}
                        obj_one.label = response.data.data[h].cateName;
                        obj_one.value = response.data.data[h].cate;
                        obj_one.children = []
                        array_one.push(obj_one)


                        let array_two = []
                        if (response.data.data[h].menu) {

                            for (let j = 0; j < response.data.data[h].menu.length; j++) {
                                let obj_two = {}
                                obj_two.label = response.data.data[h].menu[j].pName;
                                obj_two.value = response.data.data[h].menu[j].pType;

                                array_two.push(obj_two)



                                let array_three = []


                                if (response.data.data[h].menu[j].menu && response.data.data[h].menu[j].menu.length >= 1 && response.data.data[h].menu[j].menu[0].cate) {

                                    for (let k = 0; k < response.data.data[h].menu[j].menu.length; k++) {
                                        let obj_three = {}
                                        obj_three.label = response.data.data[h].menu[j].menu[k].subName;
                                        obj_three.value = response.data.data[h].menu[j].menu[k].subType;
                                        array_three.push(obj_three)
                                    }
                                    array_two[j].children = array_three

                                } else {
                                    let obj_three = {}
                                    obj_three.label = "_";
                                    obj_three.value = "_";
                                    array_three.push(obj_three)
                                }


                            }
                            array_one[h].children = array_two
                        }
                        // new menus
                        that.setState({
                            eventChainChildren: array_one

                        })
                    }


                    console.log(array_one);


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


    dellinkitm(i) {
 
        let index = tem.indexOf(i);
        if (index > -1) {
            tem.splice(index, 1);
        }


        this.setState({
            link_infa: tem
        })
        console.log(this.state.link_infa);
    }
    linkinfcarray() {
        ct++;
        tem.push('a' + ct);
        this.setState({
            link_infa: tem
        })
        console.log(this.state.link_infa);
    }

     



    hideModal() {


        this.props.openmodals(false)
        this.props.refreshlist(true)
        console.log(this.props)
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
        console.log('Success:', values);

        console.log(this.state.link_infa);
        templinkar.push(values.link_infc)

        for (let i = 0; i < this.state.link_infa.length; i++) {
            console.log(this.state.link_infa[i])
            let tempname = "link_infc" + this.state.link_infa[i];
            templinkar.push(values[tempname]);
        }

        console.log(templinkar);


        var deduplication = []
        for (let s = 0; s < templinkar.length; s++) {

            deduplication.push(JSON.stringify(templinkar[s]));

        }

        console.log(deduplication)

        var tmparr = []
        for (let z = 0; z < deduplication.length; z++) {
            if (tmparr.indexOf(deduplication[z]) === -1) {
                tmparr.push(deduplication[z])
            } else {
                console.log(deduplication[z] + "重复")
               
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
            console.log(deduplication);
        }


        for (let s = 0; s < templinkar.length; s++) {
            this.finishlinkinfos(templinkar[s]);


        }

        this.setState({
            event_name: values.event_name,
            event_type: values.event_type,
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

        console.log(this.state.end_time <= this.state.start_time)

        if (this.state.end_time <= this.state.start_time && values.event_type == 1) {
             
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
        console.log(ts, ta)
        this.setState({

            end_time: ta,

        })
        console.log(this.state)
    }

    onChangetm(ts, ta) {
        console.log(ts, ta)
        this.setState({
            start_time: ta,


        })
        console.log(this.state)
    }

    async eventInfonewBuild(v) {
        console.log(v)

        this.setState({

            btndisabled: true,
        })
        let url = `${APIURL}/eventInfo/create`;

        var bodyFormData = new FormData();
        bodyFormData.append("event_name", v.event_name);
        bodyFormData.append("event_type", v.event_type);
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

                    if (that.state.event_type == 2) {

                        that.props.gotocapacity(response.data.auto_id)
                    } else {
                        that.props.openmodals(false)
                        that.props.refreshlist(true)
                    }
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
                that.setState({
                    btndisabled: false,
                })
            })

    }



    onEventTypeChange = (value) => {
        console.log(value)

        this.setState({
            event_type: value,
        });
        console.log(this.state.event_type)
    };


    finishlinkinfos(value) {


        if (value.length == 2) {
            for (let i = 0; i < this.state.eventChain.length; i++) {


                if (value[0] === this.state.eventChain[i].cate) {




                    for (let j = 0; j < this.state.eventChain[i].menu.length; j++) {



                        if (value[1] === this.state.eventChain[i].menu[j].pType) {




                            let sob = this.state.eventChain[i].menu[j];
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
            for (let k = 0; k < this.state.eventChain.length; k++) {


                if (value[0] === this.state.eventChain[k].cate) {




                    for (let l = 0; l < this.state.eventChain[k].menu.length; l++) {



                        if (value[1] === this.state.eventChain[k].menu[l].pType) {



                            for (let f = 0; f < this.state.eventChain[k].menu[l].menu.length; f++) {




                                if (value[2] === this.state.eventChain[k].menu[l].menu[f].subType) {


                                    console.log(this.state.eventChain[k].menu[l].menu[f])

                                    okt.push(this.state.eventChain[k].menu[l].menu[f])
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

    origfinishlinkinfos(value) {



        for (let i = 0; i < this.state.eventChain.length; i++) {


            if (value[0] === this.state.eventChain[i].cate) {




                for (let j = 0; j < this.state.eventChain[i].menu.length; j++) {



                    if (value[1] === this.state.eventChain[i].menu[j].type) {



                        for (let f = 0; f < this.state.eventChain[i].menu[j].subMenu.length; f++) {




                            if (value[2] === this.state.eventChain[i].menu[j].subMenu[f].subType) {


                                console.log(this.state.eventChain[i].menu[j].subMenu[f])

                                okt.push(this.state.eventChain[i].menu[j].subMenu[f])
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

    onChangea = (value) => {


        console.log(value)


    }



    onBlur = (e) => {

        console.log(e)

        this.eventInfofilemap(e.target.value)
    };

    async eventInfofilemap(e) {

        let url = `${APIURL}/eventInfo/fieldMap`;

        var bodyFormData = new FormData();
        bodyFormData.append("url", e);
        let that = this

        if (e && e.length >= 1) {
            await axios.post(url, bodyFormData, { withCredentials: true })
                .then(function (response) {
                    console.log(response)
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
                        <Row>
                            <Col span={24} className="eventtypequest">


                                <Form.Item name="event_type"

                                    label="事件类型"
                                    rules={[{ required: true }]}

                                    tooltip={{ title: "手动运营事件：用于单次事件/活动使用，例如：演唱会、阅兵、春节活动等。  自动推送事件：用于重复且程序可自动触发的事件类型，例如：nba、push、热剧等。", overlayClassName: "numericinput" }}
                                >


                                    <Select
                                        placeholder="请选择事件类型"
                                        onChange={this.onEventTypeChange}
                                        allowClear

                                    >

                                        <Option value="1"> 手动运营事件 </Option>
                                        <Option value="2"> 自动推送事件 </Option>

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
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


                        {this.state.event_type == 2 ? (

                            <Form.Item
                                label="父事件"
                            >
                                <Input disabled />
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
                            label="负责人_测试接口！"
                            name="mention_event_users"
                            rules={[{ required: true }]}
                        >

                            <Mentions style={{ width: '100%' }} placement="bottom"  onChange={this.monChange}>
                                {this.state.mentionlist.map((a, index) =>
                                    <Option value={a.name_en} key={index}> {a.name_en +"-"+a.name_zn}</Option>
                                )}
                            </Mentions>

                        </Form.Item>


                      
                        <Form.Item
                            label="负责人"
                            name="event_users"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        {this.state.event_type == 1 ? (
                            <Row>
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
                                            label="容量指标"
                                            name="capacity_quota"
                                            rules={[{ required: true }]}
                                        >


                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="单位容量"
                                            name="unit_capacity"
                                            rules={[{ required: true }]}
                                        >
                                            <InputNumber />
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

                                        </Select>

                                    </Form.Item>
                                    
                                </Col>
                                </Row>
                            </div>
                        ) : ("")}
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label="实时数据url"
                                    name="op_url"
                                >
                                    <Input onBlur={this.onBlur} />
                                </Form.Item>
                            </Col>
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
                                                <Option value="1" key="00z">Not Identified</Option>
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

                        {this.state.event_type == 2 ? (
                            <Row>

                                <Col span={12} className="eventtypequest">

                               
                                <Form.Item
                                    label="缩容方式"
                                    name="reduce_type"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        onChange={this.onReduceTypeChange}
                                    >
                                        <Option value="1"> 按N小时后缩容 </Option>
                                        <Option value="2"> 按指定缩容时间 </Option>
                                        
                                    </Select>
                                </Form.Item>
                                </Col>
                                <Col span={12} className="eventtypequest">

                                    {this.state.reduce_type == 2 ? (
                                        <div>

                                       
                                            <Form.Item
                                                label="延时缩容"
                                                name="reduce_time"
                                                initialValue="04:00"
                                            >
                                                 

                                                 <Select>
                                                    <Option value="00:00"> 00:00 </Option>
                                                    <Option value="01:00"> 01:00 </Option>
                                                    <Option value="02:00"> 02:00 </Option>
                                                    <Option value="03:00"> 03:00 </Option>
                                                    <Option value="04:00"> 04:00 </Option>
                                                    <Option value="05:00"> 05:00 </Option>
                                                    <Option value="06:00"> 06:00 </Option>
                                                    <Option value="07:00"> 07:00 </Option>
                                                    <Option value="08:00"> 08:00 </Option>
                                                    <Option value="09:00"> 09:00 </Option>
                                                    <Option value="10:00"> 10:00 </Option>
                                                    <Option value="11:00"> 11:00 </Option>
                                                    <Option value="12:00"> 12:00 </Option>
                                                    <Option value="13:00"> 13:00 </Option>
                                                    <Option value="14:00"> 14:00 </Option>
                                                    <Option value="15:00"> 15:00 </Option>
                                                    <Option value="16:00"> 16:00 </Option>
                                                    <Option value="17:00"> 17:00 </Option>
                                                    <Option value="18:00"> 18:00 </Option>
                                                    <Option value="19:00"> 19:00 </Option>
                                                    <Option value="20:00"> 20:00 </Option>
                                                    <Option value="21:00"> 21:00 </Option>
                                                    <Option value="22:00"> 22:00 </Option>
                                                    <Option value="23:00"> 23:00 </Option>

                                                </Select>

                                             </Form.Item>
                                        </div>
                                    ): (
                                        <div>

                                        
                                            <Form.Item
                                                label="N小时后缩容"
                                                name="delay_time"
                                                initialValue={2}
                                            >
                                                <Select>
                                                    <Option value="2"> 2 </Option>
                                                    <Option value="4"> 4 </Option>
                                                    <Option value="6"> 6 </Option>
                                                    <Option value="12"> 12 </Option>
                                                </Select>
                                            </Form.Item>
                                            
                                    </div>
                                    )}
                                   
                                   
                                </Col>
                              
 
                            </Row>
                        ) : ("")}


                        {this.state.eventChainChildren ? (

                            <div>
                                <Row>

                                    <Col span={12}>

                                        <Form.Item label="活动链路" name="link_infc" rules={[{ required: true }]}>





                                            <Cascader options={this.state.eventChainChildren} onChange={this.onChangea} placeholder="Please select" key="-1"   allowClear={false} />

                                        </Form.Item>

                                    </Col>
                                    <Col span={4}>
                                        <div id="addicons">
                                            <PlusCircleOutlined onClick={this.linkinfcarray} />
                                        </div>
                                    </Col>
                                </Row>




                                {  this.state.link_infa.map((a, index) =>
                                    <Row key={a}>


                                        <Col span={12}>
                                            <div className="addeditms">


                                                <Form.Item name={`link_infc` + a} rules={[{ required: true }]} key={a}>
                                                    <Cascader options={this.state.eventChainChildren} onChange={this.onChangea} placeholder="Please select" key={a} />
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


                </Modal>
            </div>
        )
    }
}



export default CreateEvent;