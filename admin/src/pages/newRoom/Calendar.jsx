import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  momentLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useTranslation } from "react-i18next";

const CalendarManage = () => {
  const [myEventsList, setMyEventsList] = useState([]);
  const navigate = useNavigate();
  const product = useParams();
  const id = product.roomId;

  const { data, loading, error } = useFetch(
    `/bookings/room/${id}`
  );

  const [t] = useTranslation("common");

  const getDatesInRange = (checkinDate, checkoutDate) => {
    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const handleClick = async (event) => {
    const r = window.confirm(t("dataTable.confirm"));
    if (r === true) {
      //delete event from start to the past of the end
      const start = event.start;
      const end = moment(event.end)
        .subtract(1, "day")
        .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

      const alldates = getDatesInRange(start, end);

      console.log(alldates);

      try {
        await axios.delete(`/bookings/${event._id}`);

        setMyEventsList(
          myEventsList.filter((event) => event.id === id)
        );

        const res = await axios.delete(
          `/rooms/availability/delete/${id}`,
          {
            data: {
              dates: alldates,
            },
          }
        );
        navigate(`/rooms/calendar/${id}`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    if (data) {
      setMyEventsList(
        data.map((room) => {
          return {
            title: room.status,
            start: room.checkinDate,
            end: moment(room.checkoutDate)
              .subtract(0, "day")
              .format("yyyy-MM-DD"),
            _id: room._id,
          };
        })
      );
    }
  }, [data]);

  // display the calendar to modify the roomNumbers unavailableDates
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{t("calendar")}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <Calendar
              localizer={localizer}
              events={myEventsList}
              style={{ height: 1000 }}
              resizable
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.color,
                },
              })}
              onSelectEvent={handleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CalendarManage;
