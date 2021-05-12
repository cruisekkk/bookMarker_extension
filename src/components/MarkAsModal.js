import React, { useState, useEffect } from "react";

import { Modal, Select } from "antd";

const { Option } = Select;

function markAsModal({ bookList, title, visible, setVisible, setIsLoading }) {
  const [category, setCategory] = useState(null);

  function onChange(value, opt) {
    setCategory(opt.key);
  }

  const markAs = async (index) => {
    setIsLoading(true);
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    let tab = await getCurrentTab();
    chrome.runtime.sendMessage({
      message: {
        type: "mark_as",
        index: index,
        title: tab.title,
        url: tab.url,
        favIconURL: tab.favIconUrl,
      },
    });
    setCategory(null);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={() => {
        setVisible(false);
        markAs(category);
      }}
      // confirmLoading={confirmLoading}
      onCancel={() => setVisible(false)}
      destroyOnClose={true}
    >
      <Select
        showSearch
        allowClear={true}
        style={{ width: 200 }}
        placeholder="Select a category"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {/* <Option value="jack">Jack</Option> */}
        {bookList.map((item, index) => {
          return (
            <Option value={item.group_title} key={index}>
              {item.group_title}
            </Option>
          );
        })}
      </Select>
    </Modal>
  );
}

export default markAsModal;
