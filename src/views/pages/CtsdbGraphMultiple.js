import React from 'react';
import { Modal, Spin, } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import axios from "axios";

import { APIURL } from '../../common/constdt.js'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

 

class CtsdbGraphMultiple extends React.Component {




  constructor(props) {
    super(props);

    this.state = {
      graphspinz: null,
      graphmultipledt: null,
      id: null,
      propsitm: null,
      config: null,

    }

    this.hideModal = this.hideModal.bind(this);

  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.motlannuao.mod_id !== this.props.motlannuao.mod_id) {

      this.mulapi(nextProps.motlannuao)
    }
  }

 


  componentDidMount() {
    
    this.setState({
      id: this.props.motlannuao.mod_id
    })
   

    if (this.props.motlannuao) {

      let prm = this.props.motlannuao;
    
      this.mulapi(prm)
    }



  }


  async mulapi(v) {



    this.setState({
      config: null,
    })
    const urls = `${APIURL}/capacity/ctsdbGraph`;
    this.setState({
      graphspin: true,


    });
    let that = this;
    await axios.get(urls, {
      withCredentials: true,
      params: {
        event_id: v.event_id,
        mod_id: v.mod_id,
        zone: v.area,
        set: v.set_name,

      }
    })
      .then(function (response) {

        if (response.data.code == 0) {
         
          let data = response.data.data;


          that.setState({
            graphmultipledt: response.data.data,

            id: null,
            graphspin: false,
          })
 
         

             
        

                that.setState({
                  config: {
                    autoFit: true,
                    data,
                    height: 400,
                    xField: 'time',
                    yField: 'value',
                    seriesField: 'name',
                    smooth: true,
                    yAxis: {
                      
                    },
                    legend: { position: 'bottom' },
                    color: ['#1979C9', '#D62A0D', '#FAA219', "red"],
                    
                    
                  },
          
                })  


         
         
        }

      })
      .catch(function (error) {
        console.log(error);
      })
  }

  okd(data) {

 
   
 
    
   
  
    
  }


  hideModal() {


    this.props.multipleopenmodals(false)

  };


  render() {

    const bgChange = (visible) => {
      this.setState({
        visible: visible
      })
    }


 


    return (

      <div id="CtsdbGraph">


        <Modal
          title={this.props.motlannuao.app_name+"."+this.props.motlannuao.server_name+this.props.motlannuao.set_name+"."+this.props.motlannuao.area+"数据"}
          key={this.props.event_id}
          closable
          maskClosable={false}
          centered
          visible={this.props.visible}
          onCancel={this.hideModal}
          multipleopenmodals={bgChange}
          width={1120}
          height={600}
          footer={null}
          destroyOnClose={false}

        >
          {this.state.graphspin ? (
            <div className="tableflowertrans">  <Spin indicator={antIcon} />  </div>
          ) : (

              ""

            )}
              
              {this.state.config ? 
        
              <Line {...this.state.config} />
              
              : ""}
         
           
        </Modal>

      </div>
    )
  }

}
export default CtsdbGraphMultiple;