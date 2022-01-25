import React from 'react';
import { Modal, } from 'antd';
import { Line } from '@ant-design/charts';


 



class CtsdbGraph extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        config: null,
    }

    this.hideModal = this.hideModal.bind(this);

  }

  componentDidMount() {
 
    
    if (this.props.graphdata) {
     
      
      let data = this.props.graphdata.data;
       
     
       this.setState({
        config: {
          data,
          height: 400,
          xField: 'time',
          yField: 'value',
          
          seriesField: 'name',
          yAxis: {
            
          },
          legend: { position: 'bottom' },
          color: ['#1979C9', '#D62A0D', '#FAA219', "red"],

         
        },

       })  
      
       


    }
  }


 

  hideModal() {


    this.props.openmodals(false)

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
          title="真实容量"

          closable
          maskClosable={false}
          centered
          visible={this.props.visible}
          onCancel={this.hideModal}
          openmodals={bgChange}
          width={1120}
          footer={null}
          destroyOnClose={false}

        >

        {this.state.config ? 
        
        <Line {...this.state.config} />
        
        : ""}
            

        </Modal>

      </div>
    )
  }

}
export default CtsdbGraph;