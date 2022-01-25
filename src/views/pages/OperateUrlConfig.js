import React from 'react';
import { Modal, Form, Input,  Button, message,  Select, notification,  Spin, } from 'antd';
 
import axios from "axios";
import { APIURL } from '../../common/constdt.js';

import {UnControlled as CodeMirror} from 'react-codemirror2'
import  'codemirror/lib/codemirror.css'
import {   ExclamationCircleOutlined, LoadingOutlined,} from '@ant-design/icons';

import 'codemirror/addon/hint/show-hint.css'
import  'codemirror/theme/blackboard.css'
import 'codemirror/theme/material.css';
import 'codemirror/addon/hint/sql-hint.js';
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";
import 'codemirror/mode/css/css.js'
import 'codemirror/theme/cobalt.css'
import 'codemirror/mode/javascript/javascript.js'

import '../specialcss.css'

const { Option } = Select;

const dt = {"code": 0, "status": "success", "msg": "", "data": {"time_data": ["2021-12-02 16:55:00"], "stat_data": [0.0]}}
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;



class OperateUrlConfig extends React.Component {

    constructor(props) {
        super(props);
      
        this.state = {
          confurls: null,
          getresults: null,
          
          optionsx: {
            mode: "application/json",
            indentUnit: 5, // 缩进单位，默认2
            smartIndent: true, // 是否智能缩进
            lineNumbers: true,
            collapseIdentical: false,
            highlightDifferences: true,
            //readOnly: true,
            autoRefresh: true,
            flattenSpans: false,
            gutters: [
              "CodeMirror-linenumbers",
              "CodeMirror-foldgutter",
              "CodeMirror-lint-markers",
            ],
            lineWrapping: true,
            foldGutter: true,
            matchBrackets: true,
            autoCloseBrackets: true,
             
          },
          url_list: null,
          headers: null,
          spinsts: false,
          backinfo: null,
          disf: true,
        }
        
    
        this.hideModal = this.hideModal.bind(this);
        this.urlprm = this.urlprm.bind(this);
        this.eventInfofieldMap = this.eventInfofieldMap.bind(this);
    
      }

