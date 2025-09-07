import React, {useState, useEffect} from 'react';
import {} from 'react-native';
import axios from 'axios';
import { getSession } from '../services/session';

const ProfileScreenDoctor = ({navigation, route}) =>{
   const [profile, setProfile] = useState({
        fulName: '',
        email: '',
        phone: '',
        Specialization: '',

    });

    const [tempProfile, setTempProfile] = useState({});

    
}