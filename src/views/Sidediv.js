import React from 'react';
import { Layout, Menu } from 'antd';
import { NotificationOutlined , QqOutlined} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

import axios from "axios";
 
const { Sider } = Layout;



  class Sidediv extends React.Component {

 
    componentDidMount() {

 
     // this.getMenus();
  }

  async getMenus(){

    let url =  "http://api.big.pcg.com/capacity-menu/menu"
    
     

      await axios.get(url, {
          withCredentials: true,
          params: {
               
          }
      })
      .then(function (response) {
          
           
          console.log(response)
      })
      .catch(function (error) {
          console.log(error);
      })

  }

   


  state = {
    current: 'EventList',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({ current: e.key });
    this.props.history.push(e.key);
  };

  render() {
    const { current } = this.state;

    return (
      <Sider width={200}
        className="site-layout-background">
        <div className="logo">
          <QqOutlined />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['EventList']}
          style={{ height: '100%' }}
          onClick={this.handleClick}
          selectedKeys={[current]}
        >

          <Menu.Item key="EventList"  icon={<NotificationOutlined />}>   事件运营 </Menu.Item>
      

  
        </Menu>
      </Sider>
    )
  }
}


export default withRouter(Sidediv);