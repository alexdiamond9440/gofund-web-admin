/** @format */

import * as moment from 'moment';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  UncontrolledTooltip,
  Label,
  Input,
  FormGroup,
  InputGroup,
  Form,
} from 'reactstrap';
import { ApiHelper } from '../../Helpers/ApiHelper';
import ApiRoutes from '../../Config/ApiRoutes';
import { AppConfig } from '../../Config';
import { AppRoutes } from '../../Config/AppRoutes';
import Loader from '../../containers/Loader/Loader';
import { logger } from '../../Helpers/Logger';
import PaginationHelper from '../../Helpers/Pagination';
import { ConfirmBox } from '../../Helpers/SweetAlert';
import { frontUrl, mainAppUrl } from '../../Config/AppConfig';
import Button from 'react-bootstrap/Button';

const queryString = require('query-string');

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 50,
      skip: 0,
      search: '',
      isActive: '',
      statusActive: '',
      isLoading: true,
      searchByStatus: '',
      filter: '',
      cur_order_field: 'createdAt',
      cur_order_dir: 'desc'
    };
  }

  handleChange = async e => {
    const { target } = e;
    const { name, value } = target;
    await this.setState({
      [name]: value,
    });

    this.props.history.push(
      `?search=${this.state.search}&searchByStatus=${this.state.searchByStatus}&filter=${this.state.filter}`,
    );
  };

  async componentDidMount() {
    let parsed = queryString.parse(this.props.location.search);
    if (parsed.search) {
      await this.setState({
        search: parsed.search,
      });
    }
    if (parsed.searchByStatus) {
      await this.setState({
        searchByStatus: parsed.searchByStatus,
      });
    }

    await this.getUsers();
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.location.search !== this.props.location.search) {
      let parsed = queryString.parse(this.props.location.search);

      if (parsed.type === '2') {
        this.setState({
          unlimited: true,
        });
      }
      if (parsed.type === 'undefined') {
        this.setState({ type: '' });
      } else {
        this.setState({ type: parsed.type });
      }
      if (parsed.search === 'undefined') {
        this.setState({ search: '' });
      } else {
        this.setState(
          {
            search: parsed.search,
            totalCount: 0,
            selectedPage: 1,
            isLoading: true,
          },
          () => {
            this.getUsers();
          },
        );
      }
      if (parsed.page === undefined || parsed.page === 'undefined') {
        this.setState(
          {
            selectedPage: 1,
            skip: this.state.limit * (1 - 1),
            totalCount: 0,
            isLoading: true,
          },
          () => {
            this.getUsers();
          },
        );
      } else if (parsed.page !== undefined || parsed.page !== 'undefined') {
        this.setState(
          {
            selectedPage: parsed.page,
            skip: this.state.limit * (parsed.page - 1),
            isLoading: true,
          },
          () => {
            this.getUsers();
          },
        );
      }
    }
  };

  proxyLogin = async id => {
    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.PROXY_LOGIN.service,
      ApiRoutes.PROXY_LOGIN.url,
      ApiRoutes.PROXY_LOGIN.method,
      ApiRoutes.PROXY_LOGIN.authenticate,
      undefined,
      { id: id },
    );
    if (res.data.success) {
      let proxy = `${frontUrl}verify-user?token=${res.data.token}&userId=${res.data.data.id}`;
      window.open(proxy, '_blank');
    }
  };

  getUsers = async e => {
    const { selectedPage, limit, search, searchByStatus, filter, cur_order_field, cur_order_dir } = this.state;
    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.GETUSERS.service,
      ApiRoutes.GETUSERS.url,
      ApiRoutes.GETUSERS.method,
      ApiRoutes.GETUSERS.authenticate,
      {
        page: selectedPage,
        limit: limit,
        search: search,
        searchByStatus: searchByStatus,
        filter: filter,
        order_field: cur_order_field,
        order_dir: cur_order_dir
      },
    );
    // console.log('res.data', res.data);

    if (res.data && res.data.success) {
      /*
      for (let i = 0; i < res.data.data.length; i++) {
        let item = res.data.data[i];
        let total_projects = 0;
        for (let j = 0; j < item.Projects.length; j++) {
          let pro = item.Projects[j];
          total_projects = total_projects + parseFloat(pro.total_pledged);
        }
        item.totalAmount = total_projects;
        let personal_donation = 0;
        for (let j = 0; j < item.Finances.length; j++) {
          let amt = item.Finances[j];
          personal_donation = personal_donation + parseFloat(amt.payout_amount);
        }
        item.personalDonation = personal_donation;
      }*/
      await this.setState({
        users: res.data.data,
        totalCount: res.data.totalCount,
        isLoading: false,
      });
    }
  };

  handleSearchByStatus = async e => {
    const { target } = e;
    const { name, value } = target;
    await this.setState({
      [name]: value,
      totalCount: 0,
      selectedPage: 1,
      isLoading: true,
    });
    const { search, searchByStatus, filter } = this.state;
    await this.props.history.push(
      `?search=${search}&searchByStatus=${searchByStatus}&filter=${filter}`,
    );
    await this.getUsers();
  };

  handleFilter = async e => {
    const { target } = e;
    const { name, value } = target;
    await this.setState({
      [name]: value,
      totalCount: 0,
      selectedPage: 1,
      isLoading: true,
    });
    const { search, searchByStatus, filter } = this.state;
    await this.props.history.push(
      `?search=${search}&searchByStatus=${searchByStatus}&filter=${filter}`,
    );
    await this.getUsers();
  };

  handleSelected = async page => {
    this.setState(
      {
        selectedPage: page,
        skip: this.state.limit * (page - 1),
        isLoading: true,
      },
      () => {
        this.getUsers();
      },
    );
  };

  delete = async (id, isDeleted) => {
    const { value } = await ConfirmBox({
      title: 'Are you sure?',
      text: 'Do you want to delete this Project Manager!',
    });
    if (!value) {
      return;
    }
    toast.success('Project Manager deleted successfully', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  handleActionChange = e => {
    const { ids } = this.state;
    if (!ids.length) {
      toast.info('Please select at least one user.');
      return;
    }
    const value = e.target.value;
    if (value.toLowerCase() === 'active') {
      logger('Activate Users');
    } else if (value.toLowerCase() === 'deactive') {
      logger('Deactivate Users');
    } else if (value.toLowerCase() === 'Delete') {
      logger('Delete Users');
    }
  };

  activePM = async (id, isActive) => {
    try {
      const { value } = await ConfirmBox({
        title: 'Are you sure?',
        text: 'You want to change the status',
      });
      if (!value) {
        return;
      }
      const data = { id: id, isActive: isActive };
      if (value) {
        const res = await new ApiHelper().FetchFromServer(
          ApiRoutes.UPDATE_USER_STATUS.service,
          ApiRoutes.UPDATE_USER_STATUS.url,
          ApiRoutes.UPDATE_USER_STATUS.method,
          ApiRoutes.UPDATE_USER_STATUS.authenticate,
          undefined,
          data,
        );
        if (res.data.success) {
          toast.success(
            isActive === true
              ? 'User activated successfully'
              : 'User deactivated successfully',
            {
              position: toast.POSITION.TOP_RIGHT,
            },
          );
        }
      }
    } catch (error) {
      logger(error);
    }
    this.getUsers();
  };

  onSearch = async e => {
    e.preventDefault();
    await this.setState({
      selectedPage: 1,
      totalCount: 0,
      skip: 0,
      isLoading: true,
    });
    const { search, searchByStatus, filter } = this.state;
    await this.props.history.push(
      `?search=${search}&searchByStatus=${searchByStatus}&filter=${filter}`,
    );
    await this.getUsers();
  };

  onReset = async e => {
    e.preventDefault();
    this.setState(
      {
        search: '',
        selectedPage: 1,
        totalCount: 0,
        skip: 0,
        statusActive: '',
        ids: '',
        searchByStatus: '',
        filter: '',
      },
      () => {
        this.props.history.push(AppRoutes.USERS);
        this.getUsers();
      },
    );
  };

  // to change feature user status
  handleFeaturedUser = async (e, id, rowPosition) => {
    const { target } = e;
    const { checked } = target;

    this.setState({
      isFeatured: checked,
    });

    try {
      const { value } = await ConfirmBox({
        title: 'Are you sure?',
        text:
          checked === true
            ? 'Do you want to feature this user'
            : 'Do you want to Un-feature this user',
      });

      if (!value) {
        return;
      }
      const userId = id;
      const data = { [rowPosition === 2 ? 'is_featured_second' : 'isFeatured']: checked, userId };
      if (value) {
        // api to update featured project
        const res = await new ApiHelper().FetchFromServer(
          ApiRoutes.UPDATE_FEATURED_USER.service,
          ApiRoutes.UPDATE_FEATURED_USER.url,
          ApiRoutes.UPDATE_FEATURED_USER.method,
          ApiRoutes.UPDATE_FEATURED_USER.authenticate,
          undefined,
          data,
        );
        if (res.data.success) {
          toast.success(
            checked === true
              ? 'User featured successfully'
              : 'User unfeatured successfully',
            {
              position: toast.POSITION.TOP_RIGHT,
            },
          );
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      logger(error);
    }
    this.getUsers();
  };

  onDelete = async (id) => {
    try {
      const { value } = await ConfirmBox({
        title: 'Confirmation',
        text: "Are you sure to delete user?"
      });
      if (!value) {
        return;
      }
      if (value) {
        // api to update featured project
        const res = await new ApiHelper().FetchFromServer(
          ApiRoutes.DELETEUSER.service,
          ApiRoutes.DELETEUSER.url,
          ApiRoutes.DELETEUSER.method,
          ApiRoutes.DELETEUSER.authenticate,
          undefined,
          {
            id: id
          }
        );
        if (res.data.success) {
          toast.success('User deleted successfully', {
            position: toast.POSITION.TOP_RIGHT,
          }
          );
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      logger(error);
    }
    this.getUsers();
  }

  renderSort = (field) => {
    if (this.state.cur_order_field == field) {
      if (this.state.cur_order_dir == 'asc') {
        return (<i className='fa fa-sort-asc' />);
      } else {
        return (<i className='fa fa-sort-desc' />);
      }
    } else
      return (<i className='fa fa-sort' />)
  }

  onSort = (e) => {

    let field = e.target.getAttribute('data-field');

    if (field == null || field == undefined) {
      field = e.target.parentNode.getAttribute('data-field');
    }

    let dir = 'asc';
    if (this.state.cur_order_field == field) {
      if (this.state.cur_order_dir == 'asc')
        dir = 'desc';
      else
        dir = 'asc';
    }

    this.setState({
      cur_order_field: field,
      cur_order_dir: dir
    });

    setTimeout(() => { this.getUsers(); }, 50);

  }

  render() {
    const {
      users,
      isLoading,
      totalCount,
      limit,
      skip,
      selectedPage,
      search,
      searchByStatus,
      filter,
    } = this.state;
    return (
      <Row>
        <Col xs={'12'} lg={'12'}>
          <Card>
            <CardBody>
              <div className={'filter-block'}>
                <Form onSubmit={this.onSearch}>
                  <Row>
                    <Col lg={'3'} md={'3'} className='mb-0'>
                      <FormGroup className='mb-0'>
                        <Label className='label'>Search</Label>
                        <InputGroup className='mb-2'>
                          <input
                            type='text'
                            name='search'
                            onChange={this.handleChange}
                            className='form-control'
                            aria-describedby='searchUser'
                            placeholder='By Name & E-mail ID'
                            value={search}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col lg={'3'} md={'3'} className='mb-0'>
                      <FormGroup className='mb-0'>
                        <Label for='exampleSelect' className='label'>
                          Status
                        </Label>
                        <Input
                          type='select'
                          name='searchByStatus'
                          id='exampleSelect'
                          value={searchByStatus || ''}
                          onChange={this.handleSearchByStatus}
                        >
                          <option className='form-control' value={''}>
                            All
                          </option>
                          <option value={'1'}>Active</option>
                          <option value={'0'}>Inactive</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg={'3'} md={'3'} className='mb-0'>
                      <FormGroup className='mb-0'>
                        <Label for='exampleSelect' className='label'>
                          Filter
                        </Label>
                        <Input
                          type='select'
                          name='filter'
                          id='exampleFilter'
                          value={filter || ''}
                          onChange={this.handleFilter}
                        >
                          <option className='form-control' value={''}>
                            All
                          </option>
                          <option value={'1'}>Featured</option>
                          <option value={'0'}>UnFeatured</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg={'3'} md={'3'} className='mb-0'>
                      <div className='filter-btn-wrap'>
                        <Label className='height17 label' />
                        <div className='form-group mb-0'>
                          <span className='mr-2'>
                            <button
                              type='submit'
                              className='btn theme-btn'
                              id='Tooltip-1'
                            >
                              <i className='fa fa-search' />
                            </button>
                            <UncontrolledTooltip target='Tooltip-1'>
                              Search
                            </UncontrolledTooltip>
                          </span>
                          <span className=''>
                            <button
                              type='button'
                              className='btn btn-danger btn-black'
                              id='Tooltip-2'
                              onClick={this.onReset}
                            >
                              <i className='fa fa-refresh' />
                            </button>
                            <UncontrolledTooltip target={'Tooltip-2'}>
                              Reset all filters
                            </UncontrolledTooltip>
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
              <Table responsive bordered className='table-theme-wrap'>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th className='text-left'>Image</th>
                    <th className='text-left'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='first_name'>
                        <div>User Details</div>
                        <div>
                          {this.renderSort('first_name')}
                        </div>
                      </div>
                    </th>
                    <th className='text-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='is_acc_updated'>
                        <div>Stripe Connected</div>
                        <div>
                          {this.renderSort('is_acc_updated')}
                        </div>
                      </div></th>
                    <th className='text-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='is_paypal_connected'>
                        <div>Paypal Connected</div>
                        <div>
                          {this.renderSort('is_paypal_connected')}
                        </div>
                      </div></th>
                    <th className='text-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='project_count'>
                        <div>Total Projects</div>
                        <div>
                          {this.renderSort('project_count')}
                        </div>
                      </div></th>
                    <th className='text-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='total_pledged'>
                        <div>Project Donations</div>
                        <div>
                          {this.renderSort('total_pledged')}
                        </div>
                      </div></th>
                    <th className='text-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='personal_donation'>
                        <div>Personal Donations</div>
                        <div>
                          {this.renderSort('personal_donation')}
                        </div>
                      </div></th>
                    <th>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='isFeatured'>
                        <div>Featured</div>
                        <div>
                          {this.renderSort('isFeatured')}
                        </div>
                      </div></th>
                    <th>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='is_featured_second'>
                        <div>Featured Second Row</div>
                        <div>
                          {this.renderSort('is_featured_second')}
                        </div>
                      </div></th>
                    <th><div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='createdAt'>
                      <div>Created Date</div>
                      <div>
                        {this.renderSort('createdAt')}
                      </div>
                    </div></th>
                    <th className='text-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='isActive'>
                        <div>Status</div>
                        <div>
                          {this.renderSort('isActive')}
                        </div>
                      </div></th>
                    <th className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className={'table-loader'} colSpan={12}>
                        <Loader />
                      </td>
                    </tr>
                  ) : users.length ? (
                    users.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{skip + index + 1}</td>
                          <td>
                            <img src={item.avatar != null && item.avatar != "" ? (item.avatar.indexOf("http") === 0 ? item.avatar : mainAppUrl + item.avatar) : mainAppUrl + "assets/img/default-user.png"} alt={item.first_name} class="avatar-img" />
                          </td>
                          <td
                            className='detail-wrap text-left' >
                            {item.first_name ? (
                              <div className='profile-title'>
                                <span className='heading'>
                                  {[item.first_name, item.last_name].join(' ')}
                                </span>
                              </div>
                            ) : null}

                            {item.email ? (
                              <div className=''>
                                <span>
                                  <i
                                    className='fa fa-envelope'
                                    aria-hidden='true'
                                  />
                                </span>{' '}
                                <span>{item.email}</span>
                              </div>
                            ) : null}
                          </td>
                          <td>
                            {item.is_verified && item.is_acc_updated ? (
                              <div> Yes </div>
                            ) : (
                              <div> No </div>
                            )}
                          </td>
                          <td>
                            {item.is_paypal_connected ? (
                              <div> Yes </div>
                            ) : (
                              <div> No </div>
                            )}
                          </td>
                          <td>
                            {item.project_count > 0 ? (
                              <div
                                className='view-link'
                                onClick={() => {
                                  logger('Open User details');
                                  this.props.history.push(
                                    AppRoutes.PROJECT + `?search=${item.email}`,
                                  );
                                }}
                              >
                                <span></span>

                                {item.project_count}
                              </div>
                            ) : (
                              0
                            )}
                          </td>
                          <td>
                            {item.total_pledged
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(item.total_pledged)
                              : '$0.00'}
                          </td>
                          <td>
                            {item.personal_donation
                              ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(item.personal_donation)
                              : '$0.00'}
                          </td>
                          <td>
                            <div className='term-check-wrap'>
                              <div className='text-center checkbox-input'>
                                <input
                                  id={`checkSecond_${item.id}`}
                                  className='styled'
                                  checked={
                                    item && item.isFeatured ? true : false
                                  }
                                  type='checkbox'
                                  onChange={e => {
                                    this.handleFeaturedUser(e, item.id, 1);
                                  }}
                                />
                                <label htmlFor={`checkSecond_${item.id}`}></label>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className='term-check-wrap'>
                              <div className='text-center checkbox-input'>
                                <input
                                  id={`checkOne_${item.id}`}
                                  className='styled'
                                  checked={
                                    item && item.is_featured_second
                                  }
                                  type='checkbox'
                                  onChange={e => {
                                    this.handleFeaturedUser(e, item.id, 2);
                                  }}
                                />
                                <label htmlFor={`checkOne_${item.id}`}></label>
                              </div>
                            </div>
                          </td>
                          <td>
                            {item.createdAt ? (
                              <div>
                                {moment(item.createdAt).format(
                                  /* "lll" */
                                  AppConfig.DEFAULT_DATE_FORMAT,
                                )}
                              </div>
                            ) : null}
                          </td>
                          <td className='text-center status-btn-wrap '>
                            {item.isActive && item.isActive === true ? (
                              <React.Fragment>
                                <div className='custom-tooltip'>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      this.activePM(item.id, false);
                                    }}
                                    className='btn theme-btn btn-sm active-btn '
                                    id={`tooltipactive-${item.id}`}
                                  >
                                    Active
                                  </button>
                                  <span className='custom-tooltiptext'>
                                    {' '}
                                    {`Click to deactivated ${item.first_name}`}{' '}
                                  </span>
                                </div>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <div className='custom-tooltip'>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      this.activePM(item.id, true);
                                    }}
                                    className='btn btn-black btn-sm deactive-btn'
                                    id={`tooltipdeactive-${item.id}`}
                                  >
                                    Inactive
                                  </button>
                                  <span className='custom-tooltiptext'>
                                    {' '}
                                    {`Click to activate ${item.first_name}`}{' '}
                                  </span>
                                </div>
                              </React.Fragment>
                            )}
                          </td>

                          <td className='text-center text-center'>
                            <div className='theme-action-btn-wrap custom-tooltip'>
                              <button
                                type='button'
                                className='btn btn-sm proxy-login-title theme-btn action-btn'
                                onClick={() => this.proxyLogin(item.id)}
                                id={`tooltipview-${item.id}`}
                              >
                                <span>
                                  {' '}
                                  <i
                                    className='fa fa-key mr-0'
                                    aria-hidden='true'
                                  ></i>
                                </span>
                              </button>
                              <UncontrolledTooltip
                                target={`tooltipview-${item.id}`}
                              >
                                {`Login to ${item.first_name}'s account`}{' '}
                              </UncontrolledTooltip>
                              <Button variant="danger" size="sm" onClick={() => this.onDelete(item.id)}>
                                <i className="fa fa-trash" style={{ color: 'white' }} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={'12'} className={'text-center'}>
                        <div className='empty-search-section my-4'>
                          <div className='empty-img'>
                            <img src='/assets/img/no-search-found.svg' alt='' />
                          </div>
                          <div className='empty-text'>
                            <p> No User Found.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {!isLoading && totalCount > limit ? (
                <PaginationHelper
                  totalRecords={totalCount}
                  onPageChanged={this.handleSelected}
                  currentPage={selectedPage}
                />
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Users;
