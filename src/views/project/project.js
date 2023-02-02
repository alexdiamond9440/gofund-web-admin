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
// import { Link } from "react-router-dom";
import { ApiHelper } from '../../Helpers/ApiHelper';
import { AppConfig } from '../../Config';
import ApiRoutes from '../../Config/ApiRoutes';
import Loader from '../../containers/Loader/Loader';
import { logger } from '../../Helpers/Logger';
import PaginationHelper from '../../Helpers/Pagination';
import { ConfirmBox } from '../../Helpers/SweetAlert';
import { backendUrl, frontUrl } from '../../Config/AppConfig';
import { AppRoutes } from '../../Config/AppRoutes';
const queryString = require('query-string');
class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 50,
      skip: 0,
      search: '',
      searchByStatus: '',
      isActive: true,
      isLoading: true,
      projects: [],
      category: '',
      filter: '',
      isFeatured: false,
    };
  }

  handleChange = async (e) => {
    const { target } = e;
    const { name, value } = target;
    await this.setState({
      [name]: value,
      isLoading: true,
    });

    await this.props.history.push(
      `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}&filter=${this.state.filter}`
    );
    await this.getprojectinfo();
  };

  handleSearchByStatus = async (e) => {
    // console.log("safv");
    // console.log(e.target.value);
    const { target } = e;
    const { name, value } = target;
    await this.setState({
      [name]: value,
      totalCount: 0,
      selectedPage: 1,
      isLoading: true,
    });

    await this.props.history.push(
      `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}&filter=${this.state.filter}`
    );
    await this.getprojectinfo();
  };

  handleFilter = async (e) => {
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
      `?search=${search}&searchByStatus=${searchByStatus}&filter=${filter}`
    );
    await this.getprojectinfo();
  };

  handleSelected = async (page) => {
    this.setState(
      {
        selectedPage: page,
        skip: this.state.limit * (page - 1),
        isLoading: true,
      },
      () => {
        this.getprojectinfo();
      }
    );
  };

  activeproject = async (id, isActive) => {
    try {
      // console.log("id", id);

      const { value } = await ConfirmBox({
        title: 'Are you sure?',
        text:
          isActive === true
            ? 'You want to change the status'
            : 'You want to change the status',
      });
      if (!value) {
        return;
      }
      // console.log("id", id);
      let status = '';
      if (isActive) {
        status = 'live';
      } else {
        status = 'draft';
      }
      let projectId = id;
      let data = { status, projectId };
      if (value) {
        const res = await new ApiHelper().FetchFromServer(
          ApiRoutes.CHANGESTATUS.service,
          ApiRoutes.CHANGESTATUS.url,
          ApiRoutes.CHANGESTATUS.method,
          ApiRoutes.CHANGESTATUS.authenticate,
          undefined,
          data
        );

        // console.log("re-stat", res);
        if (res.data.success) {
          toast.success(
            isActive === true
              ? 'Project activated successfully'
              : 'Project deactivated successfully',
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }
      }
    } catch (error) {
      logger(error);
    }
    this.getprojectinfo();
  };

  handleActionChange = (e) => {
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

  onSearch = async (e) => {
    e.preventDefault();
    // console.log("onSearch", this.state.search);
    await this.setState({
      selectedPage: 1,
      totalCount: 0,
      skip: 0,
      isLoading: true,
    });
    await this.props.history.push(
      `?search=${this.state.search}&category=${this.state.category}&searchByStatus=${this.state.searchByStatus}&filter=${this.state.filter}`
    );
    this.getprojectinfo();
  };

  onReset = async (e) => {
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
        filter: '',
        isLoading: true,
      },

      () => {
        this.props.history.push(AppRoutes.PROJECT);
        this.getprojectinfo();
      }
    );
  };

  getprojectinfo = async (e) => {
    const {
      selectedPage,
      limit,
      search,
      searchByStatus,
      category,filter
    } = this.state;
    // console.log("did mount", selectedPage);
    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.GETPROJECTS.service,
      ApiRoutes.GETPROJECTS.url,
      ApiRoutes.GETPROJECTS.method,
      ApiRoutes.GETPROJECTS.authenticate,
      {
        page: selectedPage,
        limit: limit,
        search: search,
        searchByStatus,
        category,
        filter
      }
    );

    if (res.data.success) {
      await this.setState({
        projects: res.data.data,
        totalCount: res.data.totalCount,
        isLoading: false,
      });
    }
    // console.log("res*********", res);
  };

  // componentDidUpdate = async (prevProps, prevState) => {
  //   if (prevProps.location.search !== this.props.location.search) {
  //     let parsed = queryString.parse(this.props.location.search);

  //     if (parsed.type === "2") {
  //       this.setState({
  //         unlimited: true
  //       });
  //     }
  //     if (parsed.type === "undefined") {
  //       this.setState({ type: "" });
  //     } else {
  //       this.setState({ type: parsed.type });
  //     }
  //     if (parsed.search === "undefined") {
  //       this.setState({ search: "" });
  //     } else {
  //       this.setState(
  //         { search: parsed.search, totalCount: 0, selectedPage: 1 },
  //         () => {
  //           this.getUsers();
  //         }
  //       );
  //     }
  //     if (parsed.page === undefined || parsed.page === "undefined") {
  //       this.setState(
  //         {
  //           selectedPage: 1,
  //           skip: this.state.limit * (1 - 1),
  //           totalCount: 0
  //         },
  //         () => {
  //           this.getUsers();
  //         }
  //       );
  //     } else if (parsed.page !== undefined || parsed.page !== "undefined") {
  //       this.setState(
  //         {
  //           selectedPage: parsed.page,
  //           skip: this.state.limit * (parsed.page - 1)
  //         },
  //         () => {
  //           this.getUsers();
  //         }
  //       );
  //     }
  //   }
  // };
  componentDidMount = async (e) => {
    let parsed = queryString.parse(this.props.location.search);
    // console.log("parsed", parsed);
    if (parsed.search) {
      await this.setState({
        search: parsed.search,
      });
    }
    this.getprojectinfo();
  };
  // to change feature project status
  handleFeaturedProject = async (e, id) => {
    const { target } = e;
    const { checked } = target;
    // console.log('checked', checked);
    // const { isFeatured } = this.state;
    this.setState({
      isFeatured: checked,
    });
    // console.log('isFeatured', isFeatured);

    try {
      const { value } = await ConfirmBox({
        title: 'Are you sure?',
        text:
          checked === true
            ? 'Do you want to feature this project'
            : 'Do you want to unfeature this project',
      });
      if (!value) {
        return;
      }
      let projectId = id;
      let data = { isFeatured: checked, projectId };
      if (value) {
        // api to update featured project
        const res = await new ApiHelper().FetchFromServer(
          ApiRoutes.UPDATE_FEATURED_PROJECT.service,
          ApiRoutes.UPDATE_FEATURED_PROJECT.url,
          ApiRoutes.UPDATE_FEATURED_PROJECT.method,
          ApiRoutes.UPDATE_FEATURED_PROJECT.authenticate,
          undefined,
          data
        );
        if (res.data.success) {
          toast.success(
            checked === true
              ? 'Project featured successfully'
              : 'Project unfeatured successfully',
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        } else {
          toast.error(res.data.message);
        }
        // console.log();
        // console.log('res.data ', res.data);
      }
    } catch (error) {
      logger(error);
    }
    this.getprojectinfo();
  };
  render() {
    const {
      isLoading,
      totalCount,
      limit,
      category,
      skip,
      selectedPage,
      search,
      searchByStatus,
      filter,
      projects,
    } = this.state;
    // console.log("projects*******", projects);
    // console.log("isLoading", isLoading);
    return (
      <Row>
        <Col xs={'12'} lg={'12'}>
          <Card>
            {/* <CardHeader>
              <h4>
                <i className="fa fa-tasks" /> Projects
              </h4>
            </CardHeader> */}
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
                            placeholder='By Name, Email, Location'
                            value={search}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>

                    <Col lg={'3'} md={'3'} className='mb-0'>
                      <FormGroup className='mb-0'>
                        <Label for='exampleSelect' className='label'>
                          Category
                        </Label>
                        <Input
                          type='select'
                          name='category'
                          id='exampleSelect'
                          value={category || ''}
                          onChange={this.handleSearchByStatus}
                        >
                          <option className='form-control' value={''}>
                            -- Select category --
                          </option>
                          <option value={'business'}>Business</option>
                          <option value={'community'}>Community</option>
                          <option value={'personal'}>Personal</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg={'2'} md={'2'} className='mb-0'>
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
                          <option value={'live'}>Active</option>
                          <option value={'draft'}>Inactive</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg={'2'} md={'2'} className='mb-0'>
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
                    <Col lg={'2'} md={'2'} className='mb-0'>
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
                    <th className='text-center'>Image</th>

                    <th className='text-left'>Project Details</th>
                    <th>Donation Goal</th>
                    <th>Donation Achieved</th>
                    <th className='text-center'>Featured</th>
                    <th>Created Date</th>

                    {/* <th>Project Caption</th> */}
                    {/* <th>Created Date</th> */}
                    <th className='text-center'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className={'table-loader'} colSpan={12}>
                        <Loader />
                      </td>
                    </tr>
                  ) : projects.length ? (
                    projects.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{skip + index + 1}</td>
                          <td className='text-center'>
                            <div className='img-section'>
                              <img
                                className='setimage'
                                src={`${
                                  item.thumbnail_image
                                    ? [backendUrl, item.thumbnail_image]
                                        .join('')
                                        .trim()
                                    : '/assets/img/user.svg'
                                } `}
                                alt={item.Image}
                              />
                            </div>
                          </td>
                          <td className='detail-wrap text-left'>
                            <div className='profile-title'>
                              <span className='heading'>
                                {item.name ? item.name : null}
                              </span>
                            </div>
                            <div className='user-title'>
                              <span>
                                <i
                                  className='fa fa-user'
                                  aria-hidden='true'
                                ></i>{' '}
                              </span>
                              <span
                                className='view-link'
                                onClick={() => {
                                  logger('Open User details');
                                  this.props.history.push(
                                    AppRoutes.USERS +
                                      `?search=${item.User.first_name}`
                                  );
                                }}
                              >
                                {' '}
                                {[
                                  item.User.first_name,
                                  item.User.last_name,
                                ].join(' ')}
                              </span>
                            </div>
                            {item.User.email ? (
                              <div
                                onClick={() => {
                                  logger('Open User details');
                                  this.props.history.push(
                                    AppRoutes.USERS +
                                      `?search=${item.User.email}`
                                  );
                                }}
                              >
                                <span>
                                  <i
                                    className='fa fa-envelope'
                                    aria-hidden='true'
                                  />
                                </span>{' '}
                                <span className='view-link'>
                                  {item.User.email}
                                </span>
                              </div>
                            ) : null}

                            {/* 
                            {item.project_location ? (
                              <div>
                                <i
                                  class="fa fa-map-marker"
                                  aria-hidden="true"
                                />
                                {item.project_location}
                              </div>
                            ) : null} */}

                            {item.url ? (
                              <div>
                                <span>
                                  <i
                                    className='fa fa-link'
                                    aria-hidden='true'
                                  />
                                </span>{' '}
                                <span className='link-tile'>
                                  <a
                                    href={`${frontUrl}${item.url}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='dropdown-item-app'
                                  >
                                    {frontUrl}
                                    {item.url}
                                  </a>
                                </span>
                              </div>
                            ) : null}
                            {item.category ? (
                              <div className='catagary-title'>
                                {' '}
                                <span>
                                  {' '}
                                  <i className='fa fa-tag' aria-hidden='true' />
                                </span>
                                <span> {item.category} </span>
                                {/* <span className="ml-2">
                                  {" "}
                                  <i class="fa fa-comment" aria-hidden="true" />
                                </span>
                                
                                  <Link to="#" className="view-link">
                                    {" "}
                                    Comments{" "}
                                  </Link> */}
                              </div>
                            ) : null}
                          </td>
                          {/* <td>
                            {item.User && item.User.first_name ? (
                              <div>{[item.User.first_name].join(" ")}</div>
                            ) : null}
                          </td> */}
                          {/* <td>{item.url ? `${frontUrl}${item.url}` : null}</td> */}
                          <td>
                            {item.amount
                              ? new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(item.amount)
                              : '$0.00'}
                          </td>
                          <td>
                            <div className='donation-raised-price'>
                              {item.total_pledged
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(item.total_pledged)
                                : '$0.00'}
                            </div>
                            {/* <Progress
                              completed={
                                (item.total_pledged / item.amount) * 100
                              }
                            /> */}
                            <br />
                            <div
                              className='progress raised-progress-wrap'
                              id={`progress${item.id}`}
                            >
                              <div
                                className='progress-bar'
                                role='progressbar'
                                style={{
                                  width: `${
                                    (Math.floor(item.total_pledged) /
                                      item.amount) *
                                    100
                                  }%`,
                                }}
                                aria-valuenow={
                                  (item.total_pledged / item.amount) * 100
                                }
                                aria-valuemin='0'
                                aria-valuemax='100'
                                // id={`progress${item.id}`}
                              ></div>
                              <UncontrolledTooltip
                                target={`progress${item.id}`}
                              >
                                {(
                                  (Math.floor(item.total_pledged) /
                                    item.amount) *
                                  100
                                ).toFixed(2) + '% achieved'}
                              </UncontrolledTooltip>
                            </div>
                          </td>
                          <td>
                            {/* <Input
                              type='checkbox'
                              checked={item && item.isFeatured ? true : false}
                              // disabled={!list.fileName}
                              onChange={(e) => {
                                this.handleFeaturedProject(e, item.id);
                              }}
                            /> */}
                            <div className='term-check-wrap'>
                              <div className='text-center checkbox-input'>
                                <input
                                  id={`checkOne_${item.id}`}
                                  className='styled'
                                  checked={
                                    item && item.isFeatured ? true : false
                                  }
                                  type='checkbox'
                                  onChange={(e) => {
                                    this.handleFeaturedProject(e, item.id);
                                  }}
                                />
                                <label htmlFor={`checkOne_${item.id}`}></label>
                              </div>
                            </div>
                          </td>

                          {/* <td>{item.punch_line ? item.punch_line : null}</td> */}
                          <td>
                            {item.createdAt ? (
                              <div>
                                {moment(item.createdAt).format(
                                  /* "lll" */
                                  AppConfig.DEFAULT_DATE_FORMAT
                                )}
                              </div>
                            ) : null}
                          </td>
                          <td className='text-center status-btn-wrap'>
                            {item.status && item.status === 'live' ? (
                              <React.Fragment>
                                <div className='custom-tooltip'>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      this.activeproject(item.id, false);
                                    }}
                                    className='btn theme-btn btn-sm active-btn'
                                    id={`tooltipactive-${item.id}`}
                                  >
                                    Active
                                  </button>
                                  <span className='custom-tooltiptext tooltip-left-project'>
                                    {' '}
                                    {`Click to deactivated project`}{' '}
                                  </span>
                                </div>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <div className='custom-tooltip'>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      this.activeproject(item.id, true);
                                    }}
                                    className='btn btn-black btn-sm deactive-btn'
                                    id={`tooltipdeactive-${item.id}`}
                                  >
                                    Inactive
                                  </button>
                                  <span className='custom-tooltiptext tooltip-left-project'>
                                    {' '}
                                    {`Click to activate project`}{' '}
                                  </span>
                                </div>
                                {/* <UncontrolledTooltip
                                  target={`tooltipdeactive-${item.id}`}
                                >
                                  {`Click to activate project`}
                                </UncontrolledTooltip> */}
                              </React.Fragment>
                            )}
                          </td>
                          {/*   <td className="text-center action-btn-wrap">
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() =>
                                this.props.history.push(
                                  AppRoutes.PM_PROFILE_DETAILS.replace(
                                    ":id",
                                    item._id
                                  )
                                )
                              }
                              id={`tooltip-view-${item._id}`}
                            >
                              <i className="fa fa-eye" />
                            </button>
                            <UncontrolledTooltip
                              target={`tooltip-view-${item._id}`}
                            >
                              {`View details of ${item.fullName}`}
                            </UncontrolledTooltip>

                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() =>
                                this.props.history.push(
                                  AppRoutes.PM_PROFILE_EDIT.replace(
                                    ":id",
                                    item._id
                                  )
                                )
                              }
                              id={`tooltip-edit-${item._id}`}
                            >
                              <i className="fa fa-edit" />
                            </button>
                            <UncontrolledTooltip
                              target={`tooltip-edit-${item._id}`}
                            >
                              {`Edit details of ${item.fullName}`}
                            </UncontrolledTooltip>
                            <button
                              type="button"
                              className="btn btn-sm red"
                              onClick={() => {
                                this.delete(item._id, true);
                              }}
                              id={`tooltip-delete-${item._id}`}
                            >
                              <i className="fa fa-trash" />
                            </button>
                            <UncontrolledTooltip
                              target={`tooltip-delete-${item._id}`}
                            >
                              {`Delete ${item.fullName}`}
                            </UncontrolledTooltip>
                          </td> */}
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
                            <p>No project Found.</p>
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

export default Projects;
