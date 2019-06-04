import * as React from 'react'
import * as axios from "axios";
import Auth from "../Security/Auth";
import PostList from "./PostList";

class Post extends React.Component {

    instance = null;

    constructor(props) {

        super(props);
        this.state = {
            page: this.props.match.params.page,
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
                <PostList history={this.props.history} data={this.state}/>
            </div>
        );
    }

    refresh = () => {

        this.setState({
            postsLoading: true,
        });

        let page = this.props.match.params.page;

        if (page === undefined) {

            page = '0';

        }

        page = page - 1;

        this.anonymous.get('?size=20&page=' + page, {baseURL: 'http://localhost:8080/post'})
            .then(response => {
                let posts = response.data.content;
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

export default Post;