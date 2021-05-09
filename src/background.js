let bookList = [
  {
    group_title: "unClassified",
    children: [{ title: "test", url: "www.baidu.com" }],
  },
  {
    group_title: "收藏系列1: webpack",
    children: [{ title: "如何从0搭建webpack5", url: "www.baidu.com" }],
  },
  {
    group_title: "收藏系列2: JS",
    children: [{ title: "JS GC机制", url: "www.baidu.com" }],
  },
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ bookList });
  console.log(`Default background bookList set to bookList: ${bookList}`);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("listened!!");
  console.log(request);
  let type = request ? (request.message ? request.message.type : null) : null;
  switch (type) {
    case "quick_mark":
      console.log("received111");
      // sendResponse("received");
      console.log(request.message);
      chrome.storage.sync.get("bookList", (Obj) => {
        let isChanged = false;
        let list = Obj.bookList;
        list.forEach((item, index) => {
          if (item.group_title === list[0].group_title) {
            let indexOf = getURLIndex(
              list[index].children,
              request.message.url
            );
            if (indexOf === -1) {
              list[index].children.push({
                title: request.message.title,
                url: request.message.url,
                favIconURL: request.message.favIconURL,
              });
              isChanged = true;
            }
          }
        });
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({ message: { Action: "set", isChanged } });
        });
      });
      break;
    case "mark_as":
      chrome.storage.sync.get("bookList", (Obj) => {
        let isChanged = false;
        let list = Obj.bookList;
        let indexOf = getURLIndex(
          list[request.message.index].children,
          request.message.url
        );
        if (indexOf === -1) {
          list[request.message.index].children.push({
            title: request.message.title,
            url: request.message.url,
            favIconURL: request.message.favIconURL,
          });
          isChanged = true;
        }
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({ message: { Action: "set", isChanged } });
        });
      });
      break;
    case "create_tab":
      chrome.tabs.create({
        url: request.message.url,
      });
      break;

    case "deleteItem":
      chrome.storage.sync.get("bookList", (Obj) => {
        let list = Obj.bookList;
        list[request.message.index].children.splice(request.message.cindex, 1);
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({
            message: { Action: "set", isChanged: true },
          });
        });
      });
      break;
    case "renameGroup": 
      chrome.storage.sync.get("bookList", (Obj) => {
        let list = Obj.bookList;
        list[request.message.index].group_title = request.message.name;
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({
            message: { Action: "set", isChanged: true },
          });
        });
      });
      break;
    case "deleteGroup": 
      chrome.storage.sync.get("bookList", (Obj) => {
        let list = Obj.bookList;
        list.splice(request.message.index,1);
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({
            message: { Action: "set", isChanged: true },
          });
        });
      });
      break;
    case "addGroup":
      chrome.storage.sync.get("bookList", (Obj) => {
        let list = Obj.bookList;
        list.push({
          group_title: request.message.name,
          children: [],
        });
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({
            message: { Action: "set", isChanged: true },
          });
        });
      });
      break;
    case "dragAndDrop":
      chrome.storage.sync.get("bookList", (Obj) => {
        let list = Obj.bookList;
        let dragKeyArr = request.message.dragKey.split('_');
        let dropKeyArr = request.message.dropKey.includes('_') ? request.message.dropKey.split('_') : [request.message.dropKey, '-1']
        let newChild = list[dragKeyArr[0]].children.splice(dragKeyArr[1], 1)[0];
        list[dropKeyArr[0]].children.splice(parseInt(dropKeyArr[1])+1, 0, newChild);
        chrome.storage.sync.set({ bookList: list }, () => {
          chrome.runtime.sendMessage({
            message: { Action: "set", isChanged: true },
          });
        });
      });
      break;
    default:
      console.log("none");
  }
});

let getURLIndex = (children, url) => {
  let answer = -1;
  children.forEach((item, index) => {
    if (item.url === url) {
      answer = index;
    }
  });
  return answer;
};
