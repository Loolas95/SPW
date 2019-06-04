import * as React from 'react'
import * as Ui from 'material-ui'
import * as axios from "axios";
import Auth from "../Security/Auth";
import {Link} from 'react-router-dom'
import {cyan500, pink500} from "material-ui/styles/colors";

class ShowPost extends React.Component {
    instance = null;

    constructor(props) {

        super(props);
        this.state = {
            postId: this.props.match.params.postId,
            post: {
                tags: [],
            },
            comments: [],
            empty: true,
            init: true,
            commentsLoading: false,
            postLoading: false,
        };


        this.instance = axios.create({
            baseURL: 'http://localhost:8080/post/',
            headers: {'Authorization': 'Bearer ' + Auth.getToken()}
        });

        this.anonymous = axios.create({
            baseURL: 'http://localhost:8080/post/',
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

            return (<h2>Post not found</h2>);

        } else {

            return (
                <div>
                    <this.PostContent post={this.state.post}/>
                    <this.AddComment/>
                    <this.CommentList author={this.state.post.author}/>
                </div>
            );
        }

    };

    AddComment = () => {

        if (Auth.isUserAuthenticated()) {

            return (
                <Ui.Paper zDepth={1} className="column" style={{borderLeft: "3px solid", borderColor: cyan500,}}>
                    <div>
                        <Ui.TextField floatingLabelText="Treść" multiLine={true} onChange={this.onContentChange}/>
                    </div>
                    <div>
                        <form>
                            <Ui.RaisedButton disabled={this.state.empty} onClick={this.handleAdd} label="Dodaj"
                                             primary={true}/>
                        </form>
                    </div>
                </Ui.Paper>
            );

        } else {

            return (
                <Ui.Paper zDepth={1} style={this.style} className="column">
                    <Ui.FlatButton
                        label="Musisz się zalogować aby dodawać komentarze"
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

    PostContent = () => {

        return (

            <div>
                {this.state.postLoading &&
                <Ui.Paper zDepth={1} className="column"><Ui.CircularProgress
                    style={{positon: "absolute", top: "50%", left: "50%"}}/></Ui.Paper>}
                <Ui.List>
                    <Ui.Paper zDepth={1} className="column" style={Auth.getUsername() === this.state.post.author ? {borderLeft: "3px solid", borderColor: cyan500,} : {borderLeft: "3px solid", borderColor: pink500,}}>
                        <Ui.ListItem key="1" disabled={true} primaryText={this.state.post.name}
                                     secondaryText={this.state.post.author}/>
                    </Ui.Paper>
                    <Ui.Paper zDepth={1} className="column" style={Auth.getUsername() === this.state.post.author ? {borderLeft: "3px solid", borderColor: cyan500,} : {borderLeft: "3px solid", borderColor: pink500,}}>
                        <Ui.ListItem key="2" disabled={true} primaryText={this.state.post.content}/>
                        <Ui.ListItem key="3" disabled={true} primaryText={this.state.post.tags.map((tag) => <Link
                            to={"/post/tag/" + tag}><Ui.FlatButton label={tag} primary={true}/></Link>)}/>
                    </Ui.Paper>
                    <this.DeleteButton/>
                </Ui.List>
            </div>

        );

    };

    DeleteButton = () => {

        if (Auth.getUsername() === this.state.post.author || Auth.getRole() === "admin" || Auth.getRole() === "moderator") {
            return (
                <Ui.Paper zDepth={1} className="column" style={Auth.getUsername() === this.state.post.author ? {borderLeft: "3px solid", borderColor: cyan500,} : {}}>
                    <Ui.RaisedButton onClick={this.handleRemove} label="Usuń" secondary={true}/>
                    <Ui.RaisedButton onClick={this.handleUpdate} label="Edytuj" primary={true}/>
                </Ui.Paper>

            );
        } else {
            return (
                <div></div>
            );
        }

    };

    CommentList = (author) => {

        const listItems = this.state.comments.map((comment) =>
            <Ui.Paper key={comment.id} zDepth={1} className="column" style={this.setBorderColors(comment.author, author.author)}>
                <Ui.ListItem key={comment.id}
                             primaryText={comment.content}
                             secondaryText={comment.author}
                />
                {Auth.getRole() === "admin" || Auth.getRole() === "moderator" || Auth.getUsername() === comment.author ? <Ui.RaisedButton onClick={() => this.handleRemoveComment(comment)} style={{top: "10px",}} label="Usuń" secondary={true} /> : <div></div>}
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

    setBorderColors = (commentAuthor, postAuthor) => {

        if(Auth.getUsername() === commentAuthor) {

            return({borderLeft: "3px solid", borderColor: cyan500,});

        } else if(postAuthor === commentAuthor) {

            return({borderLeft: "3px solid", borderColor: pink500,});

        } else {

            return({});

        }

    };

    handleRemove = () => {

        this.instance.delete(this.state.postId).then(response => {
            this.props.history.push("/post/");
        })

    };

    handleRemoveComment = (comment) => {

        this.instance.delete(comment.id, {baseURL: 'http://localhost:8080/comment/'}).then(response => {
            this.props.history.push("/post/id/" + this.state.postId);
            window.location.reload();
        })

    };

    handleUpdate = (user) => {

        this.props.history.push("/post/add");

    };


    refresh = () => {

        this.setState({
            commentsLoading: true,
            postLoading: true,
        });

        this.anonymous.get(this.props.match.params.postId)
            .then(response => {
                let post = response.data;
                this.setState({
                    post,
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

        this.anonymous.get(this.props.match.params.postId, {baseURL: 'http://localhost:8080/comment/postId/'})
            .then(response => {

                let comments = response.data;
                this.setState({
                    comments,
                    commentsLoading: false,
                });

            })
    };

    handleAdd = () => {

        this.instance.post('/create', {
                content: this.state.content,
                postId: this.props.match.params.postId
            },
            {
                baseURL: 'http://localhost:8080/comment'
            }).then(response => {
            this.refresh()
        })

    };

    componentDidMount = () => {

        this.refresh();

    };

}

export default ShowPost;