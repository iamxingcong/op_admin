import React from 'react';

import { Button, Modal, Form, Input, Select, Row, Col,   InputNumber, Cascader, notification, Spin } from 'antd';
 
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
            event_type: 2,
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
                message: '??????',
                description: '????????????????????????????????????',
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
                    message: '??????',
                    description: '??????????????????????????????',
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
            event_type: 2,
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

     

        
            this.eventInfonewBuild(values)
         



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
        bodyFormData.append("event_type", 2);
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
                        message: '??????',
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
                        message: '??????',
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
                            message: '??????',
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
                    title={`????????????`}

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
                            label="????????????"
                            name="event_name"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        

                     

                      
                        <Form.Item
                            label="?????????"
                            name="event_users"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        


                        <Row>
                            <Col span={24} id="specialhrefs">
                                <div className="ant-col ant-form-item-label">
                                    <label title="???????????????(??????)">
                                        ???????????????(<a target="_blank" rel="noreferrer" href="https://iwiki.woa.com/pages/viewpage.action?pageId=1132901246">??????</a>)
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
                                            label="????????????"
                                            name="capacity_quota"
                                            rules={[{ required: true }]}
                                        >


                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="????????????"
                                            name="unit_capacity"
                                            rules={[{ required: true , message: "????????????????????????????????????"}]}
                                        >
                                            <InputNumber    onBlur={this.unitcapacity} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}  className="eventtypequest">
                                    
                                    <Form.Item
                                        label="??????????????????"
                                        name="expand_max_rate"
                                        rules={[{ required: true }]}
                                        tooltip={{ title: "???????????????????????????50?????????????????????????????????100%?????????????????????????????????????????????50??????", overlayClassName: "expandcrsinput" }}
                                    >


                                        <Select
                                            placeholder="??????????????????????????????????????????????????????"
                                        >
                                          
                                            <Option value="30"> 30 </Option>
                                            <Option value="50">  50 </Option>
                                            <Option value="100">  100  </Option>
                                            <Option value="200">  200 </Option>
                                            <Option value="0"> ????????? </Option>

                                        </Select>

                                    </Form.Item>
                                    
                                </Col>
                                </Row>
                            </div>
                        ) : ("")}
                        <Row>
                           
                            <Col span={12}>
                                {this.state.filemap ? (
                                    <div>

                                        <Form.Item
                                            label="????????????"
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

                        {this.state.event_type == 2 ? (
                            <Row>

                                <Col span={12} className="eventtypequest">

                               
                                <Form.Item
                                    label="????????????"
                                    name="reduce_type"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        onChange={this.onReduceTypeChange}
                                    >
                                        <Option value="1"> ???N??????????????? </Option>
                                        <Option value="2"> ????????????????????? </Option>
                                        
                                    </Select>
                                </Form.Item>
                                </Col>
                                <Col span={12} className="eventtypequest">

                                    {this.state.reduce_type == 2 ? (
                                        <div>

                                       
                                            <Form.Item
                                                label="????????????"
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
                                                label="N???????????????"
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


                        {this.props.eventChainChildren ? (

                            <div>
                                <Row>

                                    <Col span={12}>

                                        <Form.Item label="????????????" name="link_infc" rules={[{ required: true }]}>





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
                                    ??????
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



export default CreateEvent;