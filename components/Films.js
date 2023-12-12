import { StatusBar, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FilmSearch from './FilmSearch';
import { useState, useEffect } from 'react';
import { Api } from '../assets/api';
import Film from './Film';

export default function Films({ id }) {
    const [films, setFilms] = useState();
    const [updatingFilms, setUpdatingFilms] = useState(0);
    const [activeIndex, setActiveIndex] = useState(1);

    useEffect(() => {
        const auth = async () => {
            const responseFilms = await Api.getFilms(id);
            if (responseFilms.data.isOk) {
                setFilms(responseFilms.data.films)
            }
        }
        auth();
    }, [updatingFilms, id]);

    return (
        <Container>
            <FilmSearch userId={id} updatingFilms = {updatingFilms} setUpdatingFilms = {setUpdatingFilms} />
            <List>
                {
                    films ?
                        films.map((item, index) => (
                            <View key={index + 1000000000}>
                                <StatusButton
                                    onPress={() => (setActiveIndex(index))}
                                >
                                    <StatusText>
                                        {item.name}
                                    </StatusText>
                                </StatusButton>
                                <View style={activeIndex === index ? {display: 'block'} : {display: 'none'}}>
                                    {
                                        item.films.map((film, filmsIndex) => (
                                            <View key={Number(film.id + String(index))}>
                                                <Film userId={id} film={film} updatingFilms = {updatingFilms} setUpdatingFilms = {setUpdatingFilms} />
                                            </View>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                        : null
                }
            </List>
        </Container>
    );
}

const Container = styled.ScrollView`
    width: 100%;
    height: 100%;
    background-color: #374139;
`;

const List = styled.View`
    width: 100 %;
    background-color: #181c24;
    padding: 10px;
`

const StatusButton = styled(TouchableOpacity)`
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #0c0e12;
    padding: 20px 2px;
    border-radius: 4px;
`

const StatusText = styled(Text)`
    color: #EDEDED;
    text-align: center;
    text-transform: uppercase;
` 

