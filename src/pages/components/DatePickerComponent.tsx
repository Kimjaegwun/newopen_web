
import React, { useEffect, useState } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // css import

const DatePickerComponent = ({pStartDate, pEndDate, setSearchDateString, setSelectedEndDateString, isRangeSearch}: any) => {
  const [startDate, setStartDate] = useState(pStartDate);
  const [endDate, setEndDate] = useState(pEndDate)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const dateToString = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
  }

  useEffect(() => {
    if(startDate){
      setSearchDateString(startDate)
    }
    if(endDate){
      setSelectedEndDateString(endDate)
    }
  }, [startDate, endDate])

  const CustomInput = ({ value, onClick }) => (
    <div className="example-custom-input" onClick={onClick} style={{fontSize:"14px",}}>
      {value}
    </div>
  );

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      backgroundColor:'#FFFFFF'}}>
    <div>
      <DatePicker
        dateFormat="yyyy년 MM월 dd일"
        selected={startDate}
        onChange={ date => setStartDate(date)}
        selectsStart
        customInput={<CustomInput value={undefined} onClick={undefined}/>}
      />
    </div>
    <div>
    {
      isRangeSearch && (
        <div style={{ display: "flex", alignItems: "flex-start",}} >
        &nbsp;~&nbsp;
        <React.Fragment>
          <div>
            <DatePicker
              dateFormat="yyyy년 MM월 dd일"
              selected={endDate}
              selectsEnd
              startDate={startDate}
              onChange={ date => setEndDate(date)}
              minDate={startDate}
              customInput={<CustomInput value={undefined} onClick={undefined}/>}
            />
          </div>
        </React.Fragment>
        </div>
      )
    }
  </div>
  </div>
  )
};

export default DatePickerComponent;