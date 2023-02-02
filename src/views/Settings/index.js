import React, { Component } from "react";
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
class Settings extends Component {
  render() {
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-cog" /> Settings
                </h4>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label for="exampleEmail" sm={2}>
                      Label
                    </Label>
                    <Col sm={10}>
                      <Input
                        type="text"
                        name="metaValue"
                        id="exampleEmail"
                        placeholder="Placeholder"
                      />
                      {true ? (
                        <p className={"text-danger"}>Please fill the feild</p>
                      ) : null}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={{ size: 10, offset: 2 }}>
                      <Button type="submit" className="btn theme-btn">
                        Update Setting
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

export default Settings;
