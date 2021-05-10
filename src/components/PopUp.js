import React, { useState, useEffect } from "react";

import { Button, Divider, Row, Col, Spin, message, Typography } from "antd";
import BookTree from "./BookTree";
import EditTree from "./EditTree";
import Config from "./Config";
import MarkAsModal from "./MarkAsModal";
import {
  StarOutlined,
  EditOutlined,
  SettingOutlined,
  StarFilled,
  HeartFilled,
  FolderFilled,
  FolderAddFilled,
  HeartOutlined,
  FolderOutlined,
  HeartTwoTone,
  FolderTwoTone,
} from "@ant-design/icons";
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
      }
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
    <div className={styles.frame}>
      <Row justify="center" className={styles.header}>
        <Col span={21}>
          <div className={styles.marker}><p>Just Marker</p></div>
          <FolderAddFilled onClick={() => showModal()} className={styles.button} />
          <HeartFilled
            onClick={quickMark}
            className={styles.button}
          />
          <MarkAsModal
            title="Mark this tab as ..."
            visible={visible}
            setVisible={setVisible}
            bookList={bookList}
            setIsLoading={setIsLoading}
          ></MarkAsModal>
          {/* <p style={{ width: "150px" }}>Quick Mark</p> */}
          {/* </Button> */}
        </Col>
      </Row>
      {/* <Row justify="center">
        <Col span={12}>
          <Button
            type="text"
            onClick={() => showModal()}
            className={styles.button}
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
      </Row> */}
      {/* <Row justify="center" className={styles.sideBar}> */}
      <div className={styles.sideBar}>
        <div className={styles.viewTabWrapper} onClick={() => setTab("star")} >
            <StarFilled
              className={styles.viewTabIcon}
            />
            </div>
        <div className={styles.unViewTabWrapper} onClick={() => setTab("edit")}>
            <EditOutlined
              className={styles.unViewTabIcon}
            />
            </div>
        <div className={styles.unViewTabWrapper} onClick={() => setTab("setting")}>
            <SettingOutlined
              className={styles.unViewTabIcon}
            />
            </div>
      </div>
      {/* </Row> */}
      <Spin tip="Loading..." spinning={isLoading} delay={200}>
        {tab === "star" && (
          <BookTree bookList={bookList} setIsLoading={setIsLoading} />
        )}
        {tab === "edit" && (
          <EditTree
            bookList={bookList}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {tab === "setting" && <Config />}
      </Spin>
    </div>
  );
}

export default PopUp;
