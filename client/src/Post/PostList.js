import * as React from 'react'
import * as Ui from 'material-ui'
import Auth from "../Security/Auth";
import {cyan500} from "material-ui/styles/colors";

class PostList extends React.Component {

    render() {

        let listItems = this.props.data.posts.map((post) =>
            <Ui.Paper key={post.id} zDepth={1} className="column" style={Auth.getUsername() === post.author ? {
                borderLeft: "3px solid",
                borderColor: cyan500,
            } : {}}>
                <Ui.ListItem key={post.id}
                             primaryText={post.name}
                             onClick={() => this.handlePostClick(post)}
                />
                <Ui.ListItem key={post.author}
                             secondaryText={post.author}
                             innerDivStyle={{padding: "0 16px",}}
                             onClick={() => this.handleAuthorClick(post)}
                />
            </Ui.Paper>
        );

        return (
            <div>
                {this.props.data.postsLoading &&
                <Ui.Paper zDepth={1} className="column"><Ui.CircularProgress
                    style={{positon: "absolute", top: "50%", left: "50%"}}/></Ui.Paper>}
                <Ui.List>{listItems}</Ui.List>
            </div>
        );

    };

    handlePostClick = (post) => {

        this.props.history.push('/post/id/' + post.id);

    }

    handleAuthorClick = (post) => {

        this.props.history.push('/user/' + post.author);

    }

}

export default PostList;