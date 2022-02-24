import React from 'react';
import {    Modal , Form, Input, Button,  Spin, notification, Select , Cascader,Tooltip, } from 'antd';
import { NotificationOutlined , QqOutlined, LoadingOutlined  , DownOutlined, UpOutlined, AreaChartOutlined, } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';


import axios from "axios";
import {  APIURL } from '../common/constdt.js'

 
const { Option } = Select;
 


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


const tailLayout = {
  wrapperCol: {
    offset: 2,
    span: 22,
  },
};

class Sidediv extends React.Component {


    constructor(props) {
      super(props);
      this.state = {
          id: null,
          isModalVisible: false,
          linkisModalVisible: false,
          renameisModalVisible: false,
          deldirlinkModalVisible: false,
          moveisModalVisible: false,
          deldirModalVisible: false,
          current: 'CapacityList',
          menudt: null,
       
          menuloading: null,
          createloading: null,
          origindts: {},
          keypath: null,
          renametype: null,
          target_id: null,
          firstid: null,
          level1_dir_id: null,
          level2_dir_id: null,
          clicktwoli: null,
          clickthreeliid: null,
          EngName: null,
          level: null,
          link_dir_id: null,
          move_id: null,
          childlinkinfo: null,
          togglevl: false,
          openstatus: '',
          caseddtarr: null,
          device: 'apple',
          toggleevent: false,
          link_id: null,
      }
     
 
      this.cancelmovetoisModalVisible = this.cancelmovetoisModalVisible.bind(this);
      this.cancelrenameislinkModalVisible = this.cancelrenameislinkModalVisible.bind(this);
      this.deldirlinkisModalVisible = this.deldirlinkisModalVisible.bind(this);
      this.deldirisModalVisible = this.deldirisModalVisible.bind(this);
      this.bonChange = this.bonChange.bind(this); 
      this.onBlur = this.onBlur.bind(this);
 
      this.checkchinese = this.checkchinese.bind(this);

      this.secondaddlinksndmenu = this.secondaddlinksndmenu.bind(this);

      this.clickli = this.clickli.bind(this);
      this.addlinksndmenu = this.addlinksndmenu.bind(this);
      this.adddirsndmenu = this.adddirsndmenu.bind(this);
      this.clickthreeli = this.clickthreeli.bind(this);

      this.deletelink = this.deletelink.bind(this);
      this.deletelinkthird = this.deletelinkthird.bind(this);
      this.dirrenames = this.dirrenames.bind(this);
      this.linkrename = this.linkrename.bind(this);
      this.linkremove = this.linkremove.bind(this);
      this.deletedirwithlink = this.deletedirwithlink.bind(this);
 
      this.addfirstmulu = this.addfirstmulu.bind(this);

      this.onFinishdirr = this.onFinishdirr.bind(this);
      this.toggleCapacity = this.toggleCapacity.bind(this);
      this.csdonChange = this.csdonChange.bind(this);
      this.clicktopevent = this.clicktopevent.bind(this);


    }

 
  
