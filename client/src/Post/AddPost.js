import * as React from 'react'
import * as Ui from 'material-ui'
import Auth from "../Security/Auth";
import * as axios from "axios/index";

class AddPost extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            tag1 : "",
            tag2 : "",
            tag3 : "",
            empty: false,
        };

        this.instance = axios.create({
            baseURL: 'http://localhost:8080/post',
            headers: {'Authorization': 'Bearer ' + Auth.getToken()}
        });

    }

    render() {

        return (
                <div>
                    <Ui.Paper zDepth={3} style={this.style} className="column">
                        <div>
                            <Ui.TextField floatingLabelText="Tytuł postu" onChange={this.onTitleChange} />
                        </div>
                        <div>
                            <Ui.TextField floatingLabelText="Treść" multiLine={true} onChange={this.onContentChange}/>
                        </div>
                        <div>
                            <Ui.TextField floatingLabelText="Tag 1" multiLine={true} onChange={this.onTag1Change}/>
                            <Ui.TextField floatingLabelText="Tag 2" multiLine={true} onChange={this.onTag2Change}/>
                            <Ui.TextField floatingLabelText="Tag 3" multiLine={true} onChange={this.onTag3Change}/>
                        </div>
                        <div>
                            <form>
                                <Ui.RaisedButton onClick={this.handleAdd} label="Dodaj" primary={true} />
                            </form>
                        </div>
                    </Ui.Paper>
                </div>
        );

    }

    onTitleChange = (event) => {
        this.setState({
            title: event.target.value,
        });

        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }
    };

    onContentChange = (event) => {

        this.setState({
            content: event.target.value,
        });

        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }

    };

    onTag1Change = (event) => {

        this.setState({
            tag1: event.target.value,
        });

        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }

    };

    onTag2Change = (event) => {

        this.setState({
            tag2: event.target.value,
        });

        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }

    };

    onTag3Change = (event) => {

        this.setState({
            tag3: event.target.value,
        });

        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }

    };

    handleAdd = () => {

        this.instance.post('/create', {
            name: this.state.title,
            content: this.state.content,
            tags: [this.state.tag1,this.state.tag2,this.state.tag3],
        }).then(response => {
                this.props.history.push("/post/id/" + response.data.id);
        })

    };

    componentDidMount = () => {

        if(!Auth.isUserAuthenticated()) {

            this.props.history.push('/login');

        }

    };

}

export default AddPost;