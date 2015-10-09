import React from 'react'
var Button  = ReactBootstrap.Button;
var PageHeader = ReactBootstrap.PageHeader;
import auth from './auth.js'

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

class LoginBox extends React.Component {

  render(){
    return(
      <div style={wellStyles}>
        <Header label="Please login"/>
        <LoginForm />
      </div>);
  }
}

class Header extends React.Component {

  render() {
    return <PageHeader>{this.props.label}</PageHeader>
  }
}

class LoginForm extends React.Component {

  handleSubmit(e) {
    e.preventDefault();

    var email = React.findDOMNode(this.refs.loginField).value
    var pass = React.findDOMNode(this.refs.passwordField).value

    console.log("email: " + email)
    console.log("pass: " + pass)

    auth.login(email, pass)


    return;
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1">@</span>
          <input type="text" className="form-control" ref="loginField" placeholder="login" aria-describedby="basic-addon1" />
        </div>
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1">?</span>
          <input type="password" className="form-control" ref="passwordField" placeholder="password" aria-describedby="basic-addon1" />
        </div>
        <SubmitButton label="Login"/>
      </form>
    );
  }
}

class SubmitButton extends React.Component {
  render() {
    return <button type="submit" className="btn btn-default primary">{this.props.label}</button>
  }
}

export default LoginBox
