import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";


class NavigationBar extends React.Component {
	render() {
		const { user, onLogout } = this.props;

		return (
      <AppBar position="static" id={'navigation-bar'}
               color={"inherit"}>
        <Toolbar variant={"dense"}>
          <Typography variant="h6">
	          {`ForaSoft (${user.login}) `}
          </Typography>
	        <Button
		        color="secondary"
		        style={{
			        position: "absolute",
			        display: "flex",
			        right: "2%",
			        fontSize: "medium"
		        }}
		        onClick={onLogout}
	        >Выход</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavigationBar;