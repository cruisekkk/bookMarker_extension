import React, { useState, useEffect } from "react";
import { FormOutlined, HeartOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import { Button, Divider, Row, Col, Spin, message, Typography } from "antd";
const { Paragraph, Text } = Typography;

function BookTree({ bookList }) {
  const [gData, setGData] = useState([]);

  useEffect(() => {
    console.log(bookList);
    setGData(
      bookList.map((item, index) => {
        return {
          key: index,
          icon: index === 0 ? <HeartOutlined /> : <FormOutlined />,
          title: item.group_title,
          children: item.children.map((citem, cindex) => {
            return {
              key: `${index}_${cindex}`,
              icon: null,
              url: citem.url,
              title: (
                <>
                  <Paragraph
                    ellipsis={true}
                    style={{ marginBottom: "0px", maxWidth: "235px" }}
                  >
                    <img height="14px" width="14px" src={citem.favIconURL} />
                    <a>{citem.title}</a>
                  </Paragraph>
                </>
              ),
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
