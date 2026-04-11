import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import axiosClient from '../../../../api';

const Chat = ({ data }: any) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const chatId = data.turistProgress[0]._id;
  const { height } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Fetch messages every 2 seconds
    const intervalId = setInterval(fetchMessages, 2000);

    // Initial fetch
    fetchMessages();

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [chatId]);

  useEffect(() => {
    if (isFirstLoad && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

  const fetchMessages = async () => {
    try {
      const response = await axiosClient.get(`/chats/messages/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      try {
        const messageData = {
          chatId: chatId,
          text: inputText,
        };
        await axiosClient.post(`/chats/createMessage`, messageData);
        setInputText(''); // Clear input after sending
        fetchMessages(); // Refresh messages after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessageItem = ({ item }: any) => {
    const isTourist = item.user_role === 'TURIST';
    return (
      <View
        style={[
          styles.messageRow,
          isTourist ? styles.touristMessageRow : styles.driverMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageContainer,
            isTourist
              ? styles.touristMessageContainer
              : styles.driverMessageContainer,
          ]}
        >
          {!isTourist && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.user_img }} style={styles.avatar} />
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isTourist ? styles.touristMessage : styles.driverMessage,
            ]}
          >
            <Text style={styles.roleText}>
              {isTourist ? `Turista - ${item.user_name}` : `Trasladista - ${item.user_name}`}
            </Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
          {isTourist && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.user_img }} style={styles.avatar} />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ ...styles.container, height: height - 220 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        style={styles.messageList}
        onContentSizeChange={() => {
          if (isFirstLoad) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu mensaje"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageList: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  touristMessageRow: {
    justifyContent: 'flex-end',
  },
  driverMessageRow: {
    justifyContent: 'flex-start',
  },
  touristMessageContainer: {
    marginRight: 8,
  },
  driverMessageContainer: {
    marginLeft: 8,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    width: '70%',
  },
  touristMessage: {
    backgroundColor: '#dcf8c6',
    marginRight: 8,
    marginLeft: 'auto',
  },
  driverMessage: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    marginLeft: 8,
    marginRight: 'auto',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e4',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
    backgroundColor: '#fff',
    color: 'black',
  },
  sendText: {
    alignSelf: 'center',
    color: '#007bff',
    fontSize: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 2,
  },
});

export default Chat;
