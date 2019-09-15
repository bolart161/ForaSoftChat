import {Paper} from "@material-ui/core";
import * as React from "react";
import Typography from "@material-ui/core/Typography";

class Message extends React.Component {
	render() {
		const {message, isMy} = this.props;
		const styleParams = isMy? {background: '#ADD8E6'} : '';
		return (
			<Paper
				style={{...styleParams, width: "90%", padding: "10px", margin: "auto"}}
        elevation={2}>
				<Typography
					variant="subtitle1"
					component="p"
					align={"left"}
				>
					{message.fromUser}
				</Typography>
				<Typography
					variant="h6"
					component="p"
					align={"left"}
					style = {{
						wordWrap: "break-word"
					}}
				>
					{message.message}
				</Typography>
				<Typography
					component="p"
					align={"right"}
				>
					{message.date}
				</Typography>
			</Paper>
		);
	}
}

export default Message;