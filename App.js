import { StatusBar } from 'expo-status-bar';
import { OnboardingScreen } from './screens/Onboarding';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from './screens/Profile';
import { Provider } from 'react-redux';
import { store } from './utils/store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { saveEmail, saveName, savePhoneNumber, saveProfileImage, saveUserNotifications } from './utils/userSlice';
import { SplashScreen } from './screens/Splash';
import { HomeScreen } from './screens/Home';


const Stack = createNativeStackNavigator();


function App() {


  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)


  React.useEffect(() => {

    (async () => {
      try {
        
          const result = await AsyncStorage.multiGet(["App_User_name", "App_User_email","App_User_phoneNumber", "App_User_profileImage", "App_User_UserNotificationOrderStatuses", "App_User_UserNotificationPasswordChanges", "App_User_UserNotificationSpecialOffers" ]);
          if (result !== null) {
            dispatch(saveName(result[0][1]));
            dispatch(saveEmail(result[1][1]));
            dispatch(savePhoneNumber(result[2][1]));
            dispatch(saveProfileImage(result[3][1]));
            let newUserNotifications = {
              OrderStatuses: JSON.parse(result[4][1]),
              PasswordChanges: JSON.parse(result[5][1]),
              SpecialOffers: JSON.parse(result[6][1])
            };
            dispatch(saveUserNotifications(newUserNotifications)); 
          }
        
          await new Promise(resolve => setTimeout(resolve, 2000));
        


      } catch (e) {

        console.error(e)
      }
    })();
  }, [user.isLoading]);

  if (user.isLoading) {
    return <SplashScreen />
  }



  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ header: () => null }}>

        { user.isSignedIn ? 
          (<>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            </>)
          : (<Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
      </Stack.Navigator>
    </NavigationContainer>



  ); 
}

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>

  )
}