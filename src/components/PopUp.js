import React, {useState, useEffect} from 'react';

import { Button, Divider, Row, Col, Spin, message } from 'antd';
import BookTree from "./BookTree";
import MarkAsModal from "./MarkAsModal";
import { CarryOutOutlined, FormOutlined } from "@ant-design/icons";

function PopUp() {
  const [gData, setGData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(()=> {
    getBookList();
    function listener(request, sender, sendResponse) {
      if (request.message.Action === "set") {
        if (request.message.isChanged === false){
          console.log("not changed")
          message.warning("You have bookmarked this site");
        }
        setIsLoading(false);
      }
    }
    chrome.runtime.onMessage.addListener(listener);
  }, [])
  useEffect(()=> {
    if (!isLoading){
      getBookList()
    }
  }, [isLoading])
  const getBookList = () => {
    chrome.storage.sync.get("bookList", Obj => {
      let list = Obj.bookList;
      console.log(list);
      setGData(list.map((item, index) => {
        // console.log(item);
        return {
          key: index,
          icon: <FormOutlined />,
          title: item.group_title,
          children: item.children.map((citem, cindex) => {
              return {
                key : `${index}_${cindex}`,
                icon: <CarryOutOutlined />,
                title: <a href={citem.url} target="_blank">{citem.title}</a>,
              }
            })
        }
      }));
    })
  }

  const quickMark = async () => {
    setIsLoading(true);
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    console.log("quick_mark");
    let tab = await getCurrentTab();
    chrome.runtime.sendMessage({
      message: {
        test: "1",
        type: "quick_mark",
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl
      },
    }, response => {
        console.log(response);
    })
  }

  const showModal = () => {
    setVisible(true);
  }

  return (
    <div style={{width: "300px", marginTop: "10px"}}>
      <Row justify="center" >
        <Col span={12}>
          <Button type="primary" onClick={quickMark} style={{paddingRight: "0px", paddingLeft: "0px", marginBottom: "10px"}}><p style={{width: "150px"}}>Quick Mark</p></Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Button type="primary" onClick={() => showModal()} style={{paddingRight: "0px", paddingLeft: "0px"}}><p style={{width: "150px"}}>Mark Tab as</p></Button>
          <MarkAsModal
            title="Mark this tab as ..."
            visible={visible}
            setVisible={setVisible}
            gData={gData}
            setIsLoading={setIsLoading}
          >
          </MarkAsModal>
        </Col>
      </Row>
      <Divider plain></Divider>
      <Spin tip="Loading..." spinning={isLoading} delay={500}>
       <BookTree gData={gData}/> 
      </Spin>
      
    </div>
  )
}

export default PopUp;