    componentDidMount() {

      if (navigator.userAgent.indexOf('Mac OS') !== -1) {
          this.setState({
            device: "apple"
          })
      } else {
        this.setState({
            device: "window"
        })
      }

      this.menudata();
     
      this.getnm();

      
         
      var url_string = window.location.href.replace(/\/#/g,"")

      var url = new URL(url_string);
      console.log(url)
      
      var id = url.searchParams.get("id");
      let ctr = url.pathname;
      
      ctr = ctr.replace("/","");
      console.log(ctr)
      if(id){
        this.setState({
          link_id: id,
        })
      };

      if(ctr == "CapacityList"){
        this.setState({
            current: "CapacityList",
        })
      } else if(ctr == "Taslist"){
          this.setState({
            current: "Taslist",
          })
      }else if(ctr == "EventList"){
        this.setState({
          current: "EventList",
          toggleevent: true,
        })
      }else if(ctr == "EventListHand"){
        this.setState({
          current: "EventListHand",
          toggleevent: true,
        })
      }

      
      if(id && ctr == "CapacityList"){
        this.setState({
          togglevl: true,
        })
      }




    }

 
    
    handleClick = e => {
 
     
      
      console.log('click ', e);

      this.props.history.push(e);

      if(e == "Taslist"){

        this.setState({
          togglevl: false,
          toggleevent: false,
          
        })
      }
      this.setState({
        current: e,
        togglevl: false,
      })
    };

    async getnm(){
        
      let that = this;
      await axios.get("/ts:auth/tauth/info", { withCredentials: true })
          .then(function(r){
      
              document.cookie=`EngName=${r.data.EngName}`;
            
              that.setState({
                  EngName: r.data.EngName
              })

          })
          .catch(function(er){
              console.log(er)
               
          })
    }

    csdonChange(v){
       
     
      if(v.length == 1) {

        let tid = v[0];
        console.log(typeof tid);
        if(typeof tid == 'string'){
          tid = tid.replace("_", "");
        }
           
            
        this.setState({
          target_id: tid,
        })
      } else {  
        this.setState({
          target_id: v[1],
        })
      }
     
    }

    clicktopevent(){

      console.log(this.state.toggleevent);
      

       this.setState({
        toggleevent: !this.state.toggleevent,
        togglevl: false,
       })

       if(this.state.current == "CapacityList"){
         this.setState({
          current: "",
         })
       }
    }

  toggleCapacity() {
    
   
    if(this.state.toggleevent){
      this.setState({
        toggleevent: false,
      })
    }
  
    if(this.state.current == "EventList"){
      this.setState({

        togglevl: true,
        current: "CapacityList",
        toggleevent: false,
      })
    } else {
      this.setState({

        togglevl: !this.state.togglevl,
        
      })
    }
   
  }

  deletedirwithlink(v){
       
   
        this.setState({
          deldirModalVisible: true,
          auto_id: v.id,
          childlinkinfo: v.link_info,

          origindts: {
            id: v.id,
           
            cn_name: v.cn_name,
            type: v.type,
          },
        })
  }

      async asyncdeletedirwithlink (v){
        
       
              
        this.setState({
          createloading: true,
        })
              
        let url = `${APIURL}/capacityDir/delete`;

        var bodyFormData = new FormData();


        bodyFormData.append("auto_id", this.state.origindts.id);

        bodyFormData.append("type", this.state.origindts.type);

        let that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {


          if (response.data.code == 0) {

              notification.success({
                  message: '提示',
                  description: "删除成功",
                  placement: 'topCenter',
                  onClick: () => {
                    console.log('Notification Clicked!');
                  },
              });
              that.menudata()

              that.setState({
                deldirModalVisible: false,
                 
              })

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

         
        
          that.setState({
            
            createloading: false,
          })
          
      })
      .catch(function (error) {
          console.log(error);
          
      })
  }

  linkremove(v){
  

    this.setState({
      movelinkisModalVisible: true,
      move_id: v.id,
    })
    
  }
  modedirtos(v){

 

    this.setState({
      moveisModalVisible: true,
      move_id: v.id,
    })

  }



  linkrename(v){
 

    this.setState({
  
      renamelinkisModalVisible: true,
      origindts: {
        id: v.id,
       
        cn_name: v.cn_name,
        type: 1,
      },
    
    })

  }

  dirrenames(v){
   

      this.setState({
  
        renameisModalVisible: true,
        origindts: {
          id: v.id,
          
          cn_name: v.cn_name,
          type: 0,
        },
      
      })
  }

  deletelinkthird(v){
 
    
      this.setState({
        
        deldirlinkModalVisible: true,

        origindts: {
          id: v.id,
          
          cn_name: v.cn_name,
          type: v.type,
        },
      })

  }

  deletelink(v){
   
   
    this.setState({
      
      deldirlinkModalVisible: true,

      origindts: {
        id: v.id,
        
        cn_name: v.cn_name,
        type: v.type,
      },
    })

  }
    clickli(v){

       
      if(v.id == this.state.firstid){

        this.setState({
          firstid: null,
        })
        
      } else {
        this.setState({
          firstid: v.id
        })
      }
      
      
    }
 

    clicktwoli(v){
       
    

      this.setState({
        current: "CapacityList",
      })


      if(v.id == this.state.secondid) {

        this.setState({
          secondid: null,
        })
  
      } else {

        this.setState({
          secondid: v.id
        })

      }
     

       

      if(v.type == 1){
      
          this.props.history.push({
            pathname: "CapacityList",
            search: "id=" + v.id+"&type=1",
            state: v.id,
          })
          
        
      }


    }
    clickthreeli(v){
      
      this.setState({
        clickthreeliid: v.id,
      })
    
  
        if(v.type == 1){
          this.props.history.push({
            pathname: "CapacityList",
            search: "id=" + v.id+"&type=1",
            state: v.id,
          })
          
        }
    }
    secondaddlinksndmenu(v,t){
      
   
        this.setState({
          linkisModalVisible: true,
          level1_dir_id: v.id,
          level2_dir_id: t.id,
        
        })

    }




    addlinksndmenu(v){
   

        this.setState({
          linkisModalVisible: true,
        
          level1_dir_id: v.id,
          level2_dir_id: v.level1_id,
        
        })


    }

    addfirstmulu(){
     

      this.setState({
        isModalVisible: true,
        link_dir_id: null,
        level: 1,
      
      })
    }

    adddirsndmenu(v){
      
      

        this.setState({
          isModalVisible: true,
          link_dir_id: v.id,
          level: 2,
        
        })


    }
 
 
    checkchinese(v){
      
      let str = v.target.value;
      

       
      if (escape(str).indexOf( "%u" )<0){
         console.log(str)
      } else {
            document.getElementById("basic_en_name").value = "";
            notification.error({
              message: '提示',
              description: "英文名不能包含中文",
              placement: 'topCenter',
              onClick: () => {
                console.log('Notification Clicked!');
              },
          });

         


          return false;
      }

    }
    async menudata(){

      this.setState({
        menuloading: true,
      })
      const urlsx = `${APIURL}/capacityDir/getDirList`;

      let that = this;
      await axios.get(urlsx, { 
          withCredentials: true,
          params: {type: 1},
        })
        .then(function (response) {

          
            if (response.data.code == 0) {
                
                let dt = response.data.data;
                
             

                let openids = that.state.link_id;
                
                for(let m = 0; m < dt.length; m++){
                  
                  for(let n = 0; n < dt[m].two_dirs.length; n++){

                   
                    
                  

                    if(dt[m].two_dirs[n].link_info && dt[m].two_dirs[n].link_info.length >= 1  ){
                      
                     
                        for(let h = 0; h < dt[m].two_dirs[n].link_info.length; h++){
                         
                          if(openids == dt[m].two_dirs[n].link_info[h].id){
                           
                            console.log(dt[m].two_dirs[n].link_info[h])
                             that.setState({
                              clickthreeliid: openids,
                              secondid: dt[m].two_dirs[n].id,
                              firstid: dt[m].id,
                             })
                          }
                        }

                    } else {
                      if(dt[m].two_dirs[n].id == openids ) {
                        that.setState({
  
                          firstid: dt[m].id,
                          secondid: openids,
  
                        })
                      }

                    }

                  }
                }

                let caseddt = [];

                

                for(let u = 0; u < dt.length; u++){
                
                    let tmobj = {};

                    tmobj.label = dt[u].cn_name;
                    tmobj.value = dt[u].id;
                   

                    let tmarr = []

                    if(dt[u].two_dirs && dt[u].two_dirs.length >= 1){

                          for(let w = 0; w < dt[u].two_dirs.length; w++ ){

                          
                                
                                if(dt[u].two_dirs[w].type == 0) {
                                  let chidobj  = {};
                                  chidobj.label = dt[u].two_dirs[w].cn_name;
                                  chidobj.value = dt[u].two_dirs[w].id;

                                  tmarr.push(chidobj);

                                 
                                }

                                if(tmarr.length >= 1){
                                  tmobj.children = tmarr;
                                }

                          }


                      

                      
                    }

                    caseddt.push(tmobj);

                };
 

                
                that.setState({
           
                    menudt: response.data.data,
                    menuloading: null,
                    caseddtarr: caseddt,
                    
                })
            }

        })
        .catch(function (error) {
            console.log(error);
            
      })

    }
    
    onBlur(v){
      
      console.log(v)
      console.log(this.state.target_id)
    }
    bonChange(v){
    
  
      this.setState({
        target_id: v
      })
    }

  
    async capacityDirupdatelink(value){
 

      this.setState({
        createloading: true,
      })
            
        let url = `${APIURL}/capacityDir/update`;

        var bodyFormData = new FormData();

      
        bodyFormData.append("cn_name", value["cn_name"]);
        
        bodyFormData.append("type", 1);

     
        let od = this.state.origindts;

     
        bodyFormData.append("user", this.state.EngName ? this.state.EngName : "delveloper");
        bodyFormData.append("auto_id", od.id);
  

        let that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {


          if (response.data.code == 0) {

            notification.success({
                message: '提示',
                description: "重命名成功",
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
            

            that.menudata()

            that.setState({
              renamelinkisModalVisible: false,
              createloading: false,
            })
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

       

          that.setState({
            
            createloading: false,
          })
         
          
      })
      .catch(function (error) {
          console.log(error);
          
      })

    }

    async capacityDirupdate(value){
         
 
     

          this.setState({
            createloading: true,
          })
                
            let url = `${APIURL}/capacityDir/update`;

            var bodyFormData = new FormData();

          
            bodyFormData.append("cn_name", value["cn_name"]);
        
            bodyFormData.append("type", 0);

         
            let od = this.state.origindts;

         
            bodyFormData.append("user", this.state.EngName ? this.state.EngName : "delveloper");
            bodyFormData.append("auto_id", od.id);
      

            let that = this;
            await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {


              if (response.data.code == 0) {

                notification.success({
                    message: '提示',
                    description: "重命名成功",
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });
                

                that.menudata()

                that.setState({
                  renameisModalVisible: false,
                  createloading: false,
                })
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

              

              that.setState({
                
                createloading: false,
              })
             
              
          })
          .catch(function (error) {
              console.log(error);
              
          })
    }


    async movelinktodir(v){
          
            console.log(v);

              
            this.setState({
              createloading: true,
            })
                  
            let url = `${APIURL}/capacityDir/move`;

            var bodyFormData = new FormData();

            

           
            if(v.target_id.length == 1){
               
              let tid = v.target_id[0];
              console.log(typeof tid);
              if(typeof tid == 'string'){
                tid = tid.replace("_", "");
              }
              
              
              bodyFormData.append("target_id", tid);
            } else {
              bodyFormData.append("target_id", v.target_id[1]);
            }
            
            
            bodyFormData.append("move_id", this.state.move_id);
            bodyFormData.append("type", 1);

            let that = this;
            await axios.post(url, bodyFormData, { withCredentials: true })
            .then(function (response) {


              if (response.data.code == 0) {

                  notification.success({
                      message: '提示',
                      description: response.data.msg,
                      placement: 'topCenter',
                      onClick: () => {
                        console.log('Notification Clicked!');
                      },
                  });

                  that.menudata()

                that.setState({
                  movelinkisModalVisible: false,
                
                })

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

             
              that.setState({
                createloading: false,
              
              })
              
          })
          .catch(function (error) {
              console.log(error);
              
          })

    }

    async capacityDirmove(v){
        
           
         
         
          this.setState({
            createloading: true,
          })
                
          let url = `${APIURL}/capacityDir/move`;

          var bodyFormData = new FormData();

          

         

          
          bodyFormData.append("target_id", v.target_id);
          bodyFormData.append("move_id", this.state.move_id);
          bodyFormData.append("type", 0);

          let that = this;
          await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {


            if (response.data.code == 0) {

                notification.success({
                    message: '提示',
                    description: response.data.msg,
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });

                that.menudata()

              that.setState({
                moveisModalVisible: false,
               
              })

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

        
           

            that.setState({
              createloading: false,
             
            })
            
        })
        .catch(function (error) {
            console.log(error);
            
        })

        
    }

    async capacityDirdelete(v){
 
          console.log(v)
          
          this.setState({
            createloading: true,
          })
                
          let url = `${APIURL}/capacityDir/delete`;

          var bodyFormData = new FormData();
 

          bodyFormData.append("auto_id", this.state.origindts.id);

          bodyFormData.append("type", this.state.origindts.type);

          let that = this;
          await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {


            if (response.data.code == 0) {

                notification.success({
                    message: '提示',
                    description: "删除成功",
                    placement: 'topCenter',
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                });

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

          
            that.menudata()

            that.setState({
              deldirlinkModalVisible: false,
              createloading: false,
            })
            
        })
        .catch(function (error) {
            console.log(error);
            
        })


    };


    async capacityDiraddLinkInfo(value){
    
       this.setState({
        createloading: true,
       })
 
      

        
      let url = `${APIURL}/capacityDir/addLinkInfo`;

      var bodyFormData = new FormData();

     
      bodyFormData.append("cn_name", value["cn_name"]);
      
    
      bodyFormData.append("level1_dir_id", this.state.level1_dir_id);
    

      bodyFormData.append("user", this.state.EngName ? this.state.EngName : "delveloper");

     
      bodyFormData.append("level2_dir_id", this.state.level2_dir_id);
 
       
   
      let that = this;
          await axios.post(url, bodyFormData, { withCredentials: true })
          .then(function (response) {


            if (response.data.code == 0) {

              notification.success({
                  message: '提示',
                  description: "创建成功",
                  placement: 'topCenter',
                  onClick: () => {
                    console.log('Notification Clicked!');
                  },
              });

        
              that.menudata()
  
              that.setState({
                linkisModalVisible: false,
                createloading: false,
              })

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

            that.setState({
              
              createloading: false,
            })


           
            
        })
        .catch(function (error) {
            console.log(error);
            
        })
    }

    
    async capacityDircreate(value){
      
     
       this.setState({
        createloading: true,
       })
 
        
        
        let url = `${APIURL}/capacityDir/create`;

        var bodyFormData = new FormData();

       if(value["cn_name"]){
        bodyFormData.append("cn_name", value["cn_name"]);
       }
       
        

        
        
        bodyFormData.append("level", this.state.level);

       if(this.state.link_dir_id){
        bodyFormData.append("link_dir_id", this.state.link_dir_id);
       }
        
    
        bodyFormData.append("user", this.state.EngName ? this.state.EngName : "delveloper");
  
        let that = this;
        await axios.post(url, bodyFormData, { withCredentials: true })
        .then(function (response) {


          if (response.data.code == 0) {

            notification.success({
                message: '提示',
                description: "创建成功",
                placement: 'topCenter',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
            });
 
            that.menudata()
  
            that.setState({
              isModalVisible: false,
              createloading: false,
            })
 
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

        
          that.setState({
            createloading: false,
            
          })
         
           
      })
      .catch(function (error) {
          console.log(error);
          
      })
    }


  showModal = () => {
    
      this.setState({
        isModalVisible: true,
      })
  };

  handleOk = () => {
    this.setState({
      isModalVisible: false,
    })
  };

 

  cancelrenameislinkModalVisible = () => {
    this.setState({
      renamelinkisModalVisible: false,
    })
  }
 
 
 
  cancellinkisModalVisible = () => {
    this.setState({
      linkisModalVisible: false,
    })
  }


  cancelisModalVisible = () => {
    this.setState({
      isModalVisible: false,
    })
  }
  cancelrenameisModalVisible = () => {
    this.setState({
      renameisModalVisible: false,
    })
  }

  deldirisModalVisible = () => {
      this.setState({
        deldirModalVisible: false,
      })
  }

  deldirlinkisModalVisible = () => {

   
    this.setState({
      deldirlinkModalVisible: false,
    })
  }


  cancelmovelinktoisModalVisible =()=>{
    this.setState({
      movelinkisModalVisible: false,
    })

  }

  cancelmovetoisModalVisible(){
    this.setState({
      moveisModalVisible: false,
    })
  }
 
 
 
 

  onFinishdirr = (values) => {
  
        this.capacityDircreate(values)
  };



  render() {


   

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };


    

    const onFinishFailedlink = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };


    const onFinishlink = (values) => {
     
      console.log('Success:', values);
      
      this.capacityDiraddLinkInfo(values)
    };


    const onFinishdeledir = (values) => {
      console.log('Success:', values);
      
      this.capacityDirdelete(values)
    }

    const onFinishFailedrename = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };


    const onFinishFailedrenamelink = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };


    const onFinishrename = (values) => {
      console.log('Success:', values);
      
      this.capacityDirupdate(values)
    };

    const onFinishdeledirlink = (values) => {
      console.log("success", values);
      this.asyncdeletedirwithlink(values)
    }


    const onFinishrenamelink = (values) => {
      console.log('Success:', values);
      
      this.capacityDirupdatelink(values)
    };



    const onFinishmovelinkto = (values) => {
      console.log('success', values)
      this.movelinktodir(values)
    }

    const onFinishmoveto = (values) => {
      console.log('Success:', values);
    
      this.capacityDirmove(values)
    }

 


 
     
  
   



    return (
      <div  width={240}
          id="leftmenudiv"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
          className={this.state.device}
         >
        <div className="logo">
          <QqOutlined />
          
        
        </div>


 

      <li id="zerotopmn" className={this.state.toggleevent && !this.state.togglevl ? "openxs" : "closedxs" }>
          <div id="specialzero"  onClick={this.clicktopevent} >
             
              
                <div id="firsttpp">
                  {this.state.toggleevent  && this.state.current !="EventList"  ? <UpOutlined /> :  <DownOutlined /> }
                </div>

                <NotificationOutlined />
              <i className="topmenucapacity">
                运营事件
              </i>

 
            </div>

              <ul>
                  <li  onClick={()=>this.handleClick("EventList")}  className={this.state.current == "EventList" ? "secodclicked" : "nomxaz"}> 周期性事件 </li>
                  <li  onClick={()=>this.handleClick("EventListHand")} className={this.state.current == "EventListHand" ? "secodclicked" : "nomxaz"}> 临时性事件 </li>

              </ul>
         
      </li>
       

      <li  id="menusomottp"  className={this.state.togglevl && !this.state.toggleevent && this.state.current !="EventList" ? "openmn" : "closedmn" }>
        <div className="specialtpx">

          

            <div className="tipmns"   onClick={this.toggleCapacity}  >

            <div id="firsttpp">
               {this.state.togglevl  && this.state.current !="EventList"  ? <UpOutlined /> :  <DownOutlined /> }
            </div>

              <AreaChartOutlined />
              <i className="topmenucapacity">
              容量模型
              </i>

            </div>

           
            <div className="firstthreedot">
                  ...

                  <div className="btnwrapdivf">
                    <span  key="c222v" onClick={()=>this.addfirstmulu()}> 添加目录  </span>
                  </div>

            </div>
        </div>
     

        {this.state.menudt ? (
         
         <ul id="specialmnx">
             {this.state.menudt.map((one) => {
                 return (
                   <li key={one.id+"_f"}  
                   
                     className={this.state.firstid == one.id ? "clicked" : "nmor"}
                   >
                      
                      
                       
                         <div className="menuFirst" key={one.id+"f"}>  
                               
                            <i className="firsti"    onClick={()=>this.clickli(one)}>
                            {this.state.firstid == one.id ? <UpOutlined /> :  <DownOutlined /> }

                             {one.cn_name} 
                            </i>
                         <div className="threedot">...

                         
                             <div className="buttonwrapdiv">
                                <span  key="c21" onClick={()=>this.addlinksndmenu(one)}> 添加链路   </span>
                                <span  key="c222v" onClick={()=>this.adddirsndmenu(one)}> 添加目录  </span>
                                <span  key="c221" onClick={()=>this.dirrenames(one)}> 重命名  </span>
                             </div>

                             
                        
                         
                         </div>
                       </div>
                     
                       <ul> 
 
                       {one.two_dirs && one.two_dirs.length >= 1 ? (

                              one.two_dirs.map( (two, sid) => {
                                        return (
                                          <li key={two.id+"_"+two.type+"_p"}     className={this.state.secondid == two.id && this.state.current == "CapacityList" ? "secodclicked" : "normal"}
                                         
                                          >
                                            {two.type == 1 ? (

                                              
  
                                                <div className="secondlinkemenu">
                                                      {two.cn_name.length >= 8 ? (

                                                          <Tooltip title={two.cn_name}   placement="right">

                                                            <i className="secondi"   onClick={()=>this.clicktwoli(two)}>
                                                               {two.cn_name}  

                                                            </i>  
                                                          </Tooltip>

                                                      ):(
                                                        <i className="secondi"   onClick={()=>this.clicktwoli(two)}>
                                                        {two.cn_name}  

                                                        </i>  
                                                      )}

                                                   

                                                    <div className="secondthreedot">

                                                      ...

                                                      <div className="buttonwrapdivsecondmenu">
                                                           
                                                          <span  key="c221" onClick={()=> this.linkrename(two)}>
                                                              重命名  
                                                          </span>
                                                        
                                                          <span  key="c2221"  onClick={()=>this.linkremove(two)}>
                                                             移动到 
                                                          </span>
                                                          <span  key="c2221x" onClick={()=> this.deletelink(two)}>
                                                              删除 
                                                          </span>
 
                                                      </div>
                                                    </div> 
                                                </div> 



                                                
                                            ) : (
                                             
                                              
                                                    <div>

                                                  


                                                          <div className="secondtiremenu">
                                                             <i className="thirdi"    onClick={()=>this.clicktwoli(two)}>

                                                             {this.state.secondid == two.id ?  <UpOutlined /> : <DownOutlined /> }

                                                              {two.cn_name} 
                                                              </i>

                                                              <div className="secondthreedot">

                                                                  ...

                                                                  <div className="buttonwrapdivsecondmenu">
                                                                      <span  key="c21" onClick={()=>this.secondaddlinksndmenu(one,two)}> 
                                                                          添加链路 
                                                                      </span>
                                                                      
                                                                      <span  key="c221"   onClick={()=>this.dirrenames(two)}>
                                                                        重命名   
                                                                      </span>
                                                                    
                                                                      <span  key="c2221" onClick={()=>this.modedirtos(two)} >
                                                                        移动到 
                                                                      </span>
                                                                      
                                                                      <span  key="c22214" onClick={()=>this.deletedirwithlink(two)}>
                                                                        删除
                                                                      </span>
                                                                      
                                                                    </div>
                                                                </div>

                                                          </div> 


                                                                <ul>
                                                                    {two.link_info && two.link_info.length >= 1 ? (

                                                                        two.link_info.map((three)=>{
                                                                          return  <li key={three.id} className={this.state.clickthreeliid == three.id   && this.state.current == "CapacityList" ? "thiredclick" : "normalx"}>
                                                                                     <div className="thirddmnwrap">

                                                                                      {three.cn_name.length >= 8 ? (
                                                                                            <Tooltip title={three.cn_name}   placement="right">
                                                                                            <i className="thirdilink"    onClick={()=>this.clickthreeli(three)}  > {three.cn_name}</i>  
                                                                                            </Tooltip>

                                                                                      ):(

                                                                                        <i className="thirdilink"    onClick={()=>this.clickthreeli(three)}  > {three.cn_name}</i>  

                                                                                      )}

                                                                                   
                                                                                        <div className="thirddot"> ... 
                                                                                        
                                                                                            <div className="btunwrapthre"> 
                                                                                            
                                                                                            <span  key="c221"   onClick={()=> this.linkrename(three)}>
                                                                                               重命名   
                                                                                            </span>
                                                                                          
                                                                                            <span  key="cx2221"  onClick={()=>this.linkremove(three)}>
                                                                                              移动到  
                                                                                            </span>
                                                                                            <span  key="c2221" onClick={()=> this.deletelinkthird(three)}>
                                                                                                删除  
                                                                                            </span>


                                                                                            </div>
                                                                                        </div>
                                                                                        </div>
                                                                                  </li>
                                                                        })
                                                                      
                                                                    ) : ("")}

                                                                </ul>

                                                                </div>
                                              

                                            ) }

                                            

                                            </li>
                                        )
                                    }) 



                       ):("")}
 

                       </ul>
                      
                   
                   
                   </li>
                 )
             })
             
             }

         </ul>

         ):("")}

      </li>

       
      <li className={this.state.current == "Taslist" ? "zerotopmnnosub   clickedx": "zerotopmnnosub"}>
          <div className="specialzero"  onClick={()=>this.handleClick("Taslist")}>
    

                  <NotificationOutlined />
                  <i className="topmenucapacity">
                    任务管理
                  </i>

            </div>
      </li>
 
     
      

        <Modal title="添加目录" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.isModalVisible} 
          width={520}
          onCancel={this.cancelisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          
          autoComplete="off"
          onFinishFailed={onFinishFailed}
          onFinish={this.onFinishdirr}

        >
          
          <Form.Item
            label="目录名"
            name="cn_name"
            rules={[{ required: true, message: '目录名!' }]}
          >
            <Input />
          </Form.Item>

       
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.cancelisModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>





      
        <Modal title="添加链路" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.linkisModalVisible} 
          width={520}
          onCancel={this.cancellinkisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          
          autoComplete="off"
          onFinishFailed={onFinishFailedlink}
          onFinish={onFinishlink}

        >
           

          <Form.Item
            label="链路名"
            name="cn_name"
            rules={[{ required: true, message: '链路名!' }]}
          >
            <Input/>
          </Form.Item>

       
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.cancellinkisModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>


         


      
        <Modal title="重命名" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.renameisModalVisible} 
          width={520}
          onCancel={this.cancelrenameisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ cn_name:   this.state.origindts.cn_name  }}
          autoComplete="off"
          onFinishFailed={onFinishFailedrename}
          onFinish={onFinishrename}

        >
         

          <Form.Item
            label="目录名"
            name="cn_name"
            rules={[{ required: true, message: '目录名!' }]}
             
          >
            <Input/>
          </Form.Item>

       
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.cancelrenameisModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>




        <Modal title="重命名" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.renamelinkisModalVisible} 
          width={520}
          onCancel={this.cancelrenameislinkModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={ { cn_name:   this.state.origindts.cn_name  }}
          autoComplete="off"
          onFinishFailed={onFinishFailedrenamelink}
          onFinish={onFinishrenamelink}

        >
         
          <Form.Item
            label="链路名"
            name="cn_name"
            rules={[{ required: true, message: '链路名!' }]}
             
          >
            <Input/>
          </Form.Item>

       
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.cancelrenameislinkModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>



        <Modal title="删除" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.deldirlinkModalVisible} 
          width={520}
        
          onCancel={this.deldirlinkisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ cn_name:   this.state.origindts.cn_name  }}
          autoComplete="off"
          
