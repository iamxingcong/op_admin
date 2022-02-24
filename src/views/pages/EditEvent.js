import React   from 'react';

import { Button, Modal, Form, Input, Select, Row, Col, DatePicker, InputNumber, Cascader, notification , Spin  } from 'antd';

import {
    
    MinusCircleOutlined,
    PlusCircleOutlined,
    LoadingOutlined,

  } from '@ant-design/icons';


import moment from 'moment';

import axios from "axios";

import { APIURL } from '../../common/constdt.js'


const { Option } = Select;


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


 
let tempar = []



class EditEvent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

            filemap: false,
            mapdt: null,

      
            eventChainChildren: null,
            eventChain: null,
            province: "",

            event_name: "",
            event_type: 0,
            event_users: "",
            pid: "",
            event_desc: null,
            start_time: "",
            end_time: "",
            op_url: "",
            url_field: "",
            op_quota: 0,
            op_pre_value: 0,
            capacity_quota: 0,
            unit_capacity: 0,
            capacity_pre_value: 0.0,
            delay_time: 0,
            link_info: null,
            btndisabled: false,
        
            clink_info: null,
       
            temp_link_list: null,
         
            linkinfotouched: false

        }

        this.hideModalcls = this.hideModalcls.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.onFinish = this.onFinish.bind(this);

        this.onChangetm = this.onChangetm.bind(this)
        this.onChangetmb = this.onChangetmb.bind(this)
        this.onOk = this.onOk.bind(this)
        this.onChangea = this.onChangea.bind(this)

 

        this.linkinfcarray = this.linkinfcarray.bind(this);
        this.linkinfcarraysub = this.linkinfcarraysub.bind(this)
    }

   



    hideModal() {

       

        this.props.openmodals(false)
        

    };

    hideModalcls() {
        this.props.openmodalsocls(false)
    }



    onFinish(values) {
     

        let templinkar = []
        tempar = []
  

        var deduplication = []
        var tmparr = []

        if(this.state.temp_link_list){
            for(let i = 0; i < this.state.temp_link_list.length; i++){
         
                let tmname = "link_info"+i;
                let tempname = values[tmname];
                
                templinkar.push(tempname);
                deduplication.push(JSON.stringify(tempname));
            }
    
            

            
            for(let z = 0; z < deduplication.length; z++){
                if( tmparr.indexOf(deduplication[z] ) === -1){
                    tmparr.push(deduplication[z])
                } else {
                    console.log(deduplication[z]+"重复")
                   
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
    
    

    
            for(let s = 0; s < templinkar.length;s++){
                this.finishlinkinfos(templinkar[s]);
            }

        } else {
            for(let z = 0; z < this.props.link_list.length; z++){
         
                let tmname = "link_info"+z;
                let tempname = values[tmname];
                
                templinkar.push(tempname);
                deduplication.push(JSON.stringify(tempname));
            }

               
            for(let z = 0; z < deduplication.length; z++){
                if( tmparr.indexOf(deduplication[z] ) === -1){
                    tmparr.push(deduplication[z])
                } else {
                    console.log(deduplication[z]+"重复")
                  
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
    
    
            for(let s = 0; s < templinkar.length;s++){
                this.finishlinkinfos(templinkar[s]);
            }
        }
      
        if(this.props.detail.id == values.pid){
            notification.error({
                message: '提示',
                description: '父事件不能为自己！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
            return false;
        }

       
        this.setState({

  
            event_name: values.event_name,
            event_type: values.event_type,
            event_users: values.event_users,
            pid: values.pid,
            event_desc: values.event_desc,
            end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
            start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
            op_url: values.op_url,
            url_field: values.url_field,
            op_quota: values.op_quota,
            op_pre_value: values.op_pre_value,
            capacity_quota: values.capacity_quota,
            unit_capacity: values.unit_capacity,
            capacity_pre_value: values.capacity_pre_value,
            delay_time: values.delay_time,
            webhook: values.webhook,
      
             

        })
        
       
   
        if(this.state.end_time <= this.state.start_time  && values.event_type == 1){
            
            notification.error({
                message: '提示',
                description:  '结束时间不能早于或等于开始时间！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });

            return false;
        } else {
            this.eventInfonewBuild()
        }

       
    }


     
    

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

    async eventInfonewBuild() {
  
        this.setState({

            btndisabled: true,
        })
        
        let url = `${APIURL}/eventInfo/update`;

        var bodyFormData = new FormData();

        // 1 不保留，0 保留
        bodyFormData.append("is_retain", 0);
        bodyFormData.append("event_name", this.state.event_name);
        bodyFormData.append("event_type", this.state.event_type);
        bodyFormData.append("event_users", this.state.event_users);
        bodyFormData.append("event_id", this.props.detail.id);

        if (this.state.pid) {
            bodyFormData.append("pid", this.state.pid);
        }

        if(this.state.webhook){
            bodyFormData.append("webhook", this.state.webhook);
        } else {
            bodyFormData.append("webhook", '');
        }


        if(this.state.event_desc){
            bodyFormData.append("event_desc", this.state.event_desc);
        }
        
        if (this.state.start_time) {
            bodyFormData.append("start_time", this.state.start_time);

        }

        if (this.state.end_time) {

            bodyFormData.append("end_time", this.state.end_time);
        }

        if(this.state.op_url){
            bodyFormData.append("op_url", this.state.op_url);
        }
        

        if (this.state.url_field) {
            bodyFormData.append("url_field", this.state.url_field);
        }

        if (this.state.op_quota) {
            bodyFormData.append("op_quota", this.state.op_quota);
        }

        if(this.state.op_pre_value){
            bodyFormData.append("op_pre_value", this.state.op_pre_value);
        }
        

        if (this.state.capacity_quota) {
            bodyFormData.append("capacity_quota", this.state.capacity_quota);
        }


        if (this.state.unit_capacity) {
            bodyFormData.append("unit_capacity", this.state.unit_capacity);
        }
        if (this.state.capacity_pre_value) {
            bodyFormData.append("capacity_pre_value", this.state.capacity_pre_value);
        }
        if (this.state.delay_time) {
            bodyFormData.append("delay_time", this.state.delay_time);
        }
    
    
       

        if(this.state.clink_info){
            bodyFormData.append("link_info", JSON.stringify(this.state.clink_info));
        }
       



        let that = this;
         
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
                    description: "网络接口错误！",
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
       
    };

    onChangea = (value) => {
 
     
        console.log(value)

     
    }

    linkinfcarraysub(){
   

        let templinkar = []

       

        for(let z = 0; z < this.state.temp_link_list.length; z++){
         
         
                templinkar.push(this.state.temp_link_list[z]);
            
            
            
        }

        templinkar.push([])

        this.setState({
  
            linkinfotouched: true,
            temp_link_list: templinkar
        })

      

       
     }

    linkinfcarray(){


        let templinkar = []

       

        for(let z = 0; z < this.props.link_list.length; z++){
         
         
                templinkar.push(this.props.link_list[z]);
            
            
            
        }

        templinkar.push([])

        this.setState({
  
            linkinfotouched: true,
            temp_link_list: templinkar
        })

      

       
     }
 
    dellinkitmsubs(i){
        
        let tmnewlinks = []
        for(let s = 0; s < this.state.temp_link_list.length; s++){
                 
                tmnewlinks.push(this.state.temp_link_list[s])
            
        }
      

         
        tmnewlinks.splice(i, 1);
      
        tempar = []
        this.setState({
            temp_link_list: tmnewlinks
        })
        
        for(let s = 0; s < tmnewlinks.length;s++){
            this.finishlinkinfos(tmnewlinks[s]);
        }
    }

    dellinkitm(i){
       
         
        let templinkar = []

       

        for(let z = 0; z < this.props.link_list.length; z++){
         
            let tmname = z+this.props.link_list[z][0];
            if(tmname != i){
                templinkar.push(this.props.link_list[z]);
            }
            
            
        }

        tempar = []

        this.setState({
  
            linkinfotouched: true,
            temp_link_list: templinkar
        })


        for(let s = 0; s < templinkar.length;s++){
            this.finishlinkinfos(templinkar[s]);
        }
        
    }


    finishlinkinfos(value) {

         
       
        if(value.length == 2) {
            for (let i = 0; i < this.props.eventChain.length; i++) {


                if (value[0] === this.props.eventChain[i].cateName) {




                    for (let j = 0; j < this.props.eventChain[i].menu.length; j++) {



                        if (value[1] === this.props.eventChain[i].menu[j].pName) {




                            let sob = this.props.eventChain[i].menu[j];
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
            for (let i = 0; i < this.props.eventChain.length; i++) {


                if (value[0] === this.props.eventChain[i].cateName) {




                    for (let j = 0; j < this.props.eventChain[i].menu.length; j++) {



                        if (value[1] === this.props.eventChain[i].menu[j].pName) {




                            let sob = this.props.eventChain[i].menu[j];
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
            for (let k = 0; k < this.props.eventChain.length; k++) {


                if (value[0] === this.props.eventChain[k].cateName) {

                    for (let l = 0; l < this.props.eventChain[k].menu.length; l++) {

                        if (value[1] === this.props.eventChain[k].menu[l].pName) {

                            for (let f = 0; f < this.props.eventChain[k].menu[l].menu.length; f++) {

                                if (value[2] === this.props.eventChain[k].menu[l].menu[f].subName) {

                                    
                                    
                                    tempar.push(this.props.eventChain[k].menu[l].menu[f])
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
                    onCancel={this.hideModalcls}
                    width={1120}
                    footer={null}
                    destroyOnClose={true}

                >


                    {this.props.detail && this.props.tabledt  ? (


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
                                event_desc: this.props.detail.event_desc,
                                op_url: this.props.detail.op_url,
                                capacity_pre_value: this.props.detail.capacity_pre_value,
                                delay_time: this.props.detail.delay_time,
                                op_pre_value: this.props.detail.op_pre_value,
                                expand_max_rate: this.props.detail.expand_max_rate,
                                end_time: moment(this.props.detail.end_time),
                                start_time: moment(this.props.detail.start_time),
                                op_quota: this.props.detail.op_quota,
                                unit_capacity: this.props.detail.unit_capacity,
                                webhook: this.props.detail.webhook,
                                url_field: this.props.detail.url_field,
                                
                                
                            }}
                        >

                            <Form.Item name="event_type" label="事件类型" rules={[{ required: true }]} >
                                <Select
                                    placeholder="请选择事件类型"
                                    onChange={this.onEventTypeChange}
                                    allowClear
                                    disabled
                                >

                                    <Option value={1}> 临时性事件 </Option>
                                    <Option value={2}> 周期性事件 </Option>

                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="事件名称"
                                name="event_name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            {this.props.detail.event_type == 1 ? (

                                <Form.Item
                                    label="父事件"
                                    name="pid"
                                >

                                    <Select
                                        placeholder="请选择父事件"
                                    >

                                        { 

                                            this.props.tabledt.map(function (itm) {
                                                return (
                                                    <Option value={itm.id} key={itm.id}> {itm.event_name} </Option>
                                                )
                                            })
                                           
                                        }

                                        <Option value={0}> -- </Option>

                                    </Select>
                                </Form.Item>

                            ) : ("")}


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


                            {this.props.detail.event_type == 1 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label="开始时间"
                                            name="start_time"
                                           
                                        >

                                            <DatePicker   format="YYYY-MM-DD HH:mm:ss" showTime onChange={this.onChangetm} onOk={this.onOk} />
                                        </Form.Item>

                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="结束时间"
                                            name="end_time"
                                           
                                        >

                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime onChange={this.onChangetmb} onOk={this.onOk} />
                                        </Form.Item>

                                    </Col>
                                </Row>

                            ) : ("")}


                            <Form.Item
                                label="负责人"
                                name="event_users"
                                
                            >
                                <Input />
                            </Form.Item>
                            {this.props.detail.event_type == 1 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label="运营指标"
                                            name="op_quota"
                                           
                                        >
                                           
                                            <Select>
                                                <Option value="1"> 同时在线 </Option>
                                                <Option value="2"> qps </Option>
                                            
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="预估值"
                                            name="op_pre_value"

                                        >
                                            <InputNumber />
                                        </Form.Item>
                                    </Col>
                                </Row>

                            ) : ("")}

                            <Row>
                                 

                                <Col span={24} id="specialhrefs">
                                    <div className="ant-col ant-form-item-label">
                                        <label  title="报警机器人(帮助)">
                                           报警机器人(<a target="_blank" rel="noreferrer"  href="https://iwiki.woa.com/pages/viewpage.action?pageId=1132901246">帮助</a>)
                                        </label>
                                    </div>
                                      
                                <Form.Item
                                    label=""
                                    name="webhook"
                                    
                                >
                                

                                <Input  placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=0bd9a136-96a0-44fc-af07-c64e17ad0a71"  />
                                </Form.Item>
                                </Col>
                            
                            </Row>
                            
                            {this.props.detail.event_type == 2 ? (
                                <div>

                                    
                                    <Row>
                                          <Col span={12}>
                                            <Form.Item
                                                label="运营指标"
                                                name="capacity_quota"
                                                 
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col> 
                                        <Col span={12}>
                                            <Form.Item
                                                label="运营单位"
                                                name="unit_capacity"

                                            >
                                                <InputNumber />
                                            </Form.Item>
                                        </Col> 
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item
                                                label="容量预估值"
                                                name="capacity_pre_value"
                                                
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                     
                                </div>
                            ) : ("")}
                            

                                
                           
                               <div>
                                            
                                    {this.props.detail.event_type == 2 ? (
                                        <Row>
                                            <Col span={8}>

                                                <Form.Item
                                                    label="缩容延时"
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
                                            </Col>
                                            <Col span={8}>
                                                <span className="lineh32">
                                                    小时后缩容
                                                </span>
                                            </Col>
                                        </Row>
                                    ) : ("")}

                            </div>  
                            
                            <div>


                           
                           {this.props.link_list && this.props.link_list.length >= 1 ? (

                                this.props.eventChainChildren && !this.state.linkinfotouched ? (
                                                                        
                                    <div>



                                        {  this.props.link_list.map((a, index) =>
                                            <Row key={index+a[0]}>
                                                

                                                    <Col span={12}> 
                                                    <div className="editeditms">

                                                    
                                                    <Form.Item  label={index == 0 ? "活动链路" : ""}  initialValue={a} name={`link_info`+index}    key={index+a[0]}   rules={[{ required: true }]}>
                                                            <Cascader options={this.props.eventChainChildren }  onChange={this.onChangea} placeholder="Please select" key={index+a[0]}  />
                                                    </Form.Item>
                                                    </div>
                                                    </Col>
                                                    <Col span={4}> 
                                                    <div className="deliconsitm">
                                                        {index == 0 ? (
                                                             <PlusCircleOutlined onClick={this.linkinfcarray} />
                                                        ): (
                                                            <MinusCircleOutlined  onClick={()=>this.dellinkitm(index+a[0])} />
                                                        )}
                                                        
                                                        
                                                    </div>
                                                    </Col>
                                                
                                                </Row>
                                            )}

                                        </div>


                                 ): (

                                    this.state.temp_link_list && this.state.temp_link_list.length >= 1 ? (
                                      this.state.temp_link_list.map((a, index) =>
                                        <Row key={index}>
                                            

                                                <Col span={12}> 
                                                <div className="editeditms">

                                                
                                                <Form.Item  label={index == 0 ? "活动链路" : ""}  initialValue={a} name={`link_info`+index}   key={index+a[0]}   rules={[{ required: true }]}>
                                                        <Cascader options={this.props.eventChainChildren }  onChange={this.onChangea} placeholder="Please select"   />
                                                </Form.Item>
                                                </div>
                                                </Col>
                                                <Col span={4}> 
                                                <div className="deliconsitm">
                                                            
                                                    
                                                    {index == 0 ? (
                                                       
                                                        <PlusCircleOutlined onClick={this.linkinfcarraysub} />
                                                     
                                                    ): (
                                                         <MinusCircleOutlined  onClick={()=>this.dellinkitmsubs(index)}  />
                                                    )}
                                                    
                                                </div>
                                                </Col>
                                            
                                            </Row>
                                        )
                                    ): ("")
                                            
                                 )

 
                           ): (
                               
                            <Row>
                                <Col span={12}>

                                <Form.Item name="link_info0" label="活动链路" rules={[{ required: true }]}>
                                    <Cascader options={this.props.eventChainChildren} onChange={this.onChangea} placeholder="Please select" />
                                </Form.Item>
                                </Col>
                            </Row>
                           ) }
                           
                           
                                    
                        </div>   

                            

                            <Form.Item wrapperCol={{ offset: 3, span: 21 }}>

                                <div id="btnright">

                                    <Button type="primary" htmlType="submit"   disabled={this.state.btndisabled}>
                                        提交
                                    </Button>
                                </div>

                            </Form.Item>
                        </Form>




                    ) : (

                       ""

                    )}


                        
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



export default EditEvent;