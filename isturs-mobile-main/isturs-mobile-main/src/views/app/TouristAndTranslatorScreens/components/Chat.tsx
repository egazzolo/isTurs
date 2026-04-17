import React, {useState, useEffect, useRef} from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, Image, StyleSheet, useWindowDimensions, Alert as RNAlert, } from 'react-native';
import axiosClient from '../../../../api';
import {useTranslation} from '../../../../i18n';
import {launchImageLibrary} from 'react-native-image-picker';
import messaging from '@react-native-firebase/messaging';

const Chat = ({data}: any) => {
  const {t} = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const chatId = data.turistProgress[0]._id;
  const {height} = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const lastMessageCount = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, 2000);
    fetchMessages();
    return () => clearInterval(intervalId);
  }, [chatId]);

  useEffect(() => {
    if (isFirstLoad && flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

  // Track unread messages
  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      const newMessages = messages.length - lastMessageCount.current;
      if (!isChatVisible && lastMessageCount.current > 0) {
        setUnreadCount(prev => prev + newMessages);
      }
      lastMessageCount.current = messages.length;
    }
  }, [messages]);

  // Listen for push notifications while app is open
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      fetchMessages();
    });
    return unsubscribe;
  }, []);

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
        await axiosClient.post('/chats/createMessage', {
          chatId,
          text: inputText,
        });
        setInputText('');
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const sendPhoto = async () => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true, quality: 0.7},
      async response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (!asset?.base64) return;
        try {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;

          // Upload to Supabase via backend
          const uploadResponse = await axiosClient.post(
            '/uphold/uploadChatImage',
            {
              image: base64Image,
            },
          );

          const imageUrl = uploadResponse.data?.imageUrl;
          if (imageUrl) {
            await axiosClient.post('/chats/createMessage', {
              chatId,
              text: '',
              imageUrl,
            });
            fetchMessages();
          }
        } catch (error) {
          console.error('Error sending photo:', error);
        }
      },
    );
  };

  const handleChatVisible = () => {
    setIsChatVisible(true);
    setUnreadCount(0);
  };

  const renderMessageItem = ({item}: any) => {
    const isTourist = item.profiles?.role === 'TURIST';
    return (
      <View
        style={[
          styles.messageRow,
          isTourist ? styles.touristMessageRow : styles.driverMessageRow,
        ]}>
        <View
          style={[
            styles.messageContainer,
            isTourist
              ? styles.touristMessageContainer
              : styles.driverMessageContainer,
          ]}>
          {!isTourist && (
            <View style={styles.avatarContainer}>
              <Image
                source={{uri: item.profiles?.profile_img}}
                style={styles.avatar}
              />
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isTourist ? styles.touristMessage : styles.driverMessage,
            ]}>
            <Text style={styles.roleText}>
              {isTourist
                ? `${t.touristRole} - ${item.profiles?.name}`
                : `${t.operatorHomeRole} - ${item.profiles?.name}`}
            </Text>
            {item.image_url ? (
              <Image
                source={{uri: item.image_url}}
                style={styles.messageImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
          </View>
          {isTourist && (
            <View style={styles.avatarContainer}>
              <Image
                source={{uri: item.profiles?.profile_img}}
                style={styles.avatar}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{...styles.container, height: height - 220}}>
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {unreadCount} {t.newMessages}
          </Text>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
        onContentSizeChange={() => {
          if (isFirstLoad) {
            flatListRef.current?.scrollToEnd({animated: true});
          }
        }}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={sendPhoto} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>📷</Text>
        </TouchableOpacity>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={t.typeMessage}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendText}>{t.send}</Text>
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
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
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
  unreadBadge: {
    backgroundColor: '#0373f3',
    padding: 8,
    borderRadius: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  photoButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 22,
  },
});

export default Chat;