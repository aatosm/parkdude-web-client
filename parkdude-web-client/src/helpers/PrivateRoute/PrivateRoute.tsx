import React, { FunctionComponent, Component} from 'react'
import {  Redirect, Route } from 'react-router-dom';
import {connect} from 'react-redux';


type PrivateRouteProps = {
    component: FunctionComponent<{}>;
    path: string;
    loggedIn: boolean;
}

/* const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        true 
        ? <Component />
        : <Redirect to={{
            pathname: '/kirjaudu',
            state: { from: props.location }
            }} 
          />
      )} 
    />
  ) */

  class PrivateRoute extends Component<PrivateRouteProps, {}>{
    render() {
      const Content = this.props.component;
      return(
        <Route path= {this.props.path} render={(props) => (
          this.props.loggedIn 
          ? <Content />
          : <Redirect to={{ pathname: '/kirjaudu'  }}  />
          )} 
        />

      );
    }
  }

  const mapState = (state: any) => {
    return {
      loggedIn: state.user.loggedIn
    }

  }

  export default connect(mapState)(PrivateRoute);