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
import {siteURL} from './../../../constant.js'

export class FailedJobs extends React.Component {
    constructor(){
        super();
        this.state ={
            record: [],
            totalRecord : 0,
            message: '',
            loaderVisibility: true,
            NoDatMessage: "",
        };
    }

    fetchJobs = (path) => {
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
                        NoDatMessage: "No data to preview",
                    });
                    toast("Error in Getting Failed Jobs !");
                } else {
                    this.setState({
                        record: data.result,
                        totalRecord: data.total,
                        loaderVisibility: false,
                        NoDatMessage: "No data to preview",
                    });
                }
            })
            .catch(error =>{
                console.log("error in getting data form db");
                this.setState({
                    record: [],
                    totalRecord: 0,
                    loaderVisibility: false,
                    NoDatMessage: "No data to preview",
                });
                toast("Error in Getting Failed Jobs !");
            }
            );
    }

    componentDidMount() {
        this.fetchJobs(this.props.path);
        setInterval(() => {
            this.fetchJobs(this.props.path);
          }, 60*1000);
    }

    reFresh() {
        this.fetchJobs(this.props.path);
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
            totalRecord, record, loaderVisibility,
            NoDatMessage,
        } = this.state;
        let failedInRecord = 0;
        record.map( (row)=>{
            if(row.LastRunStatus === 'Failed') failedInRecord++;
        });
        return(
            <React.Fragment>
                <Row style={{display: 'flex', flexWrap: 'wrap'}}>
                <Loader className="load-class"
                    type="TailSpin"
                    color="#00BFFF"
                    visible={loaderVisibility}
                />
                {totalRecord == 0 ? <Col>{NoDatMessage}</Col> : ""}
                {record.map((row, index) => (
                    <Col key={index}  className="mb-3 marginClass" xs={12} sm={12} md={6} lg={6} xl={6}
                        style={{
                            backgroundClip: 'content-box',
                            backgroundColor: row.LastRunStatus === 'Failed' ? '#d32f2f' :
                            row.LastRunStatus === 'In Progress' ? '#ca8eff' : 'green',
                        }}
                        >
                        <Card  style={{backgroundColor: row.LastRunStatus === 'Failed' ? '#d32f2f': '#ca8eff'}}>
                            <CardBody>
                                <CardTitle className="cardTitle">
                                        {row.JobName}
                                </CardTitle>
                                    <Row className="cardBody">
                                        <Col xs={12} sm={6} md={6} style={{paddingRight: '4px'}}>
                                            {row.StepName}
                                        </Col>
                                        <Col xs={12} sm={6} md={6} style={{paddingLeft: '4px'}}>
                                            <Col sm={12}>{this.formateDate(row.LastRunDate)}</Col>
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
export default FailedJobs