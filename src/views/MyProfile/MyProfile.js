import Validator, { ValidationTypes } from "js-object-validation";
import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import { AppRoutes } from "../../Config";
import ApiRoutes from "../../Config/ApiRoutes";
import FullPageLoader from "../../containers/Loader/FullPageLoader";
import { ApiHelper } from "../../Helpers/ApiHelper";
import { logger } from "../../Helpers/Logger";

class MyProfile extends Component {
  constructor(props) {
    super(props);
    // console.log("", props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
      errors: {},
      id: this.props.location.state.userDetails.id
    };
  }
  componentDidMount() {
    this.getAdminProfile();
  }
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  getAdminProfile = async e => {
    try {
      var data = { id: this.state.id };
      const res = await new ApiHelper().FetchFromServer(
        ApiRoutes.GET_SETTINGS.service,
        ApiRoutes.GET_SETTINGS.url,
        ApiRoutes.GET_SETTINGS.method,
        ApiRoutes.GET_SETTINGS.authenticate,
        data,
        undefined
      );
      // console.log("evebgfoierf", res);

      delete res.data.data.password;
      this.setState(res.data.data);
    } catch (error) {
      logger(error);
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      errors: {},
      isLoading: true
    });
    try {
      const validator = {
        email: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EMAIL]: true
        },
        first_name: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MAXLENGTH]: 255
        }
      };
      const messages = {
        email: {
          [ValidationTypes.REQUIRED]: "Please enter email address.",
          [ValidationTypes.EMAIL]: "Please enter valid email address."
        },
        first_name: {
          [ValidationTypes.REQUIRED]: "Please enter full name",
          [ValidationTypes.MAXLENGTH]: "Name must be 255 character long"
        }
      };
      const { email, first_name } = this.state;
      const data = {
        email,
        first_name
      };
      const { isValid, errors } = Validator(data, validator, messages);
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      const res = await new ApiHelper().FetchFromServer(
        ApiRoutes.UPDATE_SETTINGS.service,
        ApiRoutes.UPDATE_SETTINGS.url,
        ApiRoutes.UPDATE_SETTINGS.method,
        ApiRoutes.UPDATE_SETTINGS.authenticate,
        undefined,
        data
      );
      this.setState({
        isLoading: false
      });
      if (!res.isError) {
        toast.success(res.messages[0], {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.history.push(AppRoutes.HOME);
      } else {
        toast.error(res.messages[0], {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  handleChangePasswordSubmit = async event => {
    event.preventDefault();
    try {
      this.setState({
        errors: {},
        isLoading: true
      });
      const { oldPassword, password, confirmPassword } = this.state;
      const data = {
        oldPassword,
        password,
        confirmPassword,
        id: this.state.id
      };
      const validator = {
        oldPassword: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MINLENGTH]: 6,
          [ValidationTypes.MAXLENGTH]: 255
        },
        password: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MINLENGTH]: 6,
          [ValidationTypes.MAXLENGTH]: 255
        },
        confirmPassword: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MINLENGTH]: 6,
          [ValidationTypes.MAXLENGTH]: 255
        }
      };
      const messages = {
        oldPassword: {
          [ValidationTypes.REQUIRED]: "Please enter old password.",
          [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
          [ValidationTypes.MAXLENGTH]: "Password must be 20 character long"
        },
        password: {
          [ValidationTypes.REQUIRED]: "Please enter new password",
          [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
          [ValidationTypes.MAXLENGTH]: "Password must be 20 character long"
        },
        confirmPassword: {
          [ValidationTypes.REQUIRED]: "Please enter confirm password",
          [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
          [ValidationTypes.MAXLENGTH]: "Password must be 20 character long",
          [ValidationTypes.EQUAL]: "Password and confirm password didn't match"
        }
      };

      const { isValid, errors } = Validator(data, validator, messages);
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }
      const res = await new ApiHelper().FetchFromServer(
        "/admin",
        "/updatePassword",
        "POST",
        true,
        undefined,
        data
      );
      this.setState({
        isLoading: false
      });
      if (!res.isError) {
        toast.success(res.messages[0], {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.history.push(AppRoutes.USERS);
      } else {
        toast.error(res.messages[0], {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  render() {
    const { email, first_name,last_name, errors, isLoading } = this.state;
    return (
      <div className="cr-page px-3 min-height650">
        {isLoading ? <FullPageLoader /> : null}
        <Row>
          <Col xs="6" sm="6" lg="6">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;My Profile
                </h4>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="username" sm={3}>
                     Name
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="text"
                        disabled
                        name="first_name"
                        id="username"
                        value={[first_name,last_name].join(" ")}
                        placeholder="Enter Full Name"
                        onChange={this.handleChange}
                      />
                      {errors.first_name ? (
                        <p className={"text-danger"}>{errors.first_name}</p>
                      ) : null}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="useremail" sm={3}>
                      Email
                    </Label>
                    <Col sm={9}>
                      <Input
                        type="email"
                        disabled
                        name="email"
                        id="useremail"
                        value={email}
                        placeholder="Enter email address"
                        onChange={this.handleChange}
                      />
                      {errors.email ? (
                        <p className={"text-danger"}>{errors.email}</p>
                      ) : null}
                    </Col>
                  </FormGroup>
                  {/* <FormGroup row>
                    <Col sm={{ size: 10, offset: 2 }}>
                      <Button
                        type="submit"
                        onClick={this.handleSubmit}
                        color={"primary"}
                        className={"pull-right btn theme-btn"}
                      >
                        Update Profile
                      </Button>
                    </Col>
                  </FormGroup> */}
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col xs="6" sm="6" lg="6">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-lock" /> Change Password
                </h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleChangePasswordSubmit} noValidate>
                  <FormGroup row>
                    <Label for="oldpassword" sm={4}>
                      Old Password
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="password"
                        name="oldPassword"
                        id="oldpassword"
                        placeholder="Enter old password"
                        onChange={this.handleChange}
                      />
                      {errors.oldPassword ? (
                        <p className={"text-danger"}>{errors.oldPassword}</p>
                      ) : null}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="newpassword" sm={4}>
                      New Password
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="password"
                        name="password"
                        id="newpassword"
                        placeholder="Enter new password"
                        onChange={this.handleChange}
                      />
                      {errors.password ? (
                        <p className={"text-danger"}>{errors.password}</p>
                      ) : null}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="confirmpassword" sm={4}>
                      Confirm Password
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="password"
                        name="confirmPassword"
                        id="confirmpassword"
                        placeholder="Enter confirm password"
                        onChange={this.handleChange}
                      />
                      {errors.confirmPassword ? (
                        <p className={"text-danger"}>
                          {errors.confirmPassword}
                        </p>
                      ) : null}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col sm={{ size: 10, offset: 2 }}>
                      <Button
                        type="button"
                        onClick={this.handleChangePasswordSubmit}
                        className={"pull-right btn theme-btn"}
                      >
                        Change Password
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MyProfile;
