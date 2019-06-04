import * as React from 'react'
import * as axios from "axios";
import * as Ui from 'material-ui'
import Auth from "../Security/Auth";
import {cyan500} from "material-ui/styles/colors";

class UserList extends React.Component {

    instance = null;

    constructor(props) {

        super(props);
        this.state = {
            users: [],
            postsLoading: false,
        };

        this.instance = axios.create({
            baseURL: 'http://localhost:8080/panel',
            headers: {'Authorization': 'Bearer ' + Auth.getToken()}
        });

    }

    render() {
        return (
            <div>
                <this.UserListContent />
            </div>
        );
    }

    UserListContent = () => {

        let listItems = this.state.users.map((user) =>

            user.role === "admin" ?
            <div></div> :
            <Ui.Paper key={user.id} zDepth={1} className="column">
                <Ui.ListItem key={user.id}
                             primaryText={user.username}
                             secondaryText={user.role}
                             onClick={() => this.handleUserClick(user)}
                             rightIconButton={<div><Ui.RaisedButton onClick={() => this.handleChangeRole(user)} style={{top: "10px",}} label={user.role === "moderator" ? "Odbierz prawa moderatora" : "Nadaj prawa moderatora"} primary={true} /><Ui.RaisedButton onClick={() => this.handleRemove(user)} style={{top: "10px",}} label="Usuń" secondary={true} /></div>}
                />
            </Ui.Paper>

        );

        return (
            <div>
                {this.state.postsLoading &&
                <Ui.Paper zDepth={1} className="column"><Ui.CircularProgress
                    style={{positon: "absolute", top: "50%", left: "50%"}}/></Ui.Paper>}
                <Ui.List>{listItems}</Ui.List>
            </div>
        );

    };

    refresh = () => {

        this.setState({
            postsLoading: true,
        });

        this.instance.get('', {baseURL: 'http://localhost:8080/panel'})
            .then(response => {
                let users = response.data;
                this.setState({
                    users,
                    postsLoading: false,
                });
            });

    };

    handleUserClick = (user) => {

        this.props.history.push('/user/' + user.username);

    };

    handleRemove = (user) => {

        this.instance.delete(user.id).then(response => {
            this.props.history.push("/user");
            window.location.reload();
        });

    };

    handleChangeRole = (user) => {

        let role = user.role === "user" ? "moderator" : "user";

        this.instance.put(user.id, {
            role: role,
        }).then(response => {
            this.props.history.push("/user");
            window.location.reload();
        });

    };

    componentDidMount = () => {

        this.refresh();

    };

}

export default UserList;