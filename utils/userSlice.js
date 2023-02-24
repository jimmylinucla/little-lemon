import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : {
        name:null,
        email:null,
        phoneNumber:null,
        isSignedIn:false,
        isLoading:true,
        profileImage:null,
        userNotifications:{
            PasswordChanges:false,
            OrderStatuses:false,
            SpecialOffers:false  
        }
    }
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        saveName:(state, action) =>{
            state.user.name = action.payload 
            
        },
        saveEmail:(state, action) =>{
            state.user.email = action.payload
            
        },
        savePhoneNumber:(state, action) =>{
            state.user.phoneNumber = action.payload
            
        },
        saveProfileImage:(state, action) =>{
            state.user.profileImage = action.payload
            
        },
        
        signIn:(state, action) =>{
            state.user.isSignedIn = action.payload
        },

        isLoading:(state, action) =>{
            state.user.isLoading = action.payload
        },

        saveUserNotifications:(state, action) =>{
            state.user.userNotifications.OrderStatuses = action.payload.OrderStatuses
            state.user.userNotifications.PasswordChanges = action.payload.PasswordChanges
            state.user.userNotifications.SpecialOffers = action.payload.SpecialOffers

        },
        signOut:(state) =>{
            state.user =  {
                name:null,
                email:null,
                phoneNumber:null,
                isSignedIn:false,
                isLoading:true,
                profileImage:null,
                userNotifications:{
                    PasswordChanges:false,
                    OrderStatuses:false,
                    SpecialOffers:false  
                }
            } 
        }
    },

})

export const {isLoading, savePhoneNumber, signIn, saveProfileImage, saveEmail, saveName, saveUserNotifications, signOut} = userSlice.actions

export default userSlice.reducer
