import React from "react";
import styles from "./index.module.scss";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className={styles.Layout}>
        THE chat
        {children}
      </div>
    </>
  );
};

export default Layout;
