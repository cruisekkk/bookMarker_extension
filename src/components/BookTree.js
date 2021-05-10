import React, { useState, useEffect } from "react";
import { FormOutlined, HeartOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import { Button, Divider, Row, Col, Spin, message, Typography } from "antd";
const { Paragraph, Text } = Typography;
import styles from "../styles/editTree.module.css";

function BookTree({ bookList, setIsLoading }) {
  const [gData, setGData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    console.log(bookList);
    let keys = [];
    setGData(
      bookList.map((item, index) => {
        keys.push(`${index}`);
        return {
          key: `${index}`,
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
    setExpandedKeys(keys);
  }, [bookList]);

  useEffect(() => setInitLoading(false), [expandedKeys]);

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
    <>
      {!expandedKeys.length ? (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      ) : (
        <Tree
          className={styles.tree}
          blockNode
          // autoExpandParent={expand}
          defaultExpandedKeys={expandedKeys}
          onSelect={onSelect}
          showIcon={true}
          treeData={gData}
        />
      )}
    </>
  );
}

export default BookTree;
