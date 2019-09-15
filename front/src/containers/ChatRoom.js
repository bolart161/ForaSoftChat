import React from "react";
import {connect} from "react-redux";
import {createChat, getChatRoom, joinToChat, sendMessage, updateChatRoom} from "../actions/ChatRoomActions";
import NavigationBar from "../components/NavigationBar";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Message from "../components/Message";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {connectUser, handleLogout} from "../actions/UserActions";
import {socket} from "../api";
import Icon from "@material-ui/core/Icon";


class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};

		this.sendMessage = this.sendMessage.bind(this);
		this.keyPressSendMessage = this.keyPressSendMessage.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.onCreateChat = this.onCreateChat.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	componentWillMount = () => {
		if (this.props.user.login) {
			this.props.connectUser(this.props.user);

			socket.on('updateChatRoom', () => {
				this.props.updateChatRoom();
			});
		}
	};

	componentDidUpdate = () => {
		this.scrollToBottom();
	};

	scrollToBottom = () => {
		const scrollHeight = this.messageList.scrollHeight;
		const height = this.messageList.clientHeight;
		const maxScrollTop = scrollHeight - height;
		this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
	};

	sendMessage = () => {
		const search = window.location.search;
		const params = new URLSearchParams(search);
		const chatId = params.get('chatId');
		const textMessage = document.getElementById('chat-message').value;
		const today = new Date();
		const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		const dateTime = date+' '+time;

		if (textMessage !== '') {
			let message = {
				fromUser: this.props.user.login,
				message: textMessage,
				date: dateTime
			};

			document.getElementById('chat-message').value = '';
			this.props.sendMessage(chatId, message);
		}
	};

	keyPressSendMessage(e){
		if(e.keyCode === 13){
			this.sendMessage();
		}
	}

	handleClickOpen() {
		this.setState({
			open: true
		});
	}

	handleClose() {
		this.setState({
			open: false
		});
	}

	onCreateChat() {
		const chatName = document.getElementById('chat-name').value;

		if (chatName !== '') {
			this.props.createChat(this.props.user, chatName);

			this.setState({
				open: false
			});
		}
	}

	onLogout() {
		localStorage.removeItem('ForaSoft-login');
		localStorage.removeItem('ForaSoft-chatRoomId');
		socket.off('updateChatRoom');
		this.props.logout();
		this.props.history.push('/login');
	}

	render() {
		const { user, chatRoom } = this.props;
		const search = window.location.search;
		const params = new URLSearchParams(search);
		const chatId = params.get('chatId');
		const chats = this.props.chatRoom.chats;
		let chat = null;

		if (!user.login && !user.chatRoomId) {
			this.props.history.push('/login', {chatId});
		}

		for (let i = 0; i < chats.length; i++) {
			if (chats[i]._id === chatId) {
				chat = chats[i];
			}
		}

		if (chatRoom.loginOwner && chatId && chat === null && !chatRoom.isFetching) {
			this.props.joinToChat(user, chatId);
		}

		return(
      <React.Fragment>
	      <div
		      style={{
		        position: "absolute",
			      width: "100%",
			      height: "6%"
	        }}
	      >
		      {user &&
		        <NavigationBar
			        user={user}
		          onLogout={this.onLogout}
		        />
		      }
	      </div>
	      {
	      	chatRoom.chats &&
		      <Grid
			      style={{
				      position: "absolute",
				      width: "98%",
				      height: "94%",
				      top: "6%",
				      left: "1%"
			      }}
			      container
			      alignItems={"stretch"}
		      >
			      <Grid item xs={2} style={{height: "100%"}}>
				      <List
					      component="nav"
					      subheader={<h3>Чаты</h3>}
					      style={{
						      height: "80%",
						      maxHeight: "80%",
						      overflow: "auto"
					      }}
				      >
					      {(chatRoom.chats.length > 0) &&
					      chatRoom.chats.map(chat => (
						      <ListItem button component="a" href={'?chatId=' + chat._id} key={chat._id}>
							      <ListItemText primary={chat.chatName}/>
						      </ListItem>
					      ))
					      }
					      <ListItem>
						      <Button
							      onClick={this.handleClickOpen}
							      variant={"contained"}
							      color={"primary"}
							      fullWidth
						      >Создать</Button>
						      <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
							      <DialogTitle id="form-dialog-title">Введите название чата</DialogTitle>
							      <DialogContent>
								      <TextField
									      autoFocus
									      margin="dense"
									      id="chat-name"
									      label="Название чата"
									      type="chatName"
									      fullWidth
								      />
							      </DialogContent>
							      <DialogActions>
								      <Button onClick={this.handleClose} color="primary">
									      Отмена
								      </Button>
								      <Button id={'btn-create-chat'} onClick={this.onCreateChat} color="primary" autoFocus>
									      Создать
								      </Button>
							      </DialogActions>
						      </Dialog>
					      </ListItem>
				      </List>
			      </Grid>
		        <Grid item xs={8} style={{textAlign: "center", height: "100%"}}>
			      <h3>Сообщения {(chat) ? '(' + chat.chatName + ')' : ''}</h3>
			      {
				      <List
					      style={{
						      width: "100%",
						      overflow: "auto",
						      height: "80%",
					      }}
					      ref={(div) => {
						      this.messageList = div;
					      }}
				      >
					      {
						      chat &&
						      Object.keys(chat.messages).map(key => {
							      return (
								      <ListItem key={key}>
									      <Message message={chat.messages[key]} isMy={user.login === chat.messages[key].fromUser}/>
								      </ListItem>
							      )
						      })
					      }
				      </List>
			      }
			      {
				      chat &&
				      <Grid container alignItems={"center"} justify={"center"}>
					      <Grid item xs={8}>
						      <TextField
							      id="chat-message"
							      label="Сообщение"
							      margin="normal"
							      variant="outlined"
							      style={{position: "relative", width: "100%"}}
							      onKeyDown={this.keyPressSendMessage}
						      />
					      </Grid>
					      <Grid item xs={2}>
						      <Button
							      variant={"text"}
							      color={"primary"}
							      size={"large"}
							      onClick={this.sendMessage}
						      >
							      <Icon style={{fontSize: 32}}>send</Icon>
						      </Button>
					      </Grid>
				      </Grid>
			      }
			      </Grid>
			      <Grid item xs={2}>
				      <h3>Онлайн</h3>
				      <List component={'nav'}>
					      {chat && chat.users &&
					      chat.users.map(user => (
					        user.isOnline &&
						      <ListItem button key={user.login}>
							      <ListItemText primary={user.login}/>
						      </ListItem>
					      ))
					      }
				      </List>
			      </Grid>
		      </Grid>
	      }
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => {
	return {
		chatRoom: store.chatRoom,
		user: store.user.user,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		getChatRoom: (user) => {
			if (user)
				dispatch(getChatRoom(user))
		},
		joinToChat: (user, chatId) => {
			dispatch(joinToChat(user, chatId))
		},
		createChat: (user, chatName) => {
			dispatch(createChat(user, chatName))
		},
		logout: () => {
			dispatch(handleLogout())
		},
		sendMessage: (chatId, message) => {
			dispatch(sendMessage(chatId, message))
		},
		updateChatRoom: () => {
			dispatch(updateChatRoom());
		},
		connectUser: (user) => {
			dispatch(connectUser(user.login));
		}
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ChatRoom);