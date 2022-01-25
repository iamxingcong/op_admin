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

let appserverarr = {};


class AddModel extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            pltfmdt: null,

            btndisabled: false,
            EngName: null,
            modplatform: null,
            appserverinput: null,
            appserverblursdt: null,
            checkapsdt: null,
            mod_quotas: null,

            is_expand: true,
            is_zhan: false,
            is_warn: true,
            is_power: null,
            mod_threshold: 50,
            warn_ruleminutes: 5,
            warn_ruletimes: 5,

            mod_user: null,
            oncall_interval: 24,
            wx_interval: 2,
            errormsg: null,
            linktrue: null,
            mod_quota: null,
        }

        this.hideModal = this.hideModal.bind(this);
        this.is_zhanonChange = this.is_zhanonChange.bind(this);
        this.is_expandChange = this.is_expandChange.bind(this);
        this.is_warnChange = this.is_warnChange.bind(this);
        this.modplatformevt = this.modplatformevt.bind(this);
        this.capacityModelqueryByModPlatformInfo = this.capacityModelqueryByModPlatformInfo.bind(this);
        this.appserverblurs = this.appserverblurs.bind(this);
        this.mod_quotachange = this.mod_quotachange.bind(this);

        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        this.setState({
            is_zhan: false,
            linktrue: false,
            appserverinput: null,
            modplatform: null,
        })
        this.capacityModelplatformInfo();
        this.getnm();
    }


    componentWillReceiveProps(nextProps) {

        this.setState({
            is_zhan: false,
            linktrue: false,
            appserverinput: null,
            modplatform: null,
        })
        if (nextProps.id !== this.props.id) {
            this.setState({
                appserverinput: null,
            })

        }
    }




    mod_quotachange(v) {


        this.setState({
            mod_quota: v,
        })
    }

    modplatformevt(v) {

        let arr = this.state.pltfmdt;

        appserverarr = {};



        this.setState({

            appserverblursdt: appserverarr,
            errormsg: null,
            linktrue: null,
            mod_quotas: null,
            modplatform: null,
            mod_quota: undefined,
        })


        for (let i = 0; i < arr.length; i++) {

            if (arr[i].value == v) {
                this.setState({
                    modplatform: v,
                    appserverinput: arr[i].params,
                    mod_quotas: arr[i].mod_quota,
                })

            }
        }



    }

    appserverblurs(v) {





        let k = v.target.id.replace("basicz_", "");
        let vl = v.target.value;

        appserverarr[`${k}`] = vl;


        this.setState({
            appserverblursdt: appserverarr,
        })


        if (appserverarr.app && appserverarr.server) {

            if (appserverarr.app.length >= 1 && appserverarr.server.length >= 1) {


                this.capacityModelqueryByModPlatformInfo()


            }
        }


    }



    async capacityModelqueryByModPlatformInfo() {
        let url = `${APIURL}/capacityModel/queryByModPlatformInfo`;

        let bodyFormData = new FormData();
        bodyFormData.append("mod_platform", this.state.modplatform);
        bodyFormData.append("platform_info", this.state.appserverblursdt);
        let that = this;
        await axios.get(url, {
            withCredentials: true,
            params: {
                mod_platform: this.state.modplatform,
                platform_info: JSON.stringify(this.state.appserverblursdt),
            }
        })

            .then(function (response) {


                if (response.data.code === 0) {


                    if (response.data.data.is_power == 0) {
                        that.setState({
                            linktrue: true,
                        })
                    } else {
                        that.setState({
                            linktrue: false,
                        })
                    }
                    that.setState({

                        checkapsdt: response.data.data,
                        mod_threshold: response.data.data.mod_threshold,
                        warn_ruleminutes: (JSON.parse(response.data.data.warn_rule)).minutes,
                        mod_quota: response.data.data.mod_quota,
                        warn_ruletimes: (JSON.parse(response.data.data.warn_rule)).times,
                        oncall_interval: response.data.data.oncall_interval,
                        wx_interval: response.data.data.wx_interval,
                        errormsg: null,
                    })

                } else {
                    that.setState({
                        errormsg: response.data.msg,
                    })
                }
            })

            .catch(function (er) {
                console.log(er)

            })

    }


    async getnm() {

        let that = this;
        await axios.get("/ts:auth/tauth/info", { withCredentials: true })
            .then(function (r) {

                document.cookie = `EngName=${r.data.EngName}`;

                that.setState({
                    EngName: r.data.EngName
                })

            })
            .catch(function (er) {
                console.log(er)

            })
    }

    async createmode(v) {




        this.setState({

            btndisabled: true,
        })
        let url = `${APIURL}/capacityModel/addModel`;

        let bodyFormData = new FormData();



        let url_string = window.location.href.replace(/\/#/g, "")

        let purl = new URL(url_string);

        let id = purl.searchParams.get("id");


        bodyFormData.append("link_id", id);

        bodyFormData.append("mod_user", this.state.EngName ? this.state.EngName : "local_dev");
        bodyFormData.append("create_user", this.state.EngName ? this.state.EngName : "local_dev");




        if (v.mod_name) {
            bodyFormData.append("mod_name", v.mod_name);
        }


        if (v.mod_platform) {
            bodyFormData.append("mod_platform", v.mod_platform);

        }



        let platform_info = {}

        if (this.state.appserverinput) {

            let lp = this.state.appserverinput;
            for (let u = 0; u < lp.length; u++) {

                let fd = lp[u].field

                let ok = v[`${fd}`];


                platform_info[`${fd}`] = ok

            }


            bodyFormData.append("platform_info", JSON.stringify(platform_info));
        }





        if (v.mod_platform == "123") {


            if (v.is_zhan == true) {
                bodyFormData.append("is_zhan", 1);

            } else {

                bodyFormData.append("is_zhan", 0);

            }

            if (v.is_warn == true) {
                bodyFormData.append("is_warn", 1);

                if (this.state.mod_quota) {
                    bodyFormData.append("mod_quota", this.state.mod_quota);
                } else {
                    if (this.state.mod_quotas) {
                        bodyFormData.append("mod_quota", this.state.mod_quotas[0].value);
                    }

                }

            } else {
                bodyFormData.append("is_warn", 0);
            }


            if (v.is_expand == true) {
                bodyFormData.append("is_expand", 1);

            } else {
                bodyFormData.append("is_expand", 0);
            }

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
                        appserverinput: null,
                    })
                    that.props.openmodals(false);
                    that.props.refreshlist(true);

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


    is_expandChange(v) {
        if (v == true) {
            this.setState({
                is_expand: 1,
            })
            alert(`
                您选择了为大事件授权,我们会将emmazwang追加在服务的运维护负责人中,以保障大事件有权限为服务扩容,请悉知！
            `)
        } else {
            this.setState({
                is_expand: 0,
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
    async capacityModelplatformInfo() {
        const urls = `${APIURL}/capacityModel/platformInfo`;


        var that = this
        await axios.get(urls, { withCredentials: true })
            .then(function (response) {
                if (response.data.code == 0) {
                    that.setState({
                        pltfmdt: response.data.data
                    })


                }

            })
            .catch(function (error) {
                console.log(error);
            })

    }

    hideModal() {


        this.props.openmodals(false)
        this.props.refreshlist(true)

    };

    onReset = () => {
        this.props.openmodals(false)
    }

    render() {


        const bgChange = (visible) => {
            this.setState({
                visible: visible
            })
        }


        const onFinish = values => {
            console.log(values)
            this.createmode(values)
        };

        return (
            <div id="modelcreateid">

                <Modal
                    title="添加模块"

                    closable
                    maskClosable={false}
                    centered
                    visible={this.props.visible}
                    onCancel={this.hideModal}
                    openmodals={bgChange}
                    width={1120}
                    footer={null}
                    destroyOnClose={true}

                >



                    <Form
                        name="basicz"
                        layout="horizontal"
                        onFinish={onFinish}
                        initialValues={{
                            mod_threshold: this.state.mod_threshold,
                            warn_ruleminutes: this.state.warn_ruleminutes,

                            warn_ruletimes: this.state.warn_ruletimes,
                            oncall_interval: this.state.oncall_interval,
                            wx_interval: this.state.wx_interval,
                        }}

                    >



                        <Form.Item label="占位模块" name="is_zhan" initialValue={false} valuePropName="checked">
                            <Switch onChange={this.is_zhanonChange} checked={false} />
                        </Form.Item>


                        {this.state.is_zhan == 0 ? (


                            <div>



                                <Form.Item label="所属平台" name="mod_platform" rules={[{ required: true }]}>
                                    <Select
                                        onSelect={this.modplatformevt}

                                    >

                                        {this.state.pltfmdt ? (
                                            this.state.pltfmdt.map((i) => {
                                                return (
                                                    <Option value={i.value} key={i.value}> {i.name} </Option>
                                                )
                                            })

                                        ) : ("")}

                                    </Select>
                                </Form.Item>



                                {this.state.appserverinput && this.state.appserverinput.length >= 1 ? (
                                    <div>
                                        <Row>
                                            {this.state.appserverinput.map((z, i) => {
                                                return <Col span={24} key={z.name}>
                                                    <Form.Item label={z.name} name={z.field} rules={[{ required: z.isMust }]}>


                                                        <Input className={z.value} onBlur={this.appserverblurs} />

                                                    </Form.Item>
                                                </Col>
                                            })}


                                        </Row>


                                    </div>
                                ) : ("")}

                                {this.state.modplatform == 123 ? (

                                    <div>
                                        <Row>


                                            <Col span={6} >


                                                <Form.Item label="授权给大事件扩容" name="is_expand" initialValue={false} valuePropName="checked">
                                                    <Switch onChange={this.is_expandChange} checked={false} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12} >


                                                {this.state.linktrue && this.state.is_expand == 1 ? (

                                                    <div className="gotoauth">

                                                        <a target="_blank" rel="noreferrer" href={`http://123.woa.com/v2/formal#/server-manage/index?app=${this.state.appserverblursdt.app}&server=${this.state.appserverblursdt.server}&_tab_=serverOwner&iframeUrl=&iframeID=12`} >
                                                            去授权
                                                        </a>
                                                        <Tooltip title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
                                                            <QuestionCircleOutlined />
                                                        </Tooltip>



                                                    </div>
                                                ) : ("")}


                                            </Col>
                                        </Row>






                                        {/* <Form.Item label="超出阈值是否报警" name="is_warn" initialValue={true} valuePropName="checked">
                                            <Switch onChange={this.is_warnChange} checked={true} />
                                        </Form.Item> */}





                                        {this.state.is_warn == 0 ? ("") : (

                                            <div>





                                                {this.state.pltfmdt && this.state.pltfmdt.length >= 1 ? (
                                                    <div>

                                                        {this.state.pltfmdt.map((x, ind) => {
                                                            return <div key={ind}>

                                                                {x.mod_quota && x.mod_quota.length >= 1 ? (
                                                                    this.state.modplatform === x.value ? (
                                                                        // <Form.Item label={`报警监控指标`} name="mod_quota" key={x.value} >
                                                                        //     <Select onChange={this.mod_quotachange} defaultValue={x.mod_quota[0].value}>

                                                                        //         {x.mod_quota.map((z) => {
                                                                        //             return <Option value={z.value} key={z.value}> {z.name} </Option>

                                                                        //         })}



                                                                        //     </Select>
                                                                        // </Form.Item>
                                                                        <></>

                                                                    ) : ("")



                                                                ) : ("")}

                                                            </div>
                                                        })}

                                                    </div>


                                                ) : ("")}




                                                {/* <Row className="itmspan">
                                                    <Col span={12}>
                                                        <Form.Item label="阈值" name="mod_threshold">
                                                            <InputNumber min={1} />

                                                        </Form.Item>
                                                        <span>
                                                            %
                                                        </span>
                                                    </Col>
                                                </Row>
                                                <Row className="itmspan">


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
                                                        <span> 次超出阈值 </span>
                                                    </Col>
                                                </Row>
                                                <Row className="itmspan">


                                                    <Col span={12}>
                                                        <Form.Item label="企业微信报警频率" name="wx_interval">
                                                            <InputNumber min={1} />
                                                        </Form.Item>
                                                        <span> 小时 </span>
                                                    </Col>

                                                </Row>
                                                <Row className="itmspan">
                                                    <Col span={12}>
                                                        <Form.Item label="oncall报警频率" name="oncall_interval">
                                                            <InputNumber min={1} />

                                                        </Form.Item>
                                                        <span> 小时 </span>
                                                    </Col>
                                                </Row> */}
                                            </div>

                                        )}



                                    </div>

                                ) : ("")}



                            </div>

                        ) : (

                            <Form.Item label="模块名称" name="mod_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        )}


                        <div className="clearboth">


                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button htmlType="button" onClick={this.onReset}>
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



                </Modal>

            </div>
        )
    }

}
export default AddModel;