import * as React from 'react'
import * as Ui from 'material-ui'
import {Link} from 'react-router-dom'
import Auth from "./Security/Auth";
import {withRouter} from "react-router-dom";

class Navigation extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            userOpen: false,
            darkTheme: false,
            colorStyle: {
                color: "white",
            },
            alignStyle: {
                top: "-7px",
            },
        };

    };

    render() {

        return (
            <div>
                <Ui.AppBar
                    title="Komunikator"
                    onLeftIconButtonClick={() => {this.props.history.push('/')}}
                    iconElementLeft={<Ui.IconButton iconClassName="material-icons" >home</Ui.IconButton>}
                    iconElementRight={<this.RightButtons/>}
                />
            </div>
        );
    };

    RightButtons = () => {

        return (
            <div>
                {Auth.isUserAuthenticated() ?
                    <this.Logged/> :
                    <div>
                    <Ui.IconButton
                        iconClassName="material-icons"
                        tooltip="Zmień motyw"
                        onClick={this.changeTheme}
                        iconStyle={this.state.colorStyle}
                    >
                        invert_colors
                    </Ui.IconButton>
                    <Ui.FlatButton
                        label="Zaloguj"
                        labelStyle={this.state.colorStyle}
                        onClick={
                            () => {
                                this.props.history.push('/login');
                            }
                        }
                        style={{top: "-7px",}}
                    />
                    </div>
                }
            </div>
        );
    };


    Logged = () => {

        return (
            <div>
                <Ui.IconButton
                    iconClassName="material-icons"
                    tooltip="Zmień motyw"
                    onClick={this.changeTheme}
                    iconStyle={this.state.colorStyle}
                >
                    invert_colors
                </Ui.IconButton>
                <Ui.IconButton
                    iconClassName="material-icons"
                    tooltip="Konwersacja"
                    iconStyle={this.state.colorStyle}
                    onClick={() => {
                        this.props.history.push('/chat/add');
                    }}
                >
                    add
                </Ui.IconButton>
                <Ui.FlatButton
                    label={Auth.getUsername()}
                    labelStyle={this.state.colorStyle}
                    icon={<Ui.FontIcon className="material-icons" style={this.state.colorStyle}>person</Ui.FontIcon>}
                    onClick={
                        (event) => {
                            event.preventDefault();

                            this.setState({
                                userOpen: true,
                                anchorEl: event.currentTarget,
                            });
                        }
                    }
                    style={{top: '-7px',}}
                >
                </Ui.FlatButton>
                <Ui.Popover
                    open={this.state.userOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={
                        () => {
                            this.setState({
                                userOpen: false,
                            });
                        }
                    }
                >
                    <Ui.Menu onItemClick={
                        (event, menuItem, index) => {
                            event.preventDefault();

                            if (index === 0) {

                                this.props.history.push('/user/' + Auth.getUsername());

                            }

                            if (index === 2) {

                                this.props.history.push('/user');

                            }

                            if (index === 1) {

                                Auth.deauthenticateUser();
                                this.props.history.push('/');
                                window.location.reload();

                            }

                        }
                    }>
                        <Ui.MenuItem primaryText="Moje posty"/>
                        <Ui.MenuItem primaryText="Wyloguj"/>
                        {Auth.getRole() === "admin" ? <Ui.MenuItem primaryText="Panel Administratora"/> : <div></div>}
                    </Ui.Menu>
                </Ui.Popover>
            </div>
        )
    };

    changeTheme = () => {

        this.setState((oldState) => {
            return {
                darkTheme: !oldState.darkTheme,
            };
        });

        if(!this.state.darkTheme) {
            this.setState({
                colorStyle: {
                    color: "black"
                }
            });
        } else {
            this.setState({
                colorStyle: {
                    color: "white"
                }
            });
        }

        this.props.setTheme(this.state.darkTheme);

    };

}

export default withRouter(Navigation);