import * as React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ChatRoom from "../containers/ChatRoom";
import Login from "../containers/Login";

class MyRouter extends React.Component{
	render() {
		return(
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={ChatRoom} />
					<Route exact path="/login" component={Login} />
				</Switch>
			</BrowserRouter>
		)
	}
}

export default MyRouter;