import { useTranslation } from "react-i18next";
import "./mailList.css";

const MailList = () => {
  const [t] = useTranslation("common");

  return (
    <div className="mail">
      <h1 className="mailTitle">{t("mailTitle")}</h1>
      <span className="mailDesc">{t("mailDesc")}</span>
      <div className="mailInputContainer">
        <input type="text" placeholder={t("yourEmail")} />
        <button>{t("subscribe")}</button>
      </div>
    </div>
  );
};

export default MailList;
