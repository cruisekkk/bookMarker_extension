import React, { useState, useEffect } from "react";
import { FormOutlined } from "@ant-design/icons";
import { Tree } from "antd";

function BookTree({ bookList }) {
  const [gData, setGData] = useState([]);

  useEffect(() => {
    console.log(bookList);
    setGData(
      bookList.map((item, index) => {
        return {
          key: index,
          icon: <FormOutlined />,
          title: item.group_title,
          children: item.children.map((citem, cindex) => {
            return {
              key: `${index}_${cindex}`,
              icon: <img height="14px" width="14px" src={citem.favIconURL} />,
              url: citem.url,
              title: <a>{citem.title}</a>,
            };
          }),
        };
      })
    );
  }, [bookList]);

  const onSelect = (keys, e) => {
    let index = keys[0].split("_");
    chrome.runtime.sendMessage({
      message: {
        type: "create_tab",
        url: gData[index[0]].children[index[1]].url,
      },
    });
  };

  return (
    <Tree
      className="draggable-tree"
      blockNode
      onSelect={onSelect}
      showIcon={true}
      treeData={gData}
    />
  );
}

export default BookTree;
