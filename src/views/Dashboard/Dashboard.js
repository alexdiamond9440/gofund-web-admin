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
                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white  total-user mb-2'>
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
                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-projects mb-2'>
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

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
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
                        <div className='number-heading'>Total All-time Revenue</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.todayEarning
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.todayEarning)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Today Revenue</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.weekEarning
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.weekEarning)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Week Revenue</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.monthEarning
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.monthEarning)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Month Revenue</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.yearEarning
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.yearEarning)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Year Revenue</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.avgTip
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.avgTip)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Average Tip</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.avgOneTimePayment
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.avgOneTimePayment)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Average One-Time payment</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.avgRecurringPayment
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.avgRecurringPayment)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Average Monthly payment</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.nextRecurringPayment
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.nextRecurringPayment)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Next Month Estimated Revenue</div>
                      </CardBody>

                    </Card>
                  </Col>

                  <Col xs='12' sm='4' lg='3'>
                    <Card className='text-white total-earning mb-2'>
                      <CardBody>
                        <div className='text-value'>
                          <span className='amount-value'>
                            {dashboard.totalRaised
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(dashboard.totalRaised)
                              : '$0.00'}
                          </span>
                          <i className='fa fa-money pull-right fa-lg' />
                        </div>
                        <div className='number-heading'>Total Raised</div>
                      </CardBody>

                    </Card>
                  </Col>
                  {/*
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
                          */}
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
