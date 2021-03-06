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
        
        
 
        var url_string = window.location.href.replace(/\/#/g,"")
      
        var url = new URL(url_string);
        var c = url.searchParams.get("tabs");
        var b = url.searchParams.get("id");
       
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
               
            })

        
    }

  
    goto_tabs(v){
       
        this.props.defaultkey(v.platform_name)
    }
   

    copylink(v){
     
        var url_string = window.location.href.replace(/\/#/g,"")
    
        var url = new URL(url_string);
       
        var b = url.searchParams.get("id");

        var txt = url.host+"/#/EventDetail?id=" + b+"&tabs="+ v.platform_name;
        navigator.clipboard.writeText(txt)
      
        
        notification.success({
            message: '??????',
            description: '???????????????',
            placement: 'topCenter',
            onClick: () => {
              console.log('Notification Clicked!');
            },
        });

    }

   
    
    render(){

        const columns = [
            {
                title: '??????',
                dataIndex: 'platform',
                align: "center",
            },
            {
                title: '???????????????????????????',
                dataIndex: 'is_tianxie',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.is_tianxie == 0 ? (
                            <Tooltip title="?????????????????????">

                            
                            <QuestionCircleOutlined />
                            </Tooltip>
                        ): (
                            <CheckCircleOutlined />  
                        )}

                    </span>
                    
                )


            },
            {
                title: '????????????????????????',
                dataIndex: 'is_check',
                align: "center",
                render: (text, data) => (
                    <span>
                        {data.is_check == 0 ? (
                            <Tooltip title="??????????????????????????????">
                                <QuestionCircleOutlined />
                            </Tooltip>
                           
                        ): (
                            <CheckCircleOutlined />  
                        )}

                    </span>
                    
                )


            },
            {
                title: '??????????????????',
                dataIndex: 'platform',
                align: "center",
                render: (text, data, index) => (
                    <div className="opbtngrp">

                    
                    <Button  onClick={()=> this.goto_tabs(data)} type="primary" size="small">

                        ??????

                    </Button>
                    <Button  onClick={()=> this.copylink(data) } type="primary" size="small">

                        ????????????

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