import Validator, { ValidationTypes } from "js-object-validation";
import React, { Component } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row
} from "reactstrap";
import { AppRoutes } from "../../../Config";
import ApiRoutes from "../../../Config/ApiRoutes";
import { ApiHelper } from "./../../../Helpers/ApiHelper";
import image from "../../../assets/img/gofundher-logo-white.png"
import { CInputGroupText } from "@coreui/react";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.history.push(AppRoutes.HOME);
    }
  }
  handleSubmit = async event => {
    event.preventDefault();
    try {
      const validator = {
        email: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.EMAIL]: true
        },
        password: {
          [ValidationTypes.REQUIRED]: true,
          [ValidationTypes.MINLENGTH]: 6,
          [ValidationTypes.MAXLENGTH]: 20
        }
      };
      const messages = {
        email: {
          [ValidationTypes.REQUIRED]: "Please enter email.",
          [ValidationTypes.EMAIL]: "Please enter valid email."
        },
        password: {
          [ValidationTypes.REQUIRED]: "Please enter password.",
          [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
          [ValidationTypes.MAXLENGTH]: "Password must be 20 character long."
        }
      };
      const { email, password } = this.state;
      const data = {
        email,
        password
      };
      const { isValid, errors } = Validator(data, validator, messages);
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      const res = await new ApiHelper().FetchFromServer(
        ApiRoutes.LOGIN.service,
        ApiRoutes.LOGIN.url,
        ApiRoutes.LOGIN.method,
        ApiRoutes.LOGIN.authenticate,
        undefined,
        data
      );
      if (!res.isError) {
        toast.success(res.messages[1], {
          position: toast.POSITION.TOP_RIGHT
        });
        localStorage.setItem("token", res.data.token);
        this.props.history.push(AppRoutes.HOME);
      } else {
        toast.error(res.messages[0], {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (error) {
      // console.log(error);
    }
  };
  render() {
    const { email, password, errors } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <div className="loginPage">

        </div>
        <Container>
        <div className="login-content">
          <div className="col-sm-12 text-center logoPadding">
            <img src={image} alt=""  />
          </div>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup className="borderShadow">
                <Card className="">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1 className="text-center">Login</h1>
                      <InputGroup className="mb-3">
                        <CInputGroupText addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </CInputGroupText>
                        <Input
                          type={"text"}
                          name={"email"}
                          placeholder={"Enter email"}
                          onChange={this.handleChange}
                          value={email}
                        />
                      </InputGroup>
                      {errors.email ? (
                        <p className={"text-danger"}>{errors.email}</p>
                      ) : null}
                      <InputGroup className="mb-4">
                        <CInputGroupText addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </CInputGroupText>
                        <Input
                          type={"password"}
                          name={"password"}
                          placeholder={"Enter password"}
                          onChange={this.handleChange}
                          value={password}
                        />
                      </InputGroup>
                      {errors.password ? (
                        <p className={"text-danger"}>{errors.password}</p>
                      ) : null}
                      <Row>
                        <Col xs="12" className="text-center">
                          <Button
                            type={"submit"}
                            className="px-4 btn theme-btn"
                          >
                            Login
                          </Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default Login;
