import React, { useState, useEffect, useRef } from "react";
import {
  FormOutlined,
  DeleteTwoTone,
  EditTwoTone,
  CheckCircleTwoTone,
  HeartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Tree, Input } from "antd";
import {
  Button,
  Divider,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Modal,
} from "antd";
import styles from "../styles/editTree.module.css";

const { Paragraph, Text } = Typography;

function editTree({ bookList, setIsLoading }) {
  const [sData, setSData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [groupEdit, setGroupEdit] = useState(-1);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupDelete, setGroupDelete] = useState(-1);
  const inputRef = useRef("");
  let keys;
  useEffect(() => {
    setExpandedKeys(keys);
  }, [sData]);
  useEffect(() => {
    keys = [];
    setSData(
      bookList.map((item, index) => {
        keys.push(`${index}`);
        return {
          key: `${index}`,
          icon: null,
          title:
            groupEdit >= 0 && index === groupEdit
              ? generateGroupEdit(index, item)
              : generateGroup(index, item),
          children: item.children.map((citem, cindex) => {
            return {
              key: `${index}_${cindex}`,
              icon: null,
              url: citem.url,
              title: (
                <>
                  <Paragraph
                    ellipsis={true}
                    style={{
                      marginBottom: "0px",
                      float: "left",
                      maxWidth: "215px",
                    }}
                  >
                    <img height="14px" width="14px" src={citem.favIconURL} />
                    <a>{citem.title}</a>
                  </Paragraph>
                  <DeleteTwoTone
                    onClick={() => deleteItem(index, cindex)}
                    style={{
                      float: "right",
                      fontSize: "16px",
                      marginRight: "12px",
                      paddingTop: "4px",
                      color: "red",
                    }}
                  />
                </>
              ),
            };
          }),
        };
      })
    );
    console.log(keys);
    setExpandedKeys(keys);
  }, [bookList, groupEdit, groupDelete]);

  const generateGroup = (index, item) => {
    return (
      <>
        {index === 0 ? (
          <HeartOutlined
            style={{
              margin: "4px",
              float: "left",
            }}
          />
        ) : (
          <FormOutlined
            style={{
              margin: "4px",
              float: "left",
            }}
          />
        )}
        <Paragraph
          ellipsis={true}
          style={{
            marginBottom: "0px",
            float: "left",
            maxWidth: "185px",
          }}
        >
          {item.group_title}
        </Paragraph>
        <DeleteTwoTone
          onClick={() => confirmDeleteGroup(index)}
          style={{
            float: "right",
            fontSize: "16px",
            marginRight: "12px",
            paddingTop: "4px",
          }}
        />
        <EditTwoTone
          onClick={(e) => {
            setGroupEdit(index);
          }}
          style={{
            float: "right",
            fontSize: "16px",
            marginRight: "6px",
            paddingTop: "4px",
            color: "red",
          }}
        />
      </>
    );
  };

  const generateGroupEdit = (index, item) => {
    return (
      <>
        {index === 0 ? (
          <HeartOutlined
            style={{
              margin: "4px",
              float: "left",
            }}
          />
        ) : (
          <FormOutlined
            style={{
              margin: "4px",
              float: "left",
            }}
          />
        )}

        <Paragraph
          ellipsis={true}
          style={{
            marginBottom: "0px",
            float: "left",
            maxWidth: "185px",
          }}
        >
          <Input
            defaultValue={item.group_title}
            ref={(input) => {
              if (input) input.focus();
              return inputRef;
            }}
            style={{ padding: "0px" }}
            onChange={(e) => {
              let v = e.target.value;
              inputRef.current = e.target.value;
            }}
          />
        </Paragraph>
        <CheckCircleTwoTone
          onClick={() => groupRename(index, item)}
          style={{
            float: "right",
            fontSize: "16px",
            marginRight: "12px",
            paddingTop: "4px",
            color: "red",
          }}
        />
      </>
    );
  };

  const deleteItem = (index, cindex) => {
    setIsLoading(true);
    chrome.runtime.sendMessage({
      message: {
        type: "deleteItem",
        index: index,
        cindex: cindex,
      },
    });
  };

  const confirmDeleteGroup = (index) => {
    setIsDeleteModalVisible(true);
    setGroupDelete(index);
  };

  const deleteGroup = () => {
    if (groupDelete !== 0) {
      setIsLoading(true);
      chrome.runtime.sendMessage({
        message: {
          type: "deleteGroup",
          index: groupDelete,
        },
      });
    }
  };

  const groupRename = (index, item) => {
    setGroupEdit(-1);
    setIsLoading(true);
    chrome.runtime.sendMessage({
      message: {
        type: "renameGroup",
        index: index,
        name: inputRef.current,
      },
    });
  };

  const addGroup = () => {
    setIsLoading(true);
    console.log("addGroup");
    chrome.runtime.sendMessage({
      message: {
        type: "addGroup",
        name: "new Group",
      },
    });
  };

  const onDragStart = (info) => {
    console.log(info);
  };

  const onDrop = (info) => {
    console.log(info);
    setIsLoading(true);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    chrome.runtime.sendMessage({
      message: {
        type: "dragAndDrop",
        dropKey,
        dragKey,
      },
    });
  };

  return (
    <>
      <Modal
        title="Delete group"
        visible={isDeleteModalVisible}
        onOk={() => {
          deleteGroup();
          setIsDeleteModalVisible(false);
        }}
        onCancel={() => {
          setIsDeleteModalVisible(false);
        }}
      >
        <p>Are you sure you want to delete this group?</p>
      </Modal>
      <Tree
        className={"draggable-tree " + styles.tree}
        allowDrop={(obj) => {
          let key_arr = obj.dropNode.key.split("_");
          if (key_arr && ((key_arr.length === 1 && obj.dropPosition === 0) || (key_arr.length === 2 && obj.dropPosition === 1))) {
            return true;
          }
          return false;
        }}
        draggable
        blockNode
        onDrop={onDrop}
        showIcon={true}
        treeData={sData}
      />
      <div className={styles.wrap}>
        <PlusOutlined className={styles.add} onClick={addGroup} />
      </div>
    </>
  );
}

export default editTree;
