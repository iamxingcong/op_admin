import React from 'react';
import { Modal, Spin, Tabs, } from 'antd';
import { LoadingOutlined,  } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import axios from "axios";

import { APIURL } from '../../common/constdt.js'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { TabPane } = Tabs;


class CapacityModeloneServerSet extends React.Component {




  constructor(props) {
    super(props);
    this.state = {
      graphspinz: null,
      graphmultipledt: null,
      capacityModeloneSetGraphdt: null,
      id: null,
   
      config: null,
      configquota: null,
      visible: false,
    }

    this.hideModal = this.hideModal.bind(this);
    this.callback = this.callback.bind(this);

  }


  componentWillReceiveProps(nextProps) {

 
 
    if (nextProps.motlannuao.mod_id !== this.props.motlannuao.mod_id) {
 
     
      this.capacityModeloneSetGraph(nextProps.motlannuao);
      this.capacityModelbusinessQuota(nextProps.motlannuao);
    }
  }






  componentDidMount() {
    
    this.setState({
      id: this.props.motlannuao.mod_id
    })
    
 

    if (this.props.motlannuao) {
     
      let prm = this.props.motlannuao;
     
     
      this.capacityModeloneSetGraph(prm);
      this.capacityModelbusinessQuota(prm);
    }



  }

  callback(key) {
    console.log(key);
  }

  async capacityModelbusinessQuota(v){
 
    this.setState({
      config: null,
    })
    const urls = `${APIURL}/capacityModel/businessQuota`;
    this.setState({
      graphspin: true,


    });

    
    let vset = null;

    if( v.set == "--") {
      vset = null;
    } else if(v.set.length == 1 ){
      vset = null;
    }else {
      vset = v.set
    }

    let vcity =  null;
    if(v.city == "--" ) {
      vcity = null;
    }else if( v.city.length == 1 ){
      vcity = null;
    } else {
      vcity = v.city;
    }



    let that =  this;
    await axios.get(urls, {
      withCredentials: true,
      params: {
      
        mod_id: v.mod_id,
        app: v.app,
        server: v.server,
        set: vset,
        area: vcity,


      }
    })
    .then(function (response) {

      if (response.data.code == 0) {
      
        let data = response.data.data;

        that.setState({
          graphmultipledt: response.data.data,

          id: null,
          graphspin: false,
    
          configquota: {
            autoFit: true,
            data,
            height: 400,
            xField: 'time',
            yField: 'value',
            seriesField: 'name',
            smooth: true,
            yAxis: {
              
            },
            legend: { position: 'bottom',  layout: 'horizontal', flipPage: false,},
            color: ['#1979C9', '#D62A0D', '#FAA219', "red"],
            
            
          },
  
        })  

  
      }
    })
    .catch(function (error) {
      console.log(error);
    })
}


  async capacityModeloneSetGraph(v){
      

        this.setState({
          config: null,
        })
        const urls = `${APIURL}/list/cpuList`;
        this.setState({
          graphspin: true,


        });
     
        let vset = null;

          if( v.set == "--") {
            vset = null;
          } else if(v.set.length == 1 ){
            vset = null;
          }else {
            vset = v.set
          }
      
          let vcity =  null;
          if(v.city == "--" ) {
            vcity = null;
          }else if( v.city.length == 1 ){
            vcity = null;
          } else {
            vcity = v.city;
          }
    
        
        let that =  this;
        await axios.get(urls, {
          withCredentials: true,
          params: {
            mod_id: v.mod_id,
            set: vset,
            city: vcity,
          }
        })
        .then(function (response) {

          if (response.data.code == 0) {
            

          let data = response.data.data;

         
            that.setState({

              visible: true,
              capacityModeloneSetGraphdt: response.data.data,
  
              id: null,
              graphspin: false,
        
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
                
                legend: { position: 'bottom',  layout: 'horizontal', flipPage: false,},
                color: ['#1979C9', '#D62A0D', '#FAA219', "red"],
                
                
              },
      
            })  

      
          }
        })
        .catch(function (error) {
          console.log(error);
        })
  }


 

  hideModal() {


    this.props.multipleopenmodals(false)
    this.setState({
      visible: false,
    })

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
          title={this.props.motlannuao.app+"."+this.props.motlannuao.server+"的详细信息"}
          key={this.props.event_id}
          closable
          maskClosable={false}
          centered
          visible={this.state.visible}
          onCancel={this.hideModal}
          multipleopenmodals={bgChange}
          width={1120}
          height={600}
          footer={null}
          destroyOnClose={true}

        >
          {this.state.graphspin ? (
            <div className="tableflowertrans">  <Spin indicator={antIcon} />  </div>
          ) : (

              ""

            )}
            
            <Tabs defaultActiveKey="2" onChange={this.callback}>
              
              <TabPane tab="容量走势" key="2">
                  {this.state.capacityModeloneSetGraphdt && this.state.capacityModeloneSetGraphdt.length >= 1 ? (
                        <Line {...this.state.config} />

                    ) : ("")}
            
              </TabPane>
              <TabPane tab="业务指标" key="3">

              {this.state.graphmultipledt && this.state.graphmultipledt.length >= 1 ? (

                <Line {...this.state.configquota} />
                ) : ("")}

               
              </TabPane>
            </Tabs>
     
           
        </Modal>
          
      </div>
    )
  }

}
export default CapacityModeloneServerSet;