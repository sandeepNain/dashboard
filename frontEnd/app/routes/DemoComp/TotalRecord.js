import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import {
    Row, Col, Media,
} from '../../components';

import { 
    Pie, Cell, PieChart,
} from './../../components/recharts';
import colors from './../../colors';
import {siteURL} from './../../../constant.js'

const borderLineBottom = {
    padding: '5px',
    borderBottom: '2px solid black',
    marginBottom: '25px',
    width: '100%',
}

const data = [
    {name: 'Group A', value: 400},
    {name: 'Group B', value: 300},
    {name: 'Group C', value: 300},
    {name: 'Group D', value: 200}
];
const COLORS = [colors['success'], colors['red'], colors['yellow'], colors['purple']];

export class TotalRecord extends React.Component {
    constructor(){
        super();
        this.state ={
            record: [],
            chartData: [
                {name: 'successful', value: 0},
                {name: 'failed', value: 0},
                {name: 'cancelled', value: 0},
                {name: 'inProgress', value: 0},
            ],
        };
    }


    componentDidMount() {
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        let chartData = [
            {name: 'successful', value: 0},
            {name: 'failed', value: 0},
            {name: 'cancelled', value: 0},
            {name: 'inProgress', value: 0},
        ]
        if(nextProps.successfulInRecord){
            chartData[0].value = nextProps.successfulInRecord
        }
        if(nextProps.failedInRecord){
            chartData[1].value = nextProps.failedInRecord
        }
        if(nextProps.cancelledInRecord){
            chartData[2].value = nextProps.cancelledInRecord
        }
        if(nextProps.inProgressInRecord){
            chartData[3].value = nextProps.inProgressInRecord
        }
        return {chartData: chartData}
    }

    reFresh() {
        // this.fetchJobs(this.props.path);
    }

    formateDate = (date) => {
        var mydate = new Date(date);
        let day = mydate.getDate();
        let month = mydate.getMonth()+1;
        let year = mydate.getFullYear();
        let hour = mydate.getHours();
        hour = hour < 10 ? '0'+hour : hour;
        let minute = mydate.getMinutes();
        minute = minute < 10 ? '0'+minute : minute;
        return(day+'/'+month+'/'+year+' '+hour+':'+minute);
    }

    render() {
        let {
            record, chartData,
        } = this.state;
        let failedInRecord = 0;
        
        return(
            <React.Fragment>
                
                <Media style={{marginLeft: '33%', marginTop: '10%'}}>
                    <Media left className="mr-3">
                        <PieChart width={ 150 } height={ 150 }>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                stroke={ colors['white'] }
                                innerRadius={ 50 }
                                outerRadius={ 70 } 
                                fill="#8884d8"
                            >
                                {
                                    data.map((entry, index) => <Cell key={ index } fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                        </PieChart>
                    </Media>
                    <Media body>
                        <div className="m-1">
                            <i className="fa fa-circle mr-1 text-success"></i> 
                            <span className="text-inverse">{chartData[0].value}</span> Successful
                        </div>
                        <div className="m-1">
                            <i className="fa fa-circle mr-1 text-danger"></i> 
                            <span className="text-inverse">{chartData[1].value}</span> Failed
                        </div>
                        <div className="m-1">
                            <i className="fa fa-circle mr-1 text-yellow"></i> 
                            <span className="text-inverse">{chartData[2].value}</span> Cancelled
                        </div>
                        <div className="m-1">
                            <i className="fa fa-circle mr-1 text-purple"></i> 
                            <span className="text-inverse">{chartData[3].value}</span> In Progress
                        </div>
                    </Media>
                </Media>
                
            </React.Fragment>
        )
    }

}
export default TotalRecord