import React from 'react';

import { Button, Modal, Form, Input, Select, Row, Col, InputNumber, Cascader, notification } from 'antd';

import {

    MinusCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';


import moment from 'moment';

import axios from "axios";

import { APIURL } from '../../common/constdt.js'


const { Option } = Select;

var tempar = []



class EditEventCapacity extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

            filemap: false,
            mapdt: null,


            eventChainChildren: null,
            eventChain: null,
            province: "",

            event_name: "",
            event_type: null,
            event_users: "",
            pid: "",

            start_time: "",
            end_time: "",
            op_url: "",
            url_field: "",
            op_quota: 0,
            op_pre_value: 0,
            capacity_quota: 0,
            unit_capacity: 0,
            delay_time: 0,
            link_info: null,
            webhook: null,
            clink_info: null,
            temp_link_list: null,
            linkinfotouched: false,
            reduce_type: null,
            btndisabled: false,
        }

        this.hideModal = this.hideModal.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onChangea = this.onChangea.bind(this)
        this.linkinfcarray = this.linkinfcarray.bind(this);
        this.linkinfcarraysub = this.linkinfcarraysub.bind(this)
        this.onReduceTypeChange = this.onReduceTypeChange.bind(this)
    }

    componentDidMount() {
        this.newagetRates();
    }

    onReduceTypeChange(v) {

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

    hideModal() {

        this.props.openmodals(false)

    };

    onFinish(values) {
         
       
        console.log('Success:', values);

        let templinkar = []
        tempar = []


        this.setState({


            event_name: values.event_name,
            event_type: values.event_type,
            event_users: values.event_users,
            pid: values.pid,
            reduce_type: values.reduce_type,
            reduce_time: values.reduce_time,

            op_url: values.op_url,
            url_field: values.url_field,
            op_quota: values.op_quota,
            op_pre_value: values.op_pre_value,
            capacity_quota: values.capacity_quota,
            unit_capacity: values.unit_capacity,

            delay_time: values.delay_time,
            expand_max_rate: values.expand_max_rate,
            webhook: values.webhook


        })




        var deduplication = []
        var tmparr = []

        console.log("----")
        console.log(this.state.temp_link_list)
         
        if (this.state.temp_link_list) {
            for (let i = 0; i < this.state.temp_link_list.length; i++) {

                let tmname = "link_info" + i;
                let tempname = values[tmname];

                templinkar.push(tempname);
                deduplication.push(JSON.stringify(tempname));
            }


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
            this.eventInfonewBuild(values)


        } else {
            for (let z = 0; z < this.props.link_list.length; z++) {

                let tmname = "link_info" + z;
                let tempname = values[tmname];

                templinkar.push(tempname);
                deduplication.push(JSON.stringify(tempname));
            }

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
            this.eventInfonewBuild(values)

        }

    }



    async eventInfonewBuild(v) {

        this.setState({

            btndisabled: true,
        })
        
        let url = `${APIURL}/eventInfo/update`;

        var bodyFormData = new FormData();


        bodyFormData.append("event_name", this.state.event_name);
        bodyFormData.append("event_type", this.state.event_type);
        bodyFormData.append("event_users", this.state.event_users);
        bodyFormData.append("event_id", this.props.detail.id);
        bodyFormData.append("is_retain", 0);

        if (this.state.webhook) {
            bodyFormData.append("webhook", this.state.webhook);
        }
        if (v.pid) {
            bodyFormData.append("pid", v.pid);
        }



        if (this.state.start_time) {
            bodyFormData.append("start_time", this.state.start_time);

        }

        if (this.state.end_time) {

            bodyFormData.append("end_time", this.state.end_time);
        }

        if (this.state.op_url) {
            bodyFormData.append("op_url", this.state.op_url);
        }


        if (this.state.url_field) {
            bodyFormData.append("url_field", this.state.url_field);
        }

        if (this.state.op_quota) {
            bodyFormData.append("op_quota", this.state.op_quota);
        }

        if (this.state.op_pre_value) {
            bodyFormData.append("op_pre_value", this.state.op_pre_value);
        }


        if (this.state.capacity_quota) {
            bodyFormData.append("capacity_quota", this.state.capacity_quota);
        }


        if (this.state.unit_capacity) {
            bodyFormData.append("unit_capacity", this.state.unit_capacity);
        }

        if (this.state.delay_time) {
            bodyFormData.append("delay_time", this.state.delay_time);
        }

        if (v.reduce_time) {
            bodyFormData.append("reduce_time", v.reduce_time);
        }
        if (v.reduce_type) {
            bodyFormData.append("reduce_type", v.reduce_type);
        }

        if (this.state.expand_max_rate) {
            bodyFormData.append("expand_max_rate", this.state.expand_max_rate);
        }

        console.log(this.state.clink_info)

        if (this.state.clink_info) {
            bodyFormData.append("link_info", JSON.stringify(this.state.clink_info));
        }





        var that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {


                if (response.data.code == 0) {

                    notification.success({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });
                    that.hideModal();

                    that.props.openmodals(false)

                    window.location.reload() 
                    

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

                that.setState({
                    btndisabled: false,
                })

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




    onChangea = (value) => {

        console.log(value)
    }

    linkinfcarraysub() {

        console.log('add s+')
        console.log(this.state.temp_link_list)
        console.log(this.props.link_list)


        let templinkar = []



        for (let z = 0; z < this.state.temp_link_list.length; z++) {


            templinkar.push(this.state.temp_link_list[z]);

        }

        templinkar.push([])

        this.setState({

            linkinfotouched: true,
            temp_link_list: templinkar
        })

        console.log(this.state.temp_link_list)


    }

    linkinfcarray() {

        console.log('add s')
        console.log(this.state.temp_link_list)
        console.log(this.props.link_list)

        let templinkar = []

        for (let z = 0; z < this.props.link_list.length; z++) {

            templinkar.push(this.props.link_list[z]);
        }

        templinkar.push([])

        this.setState({

            linkinfotouched: true,
            temp_link_list: templinkar
        })

        console.log(this.state.temp_link_list)


    }

    dellinkitmsubs(i) {

        let tmnewlinks = []
        for (let s = 0; s < this.state.temp_link_list.length; s++) {

            tmnewlinks.push(this.state.temp_link_list[s])

        }

        tmnewlinks.splice(i, 1);

        tempar = []

        this.setState({
            temp_link_list: tmnewlinks,
            clink_info: []
        })
        for (let s = 0; s < tmnewlinks.length; s++) {
            this.finishlinkinfos(tmnewlinks[s]);
        }

    }

    dellinkitm(i) {

        let templinkar = []

        for (let z = 0; z < this.props.link_list.length; z++) {

            let tmname = z + this.props.link_list[z][0];
            if (tmname != i) {
                templinkar.push(this.props.link_list[z]);
            }

        }


        tempar = []

        this.setState({

            linkinfotouched: true,
            temp_link_list: templinkar,
            clink_info: []
        })

    
        for (let s = 0; s < templinkar.length; s++) {
            this.finishlinkinfos(templinkar[s]);
        }

    }


    finishlinkinfos(value) {

         
        console.log( value );
        if(value.length == 2) {
            for (let i = 0; i < this.state.eventChain.length; i++) {


                if (value[0] === this.state.eventChain[i].cate) {




                    for (let j = 0; j < this.state.eventChain[i].menu.length; j++) {



                        if (value[1] === this.state.eventChain[i].menu[j].pType) {




                            let sob = this.state.eventChain[i].menu[j];
                            delete sob.menu
                            console.log(sob)

                            tempar.push(sob)
                            this.setState({
                                clink_info: tempar
                            })


                        }
                    }
                }
            }
        } else  if (value.length == 3 && value[2].length == 0) {
            for (let i = 0; i < this.state.eventChain.length; i++) {


                if (value[0] === this.state.eventChain[i].cate) {




                    for (let j = 0; j < this.state.eventChain[i].menu.length; j++) {



                        if (value[1] === this.state.eventChain[i].menu[j].pType) {




                            let sob = this.state.eventChain[i].menu[j];
                            delete sob.menu
                            console.log(sob)

                            tempar.push(sob)
                            this.setState({
                                clink_info: tempar
                            })


                        }
                    }
                }
            }
        } else if (value.length == 3) {
            for (let k = 0; k < this.state.eventChain.length; k++) {


                if (value[0] === this.state.eventChain[k].cate) {

                    for (let l = 0; l < this.state.eventChain[k].menu.length; l++) {

                        if (value[1] === this.state.eventChain[k].menu[l].pType) {

                            for (let f = 0; f < this.state.eventChain[k].menu[l].menu.length; f++) {

                                if (value[2] === this.state.eventChain[k].menu[l].menu[f].subType) {

                                    console.log(this.state.eventChain[k].menu[l].menu[f])
                                    
                                    tempar.push(this.state.eventChain[k].menu[l].menu[f])
                                    this.setState({
                                        clink_info: tempar
                                    })

                                }
                            }
                        }
                    }
                }
            }
        }else{
            this.setState({
                clink_info: null
            })
        }
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
        await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {

                that.setState({
                    filemap: true,
                    mapdt: response.data.data
                })
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

        return (
            <div id="createevent">

                <Modal
                    title={`编辑事件`}

                    closable
                    maskClosable={false}
                    centered
                    visible={this.props.visible}
                    onCancel={this.hideModal}
                    width={1120}
                    footer={null}
                    destroyOnClose={true}

                >


                    {this.props.detail && this.props.tabledt ? (


                        <Form
                            name="basicx"


                            onFinish={this.onFinish}

                            autoComplete="off"
                            initialValues={{
                                event_type: this.props.detail.event_type,
                                pid: this.props.detail.pid,
                                event_name: this.props.detail.event_name,
                                event_users: this.props.detail.event_users,
                                capacity_quota: this.props.detail.capacity_quota,

                                op_url: this.props.detail.op_url,

                                delay_time: this.props.detail.delay_time,
                                op_pre_value: this.props.detail.op_pre_value,
                                expand_max_rate: this.props.detail.expand_max_rate,
                                end_time: moment(this.props.detail.end_time),
                                start_time: moment(this.props.detail.start_time),
                                op_quota: this.props.detail.op_quota,
                                unit_capacity: this.props.detail.unit_capacity,
                                webhook: this.props.detail.webhook,
                                url_field: this.props.detail.url_field,
                                reduce_type: this.props.detail.reduce_type + "",
                                reduce_time: this.props.detail.reduce_time,


                            }}
                        >

                            <Form.Item name="event_type" label="事件类型" rules={[{ required: true }]} >
                                <Select
                                    placeholder="请选择事件类型"
                                    allowClear
                                    disabled
                                >

                                    <Option value={1}> 手动运营事件 </Option>
                                    <Option value={2}> 自动推送事件 </Option>

                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="事件名称"
                                name="event_name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>


                            {this.props.detail.event_type == 2 ? (

                                <Form.Item
                                    label="父事件"
                                    name="pid"

                                >
                                    <Select
                                        placeholder="--"
                                        disabled
                                    >
                                        <Option value={0}> -- </Option>
                                    </Select>
                                </Form.Item>

                            ) : ("")}





                            <Form.Item
                                label="负责人"
                                name="event_users"

                            >
                                <Input />
                            </Form.Item>

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

                            {this.props.detail.event_type == 2 ? (


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
                                                label="容量单位"
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


                            <div>
                                {this.props.filemap ? (
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label="实时数据url"
                                                name="op_url"
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
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
                                                    {this.props.mapdt ? (
                                                        this.props.mapdt.map(function (i, t) {
                                                            return (<Option value={i} key={t}> {i} </Option>)
                                                        })

                                                    ) : ("")}

                                                </Select>
                                            </Form.Item>
                                        </Col>

                                    </Row>
                                ) : (
                                        ""

                                    )}


                                <Row>
                                    {!this.props.filemap ? (
                                        <Col span={12}>
                                            <Form.Item
                                                label="实时数据url"
                                                name="op_url"
                                            >
                                                <Input onBlur={this.onBlur} />
                                            </Form.Item>
                                        </Col>
                                    ) : ("")}

                                    {this.state.filemap ? (
                                        <Col span={12}>
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
                                        </Col>
                                    ) : (
                                            ""

                                        )}
                                </Row>


                            </div>

                            <div>

                                {this.props.detail.event_type == 2 ? (



                                    <Row>

                                        <Col span={12} className="eventtypequest">


                                            <Form.Item
                                                label="缩容方式"
                                                name="reduce_type"

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

                                            {this.state.reduce_type ? (



                                                this.state.reduce_type == 2 ? (




                                                    <div>


                                                        <Form.Item
                                                            label="延时缩容"
                                                            name="reduce_time"

                                                            tooltip="按指定缩容时间"
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
                                                ) : (
                                                        <div>


                                                            <Form.Item
                                                                label="N小时后缩容"
                                                                name="delay_time"

                                                                tooltip="从扩容完毕开始计算，X小时后缩容"
                                                            >
                                                                <Select>
                                                                    <Option value="2"> 2 </Option>
                                                                    <Option value="4"> 4 </Option>
                                                                    <Option value="6"> 6 </Option>
                                                                    <Option value="12"> 12 </Option>
                                                                </Select>
                                                            </Form.Item>

                                                        </div>
                                                    )


                                            ) : (


                                                    this.props.detail.reduce_type == 2 ? (




                                                        <div>


                                                            <Form.Item
                                                                label="延时缩容"
                                                                name="reduce_time"

                                                                tooltip="按指定缩容时间"
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
                                                    ) : (
                                                            <div>


                                                                <Form.Item
                                                                    label="n小时后缩容"
                                                                    name="delay_time"

                                                                    tooltip="从扩容完毕开始计算，X小时后缩容"
                                                                >
                                                                    <Select>
                                                                        <Option value="2"> 2 </Option>
                                                                        <Option value="4"> 4 </Option>
                                                                        <Option value="6"> 6 </Option>
                                                                        <Option value="12"> 12 </Option>
                                                                    </Select>
                                                                </Form.Item>

                                                            </div>
                                                        )

                                                )}



                                        </Col>


                                    </Row>
                                ) : ("")}

                            </div>

                            <div>



                                {this.props.link_list && this.props.link_list.length >= 1 ? (

                                    this.state.eventChainChildren && !this.state.linkinfotouched ? (

                                        <div>



                                            {  this.props.link_list.map((a, index) =>
                                                <Row key={index + a[0]}>


                                                    <Col span={12}>
                                                        <div className="editeditms">


                                                            <Form.Item label={index == 0 ? "活动链路" : ""} initialValue={a} name={`link_info` + index} key={index + a[0]} rules={[{ required: true }]}>
                                                                <Cascader options={this.state.eventChainChildren} onChange={this.onChangea} placeholder="Please select" key={index + a[0]}  allowClear={false} />
                                                            </Form.Item>
                                                        </div>
                                                    </Col>
                                                    <Col span={4}>
                                                        <div className="deliconsitm">
                                                            {index == 0 ? (
                                                                <PlusCircleOutlined onClick={this.linkinfcarray} />
                                                            ) : (
                                                                    <MinusCircleOutlined onClick={() => this.dellinkitm(index + a[0])} />
                                                                )}


                                                        </div>
                                                    </Col>

                                                </Row>
                                            )}

                                        </div>


                                    ) : (

                                            this.state.temp_link_list && this.state.temp_link_list.length >= 1 ? (
                                                this.state.temp_link_list.map((a, index) =>
                                                    <Row key={index}>


                                                        <Col span={12}>
                                                            <div className="editeditms">


                                                                <Form.Item label={index == 0 ? "活动链路" : ""} initialValue={a} name={`link_info` + index} key={index + a[0]} rules={[{ required: true }]}>
                                                                    <Cascader options={this.state.eventChainChildren} onChange={this.onChangea} placeholder="Please select"  allowClear={false}  />
                                                                </Form.Item>
                                                            </div>
                                                        </Col>
                                                        <Col span={4}>
                                                            <div className="deliconsitm">


                                                                {index == 0 ? (

                                                                    <PlusCircleOutlined onClick={this.linkinfcarraysub} />

                                                                ) : (
                                                                        <MinusCircleOutlined onClick={() => this.dellinkitmsubs(index)} />
                                                                    )}

                                                            </div>
                                                        </Col>

                                                    </Row>
                                                )
                                            ) : ("")

                                        )


                                ) : (

                                        <Row>
                                            <Col span={12}>

                                                <Form.Item name="link_info0" label="活动链路" rules={[{ required: true }]}>
                                                    <Cascader options={this.state.eventChainChildren} onChange={this.onChangea} placeholder="Please select" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )}



                            </div>


                            <Form.Item wrapperCol={{ offset: 3, span: 21 }}>

                                <div id="btnright">

                                    <Button type="primary" htmlType="submit"   disabled={this.state.btndisabled}>
                                        提交
                                    </Button>
                                </div>

                            </Form.Item>
                        </Form>




                    ) : ("")}



                </Modal>


            </div>
        )
    }
}



export default EditEventCapacity;