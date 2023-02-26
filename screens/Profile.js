import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, Pressable, Image, TextInput, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { saveEmail, saveName, saveProfileImage, savePhoneNumber, saveUserNotifications, signOut } from "../utils/userSlice";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaskedTextInput } from "react-native-mask-text";
import * as React from 'react'
import * as ImagePicker from 'expo-image-picker';
import { nameValidation, validateEmail } from "../utils/Validation";
import UserAvatar from 'react-native-user-avatar';


export function ProfileScreen({navigation}) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [fname, setFName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [lname, setLName] = React.useState('');
    const [image, setImage] = React.useState('');
    const [pnum, setPNum] = React.useState('');
    const [userNotifications, setUserNotifications] = React.useState(user.userNotifications)

        
    React.useEffect(() => {
        setPNum(user.phoneNumber)
        setEmail(user.email)
        setFName(user.name.split(' ')[0])
        setLName(user.name.split(' ')[1])
        setImage(user.profileImage)
        
        
      }, []);
    async function onPressLogOut() {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error(e);
        } finally{
            dispatch(signOut())
            console.log('Done')
        }
        
    }

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,

        });
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    function removeImage() {
        setImage(null);
    }

    function discardChanges() {
        setImage(user.profileImage);
        setPNum(user.phoneNumber)
        setEmail(user.email)
        setFName(user.name.split(' ')[0])
        setLName(user.name.split(' ')[1])
    }

    async function saveChanges() {
        let changesArray = []
        if (user.name != `${fname} ${lname}`) {
            let newName = `${fname} ${lname}`;
            if (nameValidation(newName)) {
                dispatch(saveName(newName));
                changesArray.push(["App_User_name", newName]);
            } else {
                Alert.alert(`Please make sure there is no numbers on your name`);
                setFName(user.name.split(' ')[0]);
                setLName(user.name.split(' ')[1])
            }
        }
        if (user.email != email) {
            if (validateEmail(email)) {
                dispatch(saveEmail(email));
                changesArray.push(["App_User_email", email]);
            } else {
                Alert.alert('Please make sure you used the proper format on your email');
                setEmail(user.email)
            }
        }
        if (user.profileImage != image) {
            if(image === null){
                await AsyncStorage.removeItem("App_User_profileImage")
                dispatch(saveProfileImage(image))

            } else{
                dispatch(saveProfileImage(image))
                changesArray.push(["App_User_profileImage", image]);
            }
        }
        if (user.phoneNumber != pnum) {
            dispatch(savePhoneNumber(pnum))
            changesArray.push(["App_User_phoneNumber", pnum]);
        }
        if (user.userNotifications != userNotifications) {
            dispatch(saveUserNotifications(userNotifications))
            changesArray.push(["App_User_UserNotificationOrderStatuses", String(userNotifications.OrderStatuses)]);
            changesArray.push(["App_User_UserNotificationPasswordChanges", String(userNotifications.PasswordChanges)]);
            changesArray.push(["App_User_UserNotificationSpecialOffers", String(userNotifications.SpecialOffers)]);
        }
        if(changesArray.length>0){
            try {
            
                await AsyncStorage.multiSet(changesArray)
                
            } catch (e) {
                console.error(e)
            }

        } 
        Alert.alert('Profile information updated!');
    }


    return (
        <View style={profileScreenStyle.container}>
            <View style={profileScreenStyle.header}>
                <Pressable 
                onPress={() =>{
                    navigation.navigate('Home')
                }}
                style={profileScreenStyle.backButton} >
                    <Text style={profileScreenStyle.buttonText} >Back</Text>
                </Pressable>
                <Image
                    style={{ height: 100, width: 200, resizeMode: 'contain' }}
                    source={require('../assets/Logo.png')}
                />
            </View>
            <ScrollView style={profileScreenStyle.inputsContainer} keyboardDismissMode='on-drag'>

                <Text style={{ fontSize: 25, fontWeight: 'bold', padding: 10 }}>Personal Information</Text>

                <View style={profileScreenStyle.avatarContainer}>
                    {image ? <Image
                        style={{ height: 70, width: 70, resizeMode: 'contain', borderRadius: 50, marginHorizontal: 10 }}
                        source={{ uri: image }} /> : <UserAvatar size={100} name={user.name} bgColor='#F4CE14' textColor='#000000'/> }
                    <Pressable onPress={pickImage}
                        style={({ pressed }) => [
                            {
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                margin: 20,
                                height: 50,
                                borderRadius: 10,
                                backgroundColor: pressed ? '#c7ddb5' : '#87ab69'
                            }
                        ]} >
                        <Text style={profileScreenStyle.buttonText} >Change</Text>
                    </Pressable>
                    <Pressable onPress={removeImage} style={({ pressed }) => [
                        {
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            margin: 20,
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: pressed ? '#87ab69' : '#c7ddb5'
                        }
                    ]} >
                        <Text style={profileScreenStyle.buttonText} >Remove</Text>
                    </Pressable>

                </View>


                <Text style={profileScreenStyle.text}>First Name</Text>
                <TextInput
                    value={fname}
                    style={profileScreenStyle.inputsText}
                    onChangeText={setFName}
                />
                <Text
                    style={profileScreenStyle.text}>Last Name</Text>
                <TextInput
                    value={lname}
                    style={profileScreenStyle.inputsText}
                    onChangeText={setLName}

                />
                <Text style={profileScreenStyle.text}>Email</Text>
                <TextInput
                    value={email}
                    style={profileScreenStyle.inputsText}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
                <Text style={profileScreenStyle.text}>Phone number</Text>
                <MaskedTextInput
                    value={pnum}
                    mask="(999)-999-9999"
                    onChangeText={setPNum}
                    style={profileScreenStyle.inputsText}
                    keyboardType='numeric'
                />

                <Text style={{ fontSize: 25, fontWeight: 'bold', padding: 10 }}>Email notifications</Text>
                <BouncyCheckbox
                    isChecked={userNotifications.OrderStatuses}
                    fillColor="#87ab69"
                    text="Order statuses"
                    textStyle={{ textDecorationLine: 'none' }}
                    style={{ margin: 10 }}
                    onPress={(isChecked) => setUserNotifications((prevState) =>({
                        ...prevState,
                        OrderStatuses:isChecked,
                    }))}
                />
                <BouncyCheckbox
                    isChecked={userNotifications.SpecialOffers}
                    fillColor="#87ab69"
                    text="Special offers"
                    textStyle={{ textDecorationLine: 'none' }}
                    style={{ margin: 10 }}
                    onPress={(isChecked) => setUserNotifications((prevState) =>({
                        ...prevState,
                        SpecialOffers:isChecked,
                    }))}
                    
                />
                <BouncyCheckbox
                    isChecked={userNotifications.PasswordChanges}
                    fillColor="#87ab69"
                    text="Password changes"
                    textStyle={{ textDecorationLine: 'none' }}
                    style={{ margin: 10 }}
                    onPress={(isChecked) => setUserNotifications((prevState) =>({
                        ...prevState,
                        PasswordChanges:isChecked,
                    }))}
                    
                />

            </ScrollView>
            <View style={profileScreenStyle.footer}>
                <Pressable onPress={onPressLogOut} style={({ pressed }) => [
                    {
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',

                        margin: 10,
                        width: 300,
                        height: 55,
                        borderRadius: 20,
                        backgroundColor: pressed ? '#87ab69' : '#c7ddb5'

                    }
                ]} >
                    <Text style={profileScreenStyle.buttonText} >Log out</Text>
                </Pressable>
                <View style={profileScreenStyle.footerSubContainer}>
                    <Pressable onPress={discardChanges} style={({ pressed }) => [
                        {
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 150,
                            margin: 10,
                            height: 50,
                            backgroundColor: pressed ? '#87ab69' : '#c7ddb5'

                        }
                    ]} >
                        <Text style={profileScreenStyle.buttonText} >Discard changes</Text>
                    </Pressable>
                    <Pressable onPress={saveChanges} style={({ pressed }) => [
                        {
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 150,
                            margin: 10,
                            height: 50,
                            backgroundColor: pressed ? '#c7ddb5' : '#87ab69'

                        }
                    ]} >
                        <Text style={profileScreenStyle.buttonText}>Save changes</Text>
                    </Pressable>
                </View>

            </View>
        </View>

    )
}


const profileScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87ab69',

    },
    header: {
        flex: 0.12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#87ab69',
        paddingTop: 30,
    },
    avatarContainer: {

        flexDirection: 'row',
        backgroundColor: '#c7ddb5',
        margin:10
    },
    inputsContainer: {
        flex: 0.8,
        backgroundColor: '#c7ddb5',
    },
    inputsText: {
        fontSize: 20,
        padding: 15,
        borderWidth: 2,
        borderRadius: 15,
        marginHorizontal: 5,
        marginBottom: 20

    },
    text: {
        fontSize: 16,
        padding: 5
    },
    logOutButton: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',

        margin: 10,
        width: 300,
        height: 55,
        borderRadius: 20,
        backgroundColor: '#c7ddb5',

    },
    backButton: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        margin: 30,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#c7ddb5',

    },
    changeAvatarButton: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        margin: 20,
        height: 50,
        borderRadius: 10,

    },
    removeAvatarButton: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        margin: 20,
        height: 50,
        backgroundColor: '#c7ddb5',

    },
    discardChangesButton: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        margin: 10,
        height: 50,
        backgroundColor: '#c7ddb5',

    },
    saveChangesButton: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        margin: 10,
        height: 50,
        backgroundColor: '#87ab69',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    footer: {

        flex: 0.24,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#c7ddb5',

    },
    footerSubContainer: {
        flex: 0.07,
        flexDirection: 'row',
        backgroundColor: '#c7ddb5',

    }
})