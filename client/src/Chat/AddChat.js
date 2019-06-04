import * as React from 'react'
import Select from 'react-select'
import * as Ui from 'material-ui'
import Auth from "../Security/Auth";
import * as axios from "axios/index";

class AddChat extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            userFrom:"",
            userTo:"",
            users:[],
            selectedOption: null
        };

        this.instance = axios.create({
            baseURL: 'http://localhost:8080/chat',
            headers: {'Authorization': 'Bearer ' + Auth.getToken()}
        });

    }

    handleChange = selectedOption => {
        console.log(`Option selected:`, selectedOption);
        this.state.selectedOption=selectedOption.value;
    };
    render() {
        const option = this.state.selectedOption;

        console.log(this.state.users);
        let users = this.state.users;
        var result = users.map(user => ({ value: user.username, label: user.username})).filter(u=>u.value!==Auth.getUsername());
        return (
            <div>
                <Ui.Paper zDepth={3} style={this.style} className="column">
                    <div>
                        <Select options={result} onChange={this.handleChange}/>
                    </div>
                    <div>
                        <form>
                            <Ui.RaisedButton onClick={this.handleAdd} label="Rozpocznij" primary={true} />
                        </form>
                    </div>
                </Ui.Paper>
            </div>
        );

    }


    onContentChange = (event) => {


        if (event.target.value === "") {
            this.setState({
                empty: true
            });
        }

    };

    handleAdd = () => {

        this.instance.post('/create', {
            userTo:this.state.selectedOption
        }).then(response => {
            this.props.history.push("/chat/id/" + response.data.id);
        })

    };

    componentDidMount = () => {

        let initialPlanets = [];
        fetch('http://localhost:8080/users')
            .then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
            initialPlanets = data.map((planet) => {
                return planet
            });
            console.log(initialPlanets);
            this.setState({
                users: initialPlanets,
            });
        });


        if(!Auth.isUserAuthenticated()) {

            this.props.history.push('/login');

        }

    };

}

export default AddChat;