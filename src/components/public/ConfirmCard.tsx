import { ReactNode } from "react";
import styles from "./ConfirmCard.module.css";

export default function ConfirmCard({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className={styles["confirm-card"]}>
      <h2>{title}</h2>
      <p>{children}</p>
      {actions ? <div className="route-actions gap-4">{actions}</div> : null}
    </div>
  );
}
