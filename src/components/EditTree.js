import React, { useState, useEffect, useRef } from "react";
import {
  FormOutlined,
  DeleteTwoTone,
  EditTwoTone,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { Tree, Input } from "antd";
import { Button, Divider, Row, Col, Spin, message, Typography } from "antd";

const { Paragraph, Text } = Typography;

function editTree({ bookList, isLoading, setIsLoading }) {
  const [sData, setSData] = useState([]);
  const [groupEdit, setGroupEdit] = useState(-1);
  const inputRef = useRef('');

  useEffect(() => {}, []);

  useEffect(() => {
    setSData(
      bookList.map((item, index) => {
        return {
          key: index,
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
  }, [bookList, groupEdit]);

  const generateGroup = (index, item) => {
    return (
      <>
        <FormOutlined
          style={{
            margin: "4px",
            float: "left",
          }}
        />
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
          onClick={() => deleteGroup(index)}
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
        <FormOutlined
          style={{
            margin: "4px",
            float: "left",
          }}
        />
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
    console.log("delete it!");
    setIsLoading(true);
    chrome.runtime.sendMessage({
      message: {
        type: "deleteItem",
        index: index,
        cindex: cindex,
      },
    });
  };

  const deleteGroup = (index) => {};

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

  const onDragEnter = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...sData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
  };
  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      showIcon={true}
      treeData={sData}
    />
  );
}

export default editTree;
