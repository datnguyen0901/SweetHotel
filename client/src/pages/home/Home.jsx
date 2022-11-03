import { useTranslation } from "react-i18next";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";

const Home = () => {
  const [t] = useTranslation("common");

  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <Featured />
        <h1 className="homeTitle">{t("home.title")}</h1>
        <PropertyList />
        <h1 className="homeTitle">{t("home.homes")}</h1>
        <FeaturedProperties />
        <MailList />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
