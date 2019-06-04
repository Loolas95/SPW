import * as React from 'react'
import * as axios from "axios";
import Auth from "../Security/Auth";
import ChatList from "./ChatList";


class Chat extends React.Component {

    instance = null;

    constructor(props) {

        super(props);
        this.state = {
            page: this.props.match.params.page,
            chats: [],
            postsLoading: false,
        };

        this.instance = axios.create({
            baseURL: 'http://localhost:8080/',
            headers: {'Authorization': 'Bearer ' + Auth.getToken()}
        });

        this.anonymous = axios.create({
            baseURL: 'http://localhost:8080/',
        });

    }

    render() {
        return (
            <div>
                <ChatList history={this.props.history} data={this.state}/>
            </div>
        );
    }

    refresh = () => {


        if(!Auth.isUserAuthenticated()) {

            this.props.history.push('/login');

        }

        this.setState({
            postsLoading: true,
        });

        let page = this.props.match.params.page;

        if (page === undefined) {

            page = '0';

        }

        page = page - 1;

        this.anonymous.get(Auth.getUsername()+'?size=20&page=' + page, {baseURL: 'http://localhost:8080/chat/userId/'})
            .then(response => {
                let chats = response.data.content;
                this.setState({
                    chats,
                    postsLoading: false,
                });
            });

    };

    componentDidMount = () => {

        this.refresh();

    };

}

export default Chat;