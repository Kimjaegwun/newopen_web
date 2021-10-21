import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // css import

const DatePickerComponent = ({
  pStartDate,
  pEndDate,
  setSearchDateString,
  setSelectedEndDateString,
  isRangeSearch,
  isClearable,
}: any) => {
  const [startDate, setStartDate] = useState(pStartDate);
  const [endDate, setEndDate] = useState(pEndDate);

  const dateToString = (date) => {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };

  useEffect(() => {
    if (startDate) {
      setSearchDateString(dateToString(startDate));
    } else {
      setSearchDateString(null);
    }

    if (endDate) {
      setSelectedEndDateString(dateToString(endDate));
    }
  }, [startDate, endDate]);

  const CustomStartInput = ({ value, onClick }) => (
    <div
      className="example-custom-input"
      onClick={onClick}
      style={{ fontSize: "14px", width: isClearable ? 140 : 110, height: 20 }}
    >
      {value}
    </div>
  );

  const CustomEndInput = ({ value, onClick }) => (
    <div
      className="example-custom-input"
      onClick={onClick}
      style={{ fontSize: "14px", width: 110, height: 20 }}
    >
      {value}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div>
        <DatePicker
          dateFormat="yyyy년 MM월 dd일"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          isClearable={isClearable}
          placeholderText="클릭해주세요."
          customInput={<CustomStartInput value={startDate} onClick={null} />}
        />
      </div>
      <div>
        {isRangeSearch && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            &nbsp;~&nbsp;
            <React.Fragment>
              <div>
                <DatePicker
                  dateFormat="yyyy년 MM월 dd일"
                  selected={endDate}
                  selectsEnd
                  startDate={startDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  placeholderText="클릭해주세요."
                  customInput={
                    <CustomEndInput value={endDate} onClick={undefined} />
                  }
                />
              </div>
            </React.Fragment>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerComponent;
