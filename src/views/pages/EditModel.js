import React from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Col,
    Row,
    Select,
    Spin,
    InputNumber,
    notification,
    Switch,
    Tooltip,

} from 'antd';

import axios from "axios";

import { APIURL } from '../../common/constdt.js'


import {

    LoadingOutlined,
    QuestionCircleOutlined,


} from '@ant-design/icons';



const { Option } = Select;


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;



class EditModel extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

            is_zhan: false,
            is_warn: false,
     
            EngName: null,
            modplatform: null,
            editobj: null,
            editspin: false,
            
            btndisabled: false,
            
            detail: null,
            appserverinput: null,
        }

        this.hideModalcls = this.hideModalcls.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.is_zhanonChange = this.is_zhanonChange.bind(this);
        this.is_warnChange = this.is_warnChange.bind(this);
        this.modplatformevt = this.modplatformevt.bind(this);
    

        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {


         

    }

  

    async updatemdoe(v) {

   
        console.log(v)

        this.setState({

            btndisabled: true,
        })
        let url = `${APIURL}/capacityModel/editModel`;

        let bodyFormData = new FormData();
        bodyFormData.append("link_id", this.props.id);

        
        bodyFormData.append("mod_id", this.props.moddetail.id);
        

        if(v.is_expand) {
            bodyFormData.append("is_expand", 1);
        } else {
            bodyFormData.append("is_expand", 0);
        }

        if (v.mod_name) {
            bodyFormData.append("mod_name", v.mod_name);
        }


        if (v.mod_platform) {
            bodyFormData.append("mod_platform", v.mod_platform);

        }

       
        let platform_info = {}
        
        let lp = this.props.appserverinput;
        for(let u = 0; u < lp.length; u++){ 
            
            let fd = lp[u].field
            
            let ok = v[`${fd}`];
          
            platform_info[`${fd}`] = ok
         
        }

     
        
             
        bodyFormData.append("platform_info", JSON.stringify(platform_info) );




        if (v.is_warn == true) {
            bodyFormData.append("is_warn", 1);
        } else {
            bodyFormData.append("is_warn", 0);
        }

        
            
        

        if (v.mod_quota) {
            bodyFormData.append("mod_quota", v.mod_quota);
        }
        if (v.mod_threshold) {
            bodyFormData.append("mod_threshold", v.mod_threshold);
        }
        if (v.mod_user) {
            bodyFormData.append("mod_user", v.mod_user);
        }
        if (v.oncall_interval) {
            bodyFormData.append("oncall_interval", v.oncall_interval);
        }
        if (v.warn_ruleminutes) {
            bodyFormData.append("warn_ruleminutes", v.warn_ruleminutes);
        }
        if (v.warn_ruletimes) {
            bodyFormData.append("warn_ruletimes", v.warn_ruletimes);
        }

        if (v.wx_interval) {
            bodyFormData.append("wx_interval", v.wx_interval);
        }



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

                    that.setState({
                        btndisabled: false,
                    })

                    that.props.openmodals(false)


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
                console.log(error);

                that.setState({
                    btndisabled: false,
                })
            })

    }

    modplatformevt(v) {

  

        this.setState({
            modplatform: v,
        })
    }
    is_warnChange(v) {


        if (v == true) {
            this.setState({
                is_warn: 1,
            })
        } else {
            this.setState({
                is_warn: 0,
            })
        }
 


    }

    is_zhanonChange(v) {

        if (v == true) {
            this.setState({
                is_zhan: 1,
            })
        } else {
            this.setState({
                is_zhan: 0,
            })
        }
       
    }

    hideModalcls() {
        
        this.props.openmodalsocls(false);

       
    }


    hideModal() {


        this.props.openmodals(false)

    };

    onReset = () => {
        this.props.openmodals(false)
    }

    render() {

         


        const onFinish = values => {
            console.log('Received values of form:', values);

            this.updatemdoe(values)
        };

        return (
            <div id="">

                <Modal
                    title="编辑模块"

                    closable
                    maskClosable={false}
                    centered
                    visible={this.props.visible}
                  
                    onCancel={this.hideModalcls}
                   
                    width={1120}
                    footer={null}
                    destroyOnClose={true}

                >
                    <div>

                        {this.props.moddetail ? (

                            <Form
                                name="basicz"
                                layout="horizontal"
                                onFinish={onFinish}
                                initialValues={{ 
                                    mod_name: this.props.moddetail.mod_name,
                                    mod_platform: this.props.moddetail.mod_platform, 
                                    mod_quota: this.props.moddetail.mod_quota, 
                                    mod_threshold: this.props.moddetail.mod_threshold, 
                                    old_db_name: this.props.moddetail.old_db_name, 
                                    old_mod_id: this.props.moddetail.old_mod_id, 
                                    oncall_interval: this.props.moddetail.oncall_interval, 
                                    warn_ruleminutes: JSON.parse(this.props.moddetail.warn_rule).minutes,
                                    warn_ruletimes:  JSON.parse(this.props.moddetail.warn_rule).times,
                                    wx_interval: this.props.moddetail.wx_interval,
                                    mod_user: this.props.moddetail.mod_user,
                                    is_warn: this.props.moddetail.is_warn == 1 ? true : false,
                                    is_expand: this.props.moddetail.is_expand == 1 ? true : false,
                                    

                                     
                                }}
                            >



                                {this.props.moddetail.is_zhan == 0 ? (


                                    <div>


                                        <Form.Item label="所属平台" name="mod_platform" rules={[{ required: true }]} >
                                            <Select
                                                onSelect={this.modplatformevt}
                                                disabled
                                            >

                                                {this.props.pltfmdt ? (
                                                    this.props.pltfmdt.map(function (i) {
                                                        return (
                                                            <Option value={i.value} key={i.value}> {i.name} </Option>
                                                        )
                                                    })

                                                ) : ("")}

                                            </Select>
                                        </Form.Item>

                                       
                                    
                                            {this.props.appserverinput && this.props.appserverinput.length >=1 ? (
                                                <Row>
                                                    {this.props.appserverinput.map(function(z){
                                                        return  <Col span={24} key={z.name}>
                                                                    <Form.Item label={z.name} name={z.field} initialValue={z.value} >
                                                                    <Input  disabled/>
                                                                    </Form.Item>
                                                                </Col>
                                                    })}
                                                </Row>
                                            ):("")}

                                                

                                       



                                    {this.props.moddetail.mod_platform == 123 ? (<div> 
                                        <Row>

                                        
                                        <Col span={8} >

                                       
                                        <Form.Item label="是否需要平台扩容" name="is_expand"  valuePropName="checked">
                                            <Switch      checked={true} />
                                        </Form.Item>
                                        </Col>
                                       
                                        <Col span={12} >

                                     
                                        {this.props.moddetail.is_power == 0  && this.state.is_expand == 1 ? (

                                            <div className="gotoauth">
 
<a target="_blank" rel="noreferrer"  href={`http://123.woa.com/v2/formal#/server-manage/index?app=${JSON.parse(this.props.moddetail.platform_info).app}&server=${JSON.parse(this.props.moddetail.platform_info).server}&_tab_=serverOwner&iframeUrl=&iframeID=12`} >
去授权
</a>
 <Tooltip title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
 <QuestionCircleOutlined />
</Tooltip>
 


                                        </div>

                                        ):("")} 
   
 
                                    </Col>
                                    </Row>
                                    </div>) : ("") }

                                    
                                 



                                       
                                                 
                                        <Form.Item label="超出阈值是否报警" name="is_warn" valuePropName="checked">
                                            <Switch onChange={this.is_warnChange} checked={true} />

                                          
                                        </Form.Item>

                                        


                                        {  this.props.moddetail.is_warn == 1 && this.state.is_warn !== 1 &&   this.state.is_warn !== 0 ? (
                                               <div>


                                               
                                               <Form.Item label="报警监控指标_props" name="mod_quota">
                                                   <Select>
                                                   {this.props.mod_quotas && this.props.mod_quotas.length >= 1 ? (
                                                   this.props.mod_quotas.map((i) => { 
                                                     return  <Option value={i.value} key={i.name}> {i.name} </Option>
                                                   })
                                               ):""}
                                                   </Select>
                                               </Form.Item>

                                               <Row className="spanwithrowl">
                                               <Col span={12}>
                                                   <Form.Item label="阈值" name="mod_threshold">
                                                       <InputNumber min={1} />
                                                   </Form.Item>
                                                   <span>
                                                       %
                                                   </span>
                                               </Col>
                                               </Row>
                                               <Row  className="spanwithrowl">


                                                   <Col span={12}>
                                                       <Form.Item label="报警规则" name="warn_ruleminutes">
                                                           <InputNumber min={1} />

                                                       </Form.Item>
                                                       <span> 分钟内， </span>

                                                   </Col>
                                                   <Col span={12}>
                                                       <Form.Item label="" name="warn_ruletimes">
                                                           <InputNumber min={1} />

                                                       </Form.Item>
                                                       <span> 超出阈值 </span>
                                                   </Col>
                                               </Row>
                                               <Row  className="spanwithrowl">
                                            
                                               <Col span={12}>
                                                   <Form.Item label="企业微信报警频率" name="wx_interval">
                                                       <InputNumber min={1} />
                                                   </Form.Item>
                                                   <span> 小时 </span>
                                               </Col>
                                               </Row>
                                               <Row  className="spanwithrowl">
                                               <Col span={12}>
                                                   <Form.Item label="oncall报警频率" name="oncall_interval">
                                                       <InputNumber min={1} />

                                                   </Form.Item>
                                                   <span> 小时 </span>
                                               </Col>
                                               </Row>
                                           </div>

                                        ) : (


                                            ""

                                        )}




                                {this.state.is_warn == 1 ? (
                                               <div>


                                               
                                               <Form.Item label="报警监控指标" name="mod_quota">
                                                   <Select>
                                                   {this.props.mod_quotas && this.props.mod_quotas.length >= 1 ? (
                                                   this.props.mod_quotas.map((i) => { 
                                                     return  <Option value={i.value} key={i.name}> {i.name} </Option>
                                                   })
                                               ):""}
                                                   </Select>
                                               </Form.Item>

                                               <Row   className="spanwithrowl">
                                               <Col span={12}>
                                                   <Form.Item label="阈值" name="mod_threshold">
                                                       <InputNumber min={1} />
                                                   </Form.Item>
                                                   <span>
                                                       %
                                                   </span>
                                               </Col>
                                               </Row>
                                               <Row  className="spanwithrowl">


                                                   <Col span={12}>
                                                       <Form.Item label="报警规则" name="warn_ruleminutes">
                                                           <InputNumber min={1} />

                                                       </Form.Item>
                                                       <span> 分钟内， </span>

                                                   </Col>
                                                   <Col span={12}>
                                                       <Form.Item label="" name="warn_ruletimes">
                                                           <InputNumber min={1} />

                                                       </Form.Item>
                                                       <span> 超出阈值 </span>
                                                   </Col>
                                               </Row>
                                               <Row  className="spanwithrowl">

                                              

                                               <Col span={12}>
                                                   <Form.Item label="企业微信报警频率" name="wx_interval">
                                                       <InputNumber min={1} />
                                                   </Form.Item>
                                                   <span> 小时 </span>
                                               </Col>
                                               </Row>
                                               <Row  className="spanwithrowl">

                                              

                                               <Col span={12}>
                                                   <Form.Item label="oncall报警频率" name="oncall_interval">
                                                       <InputNumber min={1} />

                                                   </Form.Item>
                                                   <span> 小时 </span>
                                               </Col>
                                               </Row>
                                           </div>

                                        ) : (

                                            ""
                                            

                                        )}



                                    </div>

                                ) : (

                                        <Form.Item label="模块名称" name="mod_name" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                    )}


                                <div className="clearboth">


                                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                        <Button htmlType="button" onClick={this.hideModalcls}>
                                            取消
                                         </Button>
                                        <Button type="primary" htmlType="submit" disabled={this.state.btndisabled}>
                                            提交
                                        </Button>
                                    </Form.Item>

                                </div>
                                {this.state.btndisabled ? (
                                    <div className="editspindx">  <Spin indicator={antIcon} />  </div>
                                ) : (
                                        ""
                                    )}

                            </Form>


                        ) : (

                            <div className="editspindx">  <Spin indicator={antIcon} />  </div>

                            )}

                       

                    </div>





                </Modal>

            </div>
        )
    }

}
export default EditModel;