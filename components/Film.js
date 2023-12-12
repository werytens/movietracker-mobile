import styled from 'styled-components/native';
import { StatusBar, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Button } from 'react-native';
import { useState } from 'react';
import { Api } from '../assets/api';

export default function Film({ film, userId, updatingFilms, setUpdatingFilms }) {

    const [visible, setVisible] = useState(false);

    const changeStatus = async (index) => {
       await Api.changeFilmStatus(userId, film?.id, index + 1);
        setUpdatingFilms(updatingFilms + 1);
    }

    return (
        <FilmBlock>
            <FilmButton
                onPress={() => { setVisible(!visible) }}
            >
                <FilmText>
                    {film.title}
                </FilmText>
            </FilmButton>
            <FilmDescription style={visible ? { display: 'block' } : { display: 'none' }}>
                <Header>
                    <FilmImage
                        source={{
                            uri: film.poster
                        }}
                        style={{ width: 110, height: 180, objectFit: 'cover' }}
                    />
                    <Description>
                        {film.description}
                    </Description>
                </Header>
                <View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <FilmText>
                            {film.runtime} • {film.releaseDate}
                        </FilmText>
                        <FilmText>
                            {film.rate} • {film.votersCount}
                        </FilmText>
                    </View>
                    <FilmText>
                        {film.genre}
                    </FilmText>
                    <View>
                        <Button title='Favorite' onPress={() => {changeStatus(0)}} />
                        <Button title='Planned' onPress={() => {changeStatus(1)}} />
                        <Button title='Delayed' onPress={() => {changeStatus(2)}} />
                        <Button title='Watching' onPress={() => {changeStatus(3)}} />
                        <Button title='Watched' onPress={() => {changeStatus(4)}} />
                        <Button title='Abandoned' onPress={() => {changeStatus(5)}} />
                    </View>
                </View>
            </FilmDescription>
        </FilmBlock>
    )
}

const FilmBlock = styled(View)`
    padding-top: 10px;
    padding-bottom: 10px;
`

const FilmButton = styled(TouchableOpacity)`
    background-color: #131017;
    padding: 10px;
    border-radius: 4px;
    margin-top: 4px;
    margin-bottom: 4px;
`

const FilmText = styled(Text)`
    color: #909090;
    font-size: 12px; 
`

const FilmDescription = styled(View)`
    background-color: #131017;
    padding: 10px;
    border-radius: 4px;
`
const Description = styled(Text)`
    text-align: justify;
    color: #909090;
    font-size: 12px; 
    line-height: 18px;
    flex-wrap: wrap;
    max-width: 65%;
`

const Header = styled(View)`
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
`

const FilmImage = styled(Image)`
    margin-right: 10px;
`