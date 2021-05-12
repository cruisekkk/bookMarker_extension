import React, { useState, useEffect } from "react";

import { Row, Col, Spin, message } from "antd";
import BookTree from "./BookTree";
import EditTree from "./EditTree";
import Config from "./Config";
import MarkAsModal from "./MarkAsModal";
import {
  StarOutlined,
  EditOutlined,
  SettingOutlined,
  StarFilled,
  EditFilled,
  SettingFilled,
  HeartFilled,
  FolderAddFilled,
} from "@ant-design/icons";
import styles from "../styles/popUp.module.scss";

function PopUp() {
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("star");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    getTheme();
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

  const getTheme = () => {
    chrome.storage.sync.get("theme", (value) => {
      setTheme(value.theme);
    });
  };

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
    let tab = await getCurrentTab();
    chrome.runtime.sendMessage({
      message: {
        test: "1",
        type: "quick_mark",
        title: tab.title,
        url: tab.url,
        favIconURL: tab.favIconUrl,
      },
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  return (
    <div className={styles.frame}>
      <Row
        justify="center"
        className={styles.header + " " + styles["bg_" + theme]}
      >
        <Col span={21}>
          <div className={styles.marker}>
            <p>Just Marker</p>
          </div>
          <FolderAddFilled
            onClick={() => showModal()}
            className={styles.button}
          />
          <HeartFilled onClick={quickMark} className={styles.button} />
          <MarkAsModal
            title="Mark this tab as ..."
            visible={visible}
            setVisible={setVisible}
            bookList={bookList}
            setIsLoading={setIsLoading}
          ></MarkAsModal>
        </Col>
      </Row>
      <div className={styles.sideBar}>
        <div
          className={
            tab === "star" ? styles.viewTabWrapper : styles.unViewTabWrapper
          }
          onClick={() => setTab("star")}
        >
          {tab === "star" ? (
            <StarFilled className={styles.viewTabIcon + " " + styles[theme]} />
          ) : (
            <StarOutlined className={styles.unViewTabIcon} />
          )}
        </div>
        <div
          className={
            tab === "edit" ? styles.viewTabWrapper : styles.unViewTabWrapper
          }
          onClick={() => setTab("edit")}
        >
          {tab === "edit" ? (
            <EditFilled className={styles.viewTabIcon + " " + styles[theme]} />
          ) : (
            <EditOutlined className={styles.unViewTabIcon} />
          )}
        </div>
        <div
          className={
            tab === "setting" ? styles.viewTabWrapper : styles.unViewTabWrapper
          }
          onClick={() => setTab("setting")}
        >
          {tab === "setting" ? (
            <SettingFilled
              className={styles.viewTabIcon + " " + styles[theme]}
            />
          ) : (
            <SettingOutlined className={styles.unViewTabIcon} />
          )}
        </div>
      </div>
      <Spin tip="Loading..." spinning={isLoading} delay={200}>
        {tab === "star" && (
          <BookTree
            bookList={bookList}
            setIsLoading={setIsLoading}
            theme={theme}
          />
        )}
        {tab === "edit" && (
          <EditTree
            bookList={bookList}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            theme={theme}
          />
        )}
        {tab === "setting" && <Config setTheme={setTheme} />}
      </Spin>
    </div>
  );
}

export default PopUp;
