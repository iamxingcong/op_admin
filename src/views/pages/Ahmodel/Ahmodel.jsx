import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Tooltip, Modal, InputNumber, Form } from 'antd';
import { QuestionCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, } from '@ant-design/icons';
import axios from 'axios';
import './Ahmodel.css'
import { APIURL } from '../../../common/constdt'
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
const Ahmodel = () => {
    const [arr, setarr] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [arrtwo, setarrtwo] = useState([]);
    const [data, setdata] = useState([])
    const [issModalVisible, setIssModalVisible] = useState(false);
    const [inputvalue, steInputvalue] = useState('')
    const [yescode, steYescode] = useState(null)
    const [expand_type,setExpand_type] = useState(null)
    const id = useLocation()
    const urlid = id.search
    const urlId = urlid.slice(1)
    console.log(urlId.charAt(urlId.length-1));
    const url = `${APIURL}/list/list?type=1&show_type=1&link_id=${urlId}`
    const urlg = `${APIURL}/capacityModel/bulkExpand`
    const showModals = () => {
        setIssModalVisible(true);
    };
    const getCookie = (cname) => {
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
    const handleCancels = () => {
        setIssModalVisible(false);
    };
    // 渲染出来input,输入的时候改变dataSource的数据
    const renderInput = (text, record, index, field) => {
        return (
            <>
                <div
                    contentEditable="true"
                    value={record.scale}
                    className="inputdivs"
                    id={record.id}
                    onBlur={(e) => handleSave(e, record)}
                >{record.scale}</div>
            </>
        )
    };
    // 当input框发生变化后
    const handleSave = (e, record, index, field) => {
        let value = document.getElementById(record.id).innerHTML
        record['scale'] = value
        // record['link_id'] = 117
        let arr = []
        arr.push(record)
        data[index] = record;
        data[field] = e.target.value;
    }
    // 批量修改
    const Inputgo = (e) => {
        console.log(e.target.value);
        let value = e.target.value
        steInputvalue(value)
        console.log(inputvalue);
    }
    const handleOks = () => {
        setIssModalVisible(false);
        axios.get(url, {
            params: {
                scale: inputvalue
            }
        }).then(
            res => {
                console.log('成功', res);
                let data = res.data.data.list_data
                setdata(data)
            },
            err => {
                console.log('失败', err);
            }
        )

    };
    // 表头
    const columns = [
        {
            title: '权限',
            dataIndex: 'is_power',
            width: 30,
            render: (text, record) => {
                return (
                    record.is_power == 1 ? <CheckCircleOutlined />
                        : record.is_power == 2 ? < CloseCircleOutlined /> :
                            <a href={record.url}>授权
                                <Tooltip placement="top" title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
                                    <QuestionCircleOutlined className='incons' />
                                </Tooltip></a >
                )
            },
        },
        {
            title: '应用服务',
            dataIndex: 'app_server',
            textWrap: 'word-break',
            width: 50,
        },
        {
            title: '地域',
            dataIndex: 'city',
            width: 70,
        },
        {
            title: 'set',
            dataIndex: 'set',
            width: 20,
        },
        {
            title: 'cpu平均使用率',
            dataIndex: 'cpu',
            width: 40,
            render: (text, record) => record.cpu + '%'
        },
        {
            title: 'cpu峰值使用率',
            dataIndex: 'max_cpu',
            width: 30,
            render: (text, record) => {
                return <span>{record.max_cpu}{'%'}</span>
            }
        },
        {
            title: '总容器数',
            dataIndex: 'num',
            width: 30,
        },
        {
            title: '总核数',
            dataIndex: 'num_cpu',
            width: 40,
        },
        {
            title: () => {
                return (
                    <>
                        {urlId.charAt(urlId.length-1) == 0? '按比例扩容': urlId.charAt(urlId.length-1) == 1?'根据数量扩容':urlId.charAt(urlId.length-1) == 2?'根据核数扩容':'按比例扩容'}
                        <Button type="primary" className='btngo' onClick={showModals}>
                            批量设置
                        </Button>
                    </>
                )
            },
            dataIndex: "scale",
            index: "name",
            width: 90,
            render: (text, record, index) => renderInput(text, record, index, "scale"),

        }
    ];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setarr(selectedRows)
            setarrtwo(selectedRowKeys)
            console.log(arr);
            console.log(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.is_power === 0 || record.is_power === 2,
            // Column configuration not to be checked
        }),
    };
    // 开始扩容点击事件
    const handleClick = () => {
        let arr = []
        for (let i = 0; i < data.length; i++) {
            for (let a = 0; a < arrtwo.length; a++) {
                if (data[i].id == arrtwo[a]) {
                    arr.push(data[i])
                }
            }
        }
        console.log(arr);
        if (arr.length == 0) {
            alert('无选中项无法扩容')
        } else {
            let bodyFormData = new FormData();
            bodyFormData.append("bulk_expand_list", JSON.stringify(arr));
            let t_uid = getCookie("EngName");
            if (t_uid) {
                bodyFormData.append("t_uid", t_uid);
            }
            let link_id = urlId.split('&')
            const link_type = link_id[1] == 'undefined'? '0': link_id[1]
            console.log(link_type);
            console.log(link_id);
            bodyFormData.append("link_id", link_id[0]);
            bodyFormData.append("expand_type", link_type);
            axios.post(urlg, bodyFormData).then(
                res => {
                    console.log('成功', res.data.data);
                    steYescode(res.data.data)
                    setIsModalVisible(true);
                },
                err => {
                    alert(err.response.data.msg)
                    console.log(err);
                }
            )
        }



    }
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const goback = () => {
        window.history.back(-1)
    }
    useEffect(() => {
        // let id = {}
        axios.get(url).then(
            res => {
                let data = res.data.data.list_data
                setdata(data)
                setExpand_type(urlId.split('&')[1])
                console.log(data);
                // data.map(itme=>{
                //     id[itme.id] = ''
                // })
                // setname(id)
                console.log(expand_type);
            },
            err => {
                console.log('失败', err);
            }
        )
    }, [])
    return (
        <div>
            {/* seek */}
            <div className='box'>
                <span className='box_p'>
                    容量模型
                </span>
                <div className='box_Button'>
                    <Button type="primary" onClick={handleClick} >
                        开始扩容
                    </Button>
                    <Modal title="提示" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <p>扩容进行中， 扩容详情和流程可参考oncall工单：
                            <a href={yescode} target="_blank">{yescode}</a>
                        </p>
                    </Modal>
                    <Link to={{ pathname: `/Taslist` ,search: urlId}}>
                        <Button type="primary">
                            操作记录
                        </Button>
                    </Link>
                    <Button type="primary" className='Button' onClick={goback}>返回</Button>
                </div>
            </div>

            {/* tabel */}
            <div className='chunk2'>
                {/* <SchemaForm actions={actions} effects={($) => {
                    $('onFieldChange', 'aa').subscribe((fieldState) => {
                        actions.setFieldState('bb', state => {
                            state.value = fieldState.value
                        })
                    })
                }}> */}
                <Table
                    rowSelection={{
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    rowKey={record => record.id}
                />
                {/* <Field type="string" name="aa"/> */}
                {/* </SchemaForm> */}
            </div>
            <Modal title="扩容比例批量设置" visible={issModalVisible} onOk={handleOks} onCancel={handleCancels}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="扩容比例"
                        name="扩容比例"
                        rules={[{ required: true }]}
                    >
                        <Input onChange={Inputgo} />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}

export default Ahmodel;






