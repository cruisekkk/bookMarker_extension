import React, { useState, useEffect } from "react";

import { Button, Divider, Row, Col, Spin, message, Typography } from "antd";
import BookTree from "./BookTree";
import EditTree from "./EditTree";
import Config from "./Config";
import MarkAsModal from "./MarkAsModal";
import { StarOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import styles from "../styles/popUp.module.css";

function PopUp() {
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("star");

  useEffect(() => {
    getBookList();
    function listener(request, sender, sendResponse) {
      if (request.message.Action === "set") {
        if (request.message.isChanged === false) {
          message.warning("You have bookmarked this site");
        }
        setIsLoading(false);
      }
    }
    chrome.runtime.onMessage.addListener(listener);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      getBookList();
    }
  }, [isLoading]);

  const getBookList = () => {
    chrome.storage.sync.get("bookList", (Obj) => {
      setBookList(Obj.bookList);
    });
  };

  const quickMark = async () => {
    setIsLoading(true);
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    console.log("quick_mark");
    let tab = await getCurrentTab();
    console.log("get tab");
    chrome.runtime.sendMessage(
      {
        message: {
          test: "1",
          type: "quick_mark",
          title: tab.title,
          url: tab.url,
          favIconURL: tab.favIconUrl,
        },
      },
      // (response) => {
      //   if (chrome.runtime.lastError) {
      //     console.warn("Warning: " + chrome.runtime.lastError.message);
      //   } else {
      //     console.log(response);
      //   }
      // }
    );
  };

  const showModal = () => {
    setVisible(true);
  };

  return (
    <div style={{ width: "300px", marginTop: "10px" }}>
      <Row justify="center">
        <Col span={12}>
          <Button
            type="primary"
            onClick={quickMark}
            style={{
              paddingRight: "0px",
              paddingLeft: "0px",
              marginBottom: "10px",
            }}
          >
            <p style={{ width: "150px" }}>Quick Mark</p>
          </Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => showModal()}
            style={{ paddingRight: "0px", paddingLeft: "0px" }}
          >
            <p style={{ width: "150px" }}>Mark Tab as</p>
          </Button>
          <MarkAsModal
            title="Mark this tab as ..."
            visible={visible}
            setVisible={setVisible}
            bookList={bookList}
            setIsLoading={setIsLoading}
          ></MarkAsModal>
        </Col>
      </Row>
      <Divider plain style={{ margin: "12px" }}></Divider>
      <Row justify="center" style={{ marginBottom: "12px" }}>
        <Col span={6} className={styles.tab} onClick={() => setTab("star")}>
          <div className={styles.wrap}>
            {" "}
            <StarOutlined
              style={{
                fontSize: "30px",
                position: "relative",
                left: "37px",
                top: "2px",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </Col>
        <Col span={6} className={styles.tab} onClick={() => setTab("edit")}>
          <div className={styles.wrap}>
            <EditOutlined
              style={{
                fontSize: "30px",
                position: "relative",
                left: "38px",
                top: "2px",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </Col>
        <Col span={6} className={styles.tab} onClick={() => setTab("setting")}>
          <div className={styles.wrap}>
            <SettingOutlined
              style={{
                fontSize: "30px",
                position: "relative",
                left: "37px",
                top: "2px",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </Col>
      </Row>
      <Spin tip="Loading..." spinning={isLoading} delay={500}>
        {tab === "star" && <BookTree bookList={bookList} />}
        {tab === "edit" && <EditTree bookList={bookList} isLoading={isLoading} setIsLoading={setIsLoading}/>}
        {tab === "setting" && <Config />}
      </Spin>
    </div>
  );
}

export default PopUp;
