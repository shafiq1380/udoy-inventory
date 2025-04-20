import React from 'react'
import { Col, FormGroup, InputGroup, Label } from 'reactstrap'

import Flatpickr from "react-flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";

const EmployeeReportDateCmp = ({ date, handleDate, name }) => {

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    return (
        <>
            <InputGroup size='xxl'>
                <Flatpickr
                    className="form-control "
                    placeholder="YYYY, M, dd"
                    options={{
                        plugins: [
                            new monthSelectPlugin({
                                shorthand: true,
                                dateFormat: "d/m/Y",
                                altInput: true,
                                altFormat: "Y-m-d",
                                theme: "light",
                            })
                        ],
                        static: true
                    }}
                    //onChange={(selectedDates, dateStr) => handleDate(dateStr, name)}

                    onChange={(selectedDates, dateStr) => {
                        if (selectedDates.length > 0 && name === 'toDate') {
                            const selectedDate = selectedDates[0];
                            const year = selectedDate.getFullYear();
                            const month = selectedDate.getMonth();

                            const lastDayOfMonth = getLastDayOfMonth(year, month);

                            const formattedDate = formatDate(lastDayOfMonth);
                            handleDate(formattedDate, name);
                        } else {
                            handleDate(dateStr, name)
                        }
                    }}

                    value={date && new Date(date)}

                // value={date}
                />
            </InputGroup>
        </>
    )
}

export default EmployeeReportDateCmp