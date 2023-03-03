/** @format */

import * as moment from 'moment';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Validator, { ValidationTypes } from 'js-object-validation';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilMinus } from '@coreui/icons';
import {
  Row,
  Button,
  Col,
  Card,
  CardBody,
  UncontrolledTooltip,
  Label,
  Input,
  FormGroup,
  InputGroup,
  Form,
} from 'reactstrap';
import queryString from 'query-string';
import FileSaver from 'file-saver';
import { AppConfig, mainAppUrl } from '../../Config';
import ApiRoutes from '../../Config/ApiRoutes';
import { ApiHelper } from '../../Helpers/ApiHelper';
import { logger } from '../../Helpers/Logger';
import PaginationHelper from '../../Helpers/Pagination';
import Loader from '../../containers/Loader/Loader';
import PaymentDetailModal from './paymentDetailModal';
import {
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTable,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';

class DonationsViaPaypal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donationList: [],
      selectedDonationId: '',
      transactionId: '',
      amount: '',
      note: '',
      paymentMode: 'paypal',
      searchPaymentBy: 'paypal',
      users: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 50,
      skip: 0,
      search: '',
      searchByStatus: '',
      isActive: true,
      isLoading: true,
      isUpdating: false,
      isExporting: false,
      projects: [],
      category: '',
      open: false,
      errors: {},
      cur_order_field: 'createdAt',
      cur_order_dir: 'desc',
      profileModalShow: false,
    };
  }

  handleInputChange = e => {
    const { errors } = this.state;
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...errors,
        [name]: '',
      },
    });
  };

  showModal = () => {
    this.setState({
      profileModalShow: true
    })
  }

  hideModal = () => {
    this.setState({
      profileModalShow: false
    })
  }

  showProfile = async (id) => {
    console.log(id);

    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.GETUSERPROFILE.service,
      ApiRoutes.GETUSERPROFILE.url,
      ApiRoutes.GETUSERPROFILE.method,
      ApiRoutes.GETUSERPROFILE.authenticate,
      {
        id
      },
    );

    console.log(res);

    if (res && !res.isError) {

      this.showModal();
    } else {
      toast.error(res.messages[0], {
        position: toast.POSITION.TOP_RIGHT
      });
    }

  }

  handleChange = async e => {
    const { target } = e;
    const { name, value } = target;
    await this.setState({
      [name]: value,
      isLoading: true,
    });

    await this.props.history.push(
      `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}&searchPaymentBy=${this.state.searchPaymentBy}`,
    );
    this.getDonationsViaPaypal();
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

    await this.props.history.push(
      `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}&searchPaymentBy=${this.state.searchPaymentBy}`,
    );
    this.getDonationsViaPaypal();
  };

  handleSearchPaymentBy = async e => {
    const { target } = e;
    const { name, value } = target;
    this.setState(() => ({
      [name]: value,
      totalCount: 0,
      selectedPage: 1,
      isLoading: true,
    }), async () => {
      await this.props.history.push(
        `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}&searchPaymentBy=${this.state.searchPaymentBy}`,
      );
      this.getDonationsViaPaypal();
    });


  };

  handleSelected = async page => {
    this.setState(
      {
        selectedPage: page,
        skip: this.state.limit * (page - 1),
        isLoading: true,
      },
      () => {
        this.getDonationsViaPaypal();
      },
    );
  };

  toggle = (selectedDonationId, payoutAmount) => {
    this.setState(prevState => ({
      open: !prevState.open,
      selectedDonationId,
      amount: payoutAmount,
    }));
  };

  updatePayoutStatus = async e => {
    e.preventDefault();
    const {
      amount,
      donationList,
      selectedDonationId,
      transactionId,
      note,
      paymentMode,
    } = this.state;
    try {
      const validator = {
        transactionId: {
          [ValidationTypes.REQUIRED]: true,
        },
        amount: {
          [ValidationTypes.REQUIRED]: true,
        },
      };
      const messages = {
        transactionId: {
          [ValidationTypes.REQUIRED]: 'Please enter transaction id.',
        },
        amount: {
          [ValidationTypes.REQUIRED]: 'Please enter amount.',
        },
      };
      let data = {
        donationId: selectedDonationId,
        transactionId,
        amount,
        note,
        paymentMode,
      };
      let { isValid, errors } = Validator(data, validator, messages);
      if (amount <= 0) {
        isValid = false;
        errors = {
          ...errors,
          amount: 'Amount should be greater than 0.',
        };
      }
      if (!isValid) {
        this.setState({
          errors,
        });
        return;
      }
      let fundRaiserDetails = {};
      if (selectedDonationId) {
        fundRaiserDetails = donationList.filter(
          item => selectedDonationId === item.donation_id,
        )[0];
      }
      if (fundRaiserDetails) {
        data = {
          ...data,
          directDonation: fundRaiserDetails.direct_donation,
          project:
            !fundRaiserDetails.direct_donation && fundRaiserDetails.Project
              ? fundRaiserDetails.Project.name
              : '',
          fundRaiserDetails: fundRaiserDetails.fundRaiserInfo || {},
        };
      }
      this.setState({
        isUpdating: true,
      });
      const res = await new ApiHelper().FetchFromServer(
        ApiRoutes.UPATE_PAYOUT_STATUS.service,
        ApiRoutes.UPATE_PAYOUT_STATUS.url,
        ApiRoutes.UPATE_PAYOUT_STATUS.method,
        ApiRoutes.UPATE_PAYOUT_STATUS.authenticate,
        undefined,
        data,
      );
      this.setState({
        selectedDonationId: '',
        transactionId: '',
        amount: '',
        note: '',
        paymentMode: 'paypal',
        isUpdating: false,
        open: false,
      });
      if (res && !res.isError) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error, 'eeeeeeeeeeeeeee');
    }
    this.getDonationsViaPaypal();
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

  onSearch = async e => {
    e.preventDefault();
    await this.setState({
      selectedPage: 1,
      totalCount: 0,
      skip: 0,
      isLoading: true,
    });
    await this.props.history.push(
      `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}`,
    );
    this.getDonationsViaPaypal();
  };

  onReset = async e => {
    e.preventDefault();
    this.setState(
      {
        search: '',
        selectedPage: 1,
        totalCount: 0,
        skip: 0,
        searchByStatus: '',
        category: '',
        ids: '',
        isLoading: true,
      },

      () => {
        this.props.history.push(
          `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}`,
        );
        this.getDonationsViaPaypal();
      },
    );
  };

  componentDidMount = async e => {
    const parsed = queryString.parse(this.props.location.search);

    if (parsed.search) {
      await this.setState({
        search: parsed.search,
      });
    }

    if (parsed.searchPaymentBy) {
      await this.setState({
        searchPaymentBy: parsed.searchPaymentBy,
      });
    }

    if (parsed.searchByStatus) {
      await this.setState({
        searchByStatus: parsed.searchByStatus,
      });
    }
    this.getDonationsViaPaypal();
  };

  getDonationsViaPaypal = async e => {
    const { selectedPage, limit, search, searchByStatus, searchPaymentBy, cur_order_field, cur_order_dir } = this.state;

    await this.setState({
      isLoading: true
    });

    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_DONATIONS.service,
      ApiRoutes.GET_DONATIONS.url,
      ApiRoutes.GET_DONATIONS.method,
      ApiRoutes.GET_DONATIONS.authenticate,
      {
        limit: limit,
        page: selectedPage,
        search,
        searchPaymentBy,
        searchByStatus,
        order_field: cur_order_field,
        order_dir: cur_order_dir
      },
    );

    if (res.data && res.data.success) {
      await this.setState({
        donationList: res.data.data.rows,
        totalCount: res.data.data.count,
        isLoading: false,
      });
    }

    await this.setState({
      isLoading: false
    });
  };

  exportExcelReport = async () => {
    this.setState({
      isExporting: true,
    });
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EXPORT_PAYPAL_DONATIONS.service,
      ApiRoutes.EXPORT_PAYPAL_DONATIONS.url,
      ApiRoutes.EXPORT_PAYPAL_DONATIONS.method,
      ApiRoutes.EXPORT_PAYPAL_DONATIONS.authenticate,
      undefined,
      undefined,
      'blob',
    );
    if (response && !response.isError) {
      let blob = new Blob([response.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(
        blob,
        moment().format('YYYY_MM_DD') + '_paypal_donation_report.xlsx',
      );
      this.setState({
        isExporting: false,
      });
    }
  };

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

    setTimeout(() => { this.getDonationsViaPaypal(); }, 50);

  }

  render() {
    const {
      donationList,
      errors,
      isLoading,
      isUpdating,
      isExporting,
      totalCount,
      limit,
      open,
      skip,
      selectedPage,
      search,
      searchPaymentBy,
      searchByStatus,
      selectedDonationId,
      transactionId,
      amount,
      note,
      paymentMode,
    } = this.state;
    let selectedDonationsDetail = {};
    if (selectedDonationId) {
      selectedDonationsDetail = donationList.filter(
        item => selectedDonationId === item.donation_id,
      )[0];
    }
    return (
      <Row>
        <Col xs={'12'} lg={'12'}>
          <Card>
            <CardBody>
              <div className='donation-list-header'>
                <div className={'filter-block'}>
                  <Form onSubmit={this.onSearch}>
                    <Row>
                      <Col lg='2' md='2' className='mb-0'>
                        <FormGroup className='mb-0'>
                          <Label className='label'>Search</Label>
                          <InputGroup className='mb-2'>
                            <input
                              type='text'
                              name='search'
                              onChange={this.handleChange}
                              className='form-control'
                              aria-describedby='searchUser'
                              placeholder='By project name'
                              value={search}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg='2' md='2' className='mb-0'>
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
                            <option value={'1'}>Paid</option>
                            <option value={'0'}>Unpaid</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg='2' md='2' className='mb-0'>
                        <FormGroup className='mb-0'>
                          <Label for='searchPaymentBy' className='label'>
                            Payment by
                          </Label>
                          <Input
                            type='select'
                            name='searchPaymentBy'
                            id='searchPaymentBy'
                            value={searchPaymentBy || ''}
                            onChange={this.handleSearchPaymentBy}
                          >
                            <option className='form-control' value={''}>
                              All
                            </option>
                            <option value='paypal'>Paypal</option>
                            <option value='stripe'>Stripe</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg='2' md='2' className='mb-0'>
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
                            <span className='px-2'>
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
                <div className='export-block'>
                  <Button
                    onClick={this.exportExcelReport}
                    disabled={isExporting}>
                    {isExporting ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>
              </div>
              <CTable
                responsive
                bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>S.no</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className='justify-content-center'>Fundraiser Details</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className='text-left'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='project'>
                        <div>Project</div>
                        <div>
                          {this.renderSort('project')}
                        </div>
                      </div>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className='text-left'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='profile'>
                        <div>Profile</div>
                        <div>
                          {this.renderSort('profile')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" >
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='amount'>
                        <div>Amount</div>
                        <div>
                          {this.renderSort('amount')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" >
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='website_amount'>
                        <div>Platform fee</div>
                        <div>
                          {this.renderSort('website_amount')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" >
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='tip_percentage'>
                        <div>Tip</div>
                        <div>
                          {this.renderSort('tip_percentage')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" >
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='transferred_amount'>
                        <div>Transfer Amount</div>
                        <div>
                          {this.renderSort('transferred_amount')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" >
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='createdAt'>
                        <div>Payment Date</div>
                        <div>
                          {this.renderSort('createdAt')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" >
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='payment_by'>
                        <div>Payment By</div>
                        <div>
                          {this.renderSort('payment_by')}
                        </div>
                      </div></CTableHeaderCell>
                    <CTableHeaderCell scope="col" className='justify-content-center'>
                      <div className='d-flex justify-content-between cur-pointer' onClick={this.onSort} data-field='payment_status'>
                        <div>Status</div>
                        <div>
                          {this.renderSort('payment_status')}
                        </div>
                      </div></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {isLoading && (
                    <CTableRow>
                      <CTableDataCell className={'table-loader'} colSpan={12}>
                        <Loader />
                      </CTableDataCell>
                    </CTableRow>
                  )}
                  {!isLoading && donationList?.map((item, index) => {
                    return (
                      <CTableRow key={index}>
                        <CTableDataCell>{skip + index + 1}</CTableDataCell>
                        <CTableDataCell className='detail-wrap text-left'>
                          <div className='user-title'>
                            <span>
                              <i
                                className='fa fa-user'
                                aria-hidden='true'
                              ></i>{' '}
                            </span>
                            <span
                              className='view-link'>
                              {item.fundRaiserInfo
                                ? [
                                  item.fundRaiserInfo.first_name,
                                  item.fundRaiserInfo.last_name,
                                ].join(' ')
                                : null}
                            </span>
                          </div>
                          {item.fundRaiserInfo &&
                            item.fundRaiserInfo.email ? (
                            <div>
                              <span>
                                <i
                                  className='fa fa-envelope'
                                  aria-hidden='true'
                                />
                              </span>{' '}
                              <span className='view-link'>
                                {item.fundRaiserInfo?.email ?? '-'}
                              </span>
                            </div>
                          ) : null}
                          {item.fundRaiserInfo &&
                            item.fundRaiserInfo.Donation ? (
                            <div>
                              <span>
                                <i
                                  className='fa fa-envelope'
                                  aria-hidden='true'
                                ></i>{' '}
                              </span>
                              <span>Paypal Email:</span>{' '}
                              <span className='link-tile'>
                                {item.fundRaiserInfo.Donation.paypal_email ||
                                  '-'}
                              </span>
                            </div>
                          ) : null}
                          {item.fundRaiserInfo &&
                            item.fundRaiserInfo.Donation ? (
                            <div>
                              <span>
                                <i
                                  className='fa fa-phone'
                                  aria-hidden='true'
                                ></i>{' '}
                              </span>
                              <span>Paypal Mobile Number:</span>{' '}
                              <span className='link-tile'>
                                {item.fundRaiserInfo.Donation.paypal_mobile ||
                                  '-'}
                              </span>
                            </div>
                          ) : null}
                          {item.fundRaiserInfo &&
                            item.fundRaiserInfo.Donation ? (
                            <div className='text-capitalize'>
                              <span>
                                <i
                                  className='fa fa-id-card'
                                  aria-hidden='true'
                                ></i>{' '}
                                Account number:
                              </span>{' '}
                              <span className='link-tile'>
                                {item.fundRaiserInfo.Donation
                                  .account_number || '-'}
                              </span>
                            </div>
                          ) : null}
                          {item.fundRaiserInfo &&
                            item.fundRaiserInfo.Donation ? (
                            <div className='text-capitalize'>
                              <span>
                                <i className='fa fa-route'></i>
                              </span>
                              <span>
                                <span>
                                  <i
                                    className='fa fa-link'
                                    aria-hidden='true'
                                  ></i>{' '}
                                </span>{' '}
                                Routing number:
                              </span>{' '}
                              <span className='link-tile'>
                                {item.fundRaiserInfo.Donation
                                  .routing_number || '-'}
                              </span>
                            </div>
                          ) : null}
                          <div>Paypal onboarding <CIcon style={{ color: item.fundRaiserInfo.is_paypal_connected ? '#23de44' : '#de2344' }} icon={item.fundRaiserInfo.Donation?.paypal_merchant_id ? cilCheckCircle : cilMinus} /></div>
                          <div>Stripe onboarding <CIcon style={{ color: item.fundRaiserInfo.is_acc_updated ? '#23de44' : '#de2344' }} icon={item.fundRaiserInfo.Donation?.account_id ? cilCheckCircle : cilMinus} /></div>
                        </CTableDataCell>
                        <CTableDataCell className='text-left'>
                          {item.project_id != null
                            ? (item['Project.name'] ? (
                              <a href={mainAppUrl + item['Project.url']} target="_blank">{
                                item['Project.name']}
                              </a>) : '-') : '-'}
                        </CTableDataCell>
                        <CTableDataCell className='text-left'>
                          {item.project_id == null
                            ? item.User && (
                              <a href={mainAppUrl + item.User.profileUrl} target="_blank">{
                                [
                                  item.User.first_name,
                                  item.User.last_name,
                                ].join(' ')}
                              </a>)
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.amount
                            ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(item.amount)
                            : '$0.00'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.website_amount
                            ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(item.website_amount)
                            : '$0.00'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.tip_amount
                            ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(item.tip_amount)
                            : '$0.00'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.payout_amount
                            ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(item.payout_amount)
                            : '$0.00'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.createdAt && (
                            <div>
                              {moment(item.createdAt).format(AppConfig.DEFAULT_DATE_FORMAT)}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.payment_by}
                        </CTableDataCell>
                        <CTableDataCell className='justify-content-center status-btn-wrap'>
                          {(item.payment_by === 'stripe' || item.payout_succeed) && (
                            <h5>
                              <CBadge color="success" size='xl' shape="rounded-pill">Paid</CBadge>
                            </h5>
                          )}
                          {(item.payment_by === 'paypal' && !item.payout_succeed) && (

                            <div className='custom-tooltip'>
                              <button
                                type='button'
                                onClick={() => {
                                  this.toggle(
                                    item.donation_id,
                                    item.payout_amount,
                                  );
                                }}
                                className='btn btn-black btn-sm deactive-btn'
                                id={`tooltipdeactive-${item.id}`}
                              >
                                Unpaid
                              </button>
                              <span className='custom-tooltiptext tooltip-left-project left-tool-tip'>
                                Click here to mark as paid
                              </span>
                            </div>

                          )}
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                  {!isLoading && donationList.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan={'12'} className={'justify-content-center'}>
                        <div className='empty-search-section my-4'>
                          <div className='empty-img'>
                            <img src='/assets/img/no-search-found.svg' alt='' />
                          </div>
                          <div className='empty-text'>
                            <p>No Donations has been made via {searchPaymentBy} yet.</p>
                          </div>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
              {!isLoading && totalCount > limit ? (
                <PaginationHelper
                  totalRecords={totalCount}
                  onPageChanged={this.handleSelected}
                  currentPage={selectedPage}
                />
              ) : null}
              <PaymentDetailModal
                isLoading={isUpdating}
                errors={errors}
                transactionId={transactionId}
                amount={amount}
                note={note}
                paymentMode={paymentMode}
                open={open}
                selectedDonationsDetail={selectedDonationsDetail}
                toggle={this.toggle}
                handleInputChange={this.handleInputChange}
                updatePayoutStatus={this.updatePayoutStatus}
              />
            </CardBody>
          </Card>
        </Col>
        <CModal visible={this.state.profileModalShow} onClose={() => this.hideModal()}>
          <CModalHeader onClose={() => this.hideModal()}>
            <CModalTitle>Modal title</CModalTitle>
          </CModalHeader>
          <CModalBody>Woohoo, you're reading this text in a modal!</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => this.hideModal()}>
              Close
            </CButton>
            <CButton color="primary">Save changes</CButton>
          </CModalFooter>
        </CModal>
      </Row>
    );
  }
}

export default DonationsViaPaypal;
