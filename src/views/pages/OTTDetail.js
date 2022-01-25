import React from 'react';

import { Table, Button, Form, Checkbox, InputNumber, notification, Spin, Modal, Tooltip, Tabs, Radio, Space, Input, } from 'antd';

import axios from "axios";
import { withRouter, Link } from 'react-router-dom';
import { LoadingOutlined, CheckCircleOutlined, QuestionCircleOutlined, SyncOutlined, ToTopOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { APIURL } from '../../common/constdt.js';
import { number } from 'echarts';
import Item from 'antd/lib/list/Item';



const { TabPane } = Tabs;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const tailLayout = {
    wrapperCol: {
        offset: 2,
        span: 22,
    },
};




class OTTDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tabledtnew: null,
            fselectedRowKeys: [],
            expanded_ids: [],
            reduced_ids: [],
            inputnum: null,
            spinstatus: false,
            checkedalla: false,
            checkreduce: false,
            renamelinkisModalVisible: false,
            createloading: false,
            tbdlist: null,
            defaultActive: 0,
            showpaak: false,
            typenum: 0,
            arr: [],
            arrtwo: [],
            isModalVisible: false,
            way: 1,
            fileuploadModalVisible: false,
            id: null,
            yesisModalVisible: false,
            pagelist: [],
            detail_list: []
        }
        this.capacity_bulkExpand = this.capacity_bulkExpand.bind(this);
        this.capacitybulkReduce = this.capacitybulkReduce.bind(this);
        this.checkeddt = this.checkeddt.bind(this);
        this.checkedrd = this.checkedrd.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChangecheckall = this.onChangecheckall.bind(this);
        this.onSChangecheckall = this.onSChangecheckall.bind(this);
        this.masssetting = this.masssetting.bind(this);
        this.msssconfigModalVisible = this.msssconfigModalVisible.bind(this);
        this.callback = this.callback.bind(this)
    }




    componentDidMount() {

        this.agetRates()

    }

    callback(v) {
        console.log(v)
        this.setState({
            defaultActive: v,
            checkedalla: false,
            checkreduce: false,
            id: v
        })
    }

    masssetting(v) {


        this.setState({
            renamelinkisModalVisible: true,
        })

    }

    msssconfigModalVisible = () => {
        this.setState({
            renamelinkisModalVisible: false,
        })
    }


    onSChangecheckall(v) {



        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;
        let new_arr = [];
        for (let u = 0; u < dt.length; u++) {


            if (dt[u].link_id == link_id) {
                new_arr = dt[u].list;
            }
        }

        let nlist = [];

        if (v.target.checked == true) {





            this.setState({
                checkreduce: true,
            })



            for (let z = 0; z < new_arr.length; z++) {

                let v = {};

                v = Object.assign({}, new_arr[z]);
                v.selectedx = true;

                nlist.push(v)
            }



        } else {

            this.setState({
                checkreduce: false,
            })

            for (let z = 0; z < new_arr.length; z++) {
                let v = {};

                v = Object.assign({}, new_arr[z]);
                v.selectedx = false;

                nlist.push(v)
            }




        }


        console.log(dt);
        console.log(nlist);


        let new_dtx = []

        for (let p = 0; p < dt.length; p++) {

            let objg = {}
            objg.link_id = dt[p].link_id;
            objg.link_name = dt[p].link_name;
            objg.link_all_name = dt[p].link_all_name;

            if (link_id == dt[p].link_id) {
                objg.list = nlist;


            } else {
                objg.list = dt[p].list
            }
            new_dtx.push(objg)
        }


        console.log(new_dtx);

        this.setState({
            tabledtnew: new_dtx,
        })



    }

    onChangecheckall(v) {


        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;
        let new_arr = [];
        for (let u = 0; u < dt.length; u++) {


            if (dt[u].link_id == link_id) {
                new_arr = dt[u].list;
            }
        }




        let nlist = [];
        if (v.target.checked == true) {

            this.setState({
                checkedalla: true,
            })


            for (let z = 0; z < new_arr.length; z++) {

                let v = {};

                v = Object.assign({}, new_arr[z]);
                v.selected = true;

                nlist.push(v)
            }


        } else {

            this.setState({
                checkedalla: false,
            })


            for (let z = 0; z < new_arr.length; z++) {
                let v = {};

                v = Object.assign({}, new_arr[z]);
                v.selected = false;

                nlist.push(v)
            }



        }

        console.log(dt);
        console.log(nlist);


        let new_dtx = []

        for (let p = 0; p < dt.length; p++) {

            let objg = {}
            objg.link_id = dt[p].link_id;
            objg.link_name = dt[p].link_name;
            objg.link_all_name = dt[p].link_all_name;

            if (link_id == dt[p].link_id) {
                objg.list = nlist;


            } else {
                objg.list = dt[p].list
            }
            new_dtx.push(objg)
        }


        console.log(new_dtx);

        this.setState({
            tabledtnew: new_dtx,
        })
    }


    checkedrd(value) {

        let reducenum = 0;
        console.log(value)


        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;


        let tmarrexp = []

        for (let p = 0; p < dt.length; p++) {
            if (link_id == dt[p].link_id) {
                tmarrexp = dt[p].list;
            }
        }





        let singleexplist = []


        for (let j = 0; j < tmarrexp.length; j++) {
            let v = {};

            v = Object.assign({}, tmarrexp[j]);



            if (value.target.reduce == tmarrexp[j].id) {


                if (value.target.checked) {
                    v.selectedx = true;




                } else {
                    v.selectedx = false;

                    this.setState({
                        checkreduce: false,
                    })

                }


            }

            singleexplist.push(v)

        }



        for (let b = 0; b < singleexplist.length; b++) {
            if (!singleexplist[b].selectedx && singleexplist[b].expand_oncall_id != 0) {
                this.setState({
                    checkreduce: false,

                })

            } else {
                reducenum++
            }

        }

        if (reducenum == singleexplist.length) {
            this.setState({
                checkreduce: true,
            })
        }


        let singledtz = [];

        for (let q = 0; q < dt.length; q++) {


            let objg = {}
            objg.link_id = dt[q].link_id;
            objg.link_name = dt[q].link_name;
            objg.link_all_name = dt[q].link_all_name;

            if (dt[q].link_id == link_id) {
                objg.list = singleexplist;

            } else {
                objg.list = dt[q].list
            }

            singledtz.push(objg);
        }

        console.log(singledtz)


        this.setState({
            tabledtnew: singledtz,
        })





    }

    checkeddt(value) {


        console.log(value);
        let expandnumx = 0;


        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;


        let tmarrexp = []

        for (let p = 0; p < dt.length; p++) {
            if (link_id == dt[p].link_id) {
                tmarrexp = dt[p].list;
            }
        }





        let singleexplist = []


        for (let j = 0; j < tmarrexp.length; j++) {
            let v = {};

            v = Object.assign({}, tmarrexp[j]);



            if (value.target.expand == tmarrexp[j].id) {


                if (value.target.checked) {
                    v.selected = true;



                } else {
                    v.selected = false;

                    this.setState({
                        checkedalla: false,
                    })


                }


            }
            console.log(expandnumx)
            singleexplist.push(v)

        }




        for (let b = 0; b < singleexplist.length; b++) {
            if (!singleexplist[b].selected) {
                this.setState({
                    checkedalla: false,

                })

            } else {
                expandnumx++
            }

        }


        if (expandnumx == singleexplist.length) {
            this.setState({
                checkedalla: true,
            })

        }




        let singledtz = [];

        for (let q = 0; q < dt.length; q++) {


            let objg = {}
            objg.link_id = dt[q].link_id;
            objg.link_name = dt[q].link_name;
            objg.link_all_name = dt[q].link_all_name;

            if (dt[q].link_id == link_id) {
                objg.list = singleexplist;

            } else {
                objg.list = dt[q].list
            }

            singledtz.push(objg);
        }

        console.log(singledtz)


        this.setState({
            tabledtnew: singledtz,
        })





    }

    // 列表接口
    async agetRates() {


        const ts = this.props.id
        // const url = `${APIURL}/capacity/handList?event_id=${ts}`;

        const url = `${APIURL}/capacity/list?event_id=${ts}`;

        var that = this;
        await axios.get(url, { withCredentials: true })
            .then(function (response) {

                console.log(response);
                if (response.data.code == 0) {
                    that.setState((prevState, props) => ({
                        spinstatus: true,
                        tabledtnew: response.data.data,
                        tbdlist: response.data.data,
                        typenum: response.data.expand_data.expand_pattern,
                        id: response.data.data[0].link_id,
                        way: response.data.expand_data.expand_pattern
                    }))
                    console.log(response);
                    if (response.data.data && response.data.data.length >= 1) {
                        that.setState({
                            defaultActive: response.data.data[0].link_id,
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
            inputnum: v,

        })

    }


    async masssconfigxapi(d) {




        console.log(this.state.defaultActive);


        this.setState({

            createloading: true,

        })




        const url = `${APIURL}/capacity/update`;

        var bodyFormData = new FormData();

        bodyFormData.append("num", d.bulkexpandnum);



        let tmpmarr = []

        let rs = this.state.defaultActive;
        for (let r = 0; r < this.state.tbdlist.length; r++) {
            if (rs == this.state.tbdlist[r].link_id) {
                tmpmarr = this.state.tbdlist[r].list
            }


        }
        bodyFormData.append("capacity_id_list", JSON.stringify(tmpmarr));


        let that = this;
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

                    that.agetRates()

                    that.setState({
                        renamelinkisModalVisible: false,
                    })



                }
            })
            .catch(function (error) {
                console.log(error);

                notification.error({
                    message: '提示',
                    description: JSON.stringify(error.response.data.msg),
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });


            })

        that.setState({
            createloading: false,

        })

    }

    async neednum(d) {



        let nm = document.getElementById(`input_${d.id}`).innerText;
        nm = nm * 1;
        console.log(typeof nm)

        if (typeof nm != "number" || isNaN(nm)) {
            notification.error({
                message: '提示',
                description: '扩容比例需要填入 Number !',
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

        const url = `${APIURL}/capacity/update`;

        var bodyFormData = new FormData();

        bodyFormData.append("num", nm);



        let tmp = []
        tmp.push(d.id)
        bodyFormData.append("capacity_id_list", JSON.stringify(tmp));

        let that = this;
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

                    that.agetRates()



                }
            })
            .catch(function (error) {
                console.log(error);

            })



    }
    async capacity_bulkExpand(v) {


        console.log(v);



        let bodyFormData = new FormData();

        this.setState({
            spinstatus: false,

        })

        let tdt = this.state.tabledtnew;

        let bulk_expand_list = [];
        let tmplist = [];

        for (let h = 0; h < tdt.length; h++) {
            if (v == tdt[h].link_id) {
                tmplist = tdt[h].list;
            }
        }

        for (let g = 0; g < tmplist.length; g++) {
            if (tmplist[g].selected == true && tmplist[g].expand_oncall_id == 0) {
                bulk_expand_list.push(tmplist[g])
            }
        }
        console.log(bulk_expand_list)

        if (!bulk_expand_list || bulk_expand_list.length < 1) {

            notification.error({
                message: '提示',
                description: '请选择',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            return false;

        }





        let url = `${APIURL}/capacity/bulkExpand`;


        bodyFormData.append("bulk_expand_list", JSON.stringify(bulk_expand_list));
        let t_uid = this.getCookie("EngName");

        if (t_uid) {
            bodyFormData.append("t_uid", t_uid);
        }



        var that = this;
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
                        checkedalla: false,

                    })
                    that.agetRates();
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
                    description: JSON.stringify(error.response.data.msg),
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });


            })
        that.setState({
            spinstatus: true,
        })

    }



    async capacitybulkReduce(v) {


        this.setState({
            spinstatus: false,

        })


        let bodyFormData = new FormData();


        let tdt = this.state.tabledtnew;

        let bulkReducelist = [];
        let tmplist = [];

        for (let h = 0; h < tdt.length; h++) {
            if (v == tdt[h].link_id) {
                tmplist = tdt[h].list;
            }
        }

        for (let g = 0; g < tmplist.length; g++) {
            if (tmplist[g].selectedx == true && tmplist[g].reduce_oncall_id == 0 && tmplist[g].expand_oncall_id != 0) {
                bulkReducelist.push(tmplist[g].id)
            }
        }
        console.log(bulkReducelist)

        if (!bulkReducelist || bulkReducelist.length < 1) {

            notification.error({
                message: '提示',
                description: '请选择',
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            return false;

        }

        let t_uid = this.getCookie("EngName");

        if (t_uid) {
            bodyFormData.append("t_uid", t_uid);
        }


        bodyFormData.append("capacity_id_list", JSON.stringify(bulkReducelist));

        let url = `${APIURL}/capacity/bulkReduce`;




        var that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {

                if (response.data.code === 0) {
                    that.agetRates();


                    notification.success({
                        message: '提示',
                        description:
                            response.data.msg,
                        placement: 'topCenter',
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                    that.setState({

                        checkreduce: false,

                    })

                } else {


                    notification.error({
                        message: '提示',
                        description:
                            response.data.msg,
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
                    description: JSON.stringify(error.response.data.msg),
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });


            })

        that.setState({
            spinstatus: true,
        })
    }



    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({
            fselectedRowKeys: selectedRowKeys
        });
    };




    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    yeshandleOk = () => {
        this.setState({ yesisModalVisible: false })
    }
    yeshandleCancel = () => {
        this.setState({ yesisModalVisible: false })
    }
    scale = () => {
        if (this.state.typenum == 0) {
            this.setState({ isModalVisible: true })
        } else {
            this.setState({ showpaak: true })
        }
    }
    showtype = () => {
        this.setState({ showpaak: false })
    }
    handleOk = () => {
        const url = `${APIURL}/capacity/updatExpandPattern`
        const ts = this.props.id
        var bodyFormData = new FormData();
        bodyFormData.append("event_id", ts);
        bodyFormData.append("expand_pattern", this.state.way);
        console.log(ts);
        axios.post(url, bodyFormData).then(
            res => {
                console.log(res);
                this.setState({ isModalVisible: false })
                this.setState({ showpaak: true })
            },
            err => {
                console.log(err);
            }
        )
        this.setState({ isModalVisible: false })
        this.setState({ showpaak: true })
    };

    handleCancel = () => {
        this.setState({ isModalVisible: false })
    };
    way = (e) => {
        console.log(e.target.value);
        this.setState({ way: e.target.value })
    }
    bulk = () => {
        // console.log(this.state.tbdlist);
        this.setState({ fileuploadModalVisible: true })

    }
    onlist = () => {
        let a = this.state.detail_list.map(item => <li>{item}</li>)
        return a
        console.log(a);
    }
    bulks = () => {
        const link_id = this.state.defaultActive
        const obj = this.state.tabledtnew
        let arr = obj.filter(e => e.link_id == link_id)
        let batch_set_capacity_file_str = []
        arr[0].list.map(item => {
            let obj = {}
            obj["power_msg_and_url"] = item.power_msg_and_url
            obj["app_name"] = item.app_name
            obj["server_name"] = item.server_name
            obj["set_name"] = item.set_name
            obj["now_num"] = item.now_num
            obj["area"] = item.area
            obj["expand_scale_num"] = item.expand_scale_num
            batch_set_capacity_file_str.push(obj)
        })
        batch_set_capacity_file_str.push(this.state.way == 1 ? '目标台数' : '目标核数')
        const url = `${APIURL}/eventInfo/batchSetCapacityDownloadFile`
        let bodyFormData = new FormData();
        bodyFormData.append("batch_set_capacity_file_str", JSON.stringify(batch_set_capacity_file_str));
        console.log(batch_set_capacity_file_str);
        axios.post(url, bodyFormData,
            { responseType: 'arraybuffer', }
        ).then(res => {
            console.log(res);
            const data = res.data
            const url = window.URL.createObjectURL(new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', 'excel.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }).then(err => {
            console.log(err);
        }).catch(err => {
            notification.error({
                message: '提示',
                // description: JSON.stringify(err.response.data.msg),
                duration: 60,
                placement: 'topCenter',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }
        )
    }
    fileuploadapi = () => {
        this.setState({ fileuploadModalVisible: false })
        const xurl = `${APIURL}/eventInfo/batchSetCapacityUploadFile`
        let selectedFile = document.getElementById('filexd').files[0];
        let url_string = window.location.href.replace(/\/#/g, "")
        let url = new URL(url_string);
        let id = url.searchParams.get("id");
        let bodyFormData = new FormData();
        bodyFormData.append("form_data", selectedFile);
        bodyFormData.append("event_id", id);
        let that = this;
        axios.post(xurl, bodyFormData)
            .then(function (response) {
                console.log(response);
                if (response.data.code == 0) {
                    that.setState({
                        fileuploadModalVisible: false,
                    });
                    that.agetRates()
                    notification.success({
                        message: '提示',
                        description: response.data.msg,
                        placement: 'topCenter',
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                } else {
                    notification.error({
                        message: '提示',
                        description: response.data.msg,

                        placement: 'topCenter',
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
                if (error.response) {
                    notification.error({
                        message: '提示',
                        description: JSON.stringify(error.response.data),

                        placement: 'topCenter',
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                } else {
                    notification.error({
                        message: '提示',
                        description: JSON.stringify(error),

                        placement: 'topCenter',
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                }
            })
    }
    fileupcancelhandleCancel = () => {
        this.setState({ fileuploadModalVisible: false })
    }
    fileupld = (v) => {
        console.log(v);
        const selectedFile = document.getElementById('filexd').files[0];
        let t = document.getElementById('filexd').files;
        console.log(t)
        console.log(selectedFile)

        this.setState({
            filenames: selectedFile.name,
        })
    }
    handleClick = () => {
        if (this.state.arr.length == 0) {
            alert('无选中项无法扩容')
        } else {
            let arr = this.state.arr
            arr.map((item, index) => {
                arr[index]["expand_pattern"] = this.state.way
                arr[index]["expand_scale_num"] = arr[index].target_num
                console.log(item.target_num);
                return arr
            })
            console.log(this.state.arr);
            const urlg = `${APIURL}/capacity/bulkExpand`
            let bodyFormData = new FormData();
            bodyFormData.append("bulk_expand_list", JSON.stringify(arr));
            bodyFormData.append("expand_type", this.state.way);
            let t_uid = this.getCookie("EngName");
            if (t_uid) {
                bodyFormData.append("t_uid", t_uid);
            }
            let link_id = this.state.defaultActive;
            console.log(link_id);
            bodyFormData.append("link_id", link_id);
            // bodyFormData.append("expand_type", link_type);
            axios.post(urlg, bodyFormData).then(
                res => {
                    console.log('成功', res.data.data);
                    this.setState({ pagelist: res.data.data })
                    this.setState({ detail_list: res.data.data.detail_list })
                    this.setState({ yesisModalVisible: true })
                    // steYescode(res.data.data)
                    // setIsModalVisible(true);
                },
                err => {
                    alert(err.response.data.msg)
                    console.log(err);
                }
            )
        }

    }
    render() {



        const onFinishFailedrenamelink = (errorInfo) => {
            console.log('Failed:', errorInfo);
        };



        const onFinishrenamelink = (values) => {
            console.log('Success:', values);

            this.masssconfigxapi(values)
        };

        function power(v) {

            let txt = v.power_msg_and_url.power_msg;
            let lik = v.power_msg_and_url.url;


            if (txt.length == 0 && lik.length == 0) {
                return <CheckCircleOutlined />
            } else if (txt.length != 0 && lik.length == 0) {
                return txt;
            } else if (txt.length != 0 && lik.length != 0) {

                return <div className="powerdiv">
                    <a target="_blank" rel="noreferrer" href={lik} > {txt} </a>
                    <Tooltip title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
                        <QuestionCircleOutlined />
                    </Tooltip>
                </div>

            }
        }



        const columns = [
            {
                title: "权限",
                dataIndex: 'power_msg_and_url',
                align: "center",
                width: "10%",

                render: (text, data) => power(data)

            },
            {
                title: '服务名',
                dataIndex: 'server_name',
                align: "center",
                width: "10.2%",
                render: (text, data, index) => (

                    <a rel="noopener noreferrer" href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app_name}&server=${data.server_name}`} target="_blank"> {data.app_name + "." + data.server_name}  </a>

                )

            },
            {
                title: 'set',
                dataIndex: 'set_name',
                align: "center",
                width: "10.2%",
                render: (text, data, index) => (
                    <span> {data.set_name ? data.set_name : "--"} </span>
                )

            },
            {
                title: '地域',
                dataIndex: 'area',
                width: "10.2%",
                align: "center",

            },
            {
                title: '当前台数',
                dataIndex: 'now_num',
                align: "center",
                width: "10.2%",
            },
            {
                title: () => {
                    return (
                        <>
                            {this.state.way == 1 ? '目标台数' : '目标核数'}
                            <Button type="primary" className='btngo' onClick={this.bulk}>
                                批量设置
                            </Button>
                        </>
                    )
                },
                index: "name",
                dataIndex: 'target_num',
                align: "center",
                width: "19.2%",
                render: (text, record, index) => renderInput(text, record, index, "target_num"),

            }
        ]
        const renderInput = (text, record, index, field) => {
            return (
                <>
                    <div
                        contentEditable="true"
                        suppressContentEditableWarning="true"
                        value={this.state.way == 1 ?record.target_num:record.target_cpu_num}
                        className="inputdivs"
                        id={record.id}
                        onBlur={(e) => handleSave(e, record)}
                    >{this.state.way == 1 ?record.target_num:record.target_cpu_num}</div>
                </>
            )
        };
        const handleSave = (e, record, index, field) => {
            let value = document.getElementById(record.id).innerHTML
            let arrs = this.state.arr
            arrs.map(item => {
                if (item.id == record.id) {
                    item['target_num'] = value
                }
            })
            this.setState({ arr: arrs })
            record['scale'] = value
            console.log(record.id, value, arrs);
            // data[index] = record;
            // data[field] = e.target.value;

            const url = `${APIURL}/capacityModel/updateOneModel`
            var bodyFormData = new FormData();
            bodyFormData.append("id", record.id);
            bodyFormData.append("num", value);
            bodyFormData.append("target_num_or_target_cpu_num", this.state.way == 1 ? '目标台数' : '目标核数');
            let that = this
            axios.post(url, bodyFormData).then(
                res => {
                    console.log(res);
                    that.agetRates()
                },
                err => {
                    console.log(err);
                }
            )
        }
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState((prevState, props) => ({ arr: selectedRows, arrtwo: selectedRowKeys }))
            },
            getCheckboxProps: (record) => ({
                disabled: record.is_power === 0 || record.is_power === 2,
                // Column configuration not to be checked
            }),
        };
        const arrobj = () => {
            //有核数
            const columns = [
                {
                    title: "权限",
                    dataIndex: 'power_msg_and_url',
                    align: "center",
                    width: "10%",

                    render: (text, data) => power(data)

                },
                {
                    title: '服务名',
                    dataIndex: 'server_name',
                    align: "center",
                    width: "10.2%",
                    render: (text, data, index) => (

                        <a rel="noopener noreferrer" href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app_name}&server=${data.server_name}`} target="_blank"> {data.app_name + "." + data.server_name}  </a>

                    )

                },
                {
                    title: 'set',
                    dataIndex: 'set_name',
                    align: "center",
                    width: "10.2%",
                    render: (text, data, index) => (
                        <span> {data.set_name ? data.set_name : "--"} </span>
                    )

                },
                {
                    title: '地域',
                    dataIndex: 'area',
                    width: "10.2%",
                    align: "center",

                },
                {
                    title: '当前台数',
                    dataIndex: 'now_num',
                    align: "center",
                    width: "10.2%",

                },
                {
                    title: () => {
                        return (
                            <>
                                {this.state.typenum == 1 ? '目标台数' : '目标核数'}
                            </>
                        )
                    },
                    dataIndex: 'target_num',
                    align: "center",
                    width: "19.2%",
                }
            ]
            // 没核数
            const columnsr = [
                // {
                //     title: ()=> {
                //         return (

                //                 this.state.checkedalla ? (

                //                     <Checkbox onChange={this.onChangecheckall} checked >   扩容工单号 </Checkbox>
                //                 ): (

                //                     <Checkbox onChange={this.onChangecheckall} checked={false}>   扩容工单号  </Checkbox>
                //                 )


                //             )
                //     },
                //     dataIndex: 'expand_oncall_id',
                //     align: "center",
                //     width: "12.2%",
                //     render: (text, data, index) => (
                //         <span>

                //          {data.expand_oncall_id == 0 ? (

                //              <Form.Item
                //                 valuePropName="expand"
                //                 name={data.id+"_a"}
                //                 initialValue={data.id}
                //             >    
                //                 <Checkbox    onChange={this.checkeddt}   checked={data.selected ? data.id : false} > </Checkbox>

                //              </Form.Item>
                //          ) : (

                //              <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.expand_oncall_id}`}  target="_blank"> {data.expand_oncall_id} </a>
                //          )}
                //         </span>
                //     )

                // },  
                // {
                //     title: () => {

                //         return (

                //           this.state.checkreduce  ? (

                //             <Checkbox onChange={this.onSChangecheckall}  checked={true}>  缩容工单号 </Checkbox>

                //           ) : (
                //             <Checkbox onChange={this.onSChangecheckall}  checked={false}>   缩容工单号 </Checkbox>

                //           )


                //         )},
                //     dataIndex: 'reduce_oncall_id',
                //     align: "center",
                //     width: "12.2%",
                //     render: (text, data, index) => (
                //         <span>
                //          {data.reduce_oncall_id == 0 ? (

                //              <div>
                //                  {data.expand_oncall_id == 0 ? (
                //                       <Form.Item

                //                             name={data.id}
                //                             defaultChecked={false}
                //                             valuePropName="reduce" 

                //                         >    
                //                           <Checkbox  disabled />

                //                         </Form.Item>
                //                  ): (
                //                     <Form.Item
                //                         valuePropName="reduce"

                //                         name={data.id}
                //                         initialValue={data.id}
                //                     >    
                //                         <Checkbox  onChange={this.checkedrd}  checked={data.selectedx ? data.id : false}></Checkbox>

                //                     </Form.Item>
                //                  )}
                //              </div>


                //          ) : (
                //             <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.reduce_oncall_id}`} target="_blank"> {data.reduce_oncall_id} </a>
                //          )}
                //         </span>
                //     )

                // },

                {
                    title: "权限",
                    dataIndex: 'power_msg_and_url',
                    align: "center",
                    width: "10%",

                    render: (text, data) => power(data)

                },
                {
                    title: '服务名',
                    dataIndex: 'server_name',
                    align: "center",
                    width: "10.2%",
                    render: (text, data, index) => (

                        <a rel="noopener noreferrer" href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app_name}&server=${data.server_name}`} target="_blank"> {data.app_name + "." + data.server_name}  </a>

                    )

                },
                {
                    title: 'set',
                    dataIndex: 'set_name',
                    align: "center",
                    width: "10.2%",
                    render: (text, data, index) => (
                        <span> {data.set_name ? data.set_name : "--"} </span>
                    )

                },
                {
                    title: '地域',
                    dataIndex: 'area',
                    width: "10.2%",
                    align: "center",

                },
                {
                    title: '当前台数',
                    dataIndex: 'now_num',
                    align: "center",
                    width: "10.2%",

                },
            ]
            let columnsc = (this.state.typenum == 0 ? columnsr : columns)
            return columnsc
        }
        const columnsz = arrobj()

        return (

            <div id="OTTDetail">


                <Tabs defaultActiveKey="1" onChange={this.callback}>

                    {this.state.tabledtnew ? (


                        this.state.tabledtnew.map((i, ind) => {
                            return (

                                <TabPane

                                    tab={
                                        <span>

                                            {this.state.defaultActive == i.link_id ? (
                                                <SyncOutlined />
                                            ) : ""}

                                            {i.link_name}

                                        </span>
                                    }


                                    key={i.link_id}>

                                    <Form
                                        name="basic"
                                        autoComplete="off"

                                        key={i.link_id + ""}
                                    >
                                        {this.state.showpaak == false
                                            ?
                                            <div>
                                                <div className='chunkOTT'>
                                                    <Button type="primary" size='small' onClick={this.scale}>扩容</Button>
                                                    <Button disabled size='small'>缩容</Button>
                                                    <Link to={{ pathname: `/Taslist`,search: `event_id=${this.props.id}`}}>
                                                        <Button type="primary" size='small'>操作日志</Button>
                                                    </Link>
                                                </div>
                                                <Table


                                                    columns={columnsz}
                                                    rowKey="id"
                                                    dataSource={i.list}
                                                    pagination={{
                                                        total: i.list.length,
                                                        pageSize: i.list.length,
                                                    }}
                                                /></div>
                                            :
                                            <div>
                                                <div className='chunkOTT'>
                                                    <Button type="primary" size='small' onClick={this.handleClick}>开始扩容</Button>
                                                    <Button type="primary" size='small' onClick={this.showtype}>返回</Button>
                                                </div>
                                                <Table
                                                    rowSelection={{
                                                        ...rowSelection,
                                                    }}
                                                    columns={columns}
                                                    dataSource={i.list}
                                                    pagination={{
                                                        total: i.list.length,
                                                        pageSize: i.list.length,
                                                    }}
                                                    rowKey={record => record.id}
                                                />
                                            </div>
                                        }


                                        <Modal title="选择扩容方式" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                                            <Radio.Group onChange={this.way} value={this.state.way}>
                                                <Space direction="vertical">
                                                    <Radio value={1}>目标台数</Radio>
                                                    <Radio value={2}>目标核数</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Modal>
                                        <Modal title={`批量添加`}
                                            width="350px"
                                            okText="确定"
                                            visible={this.state.fileuploadModalVisible}
                                            onOk={this.fileuploadapi}
                                            onCancel={this.fileupcancelhandleCancel}
                                            wrapClassName="massuploadmodal"
                                        >

                                            <div id="inputfile">


                                                <a href='javascript:void(0)' onClick={this.bulks}>
                                                    <CloudDownloadOutlined height="4em" />
                                                    下载模版
                                                </a>

                                                <div id="fileuploadicons">
                                                    <ToTopOutlined height="4em" />
                                                    <i className="right">
                                                        上传表格
                                                    </i>
                                                    <Input placeholder="file" type="file" id="filexd" multiple onChange={this.fileupld} />

                                                </div>

                                            </div>
                                            <span id="filenamtip"> {this.state.filenames ? (`文件名称： ${this.state.filenames}`) : ""}</span>

                                        </Modal>
                                    </Form>
                                </TabPane>
                            )
                        })



                    ) : (

                        ""
                    )}

                </Tabs>
                <Modal title="任务执行中" visible={this.state.yesisModalVisible} onOk={this.yeshandleOk} onCancel={this.yeshandleCancel}>
                    <div className='pagelist'>
                        <span>任务名称：{this.state.pagelist.task_name}</span>
                        <span>任务id：<Link to={{ pathname: `/Taslist`, search: `task_id=${this.state.pagelist.task_id}` }}>
                            {this.state.pagelist.task_id}
                        </Link>
                        </span>
                    </div>
                    <div className='pagelist'>
                        <span>oncall工单id：<a href={`http://oncall.oa.com/workBench?id=${this.state.pagelist.expand_oncall_id}`}>{this.state.pagelist.expand_oncall_id}</a></span>
                        <span>操作人：{this.state.pagelist.user_name}</span>
                    </div>
                    <div>
                        <Form.Item
                            label="扩容详情"
                        >
                            {this.onlist()}
                        </Form.Item>
                    </div>
                </Modal>
            </div>
        )
    }
}


export default withRouter(OTTDetail);