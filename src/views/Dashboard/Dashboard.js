/** @format */

import React, { Component } from 'react';
import { Card, CardBody, Col, Row, CardHeader } from 'reactstrap';
import { AppRoutes } from '../../Config/AppRoutes';
import { logger } from '../../Helpers/Logger';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import ApiRoutes from '../../Config/ApiRoutes';
import { ApiHelper } from '../../Helpers/ApiHelper';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: {},
      userdata: { datasets: [], labels: [] },
      examBasedData: { datasets: [], labels: [] },
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      window.location.href = '/';
    }
    this.getDashBoard();
  }

  getDashBoard = async () => {
    try {
      const result = await new ApiHelper().FetchFromServer(
        ApiRoutes.GET_DASHBOARD.service,
        ApiRoutes.GET_DASHBOARD.url,
        ApiRoutes.GET_DASHBOARD.method,
        ApiRoutes.GET_DASHBOARD.authenticate,
        undefined,
        undefined,
      );
      const dashboard = result.data;
      this.setState({
        isLoading: false,
        dashboard,

        examBasedData: {
          labels: [`Community`, `Business`, `Personal`],
          datasets: [
            {
              data: [
                `${dashboard.CommunityProject}`,
                `${dashboard.BusinessProject}`,
                `${dashboard.PersonalProject}`,
              ],

              backgroundColor: ['#ff3178', '#f385ab', '#c0406c'],
            },
          ],
        },
        userdata: {
          labels: [`Active Users`, `Inactive Users`],
          datasets: [
            {
              data: [`${dashboard.ActiveUser}`, `${dashboard.InactiveUser}`],
              backgroundColor: ['#ff3178', '#f385ab'],
            },
          ],
        },
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        dashboard: [],
      });
    }
  };

  render() {
    const { dashboard, userdata, examBasedData } = this.state;
    return (
      <div className='animated fadeIn'>
        <Row>
          <Col xs='12' sm='12' lg='12'>
            <Card>
              <CardHeader>
                <h4>
                  <i className='fa fa-dashboard' /> Dashboard
                </h4>
              </CardHeader>
              <CardBody className='amount-show-wrap'>
                <Row>
                  <Col xs='12' sm='6' lg='4'>
                    <Card className='text-white  total-user'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>{dashboard.User}</span>
                          <i className='fa fa-users pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Total Users </div>
                      </CardBody>
                      <div className='chart-wrapper view-list-wrap mx-3'>
                        <div
                          className={'view-link'}
                          onClick={() => {
                            this.props.history.push(AppRoutes.USERS);
                          }}
                        >
                          View List
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col xs='12' sm='6' lg='4'>
                    <Card className='text-white total-projects'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.Project}
                          </span>
                          <i className='nav-icon fa fa-tasks pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Total Projects</div>
                      </CardBody>
                      <div className='chart-wrapper view-list-wrap mx-3'>
                        <div
                          className={'view-link'}
                          onClick={() => {
                            this.props.history.push(AppRoutes.PROJECT);
                          }}
                        >
                          View List
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs='12' sm='6' lg='4'>
                    <Card className='text-white total-earning'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.TotalEarning
                              ? new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(dashboard.TotalEarning)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Total Earnings</div>
                      </CardBody>
                      
                    </Card>
                  </Col>

                  <Col sm={'6'}>
                    <Card>
                      <CardHeader>
                        <h4>
                          <i className='fa fa-users' /> Users
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <div className='chart-wrapper'>
                          <Pie
                            data={userdata}
                            options={{
                              legend: { display: true, position: 'bottom' },
                            }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm={'6'}>
                    <Card>
                      <CardHeader>
                        <h4>
                          <i className='nav-icon fa fa-tasks' /> Projects
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <div className='chart-wrapper'>
                          <Pie
                            data={examBasedData}
                            options={{
                              legend: { display: true, position: 'bottom' },
                            }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
