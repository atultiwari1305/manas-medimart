import React, { useState } from "react";
import styled from 'styled-components';
import Statistic from '../UI/Statistics';
import Sales from '../UI/Sales';
import Orders from '../UI/Orders';
import Analytic from '../UI/Analytic';
import Shopping from '../UI/Shopping';
import Navigation from "../UI/Navigation";
// import SidebarDR from '../Pages/sideDR';
import '../UI/innerPages.css';

function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState('December');

    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const handleMonthChange = (e) => setSelectedMonth(e.target.value);

    return (
        <>
            <Navigation pagetitle={"Sales Report"} style={{ transform: 'translateX(-20px)' }} />

            {/* <SidebarDR /> */}

            <Section>
                <div>
                    <label htmlFor="monthDropdown" className="bigger-bold">Month:</label>
                    <StyledSelect
                        id="monthDropdown"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                    >
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </StyledSelect>
                </div>

                <div className="grid">
                    <div className="grid_1">
                        {/* Ensure these components handle objects correctly */}
                        <Statistic currentMonth={selectedMonth} />
                        <Sales currentMonth={selectedMonth} />
                        <Orders currentMonth={selectedMonth} />
                    </div>

                    <div className="grid_2">
                        <Analytic currentMonth={selectedMonth} />
                        <Shopping currentMonth={selectedMonth} />
                    </div>
                </div>
            </Section>
        </>
    );
}

export default Dashboard;

const Section = styled.section`
margin-left: 0vw;
padding: 2rem;
height: 100%;

.grid {
    display: grid;
    grid-template-columns: 70% 28%;
    gap: 2rem;
    margin-top: 2rem;

    .grid_1, .grid_2 {
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
}
`;

const StyledSelect = styled.select`
padding: 8px;
font-size: 16px;
border: 1px solid #ccc;
border-radius: 4px;
background-color: white;
color: #333;
cursor: pointer;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
transition: border-color 0.3s ease;

&:hover {
  border-color: #999;
}
&:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
`;
