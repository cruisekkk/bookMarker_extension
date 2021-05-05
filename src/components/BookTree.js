import React, { useState, useEffect } from "react";

import { Tree } from "antd";
import { CarryOutOutlined, FormOutlined } from "@ant-design/icons";

function BookTree(props) {
  const [gData, setGData] = useState([]);
  useEffect(() => {
    chrome.storage.sync.get("bookList", Obj => {
      let list = Obj.bookList;
      console.log(list);
      setGData(list.map((item, index) => {
        console.log(item);
        return {
          key: index,
          icon: <FormOutlined />,
          title: <a>{item.group_title}</a>,
          children: item.children.map((citem, cindex) => {
              return {
                key : `${index}_${cindex}`,
                icon: <CarryOutOutlined />,
                title: <a href={citem.url}>{citem.title}</a>,
              }
            })
          
        }
      }));
    })
  }, [])

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
    const data = [...gData];

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
      treeData={gData}
    />
  );
}

export default BookTree;
