import { View,StyleSheet,Image } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react'
import {isLoading, signIn} from '../utils/userSlice';



export function SplashScreen() {

    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch()

    const onLayout = async () =>{
        try{
            await new Promise(resolve => setTimeout(resolve, 2000));
            if(user.name !== null && user.email !== null){
                dispatch(signIn(true))
            }
            dispatch(isLoading(false))
        } catch (e){
            console.error(e)
        }
    }
   

    return (
       
        <View style={splashScreenStyles.container} onLayout={onLayout} >
            <Image
                style={{ height: 100, width: 300, resizeMode: 'contain' }}
                source={require('../assets/Logo.png')}
            />
        </View>
    )
    }

const splashScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87ab69',
        justifyContent:'center',
        alignItems:'center'
    }
})