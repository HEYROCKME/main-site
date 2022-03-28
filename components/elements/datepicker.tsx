import React, { useRef, useState } from "react";
import { useClickOutsideAlerter } from "../../hooks/useClickOutsideAlerter";
import style from "../../styles/Elements.module.css";

export const DatePicker: React.FC<{ selected?: number, onChange: (selected: number) => void, onClickOutside: () => void }> = ({ selected, onChange, onClickOutside }) => {
  const dates = [...Array.from(Array(29).keys()).map(x => x.toString())].slice(1, 29)

  const datepickerContainerRef = useRef<HTMLDivElement>(null)
  useClickOutsideAlerter(datepickerContainerRef, onClickOutside)

  return <div className={style["datepicker-wrapper"]} ref={datepickerContainerRef} >
    {dates.map(date => <div 
      key={date} 
      onClick={() => onChange(parseInt(date))}
      className={style["datepicker-button"] + ' ' + (selected?.toString() === date ? style["datepicker-button--selected"] : '')}>
      {date}
    </div>)}
    <div className={style["datepicker-last-row"]}>
      <div 
        className={style["datepicker-button-last"] + ' ' + (selected === 0 ? style["datepicker-button-last--selected"] : '')} 
        onClick={() => onChange(0)}>Siste dag i måneden</div>
    </div>
  </div>
}