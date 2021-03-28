import React, { useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Button, Col, Divider, Input, Row, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { getUserData, useAuthenActions } from "../../shared";
import "./styles.scss";

const { Title } = Typography;
const HeaderBar = ({ history }) => {
  const { isSignIn, signIn, signOut } = useAuthenActions();
  const userData = getUserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onEmailChange = (e) => setEmail(e.currentTarget.value.trim());
  const onPasswordChange = (e) => setPassword(e.currentTarget.value.trim());
  const onSignIn = () => {
    signIn({
      url: "/auth/signin",
      email,
      password,
    }).then(() => {
      setEmail("");
      setPassword("");
    });
  };
  const onSignUp = () => {
    signIn({
      url: "/auth/signup",
      email,
      password,
    }).then(() => {
      setEmail("");
      setPassword("");
    });
  };
  const onSignOut = () => signOut();
  const onNavigateToPostVideo = () => history.push("/post-movie");
  const SignInLayout = (
    <>
      <p className="welcome-text test-class">
        <span className="bold">Welcome </span>
        {userData?.email}
      </p>
      <Button type="primary" onClick={onNavigateToPostVideo}>
        Share a movie
      </Button>
      <Divider type="vertical" className="button-divider" />
      <Button onClick={onSignOut} type="primary">
        Logout
      </Button>
    </>
  );
  const NotSignInLayout = (
    <>
      <Input
        placeholder="email"
        className="header-input margin-left-auto"
        value={email}
        onChange={onEmailChange}
      />
      <Input
        placeholder="password"
        type="password"
        className="header-input"
        value={password}
        onChange={onPasswordChange}
      />
      <div className="buttons-group flex-layout">
        <Button type="primary" onClick={onSignIn}>
          Login
        </Button>
        <Divider type="vertical" className="button-divider" />
        <Button type="primary" onClick={onSignUp}>
          Register
        </Button>
      </div>
    </>
  );

  return (
    <Row className="header">
      <Col className="flex-layout" span={8}>
        <Link className="flex-layout header-right-content" to="/">
          <HomeOutlined className="home-icon" />
          <Title className="header-title">Funny Movies</Title>
        </Link>
      </Col>
      <Col span={16}>
        <div className="header-left-content flex-layout">
          {isSignIn ? SignInLayout : NotSignInLayout}
        </div>
      </Col>
      <Divider />
    </Row>
  );
};

export default withRouter(HeaderBar);
