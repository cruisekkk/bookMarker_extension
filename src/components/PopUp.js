import React from 'react';

import { Button, Divider } from 'antd';
import BookTree from "./BookTree";
import { changeConfirmLocale } from 'antd/lib/modal/locale';

function PopUp() {
  const quickMark = async () => {
    // console.log("quick_mark");
    // console.log(chrome.tabs);
    // console.log(chrome.tabs.title);
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }
    let tab = await getCurrentTab();
    chrome.runtime.sendMessage({
      message: {
        test: "1",
        type: "quick_mark",
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl
      },
    })
  }

  return (
    <div>
      <Button type="primary" onClick={quickMark}>Quick Mark</Button>
      <br/>
      <Button type="primary">Mark this Tab as</Button>
      <Divider plain></Divider>
      <BookTree />
    </div>
  )
}

export default PopUp;
