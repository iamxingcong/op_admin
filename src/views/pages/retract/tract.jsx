import React, { Component } from 'react'
import { APIURL } from '../../../common/constdt.js'
// import ReactEcharts from 'echarts-for-react'
import axios from 'axios'
import './tract.css'
export default class Tract extends Component {
    state = {
        num: {}
    }
    componentDidMount() {
        // let url_string = window.location.href.replace(/\/#/g, "")
        // // let url = new URL(url_string);
        // // let id = url.searchParams.get("id");
        const urls = `${APIURL}/list/list`;
        axios.get(urls, {
            withCredentials: true,
            params: {
                show_type: this.props.msg.show_type,
                type: this.props.msg.type,
                link_id: this.props.msg.link_id,
            }
        }).then(
            res => {
                console.log('成功', res.data.data.sum_data);
                let num = res.data.data.sum_data
                this.setState((prevState, props) => ({
                    num: num,
                    isLoading: true
                }));
                console.log(res);

            },
            err => {
                console.log('失败', err);
            }
        )
        console.log(this.props.msg);
    }
    render() {
        const { num } = this.state
        return (
            <div className='tract'>
                {this.props.msg.type == '1' ?
                    <div className='boxs'>
                        <div className='div'>
                            <p>总访问量/分</p>
                            <p className='col'>{Number(num.sum_total_cnt).toLocaleString()}</p>
                        </div>
                        <div className='div'>
                            <p>CPU平均使用率(%)</p>
                            <p className='col'>{Number(num.sum_cpu).toLocaleString()}</p>
                            
                        </div>
                        <div className='div'>
                            <p>CPU峰值使用率(%)</p>
                            <p className='col'>{Number(num.sum_max_cpu).toLocaleString()}</p>
                        </div>
                        <div className='div'>
                            <p>总容器数</p>
                            <p className='col'> {Number(num.sum_num).toLocaleString()}</p>
                        </div>
                        <div className='div'>
                            <p>总核数</p>
                            <p className='col'>{Number(num.sum_cpu_num).toLocaleString()}</p>
                        </div>
                    </div> : ''}
            </div>
        )
    }
}
