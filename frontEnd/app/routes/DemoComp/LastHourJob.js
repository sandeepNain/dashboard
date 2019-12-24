import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
} from '../../components';

import cardStyle from './../../styles/card.scss'
import {siteURL} from '../../../constant.js'

export class LastHourJob extends React.Component {
    constructor(){
        super();
        this.state ={
            record: [],
        };
    }


    componentDidMount() {
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.record != prevState.record)    return {record: nextProps.record}
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
            record,
        } = this.state;
        
        return(
            <React.Fragment>
                <Row style={{display: 'flex', flexWrap: 'wrap'}}>
                {record.length == 0 ? <div style={{padding: '0px 10px 10px'}}>No data to preview</div> : ""}
                {record.map((row, index) => (
                    <Col key={index}  className="mb-3 marginClass" xs={12} sm={6} md={4} lg={3} xl={3}
                        style={{
                            backgroundClip: 'content-box',
                            backgroundColor: row.LastRunStatus === 'Failed' ? '#ed1c24' :
                            row.LastRunStatus === 'In Progress' ? '#ca8eff' : 
                            row.LastRunStatus === 'Cancelled' ? '#f7bf47' : '#1bb934',
                        }}
                        >
                        <Card  style={{backgroundColor: row.LastRunStatus === 'Failed' ? '#ed1c24':
                        row.LastRunStatus === 'In Progress' ? '#ca8eff' : 
                        row.LastRunStatus === 'Cancelled' ? '#f7bf47' : '#1bb934'}}>
                            <CardBody>
                                <CardTitle className="cardTitle">
                                        {row.JobName}
                                </CardTitle>
                                    <Row className="cardBody">
                                        <Col xs={12} sm={6} md={8} style={{paddingRight: '4px'}}>
                                            {row.StepName}
                                        </Col>
                                        <Col xs={12} sm={6} md={4} style={{paddingLeft: '4px'}}>
                                            {this.formateDate(row.LastRunDate)}
                                        </Col>
                                    </Row>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
                </Row>
            </React.Fragment>
        )
    }

}
export default LastHourJob