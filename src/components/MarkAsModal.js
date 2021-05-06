import React, {useState, useEffect} from 'react';

import { Button, Divider, Row, Col, Spin, message, Modal, Select } from 'antd';

const { Option } = Select;

function markAsModal({gData, title, visible, setVisible, setIsLoading}) {
  const [category, setCategory] = useState(null);

  function onChange(value, opt) {
    console.log(`selected ${value}`);
    console.log(opt);
    setCategory(opt.key);
  }

  const markAs = async (index) => {
    setIsLoading(true);
    console.log("mark as index:" + index);
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    // console.log("mark_as");
    let tab = await getCurrentTab();
    chrome.runtime.sendMessage({
      message: {
        type: "mark_as",
        index: index,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl
      },
    })
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={()=> {
        setVisible(false);
        markAs(category);
      }}
      // confirmLoading={confirmLoading}
      onCancel={()=> setVisible(false)}
    >
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a category"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {/* <Option value="jack">Jack</Option> */}
        {gData.map(item => {
          return <Option value={item.title} key={item.key}>{item.title}</Option>
        })}
        
      </Select>
    </Modal>
  )
}

export default markAsModal;