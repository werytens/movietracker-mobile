import { useState } from 'react';
import { Button, StatusBar, Text, TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import { Api } from '../assets/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({updating, setUpdating}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        const r = await Api.loginUser(username, password);

        await AsyncStorage.setItem('authToken', r.data.token);
        setUpdating(updating + 1);
    }

    return (
        <Container>
            <Block>
                <Title>Movietracker Login</Title>
                <Input 
                    placeholder='username'
                    onChangeText={text => setUsername(text)}
                />
                <Input 
                    placeholder='password' 
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                />
                <Button 
                    title='Login' 
                    color="#9c8d64"
                    onPress={login}
                />
            </Block>
            {/* <StatusBar styles="auto" /> */}
        </Container>
    );
}

const Container = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
    widht: 100%;
    height: 100%;
`;

const Input = styled(TextInput)`
    color: #181c24;
    background-color: #EDEDED;
    padding: 5px;
    border-radius: 4px;
`

const Title = styled(Text)`
    color: #EDEDED;
    text-align: center;
    font-size: 20px;
    text-transform: uppercase;
`

const Block = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 50%;
    padding: 10px;
    background-color: #181c24;
    border-radius: 4px;
`