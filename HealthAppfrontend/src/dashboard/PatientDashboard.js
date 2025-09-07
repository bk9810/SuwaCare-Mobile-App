import { LinearGradient } from 'expo-linear-gradient';

import { TouchableOpacity, Text } from 'react-native';

export default function Home({route, navigation}){
    const {user} = route.params || {};



    return (
        <>
           <TouchableOpacity >
        <LinearGradient colors={["#4CAF50", "#22C55E"]} >
          <Text >
            Welcome, {user?.first_name || "Guest"} 👋 {"\n"}
            Comprehensive Digital Health Management, {"\n"}
            Mobile Application for Chronic Disease Patients
          </Text>
        </LinearGradient>
      </TouchableOpacity>
        </>
    )
}

