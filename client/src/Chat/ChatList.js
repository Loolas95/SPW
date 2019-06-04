import * as React from 'react'
import * as Ui from 'material-ui'
import Auth from "../Security/Auth";
import {cyan500} from "material-ui/styles/colors";

class ChatList extends React.Component {

    render() {

        let chatItems = this.props.data.chats.map((chat) =>
            <Ui.Paper key={chat.id} zDepth={1} className="column" style={Auth.getUsername() === chat.userFrom ? {
                borderLeft: "5px solid",
                borderColor: cyan500,
            } : {}}>

                <Ui.ListItem key={chat.id}
                             primaryText={Auth.getUsername() === chat.userFrom ? chat.userTo :chat.userFrom}
                             onClick={() => this.handlePostClick(chat)}

                ><Ui.FontIcon className="material-icons">message</Ui.FontIcon></Ui.ListItem>
            </Ui.Paper>
        );

        return (
            <div>
                {this.props.data.postsLoading &&
                <Ui.Paper zDepth={1} className="column"><Ui.CircularProgress
                    style={{positon: "absolute", top: "50%", left: "50%"}}/></Ui.Paper>}
                <Ui.List>{chatItems}</Ui.List>
            </div>
        );

    };

    handlePostClick = (chat) => {

        this.props.history.push('/chat/id/' + chat.id);

    }


}

export default ChatList;