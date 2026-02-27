import React from 'react';
import styles from './index.scss';
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div className={styles.No_match}>
      <h2>没匹配到页面!</h2>
      <p>
        <Link to="/list">跳转到列表页</Link>
      </p>
    </div>
  )
}

export default NoMatch;