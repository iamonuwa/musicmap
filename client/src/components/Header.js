import React, { Component } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "./Header.css";

class Header extends Component {
  render() {
    const { onAddNewTrackEvent } = this.props;
    return (
      <div className="header">
        <Container>
          <Row className="pt-5">
            <Col xs="12" sm="12" md="3" lg="3">
              <div className="stats">
                <div className="stats__genre">
                  <i className="fa fa-play mt-1" />
                  <p className="text-left">
                    Genre Score <span>11.478</span>
                  </p>
                </div>
                <div className="stats__auth">
                  <i className="fa fa-sign-out-alt mt-3" />
                  <p>
                    Number of songs: <span>{this.props.totalSongs}</span>
                    <br />
                    Total duration: <span>{this.props.totalDuration}</span>
                  </p>
                </div>
              </div>
            </Col>
            <Col xs="12" sm="12" md="6" lg="6">
              <div className="text-center">
                <h1 className="mt-3">EURODISCO</h1>
              </div>
            </Col>
            <Col xs="12" sm="12" md="3" lg="3">
              <div className="text-right">
                <div className="tags mt-4">
                  <p>{this.props.tags ? this.props.tags : "No tags found"}</p>
                </div>
              </div>
            </Col>
          </Row>
          <hr />
          <div className="text-right">
            <Button onClick={onAddNewTrackEvent}>Add Track</Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default Header;
