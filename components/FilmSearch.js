import { Button, StatusBar, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import { useEffect, useState } from 'react';
import { Api, kinopoiskApi } from '../assets/api';

export default function FilmSearch({ userId, updatingFilms, setUpdatingFilms }) {

    const [keywords, setKeywords] = useState('');
    const [films, setFilms] = useState([]);

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
                                        onPress={() => {addFilm(item.filmId)}}
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