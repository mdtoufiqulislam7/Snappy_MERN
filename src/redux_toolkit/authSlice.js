import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const base_url = "https://localhost:5000"


const initialState = {

    token:null,
    status:'idle',
    error:null
}



export const loginuser = createAsyncThunk('user/login',async({username,password},{rejectWithValue})=>{
    try {
        const response = await axios.post(`${base_url}/user/login`,{
            username,password
        })
        console.log(response.data.token)
        return response.data.token
    } catch (error) {
        if (!error.response) {
            throw error;
          }
          return rejectWithValue(error.response.data.message || 'Failed to login');
        
    }
})


const userslice = createSlice({
    name:'userauth',
    initialState,
    reducers:{
        logout: (state) => {
            state.token = null;
            localStorage.clear()
        }
            
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginuser.pending,(state)=>{
            state.status = 'loading';

        })
        .addCase(loginuser.fulfilled,(state,action)=>{
            state.status = 'succeeded';
            state.token = action.payload;
            localStorage.setItem('token',action.payload);
            state.error = null;
        })
        .addCase(loginuser.rejected,(state,action)=>{
            state.status = 'failed';
            state.error = action.payload
        })
    }

})

export const {logout}=userslice.actions
export default userslice.reducer