import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Image, Platform} from 'react-native';
import PropTypes from 'prop-types';
import ChatBubble from './ChatBubble/ChatBubble';
import Chat from './Chat/Chat';
GLOBAL.cookie = '';
import {init} from './livechat-visitor-sdk.min.js';

const chatIcon = require('../assets/chat.png');

const {height, width} = Dimensions.get('window');

export default class LiveChat extends Component {
  constructor(props) {
    super(props);
    GLOBAL.cookie = '';
    this.defineStyles();
    this.state = {
      isChatOn: false,
      chatHeight: height - 150,
      bubble: props.bubble ? (
        props.bubble
      ) : (
        <View style={this.styles.bubbleStyle}>
          <Image source={chatIcon} style={this.styles.icon} />
        </View>
      ),
    };
    if (!GLOBAL.visitorSDK) {
      GLOBAL.visitorSDK = init({
        license: props.license,
        group: props.group,
      });
    }
    props.onLoaded(GLOBAL.visitorSDK);
  }

  defineStyles() {
    this.styles = StyleSheet.create({
      bubbleStyle: {
        width: width / 5,
        height: width / 5,
        backgroundColor: this.props.bubbleColor,
        borderRadius: width / 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        width: width / 7,
        height: width / 7,
      },
      container: {
        flex: 1,
      },
    });
  }

  componentDidMount() {
    if (!this.props.showBubble) {
      this.openChat();
    }
  }

  openChat = () => {
    this.setState({isChatOn: true});
    GLOBAL.visitorSDK.startChat();
  };

  closeChat = () => {
    this.setState({isChatOn: false});
  };

  onContainerLayout = e => {
    const {
      nativeEvent: {
        layout: {height: h},
      },
    } = e;
    this.setState({chatHeight: h});
  };

  render() {
    return (
      <View style={this.styles.container} onLayout={this.onContainerLayout}>
        {this.props.showBubble ? (
          <ChatBubble
            left={this.props.bubbleLeft}
            top={this.props.bubbleTop}
            openChat={this.openChat}
            bubble={this.state.bubble}
            disabled={this.props.movable}
          />
        ) : null}
        <View style={{flex: 1, minHeight: this.state.chatHeight}}>
          <Chat
            {...this.props}
            isChatOn={this.state.isChatOn}
            closeChat={this.closeChat}
          />
        </View>
      </View>
    );
  }
}

LiveChat.propTypes = {
  license: PropTypes.string.isRequired,
  group: PropTypes.number,
  movable: PropTypes.bool,
  bubble: PropTypes.element,
  bubbleColor: PropTypes.string,
  bubbleLeft: PropTypes.number,
  bubbleTop: PropTypes.number,
  chatTitle: PropTypes.string,
  greeting: PropTypes.string,
  noAgents: PropTypes.string,
  onLoaded: PropTypes.func,
  chatAnimation: PropTypes.string,
  showNavigationBar: PropTypes.bool,
  showBubble: PropTypes.bool,
  showGreetingBubble: PropTypes.bool,
  showGreetingHeader: PropTypes.bool,
  placeholder: PropTypes.string,
};

LiveChat.defaultProps = {
  bubbleColor: '#2196F3',
  movable: true,
  onLoaded: () => {},
  bubbleLeft: width - width / 5 - width / 50,
  bubbleTop:
    Platform.OS === 'ios'
      ? height - width / 5 - width / 50
      : height - width / 5 - width / 13,
  chatTitle: 'Chat with us!',
  greeting: 'Welcome to our LiveChat!\nHow may We help you?',
  noAgents: 'Our agents are not available right now.',
  chatAnimation: null,
  showNavigationBar: false,
  showBubble: false,
  showGreetingBubble: false,
  showGreetingHeader: false,
  placeholder: 'Type a message...',
};
