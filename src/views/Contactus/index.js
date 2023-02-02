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

class ContacusList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			totalCount: 0,
			selectedPage: 1,
			limit: 50,
			skip: 0,
			search: "",
			isActive: "",
			statusActive: "",
			isLoading: false,
			searchByStatus: "",
			isStatusLoading: false
		};
	}
	handleChange = async(e) => {
		const { target } = e;
		const { name, value } = target;
		this.setState({
			[name]: value
		});
		await this.props.history.push(
      `?search=${value}&searchByStatus=${this.state.searchByStatus}`
    );
		this.getList()
	};

	componentDidMount() {

		this.getList();
	}

	getList = async e => {
    this.setState({isLoading:true})
		const { selectedPage, limit, searchByStatus, search } = this.state;
		const res = await new ApiHelper().FetchFromServer(
			ApiRoutes.GET_CONTACTUS_LIST.service,
			ApiRoutes.GET_CONTACTUS_LIST.url,
			ApiRoutes.GET_CONTACTUS_LIST.method,
			ApiRoutes.GET_CONTACTUS_LIST.authenticate,
			{ page: selectedPage, limit: limit, search: search, searchByStatus: searchByStatus }
		);
		console.log(res.data);
		if (res.data.success) {
			console.log(res.data.data.count,'res.data.data.count')
			await this.setState({
				list: res.data.data.rows,
				totalCount: res.data.data.count,
				isLoading: false
			});
		}
	};

	handleSearchByStatus = async(e) => {
		const { target } = e;
		const { name, value } = target;
		this.setState({
			[name]: value,
			totalCount: 0,
			selectedPage: 1
		});
		await this.props.history.push(
      `?search=${this.state.search}&searchByStatus=${value}`
    );
		this.getList()
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
		this.getList();
	};

	onSearch = async e => {
		e.preventDefault();
		// this.props.history.push('')
		await this.setState({
			selectedPage: 1,
			totalCount: 0,
			skip: 0
		});
	
		this.getList()
	};

	onReset = async e => {
		e.preventDefault();
		this.setState(
			{
				search: "",
				selectedPage: 1,
				totalCount: 0,
				skip: 0,
				statusActive: "",
				ids: "",
				searchByStatus: ""
			},
			() => {

				this.props.history.push(
          `?search=${this.state.search}&searchByStatus=${this.state.searchByStatus}`
        );
				this.getList();

			}
		);
	};

	handleChangeStatus = async (e, id) => {
		const { target: { value } } = e
		let data = {
			status: value,
			id
		}
		this.setState({ isStatusLoading: true })
		const res = await new ApiHelper().FetchFromServer(
			ApiRoutes.CHANGE_CONTACTUS_STAUS.service,
			ApiRoutes.CHANGE_CONTACTUS_STAUS.url,
			ApiRoutes.CHANGE_CONTACTUS_STAUS.method,
			ApiRoutes.CHANGE_CONTACTUS_STAUS.authenticate,
			undefined,
			data
		);
		this.setState({ isStatusLoading: false })
		if (res.data.success) {
			toast.success(res.data.message)
			this.getList()
		}
	}

	render() {
		const {
			list,
			isLoading,
			totalCount,
			limit,
			skip,
			selectedPage,
			search,
			searchByStatus,
			isStatusLoading
		} = this.state;

		console.log(totalCount,'totalCount++++++')
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
													<option value={"open"}>Open</option>
													<option value={"pending"}>Pending</option>
													<option value={"completed"}>Completed</option>
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

							<Table responsive bordered className="table-theme-wrap">
								<thead>
									<tr>
										<th>S.no</th>
										<th className="text-center" style={{ width: "150px" }}>
											Name
										</th>
										<th className="text-center" style={{ width: "200px" }}>
											Email
										</th>
										<th className="text-left" style={{ width: "400px" }}>
											{" "}
											Message{" "}
										</th>

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
									) : list.length ? (
										list.map((item, index) => {
											return (
												<tr key={index}>
													<td>{skip + index + 1}</td>
													<td>
														{item.name ? (
															<div>{item.name}</div>
														) : null}
													</td>
													<td>
														{item.email ? (
															<div>{item.email}</div>
														) : null}
													</td>
													<td className="detail-wrap text-left">
														{item.message ? (
															<div className="">
																<span className="heading">
																	<ReadMoreAndLess
																		ref={this.ReadMore}
																		className="read-more-content"
																		charLimit={230}
																		readMoreText="Read more"
																		readLessText="Read less"
																	>
																		{item.message}
																	</ReadMoreAndLess>
																</span>
															</div>
														) : null}
													</td>


													<td>
														{item.createdAt ? (
															<div>
																{moment(item.createdAt).format(
																	AppConfig.DEFAULT_DATE_FORMAT
																)}
															</div>
														) : null}
													</td>
													<td className="text-center status-btn-wrap">
														{
															isStatusLoading ?
																<span class="input-group-addon">
																	<i class="fa fa-spinner fa-spin" ></i>

																</span> :

																<Input
																	type="select"
																	name="searchByStatus"
																	id="exampleSelect"
																	value={item.status}
																	onChange={(e) => this.handleChangeStatus(e, item.id)}
																	addon={<i class="fa fa-spinner fa-spin" ></i>}
																>

																	<option value={"open"}>Open</option>
																	<option value={"pending"}>Pending</option>
																	<option value={"completed"}>Completed</option>
																</Input>
														}
													</td>
												</tr>
											);
										})
									) : (
										<tr>
										<td colSpan={"12"} className={"text-center"}>
										<div className="empty-search-section my-4">
											<div className="empty-img">
												<img src="/assets/img/no-search-found.svg" alt="" />
											</div>
											<div className="empty-text">
												<p>No Comment list Found.</p>
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

export default ContacusList;
