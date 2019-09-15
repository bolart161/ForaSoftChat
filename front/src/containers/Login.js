import {Container, TextField} from "@material-ui/core";
import * as React from "react";
import {connect} from "react-redux";
import {handleLogin} from "../actions/UserActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

class Login extends React.Component {
	render() {
		const handleKeyDown = (e) => {
			if (e.keyCode === 13) {
				onLogin();
			}
		};

		const onLogin = () => {
			const name = document.getElementById('login').value;
			if (name !== '') {
				this.props.handleLogin(name);
			}
		};

		const chatId = (this.props.location.state)? this.props.location.state.chatId : null;

		if (this.props.user.login && this.props.user.chatRoomId) {
			if (chatId) {
				this.props.history.push({
					pathname: '/',
					search: "?chatId=" + chatId
				});
			} else {
				this.props.history.push('/');
			}
		}


		return (
			<Container
				style={{
					height: "80%",
					width: "100%",
					textAlign: "center",
					paddingTop: "5%"
				}}
			>
				<Grid container alignItems={"center"} justify={"center"} spacing={2}>
					<Grid item xs={12}>
						<h1>Добро пожаловать!</h1>
					</Grid>
					<Grid item xs={12} sm={7} md={5}>
						<TextField
							id={'login'}
							name={'login'}
							label={'Введите логин'}
							variant={"outlined"}
							margin="normal"
							fullWidth
							onKeyDown={handleKeyDown}
						>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={2}>
						<Button variant={"contained"} fullWidth size={"large"} color={"primary"} onClick={onLogin}>Войти</Button>
					</Grid>
				</Grid>
			</Container>
		);
	}
}

const mapStateToProps = store => {
	return {
		user: store.user.user,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		handleLogin: (login) => {
			if (login !== '') {
				dispatch(handleLogin(login))
			}
		}
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Login);
