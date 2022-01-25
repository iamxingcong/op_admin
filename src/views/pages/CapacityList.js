  
import React from 'react';
 
import {  Card,   Button ,Select, Row, DatePicker, Col, Table , Spin, Tabs,  Form , Modal , Tooltip, notification, Input, Radio, Space , Popover} from 'antd';
 
 
import { LoadingOutlined , CheckCircleOutlined, QuestionCircleOutlined , CloseCircleOutlined, CopyOutlined, ToTopOutlined,CloudDownloadOutlined, } from '@ant-design/icons';

 
import {  withRouter } from 'react-router-dom';
 
import AddModel from './AddModel.js'

import EditModel from './EditModel.js'
 
import axios from "axios";

import { APIURL } from '../../common/constdt.js'
import CapacityModeloneServerSet from './CapacityModeloneServerSet.js'
import Tract from '../pages/retract/tract'
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;
 
const { TabPane } = Tabs;

let    ottop;
let    ottnm;
let    ottnmoc;

 
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
 

 
class CapacityList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            total: null,
            pageSize: 25,
            current: 1,
            svisible: false,
            evisible: false,
            listdt: null,
            show_type: 1,
            type: 1,
            start_datetime: null,
            moddelisModalVisible: false,
            id: null,
            end_datetime: null,
            defaultActiveKey: 3,
            defaultActiveKeylist: '123',
            pltfmdt: null,
            tblaoding: null,
            columnsdt: null,
            mod_id: null,
            delspin: false,
            moddetail: null,
            graphxvisible: false,
            motlannua: null,
            openunopen: null,
            expandtrue: false,
            wheight: 600,
            currentTime: '',
            fileuploadModalVisible: false,
            filenames: null,
            way: 1
        }
    
        this.capacityModeladdModel = this.capacityModeladdModel.bind(this);
        this.handleChanges = this.handleChanges.bind(this);
        this.onOks = this.onOks.bind(this);
        this.onOksb = this.onOksb.bind(this);
        this.onOksa = this.onOksa.bind(this);
        this.fileupld = this.fileupld.bind(this);

        this.onChangetm = this.onChangetm.bind(this);
        this.callback = this.callback.bind(this);
        this.callbacklist = this.callbacklist.bind(this);
        this.onChangepage = this.onChangepage.bind(this);
        this.checklist = this.checklist.bind(this);
        this.fileupcancelhandleCancel = this.fileupcancelhandleCancel.bind(this);
        this.checkeddt = this.checkeddt.bind(this);
        this.autohandleCancel = this.autohandleCancel.bind(this);
        this.capacityModeldeleteModel = this.capacityModeldeleteModel.bind(this);
        this.refreshlista = this.refreshlista.bind(this);
        this.clickcellsth = this.clickcellsth.bind(this);
        this.fileuploadmodals = this.fileuploadmodals.bind(this);
        this.fileuploadapi = this.fileuploadapi.bind(this);
        this.wrapper = React.createRef();
    }

    componentDidMount() {
 
      
        let wh =  window.innerHeight - 420;
        
        let url_string = window.location.href.replace(/\/#/g,"")
       
        let url = new URL(url_string);
         
        let id = url.searchParams.get("id");
         console.log(wh)

        this.setState({
            wheight: wh,
            id: id,
            show_type: 1,
            start_datetime: null,
            end_datetime: null,
        })

        let ur = this.props.location;
        let prm = ur.search;

        prm = prm.replace("?", "");
        prm = prm.replace("&", "=");
        let tmar = prm.split("=")
        
        console.log(tmar);
       
       this.listlist()
       
        
       this.capacityModelplatformInfo();
    }


    showModal = () => {
        this.setState({ isModalVisible: true })
    };
    handleOk = () => {
        this.setState({ isModalVisible: false })
    };
    handleCancel = () => {
        this.setState({ isModalVisible: false })
    };
    way = (e) => {
        console.log(e.target.value);
        this.setState({ way: e.target.value })
    }

 
    qweq = () => {
       
        let url_string = window.location.href.replace(/\/#/g, "")
        let url = new URL(url_string);
        let id = url.searchParams.get("id");
        this.props.history.push({
            pathname: "Ahmodel",
            search: id + "&" + this.state.way
        });
        this.setState({ isModalVisible: false })
    }



    qwes() {
        let params={}
        // setTimeout(() => {
            let url_string = window.location.href.replace(/\/#/g, "")
            let url = new URL(url_string);
            let id = url.searchParams.get("id");
            let show_type = this.state.show_type
            params['type'] = this.state.type
            params['show_type'] = show_type
            params['link_id'] = id
        // }, 0)
        return params
    }
 
    componentWillReceiveProps(nextProps) {
      
        
        let url_string = window.location.href.replace(/\/#/g,"")
        
        let url = new URL(url_string);
        
        let id = url.searchParams.get("id");
     

        this.setState({
            id: id,
            show_type: 1,
            start_datetime: null,
            end_datetime: null,
            
        })
        
        if (nextProps.location.search !== this.props.location.search ) {

           

            let ur = this.props.location;
            let prm = ur.search;
    
            prm = prm.replace("?", "");
            prm = prm.replace("&", "=");
            let tmar = prm.split("=")
             
            this.setState({
                id: tmar[1],
                
            })
            
            

          }
          
        
           
        this.listlist();
        

    }




    fileuploadmodals(){
        this.setState({
            fileuploadModalVisible: true,
            filenames: null,
        })
         
    }


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


      
   async fileuploadapi(){
    
    
    let xurl = `${APIURL}/capacityModel/batchAddModelUploadFile`;

    let selectedFile = document.getElementById('filexd').files[0];
    
     
    console.log(selectedFile)
 

    let url_string = window.location.href.replace(/\/#/g,"")
        
    let url = new URL(url_string);
    
    let id = url.searchParams.get("id");
 

        let bodyFormData = new FormData();
    

        bodyFormData.append("form_data", selectedFile);
        bodyFormData.append("link_id", id);
        let user_name = this.getCookie("EngName");
        bodyFormData.append("user_name", user_name);
        
        let that = this;


        await axios.post(xurl, bodyFormData, { withCredentials: true })
            .then(function (response) {
                console.log(response);

                if(response.data.code == 0){
                    that.setState({
                        fileuploadModalVisible: false,
                    });
                    that.listlist()

                    notification.success({
                        message: '提示',
                        description: response.data.msg,
                        
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });
                }else{

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
                if(error.response.data){
                    notification.error({
                        message: '提示',
                        description: JSON.stringify(error.response.data),
                        
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });
                }else {
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
                      
    fileupcancelhandleCancel(){
        this.setState({
            fileuploadModalVisible: false,
        })
    }

    fileupld(v){
        console.log(v);
        const selectedFile = document.getElementById('filexd').files[0];
        let t = document.getElementById('filexd').files;
        console.log(t)
        console.log(selectedFile)

        this.setState({
            filenames: selectedFile.name,
        })
    }

    clickcellsth(v) {

        this.setState({
            expandtrue: v,
        })
    }


    paste(v) {
         
        navigator.clipboard.writeText(v)
       

        notification.success({
            message: '提示',
            description: '已复制',
            placement: 'topCenter',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }

    refreshlista(){
       
      
        this.listlist()
    }

    checkeddt(v){
     
        console.log(v)
    }

    checklist(){

        if(this.state.show_type == 3) {
            if(this.state.start_datetime){
             this.listlist()
            } else {

                notification.error({
                    message: '提示',
                    description: "请选择时间！",
                    
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });
                return false;
            }
        } else if(this.state.show_type == 4) {
            if(this.state.start_datetime && this.state.end_datetime){
                this.listlist()
            }else {
                notification.error({
                    message: '提示',
                    description: "请选择时间！",
                    
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });
                return false;
            }
            
        } else if(this.state.show_type == 2) {
                if(this.state.start_datetime){
                    this.listlist()
                }else {
                    notification.error({
                        message: '提示',
                        description: "请选择时间！",
                        
                        placement: 'topCenter',
                        onClick: () => {
                          console.log('Notification Clicked!');
                        },
                    });
                    return false;
                }

        } else {
            this.listlist()
        }
       
    }

    onOksa(v){

        
  
        this.setState({
            start_datetime: v.format("YYYY-MM-DD"),
       
       })
    }

    onOksb(v){
 

       
        this.setState({
            start_datetime: v.format("YYYY-MM-DD HH:mm:ss"),
       
       })
    }
    callbacklist(key){
     
        let tp = 1;
        if(key == "redis"){
            tp = 2
        } else if(key == "mdb"){
            tp  = 3
        } else if(key == 123){
            tp = 1;
        };


        this.setState({
            defaultActiveKeylist: key,
            type: tp,
        })
    
        this.listlistx( tp)

    }

    callback(key) {
        this.setState({
            defaultActiveKey: key,
        })
        console.log(key);
    }

    
    capacityModeladdModel() {
  
        this.setState({
            svisible: true,
        })
    }

    onChangetm(ts, ta){
     
 
        this.setState({
            start_datetime: ta[0],
            end_datetime: ta[1], 
        })
    }


      
    onChangepage(t) {
        
    
        this.setState({
            current: t.current,
            pageSize: t.pageSize,
        })
       this.cgplistlistx(t.current)
       
       
    }




    onOks(v){
       
      
        if(v[0]){
            
            this.setState({
                start_datetime: v[0].format("YYYY-MM-DD"),
            
            })
         
        }
      
        if(v[1]){
            
 
            this.setState({
             
                end_datetime: v[1].format("YYYY-MM-DD"), 
            })
             
        }
    };

    handleChanges(v){
        
        this.setState({
            show_type: v,
        })
        
        
    }

    async capacityModelplatformInfo(){
        const urls = `${APIURL}/capacityModel/platformInfo`;

        
        var that = this
        await axios.get(urls, {  withCredentials: true  })
            .then(function (response) {
                if(response.data.code == 0){
                   
                    that.setState({
                        pltfmdt: response.data.data,
                    })
                }   
                
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    async cgplistlistx(v){

        this.setState({
            tblaoding: true,
        })
         
        const urls = `${APIURL}/list/list`;

       
        
         let url_string = window.location.href.replace(/\/#/g,"")
        
         let url = new URL(url_string);
       
         let id = url.searchParams.get("id");
       

        let that = this
        await axios.get(urls, {
            withCredentials: true,
            params: {
                show_type:  this.state.show_type,
                type: this.state.type,
                link_id: id,
                page: v,
                page_size: that.state.pageSize,
            }
        })
            .then(function (response) {
                 
                if(response.data.code == 0){
                   
                    that.setState({
                        currentTime: response.data.data.datetime
                    })


                    let cm = response.data.data.title_data;

                    let clms = [];


                    if(that.state.type == 1){
                        let odt = response.data.data.list_data;

                        let pdt = [];
                        let pdtarr = []
                        for(let q = 0; q < odt.length; q++ ){

                            

                            if(pdt.indexOf(odt[q].mod_id) == -1 ){
                                let tobj =  Object.assign({}, odt[q]);
                                    tobj.id = odt[q].id+'_p';
                                    tobj.city = [];
                                    tobj.cpu = 0;
                                    tobj.set = [];
                                    tobj.total_cnt = 0;
                                    tobj.fail_cnt = 0;
                                    tobj.avg_time = 0;
                                    tobj.qps = 0;
                                    tobj.single_qps = 0;
                                    tobj.mem = 0;
                                    tobj.num = 0;
                                    tobj.num_cpu = 0;
                                    tobj.max_cpu = [];
                                    tobj.modeid = odt[q].mod_id;

                                pdt.push(odt[q].mod_id);
                                pdtarr.push(tobj);
                            }

                        }
                       

                        let objwithchildren = []
                        for(let t = 0; t < pdtarr.length; t++){
                            let tmpobj = {}
                            let tmpa = [];
                        
                            tmpobj = Object.assign({}, pdtarr[t]);
                        
                            tmpobj.fialcntnm = [];

                            for(let e = 0; e < odt.length; e++){
                                if( odt[e].mod_id == pdtarr[t].mod_id) {
                                    tmpa.push(odt[e]);
                                    
                                    tmpobj.total_cnt += odt[e].total_cnt;

                                    tmpobj.cpu += odt[e].cpu  * odt[e].num_cpu ;

                                    tmpobj.fail_cnt += odt[e].fail_cnt * odt[e].total_cnt;
                                    tmpobj.avg_time += odt[e].avg_time * odt[e].total_cnt;
                                    tmpobj.qps += odt[e].qps;
                                    tmpobj.single_qps += odt[e].single_qps;
                                    tmpobj.mem += odt[e].mem;
                                    tmpobj.num += odt[e].num;
                                    tmpobj.num_cpu += odt[e].num_cpu;
 
                                    tmpobj.city.push(odt[e].city);
                                    tmpobj.set.push(odt[e].set);
                                    tmpobj.max_cpu.push(odt[e].max_cpu);
                                    

                                }
                            }
                           
                           
                            tmpobj.total_cnt = tmpobj.total_cnt.toFixed(0);
                           
                            if( tmpobj.avg_time > 0){
                                tmpobj.avg_time =  (tmpobj.avg_time / tmpobj.total_cnt ).toFixed(3);
                            } else {
                                
                                tmpobj.avg_time = 0;
                            }
                           
                            if( tmpobj.fail_cnt > 0){
                                tmpobj.fail_cnt = ( tmpobj.fail_cnt / tmpobj.total_cnt ).toFixed(3);
                            } else {
                                tmpobj.fail_cnt = 0;
                            }
                          

                            tmpobj.qps =  tmpobj.qps.toFixed(0);
                            tmpobj.single_qps = tmpobj.single_qps.toFixed(0);
                            
                            tmpobj.max_cpu = (tmpobj.max_cpu).sort(function(a, b){return b - a});
                           
                            tmpobj.max_cpu = tmpobj.max_cpu[0];

                            if( tmpobj.cpu > 0) {
                                tmpobj.cpu = (tmpobj.cpu / tmpobj.num_cpu ).toFixed(2);
                            } else {
                                tmpobj.cpu = 0;
                            }
                           
                            
                            if(tmpa.length >= 2) {
                               
                                tmpobj.mem = (tmpobj.mem / tmpa.length ).toFixed(2);
                                tmpobj.set = "--";
                                tmpobj.city = "--"; 

                                tmpobj.children = tmpa
                            } else {

                               
                                tmpobj.mem = tmpobj.mem.toFixed(2);
                            }
                          
                            objwithchildren.push(tmpobj)
                        }

                       

                     
                      
                        that.setState({
                            openunopen: objwithchildren,
                        })

                        clms.push(ottnmoc);

                        clms.push(ottnm);
                     
                        for(let z = 1; z < cm.length; z++){
                            let ocm = {}
    
                                ocm.title = cm[z].name;
                                ocm.dataIndex = cm[z].field;
                               
                                ocm.align = "left";
                            
                                clms.push(ocm)
    
                        }


                        
                    } else {
                        that.setState({
                            openunopen: null,
                        })

                        for(let z = 0; z < cm.length; z++){
                            let ocm = {}
    
                                ocm.title = cm[z].name;
                                ocm.dataIndex = cm[z].field;
                              
                                ocm.align = "left";
                                clms.push(ocm)
    
                        }


                    }

              

                 

                    clms.push(ottop)
                
                   
                    that.setState({
                        columnsdt: clms,
                        listdt: response.data.data,
                        tblaoding: false,
                        total: response.data.data.list_data.length,
                    })
                    
                }else{
                    console.log('error --')
                }


                that.setState({
                        tblaoding: false,
                })
                 
               

            })
            .catch(function (error) {
                console.log(error);
                that.setState({
                    tblaoding: false,
                })

                 
            })
    }


    async listlistx(v){

        this.setState({
            tblaoding: true,
        })
         
        let url_string = window.location.href.replace(/\/#/g,"")
     
        let url = new URL(url_string);
         
        let id = url.searchParams.get("id");
        

        const urls = `${APIURL}/list/list`;
        
        let that = this
        await axios.get(urls, {
            withCredentials: true,
            params: {
                show_type:  this.state.show_type,
                type: v,
                link_id: id,
                start_datetime: that.state.start_datetime,
                end_datetime: that.state.end_datetime,
            }
        })
            .then(function (response) {
                 
                if(response.data.code == 0){
                    
                    that.setState({
                        currentTime: response.data.data.datetime
                    })


                    let cm = response.data.data.title_data;
                    let clms = [];
                    

                    if(that.state.type == 1){
                        let odt = response.data.data.list_data;

                        let pdt = [];
                        let pdtarr = []
                        for(let q = 0; q < odt.length; q++ ){

                            

                            if(pdt.indexOf(odt[q].mod_id) == -1 ){
                                let tobj =  Object.assign({}, odt[q]);
                                    tobj.id = odt[q].id+'_p';
                                    tobj.city = [];
                                    tobj.cpu = 0;
                                    tobj.set = [];
                                    tobj.total_cnt = 0;
                                    tobj.fail_cnt = 0;
                                    tobj.avg_time = 0;
                                    tobj.qps = 0;
                                    tobj.single_qps = 0;
                                    tobj.mem = 0;
                                    tobj.num = 0;
                                    tobj.num_cpu = 0;
                                    tobj.max_cpu = [];
                                    tobj.modeid = odt[q].mod_id;

                                pdt.push(odt[q].mod_id);
                                pdtarr.push(tobj);
                            }

                        }
                      

                        let objwithchildren = []
                        for(let t = 0; t < pdtarr.length; t++){
                            let tmpobj = {}
                            let tmpa = [];
                        
                            tmpobj = Object.assign({}, pdtarr[t]);
                        
                            tmpobj.fialcntnm = [];

                            for(let e = 0; e < odt.length; e++){
                                if( odt[e].mod_id == pdtarr[t].mod_id) {
                                    tmpa.push(odt[e]);
                                    
                                    tmpobj.total_cnt += odt[e].total_cnt;

                                    tmpobj.cpu += odt[e].cpu  * odt[e].num_cpu ;

                                    tmpobj.fail_cnt += odt[e].fail_cnt * odt[e].total_cnt;
                                    tmpobj.avg_time += odt[e].avg_time * odt[e].total_cnt;

                                    tmpobj.qps += odt[e].qps;
                                    tmpobj.single_qps += odt[e].single_qps;
                                    tmpobj.mem += odt[e].mem;
                                    tmpobj.num += odt[e].num;
                                    tmpobj.num_cpu += odt[e].num_cpu;
 
                                    tmpobj.city.push(odt[e].city);
                                    tmpobj.set.push(odt[e].set);
                                    tmpobj.max_cpu.push(odt[e].max_cpu);
                                    

                                }
                            }
                           
                           
                            tmpobj.total_cnt = tmpobj.total_cnt.toFixed(0);


                            if( tmpobj.avg_time > 0){
                                tmpobj.avg_time =  (tmpobj.avg_time / tmpobj.total_cnt ).toFixed(3);
                            } else {
                                
                                tmpobj.avg_time = 0;
                            }
                           
                            if( tmpobj.fail_cnt > 0){
                                tmpobj.fail_cnt = ( tmpobj.fail_cnt / tmpobj.total_cnt ).toFixed(3);
                            } else {
                                tmpobj.fail_cnt = 0;
                            }
                           
                            
                            tmpobj.qps =  tmpobj.qps.toFixed(0);
                            tmpobj.single_qps = tmpobj.single_qps.toFixed(0);

                            
                            tmpobj.max_cpu = (tmpobj.max_cpu).sort(function(a, b){return b - a});
                           
                            tmpobj.max_cpu = tmpobj.max_cpu[0];

                            if( tmpobj.cpu > 0) {
                                tmpobj.cpu = (tmpobj.cpu / tmpobj.num_cpu ).toFixed(2);
                            } else {
                                tmpobj.cpu = 0;
                            }
                           
                            
                            if(tmpa.length >= 2) {
                               
                                tmpobj.mem = (tmpobj.mem / tmpa.length ).toFixed(2);
                                tmpobj.set = "--";
                                tmpobj.city = "--"; 

                                tmpobj.children = tmpa
                            } else {

                               
                                tmpobj.mem = tmpobj.mem.toFixed(2);
                            }
                          
                            objwithchildren.push(tmpobj)
                        }

                        
                
                        that.setState({
                            openunopen: objwithchildren,
                        })

                        clms.push(ottnmoc);
                        clms.push(ottnm);
                        
                        for(let z = 1; z < cm.length; z++){
                            let ocm = {}

                                ocm.title = cm[z].name;
                                ocm.dataIndex = cm[z].field;
                                ocm.align = "left";
 
                                clms.push(ocm)

                        }


                    } else {
                            that.setState({
                                openunopen: null,
                            })
 
 
 

                            for(let z = 0; z < cm.length; z++){
                                let ocm = {}
                                
                                    ocm.title = cm[z].name;
                                    ocm.dataIndex = cm[z].field;

                                 
                                    ocm.align = "left";
                                    clms.push(ocm)

 
                            }
                    }

                    

                        clms.push(ottop)
                       

                            that.setState({
                                columnsdt: clms,
                                listdt: response.data.data,
                                tblaoding: false,
                                total: response.data.data.list_data.length,
                            });

                        

                } else {
                    console.log(" code not 0")
                }

                that.setState({
                    tblaoding: false,
                })
            })
            .catch(function (error) {
                console.log(error);
                that.setState({
                    tblaoding: false,
                })
                 
            })
    }
    async listlist(){

        this.setState({
            tblaoding: true,
        })

        
        let url_string = window.location.href.replace(/\/#/g,"")
      
        let url = new URL(url_string);
      
        let id = url.searchParams.get("id");
        

         
        const urls = `${APIURL}/list/list`;

         

        let that = this
        await axios.get(urls, {
            withCredentials: true,
            params: {
                show_type:  that.state.show_type,
                type: that.state.type,
                link_id: id,
                start_datetime: that.state.start_datetime,
                end_datetime: that.state.end_datetime,
            }
        })
            .then(function (response) {
                 
                if(response.data.code == 0){

                    let cm = response.data.data.title_data;

                    that.setState({
                        currentTime: response.data.data.datetime
                    })

                    let clms = [];
                    
                   
                    if(that.state.type == 1){
                            let odt = response.data.data.list_data;

                            let pdt = [];
                            let pdtarr = []
                            for(let q = 0; q < odt.length; q++ ){

                               

                                if(pdt.indexOf(odt[q].mod_id) == -1 ){
                                    let tobj =  Object.assign({}, odt[q]);
                                        tobj.id = odt[q].id+'_p';
                                        tobj.city = [];
                                        tobj.cpu = 0;
                                        tobj.set = []
                                        tobj.total_cnt = 0;
                                        tobj.fail_cnt = 0;
                                        tobj.avg_time = 0;
                                        tobj.qps = 0;
                                        tobj.single_qps = 0;
                                        tobj.mem = 0;
                                        tobj.num = 0;
                                        tobj.num_cpu = 0;
                                        tobj.max_cpu = [];
                                        tobj.modeid = odt[q].mod_id;

                                    pdt.push(odt[q].mod_id);
                                    pdtarr.push(tobj);
                                }
 
                                              
                             
 

                            }
                            
                        
                            let objwithchildren = []
                            for(let t = 0; t < pdtarr.length; t++){
                                let tmpobj = {}
                                let tmpa = [];
                            
                                tmpobj = Object.assign({}, pdtarr[t]);
                            
                                tmpobj.fialcntnm = [];

                                for(let e = 0; e < odt.length; e++){
                                    if( odt[e].mod_id == pdtarr[t].mod_id) {
                                        tmpa.push(odt[e]);
                                        
                                        tmpobj.total_cnt += odt[e].total_cnt;

                                        tmpobj.cpu += odt[e].cpu  * odt[e].num_cpu ;

                                        tmpobj.fail_cnt += odt[e].fail_cnt * odt[e].total_cnt;
                                        tmpobj.avg_time += odt[e].avg_time * odt[e].total_cnt;
                                        tmpobj.qps += odt[e].qps;
                                        tmpobj.single_qps += odt[e].single_qps;
                                        tmpobj.mem += odt[e].mem;
                                        tmpobj.num += odt[e].num;
                                        tmpobj.num_cpu += odt[e].num_cpu;

                                        tmpobj.city.push(odt[e].city);
                                        tmpobj.set.push(odt[e].set);
                                        tmpobj.max_cpu.push(odt[e].max_cpu);
                                        
 
                                    }
                                }
                               
                               
                                tmpobj.total_cnt = tmpobj.total_cnt.toFixed(0);
                               
                               


                                if( tmpobj.avg_time > 0){
                                    tmpobj.avg_time =  (tmpobj.avg_time / tmpobj.total_cnt ).toFixed(3);
                                } else {
                                    
                                    tmpobj.avg_time = 0;
                                }
                            
                                if( tmpobj.fail_cnt > 0){
                                    tmpobj.fail_cnt = ( tmpobj.fail_cnt / tmpobj.total_cnt ).toFixed(3);
                                } else {
                                    tmpobj.fail_cnt = 0;
                                }


                                
                                tmpobj.qps =  tmpobj.qps.toFixed(0);
                                tmpobj.single_qps = tmpobj.single_qps.toFixed(0);
                                
                                tmpobj.max_cpu = (tmpobj.max_cpu).sort(function(a, b){return b - a});
                               
                                tmpobj.max_cpu = tmpobj.max_cpu[0];

                                if( tmpobj.cpu > 0) {
                                    tmpobj.cpu = (tmpobj.cpu / tmpobj.num_cpu ).toFixed(2);
                                } else {
                                    tmpobj.cpu = 0;
                                }

                               
                               
                                
                                if(tmpa.length >= 2) {
                                   
                                    tmpobj.mem = (tmpobj.mem / tmpa.length ).toFixed(2);
                                    tmpobj.set = "--";
                                    tmpobj.city = "--";
 

                                    tmpobj.children = tmpa
                                } else {

                                   
                                    tmpobj.mem = tmpobj.mem.toFixed(2);
                                }
                              
                                objwithchildren.push(tmpobj)
                            }

                           

                            that.setState({
                                openunopen: objwithchildren,
                            })

                            clms.push(ottnmoc);
                            clms.push(ottnm);
                     
                            for(let z = 1; z < cm.length; z++){
                                let ocm = {}
        
                                    ocm.title = cm[z].name;
                                    ocm.dataIndex = cm[z].field;
                                 
                                    ocm.align = "left";
                                   
                                   

                                    clms.push(ocm)
        
                            }


                   } else {
                            that.setState({
                                openunopen: null,
                                show_type: 1,

                            })


                            for(let z = 0; z < cm.length; z++){
                                let ocm = {}

                                    ocm.title = cm[z].name;
                                    ocm.dataIndex = cm[z].field;
                                  
                                    ocm.align = "left";
                                    clms.push(ocm)

                            }


                   }

                  
 

                    clms.push(ottop)

 
              

                 
                    that.setState({
                        columnsdt: clms,
                        listdt: response.data.data,
                        tblaoding: false,
                        total: response.data.data.list_data.length,
                    })

            
                    
                } else {
                    console.log('code is not 0')

                 

                }
               
                that.setState({
                    tblaoding: false,
                })

            })
            .catch(function (error) {
                console.log(error);
                that.setState({
                    tblaoding: false,
                })
            })
    }

    
    autohandleCancel(){
        this.setState({
            
            delspin: false,
             
            moddelisModalVisible: false,
        })
    }


    async capacityModeldeleteModel(v){
       
        
        this.setState({
            delspin: true,
        })
         
        const urls = `${APIURL}/capacityModel/deleteModel`;

         
     


        let url_string = window.location.href.replace(/\/#/g,"")
       
        let url = new URL(url_string);
        
        let id = url.searchParams.get("id");
        
        let bodyFormData = new FormData();
        bodyFormData.append("link_id", id);
        bodyFormData.append("mod_id", this.state.mod_id);

        let that = this;


        await axios.post(urls, bodyFormData, { withCredentials: true })
        .then(function (response) {
 
            if(response.data.code == 0){
              
                that.listlist(id)
                that.setState({
                    delspin: false,
                    moddelisModalVisible: false,
                })
            }
        })
        .catch(function (error) {
            console.log(error);
            that.setState({
                delspin: false,
                
            })

        })

    }
    

   
    async capacityModelqueryByModId(mod_id){

        this.setState({
            editspin: true,
            appserverinput: null,
        })
   
        const urlsx = `${APIURL}/capacityModel/queryByModId`;



        let url_string = window.location.href.replace(/\/#/g,"")
       
        let url = new URL(url_string);
       
        let id = url.searchParams.get("id");
      



        let that = this;
        await axios.get(urlsx, {
            withCredentials: true,
            params: {
                mod_id:  mod_id,
                event_id: id,
                 
            }
        })
        
            .then(function (response) {
              
                if (response.data.code == 0) {
                   
               
                    let arr = that.state.pltfmdt;
                    let v = response.data.data.mod_platform;
                    let t = response.data.data.platform_info;
                    let plt = []
                    for(let i = 0; i < arr.length; i++){
                       
                        if(arr[i].value == v){
                            plt = arr[i].params
                           
                           
                        }
                    }

                    
                    let to = JSON.parse(t);
                    
                    for(let h = 0; h < plt.length; h++){
                      
                       

                        plt[h].value = to[`${plt[h].field}`]
                         
                    }

                    let plf = []
                    for(let t = 0; t < that.state.pltfmdt.length; t++){
                            if(response.data.data.mod_platform == that.state.pltfmdt[t].value){
                                plf = that.state.pltfmdt[t].mod_quota
                            }
                    }
            
                 
                    that.setState({
                        is_warn: response.data.data.is_warn,
                        appserverinput: plt,
                        editspin: false,
                        moddetail: response.data.data,
                        mod_quotas: plf,
                        evisible: true,
                         
                    })

                     
                }
            })
            .catch(function (error) {
                console.log(error);
                
            })
    }


    

    render(){

        const clsbgChange = (visible) => {
            this.setState({
                evisible: visible
            })
        }

           
        const   multipbgChange = (visible) => {
            this.setState({
                graphxvisible: visible,
                motlannua: null,
            })
        }
        



        const ebgChange = (visible) => {
            this.setState({
                evisible: visible,
            })
            this.listlist();
           
        }

       
        const   bgChange = (visible) => {
            this.setState({
                svisible: visible,
            })
        }
        
        const editmoddetail = (v) => {
          
           
            this.capacityModelqueryByModId(v.mod_id)
          
             
        }

        const moddetailset = (v) => {
 

 
            this.setState({
     
                motlannua: v,
                graphxvisible: true,
            })
        }

       

        const modedel = (v) => {
            
            this.setState({
                moddelisModalVisible: true,
                mod_id: v.mod_id,
            })
            
        }
         ottop = {
            title: '操作',
               
            width: 230,
            align: "left",
            render: (text, data) =>  buttons(data)
        }


        const toolips = (data) => {
            if(data.is_power == 1){
                return <CheckCircleOutlined />
            }else if(data.is_power == 2){
                return  <Tooltip title="无需平台扩容">
                            <CloseCircleOutlined />
                        </Tooltip>
                    
            } else if(data.is_power == 0 || !data.is_power){
                return <div className="powerdiv">
                <a target="_blank" rel="noreferrer" href={data.url} > 授权 </a>
                <Tooltip title="该服务还未对大事件授权，请点击跳转到123平台授权， 将emmazwang增加到运维负责人即可。添加后授权信息会有延迟请等待10分钟再刷新页面">
                    <QuestionCircleOutlined />
                </Tooltip>
            </div>
            } 
                    
        }


        const dropdownx = (data) => {


        
 

        if(  data.top5 && data.top5.length >= 1 )   {

            const oks = data.top5.map((itm, i) => {
                return (
                    <div className="motlancopy" key={i}>
                        <CopyOutlined onClick={() => this.paste(itm)} />
                        <span> {itm} </span>
                    </div>
                )
                 
            })

            return <>   
                        <span className="leftflt">
                            {Number(data.max_cpu).toLocaleString()}
                        </span> 
                        <Popover content={oks} title="最大cpu机器top5">
                            <div className="littlewwrap"> top5 </div>
                        </Popover>

                </>
        }else{
            return <>   
                <span className="leftflt">
                    {Number(data.max_cpu).toLocaleString()}
                </span> 
                
                </>
        }

                
            
          
        }
  
        ottnmoc =  {
            title: '展开/折叠',
            dataIndex: '',
            width: '108px',
            className: "expandcesllth",
            fixed: 'center',
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        
                        this.clickcellsth(!this.state.expandtrue)
                    }
                };
            }
        }


        ottnm =   {
            title: '授权',
            dataIndex: 'is_power',
            width: '140px',
            align: "left",
          
            render: (text, data) =>  toolips(data)
        }


        const colomnz = [
            {
                title: '展开/折叠',
                dataIndex: '',
                width: '108px',
                className: "expandcesllth",
                fixed: 'center',
                onHeaderCell: (column) => {
                    return {
                        onClick: () => {
                            
                            this.clickcellsth(!this.state.expandtrue)
                        }
                    };
                }
            },
            
            {
                title: '授权',
                dataIndex: 'is_power',
                width: '60px',
                align: "left",
              
                render: (text, data) =>  toolips(data)
            },
            {
                title: "应用服务",
                dataIndex: "app_server",
                align: "left",
                width: 220,
                className: "haimau",
                ellipsis: true,
                render: (text, data) => (
                    
                    <Tooltip  placement="topLeft"  title={data.app_server}>
                        <a rel="noopener noreferrer"  href={`http://123.woa.com/v2/formal#/server-manage/index?app=${data.app}&server=${data.server}`} target="_blank"> 
                        
                        <i>
                            {data.app_server}
                        </i>
                        {this.state.show_type == 3 || this.state.show_type == 4 ?  <i> {data.timestamp ? data.timestamp : ""}</i> : ""}
                       
                        </a>
                    </Tooltip>
                    
                )
            },
            {
                title: "地域",
                dataIndex: "city",
                align: "left",
                width: 60,
            },
            {
                title: "set",
                dataIndex: "set",
                align: "left",
                width: 150,
            },
            {
                title: "总访问量/分",
                dataIndex: "total_cnt",
                sorter: (a, b) => a.total_cnt - b.total_cnt,
                align: "left",
                width: 170,
                render:(text, data) => (

                    Number(text).toLocaleString()
                )
            },
            {
                title: "失败率(%)",
                dataIndex: "fail_cnt",
                sorter: (a, b) => a.fail_cnt - b.fail_cnt,
                align: "left",
                width: 120,
            },
            {
                title: "平均耗时(ms)",
                dataIndex: "avg_time",
                sorter: (a, b) => a.avg_time - b.avg_time,
                align: "left",
                width: 120,
                render:(text, data) => (

                    Number(text).toLocaleString()
                )
            },
            {
                title: "qps",
                dataIndex: "qps",
                sorter: (a, b) => a.qps - b.qps,
                align: "left",
                width: 120,
                render:(text, data) => (

                    Number(text).toLocaleString()
                )
            },
            {
                title: "单机qps",
                dataIndex: "single_qps",
                sorter: (a, b) => a.single_qps - b.single_qps,
                align: "left",
                width: 120,
                render:(text, data) => (

                    Number(text).toLocaleString()
                )
            },
            {
                title: "cpu平均使用率(%)",
                dataIndex: "cpu",
                sorter: (a, b) => a.cpu - b.cpu,
                align: "left",
                width: 120,
                render: (text, data) => (

                    
                        text 
                       
                   
                )
            },

            // {
            //     title: "容量",
            //     dataIndex: "water_line",
            //     sorter: (a, b) => a.water_line - b.water_line,
            //     align: "left",
            //     width: 180,
            //     render: (text, data) => (
            //         <div className="ceepolls">
            //             <i className="batteryb" style={{width: text+"%"}}>  </i>
                       
                       
            //         </div>
            //     )
                    
            // },
            {
                title: "cpu峰值使用率(%)",
                dataIndex: "max_cpu",
                sorter: (a, b) => a.max_cpu - b.max_cpu,
                align: "left",
                width: 170,
                render:(text, data) => dropdownx(data)
            },
            {
                title: "总容器数",
                dataIndex: "num",
                sorter: (a, b) => a.num - b.num,
                align: "left",
                width: 170,
                render:(text, data) => (
                     
                     Number(text).toLocaleString()

                    

                )
            },
            {
                title: "总核数",
                dataIndex: "num_cpu",
                sorter: (a, b) => a.num_cpu - b.num_cpu,
                align: "left",
                width: 170,
                render:(text, data) => (

                    Number(text).toLocaleString()
                )
            },
            {
                title: '操作',
                   
                width: 230,
                align: "left",
                render: (text, data) =>  buttons(data)
            }
    
    
        ]
        
        const  buttons = (v) => {
            

            return  <div className="opbtngrp">

                {this.state.defaultActiveKeylist == "123" ? (

                    <>
                        
                        <Button type = "primary"  size = "small"
                            onClick = {() => moddetailset(v)}
                        >
                            数据
                        </Button>  

                       
                        <Button type = "primary"  size = "small"
                            onClick = {() => editmoddetail(v)}
                        >
                            编辑
                        </Button>

                        <Button type = "primary" danger size = "small"
                            onClick = {() => modedel(v)}
                        >
                            删除
                        </Button>

                    </>
                ): (
                    <>
                     
                        <Button type = "primary"  size = "small"
                            disabled
                            onClick = {() => editmoddetail(v)}
                        >
                            编辑
                        </Button>

                        <Button type = "primary" danger size = "small"
                            onClick = {() => modedel(v)}
                        >
                            删除
                        </Button>
                    </>
                )}
                   
            </div>
        }


        return (
            <div id="CapacityList"  key={this.props.location.search}> 
                <Card title="容量模型" bordered={false}  > 
              
                <div className="btnwrap">
                    <Button type="primary" onClick={this.capacityModeladdModel}>
                        添加模块
                    </Button>
                    <Button type="primary" onClick={this.fileuploadmodals}>
                        批量添加
                    </Button>
                </div>


                <Row>
                    <Col span={24} className="timerangercols">
                        <div className="leftfloat">

                       
                    
                        <Select defaultValue="1" style={{ width: 170 }} onChange={this.handleChanges}>
                            
                            <Option key="ozero1" value="1">  实时数据 </Option>
                            <Option key="ozero2" value="2">  历史数据 </Option>
                            <Option key="ozero3" value="3"> 单日最大值 </Option>
                            <Option key="ozero4" value="4">  区间最大值 </Option>
                            
                        </Select>
                        
                        {this.state.show_type == 1   ? (
                            <Input value={this.state.currentTime}  disabled  id="width150"  />
                                                
                             
                        ):("")}

                        {  this.state.show_type == 2  ? (
                            <DatePicker
                                format="YYYY-MM-DD HH:mm"
                                
                                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                                onChange={this.onChangetmb}
                                onOk={this.onOksb}
                                />
                                                       
                             
                        ):("")}


                        {this.state.show_type == 3  ? (
                            <DatePicker
                                format="YYYY-MM-DD"
                                
                                showTime={{ defaultValue: moment('0000-00-00', 'YYYY-MM-DD') }}
                                onChange={this.onChangetma}
                                onOk={this.onOksa}
                                />
                                                       
                             
                        ):("")}
 



                        {this.state.show_type == 4 ? (
                            
                         <RangePicker
                          
                            ranges={{
                                '当天': [moment().startOf('day'), moment().endOf('day')],
                                '近一周': [moment().subtract(7, 'days').startOf('day'), moment().endOf('day')],
                                '近一个月': [moment().subtract(30, 'days').startOf('day'), moment().endOf('day')],
                                '近三个月': [moment().subtract(90, 'days').startOf('day'), moment().endOf('day')]
                            }}
                            onChange={this.onChangetm}
                            onOk={this.onOks}
                            format="YYYY-MM-DD" 
                       />
                      
                        ): ("")}
                       
                        <Button type="primary" onClick={this.checklist} >
                            查询
                        </Button>
                       
                        </div>
                        
                        <Tract msg={this.qwes()} />
                    
                    </Col>
                    





                </Row>
                
                  
                </Card>





                <Tabs defaultActiveKey={this.state.defaultActiveKey+""} onChange={this.callback}>
                    <TabPane tab="关系链" key="1">
                                关系链

                              
                    </TabPane>
                    <TabPane tab="监控" key="2">
                        监控
                    </TabPane>
                    <TabPane tab="列表" key="3">
                         
                            {this.state.pltfmdt   ? (
                                
                                <Tabs defaultActiveKey={this.state.defaultActiveKeylist} onChange={this.callbacklist}>
                                     

                                     { this.state.pltfmdt.map((i)=>{
 

 
                                        return (

 
                                            <TabPane tab={i.name} key={i.value}>
                                                
                                                
                                                {this.state.tblaoding ? (

 
                                                    <div className="lowertrans">

                                                    <Spin indicator={antIcon} />

                                                    </div>
                                                    ):(
 
                                                        <Form
                                                        name="basicspecial"
                                                        autoComplete="off"
    
                                                        >
    
                                                        {this.state.openunopen && this.state.type == 1 ? (
    
                                                            <>
    
                                                        {this.state.expandtrue == true ? (  


                                                                <Table
                                                                dataSource={this.state.openunopen}
                                                                columns={colomnz}
                                                                rowKey="id"
                                                                expandable={{
                                                                    defaultExpandAllRows: true,
                                                                }}

                                                                onChange={this.onChangepage}
                                                                pagination={{  
                                                                    total: this.state.openunopen.length, 
                                                                    pageSize: this.state.pageSize, 
                                                                   

                                                                }}
                                                                scroll={{ y:   this.state.wheight  }}
                                                                />
                                                              
    
                                                        ): ("")
                                                        }
        
                                                        {this.state.expandtrue == false ? (  
                                                                 <Table
                                                                 dataSource={this.state.openunopen}
                                                                 columns={colomnz}
                                                                 rowKey="id"
                                                                 expandable={{
                                                                     defaultExpandAllRows: false,
         
                                                                 }}
     
                                                             
                                                                 pagination={{  
                                                                     total: this.state.openunopen.length, 
                                                                   
                                                                    
                                                                    pageSize: this.state.listdt.list_data.length, 
                                                                   
                                                                    
     
                                                                 }}
                                                                 scroll={{ y:   this.state.wheight  }}
     
                                                                 />
        
                                                            ):("")
                                                        }
        
                                                       </>   
    
    
                                                        ) : ("")}
    
                                                        
    
                                                        {this.state.listdt  &&  this.state.type != 1 ?  (
    
    
    
                                                            
                                                            <Table 
                                                                dataSource={this.state.listdt.list_data}
                                                                
                                                               
                                                                columns={this.state.columnsdt}
                                                                scroll={{ y:   this.state.wheight  }}
                                                                
                                                                rowKey="id"
                                                                pagination={{  
                                                                    total: this.state.listdt.list_data.length, 
                                                                    pageSize: this.state.listdt.list_data.length, 
                                                                    
                                                                
                                                                }}
                                                                />

                                                               
                            
                                                        ) : (
    
                                                            ""
                                                        ) }
                                                            
                                                        </Form>
    

                                                    )}


                                                  

                                            </TabPane>


                                        )
                                      })} 

                                        


                                 </Tabs>
                           

                            ):("")}
                         
                   


                    </TabPane>
                </Tabs>


 


                <AddModel 
                    ref={this.wrapper}  
                    visible={this.state.svisible}
                    id={this.state.id}
                    refreshlist={this.refreshlista} 
                    openmodals={bgChange} 
                />


                <EditModel
                   
                    ref={this.wrapper}
                    visible={this.state.evisible}
                    mod_id = {this.state.mod_id}
                    moddetail={this.state.moddetail}
                    mod_quotas={this.state.mod_quotas}
                    appserverinput={this.state.appserverinput}
                    id={this.state.id}
                    pltfmdt = {this.state.pltfmdt}
                    openmodals={ebgChange}
                    openmodalsocls={clsbgChange}
                />

                  

                
                    <Modal title={`提示`}
                        okText="删除"
                        visible={this.state.moddelisModalVisible} 
                        onOk={this.capacityModeldeleteModel} 
                        onCancel={this.autohandleCancel}>
                       确认删除吗？

                       {this.state.delspin ? (
                            <div className="lowertrans">

                            <Spin indicator={antIcon} />
    
                            </div>
                            
                       ): ("")}

                    </Modal>
 
                    {this.state.motlannua ? (
                        <CapacityModeloneServerSet 
                        ref={this.wrapper}  
                        visible={this.state.graphxvisible}
                        
                        motlannuao={this.state.motlannua}
                        multipleopenmodals={multipbgChange}
                        />
 
                    ): ("")}
                   

                    <Modal title={`批量添加`}
                        width="350px"
                        okText="确定"
                        visible={this.state.fileuploadModalVisible} 
                        onOk={this.fileuploadapi} 
                        onCancel={this.fileupcancelhandleCancel}
                        wrapClassName="massuploadmodal"
                    >
                      
                        <div id="inputfile">

                       
                            <a href={`${APIURL}/capacityModel/batchAddModelDownloadFile`} target="_blank"  rel="noreferrer"  >
                            <CloudDownloadOutlined  height="4em"/>
                             下载模版</a>
                           
                            <div id="fileuploadicons">
                                <ToTopOutlined height="4em" /> 
                                <i className="right">
                                    上传表格
                                </i>
                                <Input placeholder="file" type="file" id="filexd"  multiple onChange={this.fileupld} />

                            </div>
                           
                        </div>
                        <span id="filenamtip"> {this.state.filenames ? (`文件名称： ${this.state.filenames}`) : ""}</span>

                    </Modal>
 


      
               
                    <div className='btn3'>


                            <Button type="primary" onClick={this.showModal}>
                                扩容
                            </Button>
                            <Modal title="请选择扩容方式" visible={this.state.isModalVisible} onOk={this.qweq} onCancel={this.handleCancel}>
                            
                                <Radio.Group onChange={this.way} value={this.state.way}>
                                    <Space direction="vertical">
                                        <Radio value={1}>以台数扩容</Radio>
                                        <Radio value={2}>以核数扩容</Radio>
                                        <Radio value={0}>以百分比扩容</Radio>
                                    </Space>
                                </Radio.Group>
                            </Modal>
                            <Button type="primary" disabled className="btn2">
                                缩容
                            </Button>
                         </div>
 
                
 
                 
                
              
 
            </div>
            
        )
    }
}





export default withRouter(CapacityList);