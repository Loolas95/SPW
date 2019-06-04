import * as React from 'react'
import * as Ui from 'material-ui'
import * as axios from "axios";
import Auth from "../Security/Auth";
import {Link} from 'react-router-dom'
import {cyan500, pink500, red500} from "material-ui/styles/colors";

class ShowChat extends React.Component {
    instance = null;

    constructor(props) {

        super(props);
        this.state = {
            chatId: this.props.match.params.chatId,
            chat: {
            },
            messages: [],
            empty: true,
            init: true,
            messagesLoading: false,
            postLoading: false,
        };


        this.instance = axios.create({
            baseURL: 'http://localhost:8080/chat/',
            headers: {'Authorization': 'Bearer ' + Auth.getToken()}
        });

        this.anonymous = axios.create({
            baseURL: 'http://localhost:8080/chat/',
        });

    }

    render() {
        return (
            <div>
                <this.checkStatus status={this.state.status}/>
            </div>
        );
    }

    checkStatus = (props) => {

        if (props.status === 404) {

            return (<h2>Chat not found</h2>);

        } else {

            return (
                <div>
                    <this.ChatContent chat={this.state.chat}/>
                    <this.CommentList author={this.state.chat}/>
                    <this.AddMessage/>
                </div>
            );
        }

    };

    AddMessage = () => {

        if (Auth.isUserAuthenticated()) {

            return (
                <Ui.Paper zDepth={1} className="column" style={{borderLeft: "3px solid", borderColor: cyan500,}}>
                    <div>
                        <Ui.TextField  floatingLabelText="Wiadomość" multiLine={true} value={this.state.content} onChange={this.onContentChange}/>
                    </div>
                    <div>
                        <form>
                            <Ui.RaisedButton disabled={this.state.empty} onClick={this.handleAdd} label="Wyślij"
                                             primary={true}/>
                        </form>
                    </div>
                </Ui.Paper>
            );

        } else {

            return (
                <Ui.Paper zDepth={1} style={this.style} className="column">
                    <Ui.FlatButton
                        label="Musisz się zalogować aby pisać wiadomości"
                        primary={true}
                        onClick={() => {
                            this.props.history.push('/login')
                        }}
                        fullWidth={true}
                    />
                </Ui.Paper>
            );

        }

    };

    onContentChange = (event) => {

        this.setState({
            content: event.target.value,
            empty: false
        });

        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }


    };

    ChatContent = () => {

        return (

            <div>
                {this.state.postLoading &&
                <Ui.Paper zDepth={1} className="column"><Ui.CircularProgress
                    style={{positon: "absolute", top: "50%", left: "50%"}}/></Ui.Paper>}
                <Ui.List>
                    <Ui.Paper zDepth={1} className="column" style={{borderLeft: "3px solid", borderColor: pink500,}}>
                        <Ui.ListItem key="1" disabled={true} primaryText={Auth.getUsername() === this.state.chat.userFrom ? this.state.chat.userTo :this.state.chat.userFrom}/>
                    </Ui.Paper>
                    <this.DeleteButton/>
                </Ui.List>
            </div>

        );

    };

    DeleteButton = () => {

        if (Auth.getUsername() === this.state.chat.userFrom || Auth.getRole() === "admin" || Auth.getRole() === "moderator") {
            return (
                <Ui.Paper zDepth={1} className="column" style={Auth.getUsername() === this.state.chat.userFrom ? {borderLeft: "3px solid", borderColor: cyan500,} : {}}>
                    <Ui.RaisedButton onClick={this.handleRemove} label="Usuń" secondary={true}/>
                </Ui.Paper>

            );
        } else {
            return (
                <div></div>
            );
        }

    };

    CommentList = (author) => {

        const listItems = this.state.messages.map((message) =>
            <Ui.Paper key={message.id} zDepth={1} className="column" style={this.setBorderColors(message.author)}>
                <Ui.ListItem key={message.id}
                             primaryText={message.content}
                             secondaryText={message.author}
                />
            </Ui.Paper>
        );

        return (
            <div>
                {this.state.commentsLoading &&
                <Ui.Paper zDepth={1} className="column"><Ui.CircularProgress
                    style={{positon: "absolute", top: "50%", left: "50%"}}/></Ui.Paper>}
                <Ui.List>{listItems}</Ui.List>
            </div>
        );

    };

    setBorderColors = (commentAuthor) => {

        if(Auth.getUsername() === commentAuthor) {

            return({borderLeft: "3px solid", borderColor: cyan500,});

        } else {

            return({borderLeft: "3px solid", borderColor: red500,textAlign:"right"});

        }

    };

    handleRemove = () => {

        this.instance.delete(this.state.chatId).then(response => {
            this.props.history.push("/");
        })

    };

    handleRemoveComment = (message) => {

        this.instance.delete(message.id, {baseURL: 'http://localhost:8080/comment/'}).then(response => {
            this.props.history.push("/chat/id/" + this.state.chatId);
            window.location.reload();
        })

    };



    refresh = () => {


        if(!Auth.isUserAuthenticated()) {

            this.props.history.push('/login');

        }

        this.setState({
            commentsLoading: true,
            postLoading: true,
        });

        this.anonymous.get(this.props.match.params.chatId)
            .then(response => {
                let chat = response.data;
                this.setState({
                    chat,
                    postLoading: false,
                });
            })
            .catch(error => {
                if (error.response.status === 404) {

                    let status = error.response.status;
                    this.setState({
                        status
                    });

                }
            });

        this.anonymous.get(this.props.match.params.chatId, {baseURL: 'http://localhost:8080/message/chatId/'})
            .then(response => {

                let messages = response.data;
                this.setState({
                    messages,
                    commentsLoading: false,
                });

            })
    };

    handleAdd = () => {

        this.instance.post('/create', {
                content: this.state.content,
                chatId: this.props.match.params.chatId,
                author: Auth.getUsername()
            },
            {
                baseURL: 'http://localhost:8080/message'
            }).then(response => {
                this.state.content="";
            this.refresh()
        })

    };

    componentDidMount = () => {

        this.refresh();

    };

}

export default ShowChat;