      componentDidMount(){
        this.setState({
          disf: true,
        })
        
        let url_string = window.location.href.replace(/\/#/g,"")
      
        let purl = new URL(url_string);
        
        let id = purl.searchParams.get("id");
        console.log(id)
        console.log(this.props);
        this.eventInfoqueryUrl(id)
      }

      // static getDerivedStateFromProps(props, state) {
       
      //   return {
      //     disf: true,
      //   }
      // }


      componentWillReceiveProps(nextProps) {
        this.setState({
          disf: true,
        })
      }

    hideModal() {


        this.props.configmodals(false)

    };

    urlprm = (v) => {
      

      this.setState({
        confurls: v.target.value
      })
       

      console.log(v.target.value)
    }
    onFinish = (v) => {
      
      console.log(v)
     
      this.eventInfourlInsertDb(v);
    };

    async eventInfourlInsertDb(v){
      
 
        const url = `${APIURL}/eventInfo/urlInsertDb`;


        let bodyFormData = new FormData();
          
        let url_string = window.location.href.replace(/\/#/g,"")
      
        let purl = new URL(url_string);
        
        let id = purl.searchParams.get("id");

        bodyFormData.append("event_id", id );
      

        if(v.url){
          bodyFormData.append("url", v.url );
        }else if(this.state.url_list){
          
          bodyFormData.append("url", this.state.url_list[0].url );
        } else {

          notification.error({
            message: '提示',
            description: "没有url",
            placement: 'topCenter',
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });
          return false;
        }
  
       if(v.stat_field){
        bodyFormData.append("stat_field", v.stat_field );
       } else if(this.state.url_list){
        bodyFormData.append("stat_field", this.state.url_list[0].stat_field );
       }else {
          notification.error({
            message: '提示',
            description: "没有数据字段",
            placement: 'topCenter',
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });
         return false;
       }

       if(v.time_field){
        bodyFormData.append("time_field", v.time_field );
       }else if(this.state.url_list){
        bodyFormData.append("time_field", this.state.url_list[0].time_field );
       } else {
          notification.error({
            message: '提示',
            description: "没有时间字段",
            placement: 'topCenter',
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });
          return false;
       }

       

      let that = this;
      
      await axios.post(url, bodyFormData, { withCredentials: true })
      .then(function (response) {
        

          if (response.data.code == 0) {
               console.log(response)
               that.props.configmodals(false);
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
          console.log(error);
        
      })


    }
  
    onFinishFailed = () => {
      message.error('Submit failed!');
    };
  
    async eventInfoqueryUrl(t){
        
      const urlsx = `${APIURL}/eventInfo/queryUrl`;

        var that = this
        await axios.get(urlsx, {
            withCredentials: true,
            params: {
                event_id: t,
            }
        })
            .then(function (response) {
              
              
                if (response.data.code == 0 && response.data.url_list.length >= 1) {
                    that.setState({
                        
                      url_list: response.data.url_list,
                      

                    })
                } else {
                  console.log('blank url_list')
                }

            })
            .catch(function (error) {
                console.log(error);
              
            })
    }

    async urlwrite(h){

      this.setState({
        spinsts: true,
      })

      var that = this
      await axios.get(h, {
          withCredentials: true,
          
      })
          .then(function (response) {
            
            
              if (response.data.code == 0 ) {

                 
                 let rs = response.data;
               
                  console.log(rs)
           
                   //rs = JSON.stringify(rs);
                  


                  that.setState({
                      
                    backinfo: rs,
                    spinsts: false,

                  })
              } else {
                console.log('--')
              }

          })
          .catch(function (error) {
              console.log(error);
            
          })

          that.setState({
                      
          
            spinsts: false,

          })
    }

    async eventInfofieldMap(){
      
      this.setState({
        spinsts: true,
        
      })


      console.log(this.state.confurls)

        let url = `${APIURL}/eventInfo/fieldMap`;

        let   urlz = "https://api-big.woa.com/indicator/getCurrentOnline"
        console.log(urlz)
       
            var that = this
 
            let bodyFormData = new FormData();
            
            if(this.state.confurls){
              
              bodyFormData.append("url", this.state.confurls );
              that.urlwrite(this.state.confurls)

            }  else if(this.state.url_list){

              bodyFormData.append("url", this.state.url_list[0].url );
              that.urlwrite(this.state.url_list[0].url)

            }else {

              notification.error({
                message: '提示',
                description: "请输入URL",
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
              });

              this.setState({
                spinsts: false,
              })

              return false;
            }
          

            await axios.post(url, bodyFormData, { withCredentials: true })
                .then(function (response) {
                  

                    if (response.data.code == 0) {
                        that.setState({
                            
                          getresults: response.data.data,
                           
                          spinsts: false,
                          disf: false,

                        })
                    }else {
                      that.setState({
                            
                        
                        spinsts: false,
                        disf: true,

                      })

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
                    console.log(error);
                    that.setState({
                            
                        
                      spinsts: false,
                    

                    })
                })

      
        

    }

    render() {

        const configChange = (visible) => {
            this.setState({
              visible: visible
            })
          }
      
 
        return (
    
          <div id="OperateUrlConfig">
    
    
            <Modal
              title="运营/容量指标数据接口配置"
    
              closable
              maskClosable={false}
              centered

              visible={this.props.visible}
              onCancel={this.hideModal}
              configmodals={configChange}
              width={1120}
              footer={null}
              destroyOnClose={false}
    
            >
    
                
                {this.state.url_list && !this.state.getresults ? (


                    <Form
                              
                    layout="horizontal"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    autoComplete="off"

                    name="urlconfigfm"
                    initialValues={{ 
                      time_field: this.state.url_list ? this.state.url_list[0].time_field : "",
                      stat_field: this.state.url_list ? this.state.url_list[0].stat_field : "",
                      url: this.state.url_list ? this.state.url_list[0].url : "", 

                    }}
                    >

                   {this.state.spinsts ? (
                            <div className="editspindx">  <Spin indicator={antIcon} />  </div>
                    ): (
                        ""
                    )}

                    <div id="tipswrap">
                    
                    <ExclamationCircleOutlined />
                    <div>
                    说明：提供的数据接口返回的格式包含两个数组，一个数组是时间数据，一个数组是数据数组，时间数组中的每个元素的格式要求是 2021-11-111 11:11:01 这种格式。
                    示例： {JSON.stringify(dt)}
                    </div>
                    </div>


                    <Form.Item label="请求方式">
                    <Input value="GET"  disabled  />
                    </Form.Item>


                    <Form.Item
                      name="url"
                      label="URL"
                      rules={[
                        
                        {
                          type: 'url',
                          warningOnly: true,
                        },
                        {
                          type: 'string',
                          min: 6,
                        },
                      ]}
                    >
                      <Input placeholder="请输入url" onBlur={this.urlprm}  />
                    </Form.Item>


                    


                    <Form.Item  label="返回信息">

                      <div id="codeMirrowt">
                        
                             <CodeMirror
                              value={this.state.backinfo ?  JSON.stringify(this.state.backinfo, null, ' ')   : ""}
                              ref="myCm"
                              options={this.state.optionsx}
                              
                            />
                        
                     
                      </div>

                      </Form.Item>


                      <Button id="leftbuttons" onClick={this.eventInfofieldMap}>链接测试</Button>



                    <div className="bluetips">
                        <ExclamationCircleOutlined />
                        请先进行“链接测试”以获得返回结果，再进行Scheme信息的描述。
                    </div>

               

 
                      <Form.Item label="时间数组映射路径" name="time_field">
                      <Select style={{ width: 270 }}>
                        {this.state.url_list ? (
                              this.state.url_list.map(function (i, t) {
                                  return (<Option value={i.time_field} key={t}> {i.time_field} </Option>)
                              })

                          ) : ("")}
                        
                      </Select>

                      </Form.Item>
                      <Form.Item label="数据数组映射路径" name="stat_field">
                      <Select style={{ width: 270 }}  >
                      {this.state.url_list ? (
                          this.state.url_list.map(function (i, t) {
                              return (<Option value={i.stat_field} key={t}> {i.stat_field} </Option>)
                          })

                      ) : ("")}
                        
                      </Select>

                      </Form.Item>






                    
                                  

                    
                  


                    <Form.Item wrapperCol={{ offset: 3, span: 21 }}>

                      <div id="btnright">
                          <Button type="primary" htmlType="submit"   disabled={this.state.disf }>
                              提交
                          </Button>
                      </div>



                      </Form.Item>
                    </Form>





                ) : 

                (
                
                <Form
                              
                layout="horizontal"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                autoComplete="off"

                name="urlconfigfm"
                
                >

                    {this.state.spinsts ? (
                            <div className="editspindx">  <Spin indicator={antIcon} />  </div>
                    ): (
                        ""
                    )}
                <div id="tipswrap">
                <ExclamationCircleOutlined />
                <div>
                  说明：提供的数据接口返回的格式包含两个数组，一个数组是时间数据，一个数组是数据数组，时间数组中的每个元素的格式要求是 2021-11-111 11:11:01 这种格式。
                  示例： {JSON.stringify(dt)}
                </div>
                </div>


                <Form.Item label="请求方式">
                <Input value="GET"  disabled  />
                </Form.Item>


                <Form.Item
                  name="url"
                  label="URL"
                  rules={[
                    
                    {
                      type: 'url',
                      warningOnly: true,
                    },
                    {
                      type: 'string',
                      min: 6,
                    },
                  ]}
                >
                  <Input placeholder="请输入url" onBlur={this.urlprm}  />
                </Form.Item>


                


                <Form.Item  label="返回信息">

                  <div id="codeMirrowt">
                     
                       <CodeMirror
                       value={this.state.backinfo ?   JSON.stringify(this.state.backinfo, null, ' ')    : ""}
                       ref="myCm"
                       options={this.state.optionsx}
                       
                     />

                     
                 
                  </div>

                  </Form.Item>





                  <Button id="leftbuttons" onClick={this.eventInfofieldMap}>链接测试</Button>



                  <div className="bluetips">
                      <ExclamationCircleOutlined />
                      请先进行“链接测试”以获得返回结果，再进行Scheme信息的描述。
                  </div>




                
                              
                <Form.Item label="时间数组映射路径" name="time_field">
                    <Select style={{ width: 270 }}>
                    {this.state.getresults ? (

                        this.state.getresults.map(function (i, t) {
                          return (<Option value={i} key={t}> {i} </Option>)
                        })
                           
                    ): "" }
                                
                    </Select>

                    </Form.Item>
                    <Form.Item label="数据数组映射路径" name="stat_field">
                    <Select style={{ width: 270 }}  >
                     {this.state.getresults ? (


                        this.state.getresults.map(function (i, t) {
                          return (<Option value={i} key={t}> {i} </Option>)
                        })
                                             
                     ): ""}
                         
                    </Select>

                    </Form.Item>


               
                <Form.Item wrapperCol={{ offset: 3, span: 21 }}>

                  <div id="btnright">
                      <Button type="primary" htmlType="submit"   disabled={this.state.disf || this.state.spinsts ? true : false}>
                          提交 
                      </Button>
                  </div>



                  </Form.Item>
                </Form>

                )

                }
            



            
            </Modal>
    
          </div>
        )
      }


}


export default OperateUrlConfig;