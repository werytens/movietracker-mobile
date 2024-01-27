import { Button, StatusBar, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import { useState, useEffect, useRef } from 'react';
import { Api, kinopoiskApi } from '../assets/api';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function FilmSearch({ userId, updatingFilms, setUpdatingFilms }) {
    const [keywords, setKeywords] = useState('');
    const [films, setFilms] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState('');
      const [notification, setNotification] = useState(false);
      const notificationListener = useRef();
      const responseListener = useRef();

      useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });

        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);


    const getSearchedFilms = async () => {
        if (keywords.length > 0) {
            const response = await kinopoiskApi.getFilms(keywords);
            setFilms(response.data.films);
        }
    }

    const addFilm = async (id) => {
        await Api.addFilm(userId, id);
        setFilms([]);
        setKeywords('');
        setUpdatingFilms(updatingFilms + 1);
    }

    return (
        <Container>
            <Input
                placeholder='Input film name'
                onChangeText={(text) => { setKeywords(text) }}
            />
            {
                keywords ?
                    <Button
                        onPress={getSearchedFilms}
                        title='Search'
                        color={'#515e73'}
                    />
                    : null
            }
            <List>
                {
                    films && keywords ?
                        <View>
                            {
                                films?.map((item, index) => (
                                    <Film
                                        key={index}
                                        onPress={() => { addFilm(item.filmId) }}
                                    >
                                        <FilmImage
                                            source={{
                                                uri: item.posterUrl
                                            }}
                                            style={{ width: 110, height: 180, objectFit: 'cover' }}
                                        />
                                        <Flex>
                                            <WhiteText>
                                                {item.nameEn ? item.nameEn : item.nameRu}
                                            </WhiteText>
                                            <WhiteText>
                                                {item.description}
                                            </WhiteText>
                                        </Flex>
                                    </Film>
                                ))
                            }
                        </View>
                        : null
                }
            </List>
        </Container>
    );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const Container = styled.View`
    width: 100%;
    background-color: #181c24;
    padding: 10px;
    margin-bottom: 10px;
`;

const Input = styled(TextInput)`
    background-color: #EDEDED;
    color: #EDEDED;
    border-radius: 2px;
    padding: 2px;
    color: #181c24;
`

const List = styled.View`
    width: 100 %;
    background-color: #181c24;
    padding: 10px;
`

const FilmImage = styled(Image)`
    margin-right: 10px;
    border-radius: 4px;
`

const Film = styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    margin-bottom: 50px;
`

const WhiteText = styled(Text)`
    color: #EDEDED;
    max-width: 80%;
    text-align: justify;
    margin-bottom: 20px;
`

const Flex = styled(View)`
    display: flex;
`