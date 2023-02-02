import * as moment from "moment";
import React, { Component } from "react";
import { toast } from "react-toastify";
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
  Form
} from "reactstrap";
import { ApiHelper } from "../../Helpers/ApiHelper";
import ApiRoutes from "../../Config/ApiRoutes";
import { AppConfig } from "../../Config";
import Loader from "../../containers/Loader/Loader";
import { logger } from "../../Helpers/Logger";
import PaginationHelper from "../../Helpers/Pagination";
import { ConfirmBox } from "../../Helpers/SweetAlert";
import ReadMoreAndLess from 'react-read-more-less';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 10,
      skip: 0,
      search: "",
      isActive: "",
      statusActive: "",
      isLoading: true,
      searchByStatus:""
    };
  }
  handleChange = e => {
    // console.log(e.target.value);
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    this.getComments();
  }

  getComments = async e => {
    const { selectedPage, limit, search, searchByStatus } = this.state;
    // console.log("get user", selectedPage);
    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.GETALLCOMMENTS.service,
      ApiRoutes.GETALLCOMMENTS.url,
      ApiRoutes.GETALLCOMMENTS.method,
      ApiRoutes.GETALLCOMMENTS.authenticate,
      { page: selectedPage, limit: limit, search: search, searchByStatus:searchByStatus }
    );
    // console.log(res.data);
    if (res.data.success) {
      await this.setState({
        users: res.data.data,
        totalCount: res.data.totalCount,
        isLoading: false
      });
    }
    // console.log("res*********", res);
  };

  handleSearchByStatus = e => {
    // console.log("safv");
    // console.log(e.target.value);
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      totalCount: 0,
      selectedPage: 1
    });
  };

  handleSelected = async page => {
    this.setState(
      {
        selectedPage: page,
        skip: this.state.limit * (page - 1)
      },
      () => {
        this.getComments();
      }
    );
  };

  delete = async (id, isDeleted) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this Project Manager!"
    });
    if (!value) {
      return;
    }
    toast.success("Project Manager deleted successfully", {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  handleActionChange = e => {
    const { ids } = this.state;
    if (!ids.length) {
      toast.info("Please select at least one user.");
      return;
    }
    const value = e.target.value;
    if (value.toLowerCase() === "active") {
      logger("Activate Users");
    } else if (value.toLowerCase() === "deactive") {
      logger("Deactivate Users");
    } else if (value.toLowerCase() === "Delete") {
      logger("Delete Users");
    }
  };

  activePM = async (id, status) => {
    try {
      // console.log("id", id);

      const { value } = await ConfirmBox({
        title: "Are you sure?",
        text:
          status === true
            ? "Do you want to activate this comment."
            : "Do you want to deactivate this comment."
      });
      if (!value) {
        return;
      }
      // console.log("id", id);
      const data = { id: id, status: status };
      if (value) {
        const res = await new ApiHelper().FetchFromServer(
          ApiRoutes.UPDATE_COMMENT_STATUS.service,
          ApiRoutes.UPDATE_COMMENT_STATUS.url,
          ApiRoutes.UPDATE_COMMENT_STATUS.method,
          ApiRoutes.UPDATE_COMMENT_STATUS.authenticate,
          undefined,
          data
        );

        // console.log("re-stat", res);
        if (res.data.success) {
          toast.success(
            status === true
              ? "Comment activated successfully"
              : "Comment deactivated successfully",
            {
              position: toast.POSITION.TOP_RIGHT
            }
          );
        }
      }
    } catch (error) {
      logger(error);
    }
    this.getComments();
  };

  onSearch = async e => {
    e.preventDefault();
    await this.setState({
      selectedPage: 1,
      totalCount: 0,
      skip: 0
    });
    this.getComments();
  };

  onReset = async e => {
    // console.log('assc')
    e.preventDefault();
    this.setState(
      {
        search: "",
        selectedPage: 1,
        totalCount: 0,
        skip: 0,
        statusActive: "",
        ids: "",
        searchByStatus:""
      },
      () => {
        this.getComments();
      }
    );
  };

  render() {
    const {
      users,
      isLoading,
      totalCount,
      limit,
      skip,
      selectedPage,
      search,
      searchByStatus
    } = this.state;
    // console.log("res*********", users);
    // console.log("isLoading", totalCount);
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            {/* <CardHeader>
              <h4>
                <i className="fa fa-comments-o" /> Comments
              </h4>
            </CardHeader> */}
            <CardBody>
              <div className={"filter-block"}>
                <Form onSubmit={this.onSearch}>
                  <Row>
                    <Col lg={"3"} md={"3"} className="mb-0">
                      <FormGroup className="mb-0">
                        <Label className="label">Search</Label>
                        <InputGroup className="mb-2">
                          <input
                            type="text"
                            name="search"
                            onChange={this.handleChange}
                            className="form-control"
                            aria-describedby="searchUser"
                            placeholder="Search"
                            value={search}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col lg={"3"} md={"3"} className="mb-0">
                      <FormGroup className="mb-0">
                        <Label for="exampleSelect" className="label">
                          Status
                        </Label>
                        <Input
                          type="select"
                          name="searchByStatus"
                          id="exampleSelect"
                          value={searchByStatus || ""}
                          onChange={this.handleSearchByStatus}
                        >
                          <option className="form-control" value={""}>
                            -- Select Status --
                          </option>
                          <option value={"1"}>Active</option>
                          <option value={"0"}>Deactive</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg={"3"} md={"3"} className="mb-0">
                      <div className="filter-btn-wrap">
                        <Label className="height17 label" />
                        <div className="form-group mb-0">
                          <span className="mr-2">
                            <button
                              type="submit"
                              className="btn theme-btn"
                              id="Tooltip-1"
                            >
                              <i className="fa fa-search" />
                            </button>
                            <UncontrolledTooltip target="Tooltip-1">
                              Search
                            </UncontrolledTooltip>
                          </span>
                          <span className="">
                            <button
                              type="button"
                              className="btn btn-danger btn-black"
                              id="Tooltip-2"
                              onClick={this.onReset}
                            >
                              <i className="fa fa-refresh" />
                            </button>
                            <UncontrolledTooltip target={"Tooltip-2"}>
                              Reset all filters
                            </UncontrolledTooltip>
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
              <h4 className="mb-4 ">
                Comments: 
                <span className="pl-2 theme-text">
                  Help Realize the Dreams of these Students to Reality
                </span>
              </h4>
              <Table responsive bordered className="table-theme-wrap">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th className="text-left" style={{ width: "600px" }}>
                      {" "}
                      Comment{" "}
                    </th>
                    <th className="text-center" style={{ width: "200px" }}>
                      By
                    </th>
                    {/* <th className="text-center">Project</th> */}
                    <th style={{ width: "100px" }}> Date</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className={"table-loader"} colSpan={12}>
                        <Loader />
                      </td>
                    </tr>
                  ) : users.length ? (
                    users.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{skip + index + 1}</td>
                          <td className="detail-wrap text-left">
                            {item.comment ? (
                              <div className="">
                                <span className="heading">
                                  <ReadMoreAndLess
                                    ref={this.ReadMore}
                                    className="read-more-content"
                                    charLimit={230}
                                    readMoreText="Read more"
                                    readLessText="Read less"
                                  >
                                    {item.comment}
                                  </ReadMoreAndLess>
                                </span>
                              </div>
                            ) : null}
                          </td>
                          <td>
                            {item.user_Name ? (
                              <div>{item.user_Name}</div>
                            ) : null}
                          </td>
                          {/* <td>
                            {item.Project ? (
                              <div>{item.Project.name}</div>
                            ) : null}
                          </td> */}
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
                          <td className="text-center status-btn-wrap">
                            {item.status && item.status === 1 ? (
                              <React.Fragment>
                                <button
                                  type="button"
                                  onClick={() => {
                                    this.activePM(item.id, false);
                                  }}
                                  className="btn theme-btn btn-sm active-btn"
                                  id={`tooltipactive-${item.id}`}
                                >
                                  Active
                                </button>
                                <UncontrolledTooltip
                                  target={`tooltipactive-${item.id}`}
                                >
                                  {`Click to deactive`}
                                </UncontrolledTooltip>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <button
                                  type="button"
                                  onClick={() => {
                                    this.activePM(item.id, true);
                                  }}
                                  className="btn btn-black btn-sm deactive-btn"
                                  id={`tooltipdeactive-${item.id}`}
                                >
                                  Deactive
                                </button>
                                <UncontrolledTooltip
                                  target={`tooltipdeactive-${item.id}`}
                                >
                                  {`Click to activate`}
                                </UncontrolledTooltip>
                              </React.Fragment>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={"12"} className={"text-center"}>
                        No User Found
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
