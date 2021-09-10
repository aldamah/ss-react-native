import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({ isConnected: true });

export class NetworkProvider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            connexion: null
        }

        this.connexionlistner

    }
    handleConnectivityChange = state => {


        const that = this
        if (state.isConnected) {
           that.setState({
               connexion:true
           })
        }
        else {
            that.setState({
                connexion:false
            })
        }
    }

    componentDidMount() {
        const that = this
        this.connexionlistner = NetInfo.addEventListener(this.handleConnectivityChange);
    }

    componentWillUnmount() {
        this.connexionlistner && this.connexionlistner()
    }


    render() {
        return (
            <NetworkContext.Provider value={this.state}>
                {this.props.children}
            </NetworkContext.Provider>
        );
    }
}