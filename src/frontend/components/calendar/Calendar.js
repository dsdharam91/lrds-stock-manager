import React from 'react'
import Relay from 'react-relay'
import moment from 'moment';
import _ from 'lodash'

const month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const days_name = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

import CalendarColumn from './CalendarColumn'

class Calendar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            defaultDate: moment(this.props.defaultDate)
        }
    }

    getDayOfWeek() {
        return this.state.defaultDate.format("ddd");
    }

    getFirstDayOfMonth() {

        var year = moment(this.state.defaultDate).year();
        var month = moment(this.state.defaultDate).month();
        var startDate = moment([year, month]);

        return startDate.format("ddd");
    }

    getDaysInMonth() {
        return this.state.defaultDate.daysInMonth();
    }

    renderCalendar(blankDays) {
        
        var dayNumber = 1;
        var calendar = [];
        
        for(var c=0; c<6; c++) {
            
            if(dayNumber > this.getDaysInMonth()) break;
         
            var weekRow =  this.renderWeekRow(dayNumber, blankDays)
            calendar.push(<div className="calendar-month-row" key={"calendar-row-" + c}>{weekRow.html}</div>)
            
            blankDays = [];
            dayNumber = weekRow.newDayNumber
        }
        
        return calendar
    }
    
    fillWithBlankDays(aRowOfDays) {
        
        while(aRowOfDays.length != 7) {
            aRowOfDays.push(<div className="calendar-row-content calendar-blank-days" key={"calendar-blank-days-" + aRowOfDays.length}/>)
        }
        return aRowOfDays
    }

    renderCalendarHeader() {
        return days_name.map(day => {
            return <div className="calendar-row-content calendar-days-header" key={"calendar-days-header-" + day}>{day}</div>
        })
    }

    renderBlankDays() {
        var blankDays = []
        var i = 0;
        while (this.getFirstDayOfMonth() != days_name[i]) {
            blankDays[i] = <div className="calendar-row-content calendar-blank-days" key={"calendar-blank-days-" + i}/>
            i++;
        }
        
        return blankDays
    }

    renderWeekRow(initialDayNumber, blankDays) {

        var dayNumber = initialDayNumber;
        var counter = blankDays.length === 0 ? 0 : blankDays.length;

        for(var c=counter ; c < 7; c++) {
            if(dayNumber > this.getDaysInMonth()) break;
            blankDays.push(<CalendarColumn defaultDate={this.state.defaultDate} 
                                           dayNumber={dayNumber} 
                                           key={"calendar-days-" + dayNumber} />)
            dayNumber++
        }
        
        

        return {html: this.fillWithBlankDays(blankDays), newDayNumber: dayNumber}
    }
    
    componentWillReceiveProps(newprops) {
        this.setState({defaultDate: newprops.defaultDate})
    }

    render() {

        var calendarHeaderDays = this.renderCalendarHeader()
        var blankDays = this.renderBlankDays()
        var calendar = this.renderCalendar(blankDays)

        return  <div className="calendar-container">
                    <div className="calendar-month-view">
                        <div>
                            <div className="calendar-row calendar-month-header">
                                {calendarHeaderDays}
                            </div>
                            {calendar}
                        </div>
                    </div>

                </div>
    }


}

export default Calendar