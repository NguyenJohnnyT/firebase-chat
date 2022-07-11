import React from "react";
import styles from "./index.module.scss";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className={styles.Layout}>
        THE chat
        <div className={styles.Chatbox}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
