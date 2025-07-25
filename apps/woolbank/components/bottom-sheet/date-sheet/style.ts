import { css } from 'styled-components';

export const calendarStyle = css`
  .react-calendar {
    width: 100%;
    background: white;
    line-height: 1.125em;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    padding: 1.6rem;
  }

  .react-calendar--doubleView {
    width: 70rem;
  }
  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5em;
  }
  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
    height: 4.8rem;
    width: 4.8rem;
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    height: 5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
    min-width: 100px;
    background: none;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
    border-radius: 12px;
  }
  .react-calendar__navigation button[disabled] {
    background-color: #f0f0f0;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.4rem;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }
  .react-calendar__month-view__weekNumbers {
    font-weight: bold;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    padding: calc(0.6em / 0.6) calc(0.5em / 0.6);
  }
  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }
  .react-calendar__tile {
    max-width: 100%;
    text-align: center;
    padding: 1.05em 0.6em;
    background: none;
    font-size: 1.4rem;
    border-radius: 100%;
  }
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__tile--hasActive {
    border-radius: 2.2rem;
    background: #515ec0;
    opacity: 0.5;
    color: white;
  }
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #a9d4ff;
  }
  .react-calendar__tile--active {
    background: #515ec0;
    opacity: 0.5;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #1087ff;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }

  .react-calendar__month-view__weekdays__weekday {
    font-size: 12px;
    text-decoration: none !important;
    abbr {
      color: rgb(96, 101, 103);
    }
  }

  abbr[title] {
    text-decoration: none;
  }
`;
