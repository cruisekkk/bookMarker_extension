import React from 'react';

import { Button, Divider } from 'antd';
import BookTree from "./BookTree";

function PopUp() {
  return (
    <div>
      <Button type="primary">Quick Mark</Button>
      <br/>
      <Button type="primary">Mark this Tab as</Button>
      <Divider plain></Divider>
      <BookTree />
    </div>
  )
}

export default PopUp;
