import * as React from 'react'
import {
    TextInput,
    View,
    StyleSheet,
    Text,
    Image,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native"
import { useSelector, useDispatch } from 'react-redux';
import { saveEmail, saveName, saveUser, signIn, stopLoading } from '../utils/userSlice';
import { nameValidation, emailValidation } from '../utils/Validation';

import AsyncStorage from '@react-native-async-storage/async-storage';

export function OnboardingScreen() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const dispatch = useDispatch()
    

    
    const onPress = () => {
        if (!nameValidation(name) || !emailValidation(email)) {
            return Alert.alert(`Please provide us the following information to give you a better experience:\n${nameValidation(name) ? '' : '\nName'} \n ${emailValidation(email) ? '' : '\nEmail'}`)
        }
        const namePair = ["App_User_name", name];
        const emailPair = ["App_User_email", email];
        
        (async ()=>{
            try{
                await AsyncStorage.multiSet([namePair, emailPair])
                Alert.alert('Thanks for loggin in!')
                dispatch(saveName(name))
                dispatch(saveEmail(email))
                dispatch(signIn(true))
            } catch(e){
                console.error(e)
            }
        })();
    }
 

    return (

        <KeyboardAvoidingView
            style={boardingStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'heigth'}
        >
            <View style={boardingStyles.header}>
                <Image
                    style={{ height: 100, width: 300, resizeMode: 'contain' }}
                    source={require('../assets/Logo.png')}
                />
            </View>
            <View style={boardingStyles.messageContainer}>
                <Text style={boardingStyles.font}>Let us get to know you</Text>
            </View>
            <View style={boardingStyles.subContainer}>
                <Text style={boardingStyles.font}>Full Name</Text>
                <TextInput
                    style={boardingStyles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder='Enter your full name'
                    keyboardType=''
                />
                <Text style={boardingStyles.font}>Email</Text>
                <TextInput
                    style={boardingStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Enter your email'
                    keyboardType='email-address'
                />
            </View>
            <View style={boardingStyles.footer}>
                <Pressable onPress={onPress} style={boardingStyles.button}>
                    <Text style={boardingStyles.font}>Next</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>



    );
};

const boardingStyles = StyleSheet.create({
    container: {
        flex: 1

    },
    header: {
        flex: 0.13,
        alignItems: 'center',
        backgroundColor: '#87ab69',
        paddingTop: 30,
    },
    messageContainer: {
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#c7ddb5',
        paddingTop: 30,
    },
    subContainer: {
        flex: 0.65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c7ddb5',
    },
    font: {
        fontSize: 30

    },
    input: {
        borderWidth: 1,
        padding: 10,
        height: 50,
        width: 300,
        margin: 20,
        borderRadius: 15,
        fontSize: 30,
        backgroundColor: '#c7ddb5'
    },
    button: {
        borderWidth: 2,
        alignItems: 'center',
        padding: 10,
        margin: 50,
        width: 100,
        height: 55,
        borderRadius: 20,
        backgroundColor: '#c7ddb5',

    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 0.2,
        backgroundColor: '#87ab69',

    }
});