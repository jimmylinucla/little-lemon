import * as React from 'react';
import { View, Pressable, Image, Text, StyleSheet, FlatList, TextInput, Alert, ScrollView } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { useSelector } from 'react-redux';
import { Searchbar } from 'react-native-paper';
import { getMenuItems, saveMenuItems, createTable, filterByQueryAndCategories } from '../utils/database';
import { Categories } from '../components/Categories';
import debounce from 'lodash.debounce';

const categories = ['starters', 'mains', 'desserts', 'drinks']

export function HomeScreen({ navigation }) {
    const [data, setData] = React.useState([]);
    const [searchBarText, setSearchBarText] = React.useState('');
    const [query, setQuery] = React.useState('');
    const [filterCategories, setFilterCategories] = React.useState(
        categories.map(() => false)
    );

    const getDataFromApi = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
            const json = await response.json()

            return json.menu
        } catch (e) {
            console.error(e)
        }
    }

    React.useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
                if (!menuItems.length){
                    const menuItems = await getDataFromApi();
                    await saveMenuItems(menuItems);
                }

                setData(menuItems);

            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            const activeCategories = categories.filter((s, i) => {

                if (filterCategories.every((item) => item === false)) {
                    return true;
                }
                return filterCategories[i];
            });
            try {

                const menuItems = await filterByQueryAndCategories(
                    searchBarText,
                    activeCategories
                );

                setData(menuItems)

            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [filterCategories, query]);
   

    const lookup = React.useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = React.useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleCategoriesChange = async (index) => {
        const arrayCopy = [...filterCategories];
        arrayCopy[index] = !filterCategories[index];
        setFilterCategories(arrayCopy);
    };

    const Item = ({ name, description, price }) => {
        return (
            <View style={{ width: 280 }}>
                <Text style={homeScreenStyle.titleText}>{name}</Text>
                <Text style={homeScreenStyle.descriptionText} numberOfLines={2}>{description}</Text>
                <Text style={homeScreenStyle.priceText}>${price}</Text>
            </View>
        )
    }
    const ItemImage = ({ image }) => {
        return (
            <Image style={{ height: 120, width: 120, resizeMode: 'cover', margin: 10 }}
                source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true` }} />
        )
    }
    const renderItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, margin: 15 }}>
                <Item name={item.name} description={item.description} price={item.price} />
                <ItemImage image={item.image} />
            </View>
        )
    }

    const { user } = useSelector(state => state.user)
    return (
        <View style={homeScreenStyle.container}>
            <View style={homeScreenStyle.header}>
                <Image
                    style={{ height: 100, width: 200, resizeMode: 'contain' }}
                    source={require('../assets/Logo.png')}
                />
                <Pressable
                    onPress={() => {
                        navigation.navigate('Profile')
                    }}
                    style={homeScreenStyle.backButton} >
                    {user.profileImage ? <Image
                        style={{ height: 70, width: 70, resizeMode: 'contain', borderRadius: 50, marginHorizontal: 10 }}
                        source={{ uri: user.profileImage }} /> : <UserAvatar size={50} name={user.name} bgColor='#F4CE14' textColor='#000000' />}
                </Pressable>
            </View>
            <View style={homeScreenStyle.heroContainer}>
                <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#F4CE14', padding: 10 }}>Little Lemon</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.9 }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FFFFFF', padding: 10 }}>Chicago</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', padding: 10, width: 280 }}>We are a family owned Mediterranean restaurant, focused on traditional
                            recipes served with a modern twist</Text>
                    </View>
                    <Image
                        style={{ height: 170, width: 140, resizeMode: 'stretch', borderRadius: 10 }}
                        source={require('../assets/Hero.png')}

                    />
                </View>
                <Searchbar
                    style={{ fontSize: 20, borderWidth: 1, margin: 10, backgroundColor: '#c7ddb5' }}
                    placeholder='Search'
                    onChangeText={handleSearchChange}
                />
            </View>
            <View style={homeScreenStyle.sectionsContainer}>
                <Categories
                    onChange={handleCategoriesChange}
                    categories={categories}
                    selections={filterCategories}
                />
            </View>
            <FlatList
                style={homeScreenStyle.ListContainer}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}


const homeScreenStyle = StyleSheet.create({
    container: {
        flex: 4,
        backgroundColor: '#c7ddb5',

    },
    header: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#c7ddb5',
        paddingTop: 30,
        margin: 10,
        marginTop: 20
    },
    sectionsContainer: {
        flex: 0.3,
        borderBottomWidth: 1,
        marginTop:10


    },
    heroContainer: {
        flex: 0.9,
        backgroundColor: '#495E57',

    },
    ListContainer: {
        flex: 2,
        backgroundColor: '#c7ddb5',
    },

    backButton: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        margin: 30,
        marginLeft: 45,
        height: 45,
        borderRadius: 20,
        backgroundColor: '#c7ddb5',

    },

    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10
    },
    descriptionText: {
        fontSize: 20,
        marginBottom: 10,
        flex: 1
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'flex-end'
    },


})