import React   from 'react';
import axios from "axios";
import {   Table, Button , notification, Tooltip } from 'antd';

import {  APIURL } from "../../common/constdt.js"
import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons"

export default class CheckList extends React.Component {

    constructor(props) {

        
        super(props);

        this.state = {
             cklist: null,
     
            
        }
        this.goto_tabs = this.goto_tabs.bind(this)
        this.copylink = this.copylink.bind(this)
    }
    
    componentDidMount(){
        
        console.log(this.props)
        let t = this.props.id
         
        console.log(t)
       
 
        var url_string = window.location.href.replace(/\/#/g,"")
        console.log(url_string)
        var url = new URL(url_string);
        var c = url.searchParams.get("tabs");
        var b = url.searchParams.get("id");
        console.log(b)
        console.log(c);
        this.agetRates(b)
        if(c){
            this.props.defaultkey(c)
        }
    }

  
    cklists() {
        this.agetRates(this.props.id)
     }
    async agetRates (t){

        
        const urlsx = `${APIURL}/checkList/list`;

        var that = this
        await axios.get(urlsx, {
            withCredentials: true,
            params: {
                event_id: t,
            }
        })
            .then(function (response) {
               

                if (response.data) {
                    that.setState({
                        
                        cklist: response.data.data,
                       

                    })
                }

            })
            .catch(function (error) {
                console.log(error);
                notification.error({
                    message: '提示',
                    description: error.message,
                    duration: 60,
                    placement: 'topCenter',
                    onClick: () => {
                    console.log('Notification Clicked!');
                    },
                });
            })

        
    }

    //  child transfer value to parent
    goto_tabs(v){
        console.log(v)
        this.props.defaultkey(v.platform_name)
    }
   

    copylink(v){
        console.log(v)
       
        var url_string = window.location.href.replace(/\/#/g,"")
        console.log(url_string)
        var url = new URL(url_string);
       
        var b = url.searchParams.get("id");

        var txt = url.host+"/#/EventDetail?id=" + b+"&tabs="+ v.platform_name;
        navigator.clipboard.writeText(txt)
        console.log(txt)
        
        notification.success({
            message: '提示',
            description: '链接已复制',
            placement: 'topCenter',
            onClick: () => {
              console.log('Notification Clicked!');
            },
        });

    }

   
    
    render(){

        const columns = [
            {
                title: '平台',
                dataIndex: 'platform',
                align: "center",
            },
            {
                title: '是否以填写详情内容',
                dataIndex: 'is_tianxie',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.is_tianxie == 0 ? (
                            <Tooltip title="未填写详细内容">

                            
                            <QuestionCircleOutlined />
                            </Tooltip>
                        ): (
                            <CheckCircleOutlined />  
                        )}

                    </span>
                    
                )


            },
            {
                title: '平台负责人已确认',
                dataIndex: 'is_check',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.is_check == 0 ? (
                            <Tooltip title="平台负责人未全部确认">
                                <QuestionCircleOutlined />
                            </Tooltip>
                           
                        ): (
                            <CheckCircleOutlined />  
                        )}

                    </span>
                    
                )


            },
            {
                title: '发送确认链接',
                dataIndex: 'platform',
                align: "center",
                render: (text, data, index) => (
                    <div>

                    
                    <Button  onClick={()=> this.goto_tabs(data)} type="primary" size="small">

                        详情

                    </Button>
                    <Button  onClick={()=> this.copylink(data) } type="primary" size="small">

                        复制链接

                    </Button>
                </div>
                )

            },
        ]



        return (
            <div id="checklist"> 
                <Table

                columns={columns}
                rowKey="platform"
                dataSource={this.state.cklist}
                
                />
            </div>
        )
    }
}