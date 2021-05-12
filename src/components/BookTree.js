import React, { useState, useEffect } from "react";
import { FolderFilled, HeartFilled } from "@ant-design/icons";
import { Tree } from "antd";
import { Spin, Typography, Tooltip } from "antd";
const { Paragraph } = Typography;
import styles from "../styles/editTree.module.scss";

function BookTree({ bookList, setIsLoading, theme }) {
  const [gData, setGData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  useEffect(() => {
    let keys = [];
    setGData(
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
          title: (
            <Paragraph
              className={styles.folderFont}
              style={{ marginBottom: "0px" }}
              strong={true}
            >
              {item.group_title}
            </Paragraph>
          ),
          children: item.children.map((citem, cindex) => {
            return {
              key: `${index}_${cindex}`,
              icon: null,
              url: citem.url,
              title: (
                <>
                  <Tooltip
                    placement="topLeft"
                    title={citem.title}
                    color="#4f555d"
                    mouseEnterDelay={0.8}
                  >
                    <Paragraph
                      ellipsis={true}
                      className={styles.contentFont}
                      style={{ marginBottom: "0px" }}
                    >
                      <img
                        height="14px"
                        width="14px"
                        style={{ margin: "3px" }}
                        src={citem.favIconURL}
                      />
                      {citem.title}
                    </Paragraph>
                  </Tooltip>
                </>
              ),
            };
          }),
        };
      })
    );
    setExpandedKeys(keys);
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
    <>
      {!expandedKeys.length ? (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      ) : (
        <Tree
          className={styles.tree}
          blockNode
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
