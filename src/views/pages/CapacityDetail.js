
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Table, Row, InputNumber, Button, Col, Card, Form, Select, Tooltip, Tabs, notification, Spin, Modal } from 'antd';



import { CopyOutlined, QuestionCircleOutlined, SyncOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';

import axios from "axios";

import { APIURL, APIURLnos } from '../../common/constdt.js'

import EditEventCapacity from './EditEventCapacity.js'
import OperateUrlConfig from './OperateUrlConfig.js'

const { TabPane } = Tabs;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const tailLayout = {
    wrapperCol: {
      offset: 2,
      span: 22,
    },
  };
  
 
const { Option } = Select;



class CapacityDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            detail: null,
            capacitylist: null,
            unitcapacity: null,
            event_id: null,
            unit_capacity: null,
            num: null,
            confvisible: false,
            link_list: [],
            filemap: false,
            mapdt: null,
            secondarray: [],
            originalsecond: [],
            link_id: null,
            link_idpinput: null,
            defaultkey: null,
            link_idblur: null,
            link_info: null,
            linklist: null,
            onekeywritespin: false,
            onekeywritetipsim: false,
            expandtrue: false,
            onekeyparmobj: null,
            wheight: 600,
            eventChainChildren: null,
            eventChain: null,
            renamelinkisModalVisible: null,
            onekeyxloading: false,

        }

        this.eventchaine = this.eventchaine.bind(this)
     
        this.handleChangePevt = this.handleChangePevt.bind(this)
        this.callback = this.callback.bind(this)
        this.clickcellsth = this.clickcellsth.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this);
        this.newagetRates = this.newagetRates.bind(this);
        this.tdeventInfoinput = this.tdeventInfoinput.bind(this);

    }


    componentDidMount() {
        let wh =  window.innerHeight - 520;
        console.log(wh);
        this.eventchaine()

        const ts = this.props.location.search.replace("?id=", "");
        this.setState({
            id: ts,
            wheight: wh,
        })

        this.agetRates(ts)
        this.eventlist()

        this.onBlur = this.onBlur.bind(this)
        this.blurs = this.blurs.bind(this)

    }

    clickcellsth(v) {

       
        this.setState({
            expandtrue: v,
        })
    }

    openurlcodepop(v) {
      
        console.log(v);
        this.setState({
            confvisible: true,
        })

    }

    tdeventInfoinput(){
        
        this.setState({
            renamelinkisModalVisible: true,
        })
        
    }

    msssconfigModalVisible = () => {
        this.setState({
          renamelinkisModalVisible: false,
        })
      }
     

    callback(key) {
       

        this.setState({
            link_idpinput: key,
            defaultkey: key,
        })


        for (let i = 0; i < this.state.linklist.length; i++) {
            if (key == this.state.linklist[i].link_id) {
                this.setState({
                    link_id: this.state.linklist[i].link_id,
                    link_info: JSON.stringify(this.state.linklist[i].link_info),

                })
            }
        }

    }

    paste() {
        let tmpv = `${APIURLnos}/eventInfo/createPushChild?pid=${this.state.detail.id}&capacity_pre_value=`
        navigator.clipboard.writeText(tmpv)
       

        notification.success({
            message: '提示',
            description: '链接已复制',
            placement: 'topCenter',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }




    async handleChangePevt(v) {
        console.log(v)

        var bodyFormData = new FormData();
        bodyFormData.append("event_id", this.state.id);
        bodyFormData.append("pid", v);
        bodyFormData.append("event_type", this.state.detail.event_type);

        let url = `${APIURL}/eventInfo/update`;
        if (v == this.state.id) {

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
        } else {
            let that = this
            await axios.post(url, bodyFormData, { withCredentials: true })
                .then(function (response) {

                    if (response.data.code === 0) {

                        notification.success({
                            message: '提示',
                            description: '修改成功',
                            placement: 'topCenter',
                            onClick: () => {
                                console.log('Notification Clicked!');
                            },
                        });

                        that.agetRates();
                        that.eventchaine();

                    } else {
                        console.log(response)
                    }

                })
                .catch(function (error) {
                    console.log(error);


                })
        }


    }




    async eventchaine() {
        var ts = this.props.location.search.replace("?id=", "")
        const urls = `${APIURL}/capacity/list`;

        this.setState({
            event_id: ts,
            onekeywritespin: false,
        })


        let that = this
        await axios.get(urls, {
            withCredentials: true,
            params: {
                event_id: ts
            }
        })
            .then(function (response) {


                if (response.data) {


                    that.setState({
                        onekeywritespin: true,

                    })


                    if (!that.state.defaultkey) {
                        if( response.data.data.length >= 1){
                            that.setState({
                                defaultkey: response.data.data[0].link_id
    
                            })
                        }
                      
                    }

                    let tsdata = response.data.data;

                    let toparr = []
                    let topseccond = []

                    if (tsdata.length == 0) {
                        return false;
                    }

                    that.setState({
                        link_id: tsdata[0].link_id,
                        link_info: JSON.stringify(tsdata[0].link_info),
                        linklist: tsdata,
                    })

                    // first time

                    for (let i = 0; i < tsdata.length; i++) {

                        let topobj = {};
                        topobj = tsdata[i];


                        let fstarrst = []

                        for (let j = 0; j < tsdata[i].list.length; j++) {
                            let fstobj = {}

                            fstobj = JSON.parse(JSON.stringify(tsdata[i].list[j]))

                            let names = tsdata[i].list[j].app_name + "." + tsdata[i].list[j].server_name;
                            fstobj.namesa = names

                            fstarrst.push(fstobj);
                        }

                        topobj.list = fstarrst



                        toparr.push(topobj)
                        topseccond.push(topobj)

                    }





                    that.setState({
                        secondarray: toparr,


                    })




                    let firstarray = []
                    let firstobjarray = []



                    for (let k = 0; k < topseccond.length; k++) {

                        let firstobj = {}
                        let namesobj = {}

                        firstobj = topseccond[k]

                        firstobj = Object.assign({}, topseccond[k]);

                        let firstlistarray = []
                        let firstuniqarr = []
                        let ofirstarr = []

                        for (let l = 0; l < topseccond[k].list.length; l++) {
                            if (firstlistarray.indexOf(topseccond[k].list[l].namesa) == -1) {
                                let subpobj = {};
                                let subtmpobj = {}

                                firstlistarray.push(topseccond[k].list[l].namesa);
                                firstuniqarr.push(topseccond[k].list[l]);

                                subpobj = topseccond[k].list[l];
                                subtmpobj = Object.assign({}, subpobj);
                                subtmpobj.id = subtmpobj.id * 2 + 1;
                                subtmpobj.origin_id = topseccond[k].list[l].id
                                subtmpobj.set_name = "--"
                                subtmpobj.area = "--";
                                subtmpobj.now_num = 0;
                                subtmpobj.target_num = 0;


                                ofirstarr.push(subtmpobj);

                            }

                        }
                        namesobj.list = firstlistarray
                        firstobj.list = ofirstarr;
                        firstobjarray.push(firstobj);
                        firstarray.push(namesobj)
                    }








                    let endarray = []
                    for (let n = 0; n < firstobjarray.length; n++) {

                        let endobj = {}
                        endobj = Object.assign({}, firstobjarray[n]);
                        let lastarr = []
                        for (let m = 0; m < firstobjarray[n].list.length; m++) {


                            let tempar = []
                            let tempob = {}
                            tempob = firstobjarray[n].list[m]
                            let nnow_num = 0
                            let ntarget_num = 0;
                            let aarea = []

                            for (let p = 0; p < topseccond[n].list.length; p++) {

                                if (firstobjarray[n].list[m].namesa == topseccond[n].list[p].namesa) {
                                    tempar.push(topseccond[n].list[p])
                                    nnow_num += topseccond[n].list[p].now_num;
                                    ntarget_num += topseccond[n].list[p].target_num
                                    aarea.push(topseccond[n].list[p].area)

                                }
                            }
                            tempob.area = aarea;
                            tempob.now_num = nnow_num;
                            tempob.target_num = ntarget_num;
                            tempob.rowspan = tempar.length;

                            if (tempar.length > 1) {
                                tempob.children = tempar
                            }

                            lastarr.push(tempob)

                        }
                        endobj.list = lastarr;
                        endarray.push(endobj)
                    }

                   
                    that.setState({
                        capacitylist: endarray

                    })


                }



            })
            .catch(function (error) {
                console.log(error);

            })





    }




    async eventlist() {

        this.setState({
            tabledt: null,


        })
        const urlsx = `${APIURL}/eventInfo/queryPid`;



        var that = this
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {

                if (response.data) {
                    that.setState({

                        tabledt: response.data.pid_list,

                    })
                }



            })
            .catch(function (error) {
                console.log(error);

            })
    }


    async agetRates(t) {

        this.setState({

            detail: null,

        })


        const urlsx = `${APIURL}/eventInfo/detail?event_id=${t}`;

        var that = this
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {

                if (response.data) {

                    

                    let link_list = []
                    if (response.data.data.link_list && response.data.data.link_list.length >= 1) {
                        for (let i = 0; i < response.data.data.link_list.length; i++) {
                       
                            let tp = [response.data.data.link_list[i].cateName, response.data.data.link_list[i].pName, response.data.data.link_list[i].subName]
                            link_list.push(tp)
                        }
                    }


                    if (response.data.data.url_field && response.data.data.op_url) {
                        that.eventInfofilemap(response.data.data.op_url)
                    }

                    console.log(link_list)

                    that.setState({

                        detail: response.data.data,
                        pid: response.data.data.pid,
                        unit_capacity: response.data.data.unit_capacity,
                        link_list: link_list,

                    })
                }

            })
            .catch(function (error) {
                console.log(error);

            })
    }



    async eventInfofilemap(e) {

        let url = `${APIURL}/eventInfo/fieldMap`;

        var bodyFormData = new FormData();
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
                    }

                })
                .catch(function (error) {
                    console.log(error);

                })

        } else {
            console.log("blank url")
        }


    }


    onFinish = (values) => {

        console.log('Success:', values);
    }

     
 
    handleCancel(){
        this.setState({
            onekeywritetipsim: false
        })
    }

    handleOk(){
        debugger;
        if(this.state.onekeyparmobj){
            this.cfmeventInfoinput(this.state.onekeyparmobj);
        }
        
        this.setState({
            onekeywritetipsim: false
        })
    }

   

    async cfmeventInfoinput(v) {
        

        const urls = `${APIURL}/eventInfo/newOnekeyWrite`;
        var bodyFormData = new FormData();
        bodyFormData.append("event_id", this.state.event_id);
        bodyFormData.append("unit_capacity", this.state.unit_capacity ? this.state.unit_capacity : 1);
        
        bodyFormData.append("link_id", JSON.parse(this.state.link_info).link_id);
        bodyFormData.append("link_info",  this.state.link_info);
        bodyFormData.append("event_link_id", this.state.link_id);

        bodyFormData.append("num", v.bulkexpandnum);
 



        let that = this
        if (that.state.unitcapacity || v.bulkexpandnum) {
            
            that.setState({
                  onekeyxloading: true,
            })

            await axios.post(urls, bodyFormData, { withCredentials: true })


                .then(function (response) {

                    if (response.data.code == 0) {


                        notification.success({
                            message: '提示',
                            description: '填写成功',
                            placement: 'topCenter',
                            onClick: () => {
                                console.log('Notification Clicked!');
                            },
                        });
                        that.setState({
                            onekeyxloading: false,
                           renamelinkisModalVisible: false,
                        })

                        that.eventchaine();
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

                    console.log(error)

                })

                that.setState({
                    onekeyxloading: false,
                })


        } else {

            notification.error({
                message: '提示',
                description: '当前容量不能为空！！',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }


    }


    edit() {
        
        this.newagetRates();
         
    }



    async newagetRates() {
        
        const urlsx = `${APIURL}/capacity/newMenu`;

        var that = this;
        await axios.get(urlsx, { withCredentials: true })
            .then(function (response) {

                
                let array_one = []
                if (response.data.code == 0) {

                    that.setState({
                        eventChain: response.data.data

                    })

                    for (let h = 0; h < response.data.data.length; h++) {
                        let obj_one = {}
                        obj_one.label = response.data.data[h].cateName;
                        obj_one.value = response.data.data[h].cateName;
                        obj_one.children = []
                        array_one.push(obj_one)


                        let array_two = []
                        if (response.data.data[h].menu) {

                            for (let j = 0; j < response.data.data[h].menu.length; j++) {
                                let obj_two = {}
                                obj_two.label = response.data.data[h].menu[j].pName;
                                obj_two.value = response.data.data[h].menu[j].pName;

                                array_two.push(obj_two)

                                let array_three = []

                                if (response.data.data[h].menu[j].menu && response.data.data[h].menu[j].menu.length >= 1 && response.data.data[h].menu[j].menu[0].link_id) {

                                    for (let k = 0; k < response.data.data[h].menu[j].menu.length; k++) {
                                        let obj_three = {}
                                        obj_three.label = response.data.data[h].menu[j].menu[k].subName;
                                        obj_three.value = response.data.data[h].menu[j].menu[k].subName;
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
                            eventChainChildren: array_one,
                            visible: true,

                        })
                    }


                  
                }

            })
            .catch(function (error) {
                console.log(error);
                 
            })
    }


    onBlur(v) {
      
        
        this.setState({
            num: v
        })
        
        
      

    }
    async blurs(v) {
        
        console.log(v);
        
       let nm =  document.getElementById(`input_${v.id}`).innerText;
            nm = nm*1;
            console.log(typeof nm)

            if(typeof nm != "number" || isNaN(nm)){
                notification.error({
                    message: '提示',
                    description: '单位容量机器台数需要填入 Number !',
                    placement: 'topCenter',
                    duration: 60,
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });

                return false;
            }

            nm = parseInt(nm)
        
            console.log(nm)
     
        
        if(v.target_num != 0 && nm < 0  ){

            
            return false;
        } else   if ( nm < 0 ) {

            
            return false;
        } else if(v.target_num  != nm &&  (typeof nm =="number") &&  nm >= 0) {


            const url = `${APIURL}/capacity/update`;

            var bodyFormData = new FormData();
            let cpid = [];
            if (v.origin_id) {
                cpid.push(v.origin_id)
                console.log(" no child ")
            } else {
                cpid.push(v.id)
                console.log(" have children ")
            }


            bodyFormData.append("capacity_id_list", JSON.stringify(cpid));
            bodyFormData.append("num", nm);
            bodyFormData.append("type", "target_num");

            

            await axios.post(url, bodyFormData, { withCredentials: true })
                .then(function (response) {


                    if (response.data.code === 0) {
                     
                        

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

                })

        } else {
            console.log(this.state.num)
        }



    }


   
    render() {



        const onFinishFailedrenamelink = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };



        const onFinishrenamelink = (values) => {
            console.log('Success:', values);
            
            this.cfmeventInfoinput(values)
        };

        const  configChange = (visible) => {
            this.setState({
                confvisible: visible,
            })
        }

        function areasf(v) {

            
            if (v.area.length > 1 && typeof v.area !== 'string') {
                return "--"
            } else if (v.area.length == 1) {
                return v.area[0]
            } else if (typeof v.area == 'string') {
                return v.area
            }
        }

        function power(v) {

            let txt = v.power_msg_and_url.power_msg;
            let lik = v.power_msg_and_url.url;


            if (txt.length == 0 && lik.length == 0) {
                return <CheckCircleOutlined />
            } else if (txt.length != 0 && lik.length == 0) {
                return txt;
            } else if (txt.length != 0 && lik.length != 0) {

                return  <div className="powerdiv">
                            <a target="_blank" rel="noreferrer" href={lik} > {txt} </a>
                            <Tooltip title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </div>
                            
            }
        }
        const goback = () => {


            this.props.history.push({
                pathname: "EventList",

            });

        }

        const clsbgChange = (visible) => {
            this.setState({
                visible: visible
            })
        }
        const bgChange = (visible) => {



            this.setState({
                visible: visible
            })

            this.agetRates(this.state.id);
            this.eventchaine();
        }

        const agotocapacity = (vt) => {



            this.props.history.push({
                pathname: "CapacityDetail",
                search: "id=" + vt,
                state: { id: vt }
            });
        }


        const columns = [

            {
                title: '展开/折叠',
                dataIndex: '',
                width: '108px',
                className: "expandcesllth",
                fixed: 'center',
                onHeaderCell: (column) => {
                    return {
                        onClick: () => {
                            console.log('onClick');
                            this.clickcellsth(!this.state.expandtrue)
                        }
                    };
                }
            },
            {
                title:  "权限",
                dataIndex: 'power_msg_and_url',
                align: "center",
                 
                render: (text, data) => power(data)

            },
            {
                title: '服务名',
                dataIndex: 'server_name',
                align: "center",

                render: (text, data) => (
                       
                    <a rel="noopener noreferrer"  href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app_name}&server=${data.server_name}`} target="_blank"> {data.app_name+"."+data.server_name}  </a>
                 

                )

            },


            {
                title: 'set',
                dataIndex: 'set_name',
                align: "center",

                render: (text, data) => (
                    <span>
                        {data.set_name ? data.set_name : "--"}
                    </span>
                )
            },
            {
                title: '地域',
                dataIndex: 'area',
                align: "center",

                render: (text, data) => areasf(data)

            },

            {
                title: '当前台数',
                dataIndex: 'now_num',
                align: "center",

                render: (text, data) => (
                    <div>

                        {data.children ? (
                            <span>
                                {data.now_num}
                            </span>
                        ) : (

                                <span>
                                    {data.now_num}
                                </span>
                            )}
                    </div>
                )
            },
            {
                title: () => (
                    <div className="powerdiv">
                         {'单位容量机器台数'}
                         <Tooltip title="单位容量设置好后，需要为单位容量设置所需的机器数，未来扩容目标台数会根据单位容量机器数来进行扩容。例如:单位容量设置为100，业务通过计算得出预估值为500，那么目标台数=预估值/单位容量*单位容量机器台数。">
                            <QuestionCircleOutlined />
                         </Tooltip>
                         <Button type="primary" size="small" onClick={() => this.tdeventInfoinput()}> 批量设置 </Button>
                    </div>
                   
                ),
                dataIndex: 'target_num',
                align: "center",
                render: (text, data) => (

                    
                        data.children ? (
                            <span>
                                {data.target_num}
                            </span>
                        ) : (

                                 <div className="inputdivs" id={"input_"+data.id}  contentEditable="true" suppressContentEditableWarning="true"  key={data.id+"_p"} onChange={this.onBlur} onBlur={() => this.blurs(data)}  > {data.target_num}  </div>
                             
                            )
                    
                )

            },

        ];


        return (
            <div id="capacitycontainer">
                <Card title="事件详情" bordered={false}  >
                {this.state.id && this.state.detail ? (

                    <>

                        <div className="btnwrap">
                            <Button className="rightbtn" onClick={() => goback()} type="primary"> 返回 </Button>

                            <Button className="rightbtn" onClick={() => this.edit(this.state.detail)} disabled={!this.state.detail.is_edit} type="primary" > 编辑 </Button>

                        </div>




                        <div className="detailwrap">


                            <Row>
                                <Col span={8}>
                                    <label> 事件类型：</label>
                                    {this.state.detail.event_type == 1 ? "临时性事件" : "周期性事件"}

                                </Col>
                                <Col span={8}>

                                    
                                    <label> 事件名称：</label>
                                    <span className="namelength440">
                                        <Tooltip placement="topLeft" title={this.state.detail.event_name}>
                                            {this.state.detail.event_name ? this.state.detail.event_name : "--"}
                                        </Tooltip>
                                    </span>

                                </Col>
                               
                                    {this.state.detail.is_edit ? (
                                        <Col span={8}  >
                                            <label>
                                                父事件：
                                            </label>

                                            {this.state.detail.event_type == 1 ? (
                                                <Select
                                                    placeholder="--"
                                                    defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                                    onChange={this.handleChangePevt}

                                                >

                                                    {this.state.tabledt ? (

                                                        this.state.tabledt.map(function (itm) {
                                                            return (
                                                                <Option value={itm.id} key={itm.id}> {itm.event_name} </Option>
                                                            )
                                                        })

                                                    ) : (
                                                            <Option value="null">   请选择 </Option>
                                                        )}



                                                </Select>

                                            ) : (
                                                    <Select
                                                        placeholder="--"
                                                        defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                                        disabled
                                                    >

                                                        {this.state.tabledt ? (

                                                            this.state.tabledt.map(function (itm) {
                                                                return (
                                                                    <Option value={itm.id} key={itm.id}> {itm.event_name} </Option>
                                                                )
                                                            })

                                                        ) : (
                                                                <Option value="null">   请选择 </Option>
                                                            )}



                                                    </Select>

                                                )}


                                        </Col>

                                       
                                    ) : (
                                        <Col span={8}  >
                                                <label>
                                                    父事件：
                                                </label>
                                                <Select
                                                    placeholder="--"
                                                    defaultValue={this.state.pid != 0 ? this.state.pid : null}
                                                    disabled
                                                >
                                                    {this.state.pid != 0 && this.state.tabledt ? (

                                                        this.state.tabledt.map(function (itm) {
                                                            return (
                                                                <Option value={itm.id} key={itm.id}> {itm.event_name} </Option>
                                                            )
                                                        })

                                                    ) : (
                                                            <Option value="null"> -- </Option>
                                                        )}

                                                </Select>

                                        </Col>
                                        )
                                    }

                              
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label> 容量指标：</label>
                                    
                                    {this.state.detail.capacity_quota ? this.state.detail.capacity_quota : "--"}
                                </Col>
                                <Col span={8}>
                                   <label> 单位容量：</label> 
                          {this.state.detail.unit_capacity ? this.state.detail.unit_capacity : "--"}
                                </Col>
                                <Col span={8} className="specialsp">
                                    <label>
                                        扩容最大比例(%):
                                    </label>
                                    {this.state.detail.expand_max_rate ? this.state.detail.expand_max_rate : "无限制"}
                                </Col>

                            </Row>
                            <Row>

                                <Col span={8}>


                                   <label>
                                   {this.state.detail.reduce_type == 1 ? "缩容延时：" : "缩容时间："}
                                    </label>
                                    {this.state.detail.reduce_type == 1 ? (
                                        this.state.detail.delay_time ? this.state.detail.delay_time + " 小时" : "--"
                                    ) : (
                                            this.state.detail.reduce_time ? "每天 " + this.state.detail.reduce_time : "--"
                                        )}



                                </Col>
                                <Col span={8}>
                                    <label>
                                        负责人：
                                    </label>
                                        <span className="namelength440">
                                        <Tooltip placement="topLeft" title={this.state.detail.event_users}>
                                            <span>
                                                {this.state.detail.event_users ? this.state.detail.event_users : "--"}
                                            </span>
                                        </Tooltip>
                                    </span>
                                </Col>
                                <Col span={8}>
                                <label>  真实容量：</label> 
                                <span onClick={ ()=> this.openurlcodepop(this.state.detail) } id="linklikespan"> 关联容量数据  </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <div className="leftflt">
                                    <div className="divlefttips">
                                        <label>
                                        <span>： </span> 

                                            <Tooltip title="该接口发生推送事件时调用，pid 是事件id, capacity_pre_value 为容量指标的预估值">

                                            <QuestionCircleOutlined />

                                        </Tooltip>
                                        <span>
                                            推送接口
                                            </span>
                                        </label>
                                        {`${APIURLnos}/eventInfo/createPushChild?pid=${this.state.detail.id}&capacity_pre_value=`}
                                        </div>
                                        <div className="divlefttips">
                                            <CopyOutlined onClick={() => this.paste()} />
                                            <span id="capacitydetailhref">
                                                
                                                    如有疑问，
                                                
                                                <a target="_blank" rel="noreferrer" href="https://iwiki.woa.com/pages/viewpage.action?pageId=1132901248">点击查看文档</a>
                                            </span>
                                        </div>
                                    </div>


                                    


                                </Col>
                            </Row>

                        </div>



                        <Row>
                            <Col span={24}>
                                <div className="title">
                                    <span>
                                        容量模版：
                                {this.state.detail.capacity_quota ? (
                                            <span>
                                                容量指标为
                                                <strong>
                                                    「{this.state.detail.capacity_quota}」
                                        </strong>，单位容量为
                                                <strong>
                                                    「{this.state.detail.unit_capacity}」
                                        </strong> 时的容量标准
                                            </span>
                                        ) : ("")
                                        }

                                    </span>


                                </div>
                            </Col>

                        </Row>


                </>


                                

                 


                ) : (
                        <div className="flowertrans">  <Spin indicator={antIcon} />  </div>
                    )}








                <Form
                    name="basicx"

                    onFinish={this.onFinish}

                    autoComplete="off"

                >


                    {this.state.onekeywritespin ? "" : (
                        <div className="tableflowertrans">  <Spin indicator={antIcon} />  </div>
                    )}

                    {this.state.capacitylist && this.state.capacitylist.length >= 1 ? (

                        
                            <Tabs defaultActiveKey={this.state.defaultkey} onChange={this.callback}>
                                {this.state.capacitylist.map((item) => {


                                    return (
                                        <TabPane
                                            tab={
                                                <span>
                                                    <Tooltip title={item.link_all_name}>

                                                        {this.state.defaultkey == item.link_id ? (
                                                            <SyncOutlined />
                                                        ) : ""}

                                                        {item.link_name}
                                                    </Tooltip>
                                                </span>
                                            }

                                            key={item.link_id}>



                                            


                                            {this.state.expandtrue == true ? (
                                                <div id="origin">


                                                    <Table

                                                        columns={columns}
                                                        rowKey="id"
                                                        expandable={{
                                                            defaultExpandAllRows: false,

                                                        }}
                                                        rowClassName={(record, index) => (record.children && record.children.length >= 1 ? "ohohoh" : "") } 

                                                        dataSource={item.list}
                                                        pagination={{
                                                            total: item.list.length,
                                                            pageSize: item.list.length,

                                                            pageSizeOptions: [item.list.length],


                                                        }}
                                                        
                                                    />
                                                </div>
                                            ) : ("")}
                                            {this.state.expandtrue == false ? (
                                                <div id="d">


                                                    <Table

                                                        columns={columns}
                                                        rowKey="id"
                                                        expandable={{
                                                            defaultExpandAllRows: true,
                                                        }}
                                                        dataSource={item.list}
                                                        rowClassName={(record, index) => (record.children && record.children.length >= 1 ? "ohohoh" : "") } 

                                                        pagination={{
                                                            total: item.list.length,
                                                            pageSize: item.list.length,

                                                            pageSizeOptions: [item.list.length],


                                                        }}
                                                       

                                                    />
                                                </div>
                                            ) : ("")}


                                        </TabPane>
                                    )


                                })
                                }

                            </Tabs>
                       




                    ) : (

                            ""
                        )}

                </Form>



                </Card>




                <EditEventCapacity
                    ref={this.wrapper}
                    visible={this.state.visible}
                    detail={this.state.detail}
                    tabledt={this.state.tabledt}
                    link_list={this.state.link_list}
                    filemap={this.state.filemap}
                    mapdt={this.state.mapdt}
                    eventChainChildren = {this.state.eventChainChildren}
                    eventChain = {this.state.eventChain}
                    id={this.state.id}
                    openmodals={bgChange}
                    openmodalsocls={clsbgChange}
                    gotocapacity={agotocapacity} />



                <Modal title={`提示`}
                        okText="确认"
                        visible={this.state.onekeywritetipsim} 
                        onOk={this.handleOk} 
                        onCancel={this.handleCancel}>
                        
                        平台会根据填写的链路当前容量来计算单位容量所需机器数，已经填写的单位容量机器台数将会被覆盖，确认是否操作



                    </Modal>


                        <OperateUrlConfig 
                        ref={this.wrapper}  
                        visible={this.state.confvisible}
                        detail={this.state.detail}
                        configmodals={configChange}
                    />
                            



                    <Modal title="扩容比例批量设置" 
                    footer={null}
                    maskClosable={false}
                    destroyOnClose	
                    visible={this.state.renamelinkisModalVisible} 
                    width={520}
                    onCancel={this.msssconfigModalVisible}>
                    
                    {this.state.createloading ? (
                    <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
                    ): ("")}

                    <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    
                    autoComplete="off"
                    onFinishFailed={onFinishFailedrenamelink}
                    onFinish={onFinishrenamelink}

                    >


                    {this.state.onekeyxloading ? (
                        <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
                    ): ("")}
                            <div id="tipsxa">
                            平台会根据填写的链路当前容量来计算单位容量所需机器数，已经填写的单位容量机器台数将会被覆盖，确认是否操作
                            </div>
                                        
                                <Col span={24}>
                                    <div className="leftdivs">
                                        <div id="wrapx">
                                            <span>
                                                根据当前容量 
                                            </span>
                                            <Tooltip title="通过填写当前容量，平台通过当前机器数来计算每个模块的单位容量机器台数">

                                                <QuestionCircleOutlined />

                                            </Tooltip>
                                            <span>
                                                :
                                        </span>

                                        </div>




                                    
                                            <Form.Item
                                                label=""
                                                name="bulkexpandnum"
                                                className="widthonehd"
                                                rules={[{ required: true, message: '单位容量机器台数!' }]}
                                                
                                            >


                                            <InputNumber />
                                        </Form.Item>
                                        
                                        
                                     
                                    </div>
                                </Col>

                    

                
                    <Form.Item  {...tailLayout} >
                    <div id="btnright">
                        <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                            提交
                        </Button>
                        <Button htmlType="button" onClick={this.msssconfigModalVisible}>
                            取消
                        </Button>
                    </div>
                    </Form.Item>
                    </Form>

                    </Modal>

            

            </div>


        )
    }

}





export default withRouter(CapacityDetail);