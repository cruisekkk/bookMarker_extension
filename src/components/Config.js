import React, { useState, useEffect } from "react";
import styles from "../styles/config.module.scss";

function config({ setTheme }) {
  return (
    <>
      <div className={styles.text}>
        <p>Select a theme!</p>
      </div>
      <div className={styles.container}>
        <div
          className={styles.shape + " " + styles.pink}
          onClick={() => setTheme("pink")}
        ></div>
        <div
          className={styles.shape + " " + styles.blue}
          onClick={() => setTheme("blue")}
        ></div>
        <div
          className={styles.shape + " " + styles.gray}
          onClick={() => setTheme("gray")}
        ></div>
        <div
          className={styles.shape + " " + styles.green}
          onClick={() => setTheme("green")}
        ></div>
      </div>
    </>
  );
}

export default config;
