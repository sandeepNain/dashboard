import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import {
    Row, Col, Button,
} from './../../components';

import TotalRecord from './TotalRecord';
import FailedJobs from './FailedJobs';
import OtherJobs from './OtherJobs';
import LastHourJob from './LastHourJob';
import RemaingFailedJobs from   './RemaingFailedJobs';

import css from './../../styles/card.scss';
import {siteURL} from './../../../constant.js'

export class DemoComp extends React.Component {

    constructor(){
        super();
        this.state ={
            record: [],
            totalRecord : 0,
            loaderVisibility: true,
        };
    }

    fetchTotalJobs = (path) => {
        this.setState({
            record: [],
            totalRecord: 0,
            loaderVisibility: true,
            NoDatMessage: "",
        });
        fetch(siteURL+path, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
            })
          })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        record: [],
                        totalRecord: 0,
                        loaderVisibility: false,
                        NoDatMessage: "No Data to preview",
                    });
                    toast("Error in Getting Jobs !");
                } else {
                    this.setState({
                        record: data.result,
                        totalRecord: data.total,
                        loaderVisibility: false,
                        NoDatMessage: "No Data to preview",
                    });
                }
            })
            .catch(error =>{
                this.setState({
                    record: [],
                    totalRecord: 0,
                    loaderVisibility: false,
                    NoDatMessage: "No Data to preview",
                });
                toast("Error in Getting Jobs !");
            }
            );
    }

    componentDidMount() {
        this.fetchTotalJobs('totalJobs');
        setInterval(() => {
            this.fetchTotalJobs('totalJobs');
          }, 60*1000);
    }

    reRenderPage = () => {
        this.fetchTotalJobs('totalJobs');
    }

    formateDate = (date) => {
        var mydate = new Date(date);
        let day = mydate.getDate();
        let month = mydate.getMonth();
        let year = mydate.getFullYear();
        return(day+'/'+month+'/'+year);
    }

    render() {
        let { record, loaderVisibility } = this.state;

        let successfulInRecord = 0;
        let successfulRecord = [];
        let failedInRecord = 0;
        let failedRecord = [];
        let latestFailedRecord = [];
        let cancelledInRecord = 0;
        let cancelledRecord = [];
        let inProgressInRecord = 0;
        let inProgressRecord = [];
        let count = 0;
        if(record && record.length) {
            record.map( (row)=>{
                if(row.LastRunStatus === 'Successful') {
                    successfulInRecord++;
                    successfulRecord.push(row);
                }
                if(row.LastRunStatus === 'Failed') {
                    failedInRecord++;
                    if(count < 12){
                        latestFailedRecord.push(row);
                        count++;
                    } else {
                        failedRecord.push(row);
                    }
                }
                if(row.LastRunStatus === 'Cancelled') {
                    cancelledInRecord++;
                    cancelledRecord.push(row);
                }
                if(row.LastRunStatus === 'In Progress') {
                    inProgressInRecord++;
                    inProgressRecord.push(row);
                }
            });
        }
        
        return(
            <React.Fragment>
                <Loader className="load-class"
                    type="TailSpin"
                    color="#00BFFF"
                    visible={loaderVisibility}
                />
                <Row >
                    <Row style={{width: '100%'}}>
                        <Col sm={8} style={{
                            padding: 10,
                            fontSize: '20px',
                            fontWeight: '500',
                            color: 'black',
                            textAlign: 'center',
                        }}>
                            Latest Jobs
                        </Col>
                        <Col sm={4} style={{
                            padding: 10,
                            fontSize: '20px',
                            fontWeight: '500',
                            color: 'black',
                            textAlign: 'center',
                        }}><Button color="primary" 
                            onClick={this.reRenderPage}>Refresh</Button></Col>
                    </Row>
                    
                    <Col md={12} lg={8} xl={8}>
                        
                        <div className="div-border">
                            <LastHourJob record={latestFailedRecord} ref={ this.lastHourJob } />
                        </div>
                    </Col>
                    <Col md={12} lg={4} xl={4}>
                        <Row>
                            <TotalRecord
                            successfulInRecord={successfulInRecord}
                            failedInRecord={failedInRecord}
                            cancelledInRecord={cancelledInRecord}
                            inProgressInRecord={inProgressInRecord}
                            reRenderPage={this.reRenderPage} ref={ this.totalJobs } />
                        </Row>
                        
                    </Col>
                </Row>

                <Row>
                    <Col style={{
                        padding: 10,
                        fontSize: '20px',
                        fontWeight: '500',
                        color: 'black',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        Failed Jobs
                    </Col>
                    <div className="div-border">
                        <RemaingFailedJobs record={failedRecord} />
                    </div>
                </Row>

                <Row>
                    <Col style={{
                        padding: 10,
                        fontSize: '20px',
                        fontWeight: '500',
                        color: 'black',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        Inprogress Jobs
                    </Col>
                    <div className="div-border">
                        <RemaingFailedJobs record={inProgressRecord} />
                    </div>
                </Row>

                <Row>
                    <Col style={{
                        padding: 10,
                        fontSize: '20px',
                        fontWeight: '500',
                        color: 'black',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        Cancelled Jobs
                    </Col>
                    <div className="div-border">
                        <RemaingFailedJobs record={cancelledRecord} />
                    </div>
                </Row>

                <Row>
                    <Col style={{
                        padding: 10,
                        fontSize: '20px',
                        fontWeight: '500',
                        color: 'black',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        Success Jobs
                    </Col>
                    <div className="div-border">
                        <RemaingFailedJobs record={successfulRecord} />
                    </div>
                </Row>
               
                <ToastContainer 
                    position={'top-right'}
                    autoClose={5000}
                    draggable={false}
                    hideProgressBar={true}
                />
            </React.Fragment>
        )
    }
}

export default DemoComp