//React imports
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper'

//custom components
import Navigation from "./Navigation";
import Login from "./Security/Login";
import Post from "./Post/Post"
import Register from "./Security/Register"
import ShowPost from "./Post/ShowPost";
import AddPost from "./Post/AddPost";
import Tag from "./Post/Tag";
import User from "./Post/User";
import UserList from "./Security/UserList";
import AddChat from "./Chat/AddChat";
import Chat from "./Chat/Chat";
import ShowChat from "./Chat/ShowChat";

class App extends Component {

    constructor(props) {

        super(props);

        this.state = {
            currentTheme: lightBaseTheme,
        };

    }

    getThemeFromNavigation = (props) => {

        if(!props) {
            this.setState({
                currentTheme: darkBaseTheme,
            });
        } else {
            this.setState({
                currentTheme: lightBaseTheme,
            });
        }

    };

    render() {

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(this.state.currentTheme)}>
                <Paper style={{minHeight: "100vh",}}>
                    <BrowserRouter>
                        <div>
                            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                            <Navigation setTheme={this.getThemeFromNavigation}/>
                            <Switch>
                                <Route exact path='/login' component={Login}/>
                                <Route exact path='/register' component={Register}/>
                                <Route exact path='/' component={Chat}/>
                                <Route exact path='/post/add' component={AddPost}/>
                                <Route exact path='/chat/add' component={AddChat}/>
                                <Route exact path='/user' component={UserList}/>
                                <Route path='/post/page/:page' component={Chat}/>
                                <Route path='/post/tag/:tags' component={Tag}/>
                                <Route path='/post/id/:postId' component={ShowPost}/>
                                <Route path='/chat/id/:chatId' component={ShowChat}/>
                                <Route path='/user/:user' component={User}/>
                                <Route render={() => <h1>Page not found</h1>}/>
                            </Switch>
                        </div>
                    </BrowserRouter>
                </Paper>
            </MuiThemeProvider>
        );

    }

}

export default App;
