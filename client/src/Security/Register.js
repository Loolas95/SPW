import * as React from 'react'
import * as Ui from 'material-ui'
import {cyan500, pink500} from 'material-ui/styles/colors';


class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error : '',
            user: {
                username: '',
                password: ''
            },
            open: false,
            push: false,
            message: "message placeholder",
            snackbarStyle: {
                backgroundColor: cyan500,
            },
        };
    }

    style = {
        height: 250,
        width: 300,
        margin: '200px auto auto auto',
        display: 'block',
        padding: '20px 20px 20px 20px'
    };

    render() {
        return (
                <div>
                    <Ui.Paper zDepth={3} style={this.style}>
                        <div>
                            <Ui.TextField floatingLabelText="Username" onChange={this.onUsernameChange} />
                        </div>
                        <div>
                            <Ui.TextField floatingLabelText="Password" onChange={this.onPasswordChange}
                                          type="password" />
                        </div>
                        <div>
                            <form onSubmit={this.handleRegister}>
                                <Ui.RaisedButton type="submit" label="Zarejestruj się" primary={true} />
                            </form>
                        </div>
                        <div>
                            <Ui.FlatButton labelStyle={{ fontSize: '10px' }} label="Masz już konto? Zaloguj się" primary={true} onClick={ () => { this.props.history.push('/login') } }/>
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

    onRequestClose = () => {

        if (this.state.push) {
            this.props.history.push('/');
        }

        this.setState({
            open: false,
        });

    };

    handleRegister = (event) => {
        const loginUrl = 'http://localhost:8080/register';
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
                    message: "Pomyślnie utworzono użytkownika " + this.state.user.username + "! Nastąpi przekierowanie...",
                    snackbarStyle: {
                        backgroundColor: cyan500,
                    },
                    open: true,
                    push: true,
                });
            } else {
                // cos poszlo nie tak
                // pobieramy informacje o bledach z
                const error = xhr.response.message ? xhr.response.message : {};
                this.setState({
                    error,
                    message: "Podana nazwa użytkownika jest zajęta!",
                    snackbarStyle: {
                    backgroundColor: pink500,
                    },
                    open: true,
                });
            }
        });
        xhr.send(JSON.stringify(this.state.user));
        event.preventDefault()

    };

}

export default Register;