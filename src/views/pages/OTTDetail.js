import React from 'react';

import { Table, Button,  Form , Checkbox, InputNumber,  notification, Spin, Modal, Tooltip,Tabs, } from 'antd';

import axios from "axios";
import { withRouter } from 'react-router-dom';
import {  LoadingOutlined ,CheckCircleOutlined, QuestionCircleOutlined, SyncOutlined, } from '@ant-design/icons';
import {  APIURL } from '../../common/constdt.js';

 

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

    callback(v){
        console.log(v)
        this.setState({
            defaultActive: v,
            checkedalla: false,
            checkreduce: false,
        })
    }

    masssetting(v){
        
   
        this.setState({
            renamelinkisModalVisible: true,
        })
        
    }

    msssconfigModalVisible = () => {
        this.setState({
          renamelinkisModalVisible: false,
        })
      }
     

    onSChangecheckall(v){

 

        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;
        let new_arr = [];
        for(let u = 0; u < dt.length; u++){
           
            
            if(dt[u].link_id == link_id){
                new_arr = dt[u].list;
            }
        }
        
        let nlist = [];

        if(v.target.checked == true){
            

        


            this.setState({
                checkreduce: true,
            })


             
            for(let z = 0; z < new_arr.length; z++){
               
                let v = {};
                   
                 v =   Object.assign({}, new_arr[z]);
                 v.selectedx = true;

                 nlist.push(v)
            }



        } else {
            
            this.setState({
                checkreduce: false,
            })

            for(let z = 0; z < new_arr.length; z++){
                let v = {};
                   
                 v =   Object.assign({}, new_arr[z]);
                 v.selectedx = false;

                 nlist.push(v)
            }
           



        }


        console.log(dt);
        console.log(nlist);

        
        let new_dtx = []

        for(let p = 0; p < dt.length; p++){

            let objg = {}
            objg.link_id = dt[p].link_id;
            objg.link_name = dt[p].link_name;
            objg.link_all_name = dt[p].link_all_name;

            if(link_id == dt[p].link_id){
                objg.list = nlist;
               

                }else{
                    objg.list = dt[p].list
            }
            new_dtx.push(objg)
        }

       
        console.log(new_dtx);

        this.setState({
            tabledtnew: new_dtx,
        })



    }

    onChangecheckall(v){
        
       
        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;
        let new_arr = [];
        for(let u = 0; u < dt.length; u++){
           
            
            if(dt[u].link_id == link_id){
                new_arr = dt[u].list;
            }
        }
        
     


        let nlist = [];
        if(v.target.checked == true){
            
            this.setState({
                checkedalla: true,
            })

            
            for(let z = 0; z < new_arr.length; z++){
               
                let v = {};
                   
                 v =   Object.assign({}, new_arr[z]);
                 v.selected = true;

                 nlist.push(v)
            }
           

        } else {
             
            this.setState({
                checkedalla: false,
            })

           
            for(let z = 0; z < new_arr.length; z++){
                let v = {};
                   
                 v =   Object.assign({}, new_arr[z]);
                 v.selected = false;

                 nlist.push(v)
            }
           


        }

        console.log(dt);
        console.log(nlist);

        
        let new_dtx = []

        for(let p = 0; p < dt.length; p++){

            let objg = {}
            objg.link_id = dt[p].link_id;
            objg.link_name = dt[p].link_name;
            objg.link_all_name = dt[p].link_all_name;

            if(link_id == dt[p].link_id){
                objg.list = nlist;
               

                }else{
                    objg.list = dt[p].list
            }
            new_dtx.push(objg)
        }

       
        console.log(new_dtx);

        this.setState({
            tabledtnew: new_dtx,
        })
    }
   

    checkedrd(value){

       let  reducenum = 0;
        console.log(value)


        let dt = this.state.tabledtnew;
        let link_id = this.state.defaultActive;
        
 
        let tmarrexp = []
 
        for(let p = 0; p < dt.length; p++){
            if(link_id == dt[p].link_id){
                 tmarrexp = dt[p].list;
            }
        }
    
 
         
 
 
        let singleexplist = []
 
 
        for(let j = 0; j < tmarrexp.length; j++){
             let v = {};
            
             v =   Object.assign({}, tmarrexp[j]);
       
 
 
             if(value.target.reduce == tmarrexp[j].id){
             
 
                 if(value.target.checked){
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
  
     
         
         for(let b = 0; b < singleexplist.length; b++){
             if(!singleexplist[b].selectedx && singleexplist[b].expand_oncall_id != 0 ){
                this.setState({
                    checkreduce: false,
                    
                })
                 
             }else {
                reducenum++
             }
              
         }
         
        if(reducenum == singleexplist.length){
            this.setState({
                checkreduce: true,
            })
        }
       
       
         let singledtz = [];
 
        for(let q = 0; q < dt.length; q++){
 
 
             let objg = {}
             objg.link_id = dt[q].link_id;
             objg.link_name = dt[q].link_name;
             objg.link_all_name = dt[q].link_all_name;
 
             if(dt[q].link_id == link_id){
                 objg.list = singleexplist;
                 
             }else {
                 objg.list = dt[q].list
             }
 
             singledtz.push(objg);
        }
 
        console.log(singledtz)
         
 
         this.setState({
             tabledtnew: singledtz,
         })
 
       
 
      
        
    }

    checkeddt(value){
     
      
       console.log(value);
       let expandnumx = 0;


       let dt = this.state.tabledtnew;
       let link_id = this.state.defaultActive;
       

       let tmarrexp = []

       for(let p = 0; p < dt.length; p++){
           if(link_id == dt[p].link_id){
                tmarrexp = dt[p].list;
           }
       }
   

        


       let singleexplist = []

      
       for(let j = 0; j < tmarrexp.length; j++){
            let v = {};
           
            v =   Object.assign({}, tmarrexp[j]);
      


            if(value.target.expand == tmarrexp[j].id){
            

                if(value.target.checked){
                    v.selected = true;
    
                  
                
                } else {
                    v.selected = false;

                    this.setState({
                        checkedalla: false,
                     })

                     
                }
        
                
            }  
            console.log( expandnumx)
            singleexplist.push(v)

        }
 

        

        for(let b = 0; b < singleexplist.length; b++){
            if(!singleexplist[b].selected  ){
               this.setState({
                checkedalla: false,
                   
               })
                
            }else {
                expandnumx++
            }
             
        }
        
       
        if(expandnumx == singleexplist.length){
            this.setState({
                checkedalla: true,
             })

        }
       

      
      
        let singledtz = [];

       for(let q = 0; q < dt.length; q++){


            let objg = {}
            objg.link_id = dt[q].link_id;
            objg.link_name = dt[q].link_name;
            objg.link_all_name = dt[q].link_all_name;

            if(dt[q].link_id == link_id){
                objg.list = singleexplist;
                
            }else {
                objg.list = dt[q].list
            }

            singledtz.push(objg);
       }

       console.log(singledtz)
        

        this.setState({
            tabledtnew: singledtz,
        })

      


        
    }

    async agetRates() {


        const ts = this.props.id
       // const url = `${APIURL}/capacity/handList?event_id=${ts}`;

        const url = `${APIURL}/capacity/list?event_id=${ts}`;

        var that = this;
        await axios.get(url, { withCredentials: true })
        .then(function (response) {
         
            
            if (response.data.code == 0) {
                    
                    that.setState({
                        spinstatus: true,
                        tabledtnew: response.data.data,
                        tbdlist: response.data.data,
                    })
 
                    if(response.data.data && response.data.data.length >= 1){
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

    onBlur(v){
        
     
        
        this.setState({
            inputnum: v,
            
        })
        
    }
    

    async masssconfigxapi(d){

            
 

            console.log(this.state.defaultActive);


            this.setState({
                
                createloading: true,

            })

    
 

        const url = `${APIURL}/capacity/update`;

        var bodyFormData = new FormData();

        bodyFormData.append("num", d.bulkexpandnum );
           
       
           
            let tmpmarr = []
           
            let rs = this.state.defaultActive;
            for(let r = 0; r < this.state.tbdlist.length; r++){
                if(rs ==  this.state.tbdlist[r].link_id){
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
 
    async neednum(d){
       
        
        
        let nm =  document.getElementById(`input_${d.id}`).innerText;
        nm = nm*1;
        console.log(typeof nm)

        if(typeof nm != "number" || isNaN(nm)){
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
            bodyFormData.append("capacity_id_list",  JSON.stringify(tmp));
       
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
    async  capacity_bulkExpand(v) {
  
      
        console.log(v);


 
        let bodyFormData = new FormData();
        
        this.setState({
            spinstatus: false,

        })

       let tdt = this.state.tabledtnew;

        let bulk_expand_list = [];
        let tmplist = [];
        
        for(let h = 0; h < tdt.length; h++){
            if(v == tdt[h].link_id){
                tmplist = tdt[h].list;
            }
        }

        for(let g = 0; g < tmplist.length; g++){
            if(tmplist[g].selected == true && tmplist[g].expand_oncall_id == 0){
                bulk_expand_list.push(tmplist[g])
            }
        }
        console.log(bulk_expand_list)

        if(!bulk_expand_list || bulk_expand_list.length < 1){

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

         
        bodyFormData.append("bulk_expand_list",  JSON.stringify(bulk_expand_list));
        let t_uid = this.getCookie("EngName");

        if(t_uid){
            bodyFormData.append("t_uid",  t_uid);
        }
        
       
        
        var that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {
           
         
            if(response.data.code === 0){
                 

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



    async  capacitybulkReduce(v) {
        
       
        this.setState({
            spinstatus: false,

        })


        let bodyFormData = new FormData();
     
     
        let tdt = this.state.tabledtnew;

        let bulkReducelist = [];
        let tmplist = [];
        
        for(let h = 0; h < tdt.length; h++){
            if(v == tdt[h].link_id){
                tmplist = tdt[h].list;
            }
        }

        for(let g = 0; g < tmplist.length; g++){
            if(tmplist[g].selectedx == true && tmplist[g].reduce_oncall_id == 0 && tmplist[g].expand_oncall_id != 0){
                bulkReducelist.push(tmplist[g].id)
            }
        }
        console.log(bulkReducelist)

        if(!bulkReducelist || bulkReducelist.length < 1){

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

        if(t_uid){
            bodyFormData.append("t_uid",  t_uid);
        }

 
        bodyFormData.append("capacity_id_list", JSON.stringify(bulkReducelist));

        let url = `${APIURL}/capacity/bulkReduce`;

  
        
       
        var that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {
            
            if(response.data.code === 0){
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
        for(let i = 0; i <ca.length; i++) {
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



    render(){
       


 
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

                return  <div className="powerdiv">
                            <a target="_blank" rel="noreferrer" href={lik} > {txt} </a>
                            <Tooltip title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </div>
                            
            }
        }

        const columns = [
            {
                title: ()=> {
                    return (

                            this.state.checkedalla ? (

                                <Checkbox onChange={this.onChangecheckall} checked >   扩容工单号 </Checkbox>
                            ): (

                                <Checkbox onChange={this.onChangecheckall} checked={false}>   扩容工单号  </Checkbox>
                            )
                       
                         
                        )
                },
                dataIndex: 'expand_oncall_id',
                align: "center",
                width: "12.2%",
                render: (text, data, index) => (
                    <span>
                        
                     {data.expand_oncall_id == 0 ? (
                         
                         <Form.Item
                            valuePropName="expand"
                            name={data.id+"_a"}
                            initialValue={data.id}
                        >    
                            <Checkbox    onChange={this.checkeddt}   checked={data.selected ? data.id : false} > </Checkbox>
                             
                         </Form.Item>
                     ) : (
                          
                         <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.expand_oncall_id}`}  target="_blank"> {data.expand_oncall_id} </a>
                     )}
                    </span>
                )

            },  
            {
                title: () => {
                    
                    return (
                      
                      this.state.checkreduce  ? (

                        <Checkbox onChange={this.onSChangecheckall}  checked={true}>  缩容工单号 </Checkbox>
 
                      ) : (
                        <Checkbox onChange={this.onSChangecheckall}  checked={false}>   缩容工单号 </Checkbox>
 
                      )
                        

                    )},
                dataIndex: 'reduce_oncall_id',
                align: "center",
                width: "12.2%",
                render: (text, data, index) => (
                    <span>
                     {data.reduce_oncall_id == 0 ? (
                         
                         <div>
                             {data.expand_oncall_id == 0 ? (
                                  <Form.Item
                                     
                                        name={data.id}
                                        defaultChecked={false}
                                        valuePropName="reduce" 
                                         
                                    >    
                                      <Checkbox  disabled />
            
                                    </Form.Item>
                             ): (
                                <Form.Item
                                    valuePropName="reduce"
                                    
                                    name={data.id}
                                    initialValue={data.id}
                                >    
                                    <Checkbox  onChange={this.checkedrd}  checked={data.selectedx ? data.id : false}></Checkbox>
        
                                </Form.Item>
                             )}
                         </div>
                           

                     ) : (
                        <a rel="noopener noreferrer"  href={`http://oncall.oa.com/workBench?id=${data.reduce_oncall_id}`} target="_blank"> {data.reduce_oncall_id} </a>
                     )}
                    </span>
                )

            },
          
            {
                title:  "权限",
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
                    
                   <a rel="noopener noreferrer"  href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app_name}&server=${data.server_name}`} target="_blank"> {data.app_name+"."+data.server_name}  </a>
                    
                )

            },
            {
                title: 'set',
                dataIndex: 'set_name',
                align: "center",
                width: "10.2%",
                render: (text, data, index) => (
                    <span> {data.set_name ? data.set_name : "--" } </span>
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
                title: ()=> {
                        return (
                            <>
                                扩容比例（%）
                                <Button type="primary" size="small" onClick={ this.masssetting } >批量设置 </Button>
                            </>
                        )
                } ,
                dataIndex: 'expand_scale_num',
                align: "center",
                width: "19.2%",
                render: (text, data, index) => (
                    <span className="expandinputct">
                        {data.reduce_oncall_id == 0 || data.expand_oncall_id == 0 ? (
                            <Form.Item
                        
                            name={"neednum_"+index}
                          
                            initialValue={data.expand_scale_num}
                            >    
                            {data.expand_oncall_id != 0 ? (
                                 
                                <span> {data.expand_scale_num} </span>
                            ): (
                                
                                <div className="inputdivs" id={"input_"+data.id}  contentEditable="true" suppressContentEditableWarning="true"  key={data.id+"_p"} onChange={this.onBlur} onBlur={() => this.neednum(data)}  > {data.expand_scale_num}  </div>
                             
                                
                            )}
                                
    
                            </Form.Item>

                        ):( text )} 
                     
                    </span>
                )

            }
            
           
        ]
        return(
            <div id="OTTDetail"> 

             {this.state.tbdlist ? (


                <>
                      {this.state.tbdlist.map((i,ind)=> {
                        return (
                           
                                this.state.defaultActive == i.link_id ? (
                                    <div className="divwrapotttap" key={i.link_id+""}>
                                          <Button type="primary"   className="btnb" onClick={()=>this.capacitybulkReduce(i.link_id)}> 一键缩容 </Button>
                                          <Button type="primary"   className="btna" onClick={()=>this.capacity_bulkExpand(i.link_id)}> 一键扩容 </Button>
                                    </div>

                                ) : ""
            
                          
                        
                        )
                })}

                </>
             ) : (
                <div className="flowertrans">  <Spin indicator={antIcon} />  </div>
             )}
           
              
                


                <Tabs defaultActiveKey="1" onChange={this.callback}>

                    {this.state.tabledtnew ? (

                          
                        this.state.tabledtnew.map((i,ind)=> {
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
                                     
                                        key={i.link_id+""}
                                        >
                                    <Table
                                         
                                             
                                            columns={columns}
                                            rowKey="id"
                                            dataSource={i.list}
                                            pagination={{
                                                total: i.list.length,
                                                pageSize: i.list.length,
                                            }}
                                        />

                                    </Form>
                                    </TabPane>
                                )
                            })
                         
                    

                    ) : (

                        ""
                    )}
                    
                </Tabs>

                
          
            

              




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
         
          <Form.Item
            label="扩容比例"
            name="bulkexpandnum"
            className="widthonehd"
            rules={[{ required: true, message: '扩容比例!' }]}
             
          >
            <InputNumber />
          </Form.Item>

       
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


export default withRouter(OTTDetail);