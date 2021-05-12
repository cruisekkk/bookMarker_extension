import React, { useState, useEffect, useRef } from "react";
import {
  DeleteTwoTone,
  EditTwoTone,
  CheckCircleTwoTone,
  HeartFilled,
  FolderFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Tree, Input } from "antd";
import { Typography, Modal } from "antd";
import styles from "../styles/editTree.module.scss";

const { Paragraph } = Typography;

function editTree({ bookList, setIsLoading, theme }) {
  const [sData, setSData] = useState([]);
  // const [expandedKeys, setExpandedKeys] = useState([]);
  const [groupEdit, setGroupEdit] = useState(-1);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [groupDelete, setGroupDelete] = useState(-1);
  const inputRef = useRef("");

  let keys;

  // useEffect(() => {
  //   setExpandedKeys(keys);
  // }, [sData]);

  useEffect(() => {
    keys = [];
    setSData(
      bookList.map((item, index) => {
        keys.push(`${index}`);
        return {
          key: `${index}`,
          icon:
            index === 0 ? (
              <HeartFilled className={styles[theme]} />
            ) : (
              <FolderFilled className={styles[theme]} />
            ),
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
                    style={{ marginBottom: "0px" }}
                    className={styles.editContentFont}
                  >
                    <img
                      height="14px"
                      width="14px"
                      style={{ margin: "3px" }}
                      src={citem.favIconURL}
                    />
                    {citem.title}
                  </Paragraph>
                  <DeleteTwoTone
                    onClick={() => deleteItem(index, cindex)}
                    className={styles.editIcon}
                    twoToneColor="red"
                  />
                </>
              ),
            };
          }),
        };
      })
    );
    // setExpandedKeys(keys);
  }, [bookList, groupEdit, groupDelete]);

  const generateGroup = (index, item) => {
    return (
      <>
        <Paragraph
          className={styles.editFolderFont}
          style={{ marginBottom: "0px" }}
          strong={true}
        >
          {item.group_title}
        </Paragraph>
        <DeleteTwoTone
          onClick={() => confirmDeleteGroup(index)}
          className={styles.editIcon}
          twoToneColor="red"
        />
        <EditTwoTone
          onClick={(e) => {
            setGroupEdit(index);
            inputRef.current = item.group_title;
          }}
          className={styles.editIcon}
          style={{ marginRight: "6px" }}
        />
      </>
    );
  };

  const generateGroupEdit = (index, item) => {
    return (
      <>
        <Paragraph
          className={styles.editFolderFont}
          style={{ marginBottom: "0px" }}
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
          className={styles.editIcon}
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
    chrome.runtime.sendMessage({
      message: {
        type: "addGroup",
        name: "new Group",
      },
    });
  };

  const onDrop = (info) => {
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
          if (
            key_arr &&
            ((key_arr.length === 1 && obj.dropPosition === 0) ||
              (key_arr.length === 2 && obj.dropPosition === 1))
          ) {
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
      <div className={styles.wrap + "_" + theme}>
        <PlusOutlined className={styles.add} onClick={addGroup} />
      </div>
    </>
  );
}

export default editTree;
