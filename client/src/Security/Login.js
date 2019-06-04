import * as React from 'react'
import * as Ui from 'material-ui'
import Auth from "./Auth";
import {cyan500, pink500} from 'material-ui/styles/colors';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            user: {
                username: '',
                password: '',
            },
            keepLogged: false,
            open: false,
            push: false,
            message: "message placeholder",
            snackbarStyle: {
                backgroundColor: cyan500,
            },
        };
    }

    style = {
        height: 300,
        width: 300,
        margin: '200px auto auto auto',
        display: 'block',
        padding: '20px 20px 20px 20px',
    };

    render() {
        return (
            <div>
                <Ui.Paper zDepth={3} style={this.style}>
                    <div>
                        <Ui.TextField floatingLabelText="Username" onChange={this.onUsernameChange}/>
                    </div>
                    <div>
                        <Ui.TextField floatingLabelText="Password" onChange={this.onPasswordChange}
                                      type="password"/>
                    </div>
                    <div>
                        <form onSubmit={this.handleLogin}>
                            <Ui.RaisedButton type="submit" label="Zaloguj się" primary={true}/>
                        </form>
                    </div>
                    <div>
                        <Ui.Checkbox
                            label="Nie wylogowuj mnie"
                            defaultChecked={false}
                            onCheck={this.onCheckboxChange.bind(this)}
                        />
                    </div>
                    <div>
                        <Ui.FlatButton labelStyle={{fontSize: '10px'}} label="Nie masz konta? Zarejestruj się"
                                       primary={true} onClick={() => {
                            this.props.history.push('/register')
                        }}/>
                    </div>
                </Ui.Paper>
                <Ui.Snackbar bodyStyle={this.state.snackbarStyle} open={this.state.open} message={this.state.message}
                             onRequestClose={this.onRequestClose} autoHideDuration={3000}/>
            </div>
        );
    }

    onUsernameChange = (event) => {
        let user = this.state.user;
        user.username = event.target.value;
        this.setState({
            user: user
        });
    };

    onPasswordChange = (event) => {
        let user = this.state.user;
        user.password = event.target.value;
        this.setState({
            user: user
        });
    };

    onCheckboxChange = () => {
        this.setState((oldState) => {
            return {
                keepLogged: !oldState.keepLogged,
            };
        });
    };

    onRequestClose = () => {

        if (this.state.push) {
            this.props.history.push('/');
        }

        this.setState({
           open: false,
        });

    };

    handleLogin = (event) => {
        const loginUrl = 'http://localhost:8080/login';
        const xhr = new XMLHttpRequest();
        xhr.open('post', loginUrl);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                // sukces
                // usuwamy bledy
                this.setState({
                    errors: {},
                    message: "Pomyślnie zalogowano! Nastąpi przekierowanie...",
                    snackbarStyle: {
                        backgroundColor: cyan500,
                    },
                    open: true,
                    push: true,
                });
                // zapisujemy token
                Auth.authenticateUser(xhr.response.token, xhr.response.username, xhr.response.role);
            } else {
                // cos poszlo nie tak
                // pobieramy informacje o bledach z
                const error = xhr.response.message ? xhr.response.message : {};
                this.setState({
                    error,
                    message: "Wprowadzono Złą nazwę użytkownika lub hasło!",
                    snackbarStyle: {
                        backgroundColor: pink500,
                    },
                    open: true,
                });
            }
        });
        let user = this.state.user;
        user.keepLogged = this.state.keepLogged;
        this.setState({
            user: user
        });
        xhr.send(JSON.stringify(this.state.user));
        event.preventDefault()
    };

    componentDidMount = () => {

        if (Auth.isUserAuthenticated()) {

            this.props.history.push('/');

        }

    };

}

export default Login;