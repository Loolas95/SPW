import * as React from 'react'
import * as axios from "axios";
import Auth from "../Security/Auth";
import PostList from "./PostList";

class Tag extends React.Component {
    instance = null;

    constructor(props) {

        super(props);
        this.state = {
            posts: [],
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
                <PostList history={this.props.history} data={this.state} />
            </div>
        );
    }

    refresh = () => {

        this.setState({
            postsLoading: true,
        });

        this.anonymous.get('/post/tag/' + this.props.match.params.tags)
            .then(response => {
                let posts = response.data;
                this.setState({
                    posts,
                    postsLoading: false,
                });
            });

    };

    componentDidMount = () => {

        this.refresh();

    };

}

export default Tag;