          onFinish={onFinishdeledir}

        >
       

              <span>  确定删除  {this.state.origindts.cn_name} ?</span>
       
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.deldirlinkisModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>






        <Modal title="删除" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.deldirModalVisible} 
          width={520}
        
          onCancel={this.deldirisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{   cn_name:   this.state.origindts.cn_name  }}
          autoComplete="off"
          
          onFinish={onFinishdeledirlink}

        >
       

              <span>  确定删除  {this.state.origindts.cn_name} ?</span>
          
              <span>

                  {this.state.childlinkinfo && this.state.childlinkinfo.length >= 1 ? (
                    <span> 该目录下有 {this.state.childlinkinfo.length } 条链路</span>
                  ): ("")}

              </span>
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.deldirisModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>






        <Modal title="移动到" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.moveisModalVisible} 
          width={520}
        
          onCancel={this.cancelmovetoisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{   cn_name:   this.state.origindts.cn_name  }}
          autoComplete="off"
          
          onFinish={onFinishmoveto}

        >
       
       <Form.Item
            label="移动到"
            name="target_id"
            rules={[{ required: true, message: '链路英文名！ ' }]}
            
          >
          
         
                  
                <Select
                  showSearch
               
                  placeholder="请选择要移动的目录"
                
                  onChange={this.bonChange}
                  onBlur={this.onBlur}
                
                >
                        {this.state.menudt && this.state.menudt.length >=1 ? (

                              this.state.menudt.map(function(i,ind){
                                return (

                                  <Option value={i.id} key={i.id}> {i.cn_name} </Option>
                                )
                              })

                        ): ("")}
                
                  
                 
            </Select>
       
            </Form.Item>
        
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.cancelmovetoisModalVisible}>
                取消
              </Button>
          </div>
        </Form.Item>
        </Form>

        </Modal>

          
          


      


        <Modal title="移动到" 
          footer={null}
          maskClosable={false}
          destroyOnClose	
          visible={this.state.movelinkisModalVisible} 
          width={520}
        
          onCancel={this.cancelmovelinktoisModalVisible}>
          
         {this.state.createloading ? (
           <div className="minieditspindx">  <Spin indicator={antIcon} />  </div>
         ): ("")}

        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{   cn_name:   this.state.origindts.cn_name  }}
          autoComplete="off"
          
          onFinish={onFinishmovelinkto}

        >
       
       <Form.Item
            label="移动到"
            name="target_id"
           
          >
          
         
 
                   
                {this.state.caseddtarr ? (


                <Cascader options={this.state.caseddtarr} onChange={this.csdonChange} changeOnSelect  placeholder="Please select" />



                ):("")}  
 
            </Form.Item>
        
         <Form.Item  {...tailLayout} >
          <div id="btnright">
              <Button type="primary" htmlType="submit" disabled={this.state.createloading ? true : false} >
                提交
              </Button>
              <Button htmlType="button" onClick={this.cancelmovelinktoisModalVisible}>
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


export default withRouter(Sidediv);